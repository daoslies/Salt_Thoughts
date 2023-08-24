




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

import SaveLoadButton from './SaveLoadButton';

import LearningRateSlider from "./LearningRateSlider";

import FrozenLayerButton from './FrozenLayerButton';


import * as d3 from 'd3';
import { createD3Visualization, generateVisualizationData } from './D3_Visualization';


import Salt from './Salt';
import Neuron from './Neuron';

import backpropagation from './BackProp_Flower';

import graphing from './Dataset_Graph';

import NeuronGraph from './Neuron_WB_Graph';


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
engine.neuronGraph = null;
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
    var target_y =  mouse.position.y - 182;


    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];

        //console.log('Checking Bodies' + [i] + '  :  ', body)
        //console.log('Checking Bodies' + [i] + '  :  ', body.position)
        if (body.isStatic || body.isSleeping)
                {
                
                }
            
            else
                {

                   // Check Collisions
                   network.neural_welcome_list.forEach(neuron =>{

                    try {
                      const collision = Matter.Collision.collides(body, neuron.props.neuron.wire);
                      if (collision != null) {
                        body.frictionAir = 3;
                        }
                       else {
                        body.frictionAir = 0.1;
                      }
                    
                    } catch (error) {
                      // Handle the error here
                      console.error(error);
                      const collision = Matter.Collision.collides(body, neuron.props.neuron.wire);
                      body.frictionAir = 0.1
                    }
                  })

                

                var body_x = body.position.x;
                var body_y = body.position.y;
                
                var distance = Math.sqrt(Math.pow((body_x - target_x),2) + Math.pow((body_y - target_y),2))
                
                var direction_x = body_x - target_x;
                var direction_y = body_y - target_y;

                var force_x = direction_x * Math.min(0.5, (1/(distance**2.25))) * 0.05;
                var force_y = direction_y * Math.min(0.5, (1/(distance**2.25))) * 0.05;

                body.force.x -= force_x;
                body.force.y -= force_y;
                
                //body.force.y += body.mass * 0.001;
                
                }
    }
});


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


class Network {
  constructor(name) {

    this.name = name;
    this.htmlID = this.name + 'ID';
    this.neural_array = [];
    this.neural_welcome_list = [];
    
    this.saltBag = new SaltBag()
    this.state = { htmlRender: this.neural_welcome_list};

    this.outputSaltTotal = 0;

    this.layers = 2;

    this.inputLayers = 4;
    this.hiddenLayers = null;
    this.outputLayers = 3;

    this.maxLayers = 10 + 2;
    this.maxLayerArray = Array(this.maxLayers).fill(5);

    //this.maxLayerArray[0] = this.inputLayers; /////////////////// CAn we set the first 2 layers 2 zero? look at how many nodes there are in the first layer and check the console log for network.maxlayerarray,
    this.maxLayerArray[this.maxLayerArray.length - 1] = this.outputLayers;
    this.currentFinalLayerIndex = 0;

    this.initializeInputOutputNeurons();
    this.loadData(this);

    this.weights = {};
    this.biases = {};
    
  }

  

  Welcome({self}) {

    return <div>{self.saltBag.saltList}{self.state.htmlRender}
    </div>;
  }

