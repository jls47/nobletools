//If I want to parse the CSS I need to add another layer on or parse the computed styles somehow.  Figure it out.
//rows[4].children[3]

//this is for the mast output in particular
var makeTheSVG = function(){
	var names = document.getElementsByTagName("tbody");
	var bodies = [].slice.call(names);
	var bars = {};
	bodies.splice(0, 2);
	for(var i=0; i<6; i++){
		bodies.pop();
	}
	for(var item in bodies){
		let body = bodies[item].children[0];

		let name = body.children[0].innerText;

		let startStop = [body.children[1].innerText, body.children[2].innerText];

		let pvalue = body.children[3].innerText;

		bars[name] = {"pvalue": pvalue};
		bars[name]["startStop"] = startStop;
		bars[name]["width"] = [];
		bars[name]["left"] = [];
		bars[name]["height"] = [];
		bars[name]["color"] = [];
		bars[name]["pn"] = [];
		let far = body.children[5].children[0].children;
		console.log(far);
		for(var x = 0; x < far.length; x++){
			if((far[x].getAttribute("style") != null) && (far[x].getAttribute("class").includes("motif"))){
				if(far[x].getAttribute("style").includes("rgb")){

					if(far[x].getAttribute("class").includes("top")){
						bars[name]["pn"].push("+");
					}else{
						bars[name]["pn"].push("-");
					}
					bars[name]["width"].push(far[x].attributeStyleMap.get("width").value);
					bars[name]["left"].push(far[x].attributeStyleMap.get("left").value);
					bars[name]["height"].push(far[x].attributeStyleMap.get("height").value);
					bars[name]["color"].push(far[x].style.backgroundColor);

				}
			}
		}
		console.log(name + ' ' + pvalue);


	}
	console.dir(bars);
	


	var body = d3.select("body").append("svg")
								.attr("width", "1200px")
								.attr("height", "700px")
								.attr("background-color", "lightgrey");
	var x = 0;

	for(var motif in bars){
		var keys = Object.keys(bars).length;
		var liney = 10 + (x * (680/keys))
		x += 1;
		console.log(x);

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
			.attr("stroke-width",3)
			.attr("stroke","black");

		for(var i = 0; i < bars[motif]["width"].length; i++){
			console.log(bars[motif]["width"][i]);
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
