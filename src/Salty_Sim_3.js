
//import './App.css';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useCallback } from 'react';

//This means that the information contained in the embedding will be a compromise between the detailed information in the input and output data, and the more abstract and general representation of the relationship between the input and output data that is learned by the model.




import FrozenLayerButton from './Salt_Sim_Files/FrozenLayerButton';


import * as d3 from 'd3';
import { createD3Visualization, generateVisualizationData } from './Salt_Sim_Files/D3_Visualization';


import updateSaltPositions from './Salt_Sim_Files/UpdateSaltPositions.worker';



import Network from './Salt_Sim_Files/Network';

import backpropagation from './Salt_Sim_Files/BackProp_Flower';

import graphing from './Salt_Sim_Files/Dataset_Graph';

import Network_Menu from './Salt_Sim_Files/NetworkMenu';


//import * as d3 from 'd3';

import Matter, { Events } from 'matter-js';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { useSlider } from '@mui/base';
import { dividerClasses } from '@mui/material';

import control_panel_img_1 from './Salt_Pics/Control_Panel_1_scaled.png';
import control_panel_img_2 from './Salt_Pics/Control_Panel_2_scaled.png';
import control_panel_img_3 from './Salt_Pics/Control_Panel_3_scaled.png';

import play_button_lever_img from './Salt_Pics/Play_button_Lever.png';
import play_button_back_img_1 from './Salt_Pics/Play_Button_Back_1.png';
import play_button_back_img_2 from './Salt_Pics/Play_Button_Back_2.png';


const control_panel_images = [
  control_panel_img_1,
  control_panel_img_2,
  control_panel_img_3
];

const play_button_back_images = [
  play_button_back_img_1,
  play_button_back_img_2
]


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

/*

// create a renderer
var render = null;

render = Render.create({
  element: document.body,
  engine: engine,
  background: 'blue',
  width: 1200
});  

Matter.Render.setPixelRatio(render, 0.5)

render.options.width = 2000;

*/
var runner = Runner.create();  ////////////////////////////////////////// Mabs make this conditional in some way.

var mouse_area = document.getElementById('buttons')

 // add mouse control
 var mouse = Mouse.create(mouse_area);

 /*
 Events.on(engine, 'afterUpdate', function() {
    
  
     if (!mouse.position.x) {
       return;
     }
 });
 
*/

let isMouseDown = false;

// chucked these in loose, don't know if they need a cleanup.
document.addEventListener('mousedown', () => {
  isMouseDown = true;
})

document.addEventListener('mouseup', () => {
  isMouseDown = false;
})


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


                let scaling_factor;
                
                if (isMouseDown) {
                  scaling_factor = 10;
                }
                else {
                  scaling_factor = 0;
                }

                var force_x = direction_x * Math.min(10, (1/(distance**2.25))) * scaling_factor;
                var force_y = direction_y * Math.min(10, (1/(distance**2.25))) * scaling_factor;

                body.force.x -= force_x;
                body.force.y -= force_y;
                
                //body.force.y += body.mass * 0.001;
                
                }
    }
});





/// Instantiate The Objects


