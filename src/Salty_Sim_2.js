




import './App.css';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useCallback } from 'react';

import { createElement } from 'react';

import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client'

//This means that the information contained in the embedding will be a compromise between the detailed information in the input and output data, and the more abstract and general representation of the relationship between the input and output data that is learned by the model.


import ToggleSwitch from './ToggleSwitch';

import { createD3Visualization, generateVisualizationData } from './D3_Visualization';


import Salt from './Salt';
import Neuron from './Neuron';

//import * as d3 from 'd3';

import Matter, { Events } from 'matter-js';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { useSlider } from '@mui/base';
import { dividerClasses } from '@mui/material';

Matter.Common.setDecomp(require('poly-decomp'))







// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Mouse = Matter.Mouse;

var engine;


engine = Engine.create(); 
engine.world.gravity.scale = 0;

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine
});     

var mouse_area = document.getElementById('buttons')

 // add mouse control
 var mouse = Mouse.create(mouse_area);

 Events.on(engine, 'afterUpdate', function() {
    
  
     if (!mouse.position.x) {
       return;
     }
 });
 





Events.on(engine, 'beforeUpdate', function() {
    var bodies = Composite.allBodies(engine.world);

    

    var target_x =  mouse.position.x;
    var target_y =  mouse.position.y;


    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];
        

        if (body.isStatic || body.isSleeping)
                {
                
                }
            
            else
                {
                    // Check Collisions

                    network.neural_welcome_list.forEach(neuron =>{

                      //console.log('Air friction: ', neuron)

                    if (Matter.Collision.collides(body, neuron.props.neuron.wire) != null) {
                        body.frictionAir = 3;

                    }
                    else {body.frictionAir = 0.1 }})




                var body_x = body.position.x;
                var body_y = body.position.y;
                
                var distance = Math.sqrt(Math.pow((body_x - target_x),2) + Math.pow((body_y - target_y),2))
                
                var direction_x = body_x - target_x;
                var direction_y = body_y - target_y;

                var force_x = direction_x * Math.min(0.5, (1/(distance**2))) * 0.5;
                var force_y = direction_y * Math.min(0.5, (1/(distance**2))) * 0.5;

                body.force.x -= force_x;
                body.force.y -= force_y;
                
                //body.force.y += body.mass * 0.001;
                
                }
    }
});

