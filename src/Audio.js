import React, { useState, useRef, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import "./Audio.css";

import Sounds from './Salt_Pics/DLSounds.wav';
import KiwiSounds from './Salt_Pics/DLSoundsKiwi.wav';

import Radio from './Salt_Pics/Radio.png';

import knobVol1 from './Salt_Pics/Knob_Vol_1.png'
import knobPlayback from './Salt_Pics/Knob_Playback.png'

import Wire from './Wire_Component';


const Audio = () => {

  const [playbackRate, setPlaybackRate] = useState(1.0);

  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(0.7);

  const [plugged, setPlugged] = useState(false);
  
  const wireStaysPluggedCusOfHoverRef = useRef(false);

  const audioElement = useRef(null);

  useEffect(() => {

  var knobVolThumb = null;

  if (!knobVolThumb) {

  const knobVolThumb = document.querySelector('.knob-vol .MuiSlider-thumb');
  const knobPlaybackSpeedThumb = document.querySelector('.knob-playback-speed .MuiSlider-thumb'); 
  const knobPlaybackTimerThumb = document.querySelector('.knob-playback-timer .MuiSlider-thumb');  

  // Create the image element
  const imgVol = document.createElement('img');
  imgVol.src = knobVol1;
  imgVol.id = 'knob-vol-img'
  imgVol.style.height = '8vh'

  const imgPlaybackSpeed = document.createElement('img');
  imgPlaybackSpeed.src = knobPlayback;
  imgPlaybackSpeed.id = 'knob-playback-speed-img'
  imgPlaybackSpeed.style.height = '5vh'

  const imgPlaybackTimer = document.createElement('img');
  imgPlaybackTimer.src = knobPlayback;
  imgPlaybackTimer.id = 'knob-playback-timer-img'
  imgPlaybackTimer.style.height = '5vh'

  // Append the image to the element  
  knobVolThumb.appendChild(imgVol);
  knobPlaybackSpeedThumb.appendChild(imgPlaybackSpeed);
  knobPlaybackTimerThumb.appendChild(imgPlaybackTimer);

}

    // Event listener for the timeupdate event
    const handleTimeUpdate = () => {
      if (audioElement.current) {
        //setCurrentTime(audioElement.current.currentTime);
        //setDuration(audioElement.current.duration);
        setPlaybackProgress((audioElement.current.currentTime / audioElement.current.duration) * 100);
      }
    };

    // Add the event listener when the component mounts
    if (audioElement.current) {
      audioElement.current.addEventListener('timeupdate', handleTimeUpdate);
    }

    // Remove the event listener when the component unmounts
    return () => {

      console.log('DID CLEANUP OCCUR?')
      if (audioElement.current) {
        audioElement.current.removeEventListener('timeupdate', handleTimeUpdate);
      }

      var knob_vol_img = document.getElementById('knob-vol-img')
      var knob_playback_speed_img = document.getElementById('knob-playback-speed-img')
      var knob_playback_timer_img = document.getElementById('knob-playback-timer-img')

      if (knob_vol_img) {
        knob_vol_img.remove()
        knob_playback_speed_img.remove()
        knob_playback_timer_img.remove()
      }
      // clean up that img.

    };
  }, []);

  


  // Function to handle the change in playback speed
  const handleSpeedChange = (event, newValue) => {
    setPlaybackRate(newValue);
    if (audioElement.current) {
      audioElement.current.playbackRate = newValue;
    }
  };

  // Function to handle the change in playback speed
  const handlePlaybackTimerChange = (event, newValue) => {
    setPlaybackProgress(newValue)
    if (audioElement.current) {
      audioElement.current.currentTime = (newValue * audioElement.current.duration) / 100;
    }
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    if (audioElement.current) {
      audioElement.current.volume = newValue;
    }
  };


  useEffect(() => {
    // When 'plugged' changes, update the audio source
    switch (plugged) {
      case 1:
        audioElement.current.src = Sounds;
        break;
      case 2:
        audioElement.current.src = KiwiSounds;
        break;
      default:
        // Set to an empty string or any other default value to stop playback
        audioElement.current.src = '';
        break;
    }

    audioElement.current.play();
    
  }, [plugged]);





  return (
    <div className="audio" id='audiocheck' >


      <div style = {{position: 'absolute', height: '100%', width: '100%', zIndex: 15, pointerEvents: 'none'}}>

        <svg  
            className="svg-container-audio" id="svg-container-audio" style={{pointerEvents: 'none'}}
            width="100%" height = "100%" > 
        </svg>  {/* Wire lives in this svg-container */}
        
        <Wire wireStaysPluggedCusOfHoverRef = {wireStaysPluggedCusOfHoverRef} setPlugged = {setPlugged}> </Wire>

      </div>


      <div className="image-container" style={{position: 'absolute'}}>

        

        

        <img className="radio-main" src={Radio}  draggable="false" dragstart="false" style={{zIndex: 0, userSelect: 'none', userDrag: 'none'}} >
        </img>

        <div style={{zIndex: 10}}>
          <Slider className = 'knob-vol'

            value={volume}
            min={0}
            max={1}
            step={0.001}
            onChange={handleVolumeChange}

            orientation="vertical"

            track={false} // hide the track
            rail={false} // hide the rail
            marks={false} // hide tick marks
            valueLabelDisplay="off" // hide value label  

            onMouseEnter={() => wireStaysPluggedCusOfHoverRef.current = true}
            onMouseLeave={() => wireStaysPluggedCusOfHoverRef.current = false}


            sx={{
              width: 300,
              color: 'transparent', // hide colored track  
              
              '& .MuiSlider-thumb': {
                borderRadius: '5px',
                backgroundImage: knobVol1
              },
            }}

          />

          <Slider className = 'knob-playback-timer'

            value = {playbackProgress}
            
            track={false} // hide the track
            rail={false} // hide the rail
            marks={false} // hide tick marks
            valueLabelDisplay="off" // hide value label  
            onChange={handlePlaybackTimerChange}
            
            onMouseEnter={() => wireStaysPluggedCusOfHoverRef.current = true}
            onMouseLeave={() => wireStaysPluggedCusOfHoverRef.current = false}

            sx={{
              width: 300,
              color: 'transparent', // hide colored track  
              
              '& .MuiSlider-thumb': {
                borderRadius: '5px',
                backgroundImage: knobVol1
              },
            }}
            
          />

          <Slider className = 'knob-playback-speed'

            value={playbackRate}
            min={0.2}
            max={2}
            step={0.1}
            onChange={handleSpeedChange}
                
            track={false} // hide the track
            rail={false} // hide the rail
            marks={false} // hide tick marks
            valueLabelDisplay="off" // hide value label  

            onMouseEnter={() => wireStaysPluggedCusOfHoverRef.current = true}
            onMouseLeave={() => wireStaysPluggedCusOfHoverRef.current = false}


            sx={{
              width: 300,
              color: 'transparent', // hide colored track  
              
              '& .MuiSlider-thumb': {
                borderRadius: '5px',
                backgroundImage: knobPlayback
              },
            }}
            
          />
        </div>

      </div>


      <div style={{transform: 'translateX(450px) translateY(50px)'}}>
        <audio ref={audioElement} controls>
          <source src={Sounds} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      </div>




    </div>
  );
};

export default Audio;
