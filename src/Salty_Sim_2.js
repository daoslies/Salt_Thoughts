

import neuron_im from './Neuron.png';
import salt_1_im from './Salt_Pics/Salt_1.png';
import salt_2_im from './Salt_Pics/Salt_2.png';
import salt_3_im from './Salt_Pics/Salt_3.png';
import salt_4_im from './Salt_Pics/Salt_4.png';
import salt_5_im from './Salt_Pics/Salt_5.png';

import './App.css';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useCallback } from 'react';

import { createElement } from 'react';

import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client'

//This means that the information contained in the embedding will be a compromise between the detailed information in the input and output data, and the more abstract and general representation of the relationship between the input and output data that is learned by the model.






import Matter, { Events } from 'matter-js';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { useSlider } from '@mui/base';
import { dividerClasses } from '@mui/material';

Matter.Common.setDecomp(require('poly-decomp'))





var ImageArray = new Array();
ImageArray[0] = salt_1_im;
ImageArray[1] = salt_2_im;
ImageArray[2] = salt_3_im;
ImageArray[3] = salt_4_im;
ImageArray[4] = salt_5_im;

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


class Salt {

  constructor(name) {

    this.name = name;
    /* [this.position, this.setPosition] = useState({
      x: 0,
      y: 0
    }); */

    this.currentNeuron = null;
    this.previousNeuron = null; 

    this.position_x = 0;

    this.htmlID = this.name + 'ID'
    var num = Math.floor( Math.random() * 5);
    this.img = ImageArray[num];

    this.saltStyle = {
      position: "absolute",
      height: '50px',
      width: '50px',
      left: this.position_x + "px",
      top: this.position_y + "px",

    };
    
    this.wire = Bodies.circle(300, 100, 10);
    this.wire.mass += 1.5

    Composite.add(engine.world, this.wire);

    //salt.props.self.head_towards(salt.props.self, nextLayerNeurons, network);

    this.head_towards = function head_towards(self, nextLayerNeurons, network) {
      // Calculate the activations for the salt based on the weights and biases of the current neuron
      
      console.log('AreweHeading: ', self,nextLayerNeurons,network)
      if (this.currentNeuron) {

        //alert('is it alerts')
        const curr_neuron = self.currentNeuron.props.neuron;
        const saltCount = curr_neuron.saltCount;
        const activations = curr_neuron.calculateActivation(nextLayerNeurons, saltCount, network);
        console.log('activates: ', activations)
        // Calculate the total force to apply to the salt based on the activations of the next layer neurons
        const forceScale = 0.0000005;
        let force = { x: 0, y: 0 };
        for (let i = 0; i < nextLayerNeurons.length; i++) {
          const neuron = nextLayerNeurons[i].props.neuron;
          const activation = activations[i];
          if (neuron && activation) {
          const force_x = activation * forceScale * (neuron.wire.position.x - this.wire.position.x);
          const force_y = activation * forceScale * (neuron.wire.position.y - this.wire.position.y);
          force.x -= force_x;
          force.y -= force_y;

          //alert('neural force!')
        }
        }
    
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
      const collisionThreshold = 100;
    
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
        //console.log('collisions: ', this, this.currentNeuron)

      }
    }
    
    
    
    

    /*
    this.update_pos = function update_pos(self) {

      self.position_x = this.wire.position.x;
      self.position_y = this.wire.position.y;

      var self_obj = document.getElementById(self.htmlID);


      //alert(self_obj.style)
      self_obj.style.left = self.position_x + "px";
      self_obj.style.top = self.position_y  + "px";

      // Check if the salt has entered a new neuron
      const collidesWithNeuron = network.neural_welcome_list.find(neuron => {
        return Matter.Collision.collides(self.wire, neuron.props.neuron.wire) != null;
      });

      // If the salt has entered a new neuron, update the currentNeuron property
      if (collidesWithNeuron && this.currentNeuron !== collidesWithNeuron) {
        this.currentNeuron = collidesWithNeuron;
      }

      // Calculate the activation for the salt based on the weights and biases of the current neuron
      console.log('heree!')
      console.log('acrivbation: ', this.currentNeuron)
      const activation = this.currentNeuron.props.neuron.calculateActivation(self);

      // Determine the force to apply to the salt based on the activation
      const forceScale = 0.5;
      const force = { x: activation * forceScale, y: activation * forceScale };

      // Apply the force to the salt's wire object
      Matter.Body.applyForce(self.wire, self.wire.position, force);
  
    } */
    

  }

  