/*
class Salt {

  constructor(name, outputSaltCountCallback, initialNeuron) {

    this.name = name;
    

    this.outputSaltCountCallback = outputSaltCountCallback;

    this.initNeuron = initialNeuron;
    this.currentNeuron = null; 
    this.previousNeuron = null; 

    this.position_x = this.initNeuron.wire.position.x - 75;
    this.position_y = this.initNeuron.wire.position.y;

    this.htmlID = this.name + 'ID'
    var num = Math.floor( Math.random() * 5);
    this.img = ImageArray[num];

    this.saltStyle = {
      position: "absolute",
      height: '20px',
      width: '20px',
      left: this.position_x + "px",
      top: this.position_y + "px",

    };
    
    this.wire = Bodies.circle(this.position_x, this.position_y, 10);
    this.wire.mass += 1.5

    Composite.add(engine.world, this.wire);

    //salt.props.self.head_towards(salt.props.self, nextLayerNeurons, network);

    this.head_towards = function head_towards(self, nextLayerNeurons, network) {
      // Calculate the activations for the salt based on the weights and biases of the current neuron
      
      console.log('AreweHeading: ', self,nextLayerNeurons,network)
      if (this.currentNeuron) {

        const curr_neuron = self.currentNeuron.props.neuron;
        var force = { x: 0, y: 0 };
        const forceScale = 0.0000005;

        if (curr_neuron.type === 'output') {
            // code for making the salt move towards the current neuron's position
            const force_x = 10 * forceScale * (curr_neuron.wire.position.x - this.wire.position.x)
            const force_y = 10 * forceScale * (curr_neuron.wire.position.y - this.wire.position.y)

            force.x -= force_x;
            force.y -= force_y;

            self.wire.frictionAir = 5;
            self.wire.mass = 10;
      
          } else {
          // code for calculating activations and force based on nextLayerNeurons
          const saltCount = curr_neuron.saltCount;
          const activations = curr_neuron.calculateActivation(nextLayerNeurons, saltCount, network);
          console.log('activates: ', activations)
          // Calculate the total force to apply to the salt based on the activations of the next layer neurons
          
          for (let i = 0; i < nextLayerNeurons.length; i++) {
            const neuron = nextLayerNeurons[i].props.neuron;
            const activation = activations[i];
            if (neuron && activation) {
              const force_x = activation * forceScale * (neuron.wire.position.x - this.wire.position.x);
              const force_y = activation * forceScale * (neuron.wire.position.y - this.wire.position.y);
              force.x -= force_x;
              force.y -= force_y;
            }}}

      // Use the force to determine the direction in which the salt should move
      self.wire.force.x -= force.x; 
      self.wire.force.y -= force.y;
          
            }
      
    };
    

    this.update_pos = function update_pos(self) {
      // Update the position of the salt on the page
      self.position_x = this.wire.position.x;
      self.position_y = this.wire.position.y;
      var self_obj = document.getElementById(self.htmlID);
      self_obj.style.left = self.position_x + "px";
      self_obj.style.top = self.position_y  + "px";
    
      // Check if the salt has entered a new neuron and update the currentNeuron if necessary
      this.updateCurrentNeuron(self);
    };
    
    this.updateCurrentNeuron = function updateCurrentNeuron(self) {
      // Set a collision threshold distance in pixels
      const collisionThreshold = 50;
    
      // Check if the salt is within the collision threshold distance of any neuron
      const collidesWithNeuron = network.neural_welcome_list.find(neuron => {
        return Matter.Vector.magnitude(Matter.Vector.sub(self.wire.position, neuron.props.neuron.wire.position)) < collisionThreshold;
      });
    
      // If the salt is within the collision threshold distance of a neuron, update the currentNeuron property
      if (collidesWithNeuron && this.currentNeuron !== collidesWithNeuron) {
        if (this.previousNeuron) {
        this.previousNeuron.props.neuron.removeSalt(); }
        this.previousNeuron = this.currentNeuron;
        this.currentNeuron = collidesWithNeuron;
        this.currentNeuron.props.neuron.addSalt();

        if (this.currentNeuron.props.neuron.type === "output") {
          this.outputSaltCountCallback();
        }

        if (this.previousNeuron.props.neuron.type === "output") {
          this.outputSaltCountCallback();
        }

        
        //console.log('collisions: ', this, this.currentNeuron)

      }
    }
  }

  

  Welcome({self}) {
    //const key = `${self.name}-${Date.now()}`; // Generate a unique key using the salt's name and a timestamp
    return <img src={ImageArray[Math.floor(Math.random() * 5)]} 
            className="App-logo" id={self.htmlID} alt="salt"  style = {self.saltStyle} />;
  }

};

*/

class SaltBag {
  constructor() {
    this.saltList = [];
  }
  setSaltList(newSaltList) {
    this.saltList = newSaltList;
  }

  Welcome({self}) {
    return this.saltList.map(salt => <salt.Welcome self={salt} />);
  }
}

