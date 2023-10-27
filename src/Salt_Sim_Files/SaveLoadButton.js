import React, { useState } from 'react';

import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Box from "@mui/material/Button";

import "./SaveLoadButton.css"; // Import the CSS file


import { models } from './Models';

const SaveLoadButton = (props) => {

  const { network, numLayers, layerArray, setloadedModel, loadedModel } = props;

  

  
  const [isLocalStorageOptionsOpen, setIsLocalStorageOptionsOpen] = useState(false);
  const [localStorageButtonColor, setLocalStorageButtonColor] = React.useState('primary');


  const [isPreTrainedStorageOptionsOpen, setIsPreTrainedStorageOptionsOpen] = useState(false);
  const [preTrainedStorageButtonColor, setPreTrainedStorageButtonColor] = React.useState('primary');


  const [preTrainedModelToLoad, setPreTrainedModelToLoad] = useState(0);


  const handleSetIsLocalStorageOptionsOpenClick = () => {
    setIsLocalStorageOptionsOpen(!isLocalStorageOptionsOpen);
    setLocalStorageButtonColor(localStorageButtonColor === 'primary' ? 'secondary' : 'primary');
  };

  const handleSetIsPreTrainedStorageOptionsOpenClick = () => {
    setIsPreTrainedStorageOptionsOpen(!isPreTrainedStorageOptionsOpen);
    setPreTrainedStorageButtonColor(preTrainedStorageButtonColor === 'primary' ? 'secondary' : 'primary');
  };


  //const models = model_weights_epoch_9;


  // Saving

  const handleSave = () => {
    const weights = network.weights;
    const biases = network.biases;
    const saveModel = { weights, biases };
    const saveModelStr = JSON.stringify(saveModel);
    localStorage.setItem('SavedModel_Working_6_Layers', saveModelStr);  //SavedModel_Working_Safe
    alert('Saved to local storage!');
  };



  // Loading

  function loading(modelAsString) {


    const { weights, biases } = modelAsString;
    console.log(weights)
    console.log(biases)

    const weightIds = Object.keys(weights).filter(id => id.split('-').length === 4);

    for (const id of weightIds) {
      const [sourceLayer, sourceNeuron, targetLayer, targetNeuron] = id.split('-');
      const weight = weights[id];
      network.setWeightInit(sourceLayer + '-' + sourceNeuron, targetLayer + '-' + targetNeuron, weight);
    }

    for (const id in biases) {
        network.setBiasInit(id, biases[id]);
        console.log('bias from-to:', id)
        console.log('trying to set: ', biases[id])
        console.log('What they are: ', network.biases[id])
      }

    //network.updateHtmlRender(network.numLayers, network.layerArray); 
    //console.log(network)

    //setnumLayers({lostlayers}) //nonsense to trigger state specifically updatehtmlrendercallback in salty sim
    //loadedModelever it is not working and starting to get silly
                              // and you should change approach to making a dedicated model state
                              // and have that passed up to salty sim
                              // and have that as a dependecy on updatehtmlrendercallback.

      setloadedModel(modelAsString)
  }




  const handleLoad = () => {
    const loadedValue = localStorage.getItem('SavedModel_Working_6_Layers'); // SavedModel_Working_test  
    const savedModel = JSON.parse(loadedValue);
    
    loading(savedModel);

    alert('Loaded from local storage!');

  };

  const handleLoad_PreTrained = (model_number) => {

    if (model_number === 0) {

      network.initializeWeightsAndBiases();
      //network.initializeInputOutputNeurons()

      const weights = network.weights;
      const biases = network.biases;
      const saveModel = { weights, biases };
      const saveModelStr = JSON.stringify(saveModel);

      setloadedModel(saveModelStr)
      

      alert("Model randomly initialised")

    }

    else {

    const modelAsString = models[model_number];

    loading(modelAsString);

    alert(`Pre_trained model, trained for ${model_number} epochs, loaded from storage! Best results with 2 layers.`);
    
  }

  };


  

  return (
    <div>

      <Button variant="contained" 
        color={localStorageButtonColor} 
        onClick={handleSetIsLocalStorageOptionsOpenClick}>

          {isLocalStorageOptionsOpen ? "Close Local Storage Options" : "Open Local Model Storage Options"}

      </Button>

      {isLocalStorageOptionsOpen && (
        <div className="local-storage-options-container">
          <Box className="local-storage-options-box" textAlign='center'>
          <Button variant="contained"
            sx={{mr: 2}}
            className="local-storage-options-save"
            position="relative"
            onClick={handleSave}>
              Save
          </Button>
          <Button variant="contained"
            sx={{ml: 2}}
            onClick={handleLoad}>
              Load
          </Button>
          </Box>
        </div>  
      )}

      <p></p>

      <Button variant="contained" 
        color={preTrainedStorageButtonColor} 
        onClick={handleSetIsPreTrainedStorageOptionsOpenClick}>

          {isPreTrainedStorageOptionsOpen ? "Close Pre-Trained Storage Options" : "Open Pre-Trained Model Storage Options"}
      
      </Button>


            {isPreTrainedStorageOptionsOpen && (

              <div className="pre-trained-storage-options-container">


                <Box className="pre-trained-storage-options-box-button" textAlign='center'>
                  
                  <Button variant="contained"
                    //sx={{ml: 2}}
                    onClick={() => handleLoad_PreTrained(preTrainedModelToLoad)}>
                       <span style={{color: 'white', fontSize: '145%'}}>Load PreTrained Model</span>
                  </Button> 

                </Box>


                <p style={{margin: 0, padding: 0, top: "-25%", fontSize: '80%'}}>
                <span>
                    {
                      preTrainedModelToLoad === 0 ? 
                        "Load Randomly Initialised Model" 
                        : 
                        `Load Model Trained for ${preTrainedModelToLoad} Epochs`
                    }
                  </span>
                </p>


                <Box className="pre-trained-storage-options-box-slider" textAlign='center'>

                  <Slider
                    value={preTrainedModelToLoad}
                    onChange={(event, newValue) => {
                      setPreTrainedModelToLoad(newValue);
                    }}  
                    step={3}
                    min={0}
                    max={9}
                    marks={[
                      { value: 0, label: <span style={{color: 'white', fontSize: '150%'}}>0</span>},
                      { value: 3, label: <span style={{color: 'white', fontSize: '150%'}}>3</span>},
                      { value: 6, label: <span style={{color: 'white', fontSize: '150%'}}>6</span>},
                      { value: 9, label: <span style={{color: 'white', fontSize: '150%'}}>9</span>},
                  ]}
                  />

                </Box>

                
              </div>  

            )}
      
    </div>
  );
}

export default SaveLoadButton;
