import React, { useRef, useState } from 'react';


import "./Book.css";
import ChapterText from "./Your_Thoughts_Are_Made_Of_Salt_The_Machine_2"
import ChapterText1 from "./Your_Thoughts_Are_Made_Of_Salt_The_Machine_1"

import book_img from './Salt_Pics/Book_1_v3.png';

const Book = () => {                                                                                                                

  const [page, setPage] = useState(1);
  const [leftPage, setLeftPage] = useState([])
  const [rightPage, setRightPage] = useState([])

  const paragraphRef = useRef();

  const PAGE_SIZE = 3; 


  function getPage(index) {
    // Create DOM element from HTML 
    const pageEl = document.createElement('div');

    pageEl.innerHTML = ChapterText1;

    // Get current page nodes
    const numPages = Math.ceil(pageEl.childElementCount / PAGE_SIZE);  
    const start = index * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, pageEl.children[0].childElementCount);

    const pageNodes = [...pageEl.children[0].children].slice(start, end);

    //const paragraphs = pageNodes.map(paragraph => <div>{paragraph}</div>)
    
  // Multi-column layout

  var leftPage = []
  var rightPage = []
  const MAX_HEIGHT = 450;

  let currentCol = 'left';
  let currentHeight = 0;

  pageNodes.forEach(paragraph => {

    console.log(paragraph.innerHTML.length)


    var reactElement_Paragraph = React.createElement('div', {
      style: {
        transform: 'skew(1deg, 10deg)',
        fontSize: '2vh'
      },
      ref: {paragraphRef}
    }, paragraph.innerHTML);



    console.log('CUrrentHeight: ', currentHeight)

    if (currentHeight + paragraph.innerHTML.length  > MAX_HEIGHT) { 
      currentCol = 'right';
      currentHeight = 0;
    }


    if (currentCol == 'left') {
      leftPage.push(reactElement_Paragraph)
    }
    else {
      reactElement_Paragraph.props.style.transform = 'skew(-1deg, -10deg) ' 
      rightPage.push(reactElement_Paragraph)
    }

    currentHeight += paragraph.innerHTML.length;

  });



    var pages = {left: leftPage, right: rightPage}


    return pages
    
  }

  function paginate() {

    var contentBox = document.getElementById('XXX');

    console.log('ContentBox', contentBox)
  /*   var words = contentBox.text().split(' ');

    var newPage = document.createElement('div');
    contentBox.empty().append(newPage);
    var pageText = null;
    for(var i = 0; i < words.length; i++) {
        var betterPageText;
        if(pageText) {
            betterPageText = pageText + ' ' + words[i];
        } else {
            betterPageText = words[i];
        }
        newPage.text(betterPageText);
        if(newPage.height() > window.height()) {
            newPage.text(pageText);
            newPage.clone().insertBefore(newPage)
            pageText = null;
        } else {
            pageText = betterPageText;             
        }
    } */    
}




  return (

    <div className="book" id='bookcheck' style={{position:'relative'}}>
      {/*ChapterText*/}
      <div id ="XXX" style={{color:'red', whiteSpace: "pre", textAlign: "left"}} >
          text X text
          Text
      </div>
      <div style={{position:'absolute', zIndex: 0, height:'100%', left: '2%'}}>
        <img className="book-img" src={book_img}  draggable="false" dragstart="false" 
              style={{userSelect: 'none', userDrag: 'none', 
                      height: '100%'}} >
        </img>
      </div>

      <div style={{position:'absolute', zIndex: 1}}>

        <div className="page" style={{position:'absolute',  height: '5vh', width: '18vw', left: '21vw', top:'15vh',
            }}>
          {getPage(page).left} 
        </div>

        <div className="page" style={{position:'absolute',  height: '5vh', width: '18vw', left: '42vw', top:'15vh',
            }}>
          {getPage(page).right} 
        </div>

      </div>

      <div style={{position:'absolute', zIndex: 1}}>


        <button onClick={() => setPage(page-PAGE_SIZE)}>Prev Page</button> 

        <button onClick={() => setPage(page+PAGE_SIZE)}>Next Page</button>


      </div>
    </div>
  );
};