/*
class Neuron {
  constructor(name, pos_x, pos_y, id, layer, index, type) {
    this.name = name;
    this.htmlID = this.name + 'ID';
    this.init_pos = {x: pos_x, y: pos_y};
    this.id = id;
    this.layer = layer;
    this.index = index;

    this.type = type;

    this.saltCount = 0;  // Initialize saltCount to 0
    
    this.state = {
      imgStyle: {
        position: "absolute",
        height: '50px',
        width: '50px',
        left: this.init_pos.x - 25 + "px",
        top: this.init_pos.y - 25 + "px",
        opacity: 0.8,
        textalign: "center"
      }
    };

    
    this.wire = Bodies.circle(this.init_pos.x, this.init_pos.y, 25, {
      isStatic: true
    });
    this.wire.collisionFilter = {
      'group': -1,
      'category': 2,
      'mask': 0,
    };
    Composite.add(engine.world, this.wire);
  } 

  Welcome({self}) {
    function neur_click() {alert(self.img.style)}
    //const [imgStyle, setImgStyle] = useState(self.neuronStyle);
    //const [neuron, setNeuron] = useState(self);

    console.log('weolcome style: ', self)
    
    
    if (self.type === 'output') {
      
      return (
        <img
          src={neuron_im}
          neuron={self}
          className="App-logo"
          id={self.htmlID}
          key={self.htmlID}
          alt="Neuron"
          style={self.state.imgStyle}
          onClick={neur_click}
       />

        );

    }


    return (
      <img
        src={neuron_im}
        neuron={self}
        className="App-logo"
        id={self.htmlID}
        key={self.htmlID}
        alt="Neuron"
        style={self.state.imgStyle}
        onClick={neur_click}
      /> 
      );
  }

  getWeightAndBias(toNeuron, network) {
    
    //console.log('in get weightandbias', this.id, toNeuron.id)

    //console.log('the dictionary key: ', `${this.id}-${toNeuron.id}`)
    //console.log('The fUll weight list: ', network.weights)
    //console.log(network.weights[`${this.id}-${toNeuron.id}`])
    //console.log(network.weights['0-0-1-0'])
    //console.log('bias time', network.biases)
    const weight = network.weights[`${this.id}-${toNeuron.id}`];
    const bias = network.biases[toNeuron.id];
    return { weight, bias };
  }


  calculateActivation(nextLayerNeurons, saltCount, network) {
  let activations = [];
  for (let i = 0; i < nextLayerNeurons.length; i++) {
    let neuron = nextLayerNeurons[i].props.neuron;
    let weightedSum = 0;
    console.log('checkity check on the ewight and bias cacl: ', this, neuron)
    const { weight, bias } = this.getWeightAndBias(neuron, network);
    weightedSum += weight * saltCount + bias;
    let activation = 1 / (1 + Math.exp(-weightedSum));
    activations.push(activation);
  }
  return activations;
}

  // Method to increment saltCount
  addSalt() {
    this.saltCount++;
  }

  // Method to decrement saltCount
  removeSalt() {
    this.saltCount--;
  }
  
}

*/



class Network {
  constructor(name) {

    this.name = name;
    this.htmlID = this.name + 'ID';
    this.neural_array = [];
    this.neural_welcome_list = [];
    
    this.saltBag = new SaltBag()
    this.state = { htmlRender: this.neural_welcome_list};

    this.layers = 2;

    this.inputLayers = 2;
    this.hiddenLayeers = null;
    this.outputLayers = 2;

    this.maxLayers = 10 + 2;
    this.maxLayerArray = Array(this.maxLayers).fill(5);
    this.currentFinalLayerIndex = 0;

    this.initializeInputOutputNeurons();

    this.weights = {};
    this.biases = {};
    
  }

  

  Welcome({self}) {

    return <div>{self.saltBag.saltList}{self.state.htmlRender}
    </div>;
  }

  OutputSaltCounts({self}) {
    const outputNeurons = self.neural_welcome_list.filter(neuron => neuron.props.neuron.type === 'output');
    console.log(outputNeurons)
    //alert('outputsalt trigggered')
    return (

      <div>
        {outputNeurons.map((outputNeuron, index) => {
          const neuronPos = outputNeuron.props.style;
          //console.log(neuronPos)
          const saltCountStyle = {
            position: 'absolute',
            left: parseInt(neuronPos.left) + 50 + 'px', // Position the text to the right of the neuron image
            top: parseInt(neuronPos.top) + 5 + 'px'
          };
          //console.log(neuronPos)
          //console.log(saltCountStyle)
          //alert('yes we stopping')
          return <span style={saltCountStyle}> {outputNeuron.props.neuron.saltCount} </span>
        })}
      </div>
    );
  }


  updateoutputSaltCounts({self}) {


  }

  setState(newState) {

    this.state = Object.assign({}, this.state, newState);
  }

  //// Weights and Bias Stuff

  setWeightInit(fromNeuron, toNeuron, value) {
    this.weights[`${fromNeuron}-${toNeuron}`] = value;
  }

  setBiasInit(toNeuron, value) {
    this.biases[toNeuron] = value;
  }

  
  setWeight(fromNeuron, toNeuron, value) {
    this.weights[`${fromNeuron.id}-${toNeuron.id}`] = value;
  }

  setBias(toNeuron, value) {
    this.biases[toNeuron.id] = value;
  }

