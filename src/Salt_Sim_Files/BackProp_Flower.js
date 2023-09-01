function getExpectedOutputs(target, numSalts) {
    
    let expectedOutput = [0,0,0];
    
    expectedOutput[target] = 1
    
    
    expectedOutput = expectedOutput.map(x => x * numSalts);
  
    return expectedOutput;
  }

  // Calculate the derivative of the activation function (sigmoid)
  function sigmoidDerivative(output) {
        return output * (1 - output);
    }

  function normaliseArray(input){
    const sum = input.reduce((acc, val) => acc + val, 0);
    const normalisedArray = input.map(val => val / sum);
        return normalisedArray
    }

  function calculateOutputLayerGradients(outputSalts, outputNeurons, expectedOutputs) {
    
    const Gradients = {};    

    outputSalts = normaliseArray(outputSalts);
    expectedOutputs = normaliseArray(expectedOutputs)
    /// Normalise those fkrz
  
    for (let i = 0; i < outputNeurons.length; i++) {
      let neuron = outputNeurons[i].props.neuron;
      //console.log('Expected: ', i, ' ', expectedOutputs[i], outputSalts[i])
      const delta = (expectedOutputs[i] - outputSalts[i]) ** 2;
      //alert(i + 'delta:  ' + delta + ' expected: ' + expectedOutputs[i] + 'actial: ' + outputSalts[i])
      // If outputsSalts[i] is 0 then gradupdate will give a divide by 0 and just be 0. 
      // And that's not necessarily what we want.

      var gradUpdate = delta / sigmoidDerivative(outputSalts[i])

      if (isNaN(gradUpdate) || !isFinite(gradUpdate)) {
        let sign = Math.random() < 0.5 ? -1 : 1;
        gradUpdate = 0.00001 * sign;
      }

      // Below is small line to increase the impact of very incorrect answers compared to slightly incorrect ones.
      //gradUpdate = Math.sign(gradUpdate) * (Math.abs(gradUpdate) ** 1.25);
      //alert(i + 'delta:  ' + delta + 'B gradUpdate: ' + gradUpdate)
      Gradients[neuron.id] = gradUpdate;
    }
    //const gradCheck = Gradients;
    //console.log('GRADS_init: ', Gradients, 'GradCheck: ', gradCheck,'  Ummm wait 1 tic:  ', '  Salts: ', outputSalts, '  Neurons:  ', outputNeurons )
    return Gradients;
  }




  function calculateHiddenLayerGradients(network, hiddenNeurons, grads) {


    ///Where is the sigmoid derivative??
    
    var weightGradients = {};

    const totalSalt = Object.values(grads).reduce((a, b) => a + b, 0);  

    //Sort the neurons from last layer to first layer.
    console.log('Hidden Neurons Pre sort: ', hiddenNeurons)
    
    hiddenNeurons.sort((a, b) => {
      if (a.props.neuron.layer === 'i' && b.props.neuron.layer !== 'i') return 1;
      if (a.props.neuron.layer !== 'i' && b.props.neuron.layer === 'i') return -1;
      return b.props.neuron.layer - a.props.neuron.layer;
    });

    console.log('Hidden Neurons Post sort: ', hiddenNeurons)

    hiddenNeurons.forEach(neuron => {
      let gradient = 0;
      neuron.props.neuron.connections.forEach(conn => {

        if (conn.targetNeuronId) {
        const weight = network.weights[`${neuron.props.neuron.id}-${conn.targetNeuronId}`];
        const grad = grads[conn.targetNeuronId];
        console.log('Connection: ', conn)
        console.log('Weights: ', weight)
        console.log('Grads: ', grad)
        gradient += weight * grad;} 
        //alert(gradient)
      });
      gradient *= (0.000001 +neuron.props.neuron.everSalt) * (1 - (0.000001 + neuron.props.neuron.everSalt));
      //alert(gradient)
      
      grads[neuron.props.neuron.id] = gradient;
      //alert('3')
      neuron.props.neuron.connections.forEach(conn => {
        //alert('3.1')
        const weight = network.weights[`${neuron.props.neuron.id}-${conn.targetNeuronId}`];
        //alert('3.2')
        const grad = grads[conn.targetNeuronId];
        //alert('3.3')
        weightGradients[`${neuron.props.neuron.id}-${conn.targetNeuronId}`] 
          = grad * weight * (totalSalt / neuron.props.neuron.activation);
        //alert('3.4')
      });
    });
  //alert('out - pre norm')

  /*

  //Switching round the below, with the above, on the advice of claude.
  
  function calculateHiddenLayerGradients(network, hiddenNeurons, Gradients, expectedOutputs) {
    
    // currently (28/4/2023) each layer has a bias, rather than each neuron. I don't know if that is what we want.
    // And something about this is fuking with the weight gradients.
    // as in the layer bias gradient is turned into the 'gradients' and the weightgradient is constructed based on this.


    const totalSaltThisRound = expectedOutputs.reduce((acc, val) => acc + val, 0);

    //console.log('Checking that undefined gradinet: ', Gradients)
    const weightLossGradients = {}; 


    //Sort the neurons from last layer to first layer.
    hiddenNeurons.sort((a, b) => {
      if (a.props.neuron.layer === 'i' && b.props.neuron.layer !== 'i') return 1;
      if (a.props.neuron.layer !== 'i' && b.props.neuron.layer === 'i') return -1;
      return b.props.neuron.layer - a.props.neuron.layer;
    });

    
    // Calculate the gradients for each hidden neuron
    hiddenNeurons.forEach(hiddenNeuron => {
      
      let biasLoss = 0;


      //Something about maybe this is where salt not being split evenly by weights and biases, but by magents affects things.
      // because weight and bias loss are per neuron, not per connection.
      // we're saying that all the connections did a good or bad job based on the quality of the neuron as a whole
      // not saying that the connections did a good or bad job on their merit as individual connections.

      

      //console.log('Current Neuron: ', hiddenNeuron.props.neuron.id)
      //console.log('Checking that undefined gradinet 1: ', Gradients)
      // Sum the weights connecting the hidden neuron to the final hidden layer neurons
      // multiplied by the gradients of the final hidden layer neurons
      
      //console.log('biasloss prior: ', biasLoss)
      hiddenNeuron.props.neuron.connections.forEach(conex_object => {

        let weightLoss = 0;
        //something is slightly fukkywith the target neuron list

        if (conex_object.targetNeuronId) {
          //console.log(conex_object)

          
        const targetNeuronId = conex_object.targetNeuronId;
        //const finalHiddenNeuron = network.neural_welcome_list.find(neuron => neuron.props.neuron.id === finalHiddenNeuronId);
        const source = hiddenNeuron.props.neuron.id;
        const target = targetNeuronId;
        //console.log('Checking that undefined gradinet 2: ', Gradients)
        if (Gradients[target]) {

          biasLoss += Gradients[target];

        const weightKey = `${source}-${target}`;
        const weight = network.weights[weightKey];
        
        weightLoss = weight * Gradients[target];
        weightLoss *= sigmoidDerivative((0.001+hiddenNeuron.props.neuron.everSalt) / totalSaltThisRound);
        weightLossGradients[weightKey] = weightLoss;
        
        //// We reset the weightloss at the neuron not at the connection.
        // Which maybe means the last connection in the list has the biggest weightloss?
        
        //console.log('We are in calculatehiddenneurongradients')
        //console.log(weightKey, target)
        //console.log(Gradients)
        //console.log(Gradients[target])
        
        //console.log(biasLoss)
        //console.log(weightLoss)
      }
      }
      });
  
      // Multiply the sum by the derivative of the activation function of the hidden neuron
      //alert('Pre-Simgoid: ' + hiddenNeuron.props.neuron.id + ' Loss: ' + biasLoss)
      biasLoss *= sigmoidDerivative((0.001 + hiddenNeuron.props.neuron.everSalt) / totalSaltThisRound);
      //alert('Post-Sigmoid: ' +hiddenNeuron.props.neuron.id + ' Loss: ' + biasLoss)
      // Store the gradient for the hidden neuron
      Gradients[hiddenNeuron.props.neuron.id] = biasLoss;
      
    });

    // Switching round the above, on the advive of claude
    */

    

      const maxNorm = 5;
      const maxWeight = 2;

      // Normalize over entire network

      const gradNorm = Object.values(grads).reduce((a, b) => a + b ** 2, 0); 
      //const gradNorm = grads.reduce((a, b) => a + b ** 2, 0);
      if (gradNorm > maxNorm) {
        const scale = maxNorm / Math.sqrt(gradNorm);
        Object.keys(grads).forEach(id => grads[id] *= scale);
      }
      
      // Weight gradient clipping
      Object.keys(weightGradients).forEach(wKey => {
        const grad = weightGradients[wKey];
        weightGradients[wKey] = Math.min(Math.max(grad, -maxWeight), maxWeight);
      });
      
      return {
        Gradients: grads,
        weightLossGradients: weightGradients
      }; 
    }



