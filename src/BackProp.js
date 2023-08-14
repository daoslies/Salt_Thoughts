function getExpectedOutputs(inputAndOrState, outputAndOrState, numSalts) {
    
    let expectedOutput = [];
    let trueIndex = 0;
    let falseIndex = 1;
    
    if (inputAndOrState === false && outputAndOrState === false) {
      expectedOutput = [1, 0];
    }
    
    if (inputAndOrState === true && outputAndOrState === false) {
      expectedOutput = [0, 1];
    }
    
    if (inputAndOrState === false && outputAndOrState === true) {
      expectedOutput = [0, 1];
    }
    
    if (inputAndOrState === true && outputAndOrState === true) {
      expectedOutput = [1, 0];
    }
    
    expectedOutput = expectedOutput.map(x => x * numSalts);
  
    return expectedOutput;
  }

  // Calculate the derivative of the activation function (sigmoid)
  function sigmoidDerivative(output) {
        return output * (1 - output);
    }

  function calculateOutputLayerGradients(outputSalts, outputNeurons, expectedOutputs) {
    
    const Gradients = {};    
  
    for (let i = 0; i < outputSalts.length; i++) {
      let neuron = outputNeurons[i].props.neuron;
      console.log('Expected: ', i, ' ', expectedOutputs[i], outputSalts[i])
      const delta = expectedOutputs[i] - outputSalts[i];
      Gradients[neuron.id] = delta / sigmoidDerivative(outputSalts[i]);
    }
  
    return Gradients;
  }


  /*
  function calculateHiddenLayerGradients(network, outputNeurons, outputLayerGradients) {
    const hiddenLayerGradients = {};
  
    // Get all hidden layer neurons from the network.neural_welcome_list
    const hiddenNeurons = network.neural_welcome_list.filter(neuron => neuron.props.neuron.type !== 'output');
  
    // Loop through the hidden layer neurons in reverse order
    for (let i = hiddenNeurons.length - 1; i >= 0; i--) {
      const hiddenNeuron = hiddenNeurons[i].props.neuron;
  
      let gradient = 0;
      console.log('outputs: ', outputNeurons)
      // Calculate the gradient of each hidden neuron
      for (let k = 0; k < outputNeurons.length; k++) {
        const outputNeuron = outputNeurons[k].props.neuron;
        gradient += outputLayerGradients[outputNeuron.id] * network.weights[`${hiddenNeuron.id}-${outputNeuron.id}`];
        console.log('the bits: ', outputLayerGradients[outputNeuron.id], network.weights[`${hiddenNeuron.id}-${outputNeuron.id}`])
        console.log('ids: ', hiddenNeuron.id, outputNeuron.id)


        //// KKK i think the above kinda might be a bit bullshit for all but the final hidden layer
        // because I think that for any of the other layers, instead of properly chain ruling
        // we're just treating them all as being directly connected to the output layer.
    }
  
      // Store the gradient of each hidden neuron
      hiddenLayerGradients[hiddenNeuron.id] = gradient * sigmoidDerivative(hiddenNeuron.everSalt);
    }
  
    return hiddenLayerGradients;
  }

  */
  function calculateHiddenLayerGradients(network, hiddenNeurons, Gradients) {
    

    const weightLossGradients = {}; 


    //Sort the neurons from last layer to first layer.
    hiddenNeurons.sort((a, b) => {
      if (a.props.neuron.layer === 'i' && b.props.neuron.layer !== 'i') return 1;
      if (a.props.neuron.layer !== 'i' && b.props.neuron.layer === 'i') return -1;
      return b.props.neuron.layer - a.props.neuron.layer;
    });
    
    // Calculate the gradients for each hidden neuron
    hiddenNeurons.forEach(hiddenNeuron => {
      let weightLoss = 0;
      let biasLoss = 0;

      console.log('Current Neuron: ', hiddenNeuron.props.neuron.id)
  
      // Sum the weights connecting the hidden neuron to the final hidden layer neurons
      // multiplied by the gradients of the final hidden layer neurons
      
      //console.log('biasloss prior: ', biasLoss)
      hiddenNeuron.props.neuron.connections.forEach(conex_object => {

        //something is slightly fukkywith the target neuron list

        if (conex_object.targetNeuronId) {
          //console.log(conex_object)

          
        const finalHiddenNeuronId = conex_object.targetNeuronId;
        //const finalHiddenNeuron = network.neural_welcome_list.find(neuron => neuron.props.neuron.id === finalHiddenNeuronId);
        const source = hiddenNeuron.props.neuron.id;
        const target = finalHiddenNeuronId;

        if (Gradients[target]) {

          biasLoss += Gradients[target];


        const weightKey = `${source}-${target}`;
        const weight = network.weights[weightKey];
        
        weightLoss = weight * Gradients[target];
        weightLoss *= sigmoidDerivative(hiddenNeuron.props.neuron.everSalt);
        weightLossGradients[`${source}-${target}`] = weightLoss;
        
        
        

        console.log(weightKey, target)
        console.log(Gradients)
        console.log(Gradients[target])
        
        console.log(biasLoss)
        console.log(weightLoss)
      }
      }
      });
  
      // Multiply the sum by the derivative of the activation function of the hidden neuron
      
      biasLoss *= sigmoidDerivative(hiddenNeuron.props.neuron.everSalt);
  
      // Store the gradient for the hidden neuron
      Gradients[hiddenNeuron.id] = biasLoss;
      
    });

    let Grads = {Gradients: Gradients, weightLossGradients: weightLossGradients} 
  
    return Grads;
  }
    

  function updateWeightsAndBiases(network, Gradients, weightLossGradients, outputNeurons,
     learningRate) {

      const hiddenNeurons = network.neural_welcome_list.filter(neuron => neuron.props.neuron.type !== 'output' && neuron.props.neuron.type !== 'Blank');

    
    /*
    for (let i = 0; i < network.inputLayer.neurons.length; i++) {
    const inputNeuron = network.inputLayer.neurons[i];
    for (let j = 0; j < network.outputLayer.neurons.length; j++) {
    const outputNeuron = network.outputLayer.neurons[j];
    network.weights[`${inputNeuron.id}-${outputNeuron.id}`] += learningRate * inputLayerGradients[inputNeuron.id] * outputNeuron.output;
    }
    }
    */



    hiddenNeurons.forEach(hiddenNeuron => {

      console.log('Current Neuron: ', hiddenNeuron.props.neuron.id)

      hiddenNeuron.props.neuron.connections.forEach(conex_object => { 

 

        const finalHiddenNeuronId = conex_object.targetNeuronId;
        if (finalHiddenNeuronId) {
        const source = hiddenNeuron.props.neuron.id;
        const target = finalHiddenNeuronId;
        const targetNeuron = network.neural_welcome_list.filter(neuron => neuron.props.neuron.id == finalHiddenNeuronId);

        network.weights[`${source}-${target}`] += learningRate * weightLossGradients[`${source}-${target}`] * targetNeuron.everSalt;
        alert(targetNeuron.everSalt)
        alert()
        const connection = hiddenNeuron.props.neuron.connections.find(c => c.targetNeuronId === finalHiddenNeuronId);
        if (connection) {
          connection.weight = network.weights[`${source}-${target}`];
        }
      }

      })})
    /*
    const hiddenLayers = network.neural_welcome_list.filter(neuron => neuron.props.neuron.type !== 'output');

    for (let i = 0; i < hiddenLayers.length; i++) {
    const hiddenLayer = hiddenLayers[i];
    for (let j = 0; j < hiddenLayer.neurons.length; j++) {
    const hiddenNeuron = hiddenLayer.neurons[j];
    for (let k = 0; k < network.outputLayer.neurons.length; k++) {
    const outputNeuron = network.outputLayer.neurons[k];
    network.weights[`${hiddenNeuron.id}-${outputNeuron.id}`] += learningRate * hiddenLayerGradients[hiddenNeuron.id] * outputNeuron.output;
    }
    }
    }
    */
    
    for (let i = 0; i < outputNeurons.length; i++) {
    const outputNeuron = outputNeurons[i].props.neuron;
    network.biases[outputNeuron.id] += learningRate * Gradients[outputNeuron.id];
    }


    for (let j = 0; j < hiddenNeurons.length; j++) {
    const hiddenNeuron = hiddenNeurons[j].props.neuron;
    //console.log('biasloss?', hiddenLayerGradients[hiddenNeuron.id])
    //alert()
    network.biases[hiddenNeuron.id] += learningRate * Gradients[hiddenNeuron.id];
    }
    }
    