  /*

  getNeuronIds() {
    const neuronIds = [];
    for (let i = 0; i < this.maxLayers; i++) {
      for (let j = 0; j < this.maxLayerArray[i]; j++) {
        neuronIds.push(`${i}-${j}`);
      }
    }
    return neuronIds;
  }

  */

  randomNormal() {
    // Generate a random number with a normal distribution
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  }

  initializeWeightsAndBiases() {
    for (let i = 0; i < this.maxLayerArray.length - 1; i++) {
      // Loop over all neurons in the current layer
      for (let j = 0; j < this.maxLayerArray[i]; j++) {
        const fromNeuron = `${i}-${j}`;
        // Loop over all neurons in the next layer
        for (let k = 0; k < this.maxLayerArray[i + 1]; k++) {
          const toNeuron = `${i + 1}-${k}`;
          this.setWeightInit(fromNeuron, toNeuron, this.randomNormal());
          // Set the bias for the current neuron in the next layer
          this.setBiasInit(toNeuron, this.randomNormal());
        }
      }
    }

// Make sure all the inputs and outputs have weights and biases //////////HERE

for (let i = 0; i < this.input_welcome_list.length; i++) {
  var currentNeuron = this.input_welcome_list[i];
  currentNeuron = currentNeuron.props.neuron;
  const nextLayerNeurons = this.output_welcome_list;
  
  console.log('nextlayers', nextLayerNeurons)
  if (nextLayerNeurons.length > 0) {
    // Check if there are weights and biases between the current neuron and the next layer neurons
    nextLayerNeurons.forEach(neuron => {
      neuron = neuron.props.neuron;
      const key = `${currentNeuron.layer}-${currentNeuron.index}-${neuron.layer}-${neuron.index}`;
      if (!network.weights[key]) {
        // Generate weights and biases if they do not exist
        network.setWeight(currentNeuron, neuron, network.randomNormal());
        network.setBias(currentNeuron, network.randomNormal());
      
      
      }
    });
  }
}

console.log('weights post init: ', this.weights)

    
  }


