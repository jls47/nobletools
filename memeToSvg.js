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
		var far = further[0].children;
		bars[names[i].innerHTML]["width"] = [];
		bars[names[i].innerHTML]["left"] = [];
		for(var x = 0; x < far.length; x++){
			if((far[x].getAttribute("style") != null) && (far[x].getAttribute("class").includes("scanned"))){
				if(far[x].getAttribute("style").includes("rgb")){
					if(far[x].getAttribute("class").includes("top")){
						bars[names[i].innerHTML]["pn"] = "+";
					}else{
						bars[names[i].innerHTML]["pn"] = "-";
					}
					bars[names[i].innerHTML]["width"] += far[x].attributeStyleMap.get("width").value + " ";
					bars[names[i].innerHTML]["left"] += far[x].attributeStyleMap.get("left").value + " ";
					bars[names[i].innerHTML]["height"] += far[x].attributeStyleMap.get("height").value + " ";
					bars[names[i].innerHTML]["color"] += far[x].style.backgroundColor + "/";

				}
			}
		}
		bars[names[i].innerHTML]["color"] = bars[names[i].innerHTML]["color"].replace("undefined", "");
		bars[names[i].innerHTML]["height"] = bars[names[i].innerHTML]["height"].replace("undefined", "");
		bars[names[i].innerHTML]["width"] = bars[names[i].innerHTML]["width"].split(" ");
		bars[names[i].innerHTML]["left"] = bars[names[i].innerHTML]["left"].split(" ");
		bars[names[i].innerHTML]["height"] = bars[names[i].innerHTML]["height"].split(" ");
		bars[names[i].innerHTML]["color"] = bars[names[i].innerHTML]["color"].split("/");
		bars[names[i].innerHTML]["width"].pop();
		bars[names[i].innerHTML]["height"].pop();
		bars[names[i].innerHTML]["left"].pop();
		bars[names[i].innerHTML]["color"].pop();
	}


	var body = d3.select("body");
	var div = body.append("div");
	div.attr("id", "svg")
		.style("width", "1000px")
		.style("height", "700px")
		.style("background", "lightgrey");

}


var exportTheSVG = function(){
	var svg = document.getElementById("blocks_scroll");

	var serializer = new XMLSerializer();
	var source = serializer.serializeToString(svg);
	console.log(source);
}

