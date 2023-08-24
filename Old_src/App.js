import React from "react";
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link }  from "react-router-dom";

import { CSSTransition } from 'react-transition-group';


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




function RouteButton(RouteRef, left, top, pushMeimageIndex, navbarExpanded) {
  return (

    <g className="hidden" style={{pointerEvents: 'none'}} ref={RouteRef}>

       <image href={push_me_images[pushMeimageIndex]} height="60" width="60" 
       transform={`translate(${
        navbarExpanded ? left - 12 : left + 12  
      }, ${
        navbarExpanded ? top - 35 : 50
      })`} />

    </g>
  );
}



const App = () => {


  

  const [navbarExpanded, setNavbarExpanded] = useState();
  
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
  

  
return (

  
<Router>

<CSSTransition 
  in={!navbarExpanded} 
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


    </div>

 

    <Wire 
    bookRouteRef={bookRouteRef} 
    audioRouteRef={audioRouteRef} 
    simRouteRef={simRouteRef} 
    navbarExpanded={navbarExpanded} 
    />  {/* wire lives in svg-container, below. */}

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