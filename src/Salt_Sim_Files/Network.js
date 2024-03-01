
import Neuron from './Neuron';

import Salt from './Salt';


import NeuronGraph from './Neuron_WB_Graph';


import Iris_Data_Import from './Iris_Data.csv';

//import ToggleSwitch from './Salt_Sim_Files/ToggleSwitch';

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
    constructor(name, engine, Composite) {
  
      this.name = name;
      this.htmlID = this.name + 'ID';

      this.engine = engine;

      this.Composite = Composite;

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
  
    
    //// The welcome appears to call every sample. This potentially is the source of the 
    // gradual build up of lagggggggg 29/02/2024
  
    Welcome({self}) {
      return <div>{self.saltBag.saltList}{self.state.htmlRender}
      </div>;
    }
  
    OutputSaltCounts({self}) {
      const outputNeurons = self.neural_welcome_list.filter(neuron => neuron.props.neuron.type === 'output');
      //console.log(outputNeurons)
  
      self.outputSaltTotal = outputNeurons.map(img => img.props.neuron.saltCount)
      .reduce((prev, next) => prev + next);
  
      var target = self.currentTarget;
  
      //alert('in the count: ' + target)
      return (
  
        <div>
          {outputNeurons.map((outputNeuron, index) => {
            const neuronPos = outputNeuron.props.style;
            //console.log(neuronPos)
            const saltCountStyle = {
              position: 'absolute',
              left: parseInt(neuronPos.left) + 75 + '%', // Position the text to the right of the neuron image
              top: parseInt(neuronPos.top) + 5 + '%',
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
      return normal * 0.5; // Scaling to range [0, 10] // I think // mayube
      // No scaling here anymore. We're  now doing that in the activation itself.
        // And aiming to keep weights and biases between -1 and 1.
        // no we're now going with 0.5 and - 0.5, because that leads to less activation saturation 
        // I.e 0 weight, so flat line, and that flat line is purely at the top or bottom
  
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
        
        const outputNeurons = this.output_welcome_list;
        
        for (let i = 0; i < this.input_welcome_list.length; i++) {
        
            var initNeuron = this.input_welcome_list[i];
            initNeuron = initNeuron.props.neuron;
        
        
        
            // Adding in a section to ensure fresh input layer weights and biases on 'load randomly initialised model'
        
            // add a bias
        
            
            // then Something about for i in layer 0 neurons. add a weight
        
            for (let j = 0; j < this.maxLayerArray[0]; j++) {
            const toNeuron = `${0}-${j}`;
            //const key = `${currentNeuron.layer}-${currentNeuron.index}-${toNeuron}`;
            this.setWeightInit(initNeuron.id, toNeuron, this.randomNormal());
            this.setBias(initNeuron, this.randomNormalBias());
            }
        
            
            //console.log('nextlayers', nextLayerNeurons)
            if (outputNeurons.length > 0) {
            // Check if there are weights and biases between the current neuron and the output neurons
            outputNeurons.forEach(neuron => {
                var outputNeuron = neuron.props.neuron;
                //key = `${currentNeuron.layer}-${currentNeuron.index}-${neuron.layer}-${neuron.index}`;
                //if (!network.weights[key]) { ////// Removed this conditional for purposes of loading random model.
                // Generate weights and biases if they do not exist     // May need to be put back. lets find out.,
                this.setWeight(initNeuron, outputNeuron, this.randomNormal());
                
                //}
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
          this.engine,
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
          this.engine,
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
        this.engine,
        -200,
        -200,
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
  
      const response = await fetch(Iris_Data_Import);
      const data = await response.text();
      const normalizedData = data.replace(/\r/g, '\n');  //A random carriage return '\r' was messing with the live site.
      var rows = normalizedData.split("\n").slice(1);
      
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
  
  var propslist = [];
  
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
  
    const wireToRemove = this.Composite.get(this.engine.world, neuron.props.neuron.wire.id, 'body');
    
    console.log('TO remove: ', wireToRemove)
    
    if (wireToRemove) {
      //console.log('World b4: ', engine.world)
      this.Composite.remove(this.engine.world, wireToRemove);
      //console.log('World afta: ', engine.world)
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
        var neur = new Neuron(neur_props.name, this.engine, neur_props.position_x, neur_props.position_y, neur_props.layer + '-' + neur_props.index, neur_props.layer, neur_props.index, 'hidden');
        //console.log(neur)
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
  
  const expected_neuron_total = Number(this.inputLayers) + hiddenLayerArray.reduce((prev, next) => prev + Number(next), 0)  + Number(this.outputLayers);
  
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
  
    this.output_welcome_list[i].props.neuron.wire.position.x = 
            (400 + (finalLayerIndex * 175) - (distanceFromCentre * 55)) * 0.1  * 0.8 * window.innerWidth /100;
  
    const newStyle = Object.assign({}, this.output_welcome_list[i].props.style, 
      { left: `${(363 + (finalLayerIndex * 175) - (distanceFromCentre * 55)) *0.1}%` });
  
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
   
    
  
    let salt = new Salt("Salty_" + i, this.engine, outputSaltCountCallback, initNeuron, anOutputNeuron);
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
  
  
  updateBasedOnScreenSize() {
    
    for (let i = 0; i < this.neural_welcome_list.length; i++) {
      this.neural_welcome_list[i].props.neuron.updateWireFromScreenSize(this.finalLayerIndex)
    }
    for (let i = 0; i < this.output_welcome_list.length; i++) {
      this.output_welcome_list[i].props.neuron.updateWireFromScreenSize(this.finalLayerIndex)
    }
    for (let i = 0; i < this.input_welcome_list.length; i++) {
      this.input_welcome_list[i].props.neuron.updateWireFromScreenSize(this.finalLayerIndex)
    }
  
  }
  
  
  }

export default Network