  initializeInputOutputNeurons() {
    // Initialize the input neurons
    this.inputNeurons = [];
    for (let i = 0; i < this.inputLayers; i++) {
      const inputNeuron = new Neuron(
        `input-${i}`,
        engine,
        100,
        300 + i * 100,
        `0-${i}`, 
        0,
        i,
        'input'
      );
      this.inputNeurons.push(inputNeuron);
    }
    //position_x: 300 + outerIndex * 400,
    //position_y: 2200 - 400 * innerIndex,
    // Initialize the output neurons
    this.outputNeurons = [];
    for (let i = 0; i < this.outputLayers; i++) {
      const outputNeuron = new Neuron(
        `output-${i}`,
        engine,
        300,
        200 + i * 300,
        `${this.maxLayers-1}-${i}`,
        this.maxLayers - 1,
        i,
        'output'
      );
      this.outputNeurons.push(outputNeuron);
    }
  
    
    // Add the input and output neurons to the neural_array and neural_welcome_list
    this.neural_array.unshift(...this.inputNeurons);
    this.neural_array.push(...this.outputNeurons);
  
    // Create new arrays for input_welcome_list and neural_welcome_list
    this.input_welcome_list = []
    this.output_welcome_list = []
    const newInputWelcomeList = this.inputNeurons.map(neuron => neuron.Welcome({self: neuron}));
    const newOutputWelcomeList = this.outputNeurons.map(neuron => neuron.Welcome({self: neuron}));
    
    // Assign the new arrays to the input_welcome_list and neural_welcome_list variables
    this.input_welcome_list.push(...newInputWelcomeList);
    this.output_welcome_list.push(...newOutputWelcomeList);

    this.neural_welcome_list = [] //Clearing out the neural_welcome_list here
    const newNeuralWelcomeList = this.neural_welcome_list.concat(this.input_welcome_list, this.output_welcome_list);

    this.neural_welcome_list = newNeuralWelcomeList;


    
  }
  




/// Rendering


updateHtmlRender(layers, layerArray) {

  console.log('layaz: ', layers, layerArray)


const nullLayerArray = layerArray[1].map(num => Array(num).fill(null));

const propslist = [];

nullLayerArray.forEach((innerArray, outerIndex) => {
innerArray.forEach((_, innerIndex) => {
const neurProps = {
name: 'Update_Neur' + outerIndex + '_' + innerIndex,
position_x: 300 + outerIndex * 150,
position_y: 500 - 100 * innerIndex,
layer: outerIndex,
index: innerIndex
};
propslist.push(neurProps);
});
});
  
if (layers === 0) {propslist=[]};

  console.log('propsList: ', propslist)

  var old_neurons = [];

// Filter the neural_welcome_list to only include neurons that are not in the propslist
  old_neurons = this.neural_welcome_list.filter(existingNeuron => {
    // check if the neuron has a type of 'input' or 'output'
    if (existingNeuron.props.neuron.type === 'input' || existingNeuron.props.neuron.type === 'output') {
        return false;
    } 
    return !propslist.some(neuron_props => {
        return neuron_props.name === existingNeuron.props.neuron.name;
    });
  });


console.log('olds', old_neurons)
// Apply clean-up functions to the old neurons
old_neurons.forEach(neuron => {
  //const wireToRemove = Composite.filter(engine.world, {
  //  filter: body => body === neuron.wire }); 
  const wireToRemove = Composite.get(engine.world, neuron.props.neuron.wire.id, 'body');
  
  console.log('TO remove: ', wireToRemove)
  
  if (wireToRemove) {
    console.log('World b4: ', engine.world)
    Composite.remove(engine.world, wireToRemove);
    console.log('World afta: ', engine.world)
}
});


console.log('Old Ns: ', old_neurons)

var indicesToRemove = old_neurons.map(neuron => this.neural_welcome_list.indexOf(neuron));
// Use the splice method to remove the elements from the neural_welcome_list array
this.neural_welcome_list.splice(
  ...indicesToRemove,
  old_neurons.length
);

/*
var filteredArray = this.neural_welcome_list.filter(element =>
  typeof element === 'object' && 'type' in element && element.type === 'img'
);

this.neural_welcome_list = filteredArray;
*/
try {
  var new_neurons = propslist.filter(props => {
    return !this.neural_welcome_list.some(neur => {
      return props.name === neur.props.neuron.name;
    });
  });

  
  
  console.log('New Ns (Props): ', new_neurons)



  if (new_neurons !== []) {
  this.neural_welcome_list.push(
      ...new_neurons.map(neur_props => {
        console.log(neur_props)
      var neur = new Neuron(neur_props.name, engine, neur_props.position_x, neur_props.position_y, neur_props.layer + '-' + neur_props.index, neur_props.layer, neur_props.index, 'hidden');
      console.log(neur)
      var Welcome_in = neur.Welcome({self: neur});
      return Welcome_in;
    })
  );}




} catch (error) {
  console.error(error);
}


////// We're looking at this bit above just here

console.log('Final Ns: ', this.neural_welcome_list)
//console.log('Bef4Layer: ', layerArray)
const hiddenLayerArray = layerArray[1]
//layerArray = newLayerArray;

console.log('Layer:array ', layerArray)

const expected_neuron_total = Number(network.inputLayers) + hiddenLayerArray.reduce((prev, next) => prev + Number(next), 0)  + Number(network.outputLayers);

console.log('Neuron_total: ', expected_neuron_total)
const start = this.neural_welcome_list.length - expected_neuron_total


if (start > 0) {
this.neural_welcome_list.splice(expected_neuron_total, start)
}

var filteredArray = this.neural_welcome_list.filter(element =>
  typeof element === 'object' && 'type' in element && element.type === 'img'
);

this.neural_welcome_list = filteredArray;

console.log('hidden_layer_array', hiddenLayerArray)
var finalLayerIndex = 0
//if (!hiddenLayerArray.includes(0)) {indexCheck = hiddenLayerArray.reverse().findIndex(layer => layer !== 0)}
//const finalLayerIndex = hiddenLayerArray.length - 1 - indexCheck;
console.log('Final Layers indices: ', this.currentFinalLayerIndex, finalLayerIndex)

hiddenLayerArray.forEach((item, idx) => {
  if (item !== 0) {
    finalLayerIndex = idx;
  }
});


finalLayerIndex = finalLayerIndex + 1

if (hiddenLayerArray.every(item => item === 0 || item === null || item === "")) {finalLayerIndex = 0};


if (this.currentFinalLayerIndex !== finalLayerIndex) {

console.log('NUMBER OF OUTPUT NEURONS: ', this.output_welcome_list)
for (let i = 0; i < this.output_welcome_list.length; i++) {
  
  console.log('The neur: ', this.output_welcome_list[i])
  this.output_welcome_list[i].props.neuron.wire.position.x = 300 + (finalLayerIndex * 150);

  const newStyle = Object.assign({}, this.output_welcome_list[i].props.style, { left: `${300 + (finalLayerIndex * 150)}px` });
  const newProps = {...this.output_welcome_list[i].props, style: newStyle};
  this.output_welcome_list[i] = {...this.output_welcome_list[i], props: newProps};

  console.log(' Checking OUTPUTS post position WIIIRE: ' , this.output_welcome_list[i].props.neuron.wire.position.x)
  console.log(' Checking OUTPUTS post position IIMG: ' , this.output_welcome_list[i].props.style.left)
} }

this.currentFinalLayerIndex = finalLayerIndex;

 // Check if the input neurons are already in the neural_welcome_list
 if (!this.input_welcome_list.some(neuron => this.neural_welcome_list.includes(neuron))) {
  // Add the input neurons to the beginning of the neural_welcome_list
  this.neural_welcome_list.unshift(...this.input_welcome_list);
}

if (!this.output_welcome_list.some(neuron => {
  return this.neural_welcome_list.some(existingNeuron => {
    return neuron.props.neuron.name === existingNeuron.props.neuron.name;
  });
})) {
  // Add the output neurons to the end of the neural_welcome_list
  this.neural_welcome_list.push(...this.output_welcome_list);
}



this.setState({htmlRender: this.neural_welcome_list});
  
}



updateSaltRender(numSalts, saltList, outputSaltCountCallback, inputAndOrState) {
  if (numSalts > saltList.length) {

    
  // Create new salt objects and render them
  const newSaltRenderList = [];
  var initNeuron = null;

  for (let i = saltList.length; i < numSalts; i++) {

  //Check whether we're on an 'and' or an 'or' input

  if (inputAndOrState === true) {
    const probability = 0.5;
    const randomNum = Math.random();
    if (randomNum <= probability) {
      // Place the salt in the first input neuron
      initNeuron = this.input_welcome_list[0].props.neuron;
    } else {
      // Place the salt in the second input neuron
      initNeuron = this.input_welcome_list[1].props.neuron;
    }
  } else if (inputAndOrState === false) {

    // Place the salt in a specific input neuron
    initNeuron = this.input_welcome_list[0].props.neuron;

  }

  let salt = new Salt("Salty_" + i, engine, outputSaltCountCallback, initNeuron);
  newSaltRenderList.push(<salt.Welcome self={salt} key={i} />);


}
  // Concatenate the new salt render list with the existing salt list
  this.saltBag.setSaltList(this.saltBag.saltList.concat(newSaltRenderList));
  } else if (numSalts < saltList.length) {
  // Remove excess salt objects from the salt list
  this.saltBag.setSaltList(this.saltBag.saltList.splice(numSalts, saltList.length - numSalts));
  }
}
}


