import { useState, useEffect } from 'react';

import "./ScrollingPortLabels.css";

const Scrolling_Port_labels = () => {

  // Scrolling text labelling the ports
  const [bookStyles, setBookStyles] = useState({});
  const [audioStyles, setAudioStyles] = useState({});
  const [flowerStyles, setFlowerStyles] = useState({});


  useEffect(() => {
    // Function to update window size on resize

    const bookPort = document.querySelector(".book-port");
    const audioPort = document.querySelector(".audio-port");
    const flowerPort = document.querySelector(".flower-port");

    if (bookPort && audioPort && flowerPort) {
      setBookStyles(window.getComputedStyle(bookPort));
      setAudioStyles(window.getComputedStyle(audioPort));
      setFlowerStyles(window.getComputedStyle(flowerPort));
    }


    const handleResize = () => {
      if (bookPort && audioPort && flowerPort) {
        setBookStyles(window.getComputedStyle(bookPort));
        setAudioStyles(window.getComputedStyle(audioPort));
        setFlowerStyles(window.getComputedStyle(flowerPort));
      }
    };
    // Add event listener on component mount
    window.addEventListener("resize", handleResize);
    handleResize()
    // Cleanup function to remove listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array ensures effect runs only once on mount

    const BookScrollingText = () => (
      <div className="scroll-container book-scroll" style={{
        position: 'absolute', top : 'calc(' + bookStyles.top + ' - (3.85vw)', 
        left: bookStyles.left, width: bookStyles.width,
        fontSize: '1.5vw', zIndex: 10
      }}>
        <p className="scrolling-text" data-text="Embedding2Txt_4.nnet">Embedding2Txt_4.nnet</p>
      </div>
    );
  
  const AudioScrollingText = () => (
    <div className="scroll-container audio-scroll" style={{
      position: 'absolute', top : 'calc(' + audioStyles.top + ' - (3.85vw)', 
      left: audioStyles.left, width: audioStyles.width,
      fontSize: '1.5vw', zIndex: 10
    }}>
      <p className="scrolling-text" data-text="Embedding2Audio.nnet" >Embedding2Audio.nnet</p>
    </div>
  );
  
  const FlowerScrollingText = () => (
    <div className="scroll-container flower-scroll" style={{
      position: 'absolute', top : 'calc(' + flowerStyles.top + ' - (3.85vw)', 
      left: flowerStyles.left, width: flowerStyles.width,
      fontSize: '1.5vw', zIndex: 10
    }}>
      <p className="scrolling-text" data-text="Embedding2Simulation.nnet" >Embedding2Simulation.nnet</p>
    </div>
  );


  return (

    <div>
      <BookScrollingText />
      <AudioScrollingText />
      <FlowerScrollingText />
    </div>

  )

}

export default Scrolling_Port_labels