import React from "react";
import { BrowserRouter as Router, Routes, Route, Link }  from "react-router-dom";
//import { Button } from 'semantic-ui-react';
import BunBang from "./BunnyBang"
import Salt from "./Salty"
import Salt_Sim from "./Salty_Sim"
import Salt_Sim_2 from "./Salty_Sim_2"

import './App.css';


const App = () => {
  return (


<Router>

<div className="Nav-bar">
        <div className="App-header">
          
        
          <h2>The World of Salt</h2>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">

            <Link to={'/Salt'} className="nav-link"> 
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
          </nav>
          </div>
          </div>


          
<Routes>
    <Route path="/Salt" element={<Salt />} /> 
    <Route path="/BunnyBang" element={<BunBang />} /> 
    <Route path="/Salt_Sim" element={<Salt_Sim />} /> 
    <Route path="/Salt_Sim_2" element={<Salt_Sim_2 />} /> 
</Routes>

</Router>

          

    
  );
}

export default App;