let network = new Network('TheNet', engine, Composite)
network.initializeWeightsAndBiases();
network.updateBasedOnScreenSize();


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

  const [loadedModel, setloadedModel] = useState({});

  const [vizData, setvizData] = useState({});
  const [neuronGraph, setneuronGraph] = useState(null);

  const [Start, setStart] = useState(false)

  const [epochNum, setepochNum] = useState(0);
  const [epochEnd, setepochEnd] = useState(false);

  const [currentTarget, setcurrentTarget] = useState(null);

  const [trainingScore, settrainingScore] = useState(0);

  const [learningRate, setLearningRate] = useState(0.005);

  const [frozenLayers, setFrozenLayers] = useState([]);
  const [freezeButtons, setfreezeButtons] = useState(<div/>);

  const [controlPanelImageIndex, setControlPanelImageIndex] = useState(0);
  const [controlPanelImageHovered, setControlPanelImageHovered] = useState(false);
  const [controlPanelImageMouseDown, setControlPanelImageMouseDown] = useState(false);



    useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * control_panel_images.length);
      setControlPanelImageIndex(randomIndex);
    }, 230);
    
      return () => clearInterval(interval);
    }, []);

    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
      // Function to update window size on resize
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        network.updateBasedOnScreenSize()
        if (graphTime) {
          graphing(network)}
        updateHtmlRenderCallback()
      };
  
      // Add event listener on component mount
      window.addEventListener("resize", handleResize);
      handleResize()

  
      // Cleanup function to remove listener on unmount
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty dependency array ensures effect runs only once on mount



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
              <FrozenLayerButton layerIndex={layer} x_position={(x * 0.69) - 5} setfrozenLayers={setFrozenLayers}/>
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
  }) //Added visData to the dependency 27/09/23
  

  const getCurrentTargetCallback = useCallback(() => {

    try {
      if (network.irisData[epochNum]) {
        var currentFlower = network.irisData[epochNum]
        var target = 'x'
        
    
        if (currentFlower.species === "Iris-setosa") {
          target =  0;
        } else if (currentFlower.species === "Iris-versicolor") {
          target =  1;
        } else if (currentFlower.species === "Iris-virginica") {
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



    var target = getCurrentTargetCallback();


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
          
          try { console.log('bodies: ', network)
            Matter.World.remove(salt.engine.world, salt.wire);
          }
          catch (error) {console.log('The error: ', error)}

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

      // Double check all the salt are gone
      var saltDregs = network.engine.world.bodies.filter(dreg => dreg.salt === true);

      saltDregs.forEach(dreg => {
      Matter.World.remove(network.engine.world, dreg);
      })



      setepochNum(epochNum + 1)

      setepochEnd(false)

      console.log(network)
    }
  }, [epochEnd])   //Added in epochened as a dependency. Slight fear this means it won't update on the correct epoch.



  const updateSaltRenderCallback = useCallback(() => {
    network.updateSaltRender(network, epochNum, setepochNum, numSalts, setnumSalts, saltList, setsaltList, outputSaltCountCallback, inputAndOrState); 
    setnetState(<network.Welcome self={network} />)
  }, [saltList]);
  
  
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

  const numMarks = 8;
  const markPositions = [...Array(numMarks)].map((_, index) => (horizontalSliderWidth / (numMarks + 1)) * (index ));




  var vertSlides = markPositions.map((position, index) => (
    <Slider

      key={index}
      id ={'slide' + index}
      style={{ position: "absolute", left: `${((position * 1)) + (0.6 * (horizontalSliderWidth ** 0.75)-10)}px`, bottom: '10vh', 
                height: 75, transform: `scale(` + (0.25 * (windowSize.height ** 0.95)/100) + `)`}}
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

      

      if(!runner) { 
        runner = Runner.create();
      }

      // run the engine
      Runner.run(runner, engine);

      /*
      
      // run the renderer
      Render.run(render);
      if(!render) {
        render = Render.create({}); 
      }
      */

    }

    function physicsOff() {

      setStart(false);

      Runner.stop(runner); /// maybe should be (engine) or (runner, engine)
      //Render.stop(render);
      Engine.clear(engine);  // We took this out recently, not 100% sure if we want it or not
      //World.clear(world);
    
      // Remove existing canvas
      //render.canvas.remove(); 
      //render.canvas = null;
    
      // Reset render properties
      //render.context = null;
      //render.textures = {};
    
    }

    const togglePhysics = () => {

      if(Start) {
        physicsOff();
      } else {
        physics();
      }
    
    }
    

    ///// Transfering updatesaltpositions to being performed by a worker.

   // These had previously been two seperate use effects, one using saltList as the dependency
      // and the other using network.saltbag.saltList


    useEffect(() => { 
      
      network.saltBag.saltList = network.saltBag.saltList.filter(salt => salt.props.self.engine); 

      var updateSaltPositionsAnimationFrame = updateSaltPositions(saltList, network.neural_welcome_list, network, Start); 
    
      return () => cancelAnimationFrame(updateSaltPositionsAnimationFrame)
    
    }, [saltList]);

/*
        // Function to handle messages from the worker
        const handleMessageFromWorker = (newSaltList) => {

          network.saltBag.saltList = newSaltList

          console.log('SaltWork', newSaltList);

        };

        useEffect(() => {

          setsaltList(network.saltBag.saltList);

        }, [network.saltBag.saltList]);

        // Create worker instance
        const saltWorker = new Worker(handleMessageFromWorker);



        
          // Attach the message handler to the worker
          //saltWorker.onmessage = handleMessageFromWorker;

          // Function to render and send data to the worker
          const render = () => {
            // Filter salt list
            const filteredSaltList = network.saltBag.saltList.filter(salt => salt.props.self.engine);

            console.log('SaltWork, In the render', filteredSaltList);

            // Send data to worker
            saltWorker.onmessage(
              filteredSaltList,
              network.neural_welcome_list,
              network,
              Start,
            );

            // Draw scene based on saltList
            // ... (your drawing code here)
          };

          setInterval(() => render(), 1000/60)
          // Call the render function when the saltList changes


        

        //requestAnimationFrame(() => updateSaltPositions(saltList, neurons, network))
        

   

      network.saltBag.saltList = network.saltBag.saltList.filter(salt => salt.props.self.engine);

      //Originally where updateSaltPositions was called
      updateSaltPositions(saltList, network.neural_welcome_list, network);

      useEffect(() => {
        network.saltBag.saltList = network.saltBag.saltList.filter(salt => salt.props.self.engine);
        setsaltList(network.saltBag.saltList);
      }, [network.saltBag.saltList]);
  */ 
      




    /// Frozen Layer Button                 //// Is this inactive?

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
    }, [numLayers, layerArray, windowSize]);


    
    useEffect(() => {
      updateHtmlRenderCallback()
      updateFrozenButtonsCallback()
    }, [verArray, loadedModel]);


    
    useEffect(() => {
      updateConnectionsCallback()
    }, [vizData])
    
    useEffect(() => {
      updateSaltRenderCallback();
      getCurrentTargetCallback();
    }, [saltList]);

    useEffect(() => {
    checkEpochStateCallback();
    }, [outputSaltCount]) 

        useEffect(() => {
    endOfAnEpochCallback();
    getCurrentTargetCallback();
    }, [epochEnd])  // Used to have epochNum in the dependency.

    /*    /// 26/09/2023 1:24 merged with the above, hopefully does not fuck things
    useEffect(() => {
    getCurrentTargetCallback();
    }, [epochNum])
    */

    /*

    useEffect(() => {
      //currentTarget Check
      //alert('use check: ' + currentTarget); // check the value of currentTarget here
      //setoutputSaltCount(<network.OutputSaltCounts self = {network} currentTarget = {currentTarget} />)

    }, [currentTarget]);

    */

    useEffect(() => {
      if (graphTime) {
        console.log('Iris data in main: ', network)
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

              /// HEre

          let svg; // Tjis conditional seems weird and mayeb unnecessary. 
          let svgWidth = 0;
          if (!svg) { 

              svg = d3.select("#svg-container")

              // Get the width of the parent div
              svgWidth = svg.node().getBoundingClientRect().width;

              //d3.select("#network-viz") 
              svg.append("svg") 
              .attr("width", "100%") 
              .attr("height", svgWidth);

    
              //.style("left", "1500px")
              //.style("top", "100px")
          }

          

            
          // Create the gradient lines
          const biasGradientLines = svg.append("g")
          .attr("class", "gradient-lines")
          .style("position", "absolute");
          
          const gradientLines = svg.append("g")
          .attr("class", "gradient-lines")
          .attr("left", 500)
          .style("position", "absolute")
          

          //.attr("transform",
          //"scaleX(0.1)");
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
          biasGradientLines.selectAll("circle.bias")
          .data(Object.values(biasGrads))
          .enter()
          .append("circle") 
          .attr("class", "bias")
          .attr("cx", (d, i) => -(d * 50) + 70 )   // .attr("cx", (d, i) => -(d * 9) + 70 )
          .attr("cy", (d, i) => 100 + i*500 / Object.values(biasGrads).length)       
          .attr("r",  (5 - (epochNum / 50)) / 1.5 ) 
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
          .attr("cx", d => svgWidth - 75 - d*50)  // .attr("cx", d => svgWidth - 75 - d*10) 
          .attr("cy", (d, i) => 100 + (i * 500) / Object.values(weightGrads).length) 
          .attr("r", (5 - (epochNum / 50)) / 2)
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
    

    const [networkMenuOpen, setNetworkMenuOpen] = useState(false);


    //console.log('World in salt sim: ', engine.world)
    /* you're gunna have 2 come up with 2 different renderigns. One for mob, one for main*/

    return (
  
      
  
      <div className="container" id="container" style={{width:'100%', height:'100%'}}>

        
        <div 
          className = "network-viz" id="network-viz" 
          style={{height: '100%', width: '100%', position: 'absolute', 
          top: '2.5vh', left: '5vh',
          transform: 'scale(0.5)', transformOrigin: 'top left'}}>

            {netState}
            {outputSaltCount}


        </div>
             
      <div className ="ButtonMenu" id='buttons' style={{height: '100%', width: '100%', position: 'relative', top: '0%', left: '0%'}} >

      <div id="Data_Graph" style={{position: 'absolute', right: '5%', top: '5%'}}></div>

      <div id="Holder_Of_Controls" 
      
      style={{
        position: 'relative', bottom: '0%', left: '0%',
        width: '100%', height: '100%'
      }}>

      <button
        style={{
          position: 'absolute',
          bottom: '7.5%',
          right: '1%',
          height: '20vh',
          width: '20vh',
          padding: 0,
          margin: 0,
          border: 'none', // Remove any unwanted borders
          backgroundColor: 'transparent', // Make it transparent if needed
        }}
      >
        <img
          style={{pointerEvents: 'auto', 
                  height: '100%',
                  width: '100%',
                  transform: `
                              ${controlPanelImageHovered ? 'rotate(25deg)' : ''}  
                              ${controlPanelImageMouseDown ? 'scale(0.9)' : ''}
                            `}}

          onClick={() => setNetworkMenuOpen(!networkMenuOpen)}

          onTouchStart={() => {setNetworkMenuOpen(!networkMenuOpen)
                                setControlPanelImageMouseDown(true)}}
          onTouchEnd={() => setControlPanelImageMouseDown(false)}

          onMouseEnter={() => setControlPanelImageHovered(true)}
          onMouseLeave={() => setControlPanelImageHovered(false)}
          onMouseDown={() => setControlPanelImageMouseDown(true)}
          onMouseUp={() => setControlPanelImageMouseDown(false)}

          src={control_panel_images[controlPanelImageIndex]} 
          alt="Control Panel"
        />

      </button>
      
      <Network_Menu
        networkMenuOpen={networkMenuOpen}
        trainingScore={trainingScore}
        epochNum={epochNum}
        togglePhysics={togglePhysics}
        play_button_back_images={play_button_back_images}
        controlPanelImageIndex={controlPanelImageIndex}
        Start={Start}
        play_button_lever_img={play_button_lever_img}
        numSalts={numSalts}
        setgraphTime={setgraphTime}
        graphTime={graphTime}
        setgradTrackTime={setgradTrackTime}
        gradTrackTime={gradTrackTime} 
        learningRate={learningRate}
        setLearningRate={setLearningRate}
        network={network}
        numLayers={numLayers}
        layerArray={layerArray}
        setloadedModel={setloadedModel}
        loadedModel={loadedModel}
      />

        
        <div style={{ pointerEvents: 'auto', position: 'absolute', bottom: '10%', left: '0vw', width: '80%'}}>
          
          {verArray}

          <Slider
            aria-label="Small steps"
            ref={horSliderRef}
            padding={'30px'}
            margin={'30px'}
            style={{width: '100%', left: /*'-3.5%'*/ '5%'}}
            defaultValue={2}
            step={1}
            min={0}
            max={8}
            marks
            valueLabelDisplay="auto"
            onChange={(_, value) => {setnumLayers(value); }}
            
          />

          {freezeButtons}

          <div style={{ pointerEvents: 'none', position: 'absolute', top: '-20vh', left: '-5vw', transform: 'scale(0.7)' }}>

            {neuronGraph}

          </div>
            
            
        </div>

      </div>
      </div>
      </div>



      );
  }
  
  export default Salt_Sim;