export default Book;
/*

    

  const [page, setPage] = useState(1);
  const [leftPage, setLeftPage] = useState([])
  const [rightPage, setRightPage] = useState([])

  const paragraphRef = useRef();

  const PAGE_SIZE = 3; 


  function getPage(index) {
    // Create DOM element from HTML 
    const pageEl = document.createElement('div');

    pageEl.innerHTML = ChapterText;

    // Get current page nodes
    const numPages = Math.ceil(pageEl.childElementCount / PAGE_SIZE);  
    const start = index * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, pageEl.children[0].childElementCount);

    const pageNodes = [...pageEl.children[0].children].slice(start, end);

    //const paragraphs = pageNodes.map(paragraph => <div>{paragraph}</div>)
    
  // Multi-column layout

  var leftPage = []
  var rightPage = []
  const MAX_HEIGHT = 450;

  let currentCol = 'left';
  let currentHeight = 0;

  pageNodes.forEach(paragraph => {

    console.log(paragraph.innerHTML.length)


    var reactElement_Paragraph = React.createElement('div', {
      style: {
        transform: 'skew(1deg, 10deg)',
        fontSize: '2vh'
      },
      ref: {paragraphRef}
    }, paragraph.innerHTML);

    console.log('CUrrentHeight: ', currentHeight)

    if (currentHeight + paragraph.innerHTML.length  > MAX_HEIGHT) { 
      currentCol = 'right';
      currentHeight = 0;
    }


    if (currentCol == 'left') {
      leftPage.push(reactElement_Paragraph)
    }
    else {
      reactElement_Paragraph.props.style.transform = 'skew(-1deg, -10deg) ' 
      rightPage.push(reactElement_Paragraph)
    }

    currentHeight += paragraph.innerHTML.length;

  });



    var pages = {left: leftPage, right: rightPage}


    return pages
    
  }


  return (

    <div className="book" id='bookcheck' style={{position:'relative'}}>

      <div style={{position:'absolute', zIndex: 0, height:'100%', left: '2%'}}>
        <img className="book-img" src={book_img}  draggable="false" dragstart="false" 
              style={{userSelect: 'none', userDrag: 'none', 
                      height: '100%'}} >
        </img>
      </div>

      <div style={{position:'absolute', zIndex: 1}}>

        <div className="page" style={{position:'absolute',  height: '5vh', width: '18vw', left: '21vw', top:'15vh',
            }}>
          {getPage(page).left} 
        </div>

        <div className="page" style={{position:'absolute',  height: '5vh', width: '18vw', left: '42vw', top:'15vh',
            }}>
          {getPage(page).right} 
        </div>

      </div>

      <div style={{position:'absolute', zIndex: 1}}>


        <button onClick={() => setPage(page-PAGE_SIZE)}>Prev Page</button> 

        <button onClick={() => setPage(page+PAGE_SIZE)}>Next Page</button>


      </div>
    </div>
  );
};

export default Book;
*/

      {/*<div className="chapter-text" style={{zIndex: 1, position: 'absolute'}} dangerouslySetInnerHTML={{__html: ChapterText}}/>
    */}

  // No flippin idea why callback is required, 
  // but it absolutly requires it and will just not trigger if you do not use one



  // No the callbacks did nothing


  ///////////////////////////////////////////////// ++

  // The sitch.

  // Overlays have, for whatever fokkin reason, killed the mouse.

  // I don't why. I don't know how.

  // Maybe its solvable.

  // Maybe it simply isn't.

  // Options from here:

  // Go back to previous routing system, and try and jiggle it into a flexbox.

  // Remove routing altogethre and conditionally render

  // Spend the next 3 weeks crying about <overlay> being a bastard.
  
  //Bed time now

  //Mayhaps sleep will bring the resolution you seek.

  // 01/09/2023 -- Summer is over. It was... alright. 

  // You lived a lot of life, but simultaneously didn't really do anything.

  