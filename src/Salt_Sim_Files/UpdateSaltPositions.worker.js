// This file was an attempt at putting the salt movements on to a seperate thread, using web workers.

// Something happened, and it subtly did change the salt dynamics, in a way that was kinda cool

// But ultimately you're not really sure if you did it right and just went back to the original use of 
    // requestanimationframe for updateSaltPositions()

// Did serve to move a tinnnny bit of code out from the main page tho, so guess that's kinda cool? 

// 15/09/2023 (oh wowe, almost halfway through september. Time u weirdo.)


function getFirstAvailableLayer(network, currentLayer, neurons) {
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

 function getNextLayerNeurons(currentNeuron, neurons, network) {
    const nextLayerNeurons = getFirstAvailableLayer(network, currentNeuron.props.neuron.layer, neurons);
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


export default function updateSaltPositions(saltList, neurons, network, Start) {
        
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
    
    
    return requestAnimationFrame(() => updateSaltPositions(saltList, neurons, network, Start));


  }





  /*export function Worker(onMessageHandler) {
  
    this.onmessage = function(saltList, neurons, network, Start) {
  
        const newSaltList = updateSaltPositions(saltList, neurons, network, Start);

        onMessageHandler(newSaltList);
    
      }
  
  } */