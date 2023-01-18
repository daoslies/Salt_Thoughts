import * as d3 from 'd3';

import { drag } from 'd3-drag';


let svg = null;

export function createD3Visualization(connections, nodes, links) {


console.log('Connections: ', connections)
console.log('Nodes: ', nodes)
console.log('Links:  ', links)

const parentDiv = document.querySelector("#buttons");
var width = parentDiv.getBoundingClientRect().width;
var height = parentDiv.getBoundingClientRect().height;
  // Create the SVG element that will contain the visualization
  if (!svg) {
    svg = d3.select("#network-viz")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  }
  //width = d3.select("#network-viz").node().getBoundingClientRect().width
  //height = d3.select("#network-viz").node().getBoundingClientRect().height
  
  // Create the force simulation
  const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width/2, height/2))//.force("center", d3.forceCenter(500, 500));
  
  // Add the links and nodes to the simulation
  //const nodesCopy = [...nodes];
  //console.log(nodesCopy)
  simulation.nodes(nodes).on("tick", ticked);
  
  //simulation.nodes(nodes).on("tick", ticked);
  var validLinks = links.filter(link => {
    if (!link.source || !link.target) {
      return false;
    }
  
    const sourceInNodes = nodes.some(node => node.layer === link.source.layer && node.index === link.source.index);
    const targetInNodes = nodes.some(node => node.layer === link.target.layer && node.index === link.target.index);
    return sourceInNodes && targetInNodes;
  });
  
  console.log('Valid links: ', validLinks);
  //validLinks = validLinks.filter(link => link.target);
  //console.log('Valid links with target: ', validLinks);
  
  var validConnections = connections.filter(link => {
    if (!link.source || !link.target) {
      return false;
    }
  
    const sourceInNodes = nodes.some(node => node.layer === link.source.layer && node.index === link.source.index);
    const targetInNodes = nodes.some(node => node.layer === link.target.layer && node.index === link.target.index);
    return sourceInNodes && targetInNodes;
  });
  
  console.log('Valid Connections: ', validConnections);

//simulation.force("link").links(validLinks);

const link = svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(validConnections);

link.exit().remove();

link.enter().append("line")
  .style('stroke', 'black')
  .style('stroke-opacity', 0.5)
  .attr("stroke-width", d => d.weight * 10)
  .merge(link)
  .attr("x1", d => d.source.position.x)
  .attr("y1", d => d.source.position.y)
  .attr("x2", d => d.target.position.x)
  .attr("y2", d => d.target.position.y);



  // Create the nodes
  const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes);

  node.exit().remove();

  node.enter().append("circle")
    .attr("r", 10)
    .attr("fill", d => d.type === 'input' ? '#fbb4ae' : d.type === 'output' ? '#b3cde3' : '#ccebc5')
    .call(drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
    .merge(node)
    .attr("cx", d => d.position.x)
    .attr("cy", d => d.position.y);


  // Add labels to the nodes
  node.append("title")
      .text(d => d.id);

  // Create the ticked function
function ticked() {
    link
        .attr("x1", d => d.source.position.x)
        .attr("y1", d => d.source.position.y)
        .attr("x2", d => d.target.position.x)
        .attr("y2", d => d.target.position.y);

    node
        .attr("cx", d => d.position.x)
        .attr("cy", d => d.position.y);
}


  function dragstarted(d) {
    if (!d.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragended(d) {
    if (!d.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

export function generateVisualizationData(network) {
  const connections = [];
  var nodes = [];
  const links = [];
  //alert('a')
  console.log(network)
  for (let key in network.weights) {
    
      const [sourceLayer, sourceNeuron, targetLayer, targetNeuron] = key.split("-");
      
      var source = network.neural_welcome_list.find(n => n.props.neuron.layer === parseInt(sourceLayer) && n.props.neuron.index === parseInt(sourceNeuron));//.find(n => n.index === parseInt(sourceNeuron));
      
      var target = network.neural_welcome_list.find(n => n.props.neuron.layer === parseInt(targetLayer) && n.props.neuron.index === parseInt(targetNeuron)); //.find(n => n.index === parseInt(targetNeuron));
    
      /*console.log(sourceLayer, sourceNeuron)
      console.log(targetLayer, targetNeuron)
      network.neural_welcome_list.forEach(n => {
        const neuron = n.props.neuron;
        console.log(neuron.layer, neuron.index);
      }); */
      
      if (source && target) {

        source = source.props.neuron.wire;
        target = target.props.neuron.wire;
        
        const weight = network.weights[key];
        const bias = network.biases[key];

      connections.push({
          key: key,
          source: source,
          target: target,
          weight: weight,
          bias: bias,
      });
      links.push({
          source: source,
          target: target,
      });
    
      if (!nodes.includes(source)) {
          nodes.push(source);
      }
      if (!nodes.includes(target)) {
          nodes.push(target);
      }
    }
     nodes = nodes.filter(n => n !== undefined);

  }
  return {connections, nodes, links};
}