/*

Switching to entire network (rather than layer) normalising on the advice of claude

      // NORMALIZE GRADS PER LAYER
      
        const layerGradients = {};
        Object.keys(Gradients).forEach(neuronId => {
          const gradient = Gradients[neuronId];
          const layerNum = neuronId.split('-')[0];
          if (!layerGradients[layerNum]) {
            layerGradients[layerNum] = [];
          }
          layerGradients[layerNum].push(gradient);
        });

        const gradientThreshold = 1; // Adjust this threshold as needed
        const clipValue = 1e-6; // Adjust this value as needed
        Object.keys(layerGradients).forEach(layerNum => {
          const gradients = layerGradients[layerNum];
          // GradientNorm is always poss, do we want that? 
          // (no I think is fine, is jus a proportion applied to the real gradient)
          const gradientNorm = Math.sqrt(gradients.reduce((sum, gradient) => sum + gradient ** 2, 0)) + clipValue;
          if (gradientNorm > gradientThreshold) {
            for (let i = 0; i < gradients.length; i++) {

              // I don't know if the i thing below needs to be said
              const neuronId = layerNum === 'i' ? `i-${i}` : `${layerNum}-${i}`;
              Gradients[neuronId] *= Math.abs(gradientThreshold / gradientNorm);
            }}
          })
            //Now for the weights

            const layerWeightGradients = {};
            Object.keys(weightLossGradients).forEach(sourceTargetPair => {
              const weightGradients = weightLossGradients[sourceTargetPair];
              const layerNumForWeights = sourceTargetPair.split('-')[0] + '-' + sourceTargetPair.split('-')[2];
              if (!layerWeightGradients[layerNumForWeights]) {
                layerWeightGradients[layerNumForWeights] = {};
              }
              if (!layerWeightGradients[layerNumForWeights][sourceTargetPair]) {
                layerWeightGradients[layerNumForWeights][sourceTargetPair] = {};
              }
              
              layerWeightGradients[layerNumForWeights][sourceTargetPair] = (weightGradients);
            });

            console.log('LayerWeightGrads:  ', layerWeightGradients)
            
            const weightGradientThreshold = 1; // Adjust this threshold as needed
            const weightClipValue = 1e-6; // Adjust this value as needed
            Object.keys(layerWeightGradients).forEach(layerNumForWeights => {
              const weightGradients = layerWeightGradients[layerNumForWeights];
              // GradientNorm is always poss, do we want that? 
              // (no I think is fine, is jus a proportion applied to the real gradient)
              
              
              const weightGradientNorm = Math.sqrt(Object.values(weightGradients).reduce((sum, gradient) =>
                 sum + gradient ** 2, 0)) + weightClipValue;
               
                if (weightGradientNorm > weightGradientThreshold) {

                Object.keys(weightGradients).forEach(sourceTargetPair => {
                  //const weightGradient = weightGradients[sourceTargetPair];    
                  weightLossGradients[sourceTargetPair] *= weightGradientThreshold / weightGradientNorm;
                })
              }
              
            })

        /*   
        // Normalize the weight loss gradients for the layer

        // Ok, we need to switch out gradients (below) for weightlossgradients. -- It was in the same for as above
        // so we need to create a new for for below.

        //and changing the filter so that it starts with the current layer? 
          
        /*
        const weightLayerGradients = {};
        Object.keys(weightLossGradients).forEach(neuronId => {
          const gradient = weightLossGradients[neuronId];
          const layerNum = neuronId.split('-')[0];
          if (!weightLayerGradients[layerNum]) {
            weightLayerGradients[layerNum] = [];
          }
          weightLayerGradients[layerNum].push(gradient);
        });
        */

