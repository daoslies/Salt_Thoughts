import React, { useRef } from 'react';
import * as d3 from 'd3';

function NeuronGraph({ weight, bias, neuronID }) {
  const svgRef = useRef(null);

  const margin = { top: 20, right: 20, bottom: 30, left: 45 };
  const width = 300 - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom;

  const xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);

  const sigmoid = x => (1 / (1 + Math.exp(-x)));

  const data = d3.range(0, 1, 0.01).map(x => [x, sigmoid( (10 * weight * x) +  ( weight * ((bias * 0.5)-0.5)) - (5 * weight * weight)  )]);


  // NExt task is colour all this by neuron id.


  // the * 10 and * 2 are what is happening in the neuron activation.

  const line = d3.line()
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]));

  const svg = d3.select(svgRef.current)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


    // Create color scales
  const layerColorScale = d3.scaleLinear()  
  .domain([-1,8])
  .range(["blue", "red"]);

  const indexColorScale = d3.scaleLinear()
  .domain([0,4]) 
  .range(["lightgray", "black"]);

  // Get layer and index 


  var [layer, index] = neuronID.split("-");

  console.log('Colour stuff: ', layer, index)

  // Get colors
  if (layer == 'i') {layer = 1}
  else (layer += 1 );

  const layerColor = layerColorScale(layer); 
  const indexColor = indexColorScale(index);

  console.log(layerColor, indexColor)

  // Combine them 


var colour = `hsl(${ (180 * layer)/8},100%,${50 + (((100 * index) / 5) * 0.5) }%)`

console.log(colour)

  svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line)
    .style("stroke-width", 4)
    .attr("stroke", colour)
    .attr("fill", "none");

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  svg.append("g")
    .call(d3.axisLeft(yScale));

  return (
    <svg ref={svgRef}></svg>
  );
}

export default NeuronGraph;
