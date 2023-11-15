import * as d3 from 'd3';

let svg = null;

export function createD3Visualization(network, connections, nodes, links, graphTime) {

//svg_check prevents an issue where it wasn't rendering connections if you navigated away from and back to the sim.
let svg_check = document.querySelector("#connections-svg"); 


const parentDiv = document.querySelector("#nested-div");
console.log('here')
console.log(parentDiv)
var width = parentDiv.getBoundingClientRect().width;
var height = parentDiv.getBoundingClientRect().height;
  // Create the SVG element that will contain the visualization
  if (!svg_check || !svg) {
    svg = d3.select("#network-viz")
      .append("svg")
      .attr('id', 'connections-svg')
      .attr("width", width * 2)
      .attr("height", height * 1.5)

      //.style("transform", 'scale(0.75)')
      //.style("transformOrigin", 'top left')
    }

  /*
  // Create the force simulation
  const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width/2, height/2))//.force("center", d3.forceCenter(500, 500));
  
  // Add the links and nodes to the simulation
  //const nodesCopy = [...nodes];
  //console.log(nodesCopy)
  simulation.nodes(nodes).on("tick", ticked);

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

//console.log('SVG2: ', svg)
//link.exit();//.remove();
//svg.remove()
//console.log('Link: ', link)

//const sigmoid = x => 1 / (1 + Math.exp(-x));

const y_correction = 25;


link.enter().append("line")
  .style('stroke', d => d.colour)  
  .style('stroke-opacity', 0.5)
  .attr("stroke-width", d => d.width)
  .attr("class", "connection") // Add a class to the connections
  .merge(link)
  .attr("x1", d => d.source.position.x)
  .attr("y1", d => d.source.position.y + y_correction) // Mild correction of 25 may need to be propogated elsewhere
  .attr("x2", d => d.target.position.x)
  .attr("y2", d => d.target.position.y + y_correction);

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

  // colouringg based on the graph

  if (graphTime) {

  const classLabels = ['setosa', 'versicolor', 'virginica'];
  const outputNeuronIds = ['11-0', '11-1', '11-2'];
  const colorScale = d3.scaleOrdinal()
    .domain(classLabels)
    .range(['#FF1F9F', '#39FFFF', '#FF8900']); 
  
  node.enter().append("circle")
  .style("pointer-events", "all")
  .attr("r", 33)
  .attr("fill", d => {
    if (d.neuron_type === 'input') {
      return '#fbb4ae';
    } else if (d.neuron_type === 'output') {
      const neuronIdParts = d.neuron_id.split('-');
      const outputLayerIndex = parseInt(neuronIdParts[0]) - 1;
      const outputNeuronIndex = parseInt(neuronIdParts[1]);
      const correspondingClassLabel = classLabels[outputNeuronIndex];
      return colorScale(correspondingClassLabel);
    } else {
      return '#000000';
    }})
    .attr("opacity", d => {
      if (d.neuron_type === "output" && outputNeuronIds.includes(d.neuron_id)) {
        return 1;
      } else {
        return 0;
      }
    })
    .merge(node)
    .attr("cx", d => d.position.x - 2)
    .attr("cy", d => d.position.y + y_correction - 2);  // Mild correction of 25 may need to be propogated elsewhere

    node.append("title")
    .text(d => d.id);

  }
  /*
  
  node.enter().append("circle")
    .style("pointer-events", "all")
    .attr("r", 50)
    .attr("fill", d => d.neuron_type === 'input' ? '#fbb4ae' : d.neuron_type === 'output' ? '#b3cde3' : '#ccebc5')    
    .merge(node)
    .attr("cx", d => d.position.x)
    .attr("cy", d => d.position.y)
    .on({
      "mouseover": function() { alert('over') },
      "mouseout":  function() { alert('away') }, 
      "click":  function() { alert('clicl') }, 
    })
    */

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

  /*

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

*/

/*

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
  */
}


    
      

