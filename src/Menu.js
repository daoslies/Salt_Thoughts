import "./Menu.css";

import { useState } from 'react'; 

import Dyanmic_Menu_Elements from "./Dynamic_Menu_Elements";
import About_Menu from "./AboutMenu";

import The_Desk from './Salt_Pics/The_Desk.png';

const Menu = () => {

  const [isAboutMenu, setIsAboutMenu] = useState(false);


  return (
    <div className="menu" style ={{overflow:'hidden'}}>
      <div className="title-container" >
        <b className="your-thoughts-are">Your Thoughts Are Made Of Salt</b>
      </div>

      <img src={The_Desk} style={{position: 'absolute', left: '0vh', top: '12.5vh', width: '100vw'}}></img>

      <Dyanmic_Menu_Elements/>

      <About_Menu isAboutMenu={isAboutMenu} setIsAboutMenu={setIsAboutMenu} />



      <div className="footer">
        <img className="div-child" alt="" />
        <div className="about-container">
          <b className="about" 
            onClick={() =>  setIsAboutMenu(!isAboutMenu)}
            onTouchStart={() =>  setIsAboutMenu(!isAboutMenu)}
          >
            What is this all <span style = {{color: 'white', margin: '1vw', fontSize: 'calc(7px + 1.5vmin)' }}> About </span> ? 
          </b>
        </div>
      </div>
    </div>
  );
};

export default Menu;
