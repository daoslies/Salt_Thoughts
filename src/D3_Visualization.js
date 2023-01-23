import * as d3 from 'd3';

import { drag } from 'd3-drag';


let svg = null;

export function createD3Visualization(network, connections, nodes, links) {


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
  // Create the force simulation
  const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width/2, height/2))//.force("center", d3.forceCenter(500, 500));
  
  // Add the links and nodes to the simulation
  //const nodesCopy = [...nodes];
  //console.log(nodesCopy)
  simulation.nodes(nodes).on("tick", ticked);
  /*
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
  */


//simulation.force("link").links(validLinks);
//.attr("class", "links")
console.log('SVG1: ', svg)
/*
const link = svg.append("g")
  .selectAll("line")
  .data(validConnections);
*/
let linkGroup = svg.select("g.links");
if(linkGroup.empty()) {
  linkGroup = svg.append("g")
    .attr("class", "links");
}

const link = linkGroup.selectAll("line")
    .data(connections);

//const link = svg.select(".links").selectAll("line")
//  .data(validConnections);


link.exit().remove();

console.log('SVG2: ', svg)
//link.exit();//.remove();
//svg.remove()
console.log('Link: ', link)

const sigmoid = x => 1 / (1 + Math.exp(-x));


link.enter().append("line")
  .style('stroke', d => d.colour)  
  .style('stroke-opacity', 0.5)
  .attr("stroke-width", d => d.width)
  .attr("class", "connection") // Add a class to the connections
  .merge(link)
  .attr("x1", d => d.source.position.x)
  .attr("y1", d => d.source.position.y)
  .attr("x2", d => d.target.position.x)
  .attr("y2", d => d.target.position.y);

///Colour on mouseover.

//Hold onto the original colour
//validConnections.forEach((con) => {
//  con.originalColor = d3.select(con).attr("stroke");
//});


