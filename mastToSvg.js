	//If I want to parse the CSS I need to add another layer on or parse the computed styles somehow.  Figure it out.
	//rows[4].children[3]

	//this is for the mast output in particular

	//TO DO: Make the side of the graph more legible

	var makeTheSVG = function(){
		var names = document.getElementsByTagName("tbody");
		var bodies = [].slice.call(names);
		var bars = {};
		bodies.splice(0, 2);
		for(var i=0; i<4; i++){
			bodies.pop();
		}

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


		for(var item in bodies){
			var body = bodies[item].children[0];

			var name = body.children[0].children[0].children[0].text;

			var pvalue = body.children[1].innerText;

			bars[name] = {"pvalue": pvalue};
			bars[name]["width"] = [];
			bars[name]["left"] = [];
			bars[name]["height"] = [];
			bars[name]["color"] = [];
			var far = body.children[3].children[0].children;
			for(var x = 0; x < far.length; x++){
				if((far[x].getAttribute("style") != null) && (far[x].getAttribute("class").includes("motif"))){
					if(far[x].getAttribute("style").includes("rgb")){
						var compStyles = far[x].style;
						bars[name]["width"].push(parseInt(compStyles.width.slice(0, -1)));
          				bars[name]["left"].push(parseInt(compStyles.left.slice(0, -1)));
          				bars[name]["height"].push(parseInt(compStyles.height.slice(0, -2)));
          				bars[name]["color"].push(compStyles.backgroundColor);
					}
				}
			}


		}
		var ticLine = document.getElementsByClassName("block_container")[0].children;
		var ticItems = [].slice.call(ticLine);
		var tics = {labels: {}, minor: [], major: []};

		for(var item in ticItems){
			if(ticItems[item].className == "tic_major"){
				tics.major.push(parseFloat(ticItems[item].style.left.replace("%", "")) / 100);
			}else if(ticItems[item].className == "tic_minor"){
				tics.minor.push(parseFloat(ticItems[item].style.left.replace("%", "")) / 100);
			}else{
				tics.labels[ticItems[item].innerText] = parseFloat(ticItems[item].style.left.replace("%", "")) / 100;
			}
		}

		console.dir(tics);
		


		var height = Object.keys(bars).length * 30;

  		var body = d3.select(".pad").append("svg")
                .attr("width", "1200px")
                .attr("height", height.toString())
                .attr("background-color", "lightgrey")
                .attr("xmlns", "http://www.w3.org/2000/svg");

		var x = 0;


		var y = 0;
		var legLen = Object.keys(legend).length;
		var xdist = 1300 / (legLen);

		for(var tic in tics.labels){
			body.append("text")
				.attr("x", 145 + (980 * tics.labels[tic]))
				.attr("y", height - 90)
				.attr("dy", ".35em")
				.text(tic);
		}

		for(var tic in tics.minor){
			console.log(tics.minor[tic])
			body.append("line")
				.attr("x1", 150 + (980 * tics.minor[tic]))
				.attr("x2", 150 + (980 * tics.minor[tic]))
				.attr("y1", height - 100)
				.attr("y2", height - 97)
				.attr("stroke-width",0.5)
				.attr("stroke", "black");

		}

		for(var tic in tics.major){
			body.append("line")
				.attr("x1", 150 + (980 * tics.major[tic]))
				.attr("x2", 150 + (980 * tics.major[tic]))
				.attr("y1", height - 105)
				.attr("y2", height - 100)
				.attr("stroke-width", 1)
				.attr("stroke", "black");
		}

		for(var item in legend){
			y += 1;
			body.append("rect")
				.attr("x", (xdist * (y * 0.75)))
				.attr("y", height - 50)
				.attr("width", 20) 
				.attr("height", 20)
				.attr("fill", legend[item]);
			if(y % 2 == 0){
				body.append("text")
					.attr("x", (xdist * (y * 0.75)) - 100)
					.attr("y", height - 20)
					.attr("dy", ".35em")
					.text(item);
			}else{
				body.append("text")
					.attr("x", (xdist * (y * 0.75)) - 100)
					.attr("y", height - 60)
					.attr("dy", ".35em")
					.text(item);
			}

		}

		for(var motif in bars){
			var keys = Object.keys(bars).length;
			var liney = 10 + (x * (880/keys))
			x += 1;
			console.log(x);

			body.append("text")
				.attr("x", 5)
				.attr("y", liney)
				.attr("dy", ".35em")
				.text(motif);

			body.append("text")
				.attr("x", 95)
				.attr("y", liney)
				.attr("dy", ".35em")
				.text(bars[motif]["pvalue"]);

			body.append("text")
				.attr("x", 140)
				.attr("y", liney - 5)
				.attr("dy", ".35em")
				.text("+");

			body.append("text")
				.attr("x", 140)
				.attr("y", liney + 5)
				.attr("dy", ".35em")
				.text("-");

			body.append("line")
				.attr("x1", 150)
				.attr("x2", 1200)
				.attr("y1", liney)
				.attr("y2", liney)
				.attr("stroke-width",1)
				.attr("stroke","black");

			for(var i = 0; i < bars[motif]["width"].length; i++){
				console.log(bars[motif]["width"][i]);

				body.append("rect")
					.attr("x", ((bars[motif]["left"][i])*10.5) + 150)
					.attr("y", liney - bars[motif]["height"][i])
					.attr("width", (bars[motif]["width"][i]) * 8.5) 
					.attr("height", bars[motif]["height"][i])
					.attr("fill", bars[motif]["color"][i]);
			
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