  Welcome({self}) {
    //const key = `${self.name}-${Date.now()}`; // Generate a unique key using the salt's name and a timestamp
    return <img src={ImageArray[Math.floor(Math.random() * 5)]} 
            className="App-logo" id={self.htmlID} alt="salt"  style = {self.saltStyle} />;
  }

};


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
        height: '200px',
        width: '200px',
        left: this.init_pos.x - 75 + "px",
        top: this.init_pos.y - 75 + "px",
        opacity: 0.8,
        textalign: "center"
      }
    };

    
    this.wire = Bodies.circle(this.init_pos.x, this.init_pos.y, 50, {
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
    
    console.log('in get weightandbias', this.id, toNeuron.id)

    console.log('the dictionary key: ', `${this.id}-${toNeuron.id}`)
    console.log('The fUll weight list: ', network.weights)
    console.log(network.weights[`${this.id}-${toNeuron.id}`])
    console.log(network.weights['0-0-1-0'])
    console.log('bias time', network.biases)
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



/////////////////////////////////////////////////////////////////////////

// AHHHHHHHHH



 /// Ok hello Oli. You are currently faffing with trying to get the slider to work and change the number of neurons.

 // You have just had a breakthrough and your various functions are now returning a list of the img divs rather than the class item.

 // This is call as the image divs are the things you actually want to influence.

 // But you need the class as well to know what to do the divs.
/////////////////////////////////////////////////////////////////////////




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
  }
  initializeInputOutputNeurons() {
    // Initialize the input neurons
    this.inputNeurons = [];
    for (let i = 0; i < this.inputLayers; i++) {
      const inputNeuron = new Neuron(
        `input-${i}`,
        50,
        1200 + i * 400,
        `Input Neuron ${i}`,
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
        500,
        1200 + i * 400,
        `Output Neuron ${i}`,
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

    console.log('initialiseing ', 'input: ', this.input_welcome_list, 'output: ', this.output_welcome_list)
    console.log('welcomeList(pre-setting): ', this.neural_welcome_list) 
    this.neural_welcome_list = [] //Clearing out the neural_welcome_list here
    const newNeuralWelcomeList = this.neural_welcome_list.concat(this.input_welcome_list, this.output_welcome_list);

    this.neural_welcome_list = newNeuralWelcomeList;


    console.log('welcomeList 11: ', this.neural_welcome_list) 
    console.log(this.neural_welcome_list[0])
    console.log(this.neural_welcome_list[1])
    console.log(this.neural_welcome_list[2])
    console.log(this.neural_welcome_list[3])
  }
  




/// Rendering


updateHtmlRender(layers, layerArray) {

  console.log('layaz: ', layers, layerArray)


  console.log('welcomeList 22: ', this.neural_welcome_list) 
  console.log(this.neural_welcome_list[0])
  console.log(this.neural_welcome_list[1])
  console.log(this.neural_welcome_list[2])
  console.log(this.neural_welcome_list[3])
  //this.neural_welcome_list = this.state.htmlRender


const nullLayerArray = layerArray[1].map(num => Array(num).fill(null));

const propslist = [];

nullLayerArray.forEach((innerArray, outerIndex) => {
innerArray.forEach((_, innerIndex) => {
const neurProps = {
name: 'Update_Neur' + outerIndex + '_' + innerIndex,
position_x: 400 + outerIndex * 400,
position_y: 2200 - 400 * innerIndex,
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
      var neur = new Neuron(neur_props.name, neur_props.position_x, neur_props.position_y, neur_props.layer + '-' + neur_props.index, neur_props.layer, neur_props.index, 'hidden');
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
  this.output_welcome_list[i].props.neuron.wire.position.x = 400 + (finalLayerIndex) * 400;

  const newStyle = Object.assign({}, this.output_welcome_list[i].props.style, { left: `${300 + finalLayerIndex * 400}px` });
  const newProps = {...this.output_welcome_list[i].props, style: newStyle};
  this.output_welcome_list[i] = {...this.output_welcome_list[i], props: newProps};

  console.log(' Checking OUTPUTS post position: ' , this.output_welcome_list[i].props.neuron.wire.position.x)
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



updateSaltRender(numSalts, saltList) {
  if (numSalts > saltList.length) {
  // Create new salt objects and render them
  const newSaltRenderList = [];
  for (let i = saltList.length; i < numSalts; i++) {
  let salt = new Salt("Salty_" + i);
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

 
  const updateHtmlRenderCallback = useCallback(() => {
    network.updateHtmlRender(numLayers, layerArray); 
    setnetState(<network.Welcome self={network} />)
  }, [numLayers, layerArray]);


  const updateSaltRenderCallback = useCallback(() => {
    network.updateSaltRender(numSalts, saltList); 
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
  const numMarks = 10;
  const markPositions = [...Array(numMarks)].map((_, index) => horizontalSliderWidth / numMarks * index);
  


  var vertSlides = markPositions.map((position, index) => (
    <Slider
      key={index}
      id ={'slide' + index}
      style={{ position: "absolute", left: `${position+55}px`, top: '250px', height: 36 }}
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
            salt.props.self.updateCurrentNeuron(salt.props.self);

            // Calculate the next layer neurons for the salt
            if (neurons && salt.props.self.currentNeuron) {
              const nextLayerNeurons = getNextLayerNeurons(salt.props.self.currentNeuron, neurons, network);
              // Pass the next layer neurons and salt count to the head_towards function
              console.log('next layer neurons', nextLayerNeurons)
              salt.props.self.head_towards(salt.props.self, nextLayerNeurons, network); 
              
            }

            // Update the position of the salt
            salt.props.self.update_pos(salt.props.self);
          });
        } catch (error) {
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

      /*
      function updateSaltPositions(saltList, neurons, network) {

        try {
          // code that might throw an error
        
        saltList.forEach((salt, index) => {
          // Update the current and previous neurons for the salt
          salt.props.self.updateCurrentNeuron(salt.props.self);
      
          // Calculate the next layer neurons for the salt
          if (neurons && salt.props.self.currentNeuron) {
            const nextLayerNeurons = neurons.filter(neuron => neuron.props.neuron.layer === salt.props.self.currentNeuron.props.neuron.layer + 1);
          // Pass the next layer neurons and salt count to the head_towards function
          salt.props.self.head_towards(salt.props.self, nextLayerNeurons, network); }
      
          // Update the position of the salt
          salt.props.self.update_pos(salt.props.self);

          
        });

      } catch (error) {
        console.error(error);
      }
        requestAnimationFrame(() => updateSaltPositions(saltList, neurons, network));
      }

      updateSaltPositions(saltList, network.neural_welcome_list, network);

      useEffect(() => {
        setsaltList(network.saltBag.saltList);
      }, [network.saltBag.saltList]);
      
      */
      
      /*
      function updateSaltPositions(saltList) {
        saltList.forEach(salt => {
          network.state.htmlRender.forEach(neuron => {
            salt.props.self.head_towards(salt.props.self, neuron.props.neuron);
          });
          salt.props.self.update_pos(salt.props.self);
        });
        requestAnimationFrame(() => updateSaltPositions(saltList));
      }  */
      /*
      function updateSaltPositions(saltList, neurons, network) {
        // Calculate the salt count for each neuron
        const saltCount = neurons.map(neuron => {
        const collidesWithNeuron = saltList.filter(salt => {
        return Matter.Query.point(neuron.props.neuron.wire, salt.wire.position).length > 0;
        });
        return collidesWithNeuron.length;
        });
        
        saltList.forEach((salt, index) => {
        // Pass the salt count for the current neuron to the head_towards function
        salt.props.self.head_towards(salt.props.self, neuron.props.neuron, neurons, saltCount, network);
        salt.props.self.update_pos(salt.props.self);
        });
        requestAnimationFrame(() => updateSaltPositions(saltList, neurons, network));
        }
      
      updateSaltPositions(saltList);   ///////////// put in the args

      useEffect(() => {
        setsaltList(network.saltBag.saltList);
      }, [network.saltBag.saltList]);
      */
    /*
    async function check() {

       

      setsaltList(network.saltBag.saltList)

        saltList.forEach(salt => {
          network.state.htmlRender.forEach(neuron => {
            salt.props.self.head_towards(salt.props.self, neuron.props.neuron);
          });
          salt.props.self.update_pos(salt.props.self);
        });
      
       }
    
    useEffect(() => {
      
      if (start === "True") {
      check();
                          }
     }, []);


    
    setInterval(check, 10);  
     */
    /*
    useEffect(() => {
      setInterval(network.updateHtmlRender, 150);
    }, [network.updateHtmlRender]);
    */


    
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
  
      
  
      <div className="App">

      <aside className ="ButtonMenu" id='buttons' >
  
        <h1> Translation is Liquid</h1>
        <div id ='quickcheck'>s</div>


        
   

        <button onClick={physics}>Start this jam</button> 

        <Button variant="contained" color="primary" onClick={() => setnumSalts(numSalts + 1)}>
          Add Salt
        </Button>
        
        <p>Salt Count: {numSalts}</p>

        {/*} <salt_1.Welcome self={salt_1} />
        <salt_2.Welcome self={salt_2} />
        <salt_3.Welcome self={salt_3} /> */}

        <div> Seperator </div>
        {netState}
        
        
        

        <Slider
          aria-label="Small steps"
          ref={horSliderRef}
          padding={'30px'}
          margin={'30px'}
          defaultValue={2}
          step={1}
          min={0}
          max={10}
          marks
          valueLabelDisplay="auto"
          onChange={(_, value) => {setnumLayers(value); }}
        />
        
          {verArray}

      </aside>
  
  
      {/*}  <header className="App-header">
  
  
          <img src="https://media.discordapp.net/attachments/743175969807794178/1040724536011788398/crossbun.png" className="App-logo" alt="logo" />
          <p>
            Bang Some Bun
          </p>
  
          <h1><span id="bunCount1">0</span></h1>
  
          <h1><span className="Smol-writing" id="bunPerTick">Buns Per Tick: 0</span></h1>
  
  
        </header>*/ }
      </div>
      );
  }
  
  export default Salt_Sim;