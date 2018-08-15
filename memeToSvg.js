//If I want to parse the CSS I need to add another layer on or parse the computed styles somehow.  Figure it out.
//rows[4].children[3]

//this is for the meme output in particular
var makeTheSVG = function(){
	var names = document.getElementsByClassName("blockdiag_name");
	var bars = {};
	for(var i = 0; i < names.length; i++){
		var pvalue = names[i].nextSibling;
		bars[names[i].innerHTML] = {"pvalue": pvalue.innerHTML};
		var further = pvalue.nextSibling.children;
		// since you only use further once, I'm on the fence about making it a variable.
		var far = further[0].children;
		var seqObj = bars[names[i].innerHTML]
		// I would lift bars[names[i].innerHTML] out into a variable during each loop iteration.
		// Slightly easier to read.
		seqObj["width"] = [];
		seqObj["left"] = [];
		seqObj["height"] = [];
		seqObj["color"] = [];
		for(var x = 0; x < far.length; x++){
			if((far[x].getAttribute("style") != null) && (far[x].getAttribute("class").includes("scanned"))){
				if(far[x].getAttribute("style").includes("rgb")){
					// In a case like this, where you have an if(condition1){ squid = 1; } else{ squid = 2; }
					// I like to use the ternary operator: var squid = condition1 ? 1 : 2;
					// Personally, I think it's easier to read and debug and harder to forget to assign,
					// but opinions are divided because it's easy to get carried away.
					if(far[x].getAttribute("class").includes("top")){
						seqObj["pn"] = "+";
					}else{
						seqObj["pn"] = "-";
					}
					
					seqObj["width"].push(far[x].attributeStyleMap.get("width").value);
					seqObj["left"].push(far[x].attributeStyleMap.get("left").value);
					seqObj["height"].push(far[x].attributeStyleMap.get("height").value);
					seqObj["color"].push(far[x].style.backgroundColor);

				}
			}
		}
	}


	var body = d3.select("body").append("svg")
								.attr("width", "1000px")
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
			.attr("x", 80)
			.attr("y", liney)
			.attr("dy", ".35em")
			.text(bars[motif]["pvalue"]);

		body.append("text")
			.attr("x", 140)
			.attr("y", liney - 7)
			.attr("dy", ".35em")
			.text("+");

		body.append("text")
			.attr("x", 140)
			.attr("y", liney + 7)
			.attr("dy", ".35em")
			.text("-");

		body.append("line")
			.attr("x1", 150)
			.attr("x2", 1000)
			.attr("y1", liney)
			.attr("y2", liney)
			.attr("stroke-width",3)
			.attr("stroke","black");

		for(var i = 0; i < bars[motif]["width"].length; i++){
			console.log(bars[motif]["width"][i]);
			if(bars[motif]["pn"] == "+"){	
				body.append("rect")
					.attr("x", ((bars[motif]["left"][i])*8.5) + 150)
					.attr("y", liney - bars[motif]["height"][i])
					.attr("width", (bars[motif]["width"][i]) * 8.5) 
					.attr("height", bars[motif]["height"][i])
					.attr("fill", bars[motif]["color"][i]);
			}else{
				body.append("rect")
					.attr("x", ((bars[motif]["left"][i])*8.5) + 150)
					.attr("y", liney)
					.attr("width", (bars[motif]["width"][i]) * 8.5) 
					.attr("height", bars[motif]["height"][i])
					.attr("fill", bars[motif]["color"][i]);
			}
		}
	}

}


var exportTheSVG = function(){
	var svg = document.getElementById("blocks_scroll");

	var serializer = new XMLSerializer();
	var source = serializer.serializeToString(svg);
	console.log(source);
}