/*
        const weightLossGradientsForLayer = Object.keys(weightLossGradients)
        .filter(neuronId => neuronId.startsWith(layerNum))
        .map(neuronId => weightLossGradients[neuronId]);

        const weightLossGradientNorm = Math.sqrt(weightLossGradientsForLayer
          .reduce((sum, gradient) => sum + gradient ** 2, 0)) + clipValue;
        
        for (let i = 0; i < weightLossGradientsForLayer.length; i++) {
            
          const layerWeightIds = Object.keys(weightLossGradients)
          .filter(neuronId => neuronId.startsWith(layerNum + '-' + i))
          
          layerWeightIds.forEach(connectionId => {
          weightLossGradients[connectionId] *= gradientThreshold / weightLossGradientNorm;})
        }

      }});
*/
      ////////////////////////////////////////////////////////////////////////////////////////////////
      //     THE ABOVE IS THE BIT TO WORK ON .....                                          //////////
      ////////////////////////////////////////////////////////////////////////////////////////////////


    /*        
    // Normalise code you just provided

    // NORMALIZE GRADS PER LAYER
    const layerGradients = {};
    const layerWeightLossGradients = {};
    Object.keys(Gradients).forEach((neuronId) => {
      const gradient = Gradients[neuronId];
      const [sourceLayerNum, sourceNeuronNum, targetLayerNum, targetNeuronNum] = neuronId.split('-');
      const layerNum = parseInt(targetLayerNum);
      if (!layerGradients[layerNum]) {
        layerGradients[layerNum] = {
          regular: [],
          weight: [],
        };
      }

      if (neuronId.endsWith("b")) {
        layerGradients[layerNum].weight.push(gradient);

        const weightKey = `${sourceLayerNum}-${sourceNeuronNum}-${targetLayerNum}-${targetNeuronNum}`;
        const weight = network.weights[weightKey];
        const weightLossGradient = weight * gradient;
        weightLossGradient *= sigmoidDerivative(network.neural_welcome_list[sourceNeuronNum].props.neuron.everSalt);
        if (!layerWeightLossGradients[layerNum]) {
          layerWeightLossGradients[layerNum] = [];
        }
        layerWeightLossGradients[layerNum].push(weightLossGradient);
      } else {
        layerGradients[layerNum].regular.push(gradient);
      }
    });

    const gradientThreshold = 1; // Adjust this threshold as needed
    Object.keys(layerGradients).forEach((layerNum) => {
      const gradients = layerGradients[layerNum].regular;
      const gradientNorm = Math.sqrt(
        gradients.reduce((sum, gradient) => sum + gradient ** 2, 0)
      );
      if (gradientNorm > gradientThreshold) {
        for (let i = 0; i < gradients.length; i++) {
          const neuronId = layerNum === "i" ? `i-${i}` : `${layerNum}-${i}`;
          Gradients[neuronId] *= gradientThreshold / gradientNorm;
        }
      }

      const weightLossGradients = layerWeightLossGradients[layerNum];
      if (weightLossGradients) {
        const weightLossGradientNorm = Math.sqrt(weightLossGradients.reduce((sum, weightLossGradient) => sum + weightLossGradient ** 2, 0));
        if (weightLossGradientNorm > gradientThreshold) {
          for (let i = 0; i < weightLossGradients.length; i++) {
            const weightKey = `${layerNum}-${i}`;
            const weightLossGradient = weightLossGradients[i];
            const weightLossGradientNormalized = weightLossGradient * gradientThreshold / weightLossGradientNorm;
            weightLossGradientsForLayer[weightKey] = weightLossGradientNormalized;
            Gradients[`${layerNum}-${i}-b`] = weightLossGradientNormalized;
          }
        }
      } else {
        const weightGradients = layerGradients[layerNum].weight;
        const weightGradientNorm = Math.sqrt(
          weightGradients.reduce((sum, gradient) => sum + gradient ** 2, 0)
        );
        if (weightGradientNorm > gradientThreshold) {
          for (let i = 0; i < weightGradients.length; i++) {
            const neuronId = `${layerNum}-${i}-b`;
            Gradients[neuronId] *= gradientThreshold / weightGradientNorm;
          }
        }
      }
    });
*/

