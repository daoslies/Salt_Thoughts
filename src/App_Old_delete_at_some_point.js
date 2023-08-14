import React from "react";
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link }  from "react-router-dom";

import { CSSTransition } from 'react-transition-group';

//import { Button } from 'semantic-ui-react';
import BunBang from "./BunnyBang"
import Salt from "./Salty"
import Salt_Sim from "./Salty_Sim"
import Salt_Sim_2 from "./Salty_Sim_2"
import Salt_Sim_3 from "./Salty_Sim_3"

import './App.css';

//As a human you should be able to edit weights and biases with sliders.

function toggleClickedClass(e) {
  e.currentTarget.parentNode.classList.toggle('clicked');
}

//onTouchStart={(event) => event.target.toggleClickedClass}>

const App = () => {

  const [navbarExpanded, setNavbarExpanded] = useState(true);
//<div className=> {"Nav-bar"}{`Nav-bar${navbarExpanded ? '' : ''}`}    style={{ height: navbarExpanded ? '20vh' : '100vh' }}
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
  //onEntered={() => setNavbarExpanded(true)}  // Expanding, so set to false after enter 
  //onExited={() => setNavbarExpanded(false)}   // Collapsing, so set to true after exit
  //onEntered={() => setNavbarExpanded(!navbarExpanded)}
  //onExited={() => setNavbarExpanded(!navbarExpanded)} 
>


<div className={"Nav-bar"}>


        <div className="App-header">
          
          <h2>The World of Salt</h2>
          
          <div class="nav-button" onClick={(event) => event.target.classList.add('clicked')}>Home</div>

          <nav className={`navbar navbar-expand-lg navbar-light bg-light ${navbarExpanded ? 'expanded' : ''}`}>

            <Link to={'/Salt'} className="nav-link" onClick={() => setNavbarExpanded(!navbarExpanded)}>
            <button> <p>Salt Thoughts</p></button>
            </Link>

            <Link to={'/BunnyBang'} className="nav-link">
            <button> <p>BunBang!</p></button>
            </Link>

            <Link to={'/Salt_Sim'} className="nav-link">
            <button> <p>Click The Salt Flow</p></button>
            </Link>

            <Link to={'/Salt_Sim_2'} className="nav-link">
            <button> <p>Watch The Salt Flow</p></button>
            </Link>

            <Link to={'/Salt_Sim_3'} className="nav-link">
            <button> <p>Salt Flower</p></button>
            </Link>
          </nav>
          </div>
          </div>
        </CSSTransition>


          
<Routes>
    <Route path="/Salt" element={<Salt />} /> 
    <Route path="/BunnyBang" element={<BunBang />} /> 
    <Route path="/Salt_Sim" element={<Salt_Sim />} /> 
    <Route path="/Salt_Sim_2" element={<Salt_Sim_2 />} /> 
    <Route path="/Salt_Sim_3" element={<Salt_Sim_3 />} /> 
</Routes>

</Router>

          

    
  );
}

export default App;