import React, { useState } from 'react';

export default function SaveLoadButton(network, numLayers, layerArray) {


  const handleSave = () => {
    const weights = network.network.weights;
    const biases = network.network.biases;
    const saveModel = { weights, biases };
    const saveModelStr = JSON.stringify(saveModel);
    localStorage.setItem('SavedModel_Working_6_Layers', saveModelStr);  //SavedModel_Working_Safe
    alert('Saved to local storage!');
  };

  const handleLoad = () => {
    const loadedValue = localStorage.getItem('SavedModel_Working_6_Layers'); // SavedModel_Working_test  
    const savedModel = JSON.parse(loadedValue);
    const { weights, biases } = savedModel;
    console.log(weights)
    console.log(biases)

    const weightIds = Object.keys(weights).filter(id => id.split('-').length === 4);

    for (const id of weightIds) {
      const [sourceLayer, sourceNeuron, targetLayer, targetNeuron] = id.split('-');
      const weight = weights[id];
      network.network.setWeightInit(sourceLayer + '-' + sourceNeuron, targetLayer + '-' + targetNeuron, weight);
    }

    /*
    for (const id in weights) {
        const [fromNeuronId, toNeuronId] = id.split('-');
        console.log('ID', id)
        console.log('weights from-to:', fromNeuronId, toNeuronId)
        network.network.setWeightInit(fromNeuronId, toNeuronId, weights[id]);
      }
    */


    for (const id in biases) {
        network.network.setBiasInit(id, biases[id]);
        console.log('bias from-to:', id)
        console.log('trying to set: ', biases[id])
        console.log('What they are: ', network.network.biases[id])
      }

    network.network.updateHtmlRender(network.numLayers, network.layerArray); 
    console.log(network)
    alert('Loaded from local storage!');
  };

  return (
    <div>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleLoad}>Load</button>
    </div>
  );
}