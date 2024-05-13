import { useState, useEffect, useRef } from 'react';

import { CSSTransition } from 'react-transition-group';

import "./IlliumsNote.css";

import IlliumsNoteText from './IlliumsNoteText';

import envelopeImageMain from './Salt_Pics/Envelope_main_No_background.png';
import envelopeImageBackground from './Salt_Pics/Envelope_main_background.png';
import envelopeImageClosedFlap from './Salt_Pics/Envelope_Closed_Flap.png';
import envelopeImageOpenFlap from './Salt_Pics/Envelope_Open_Flap.png';

const IlliumsNote = () => {

  const illiumsNoteTextDivRef = useRef(null);
 

  const [bookStyles, setBookStyles] = useState({});
  const [envelopeImageHovered, setEnvelopeImageHovered] = useState(false);
  const [envelopeImageMouseDown, setEnvelopeImageMouseDown] = useState(false);
  
  const [isEnvelopeClicked, setIsEnvelopeClicked] = useState(true);
  const [envelopePosition, setEnvelopePosition] = useState({ x: '-5vw', y: '20vh' });


  useEffect(() => {  
    // Function to update window size on resize

    const bookPort = document.querySelector(".audio-port");

    if (bookPort) {
      setBookStyles(window.getComputedStyle(bookPort));
    }


    const handleResize = () => {
      if (bookPort) {
        setBookStyles(window.getComputedStyle(bookPort));
        setIsEnvelopeClicked(true)
      }
    };
    // Add event listener on component mount
    window.addEventListener("resize", handleResize);
    handleResize()
    // Cleanup function to remove listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array ensures effect runs only once on mount


  /*
  useEffect(() => {

    if (isEnvelopeClicked) {
        setEnvelopePosition({ x: '0vw', y: '0vh' })
    }
    else {
        setEnvelopePosition({ x: '10vw', y: '10vh' })
    }

  }, [isEnvelopeClicked]);

  */
  useEffect(() => {
    illiumsNoteTextDivRef.current.innerHTML = IlliumsNoteText
  }, [isEnvelopeClicked]);


  const EnvelopeDiv = () => (


      <div 
        className = 'envelope' 
        id = 'envelope-img-div'
        style={{
                position: 'absolute',
                height: '10vw',
                top: `calc(${bookStyles.top} - 3vw`,
                left: `calc(${bookStyles.left} + 18vw`,
                zIndex: 44
          }}
        alt="Illium's Note"
        >
          <div>

            <img src={envelopeImageBackground} style={{height: '10vw', position: 'absolute'}}/>

            <img src={envelopeImageOpenFlap} className='openflap'
                                            style={{height: '5vw', top: '-4.5vw', position: 'absolute'}}/>

            <div  className = 'illiums-note-text' id = 'illiums-note-text'
                  ref = {illiumsNoteTextDivRef}
                
                  style={{position: 'absolute', 
                          //top: '-7vh',
                          //height: '10vw', 
                          width: '15vw',
                          left: '2vw',
                          //overflowY: 'scroll',
                          //transform: 'scale(0.8)'
                        }}
            >      

            {/*
              <button className = 'illiums-note-text'
  
                style={{
                  position: 'absolute',
                  //height:'20vw',
                  //left: '5vw',
                  //top:'2vw',
                  zIndex: "101",  
                  pointerEvents: "none",
                }}
          
                onClick={() => {
                  if (!isEnvelopeClicked) {
                    setIsEnvelopeClicked(false);
                  }
                }}
                onTouchStart={() => {
                  if (!isEnvelopeClicked) {
                    setIsEnvelopeClicked(false);
                  }
                }}
              
              >
        
                X
        
              </button> */}

            </div>

            <img src={envelopeImageMain} style={{height: '10vw', position: 'absolute'}}/>
            <img src={envelopeImageClosedFlap}  className='closedflap'
                                            style={{height: '10vw', position: 'absolute'}}/>
            

          </div>
        </div>

  );

return (

    <div className = 'envelope-container'>
      <div className = 'envelope'
      

      style={{height: '10vw', width: '17.75vw', zIndex:100, //border: '3px solid red', 
      cursor: 'pointer', pointerEvents: 'auto', position: 'absolute',
      top: `calc(${bookStyles.top} - 3vw`,
      left: `calc(${bookStyles.left} + 18vw`,
      transform: isEnvelopeClicked ? "translate(0%, 0%) rotate(0deg)" : "translate(-70vw, 20vh) rotate(45deg)",
      transformOrigin: 'left'
      
      //; transition: all 500ms ease-in 200ms;" }
    
    }}

      onClick={() => {
        setIsEnvelopeClicked(!isEnvelopeClicked)
      }}

      onTouchStart={() => {
        setIsEnvelopeClicked(!isEnvelopeClicked)
      }}

      ></div>

      <CSSTransition


          in={isEnvelopeClicked}
          //out={!isEnvelopeClicked}
          classNames="envelope"

          timeout={25000}

          /*
          onMouseEnter={() => setEnvelopeImageHovered(true)}
          onMouseLeave={() => setEnvelopeImageHovered(false)}
  
          onTouchStart={() => {   setIsEnvelopeClicked(!isEnvelopeClicked);
                                  setEnvelopeImageMouseDown(true)}}
  
          onTouchEnd={() => setEnvelopeImageMouseDown(false)}
  
          onMouseDown={() => {    setIsEnvelopeClicked(!isEnvelopeClicked);
                                  setEnvelopeImageMouseDown(true)}}
  
          onMouseUp={() => setEnvelopeImageMouseDown(false)}
  
          onClick={() => {
  
            }} */

          >

              <EnvelopeDiv/>

    
        </CSSTransition>

    </div>

  )

}

export default IlliumsNote


/*
//className = //{isEnvelopeClicked ? "envelope clicked" : "envelope"}

//height: '10vw',

                                //top : 'calc(' + bookStyles.top + ' - (3.85vw)',
                                //left: 'calc(' + bookStyles.left + ' - (15vw)',  height: '20vw',

                                top: `calc(${bookStyles.top} - 3vw`,
                                
                                //isEnvelopeClicked ? `calc(${bookStyles.top} - 3.85vw + ${envelopePosition.y})`
                                //    : `calc(${bookStyles.top} - 3.85vw)`,
                                left: `calc(${bookStyles.left} + 18vw`,
                                
                                //isEnvelopeClicked ? `calc(${bookStyles.left} - 15vw + ${envelopePosition.x})`  
                                //    : `calc(${bookStyles.left} - 15vw + ${envelopePosition.x})`,

//                                //translate(${isEnvelopeClicked ? envelopePosition.x : '0'}, ${isEnvelopeClicked ? envelopePosition.y : '0'})
//${isEnvelopeClicked ? `translateX(-40vw)` : ''}

                                /*transform: `
                                
                                ${envelopeImageHovered ? 'rotate(25deg)' : ''}  
                                ${envelopeImageMouseDown ? 'scale(0.9)' : ''}
                                `, */
                                //transition: 'all 0.5s ease-in-out', */