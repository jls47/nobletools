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
          var compStyles = far[x].style;
          seqObj["width"].push(parseInt(compStyles.width.slice(0, -1)));
          seqObj["left"].push(parseInt(compStyles.left.slice(0, -1)));
          seqObj["height"].push(parseInt(compStyles.height.slice(0, -2)));
          seqObj["color"].push(compStyles.backgroundColor);

        }
      }
    }
  }

  var height = Object.keys(bars).length * 30;

  var body = d3.select("#blocks").append("svg")
                .attr("width", "1000px")
                .attr("height", height.toString())
                .attr("background-color", "lightgrey")
                .attr("xmlns", "http://www.w3.org/2000/svg");
  var x = 0;

  for(var motif in bars){
    var keys = Object.keys(bars).length;
    var liney = 10 + (x * ((height-20)/keys))
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
      .attr("stroke-width",1)
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
  
  var svg = document.getElementsByTagName("svg")[0].outerHTML;
  var svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
  console.log(svgBlob);
  var svgUrl = URL.createObjectURL(svgBlob);
  console.log(svgUrl);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = "default.svg";
  downloadLink.innerHTML = " Right Click => Save As";
  document.getElementById("sites_sec").appendChild(downloadLink);
  
};