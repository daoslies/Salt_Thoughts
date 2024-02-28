import { useState } from 'react'; 

import Button from '@mui/material/Button';

import SaveLoadButton from './SaveLoadButton';

import LearningRateSlider from "./LearningRateSlider";

const Network_Menu = (props) => {

    const {
      networkMenuOpen,
      trainingScore,
      epochNum,
      togglePhysics,
      play_button_back_images,
      controlPanelImageIndex,
      Start,
      play_button_lever_img,
      numSalts,
      setgraphTime,
      graphTime,
      setgradTrackTime,  
      gradTrackTime,
      learningRate,
      setLearningRate,
      network,
      numLayers,
      layerArray,
      setloadedModel,
      loadedModel
    } = props;

    const primaryColour = '#1976d2';
    const secondaryColour = '#2f3e99';

    const [gradientTrackingButtonColor, setGradientTrackingButtonColorButtonColor] = useState(primaryColour);
    const [accuracyPlotButtonColor, setAccuracyPlotButtonColorButtonColor] = useState(primaryColour);

    

  return (

    <div 
        className={`network-menu-wrapper ${networkMenuOpen ? 'open' : 'collapsed'}`}
        style={{ pointerEvents: 'auto' }}>

        <networkmenu>

        <h1 >   Translation is Liquid  </h1>

        {/*<div style = {{position: 'absolute', bottom: '15%', border: '3px solid red'}}> */}

        <p > {trainingScore} / {epochNum} </p>

        {/*</div>*/}
        
        <div 
            style={{pointerEvents: 'auto', 
            height:'15vw', width:'15vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
        
          <img
            style={{position: 'absolute', pointerEvents: 'auto', 
              height:'15vw', width:'15vw',
              left: '50%',
              transform: 'translateX(-50%)',
                          }}       
           
            onClick={() => togglePhysics()}
            onTouchStart={() => togglePhysics()}
            
            src={play_button_back_images[Math.max(0,controlPanelImageIndex-1)]}/>


          <img className={`play-button-lever ${Start ? 'on' : 'off'}`}
            style={{position: 'absolute', pointerEvents: 'auto', 
              height:'15vw', width:'15vw',
              left: '50%',
                          }}    

            onMouseDown={() => togglePhysics()} 
            onTouchStart={() => togglePhysics()}
            
            src={play_button_lever_img}/>

            <div style = {{position:'relative', left: '55%', top: '-55%'}}>On</div>
            <div style = {{position:'relative', left: '110%', top: '0%'}}>Off</div>




        </div>
          
          {/* 
          <Button variant="contained" color="primary" onClick={() => {setnumSalts(numSalts + 1); 
            getCurrentTargetCallback(); 
            outputSaltCountCallback();}}>

            Add Salt
          </Button>   
          */}
          
          <p>Salt Count: {numSalts}</p>

          <Button variant="contained" 
            style={{
              backgroundColor: accuracyPlotButtonColor,
            }}
            onClick={() => {
              setgraphTime(!graphTime)
              setAccuracyPlotButtonColorButtonColor(accuracyPlotButtonColor === primaryColour ? secondaryColour : primaryColour);    
            }}>

              Accuracy Plot

          </Button>

          <Button variant="contained" 
            style={{
              backgroundColor: gradientTrackingButtonColor,
            }}

            onClick={() => {
              setgradTrackTime(!gradTrackTime)
              setGradientTrackingButtonColorButtonColor(gradientTrackingButtonColor === primaryColour ? secondaryColour : primaryColour);
            }}>

              Gradient Tracking
              
          </Button>

          

        
          
          
          

          
          <LearningRateSlider learningRate={learningRate} setLearningRate={setLearningRate} />
      


          <SaveLoadButton network={network} numLayers={numLayers} 
                          layerArray={layerArray} setloadedModel={setloadedModel} loadedModel={loadedModel}
          /> 

          
          {/*<ToggleSwitch onInputAndOrStateChange={handleInputAndOrStateChange} 
          onOutputAndOrStateChange={handleOutputAndOrStateChange} /> */}

        </networkmenu> 
      </div>

 
  );
};

export default Network_Menu;