/// Instantiate The Objects

let network = new Network('TheNet')
network.initializeWeightsAndBiases();
console.log('WGIHTS', network.weights)




var start = "False";


//Styling slider stuff





function Salt_Sim() {


  //State Hooks

  
  const horSliderRef = useRef(null);
  
  const [netState, setnetState] = useState(<network.Welcome self={network} />);


  const [numLayers, setnumLayers] = useState(2);
  const [layerArray, setlayerArray] = useState([[network.inputLayers], [], [network.outputLayers]]);
  const [verArray, setverArray] = useState(Array);

  const [numSalts, setnumSalts] = useState(0);
  const [saltList, setsaltList] = useState([]);

  const [outputSaltCount, setoutputSaltCount] = useState(<network.OutputSaltCounts self = {network} />);

  const [inputAndOrState, setInputAndOrState] = useState(false);
  const [outputAndOrState, setOutputAndOrState] = useState(false);


  const handleInputAndOrStateChange = (inputAndOrState) => {
    setInputAndOrState(inputAndOrState)
  }
  const handleOutputAndOrStateChange = (outputAndOrState) => {
    setOutputAndOrState(outputAndOrState)
  }

//////////////////////////////////////////////////////////////////////////////
/////////////////////////////////
const outputNeurons = network.neural_welcome_list.filter(neuron => neuron.props.neuron.type === 'output');
//const outputSaltCounts = outputNeurons.map(neuron => neuron.saltCount);

  const outputSaltCountCallback = useCallback(() => {
    setoutputSaltCount(<network.OutputSaltCounts self = {network} />)
  }, []);

////////////////////////////////////// //////////////////////////////////////
/////////////////////////////////
 
  const updateHtmlRenderCallback = useCallback(() => {
    network.updateHtmlRender(numLayers, layerArray); 
    setnetState(<network.Welcome self={network} />)
    setoutputSaltCount(<network.OutputSaltCounts self = {network} />)
    //alert('here')
    const visualizationData = generateVisualizationData(network);
    createD3Visualization(visualizationData.connections, visualizationData.nodes, visualizationData.links);

  }, [numLayers, layerArray]);


  const updateSaltRenderCallback = useCallback(() => {
    network.updateSaltRender(numSalts, saltList, outputSaltCountCallback, inputAndOrState); 
    setnetState(<network.Welcome self={network} />)
  }, [numSalts, saltList]);
  
  
  function verSlideTrigger(index, value) 
  {
  // Create a copy of the layerArray state
  const newLayerArray = [...layerArray];

  // Modify the copied array
  newLayerArray[1][index] = value;

  // Update the state with the new array
  setlayerArray(newLayerArray);
  }
  








function updateVerSliders() {

    if (horSliderRef.current) {
      setverArray([]);
      
  const horizontalSliderWidth = horSliderRef.current.getBoundingClientRect().width
  const horizontalSliderLeft = horSliderRef.current.getBoundingClientRect().left;

  const numMarks = 10;
  const markPositions = [...Array(numMarks)].map((_, index) => (horizontalSliderWidth / (numMarks)) * (index + 1));
  


  var vertSlides = markPositions.map((position, index) => (
    <Slider
      key={index}
      id ={'slide' + index}
      style={{ position: "absolute", left: `${(position*0.98)+horizontalSliderLeft}px`, top: '70%', height: 36 }}
      getAriaLabel={() => 'Small steps'}
      orientation="vertical"
      defaultValue={layerArray[1][index]}
      step={1}
      min={0}
      max={5}
      marks
      valueLabelDisplay="auto"
      onChange={(event, value) => {verSlideTrigger(index, value)} }
    />
  ));


  //alert('numLayers: ', numLayers)
  //tempLayerArray = layerArray.slice(0,numLayers)

  //setlayerArray(tempLayerArray)

  vertSlides = vertSlides.slice(0,numLayers)
  //alert('vertSldies: ',vertSlides.length)

  console.log('The vertical Slider', vertSlides)

  setverArray(vertSlides)

  return ( null )
  //slideSlotRef.current.push(vertSlides)
  //console.log('afterPush: ', slideSlotRef)
  }


              

  return ( null );

}
    //const [Net, setNet] = useState(0);

  //network.updateHtmlRender(2)

    function physics() {


      //alert('we going')
        start = "True";


        // create a ground
        //var ground = Bodies.rectangle(400, 610, 1000, 60, { isStatic: true });
        
        // add all of the bodies to the world
        //Composite.add(engine.world, [ground]);

        // run the renderer
        Render.run(render);

        // create runner
        var runner = Runner.create();

        // run the engine
        Runner.run(runner, engine);
      
      }
      

      function updateSaltPositions(saltList, neurons, network) {
        
        try {
          // code that might throw an error

          saltList.forEach((salt, index) => {
            // Update the current and previous neurons for the salt
            salt.props.self.updateCurrentNeuron(salt.props.self, network);

            // Calculate the next layer neurons for the salt
            if (neurons && salt.props.self.currentNeuron) {
              const nextLayerNeurons = getNextLayerNeurons(salt.props.self.currentNeuron, neurons, network);
              // Pass the next layer neurons and salt count to the head_towards function
              console.log('next layer neurons', nextLayerNeurons)
              salt.props.self.head_towards(salt.props.self, nextLayerNeurons, network); 
              
            }

            // Update the position of the salt
            salt.props.self.update_pos(salt.props.self, network);
  
          });
        } catch (error) {
          //alert('Update salt pos: ', error)
          console.error(error);
        }
        requestAnimationFrame(() => updateSaltPositions(saltList, neurons, network));
      }

      updateSaltPositions(saltList, network.neural_welcome_list, network);

      useEffect(() => {
        setsaltList(network.saltBag.saltList);
      }, [network.saltBag.saltList]);


      function getNextLayerNeurons(currentNeuron, neurons, network) {
        const nextLayerNeurons = getFirstAvailableLayer(currentNeuron.props.neuron.layer, neurons);
        if (nextLayerNeurons.length > 0) {
          // Check if there are weights and biases between the current neuron and the next layer neurons
          currentNeuron = currentNeuron.props.neuron;
          nextLayerNeurons.forEach(neuron => {
            neuron = neuron.props.neuron;
            if (!network.weights[`${currentNeuron.id}-${neuron.id}`]) {
              // Generate weights and biases if they do not exist
              network.setWeightInit(currentNeuron.id, neuron.id, network.randomNormal());
              network.setBiasInit(neuron.id, network.randomNormal());
              //console.log('HEHHRE', currentNeuron, neuron)
              //console.log(network.weights)
              //alert()
            }
          });
        }
        return nextLayerNeurons;
      }



      function getFirstAvailableLayer(currentLayer, neurons) {
        for (let i = currentLayer + 1; i < network.maxLayerArray.length; i++) {
          const layerNeurons = neurons.filter(neuron => neuron.props.neuron.layer === i);
          if (layerNeurons.length > 0) {
            //alert(layerNeurons)
            return layerNeurons;
          }
        }
        // If there are no more layers, return an empty array
        return [];
      }


    
    useEffect(() => {
      // Call the sliderLoad() function after the horizontal slider has been rendered:
      updateVerSliders();
      //updateHtmlRenderCallback()
         
    }, [numLayers, layerArray]);



    
    useEffect(() => {
      //updateVerSliders();
      updateHtmlRenderCallback()

      //network.updateHtmlRender(numLayers, layerArray); 
      //setnetState(<network.Welcome self={network} />)
         
    }, [verArray]);

    useEffect(() => {
      updateSaltRenderCallback();
    }, [numSalts, saltList]);

    


    
    return (
  
      
  
        <div className="container" id="container">
          {<div className = "network-viz" id="network-viz"> HERE</div>
          }   
      <div className ="ButtonMenu" id='buttons' style={{margin: '0', padding: '0px'}} >
        
      <h1 > Translation is Liquid</h1>
   

        <button onClick={physics}>Start this jam</button> 

        <Button variant="contained" color="primary" onClick={() => setnumSalts(numSalts + 1)}>
          Add Salt
        </Button>
        
        <p>Salt Count: {numSalts}</p>

      
        {netState}
        {outputSaltCount}

        
        

        <ToggleSwitch onInputAndOrStateChange={handleInputAndOrStateChange} 
        onOutputAndOrStateChange={handleOutputAndOrStateChange} />

        
        

        <Slider
          aria-label="Small steps"
          ref={horSliderRef}
          padding={'30px'}
          margin={'30px'}
          style={{width: '90%'}}
          defaultValue={2}
          step={1}
          min={0}
          max={10}
          marks
          valueLabelDisplay="auto"
          onChange={(_, value) => {setnumLayers(value); }}
        />
        
          {verArray}
          
                {/*}  <header className="App-header">
  
  
          <img src="https://media.discordapp.net/attachments/743175969807794178/1040724536011788398/crossbun.png" className="App-logo" alt="logo" />
          <p>
            Bang Some Bun
          </p>
  
          <h1><span id="bunCount1">0</span></h1>
  
          <h1><span className="Smol-writing" id="bunPerTick">Buns Per Tick: 0</span></h1>
  
  
        </header>*/ }

      </div>
      </div>



      );
  }
  
  export default Salt_Sim;