  OutputSaltCounts({self}) {
    const outputNeurons = self.neural_welcome_list.filter(neuron => neuron.props.neuron.type === 'output');
    //console.log(outputNeurons)

    self.outputSaltTotal = outputNeurons.map(img => img.props.neuron.saltCount)
    .reduce((prev, next) => prev + next);

    var target = network.currentTarget;

    //alert('in the count: ' + target)
    return (

      <div>
        {outputNeurons.map((outputNeuron, index) => {
          const neuronPos = outputNeuron.props.style;
          //console.log(neuronPos)
          const saltCountStyle = {
            position: 'absolute',
            left: parseInt(neuronPos.left) + 75 + 'px', // Position the text to the right of the neuron image
            top: parseInt(neuronPos.top) + 5 + 'px',
            color: index === target ? 'green' : 'red'
          };
          return <span style={saltCountStyle}> {outputNeuron.props.neuron.saltCount} </span>
        })}
      </div>
    );
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

  randomNormal() {
    // Generate a random number with a normal distribution
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  }

  randomNormalBias() {
    // Generate a random number with a normal distribution
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    const normal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    // Scale the normal value to the range [0, 5]
    //const scaled = (normal + 5) / 2.0; // Transforming to range [0, 1]
    return (normal * 2) + 2; // Scaling to range [0, 5]
  }

  

  initializeWeightsAndBiases() {
    for (let i = 0; i < this.maxLayerArray.length; i++) {
      // Loop over all neurons in the current layer
      for (let j = 0; j < this.maxLayerArray[i]; j++) {
        const fromNeuron = `${i}-${j}`;
        // Loop over all neurons in the next layer
        for (let k = 0; k < this.maxLayerArray[i + 1]; k++) {
          const toNeuron = `${i + 1}-${k}`;
          this.setWeightInit(fromNeuron, toNeuron, this.randomNormal());
          // Set the bias for the current neuron in the next layer
          this.setBiasInit(toNeuron, this.randomNormalBias());
        }
      }
    }

// Make sure all the inputs and outputs have weights and biases //////////HERE

for (let i = 0; i < this.input_welcome_list.length; i++) {
  var currentNeuron = this.input_welcome_list[i];
  currentNeuron = currentNeuron.props.neuron;
  const nextLayerNeurons = this.output_welcome_list;
  
  //console.log('nextlayers', nextLayerNeurons)
  if (nextLayerNeurons.length > 0) {
    // Check if there are weights and biases between the current neuron and the next layer neurons
    nextLayerNeurons.forEach(neuron => {
      neuron = neuron.props.neuron;
      const key = `${currentNeuron.layer}-${currentNeuron.index}-${neuron.layer}-${neuron.index}`;
      if (!network.weights[key]) {
        // Generate weights and biases if they do not exist
        network.setWeight(currentNeuron, neuron, network.randomNormal());
        network.setBias(currentNeuron, network.randomNormalBias());
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
        50,
        125 + i * 150,  //125 + i * 100,
        `i-${i}`, 
        'i',
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

      var distanceFromCentre = Math.abs(i- 1)
      const outputNeuron = new Neuron(
        `output-${i}`,
        engine,
        400 - (distanceFromCentre * 55),
        190 + i * 175, //150 150
        `${this.maxLayers-1}-${i}`,
        this.maxLayers - 1,
        i,
        'output'
      );
      this.outputNeurons.push(outputNeuron);
    }
    
    /// kk And this next bit IS going to be silly. we are making a blank neuron to deal 
    // with the fact that the final neuron created collides where none of the others do
    // and I cannot work out why the flip that is happening.
    
    
    let blank_neuron = new Neuron(
      `Blank`,
      engine,
      2000,
      2000,
      `Blank`,
      'Blank',
      'Blank',
      'Blank'
    )

    //let blank_welcome = blank_neuron.Welcome({self: blank_neuron})
   
    this.outputNeurons.push(blank_neuron);
    this.blankNeuron = blank_neuron.Welcome({self: blank_neuron})

    
 

    // Add the input and output neurons to the neural_array and neural_welcome_list
    this.neural_array.unshift(...this.inputNeurons);
    this.neural_array.push(...this.outputNeurons);
    //this.neural_array.push(blank_neuron)
  
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

      
    this.outputNeurons = this.outputNeurons.filter(function(neuron) {
      return neuron.type !== 'Blank'
  }) 


    // Remove the stupid blank neuron
    this.neural_welcome_list = this.neural_welcome_list.filter(function(img) {
      return img.props.neuron.type !== 'Blank'
  }) 

    
  }
  

  async loadData(self) {

    function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array
  }

    const response = await fetch("\Iris_Data.csv");
    const data = await response.text();
    var rows = data.split("\n").slice(1);
    
    var processedData = rows.map(row => {
      
      const columns = row.split(",");

      const sepalLength = parseFloat(columns[0]);
      const sepalWidth = parseFloat(columns[1]);
      const petalLength = parseFloat(columns[2]);
      const petalWidth = parseFloat(columns[3]);
      const species = columns[4];

      if (isNaN(sepalLength) || isNaN(sepalWidth) || isNaN(petalLength) || isNaN(petalWidth)) {
          return null;
        }

        return {
          sepalLength: sepalLength,
          sepalWidth: sepalWidth,
          petalLength: petalLength,
          petalWidth: petalWidth,
          species: species
        };
      });

    processedData = processedData.filter(row => row !== null);
    
    processedData = shuffleArray(processedData)
    console.log('Processed Data: ', processedData)
    self.irisData = processedData;
    return processedData;
  }
 




/// Rendering


updateHtmlRender(layers, layerArray) {

  console.log('layaz: ', layers, layerArray)

  //Remove the silly blank neuron if it is hanging around

  this.neural_welcome_list = this.neural_welcome_list.filter(neuron => {
    return neuron.props.neuron.layer !== 'Blank';
  });
  


const nullLayerArray = layerArray[1].map(num => Array(num).fill(null));

const propslist = [];

nullLayerArray.forEach((innerArray, outerIndex) => {
innerArray.forEach((_, innerIndex) => {

var distanceFromCentre = Math.abs(innerIndex - 2)
const neurProps = {
name: 'Update_Neur' + outerIndex + '_' + (innerIndex),
position_x: 300 + (outerIndex * 175) - (15 * distanceFromCentre ** 2),
position_y: 700 - 175 * innerIndex, // 500 100
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


//console.log('Final Ns: ', this.neural_welcome_list)

const hiddenLayerArray = layerArray[1]


//console.log('Layer:array ', layerArray)

const expected_neuron_total = Number(network.inputLayers) + hiddenLayerArray.reduce((prev, next) => prev + Number(next), 0)  + Number(network.outputLayers);

//console.log('Neuron_total: ', expected_neuron_total)
const start = this.neural_welcome_list.length - expected_neuron_total


if (start > 0) {
this.neural_welcome_list.splice(expected_neuron_total, start)
}

var filteredArray = this.neural_welcome_list.filter(element =>
  typeof element === 'object' && 'type' in element && element.type === 'img'
);

this.neural_welcome_list = filteredArray;

//console.log('hidden_layer_array', hiddenLayerArray)
var finalLayerIndex = 0

//console.log('Final Layers indices: ', this.currentFinalLayerIndex, finalLayerIndex)

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

  var distanceFromCentre = Math.abs(i- 1)

  this.output_welcome_list[i].props.neuron.wire.position.x = 400 + (finalLayerIndex * 175) - (distanceFromCentre * 55);

  const newStyle = Object.assign({}, this.output_welcome_list[i].props.style, { left: `${363 + (finalLayerIndex * 175) - (distanceFromCentre * 55)}px` });
  const newProps = {...this.output_welcome_list[i].props, style: newStyle};
  this.output_welcome_list[i] = {...this.output_welcome_list[i], props: newProps};

  console.log(' Checking OUTPUTS post position WIIIRE: ' , this.output_welcome_list[i].props.neuron.wire.position.x)
  console.log(' Checking OUTPUTS post position IIMG: ' , this.output_welcome_list[i].props.style.left)
} 
}


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


//Reinstate the silly blank neuron if it isn't there.
if (!this.neural_welcome_list.some(neuron => neuron.props.neuron.layer === 'Blank')) {
  this.neural_welcome_list.push(this.blankNeuron);
}





this.setState({htmlRender: this.neural_welcome_list});

}



updateSaltRender(network, epochNum, setepochNum, numSalts, setnumSalts, saltList, setsaltList, outputSaltCountCallback, inputAndOrState) {
  
  if (network.irisData) {
  var current_flower = network.irisData[epochNum];

  try {var sepalLength = current_flower.sepalLength;}

  catch(error) 

  { //network.loadData(); //maybe just shuffle this? the load did a fail, but i think a shuffle woudl b fine.
    setepochNum(0); 
    var current_flower = network.irisData[0];
    var sepalLength = current_flower.sepalLength;}

  var sepalWidth = current_flower.sepalWidth;
  var petalLength = current_flower.petalLength;
  var petalWidth = current_flower.petalWidth;



  const scalingFactor = 2; // Adjust the scaling factor as desired



  var total_current_salt = Math.round((sepalLength + sepalWidth + petalLength + petalWidth) * scalingFactor);

  numSalts = total_current_salt 
  setnumSalts(numSalts)

  var anOutputNeuron = network.outputNeurons[0];


  if (numSalts > saltList.length) {

  // Create new salt objects and render them
  const newSaltRenderList = [];
  var initNeuron = null;

  for (let i = saltList.length; i < numSalts; i++) {

    // Calculate the proportions of salt for each input feature
    
    const sepalLengthProportion = sepalLength / total_current_salt * scalingFactor;
    const sepalWidthProportion = sepalWidth / total_current_salt * scalingFactor;
    const petalLengthProportion = petalLength / total_current_salt * scalingFactor;
    const petalWidthProportion = petalWidth / total_current_salt * scalingFactor;
  
    // Determine the number of salt objects for each input feature
    const sepalLengthSalt = Math.round(numSalts * sepalLengthProportion);
    const sepalWidthSalt = Math.round(numSalts * sepalWidthProportion);
    const petalLengthSalt = Math.round(numSalts * petalLengthProportion);
    const petalWidthSalt = Math.round(numSalts * petalWidthProportion);
  
    // Place the salt objects in the corresponding neurons
    if (i < sepalLengthSalt) {
      initNeuron = this.input_welcome_list[0].props.neuron;
    } else if (i >= sepalLengthSalt && i < sepalLengthSalt + sepalWidthSalt) {
      initNeuron = this.input_welcome_list[1].props.neuron;
    } else if (i >= sepalLengthSalt + sepalWidthSalt && i < sepalLengthSalt + sepalWidthSalt + petalLengthSalt) {
      initNeuron = this.input_welcome_list[2].props.neuron;
    } else if (i >= sepalLengthSalt + sepalWidthSalt + petalLengthSalt && i < numSalts) {
      initNeuron = this.input_welcome_list[3].props.neuron;
    }
 
  

  let salt = new Salt("Salty_" + i, engine, outputSaltCountCallback, initNeuron, anOutputNeuron);
  newSaltRenderList.push(<salt.Welcome self={salt} key={i} />);
}

  // Concatenate the new salt render list with the existing salt list
  this.saltBag.setSaltList(newSaltRenderList) // this.saltBag.saltList.concat(newSaltRenderList));
  } else if (numSalts < saltList.length) {
  // Remove excess salt objects from the salt list
  this.saltBag.setSaltList(this.saltBag.saltList.splice(numSalts, saltList.length - numSalts));
  }

  setsaltList(this.saltBag.saltList)
}
}
}


/// Instantiate The Objects


let network = new Network('TheNet')
network.initializeWeightsAndBiases();


//////// The Salt Sim

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

  const [graphTime, setgraphTime] = useState(false);

  const [gradTrackTime, setgradTrackTime] = useState(false);
  const [currentGradients, setcurrentGradients] = useState({});

  const [vizData, setvizData] = useState({});
  const [neuronGraph, setneuronGraph] = useState(null);

  const [Start, setStart] = useState(false)

  const [epochNum, setepochNum] = useState(0);
  const [epochEnd, setepochEnd] = useState(false);

  const [currentTarget, setcurrentTarget] = useState(null);

  const [trainingScore, settrainingScore] = useState(0);

  const [learningRate, setLearningRate] = useState(0.3);

  const [frozenLayers, setFrozenLayers] = useState([]);
  const [freezeButtons, setfreezeButtons] = useState(<div/>);



  const handleInputAndOrStateChange = (inputAndOrState) => {
    setInputAndOrState(inputAndOrState)
  }
  const handleOutputAndOrStateChange = (outputAndOrState) => {
    setOutputAndOrState(outputAndOrState)
  }

  const outputSaltCountCallback = useCallback(() => {
    setoutputSaltCount(<network.OutputSaltCounts self = {network}/>)
  }, []);

  const updateHtmlRenderCallback = useCallback(() => {
    // Neurons
    network.updateHtmlRender(numLayers, layerArray); 
    setnetState(<network.Welcome self={network} />)
    outputSaltCountCallback();
    
    //Connection visualisation stuff
    const visualizationData = generateVisualizationData(network);
    createD3Visualization(network, visualizationData.validConnections, visualizationData.nodes, visualizationData.links, graphTime);
    setvizData(visualizationData)    

  }, [numLayers, layerArray]);

  const updateFrozenButtonsCallback = useCallback(() => {
    const tempfreezeButtons = network.neural_welcome_list.reduce(
      (acc, neuron) => {
        const layer = neuron.props.neuron.layer;
        const x = neuron.props.neuron.x;

        // Check if the layer is 'Blank' or 11
        if (layer === 'Blank' || layer === 11) {
          return acc;
        }
    
        // Check if a FrozenLayerButton already exists for this layer
        if (!acc[layer]) {
          // If not, create a new FrozenLayerButton and add it to the accumulator
          acc[layer] = (
            <div key={layer}>
              <FrozenLayerButton layerIndex={layer} x_position={x} setfrozenLayers={setFrozenLayers}/>
            </div>
          );
        }
    
        return acc;
      },
      {}
    );
    
    // Render only the FrozenLayerButtons without duplicates
    const uniqueFrozenButtons = Object.values(tempfreezeButtons).map((button, index) => (
      <React.Fragment key={index}>{button}</React.Fragment>
    ))
    
    setfreezeButtons(uniqueFrozenButtons);
    //console.log('freeze: ', freezeButtons)
  }, [numLayers, layerArray]);
  

  
  const updateConnectionsCallback = useCallback(() => {

    network.neural_welcome_list.forEach(img => {
      let neuron = img.props.neuron;
      neuron.vizData = vizData;
    });

    const connections = d3.selectAll(".connection")
    connections.style("stroke", d => d.colour)
    .attr("stroke-width", d => d.width);
  })
  

  const getCurrentTargetCallback = useCallback(() => {

    try {
      if (network.irisData[epochNum]) {
        var currentFlower = network.irisData[epochNum]
        var target = 'x'
        
    
        if (currentFlower.species === "Iris-setosa\r") {
          target =  0;
        } else if (currentFlower.species === "Iris-versicolor\r") {
          target =  1;
        } else if (currentFlower.species === "Iris-virginica\r") {
          target = 2;
        }

        setcurrentTarget(target);
        network.currentTarget = target;

      }
    } catch (error) {
      console.log('I think this is just saying the data has not loaded yet')
      console.error(error);
    }
    return target
})
    
  

  const checkEpochStateCallback = useCallback(() => {
    /// Setting the condition that signals the end of the epoch.
    // Potench there should be a timed component as well
    // cus can fully see it bugging and a salt not quite making it to the end.

    if (network.outputSaltTotal >= numSalts && numSalts > 0) {
    setepochEnd(true)
      }
    })


    const endOfAnEpochCallback = useCallback(() => {

      //
      outputSaltCountCallback();

      if (epochEnd === true) {
 
      ////// Backprop happens here
      
      
      //establish the outcome.
      
      //generate a label

      var target = getCurrentTargetCallback();

      //Calculate that loss

      


      //let learningRate = learningRate // 0.075; //0.0000005;

      backpropagation(network, numSalts, target, learningRate, frozenLayers, setcurrentGradients)  //////////
      

      //Add to the score for the user

      var outputNeurons = network.neural_welcome_list.filter(neuron => neuron.props.neuron.type === 'output');
  
      var outputSaltCounts = outputNeurons.map(img => img.props.neuron.saltCount)


      //Argmax
      var argmax = outputSaltCounts.reduce((maxIndex, currentValue, currentIndex) => {
        return currentValue > outputSaltCounts[maxIndex] ? currentIndex : maxIndex;
      }, 0);

      var trainingScoreZ = trainingScore;

      if (argmax === target) {trainingScoreZ = trainingScoreZ + 1;}

      settrainingScore(trainingScoreZ);
      

      //Store the prediction
      network.irisData[epochNum].prediction = argmax;


      //////////////////////////////////////////////////////////////////////////
      

      //update connection viz

      const visualizationData = generateVisualizationData(network);
      createD3Visualization(network, visualizationData.validConnections, visualizationData.nodes, visualizationData.links);
      setvizData(visualizationData)

     // Come tomorrow we are really properly actually getting on backprop.

     // We maybe need to rearrange how the saltcounts work, 
     // because I think that really we want to have saltpressure be constant
     // and not decrease because salt has left a neuron.
     // if there has been salt in a neuron at any point, then it should contribute to the salt pressure.
     // this also means we'll have a record of the 'activation' of any individual neuron.
     // which we can use for backpropping.


      //Reset all the salt.

      let saltObjects = network.saltBag.saltList.map(img => img.props.self);

      saltObjects.forEach(salt => {
          
          
          salt.engine.world.bodies.forEach((body, i) => {
            if (body === salt.wire) {
                salt.engine.world.bodies.splice(i, 1);
            }
          });
          
          try {Matter.World.remove(salt.engine.world, salt.wire);}
          catch (error) {}

          try {
            let saltHTML = salt.htmlID;

            for (const prop in salt) {
              salt[prop] = null;
            }

          saltHTML.parentNode.removeChild(saltHTML);
        }

          catch (error) {}

          
          
      });
 
      saltObjects = [];
      network.saltBag.saltList = [];

      setsaltList([]);

      network.neural_welcome_list.forEach(img => {
         let neuron = img.props.neuron;
        neuron.saltCount = 0;
        neuron.everSalt = 0;
      });


      setepochNum(epochNum + 1)

      setepochEnd(false)

      console.log(network)
    }
  })


  const updateSaltRenderCallback = useCallback(() => {
    network.updateSaltRender(network, epochNum, setepochNum, numSalts, setnumSalts, saltList, setsaltList, outputSaltCountCallback, inputAndOrState); 
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
      style={{ position: "absolute", left: `${(position*0.98)+horizontalSliderLeft}px`, top: '70%', height: 75 }}
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


  vertSlides = vertSlides.slice(0,numLayers)

  setverArray(vertSlides)

  return ( null )

  }


              

  return ( null );

}


    function physics() {

        setStart(true);
        
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

          if (Start === true) {


          // Trying to delete the dead ones
          saltList = saltList.filter(salt => salt.props.self.engine);
          //console.log('Salt CHeck: ', saltList)

          saltList.forEach((salt, index) => {
            // Update the current and previous neurons for the salt
            salt.props.self.updateCurrentNeuron(salt.props.self, network);

            // Calculate the next layer neurons for the salt
            if (neurons && salt.props.self.currentNeuron) {
              const nextLayerNeurons = getNextLayerNeurons(salt.props.self.currentNeuron, neurons, network);
              // Pass the next layer neurons and salt count to the head_towards function
  
              salt.props.self.head_towards(salt.props.self, nextLayerNeurons, network); 
              
            }
            
            if (salt.props.self.currentNeuron === null) {
              salt.props.self.head_init(salt.props.self, network)
            }

            // Update the position of the salt
            salt.props.self.update_pos(salt.props.self, network);
  
          });
        }
        } catch (error) {
          console.error(error);
        }
        requestAnimationFrame(() => updateSaltPositions(saltList, neurons, network));
      }

      network.saltBag.saltList = network.saltBag.saltList.filter(salt => salt.props.self.engine);

      updateSaltPositions(saltList, network.neural_welcome_list, network);

      useEffect(() => {
        network.saltBag.saltList = network.saltBag.saltList.filter(salt => salt.props.self.engine);
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
              // Generate weights if they do not exist
              network.setWeightInit(currentNeuron.id, neuron.id, network.randomNormal());
            }
            if (!network.biases[neuron.id]) {
              // Generate biases if they do not exist
              network.setBiasInit(neuron.id, network.randomNormalBias());
            }
          });
        }

        return nextLayerNeurons;
      } 



      function getFirstAvailableLayer(currentLayer, neurons) {
        if (currentLayer === 'i') {currentLayer = -1}
        for (let i = currentLayer + 1; i < network.maxLayerArray.length; i++) {
          const layerNeurons = neurons.filter(neuron => neuron.props.neuron.layer === i);
          if (layerNeurons.length > 0) {
            return layerNeurons;
          }
        }
        // If there are no more layers, return an empty array
        return [];
      }

    /// Frozen Layer Button

    function handleFrozenLayerButtonClick(layerIndex) {
      setFrozenLayers((prevState) => {
        if (prevState.includes(layerIndex)) {
          return prevState.filter((index) => index !== layerIndex);
        } else {
          return [...prevState, layerIndex];
        }
      });
    }
    


    
    useEffect(() => {
      // Call the sliderLoad() function after the horizontal slider has been rendered:
      updateVerSliders();
    }, [numLayers, layerArray]);


    
    useEffect(() => {
      updateHtmlRenderCallback()
      updateFrozenButtonsCallback()
    }, [verArray]);


    
    useEffect(() => {
      updateConnectionsCallback()
    }, [vizData])
    
    useEffect(() => {
      updateSaltRenderCallback();
      getCurrentTargetCallback();
    }, [numSalts, saltList]);

    useEffect(() => {
    checkEpochStateCallback();
    }, [outputSaltCount]) 

        useEffect(() => {
    endOfAnEpochCallback();
    }, [epochEnd]) 

    useEffect(() => {
    getCurrentTargetCallback();
    }, [epochNum])

    /*

    useEffect(() => {
      //currentTarget Check
      //alert('use check: ' + currentTarget); // check the value of currentTarget here
      //setoutputSaltCount(<network.OutputSaltCounts self = {network} currentTarget = {currentTarget} />)

    }, [currentTarget]);

    */

    useEffect(() => {
      if (graphTime) {
        graphing(network)
        const visualizationData = generateVisualizationData(network)
        createD3Visualization(network, visualizationData.validConnections, visualizationData.nodes, visualizationData.links, graphTime);
        setvizData(visualizationData)    
      }
      else {
        //clean the graph
        var svg = d3.select('#Data_Graph').selectAll("*");
        svg.remove()

        //clean the nodes
        svg = d3.select("#network-viz")
        let nodeGroup = svg.select("g.nodes").selectAll("circle");
        nodeGroup.remove()
        //const visualizationData = generateVisualizationData(network)
        //createD3Visualization(network, visualizationData.validConnections, visualizationData.nodes, visualizationData.links, graphTime);
        //setvizData(visualizationData)    
      }
  
      }, [graphTime, epochNum])

      useEffect(() => {
        if (gradTrackTime) {


          if (Object.keys(currentGradients).length > 0) {
          console.log('Gradients', currentGradients)

          let weightGrads = currentGradients.weightLossGradients;
          let biasGrads = currentGradients.Gradients;


          let svg; 
          if (!svg) { 
            svg = d3.select("#network-viz") 
              .append("svg") 
              .attr("width", 600) 
              .attr("height", 1250)
              .style("position", "absolute")
              .style("left", "1500px")
              .style("top", "100px"); 
          }

            
          // Create the gradient lines
          const gradientLines = svg.append("g")
          .attr("class", "gradient-lines");
          //const weightgradientLines = svg.append("g")
          //.attr("class", "gradient-lines");

          //const colors = ["#9dc0cf", "#f5be49"];

          //["#005aa7", "#4393c3", "#92c5de",  
          //"#d53e4f",  "#f46d43", "#fdae61"
          
          let totalEpochs = 150 // At some point change this so that it is however many samples are total.
          
          //const colorScale = d3.scaleSequential()
          //  .domain([0, totalEpochs]) 
          //  .interpolator(d3.interpolateRgb("#9dc0cf", "#f5be49", "#000000", "#d53e4f",  "#f46d43", "#fdae61", "#000000")); 
          

          
          //const colorScale = d3.scaleSequential() 
          //  .domain([0, totalEpochs])  
          //  .interpolator(d3.interpolateHsl(360, 1, 0.5, 360, 1, 0.8));  
          
          const layerColors = ["#9dc0cf", "#f5be49", "#d53e4f"]; 

          const colorScale = d3.scaleSequential()
            .domain([0, totalEpochs]) 
            .interpolator(d3.interpolateRgb(...layerColors));

          const hueShiftScale = d3.scaleLinear()
            .domain([0, totalEpochs])
            .range([-100, 100]);

          const biaslayerKeys = Object.keys(biasGrads);
          const weightlayerKeys = Object.keys(weightGrads);

          const layerForKey = key => {
            if (key.startsWith('i-')) return 0; 
            return parseInt(key.split('-')[0]) + 1; 
          }

          // Append circles for the bias gradients
          gradientLines.selectAll("circle.bias")
          .data(Object.values(biasGrads))
          .enter()
          .append("circle") 
          .attr("class", "bias")
          .attr("cx", (d, i) => -(i * 9) + 200) 
          .attr("cy", d => 100 - d*50)       
          .attr("r",  5 - (epochNum / 50))
          .attr("opacity", 0.25) 
          .attr("fill", (d, i) => {
            const key = biaslayerKeys[i];
            var layerColor = layerColors[layerForKey(key) % layerColors.length]; 
            //alert(layerForKey(key))
            if (layerForKey(key) === 12) {layerColor = '#000000'};
    
            const hslColor = d3.rgb(layerColor); 
            const hueShift = hueShiftScale(epochNum);
            hslColor.h += hueShift;
            return d3.rgb(hslColor); 
            })
            .raise();  //.brighter(colorScale(epochNum)) 
          
          //alert(brightnessScale(epochNum))

          gradientLines.selectAll("circle.weights")    
          .data(Object.values(weightGrads))
          .enter()
          .append("circle") 
          .attr("class", "weights")
          .attr("cy", (d, i) => (i * 9) + 30) 
          .attr("cx", d => 400 - d*50)       
          .attr("r", 5 - (epochNum / 50))
          .attr("opacity", 0.25) 
          .attr("fill", (d, i) => {
            const key = weightlayerKeys[i];
            var layerColor = layerColors[layerForKey(key) % layerColors.length];
            if (layerForKey(key) === 0) {layerColor = '#77DD77'}; 

            const hslColor = d3.rgb(layerColor); 
            const hueShift = hueShiftScale(epochNum);
            hslColor.h += hueShift;
            return d3.rgb(hslColor); 
            })
          .raise(); 
          //console.log('Here?')

          

          /*

          const gradientLines = svg.append("grad_lines") 
            .attr("class", "gradient-lines");

          console.log('Make it this far?')
          
          gradientLines.append("path") 
            .attr("class", "weights-line"); 
          
          gradientLines.append("path") 
            .attr("class", "biases-line");  

          gradientLines.select(".weights-line") 
            .attr("d", weightLineGenerator(weightGrads)); 
          
          gradientLines.select(".biases-line") 
            .attr("d", biasLineGenerator(biasGrads));

          */

          //graphing(network)
          //const visualizationData = generateVisualizationData(network)
          //createD3Visualization(network, visualizationData.validConnections, visualizationData.nodes, visualizationData.links, graphTime);
          //setvizData(visualizationData)    
        }}
        else {
          //clean the graph
          var svg = d3.select('#gradient-lines').selectAll("*");
          svg.remove()
  
          //clean the nodes
          svg = d3.select("#network-viz")
          let nodeGroup = svg.select("g.nodes").selectAll("circle");
          nodeGroup.remove()

        }
    
        }, [gradTrackTime, epochNum])

      useEffect(() => {
        //getCurrentTargetCallback();
        setneuronGraph(engine.neuronGraph)      //<NeuronGraph weight={1} bias={0}/>)
        }, [engine.neuronGraph])
    

      

    return (
  
      
  
        <div className="container" id="container">

        

          {<div className = "network-viz" id="network-viz"> HERE</div>
          }   
      <div className ="ButtonMenu" id='buttons' style={{margin: '0', padding: '0px'}} >

        
      <h1 > Translation is Liquid</h1>
      <p> {trainingScore} / {epochNum} </p>

      

      
   

        <button onClick={physics}>Start this jam</button> 

        <Button variant="contained" color="primary" onClick={() => {setnumSalts(numSalts + 1); 
          getCurrentTargetCallback(); 
          outputSaltCountCallback();}}>

          Add Salt
        </Button>
        
        <p>Salt Count: {numSalts}</p>

        <Button variant="contained" color="primary" 
        onClick={() => setgraphTime(!graphTime)}>
          Accuracy Plot
        </Button>

        <Button variant="contained" color="primary" 
        onClick={() => setgradTrackTime(!gradTrackTime)}>
          Gradient Tracking
        </Button>

        <div id="Data_Graph" style={{position: 'absolute', left: '1300px', top: '100px'}}></div>

      
        {netState}
        {outputSaltCount}
        {freezeButtons}

        
        <LearningRateSlider learningRate={learningRate} setLearningRate={setLearningRate} />
    

        <ToggleSwitch onInputAndOrStateChange={handleInputAndOrStateChange} 
        onOutputAndOrStateChange={handleOutputAndOrStateChange} />

        <SaveLoadButton network={network} numLayers={numLayers} layerArray={layerArray}/> 

        {neuronGraph}
        
        

        <Slider
          aria-label="Small steps"
          ref={horSliderRef}
          padding={'30px'}
          margin={'30px'}
          style={{width: '90%'}}
          defaultValue={10}
          step={1}
          min={0}
          max={10}
          marks
          valueLabelDisplay="auto"
          onChange={(_, value) => {setnumLayers(value); }}
        />
        
          {verArray}
          
      </div>
      </div>



      );
  }
  
  export default Salt_Sim;