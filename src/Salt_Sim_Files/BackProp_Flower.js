import { 
  getExpectedOutputs,
  sigmoidDerivative,
  sigmoid,
  normaliseArray
} from './Back_Prop_Files/HelperFunctions.js';

import { 
  calculateLossList,
  calculateHiddenLayerGradients,
} from './Back_Prop_Files/CalculateGradients.js';

    

function updateWeightsAndBiases(network, Gradients, weightLossGradients, outputNeurons,
     learningRate, frozenLayers) {

    const hiddenNeurons = network.neural_welcome_list.filter(neuron => neuron.props.neuron.type !== 'Blank');  // neuron.props.neuron.type !== 'output' &&  (maybe we do need to update the final layers bias if the prev layer is grabbing it.)

    hiddenNeurons.forEach(hiddenNeuron => {

      //console.log('Current Neuron: ', hiddenNeuron.props.neuron.id)

      if (!frozenLayers.includes(hiddenNeuron.props.neuron.layer))
      
      {

      hiddenNeuron.props.neuron.connections.filter(conex_object => {

        const sourceNeuronId = hiddenNeuron.props.neuron.id;
        const targetNeuronId = conex_object.targetNeuronId;
      
        return (
          network.neural_welcome_list.some(neuron => neuron.props.neuron.id === sourceNeuronId) &&
          network.neural_welcome_list.some(neuron => neuron.props.neuron.id === targetNeuronId)
        );
      
      }).forEach(conex_object => { 


      const finalHiddenNeuronId = conex_object.targetNeuronId;

      if (finalHiddenNeuronId) {
      const source = hiddenNeuron.props.neuron.id;
      const target = finalHiddenNeuronId;
      const targetNeuron = network.neural_welcome_list.filter(neuron => neuron.props.neuron.id == finalHiddenNeuronId);
      
      //potench question the +1 by eversalt
      // potench question the [0]

      ///// Ahhhh this feels like nonsense? we're basing it off the eversalt of the target neuron?? 
      // kk we're changing that to source (/hidden), but les see what happens.

      /// Coming back to this legitimately months later //// 13/09/2023
      // mayhaps it was not nonsense and you need to involve the input and the ouput to work out the connection.


      var weightUpdate = learningRate * weightLossGradients[`${source}-${target}`] //* (1+hiddenNeuron.props.neuron.everSalt ** 0.5);
            // Why is this being rooted at the end?


      if (isNaN(weightUpdate) || !isFinite(weightUpdate)) {
        weightUpdate = 0
      }

      if (weightUpdate >= 10) {
        weightUpdate = 10
      }

      if (weightUpdate <= -10) {
        weightUpdate = -10
      }

      //alert(source + '-' + target + weightLossGradients[`${source}-${target}`] + 'salt:' + targetNeuron[0].props.neuron.everSalt + 'weoghtupdate' + weightUpdate)
      
      

      var biasUpdate = learningRate * Gradients[source]

      if (isNaN(biasUpdate) || !isFinite(biasUpdate)) {
        biasUpdate = 0
      }

      if (biasUpdate >= 10) {
        biasUpdate = 10
      }

      if (biasUpdate <= -10) {
        biasUpdate = -10
      }

      //alert(biasUpdate)
      
      
      const isSourceInput = `${source}`.includes("i");    // ???????
      biasUpdate = isSourceInput ? biasUpdate : biasUpdate;

      /*const isFinalOutput = `${target}`.includes("11");    // ???????
      biasUpdate = isFinalOutput ? biasUpdate * 100: biasUpdate;
      */

      //// For whatever reason the final layer isn't learning, at least visibly so.

      // No idea y.

      // It is evidenced by the pumped up * 100 lr on the biasupdate above.



      network.biases[source] -= biasUpdate;
      
      network.weights[`${source}-${target}`] -= weightUpdate;

      const connection = hiddenNeuron.props.neuron.connections.find(c => c.targetNeuronId === finalHiddenNeuronId);
      if (connection) {
        connection.weight = network.weights[`${source}-${target}`];
        connection.bias = network.biases[source];
      }
    }
    
      })}})



      
    }


    // Function to check if all values are 0
    function areAllValuesZero(obj) {
      for (const key in obj) {
        if (obj[key] !== 0) {
          return false; // If any value is not 0, return false
        }
      }
      return true; // All values are 0
    }
    

function backpropagation(network, numSalts, target, learningRate, frozenLayers, setcurrentGradients) {



    const outputNeurons = network.neural_welcome_list.filter(neuron => neuron.props.neuron.type === 'output');
    const outputSalts = outputNeurons.map(img => img.props.neuron.everSalt);

    const hiddenNeurons = network.neural_welcome_list.filter(neuron => neuron.props.neuron.type !== 'output' && neuron.props.neuron.type !== 'Blank');

    const expectedOutputs = getExpectedOutputs(target, numSalts);
  
    let LossList = calculateLossList(outputSalts, outputNeurons, expectedOutputs);

    if (!areAllValuesZero(LossList)) {

      let Grads = calculateHiddenLayerGradients(network, hiddenNeurons, LossList);
      console.log('Grads and outputs  --  Output:  ' ,  outputSalts, ' Expected:   ', expectedOutputs )
      console.log('Grads: ', Grads)

      //Set gradients for access by Grad Tracking graph
      setcurrentGradients(Grads)
      
      let Gradients = Grads.Gradients;

      let weightLossGradients = Grads.weightLossGradients;

      updateWeightsAndBiases(network, Gradients, weightLossGradients, outputNeurons,
        learningRate, frozenLayers) 
        
      }


  }

  export default backpropagation;