//If I want to parse the CSS I need to add another layer on or parse the computed styles somehow.  Figure it out.
//rows[4].children[3]

//this is for the mast output in particular

//TO DO: Make the legend


var makeTheSVG = function(){
	//grabbing the legend information
	var boxes = document.getElementsByClassName("legend_entry");
	var items = [];
	for(var i = 0; i < boxes.length/2; i++){
		items.push(boxes[i]);
	}
	legend = {};
	var name, color;
	for(var i = 0; i < items.length; i++){
		name = items[i].children[1].innerText;
		color = items[i].children[0].style.backgroundColor;
		legend[name] = color;
	}

	var names = document.getElementsByTagName("tbody");
	var bodies = [].slice.call(names);
	var bars = {};
	bodies.splice(0, 2);
	for(var i=0; i<5; i++){
		bodies.pop();
	}
	for(var item in bodies){
		var body = bodies[item].children[0];

		var name = body.children[0].innerText;

		var startStop = [body.children[1].innerText, body.children[2].innerText];

		var pvalue = body.children[3].innerText;

		bars[name] = {"pvalue": pvalue};
		bars[name]["startStop"] = startStop;
		bars[name]["width"] = [];
		bars[name]["left"] = [];
		bars[name]["height"] = [];
		bars[name]["color"] = [];
		bars[name]["pn"] = [];
		var far = body.children[5].children[0].children;
		console.log(far);
		for(var x = 0; x < far.length; x++){
			if((far[x].getAttribute("style") != null) && (far[x].getAttribute("class").includes("motif"))){
				if(far[x].getAttribute("style").includes("rgb")){

					if(far[x].getAttribute("class").includes("top")){
						bars[name]["pn"].push("+");
					}else{
						bars[name]["pn"].push("-");
					}
					var compStyles = far[x].style;

					bars[name]["width"].push(parseInt(compStyles.width.slice(0, -1)));
					bars[name]["left"].push(parseInt(compStyles.left.slice(0, -1)));
					bars[name]["height"].push(parseInt(compStyles.height.slice(0, -2)));
					bars[name]["color"].push(compStyles.backgroundColor);

				}
			}
		}
		console.log(name + ' ' + pvalue);


	}
	console.dir(bars);
	var width = "1200px";
	var height = (Object.keys(bars).length * 40) + 200;

  	var body = d3.select("body").append("svg")
            	.attr("width", "1000px")
                .attr("height", height.toString())
                .attr("background-color", "lightgrey")
                .attr("xmlns", "http://www.w3.org/2000/svg");

	var x = 0;
	var y = 0;
	var legLen = Object.keys(legend).length;
	var xdist = 1200 / (legLen);

	for(var item in legend){
		console.log(item + " " + y);
		y += 1;
		console.log(x)
		body.append("rect")
			.attr("x", (xdist * (y * 0.75)))
			.attr("y", height - 50)
			.attr("width", 20) 
			.attr("height", 20)
			.attr("fill", legend[item]);
		if(y % 2 == 0){
			body.append("text")
				.attr("x", (xdist * (y * 0.75)) - 20)
				.attr("y", height - 20)
				.attr("dy", ".35em")
				.text(item);
		}else{
			body.append("text")
				.attr("x", (xdist * (y * 0.75)) - 20)
				.attr("y", height - 60)
				.attr("dy", ".35em")
				.text(item);
		}

	}



	var keys = Object.keys(bars).length;
	for(var motif in bars){
		
		var liney = 10 + (x * ((height-100)/keys))
		x += 1;

		body.append("text")
			.attr("x", 5)
			.attr("y", liney)
			.attr("dy", ".35em")
			.text(motif);

		body.append("text")
			.attr("x", 50)
			.attr("y", liney)
			.attr("dy", ".35em")
			.text(bars[motif]["pvalue"]);

		body.append("text")
			.attr("x", 100)
			.attr("y", liney)
			.attr("dy", ".35em")
			.text(bars[motif]["startStop"][0] + " to " + bars[motif]["startStop"][1])

		body.append("text")
			.attr("x", 270)
			.attr("y", liney - 7)
			.attr("dy", ".35em")
			.text("+");

		body.append("text")
			.attr("x", 270)
			.attr("y", liney + 7)
			.attr("dy", ".35em")
			.text("-");

		body.append("line")
			.attr("x1", 280)
			.attr("x2", 1200)
			.attr("y1", liney)
			.attr("y2", liney)
			.attr("stroke-width",1)
			.attr("stroke","black");

		for(var i = 0; i < bars[motif]["width"].length; i++){

			if(bars[motif]["pn"][i] == "+"){	
				body.append("rect")
					.attr("x", ((bars[motif]["left"][i])*8.5) + 280)
					.attr("y", liney - bars[motif]["height"][i])
					.attr("width", (bars[motif]["width"][i]) * 8.5) 
					.attr("height", bars[motif]["height"][i])
					.attr("fill", bars[motif]["color"][i]);
			}else{
				body.append("rect")
					.attr("x", ((bars[motif]["left"][i])*8.5) + 280)
					.attr("y", liney)
					.attr("width", (bars[motif]["width"][i]) * 8.5) 
					.attr("height", bars[motif]["height"][i])
					.attr("fill", bars[motif]["color"][i]);
			}
		}
	}

}


var exportTheSVG = function(){
	var svg = document.getElementsByTagName("svg")[0].outerHTML;
	var svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
	console.log(svgBlob);
	var svgUrl = URL.createObjectURL(svgBlob);
	var downloadLink = document.createElement("a");
	downloadLink.href = svgUrl;
	downloadLink.download = "newesttree.svg";
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
};
