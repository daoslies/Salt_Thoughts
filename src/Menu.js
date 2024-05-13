import "./Menu.css";

import { useState } from 'react'; 

import Dyanmic_Menu_Elements from "./Dynamic_Menu_Elements";
import About_Menu from "./AboutMenu";
import Scrolling_Port_labels from "./ScrollingPortLabels";
import IlliumsNote from './IlliumsNote';

import The_Desk from './Salt_Pics/The_Desk.png';



const Menu = () => {

  const [isAboutMenu, setIsAboutMenu] = useState(false);


  return (
    <div className="menu" style ={{overflowY:'auto'}}>
      <div className="title-container" >
        <b className="your-thoughts-are">Your Thoughts Are Made Of Salt</b>
      </div>
      
      <div id='desk-dynamic+ports' style={{position: 'absolute', left: '0vh', top: '10vh', width: '100vw', height: '90vh'
        }}>

      <IlliumsNote/>
          
      <Dyanmic_Menu_Elements style={{ zIndex: 20}}/>

          <svg  
              className="svg-container" id="svg-container"
              width="100%" height = "100%" style={{position: 'absolute', zIndex:43, pointerEvents: "none"}}> 
          </svg>  {/* Wire live in this svg-container */}

          <svg  
              className="svg-container-low-z" id="svg-container-low-z"
              width="100%" height = "100%" style={{position: 'absolute', zIndex:41}}> 
          </svg>  {/* elements of Wire that want a lower z-index live in this svg-container  -- Literally just the blue light*/}

          <svg  
              className="svg-container-embedding-rep" id="svg-container-embedding-rep"
              width="100%" height = "100%" style={{position: 'absolute', zIndex:40}}> 
          </svg>  {/* EmbeddingRep live in this svg-container */}

          
      


      <img src={The_Desk}  style={{position: 'relative', left: '0vh', width: '100%', zIndex:0
        }}></img>

      


      <Scrolling_Port_labels/>

      </div>

      <About_Menu isAboutMenu={isAboutMenu} setIsAboutMenu={setIsAboutMenu} />




      <div className="footer">
        <div className="about-container" style={{pointerEvents: 'none'}}>
          <b className="about" 
            style={{pointerEvents: 'auto', bottom: '5%'}}
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
