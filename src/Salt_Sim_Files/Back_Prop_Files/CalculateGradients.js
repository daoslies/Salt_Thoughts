import { 
  getExpectedOutputs,
  sigmoidDerivative,
  sigmoid,
  normaliseArray
} from './HelperFunctions.js';

function squareWithoutSignChange(x) {
  return x >= 0 ? x * x : -x * x;
}


export function calculateLossList(outputSalts, outputNeurons, expectedOutputs) {
    
    const LossList = {};    

    outputSalts = normaliseArray(outputSalts);
    expectedOutputs = normaliseArray(expectedOutputs)
    /// Normalise those fkrz

    for (let i = 0; i < outputNeurons.length; i++) {
      let neuron = outputNeurons[i].props.neuron;
      //console.log('Expected: ', i, ' ', expectedOutputs[i], outputSalts[i])
      var loss = (expectedOutputs[i] - outputSalts[i]) ;

      loss = squareWithoutSignChange(loss);
      
      
      /// Maybe don't need the squared
      //https://mattmazur.com/2015/03/17/a-step-by-step-backpropagation-example/


      //alert(i + 'delta:  ' + delta + ' expected: ' + expectedOutputs[i] + 'actial: ' + outputSalts[i])
      // If outputsSalts[i] is 0 then gradupdate will give a divide by 0 and just be 0. 
      // And that's not necessarily what we want.

      // dErrorTotal/dWx = dErrorTotal/dOutputofoutputNeuron1 * dOutputofoutputNeuron1/dTotalInputforOutputNeuron1 
                        // * dTotalInputforOutputNeuron1/dWx

      // I think:
      
      // dErrorTotal/dOutputofoutputNeuron1 = loss

      // dOutputofoutputNeuron1/dTotalInputforOutputNeuron1 = sigmoidDerivative(outputSalts[i])

      // dTotalInputforOutputNeuron1/dWx = I think just the neuron's input? 

      //var derivative = loss * sigmoidDerivative(outputSalts[i])  //This used to be a divide?

      if (isNaN(loss) || !isFinite(loss)) {
        let sign = Math.random() < 0.5 ? -1 : 1;
        loss = 0.00001 * sign;
      }

      // Below is small line to increase the impact of very incorrect answers compared to slightly incorrect ones.
      //gradUpdate = Math.sign(gradUpdate) * (Math.abs(gradUpdate) ** 1.25);
      //alert(i + 'delta:  ' + delta + 'B gradUpdate: ' + gradUpdate)
      LossList[neuron.id] = loss;
      
    }

    console.log('Salt actual: ', outputSalts, ' Salt Expected: ', expectedOutputs, ' Calculated Loss: ', LossList)
    //const gradCheck = Gradients;
    //console.log('GRADS_init: ', Gradients, 'GradCheck: ', gradCheck,'  Ummm wait 1 tic:  ', '  Salts: ', outputSalts, '  Neurons:  ', outputNeurons )
    return LossList; 

    //  dErrorTotal/dTotalInputforOutputNeuron1  is what is being output here
  }




  export function calculateHiddenLayerGradients(network, hiddenNeurons, lossList) {


    ///Where is the sigmoid derivative??

    let grads = lossList;

    var weightGradients = {};

    let total_current_salt = network.saltBag.saltList.length; //muchBetter


    //Sort the neurons from last layer to first layer.=
    //console.log('Hidden Neurons Pre sort: ', hiddenNeurons)
    
    hiddenNeurons.sort((a, b) => {
      if (a.props.neuron.layer === 'i' && b.props.neuron.layer !== 'i') return 1;
      if (a.props.neuron.layer !== 'i' && b.props.neuron.layer === 'i') return -1;
      return b.props.neuron.layer - a.props.neuron.layer;
    });

    //console.log('Hidden Neurons Post sort: ', hiddenNeurons)


    var currentLayer = null;


    hiddenNeurons.forEach(neuron => {

      let weightGradient = 0;
      var sourceNeuron = neuron.props.neuron;

      grads[sourceNeuron.id] = 0;  // Im confused by this, if you work it out, tell me.
                                        // I think is just a starting off point for grad accumulation
                                        // but feels slightly weird and specifically pushing towards positive grads,
                                        // which ent necessarily the real sitch?

                                        // twas 0.5, just set it to 0.1 - 27/09/2023 // now is 0

      //let currentLayer = sourceNeuron.layer;


      // Only look at connections which currently exist.

      sourceNeuron.connections.filter(conex_object => {

        const sourceNeuronId = sourceNeuron.id;
        const targetNeuronId = conex_object.targetNeuronId;
      
        return (
          network.neural_welcome_list.some(neuron => neuron.props.neuron.id === sourceNeuronId) &&
          network.neural_welcome_list.some(neuron => neuron.props.neuron.id === targetNeuronId)
        );
      
      }).forEach(conex_object => {
        
        const targetNeuronId = conex_object.targetNeuronId;

        if (targetNeuronId) {
        
        const grad = grads[targetNeuronId];

        const targetNeuron = network.neural_welcome_list.filter(neuron => neuron.props.neuron.id == targetNeuronId);


        const sourceSalt = (0.1 + sourceNeuron.everSalt) / total_current_salt;
        const targetSalt = (0.1 + targetNeuron[0].props.neuron.everSalt) / total_current_salt;

        const weight = network.weights[`${sourceNeuron.id}-${targetNeuronId}`];
        const bias = network.biases[sourceNeuron.id];

        //let sourceActivation = 1 / (1 + Math.exp(-((weight * (sourceSalt) * 10) + bias)));
        //let targetActivation = 1 / (1 + Math.exp(-((weight * (targetSalt) * 10) + bias)));  //Weight and bias is different for source and target activations
        

        grads[sourceNeuron.id] += grad * sigmoidDerivative(targetSalt) * weight;  //(targetNeuron[0].props.neuron.layer ** 1.5);


        weightGradient = grad * sigmoidDerivative(targetSalt) * sourceSalt;   // sigmoidDerivative(targetSalt) * sourceSalt // * sourceActivation ;

        weightGradients[`${sourceNeuron.id}-${targetNeuronId}`] = weightGradient;

        
        //console.log(sourceNeuron.id, targetNeuron[0].props.neuron.id, grads, grad, weightGradient, weightGradients);

      }});

      // We are going to normalise grads by layer.
      
      
      
      
        if ( sourceNeuron.id.split('-')[0] != currentLayer) {
          //console.log('looking at ID s: ', grads);

          // Get values for specified layer
          const values = Object.keys(grads)
          .filter(key => key.startsWith(currentLayer))
          .map(key => grads[key]);

          // Find absolute min and max
          //const min = Math.min(...values.map(Math.abs)); 
          const max = Math.max(...values.map(Math.abs));

          // Normalize between -1 and 1
          //const epsilon = 0.00000000001;
          const normalized = values.map(value => value / max)
          //const normalized = values.map(value => ((((value - min) / (max - min + epsilon)) * 2) - 1) / 10);

          // Update original object
          Object.keys(grads)
          .filter(key => key.startsWith(currentLayer))
          .forEach((key, index) => {
            grads[key] = normalized[index]; 
          });

          //console.log('looking at ID s: ', grads);


        }
      

      currentLayer = sourceNeuron.id.split('-')[0];
        
      
              //kk Strong start, but this is not correct. (u were so confident yesterday lol ;))

        // our new understanding is:

        // Delta list = []

        // pre weight deltas = error * sigdiv(output)
        // Delta list.append(pre weight deltas) 
        // nextdelta = dotproduct(pre weight delta, (weights).T)
        // nextdelta = nextdelta * sivdiv(thislayersactivations)
        // Delta list.append(nextdelta)


        // Can we do this from connections rather than layers?

        // Are we hardxxcore treating eversalt as activation, because if so then we shouldn't calculate 
        // activation with weights and biases at any stage, and hardxxxcore treat eversalt as activation.
        // or don't do that.

        // But doing both is weird. like using the wrong units.

        // Argument against using eversalt purely is that as it wasn't directly calculated in the foreward pass
        // maybe it fucks with shit to include it in the backward. We have no idea about scales.


        //console.log('Connection: ', conn)
        //console.log('Weights: ', weight)
        //console.log('Grads: ', grad)

      //alert('3')
      /*
      sourceNeuron.connections.forEach(conn => {
        //alert('3.1')
        const weight = network.weights[`${sourceNeuron.id}-${conn.targetNeuronId}`];
        //alert('3.2')
        const grad = grads[conn.targetNeuronId];
        //alert('3.3')
        weightGradients[`${sourceNeuron.id}-${conn.targetNeuronId}`] 
          = grad * weight * (totalSalt / sourceNeuron.activation);
        //alert('3.4')
      });
      */
    });


    // and then normalise again for the inputs, cus they get missed from the above normalise.

    // is a copy and paste so potench could be functionalised.

    /*
    // Get values for specified layer
    const values = Object.keys(grads)
    .filter(key => key.startsWith('i'))
    .map(key => grads[key]);

    // Find absolute min and max
    const min = Math.min(...values.map(Math.abs)); 
    const max = Math.max(...values.map(Math.abs));

    // Normalize between -1 and 1
    const epsilon = 0.00000000001;
    const normalized = values.map(value => (value - min) / (max - min + epsilon) * 2 - 1);

    // Update original object
    Object.keys(grads)
    .filter(key => key.startsWith('i'))
    .forEach((key, index) => {
      grads[key] = normalized[index]; 
    });

    */

    
      const maxNorm = 10;
      const maxWeight = 10;

      // Normalize over entire network

      

      const gradNorm = Object.values(grads).reduce((a, b) => a + b ** 2, 0); 
      //const gradNorm = grads.reduce((a, b) => a + b ** 2, 0);
      if (gradNorm > maxNorm) {
        const scale = maxNorm / Math.sqrt(gradNorm);
        Object.keys(grads).forEach(id => {
          grads[id] *= scale;
          });
      }

      
      
      
      // Initialize object to store normalized gradients
      const normalizedGradientsPerLayer = {};

      for (const key in weightGradients) {
        // Extract source layer
        const [sourceLayer] = key.split('-');

        // Initialize layer arrays if needed
        if (!normalizedGradientsPerLayer[sourceLayer]) {
          normalizedGradientsPerLayer[sourceLayer] = []; 
        }

        // Add gradient for this key
        const gradient = weightGradients[key];
        const gradObject = {[key] : gradient};
        normalizedGradientsPerLayer[sourceLayer].push(gradObject);   /// turnt this into a dict.

      }


      for (const layer in normalizedGradientsPerLayer) {

        // Get all gradients for current layer
        const gradients = normalizedGradientsPerLayer[layer];

        const values = Object.values(gradients); 

        // Calculate norm
        const layerGradNorm = values.reduce((a, b) => a + b ** 2, 0);


        // Calculate scale factor
        let scale = 1.0; 
        if (layerGradNorm > maxNorm) {
          scale = maxNorm / Math.sqrt(layerGradNorm);
        }

        // Scale gradients  

        for (const index in gradients) {
          const gradObject = gradients[index];
          //console.log('gradObject prime: ', gradObject)

          for (const [key, value] of Object.entries(gradObject)) {
            //console.log(' gradObject: ', key, value)
          weightGradients[key] *= scale ; 
        }
      }
      }

      for (const layer in normalizedGradientsPerLayer) {
        const gradients = normalizedGradientsPerLayer[layer];

        //console.log('gradsh ere', gradients)

        for (const index in gradients) {
          const gradObject = gradients[index];
          //console.log('gradObject prime: ', gradObject)

          for (const [key, value] of Object.entries(gradObject)) {
            //console.log(' gradObject: ', key, value)
          weightGradients[key] = value * 100; 
        }
      }
      }


      

      /*
      // Weight gradient clipping
      Object.keys(weightGradients).forEach(wKey => {
        const grad = weightGradients[wKey];
        weightGradients[wKey] = Math.min(Math.max(grad, -maxWeight), maxWeight);
      });

      */

      
      

      
      return {
        Gradients: grads,
        weightLossGradients: weightGradients
      }; 
    }

