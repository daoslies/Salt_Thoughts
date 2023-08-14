import React from "react";
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link }  from "react-router-dom";

import { CSSTransition } from 'react-transition-group';
import * as d3 from 'd3';


//import { Button } from 'semantic-ui-react';
import BunBang from "./BunnyBang"
import Salt from "./Salty"
import Salt_Sim from "./Salty_Sim"
import Salt_Sim_2 from "./Salty_Sim_2"
import Salt_Sim_3 from "./Salty_Sim_3"

import ChapterText from "./Your_Thoughts_Are_Made_Of_Salt_The_Machine_1"

import audio_port_img from './Salt_Pics/audio_port.png';

import push_me_img_1 from './Salt_Pics/PushMe1.png';
import push_me_img_2 from './Salt_Pics/PushMe2.png';
import push_me_img_3 from './Salt_Pics/PushMe3.png';
import push_me_img_4 from './Salt_Pics/PushMe4.png';



import Wire from './Wire';

import EmbeddingRep from './Embedding_Representation'

import './App.css';


const push_me_images = [
  push_me_img_1,
  push_me_img_2,
  push_me_img_3,
  push_me_img_4
];



const Chapter = () => {
  return (
    <div className="chapter-content" dangerouslySetInnerHTML={{__html: ChapterText}}></div>
  );
}


//As a human you should be able to edit weights and biases with sliders.

//10/08/2023 - lel, the above never happened. ehh maybe still could, but does feel like faff. 

function toggleClickedClass(e) {
  e.currentTarget.parentNode.classList.toggle('clicked');
}

//onTouchStart={(event) => event.target.toggleClickedClass}>



// Custom hook
function useNavbar() {
  const [navbarExpanded, setNavbarExpanded] = useState(true);
  
  return [navbarExpanded, setNavbarExpanded];
}

// Export the hook
export { useNavbar };


function RouteButton(RouteRef, left, top, pushMeimageIndex, navbarExpanded) {
  return (

    <g className="hidden" style={{pointerEvents: 'none'}} ref={RouteRef}>


       <image href={push_me_images[pushMeimageIndex]} height="60" width="60" 
       transform={`translate(${
        navbarExpanded ? left - 12 : left + 12  
      }, ${
        navbarExpanded ? top - 35 : 50
      })`} />


      <text  
        
        transform={`translate(${left-5},${top-20})`}
        dy={20} 
        fill="white"
        fontSize="20px"
      >

      </text>

    </g>
  );
}



const App = () => {


  

  const [navbarExpanded, setNavbarExpanded] = useNavbar();
  
  const [selected, setSelected] = useState('');
  const [dragging, setDragging] = useState(false);
  const [showWire, setShowWire] = useState(false);
  const [target, setTarget] = useState(null);

  const [pushMeimageIndex, setPushMeImageIndex] = useState(0);

  const bookRouteRef = useRef(null);
  const audioRouteRef = useRef(null);
  const simRouteRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * push_me_images.length);
      setPushMeImageIndex(randomIndex);
    }, 165);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    
  }, []);

  // Are any of these handle wire or dragging use effects even used??
  

 // Add event listener 
 function handleWirePluggedIn(event) {
  if(event.detail.port === 'port1') {
     // Update route to book
  } else if(event.detail.port === 'port2') {
    // Update route to audiobook 
  }
}

useEffect(() => {
  window.addEventListener('wirePluggedIn', handleWirePluggedIn);

  return () => {
    window.removeEventListener('wirePluggedIn', handleWirePluggedIn); 
  }
}, []);


//<div className=> {"Nav-bar"}{`Nav-bar${navbarExpanded ? '' : ''}`}    style={{ height: navbarExpanded ? '20vh' : '100vh' }}
  
  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', (event) => {
        if (event.target.classList.contains('book')) {
          setSelected('book');  
        }
        if (event.target.classList.contains('audiobook')) {
          setSelected('audiobook');  
        }
        if (event.target.classList.contains('simulation')) {
          setSelected('simulation');  
        }
        // Check for audiobook and sim targets
      });
    }
  }, [dragging]);

  const checkTarget = (event) => {
    if (event.target.classList.contains('book')) {
      setTarget('book');
      event.target.style.outline = '2px solid blue';  // Highlight target 
    }
    // Check for other targets...
  }

  const handleDrop = () => {
    document.removeEventListener('mousemove', checkTarget);
    document.removeEventListener('mouseup', handleDrop);
    if (target) {
      setShowWire(false);
      if (target === 'book') {
        setSelected('book');  // Load book page
      }
      // Load other page if different target...
      setTarget(null);       // Reset 
    }
  }


  
