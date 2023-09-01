
import "./Book.css";
import React, { useState, useEffect, useRef, createContext } from 'react'; 

import ChapterText from "./Your_Thoughts_Are_Made_Of_Salt_The_Machine_1"

const Book = () => {

  // No flippin idea why callback is required, 
  // but it absolutly requires it and will just not trigger if you do not use one



  // No the callbacks did nothing


  ///////////////////////////////////////////////// ++

  // The sitch.

  // Overlays have, for whatever fokkin reason, killed the mouse.

  // I don't why. I don't know how.

  // Maybe its solvable.

  // Maybe it simply isen't.

  // Options from here:

  // Go back to previous routing system, and try and jiggle it into a flexbox.

  // Remove routing altogethre and conditionally render

  // Spend the next 3 weeks crying about <overlay> being a bastard.
  
  //Bed time now

  //Mayhaps sleep will bring the resolution you seek.

  // 01/09/2023 -- Summer is over. It was... alright. 

  // You lived a lot of life, but simultaneously didn't really do anything.

  useEffect(() => {

    var x = document.getElementById('bookcheck')
    console.log('bookcheck: ', x)
    x.addEventListener('click', (event) => {
      console.log('Book Click Checks: ', event.target); 
    })
  }, [])

  useEffect(() => {
    document.addEventListener('click', (event) => {
      console.log('Click Checks: ', event.target); 
    })
  }, [])

  const onButtonClick = React.useCallback((event) => {   
    alert('Button Clicked')
}, []);

  const handleClick = (e) => {
    e.stopPropagation();

    onButtonClick(e)
    // do something 
  }
/*
  useEffect(() => {
    const div = document.getElementById('clickTest1');
    div.addEventListener('click', handleClick);
  }, [])

  */
  //id='clickTest1'
  return (

    
    <div className="book" id='bookcheck'>
      <div className="clickTest" onClick={onButtonClick}/>
      <div className="clickTest" onMouseDown={handleClick}/>
      <div className="chapter-text" dangerouslySetInnerHTML={{__html: ChapterText}} onMouseDown={e => e.stopPropagation()}/>
    </div>
  );
};

export default Book;
