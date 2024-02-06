import * as d3 from 'd3';


function graphing(network) {

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// clean up from last time
var svg = d3.select('#Data_Graph').selectAll("*");
svg.remove()

// append the svg object to the body of the page
svg = d3.select("#Data_Graph")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform",
          "translate(" + 0 + "," + 200 + ")")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data

var data = network.irisData;

console.log('IRIS DATA: ', network.irisData)
console.log('Iris Data just the network: ', network)

  // Add X axis
  var x = d3.scaleLinear()
    .domain([4, 8])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([1.5, 4.5])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.sepalLength); } )
      .attr("cy", function (d) { return y(d.sepalWidth); } )
      .attr("r", 5.5)
      .style("fill", d => {
        console.log("Iris Data SPECIES:", d.species);  // Log species value
        console.log('IRis Data is it a stetosa? "Iris-setosa"', d.species === "Iris-setosa" ? 'YES' : "No")
        return d.species === "Iris-setosa" ? '#FF1F9F' :
              d.species === "Iris-versicolor" ? '#39FFFF' :
              d.species === "Iris-virginica" ? '#FF8900' : '#000000';})

      svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d.sepalLength); } )
        .attr("cy", function (d) { return y(d.sepalWidth); } )
        .attr("r", 4)
        .style("fill", d => 
        d.prediction === 0 ? '#FF1F9F' : 
        d.prediction === 1 ? '#39FFFF' : 
        d.prediction === 2 ? '#FF8900' : '#000000')
  

    }

  export default graphing;