/*

    let Grads = {Gradients: Gradients, weightLossGradients: weightLossGradients} 
  
    return Grads;
  }
*/
  
    

function updateWeightsAndBiases(network, Gradients, weightLossGradients, outputNeurons,
     learningRate, frozenLayers) {

      const hiddenNeurons = network.neural_welcome_list.filter(neuron => neuron.props.neuron.type !== 'Blank');  // neuron.props.neuron.type !== 'output' &&  (maybe we do need to update the final layers bias if the prev layer is grabbing it.)

    hiddenNeurons.forEach(hiddenNeuron => {

      console.log('Current Neuron: ', hiddenNeuron.props.neuron.id)

      if (!frozenLayers.includes(hiddenNeuron.props.neuron.layer))
      
      {

      hiddenNeuron.props.neuron.connections.forEach(conex_object => { 


      const finalHiddenNeuronId = conex_object.targetNeuronId;

      if (finalHiddenNeuronId) {
      const source = hiddenNeuron.props.neuron.id;
      const target = finalHiddenNeuronId;
      const targetNeuron = network.neural_welcome_list.filter(neuron => neuron.props.neuron.id == finalHiddenNeuronId);
      
      //potench question the +1 by eversalt
      // potench question the [0]

      ///// Ahhhh this feels like nonsense? we're basing it off the eversalt of the target neuron?? 
      // kk we're changing that to source (/hidden), but les see what happens.

      var weightUpdate = learningRate * weightLossGradients[`${source}-${target}`] * (1+hiddenNeuron.props.neuron.everSalt ** 0.5);
            


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
      
      
      const isSourceInput = `${source}`.includes("i");
      biasUpdate = isSourceInput ? biasUpdate / 10 : biasUpdate;



      network.biases[source] += biasUpdate;
      
      network.weights[`${source}-${target}`] += weightUpdate;

      const connection = hiddenNeuron.props.neuron.connections.find(c => c.targetNeuronId === finalHiddenNeuronId);
      if (connection) {
        connection.weight = network.weights[`${source}-${target}`];
        connection.bias = network.biases[source];
      }
    }
    
      })}})

    }
    

function backpropagation(network, numSalts, target, learningRate, frozenLayers, setcurrentGradients) {



    const outputNeurons = network.neural_welcome_list.filter(neuron => neuron.props.neuron.type === 'output');
    const outputSalts = outputNeurons.map(img => img.props.neuron.everSalt);

    const hiddenNeurons = network.neural_welcome_list.filter(neuron => neuron.props.neuron.type !== 'output' && neuron.props.neuron.type !== 'Blank');

    const expectedOutputs = getExpectedOutputs(target, numSalts);
  
    let Gradients = calculateOutputLayerGradients(outputSalts, outputNeurons, expectedOutputs);

    let Grads = calculateHiddenLayerGradients(network, hiddenNeurons, Gradients, expectedOutputs);
    console.log('Grads and outputs  --  Output:  ' ,  outputSalts, ' Expected:   ', expectedOutputs )
    console.log('Grads: ', Grads)

    //Set gradients for access by Grad Tracking graph
    setcurrentGradients(Grads)
    
    Gradients = Grads.Gradients;

    let weightLossGradients = Grads.weightLossGradients;

    updateWeightsAndBiases(network, Gradients, weightLossGradients, outputNeurons,
       learningRate, frozenLayers) 
  
  }

  export default backpropagation;