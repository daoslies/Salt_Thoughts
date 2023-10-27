import { useState, useReducer, useCallback } from 'react'; 

import Wire from './Wire';
import EmbeddingRep from './Embedding_Representation'



// Spawn particle helper for Embedding Rep
function spawnParticle( state, dots ) {

  if (dots === 'Reset') {
    return [];
  }

  // Select random circle element
  if (dots[0]) {


    
    const vw = 50; // 50vw
    const width = window.innerWidth;
    const widthScaled = width/1707;
    const vwInPixels = (vw / 100) * width;
    const vhInPixels = 0.5 * window.innerHeight;
    
    const x_offset = vwInPixels - 70;
    const y_offset = vhInPixels - 50;
    
    // LaserBoxPosition 
    const wireNodeX = x_offset + 70;
    const wireNodeY = y_offset - 75;
    


  let neuron = {x : 50, y : 50};

  let id = parseInt(Math.random() * dots.length);

  neuron = dots[id];

  // Get its position  
  const x = neuron.x - 0 + wireNodeX-(70 * widthScaled);
  const y = neuron.y - 0 + wireNodeY+(85 * widthScaled);

  var new_particle = {
    x: x,
    y: y,
    id: id,
    opacity: neuron.opacity
  }


  if (!state) {
    return [new_particle]
  }
  else {
    return [...state, new_particle];
  }

  }
}




const Dyanmic_Menu_Elements = () => {

  const [renderEmbeddingRep, setRenderEmbeddingRep] = useState(false);
  const [particles, spawnParticleDispatcher] = useReducer(spawnParticle, []);

  const spawnParticleDispatcherCallback = useCallback((dots) => {
    spawnParticleDispatcher(dots) 
  }, [spawnParticleDispatcher])

  //the memo and callback above are attempts at optimisations that may be unnecessary 
  

  return (

    <div className="port-div">

        <svg  
            className="svg-container" id="svg-container"
            width="100vw" height = "100vh" > 
        </svg>  {/* Wire & EmbeddingRep live in this svg-container */}

        {  <Wire setRenderEmbeddingRep={setRenderEmbeddingRep} /> }

        {  !renderEmbeddingRep && <EmbeddingRep
                                    particles={particles} 
                                    spawnParticleDispatcher={spawnParticleDispatcherCallback}/>}

    </div>

  );
};

export default Dyanmic_Menu_Elements;