/*

// Add mouseover and mouseout event handlers to the neurons
network.neural_welcome_list.forEach(neuron => {

  console.log('here', neuron)
  alert('hey')
  neuron.addEventListener("mouseover", function() {
      // When the mouse hovers over a neuron, set the color of all the connections to black
      d3.selectAll(".connection")
          .style("stroke", "black");

      // Get all the connections that are linked to this neuron
      const connectedConnections = validConnections.filter(con => con.source === this.props.neuron.wire || con.target === this.props.neuron.wire);
      // Set the color of the connected connections back to the original color
      d3.selectAll(connectedConnections)
      .attr("stroke", (d) => d.colour)
  
  
  ; })})

*/
  // Create the nodes
  /*
  const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes);

*/

    let nodeGroup = svg.select("g.nodes");
    if(nodeGroup.empty()) {
      nodeGroup = svg.append("g")
        .attr("class", "nodes");
    }
    
    const node = nodeGroup.selectAll("circle")
        .data(nodes);
    

  node.exit().remove();

  console.log('nodes: ', nodes)

  node.enter().append("circle")
    .style("pointer-events", "all")
    .attr("r", 10)
    .attr("fill", d => d.type === 'input' ? '#fbb4ae' : d.type === 'output' ? '#b3cde3' : '#ccebc5')
    /*.call(drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)) */
    
    .merge(node)
    .attr("cx", d => d.position.x)
    .attr("cy", d => d.position.y)
    .on({
      "mouseover": function() { alert('over') },
      "mouseout":  function() { alert('away') }, 
      "click":  function() { alert('clicl') }, 
    })
    

    /*
    .on("mouseover", () => {
      alert('heyhey')
      // When the mouse hovers over a node, set the color of all the connections to black
      d3.selectAll(".connection")
          .style("stroke", "black");
  
      // Get all the connections that are linked to this node
      const connectedConnections = validConnections.filter(con => con.source === this.__data__ || con.target === this.__data__);
      // Set the color of the connected connections back to the original color
      d3.selectAll(connectedConnections)
          .style("stroke", d => d3.interpolateRdYlBu(sigmoid(-((d.weight + d.bias) * 10))));
    }); */


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
  

  const activeLayers = Array.from(new Set(network.neural_welcome_list.map(n => n.props.neuron.layer)));
  console.log(activeLayers);

  let possibleConnections = {};

  for (let i = 0; i < activeLayers.length - 1; i++) {
    const source = activeLayers[i];
    const target = activeLayers[i + 1];
    const key = `${source}-${target}`;
    possibleConnections[key] = { source, target };
  }


  console.log('Possible connects: ', possibleConnections)

  
  for (let [key, connection] of Object.entries(possibleConnections)) {
    
    // Get all the neurons in the source layer
    const sourceNeurons = network.neural_welcome_list.filter(n => n.props.neuron.layer === connection.source);
    // Get all the neurons in the target layer
    const targetNeurons = network.neural_welcome_list.filter(n => n.props.neuron.layer === connection.target);

    // Loop over all the neurons in the source layer
    for (let i = 0; i < sourceNeurons.length; i++) {
      // Loop over all the neurons in the target layer
      for (let j = 0; j < targetNeurons.length; j++) {
        // Create the weight key for this connection
    const weightKey = `${connection.source}-${i}-${connection.target}-${j}`;
    console.log('Connection: ', connection)
    console.log('WeightKeys: ', weightKey)

    if (!network.weights[weightKey]) {
        // Generate a new weight for this connection if it does not exist
        network.setWeightInit(`${connection.source}-${i}`, `${connection.target}-${j}`, network.randomNormal());
    }
    
    if (!network.biases[`${connection.target}-${j}`]) {
      // Generate a new bias for this connection if it does not exist
      network.setBiasInit(`${connection.target}-${j}`, network.randomNormal());   
      /// SHould bias be target or source???
  }

      // If the weight already exists, retrieve it from the network
      const weight = network.weights[weightKey];
      const bias = network.biases[`${connection.target}-${j}`];

      // Find the source and target neurons for this connection
      
      const sourceNeuron = network.neural_welcome_list.find(n => n.props.neuron.id === `${connection.source}-${i}`);
      const targetNeuron = network.neural_welcome_list.find(n => n.props.neuron.id === `${connection.target}-${j}`);

      console.log('Source for weighting: ', sourceNeuron)
      console.log('Target for weighting: ', targetNeuron)
      

      if (sourceNeuron && targetNeuron) {
          // Add the connection data to the connections array

          const sigmoid = x => 1 / (1 + Math.exp(-x));

          connections.push({
              key: weightKey,
              source: sourceNeuron.props.neuron.wire,
              target: targetNeuron.props.neuron.wire,
              weight: weight,
              bias: bias,
              colour: d3.interpolateRdYlBu(sigmoid(-((weight + bias) * 10))),
              width: Math.abs((weight + bias) * 10)
          });

          links.push({
              source: sourceNeuron.props.neuron.wire,
              target: targetNeuron.props.neuron.wire,
          });

          // Add the source and target neurons to the nodes array

          if (!nodes.includes(sourceNeuron.props.neuron.wire)) {
            nodes.push(sourceNeuron.props.neuron.wire)
          }
          if (!nodes.includes(targetNeuron.props.neuron.wire)) {
            nodes.push(targetNeuron.props.neuron.wire)
          }
        }
  }
      }      
  }

    var validConnections = connections.filter(link => {
      if (!link.source || !link.target) {
        return false;
      }

      const sourceInNodes = nodes.some(node => node.layer === link.source.layer && node.index === link.source.index);
      const targetInNodes = nodes.some(node => node.layer === link.target.layer && node.index === link.target.index);
      return sourceInNodes && targetInNodes;
    });

    console.log('Valid Connections: ', validConnections);

  

    // Make sure we have the input and output nodes.
    network.neural_welcome_list.slice(0, network.inputLayers)
    .concat(network.neural_welcome_list.slice(-network.outputLayers)).forEach(img => {

      let neuron = img.props.neuron.wire;

      if (!nodes.includes(neuron)) {
        nodes.push(neuron)
      }
    });
 
    nodes = nodes.filter(n => n !== undefined);

  
  return {validConnections, nodes, links};
}
