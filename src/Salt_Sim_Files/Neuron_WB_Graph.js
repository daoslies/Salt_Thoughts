import React, { useRef } from 'react';
import * as d3 from 'd3';

function NeuronGraph({ weight, bias }) {
  const svgRef = useRef(null);

  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 250 - margin.left - margin.right;
  const height = 100 - margin.top - margin.bottom;

  const xScale = d3.scaleLinear()
    .domain([-10, 10])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);

  const sigmoid = x => (1 / (1 + Math.exp(-x)));

  const data = d3.range(-10, 10, 0.01).map(d => [d, sigmoid(weight * d + bias)]);

  const line = d3.line()
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]));

  const svg = d3.select(svgRef.current)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


  svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line)
    .style("stroke-width", 4)
    .attr("stroke", "red")
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
