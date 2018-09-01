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
			console.log(far);
			for(var x = 0; x < far.length; x++){
				if((far[x].getAttribute("style") != null) && (far[x].getAttribute("class").includes("motif"))){
					if(far[x].getAttribute("style").includes("rgb")){
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
									.attr("height", "900px")
									.attr("background-color", "lightgrey");
		var x = 0;

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
				.attr("stroke-width",2)
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