export function generateVisualizationData(network) {
  const connections = [];
  var nodes = [];
  const links = [];
  //alert('a')
  
  

  const activeLayers = Array.from(new Set(network.neural_welcome_list.map(n => n.props.neuron.layer)));
  //console.log(activeLayers);

  let possibleConnections = {};

  for (let i = 0; i < activeLayers.length - 1; i++) {
    const source = activeLayers[i];
    const target = activeLayers[i + 1];
    const key = `${source}-${target}`;
    possibleConnections[key] = { source, target };
  }


  //console.log('Possible connects: ', possibleConnections)

  
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
    //console.log('Connection: ', connection)
    
    //console.log('WeightKeys: ', weightKey)

    if (!network.weights[weightKey]) {
        // Generate a new weight for this connection if it does not exist
        network.setWeightInit(`${connection.source}-${i}`, `${connection.target}-${j}`, network.randomNormal());
    }




    /////// DOING A TEST we are swapping biases from targets to source  (+ again b-low)
    // I,e, `${connection.target}-${j}` -- > `${connection.source}-${j}`
    
    if (!network.biases[`${connection.target}-${i}`]) {
      // Generate a new bias for this connection if it does not exist
      network.setBiasInit(`${connection.target}-${i}`, network.randomNormalBias());   
      /// SHould bias be target or source???
  }


      /// doing a test swapping bias target 2 source `${connection.source}-${j}`

      // If the weight already exists, retrieve it from the network
      const weight = network.weights[weightKey];
      const bias = network.biases[`${connection.target}-${i}`];

      // Find the source and target neurons for this connection
      
      const sourceNeuron = network.neural_welcome_list.find(n => n.props.neuron.id === `${connection.source}-${i}`);
      const targetNeuron = network.neural_welcome_list.find(n => n.props.neuron.id === `${connection.target}-${j}`);

      //console.log('Source for weighting: ', sourceNeuron)
      //console.log('Target for weighting: ', targetNeuron)
      

      if (sourceNeuron && targetNeuron) {

          // Initialize the connections property for the source neuron if it doesn't exist
          if (!sourceNeuron.props.neuron.connections) {
            sourceNeuron.props.neuron.connections = [];
          }

          // Initialize the connections property for the target neuron if it doesn't exist
          if (!targetNeuron.props.neuron.connections) {
            targetNeuron.props.neuron.connections = [];
          }


        // Check if the connection already exists
        const sourceExists = sourceNeuron.props.neuron.connections.some(c => c.targetNeuronId === targetNeuron.props.neuron.id);
        const targetExists = targetNeuron.props.neuron.connections.some(c => c.sourceNeuronId === sourceNeuron.props.neuron.id);

        // If the connection doesn't exist, add it
        if (!sourceExists) {
          sourceNeuron.props.neuron.connections.push({
            targetNeuronId: targetNeuron.props.neuron.id,
            weight: weight,
            bias: bias
          });
        }

        if (!targetExists) {
          targetNeuron.props.neuron.connections.push({
            sourceNeuronId: sourceNeuron.props.neuron.id,
            weight: weight,
            bias: bias
          });
        }
          // Add the connection data to the connections array

          const sigmoid = x => 1 / (1 + Math.exp(-x));

          const colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateRdYlBu)
            .domain([-2, 2]); // assumes weight and bias values are normalized between -1 and 1

          const widthScale = d3.scaleLinear()
            //.range([0.001, 1]) // set the range of line widths
            .domain([0, 2]); // assumes weight and bias values are normalized between -1 and 1

          const color = colorScale(weight * 2)    // colorScale(-(weight + bias));
          const width = widthScale(bias * 10)    //widthScale(Math.abs(weight) + Math.abs(bias));


          connections.push({
              key: weightKey,
              source: sourceNeuron.props.neuron.wire,
              target: targetNeuron.props.neuron.wire,
              weight: weight,
              bias: bias,
              colour: color,  //d3.interpolateRdYlBu(-sigmoid((weight*5 + bias))),
              width: width   //sigmoid(weight*5+bias) * 10 //* (bias * 10) //((weight + bias) **2) * 10  // ((sigmoid((weight + bias) * 10) + 0.1 ) **0.9) * 20 //sigmoid((weight*5+bias) * 10) * (bias * 10)  ////
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
 
    //console.log('Valid Connections: ', validConnections);

  

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