function backpropagation(network, numSalts, inputAndOrState, outputAndOrState, learningRate) {

    alert()

    const outputNeurons = network.neural_welcome_list.filter(neuron => neuron.props.neuron.type === 'output');
    const outputSalts = outputNeurons.map(img => img.props.neuron.everSalt);

    const hiddenNeurons = network.neural_welcome_list.filter(neuron => neuron.props.neuron.type !== 'output' && neuron.props.neuron.type !== 'Blank');



    const expectedOutputs = getExpectedOutputs(inputAndOrState, outputAndOrState, numSalts);
  
    let Gradients = calculateOutputLayerGradients(outputSalts, outputNeurons, expectedOutputs);
    console.log('bias grads: ', Gradients)

    let Grads = calculateHiddenLayerGradients(network, hiddenNeurons, Gradients);

    console.log('Grads: ', Grads)
    
    Gradients = Grads.Gradients;

    let weightLossGradients = Grads.weightLossGradients;
    
    console.log('Weight grads: ', weightLossGradients)

    updateWeightsAndBiases(network, Gradients, weightLossGradients, outputNeurons,
       learningRate) 
    
    //alert('end of backprop')
    //calculateInputLayerGradients(network, input, hiddenLayerGradients, outputLayerGradients, learningRate);
  }

  export default backpropagation;