return (

  
<Router>

<CSSTransition 
  //in={!navbarExpanded} 
  timeout={1000} 
  classNames='Nav-bar'
  onEntered={() => {
    document.querySelector('.Nav-bar').style.height = '20vh'
  }}
  onExit={() => {
    document.querySelector('.Nav-bar').style.height = '' 
  }}
>


<div className="Nav-bar">


    <div className="App-header">

    <div className="Absolute-test" >

      
    <h2 background-color="#282c3400" className="salt-text">The World of Salt</h2>





{/* 
<Link 

to={'/Salt'} className={selected === 'book' ? 'selected' : 'nav-link'} 
onClick={() => setNavbarExpanded(!navbarExpanded)}>

<button className="book-button"> <p>Salt Thoughts</p></button>

<img className="book-button" src={audio_port_img} id="audio_port_img" alt="port" />


</Link>

<Link to={'/Audiobook'} className={selected === 'audiobook' ? 'selected' : 'nav-link'} onClick={() => setNavbarExpanded(!navbarExpanded)}>



<button className="audio-button"> <p>Audio!</p></button>

<img className="audio-button" src={audio_port_img} id="audio_port_img" alt="port" />

</Link>

<Link to={'/Salt_Sim_3'} className={selected === 'simulation' ? 'selected' : 'nav-link'} onClick={() => setNavbarExpanded(!navbarExpanded)}>

<button className="flower-button"> <p>Salt Flower</p></button>

<img className="flower-button" src={audio_port_img} id="audio_port_img" alt="port" />

</Link>
*/}


    </div>

    {/* 

    *********************************************************************************

    Ok, so for whatever reason the img's below are not dissapearing when we move to a scene.

    I think maybe the most straightforward ... Ha... thing to do, is to apply css transitions to the images
    in the exact same way as there is a css tranistion on the navbar.

    Right. you got that?

    Ima go bed.

    Good luck

    ******************************************************************************************
    
    Ok and now you need to deal with you things being on top of other things 11/08/2023 03:37

    Specifically, you can't scroll on the text in the chapter component. 

    I *think* because other elements within nav-bar are on top of it.

    Also previously not all the elements within nav-bar moved on the transition.

    But now they all do.

    And that is both better and worse.

    But does need to be dealt with.

    ********************************************************************************

  <CSSTransition
    in={!navbarExpanded} 
    timeout={1000}
    classNames='Nav-images'


    onEntered={() => {
      document.querySelectorAll('.book-button, .audio-button, .flower-button').forEach(img => {
        img.style.transform = 'translateY(-180px)'; 
      })
    }}
  
    onExit={() => {
      document.querySelectorAll('.book-button, .audio-button, .flower-button').forEach(img => {
        img.style.transform = ''; 
      })
    }}
    
  >
  <>
    <img className="book-button" src={audio_port_img} />
    <img className="audio-button" src={audio_port_img} /> 
    <img className="flower-button" src={audio_port_img} />
  </> 
</CSSTransition>

    */}

    <img className="book-button" src={audio_port_img} 
          style={{
            '--tx': navbarExpanded ? '0px' : '-13vw',
            '--ty': navbarExpanded ? '0px' : '-25vh'

          }}  />

    <img className="audio-button" src={audio_port_img} 
          style={{
            '--tx': navbarExpanded ? '0px' : '-28vw',
            '--ty': navbarExpanded ? '0px' : '-25vh'
          }}  /> 

    <img className="flower-button" src={audio_port_img} 
          style={{
            '--tx': navbarExpanded ? '0px' : '35vw',
            '--ty': navbarExpanded ? '0px' : '-65vh' 
          }}  />

    <Wire bookRouteRef={bookRouteRef} audioRouteRef={audioRouteRef} simRouteRef={simRouteRef} />  {/* wire lives in svg-container, below. */}

    <EmbeddingRep></EmbeddingRep>

    <svg  className="svg-container" id="svg-container" position="absolute"
          width="100vw" height = "100vh" 
             
          >

          <Link 

          to={'/Salt'}  id="book-link" onClick={() => setNavbarExpanded(!navbarExpanded)}>

          {RouteButton(bookRouteRef, 450, 270, pushMeimageIndex, navbarExpanded)}

          </Link>
       
        

          <Link 
          
          to={'/Audiobook'} id="audio-link" onClick={() => setNavbarExpanded(!navbarExpanded)}>

          {RouteButton(audioRouteRef, 935, 270, pushMeimageIndex, navbarExpanded)}
          
          </Link>   


          <Link 
          
          to={'/Salt_Sim_3'} id="sim-link" onClick={() => setNavbarExpanded(!navbarExpanded)}>

          {RouteButton(simRouteRef, 690, 570, pushMeimageIndex, navbarExpanded)}

          </Link>
          

          <text id="embedding-text" className="text-test"  transform="translate(250,350)">Embedding2Txt.nnet   </text> 

          <text  className="text-test"  transform="translate(750,350)">Embedding2Audio.nnet</text>  
  
          <text  className="text-test"  transform="translate(500,650)">Embedding2Flowers.nnet</text>        


          {/* 
          
            curren positions:

            txt : 250,300
            Audio: 750,300
            flowers 500,600

          */}


      
    </svg>

          


        

          </div>          

        </div>
          
    </CSSTransition>

<Routes>


    <Route path="/Salt" element={<Chapter />} /> 
    {/*<Route path="/Audiobook" element={<Audiobook />} /> */}
    <Route path="/Salt_Sim_3" element={<Salt_Sim_3 />} /> 

   {/* {selected === 'book' && <Route path="/Salt" element={<Salt />} /> }
    {/*{selected === 'audiobook' && <Route path="/Audiobook" element={<Audiobook />} /> } */}
    {/*{selected === 'simulation' && <Route path="/Salt_Sim_3" element={<Salt_Sim_3 />} /> } */}
</Routes>

</Router>

          

    
  );
}

export default App;