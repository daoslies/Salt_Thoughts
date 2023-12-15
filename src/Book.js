import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';


import "./Book.css";
import ChapterText from "./Your_Thoughts_Are_Made_Of_Salt_The_Machine_2"
import ChapterText1 from "./Your_Thoughts_Are_Made_Of_Salt_The_Machine_1"

import book_img from './Salt_Pics/Sweet_v2_2.png';
import book_img_2 from './Salt_Pics/Sweet_v2_3.png';
import bookHand_img from './Salt_Pics/Book_Hand_CutOut.png';

const Book = () => {                                                                                                                

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([]);  
  const [pageText, setPageText] = useState("");

  const [bookProgress, setBookProgress] = useState({1 : 0});

  const [opacity, setOpacity] = useState(1);
  const [opacityDirection, setOpacityDirection] = useState('Down');
    
  const pageLeft = useRef(null);

  const pageRight = useRef(null);

  const paragraphRef = useRef();

  const PAGE_SIZE = 1; 


  useEffect(() => {
    const interval = setInterval(() => {

      if (opacity >= 0.9) {setOpacityDirection('Down')};
      if (opacity <= 0.1) {setOpacityDirection('Up')};

      setOpacity(prevOpacity => {

        if (opacityDirection === 'Up') {
          return prevOpacity + 0.035; 
        }
        if (opacityDirection === 'Down') {
          return prevOpacity - 0.05; 
        }
        
        
      });
    }, 50);

    return () => clearInterval(interval);
  }, [opacity]);

/*
  function getPage(index) {
    // Create DOM element from HTML 
    const pageEl = document.createElement('div');

    const textcheck = document.getElementById('XXX')


    if (textcheck) {

    //textcheck.innerHTML = "hello hello hgello"
  }
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

    //console.log(paragraph.innerHTML.length)


    var reactElement_Paragraph = React.createElement('div', {
      style: {
        transform: 'skew(1deg, 10deg)',
        fontSize: '2vh'
      },
      ref: {paragraphRef}
    }, paragraph.innerHTML);



    //onsole.log('CUrrentHeight: ', currentHeight)

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
*/
  useEffect(() => {
    const pages = PaginateText(ChapterText, pageLeft, pageRight);
    setPageText(pages);

  }, [page]);

  //console.log('pageTRext: ', pageText)

  function PaginateText(text, pageLeft, pageRight) {


    const words = text.split(' ');

    const pageHeight = 250;

    let currentPage = "";
    let textOffset = bookProgress[page]; // current position in text
    var chunkSize = 1; // characters

    let textChunk;

    
    pageLeft.current.style.transform = ''
    pageRight.current.style.transform = ''

    console.log('WrapperHeight', pageLeft.current.clientHeight, 'total text length: ', text.length)

      //page left

      if (pageLeft.current) {

      pageLeft.current.innerHTML = ''

      let whilestopper = 0

      while(pageLeft.current.clientHeight < pageHeight && whilestopper < 200) {

        console.log('CurrentHeight: ', pageLeft.current.clientHeight)
        
        // Get next chunk
        let endIndex = Math.min(textOffset + chunkSize, words.length);
        textChunk = words.slice(textOffset, endIndex).join(" ") + " ";
        //let textChunk = text.substring(textOffset, textOffset + chunkSize);
        textOffset = textOffset + chunkSize;

        console.log('textCHunk', textChunk)
  
        // Append to wrapper
        currentPage += textChunk; 

        pageLeft.current.innerText = currentPage;
        
        setBookProgress(prevDict => {
          return {
            ...prevDict,
            [page + 1]: textOffset 
          };
        });

        whilestopper += 1
      }

      // backtrack from the last word, cus it's over the height limit
      var lastSpace = currentPage.lastIndexOf(" ")
      currentPage = currentPage.substring(0, lastSpace)
      lastSpace = currentPage.lastIndexOf(" ")
      currentPage = currentPage.substring(0, lastSpace)

      pageLeft.current.innerText = currentPage;

      textOffset -= chunkSize;

      setBookProgress(prevDict => {
        return {
          ...prevDict,
          [page + 1]: textOffset 
        };
      });

      //page Right

      //textOffset = bookProgress[page + 1]; // current position in tex

      pageRight.current.innerHTML = '';
      currentPage = "";
      whilestopper = 0

      while(pageRight.current.clientHeight < pageHeight && whilestopper < 200) {
        
        // Get next chunk
        let endIndex = Math.min(textOffset + chunkSize, words.length);
        let textChunk = words.slice(textOffset, endIndex).join(' ') + " ";
        //let textChunk = text.substring(textOffset, textOffset + chunkSize);
        textOffset = textOffset + chunkSize;

        console.log('textCHunk', textChunk)
  
        // Append to wrapper
        currentPage += textChunk; 

        if (pageRight.current) {
        pageRight.current.innerText = currentPage;
        }
        setBookProgress(prevDict => {
          return {
            ...prevDict,
            [page + 2]: textOffset 
          };
        });

        whilestopper += 1

      } 

      lastSpace = currentPage.lastIndexOf(" ")
      currentPage = currentPage.substring(0, lastSpace)
      lastSpace = currentPage.lastIndexOf(" ")
      currentPage = currentPage.substring(0, lastSpace)

      pageRight.current.innerText = currentPage;

      textOffset -= chunkSize;

      setBookProgress(prevDict => {
        return {
          ...prevDict,
          [page + 2]: textOffset 
        };
      });

        
        // If overflow
      
          
          /*
          // Reduce chunk size until it fits
          while(wrapper.current.clientHeight > pageHeight) {
            textChunk = text.substring(textOffset, textOffset + chunkSize - 10);
            currentPage = currentPage.slice(0, -chunkSize); 
            currentPage += textChunk;
            chunkSize -= 10;
          } */
  
          // Add page
 /*          setPages(prev => [...prev, currentPage]);
          currentPage = "";
          textOffset += chunkSize;
        } */
/*         else {
          textOffset += chunkSize;
        } */
  
      
  
      // Remaining text
      //setPages(prev => [...prev, currentPage]);

      
    pageLeft.current.style.transform = 'skew(0deg, 10deg)'
    pageRight.current.style.transform = 'skew(0deg, -9deg)'


    }; 

    return pages
  
  }

  //console.log('Book progress', bookProgress)
  //console.log(page)


  return (

    <div className="book" id='bookcheck' style={{position:'relative'}}>
      {/*ChapterText*/}
      <div style={{position:'absolute', zIndex: 0, height:'100%', left: '2%'}}>
        <img className="book-img" src={book_img}  draggable="false" dragstart="false" 
              style={{userSelect: 'none', userDrag: 'none', 
                      height: '100%', position: 'absolute'}} >
        </img>

        <img className="book-img" src={book_img_2}  draggable="false" dragstart="false" 
              style={{userSelect: 'none', userDrag: 'none', 
                      height: '100%', position: 'absolute',
                      opacity: opacity}} >
        </img>

        <img className="book-img" src={bookHand_img}  draggable="false" dragstart="false" 
              style={{userSelect: 'none', userDrag: 'none', 
                      height: '100%', position: 'absolute'}} >
        </img>

      </div>

      <div style={{position:'absolute', zIndex: 1}}>

        <div className="page" ref ={pageLeft} style={{position:'absolute', 
        /*  height: '5vh', */ width: '16vw', left: '22.5vw', top:'15.5vh',
         /* transform: 'skew(0deg, 10deg)', */
         fontSize: '2vh'
            }}>
        </div>

        <div className="page" ref = {pageRight} style={{position:'absolute',
        /*  height: '5vh', */ width: '18vw', left: '40.5vw', top:'16vh',
        /*  transform: 'skew(0deg, -10deg)', */
         fontSize: '2vh'

            }}>
        </div>

        {/* the page numbers */}

        <div className="page" style={{position:'absolute',
         left: '20.25vw', top:'53.75vh',
         transform: 'skew(0deg, 8deg)',
         fontSize: '2vh'
            }}>

          {(page * 2) - 1}

        </div>

        <div className="page" style={{position:'absolute',
         left: '59.25vw', top:'52.75vh',
         transform: 'skew(0deg, -5deg)',
         fontSize: '2vh'
            }}>

          {(page * 2)}

        </div>

      </div>

      <div className = 'page-turn-left' 
        style = {{width: '40vw', height: '100%', zIndex: 5, position: 'absolute'}}

        onClick={() =>  {

          var currentpage = page - PAGE_SIZE 
          if (currentpage < 1)
            {currentpage = 1}

          setPage(currentpage)
        }}> 

      </div>

      <div className = 'page-turn-right' 
        style = {{right: '0px', width: '40vw', height: '100%', zIndex: 5, position: 'absolute'}}

        onClick={() =>  {

          var currentpage = page + PAGE_SIZE 
          if (currentpage > 110)
            {currentpage = 110}
            
          setPage(currentpage)
        }}> 

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

  