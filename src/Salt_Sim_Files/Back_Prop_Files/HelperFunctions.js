export function getExpectedOutputs(target, numSalts) {
    
    let expectedOutput = [0,0,0];
    
    expectedOutput[target] = 1
    
    
    expectedOutput = expectedOutput.map(x => x * numSalts);
  
    return expectedOutput;
  }

  // Calculate the derivative of the activation function (sigmoid)
  
export function sigmoidDerivative(x) {      ///Flip i'm still unsure if this should have the sigmoid in or not
    //const sigmoidX = sigmoid(x);            // https://mattmazur.com/2015/03/17/a-step-by-step-backpropagation-example/
    //return sigmoidX * (1 - sigmoidX);
    return x * (1 - x);
  }
  
export function sigmoid(x) {
    return 1 / (1 + Math.exp(-x)); 
  }


export function normaliseArray(input){
    const sum = input.reduce((acc, val) => acc + val, 0);
    const normalisedArray = input.map(val => val / sum);
        return normalisedArray
    }

