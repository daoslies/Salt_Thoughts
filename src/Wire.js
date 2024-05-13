import React, { useState, useEffect, useRef, useCallback } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, useNavigate  }  from "react-router-dom";
import { Link, redirect, useNavigation } from "react-router-dom";



import Matter from 'matter-js';
import * as d3 from 'd3';

import {isMobile} from 'react-device-detect';


//import { engine } from './Engine'; 


import "./Menu.css";

import Book from "./Book"
import Audio from "./Audio"
import Salt_Sim_3 from "./Salty_Sim_3"

import audio_port_img from './Salt_Pics/audio_port.png';

import blue_light_img from './Salt_Pics/BlueLight.png';

import jack_1_img from './Salt_Pics/jack_1.png';
import jack_2_img from './Salt_Pics/jack_2.png';
import jack_3_img from './Salt_Pics/jack_3.png';
import jack_4_img from './Salt_Pics/jack_4.png';
import jack_5_img from './Salt_Pics/jack_5.png';

import push_me_img_1 from './Salt_Pics/PushMe1.png';
import push_me_img_2 from './Salt_Pics/PushMe2.png';
import push_me_img_3 from './Salt_Pics/PushMe3.png';
import push_me_img_4 from './Salt_Pics/PushMe4.png';


var jackImageArray = new Array();
jackImageArray[0] = jack_1_img;
jackImageArray[1] = jack_2_img;
jackImageArray[2] = jack_3_img;
jackImageArray[3] = jack_4_img;
jackImageArray[4] = jack_5_img;

const push_me_images = [
  push_me_img_1,
  push_me_img_2,
  push_me_img_3,
  push_me_img_4
];




// First thing 2 deal with my lad: y won't the position be absolute?? everythign else is hidden :/






function Wire({ setRenderEmbeddingRep }) {

  


  const [routeTime, setRouteTime] = useState(false);

  const navbarExpanded = true; // props.navbarExpanded;
  const [bookRef_, setBookRef_] = useState([]);
  const [audioRef_, setAudioRef_] = useState([]);
  const [simRef_, setSimRef_] = useState([]);
  
  const [plugButtonTime, setPlugButtonTime] = useState(false);

//Can maybe remove the plugbuttontime state as we are using the pluggedportref ref

  const imgRef = useRef(0);
  const isPluggedRef = useRef(false);
  const pluggedPortRef = useRef(null);

  const portButtonHoverRef = useRef(false);

  
  const bookRouteRef = useRef(null);
  const audioRouteRef = useRef(null);
  const simRouteRef = useRef(null);



  useEffect(() => {
    
    setBookRef_(bookRouteRef);
    setAudioRef_(audioRouteRef);
    setSimRef_(simRouteRef);

    //var navbarExpanded = props.navbarExpanded;

  }, []);


  const bookElement = bookRef_;
  const audioElement = audioRef_;
  const simElement = simRef_;

  const [pushMeimageIndex, setPushMeImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * push_me_images.length);
      setPushMeImageIndex(randomIndex);
    }, 165);

    return () => clearInterval(interval);
  }, [pushMeimageIndex]);

  /*
  useEffect(() => {
    setRenderEmbeddingRep(routeTime);
  }, [routeTime])

  */

  const updateRenderEmbeddingRep = useCallback(() => {
    setRenderEmbeddingRep(routeTime);
  }, [routeTime]) // memoized 
  
  useEffect(() => {
    updateRenderEmbeddingRep();
  }, [updateRenderEmbeddingRep])




  if (plugButtonTime) {

    if (pluggedPortRef.current.port == 1) {

      var bookButton = document.getElementById("book-button")

      bookButton.classList.remove('hidden');
      bookButton.style.pointerEvents = 'auto';

    }

    if (pluggedPortRef.current.port == 2) {

      var audioButton = document.getElementById("audio-button")

      audioButton.classList.remove('hidden');
      audioButton.style.pointerEvents = 'auto';

    }

    if (pluggedPortRef.current.port == 3) {

      var flowerButton = document.getElementById("flower-button")

      flowerButton.classList.remove('hidden');
      flowerButton.style.pointerEvents = 'auto';
      
    }

  }

  if ((!plugButtonTime && navbarExpanded)) {   //// Question marks on && navbarExpanded

      try {

        var bookButton = document.getElementById("book-button")
        var audioButton = document.getElementById("audio-button")
        var flowerButton = document.getElementById("flower-button")
        
        bookButton.classList.add('hidden')
        bookButton.style.pointerEvents = 'none';

        audioButton.classList.add('hidden')
        audioButton.style.pointerEvents = 'none';

        flowerButton.classList.add('hidden')
        flowerButton.style.pointerEvents = 'none';

      } catch (error) {
        
      }
    

  }



/// OK it's here. We're looking here.

//// You had to do some silly things with refs.
// On app.js you can put a ref on an element (like an id) 
// you then pass that ref into wire as a prop.
// wire can then access that element and thus can change what it is with jsx
// and in so doing you can make a button turn up a couple mos after the blue light.
// (and that button will still work with routes, being the reason for all this faff)


// Oh and you did buttons with foreign objects, if thas what you after.

/////////////////////////////////////////////////////////////////////////////////////////////////


/*
  const enginex = React.useRef(null);
  enginex.current = Matter.Engine.create();

  var engine = enginex.current; 
*/

  var engine = Matter.Engine.create();

  // 2. Create world and world options
  const world = engine.world;
  world.gravity.y = 0;

  //console.log('World in main Wire', world)


  /*var render = Matter.Render.create({
      element: document.body,
      engine: engine
    });     
  */


  const deskAspectRatio = (737/1920) * 0.52

  const vw = 50; // 50vw
  var width = window.innerWidth;
  var vwInPixels = (vw / 100) * width;
  var scaledWidth = width/1707

  var vhInPixels =  vwInPixels * deskAspectRatio  //(window.innerHeight * 0.5) - 50 ;
  
  var wire_start_pos_x = vwInPixels;
  var wire_start_pos_y = vhInPixels; //325 - 85 - 60;
  
  
  const [wireBodies, setWireBodies] = useState([]);

  // 1. Create physics engine
  const blueLightRef = useRef(null);

  let plug_rect = null;
  let plugCon = null;
  let blue_light_counter = 0;
  let blue_light_button_check = false;




    // Animation frame
  function onAnimationFrame_MatterEvents() {

    if (!routeTime)  {


      
    width = window.innerWidth;
    scaledWidth = width/1707;
    vwInPixels = (vw / 100) * width;
    vhInPixels = vwInPixels * deskAspectRatio //(window.innerHeight * 0.5);
    
    wire_start_pos_x = vwInPixels;
    wire_start_pos_y = vhInPixels + 4; //325 - 85 - 60;

    const points = wireBodies.map(b => b.position);

    points[0].x = wire_start_pos_x;
    points[0].y = wire_start_pos_y-(90 * scaledWidth * 0.85);

    const svg = d3.select('#svg-container');
    const svgLowZ = d3.select('#svg-container-low-z');
    svg.selectAll("*").remove();
    svgLowZ.selectAll("*").remove();
 

    svg.selectAll(null) 
      .data(points)
      .enter()
      .append('line')
      .attr('class', 'wire')
      .style('stroke', 'black')      // Add stroke color
      .style('stroke-width', (d,i) => 7 + Math.sin(((Date.now() / 250) + ((points.length - i)/(points.length/10)) * Math.PI * 100) +  Math.sin((Date.now() / 200) + ((points.length - i)/(points.length))) * 2) )     // Set stroke width
      .style('opacity', 1)
      .style('zIndex', 50)
      .attr('x1', (d, i) => i === 0 ? wire_start_pos_x : points[i - 1].x)
      .attr('y1', (d, i) => i === 0 ? points[0].y : points[i - 1].y)
      .attr('x2', (d,i) => points[i].x) 
      .attr('y2', (d,i) => points[i].y);   

     
    svg.selectAll('.jack-image').remove(); 
   

    checkDistance(points[points.length - 1])

    //Lock in that plug if we're plugged in.

    if (isPluggedRef.current) {

    

      if (!plug_rect) {

          plug_rect = Matter.Bodies.rectangle(pluggedPortRef.current.portX, pluggedPortRef.current.portY, 10, 10, { isStatic: true }); //event.clientX, event.clientY,
          
          Matter.World.add(world, plug_rect); 

          
          if (wireBodies.length > 0) {
            plugCon = Matter.Constraint.create({ 
              bodyA: plug_rect, 
              bodyB: wireBodies[wireBodies.length - 1],  
              stiffness: 0.5,
              length: 0, 
              aaplugidentify: 'PlugCOn'
            }); 
    
            Matter.World.add(world, plugCon); 
          }
    
          }


      //Blue Light

      blue_light_counter += 2;

     

      if (blue_light_counter >= 100) {

        
        svgLowZ.append('image')
        .attr('href', blue_light_img)  //[jackImageIndex])
        .attr('x', pluggedPortRef.current.portX+(66 * scaledWidth))
        .attr('y', pluggedPortRef.current.portY-(28 * scaledWidth))
        .attr('width', 51 * scaledWidth)
        .attr('height', 42 * scaledWidth) 
        .attr('class', 'jack-image')

        blueLightRef.current = pluggedPortRef.current;

      }

      if (blue_light_counter >= 150) {
        
        setPlugButtonTime(true);
            
        blue_light_button_check = true;


        if (!blue_light_button_check) {
        
        }
      }
    }
    
    
    if (!isPluggedRef.current) {

      blue_light_counter = 0;

      blueLightRef.current = null;

      setPlugButtonTime(false);

      if (plug_rect) {

        if (wireBodies.length > 0) {
        Matter.World.remove(world, plugCon);
        plugCon = null;
        }

        Matter.World.remove(world, plug_rect);  
        plug_rect = null;
        console.log('World: ', world)

        }
      }
    }
  }

  
  useEffect(() => { 

  
  const onAfterUpdate = () => {
        // Trigger visual update (It's the bit above)
        //console.log('RouteTimeEffect2?', routeTime)
        requestAnimationFrame(onAnimationFrame_MatterEvents); 
                          
  };


  Matter.Events.on(engine, 'afterUpdate', onAfterUpdate);
  
  return () => {
   
    Matter.Events.off(engine, 'afterUpdate', onAfterUpdate);
    //cancelAnimationFrame(what do we put here?)

  }

  
}, []);


/*
useEffect(() => {
  let animationFrameId;

  const onAnimationFrame = () => {
    // Visual update
    onAnimationFrame_MatterEvents()

    animationFrameId = requestAnimationFrame(onAnimationFrame); 
  }

  const onAfterUpdate = () => {
    onAnimationFrame();
  }

  Matter.Events.on(engine, 'beforeUpdate', onAfterUpdate);
  
  return () => {
    Matter.Events.off(engine, 'beforeUpdate', onAfterUpdate);
    
    cancelAnimationFrame(animationFrameId);
  }
}, []);

*/


  
  // 4. Create chain of circle bodies for wire 
  
  if (wireBodies.length <= 0) {

  let wireBody = Matter.Bodies.circle(wire_start_pos_x, wire_start_pos_y, 5, {
    restitution: 0.5, 
    friction: 0.5, 
    isStatic: true
  });


  Matter.World.add(world, wireBody);
  setWireBodies(wireBodies => [...wireBodies, wireBody]);
  
  for (let i = 0; i < 25; i++) {
    let wireBody = Matter.Bodies.circle(i * 15 + 30, 30, 5, {
      restitution: 0.5, 
      friction: 0.01 
      
    });
  
  Matter.World.add(world, wireBody);
  setWireBodies(wireBodies => [...wireBodies, wireBody]);
    
  }}
  
   
  
  // Connect bodies with constraints
  for (let i = 0; i < wireBodies.length - 1; i++) {
  
    let constraint = Matter.Constraint.create({ 
        bodyA: wireBodies[i],  
        bodyB: wireBodies[i + 1],
        stiffness: 0.5,
        length: 5
      })
      Matter.World.add(world, constraint);
    
    }
    
    
// Mouse Events



    // Add mouse contraint
    let mouse_rect = null;
    let mouseCon = null;

    const mousedownevent = (event) => {

      if (isMobile) {
        var X_down = event.changedTouches[0].pageX
        var Y_down = event.changedTouches[0].pageY
      }
      else {
        var X_down = event.clientX
        var Y_down = event.clientY
      }
      
      if (!pluggedPortRef.current || !portButtonHoverRef.current) {

      if (!mouse_rect) {
      mouse_rect = Matter.Bodies.rectangle(X_down, Y_down, 10, 10, { isStatic: true }); //event.clientX, event.clientY,
      
      Matter.World.add(world, mouse_rect); 
      
      if (wireBodies.length > 0) {
        mouseCon = Matter.Constraint.create({ 
          bodyA: mouse_rect, 
          bodyB: wireBodies[wireBodies.length - 1],  
          stiffness: 0.25,
          length: 0 
        }); 

        Matter.World.add(world, mouseCon); }
      
      }}}

      const mouseupevent = (event) => {
        Matter.World.remove(world, mouse_rect);
        mouse_rect = null;
        
        if (wireBodies.length > 0) {
        Matter.World.remove(world, mouseCon);
        mouseCon = null;
        }
      }



    let isMouseMoving = false;
    
    const handleMouseMove = (event) => {
      
      if (isMobile) {
        var X_move = event.changedTouches[0].pageX
        var Y_move = event.changedTouches[0].pageY
      }
      else {
        var X_move = event.clientX
        var Y_move = event.clientY
      }

      if (!isMouseMoving) {
        isMouseMoving = true;
        requestAnimationFrame(() => {
          // Update the object's position here
          if (mouse_rect) {
            mouse_rect.position.x = X_move;
            mouse_rect.position.y = Y_move;
          }
          
        });
        isMouseMoving = false; // this used to be inside the if (mouse_rect)
      }
    };

    useEffect(() => {

      if (isMobile) {
        document.addEventListener('touchstart', mousedownevent);
        document.addEventListener('touchend', mouseupevent);
        document.addEventListener('touchmove', handleMouseMove);
      }

      else {
        document.addEventListener('mousedown', mousedownevent);
        document.addEventListener('mouseup', mouseupevent);
        document.addEventListener('mousemove', handleMouseMove);
      }
    
      return () => {
        // Cleanup: Remove the event listener when the component unmounts

        if (isMobile) {
          document.removeEventListener('touchstart', mousedownevent);
          document.removeEventListener('touchend', mouseupevent);
          document.removeEventListener('touchmove', handleMouseMove);
        }
        
        else {
          document.removeEventListener('mousedown', mousedownevent);
          document.removeEventListener('mouseup', mouseupevent);
          document.removeEventListener('mousemove', handleMouseMove);
        }

      };
    }, []); 
    
        
        

        const renderJack = (lastPoint, portX, portY, dist) => {

        
          width = window.innerWidth;
          var scaledWidth = width/1707;

          // Calculate orientation angle
          let angle = Math.atan2(portY - lastPoint.y, portX - lastPoint.x) * (180 / Math.PI);



          let posx = lastPoint.x - (100 * scaledWidth);
          let posy = lastPoint.y - (150 * scaledWidth);

          let rot_origx = lastPoint.x;
          let rot_origy = lastPoint.y;
          
          if (isPluggedRef.current) {
            posx = portX-(100 * scaledWidth);
            posy = portY-(150 * scaledWidth);
            if (dist < 30) {angle = 0;}
          }


          const svg = d3.select('#svg-container');

          svg.append('image')
          .attr('href', jackImageArray[imgRef.current])  //[jackImageIndex])
          .attr('x', posx) 
          .attr('y', posy)
          .attr('transform', `rotate(${angle + 90} ${rot_origx} ${rot_origy})`)
          .attr('width', 200 * scaledWidth)
          .attr('height', 200 * scaledWidth) 
          .attr('class', 'jack-image')

        }

  
          function calculateDistanceToPort(lastPoint) {


            function getPosition(el) {
              const styles = getComputedStyle(el);
              
              return {
                top: parseFloat(styles.top),
                left: parseFloat(styles.left),
                width: parseFloat(styles.width),
                height: parseFloat(styles.height)
              };
            }
            
            const bookPos = getPosition(document.querySelector('.book-port'));
            const audioPos = getPosition(document.querySelector('.audio-port'));
            const flowerPos = getPosition(document.querySelector('.flower-port'));


            var ports = {
              port_1: {port: 1, portX: bookPos.left + (65 * bookPos.width/237), portY: bookPos.top + (65 * bookPos.width/237)}, 
              port_2: {port: 2, portX: audioPos.left + (65 * bookPos.width/237), portY: audioPos.top + (65 * bookPos.width/237) },
              port_3: {port: 3, portX: flowerPos.left + (65 * bookPos.width/237), portY: flowerPos.top + (65 * bookPos.width/237) }
            };


            /*
            var ports = {
              port_1: {port: 1, portX: 305, portY: 265 }, 
              port_2: {port: 2, portX: 825, portY: 260 },
              port_3: {port: 3, portX: 555, portY: 565 }
            };
            */
            
               
          let closestDistance = Infinity;
          let closestPort = null;
          let dist = null;
          
          function portDistanceCheck(dist, port, closestDistance) {

            // Check if closest
            if(dist < closestDistance) {
              closestDistance = dist;
              closestPort = port; 
              pluggedPortRef.current = closestPort;

            
              var distance_threshold = 40 //15

              if(dist <= distance_threshold) {
                isPluggedRef.current = true; // Dispatch event if plugged in
                window.dispatchEvent(new CustomEvent('wirePluggedIn', {detail: {port: pluggedPortRef.current}}))  
              }

              if(dist >= distance_threshold + 1) {
                isPluggedRef.current = false;
              } 
              
            }

            return [closestPort, closestDistance]

            }


          // Loop through ports
          for (const portName in ports) {

            const port = ports[portName];
            
            // Calculate distance 
            const dx = lastPoint.x - port.portX;
            const dy = lastPoint.y - port.portY;
            dist = Math.sqrt(dx*dx + dy*dy);

            //console.log('Port Dist: ', dist, port.portX, port.portY, lastPoint.x, lastPoint.y)
           

              var closestArray = portDistanceCheck(dist, port, closestDistance)

              closestPort = closestArray[0]
              closestDistance = closestArray[1]


              /*   // I think this bit was maybe something to do with tweening.

              // Not 100% sure, but taking it out doesn't... apppear... to brake anything.

              if (pluggedPortRef.current.port == port.port) {


                closestPort = port; 
                closestDistance = 0;
                console.log('Port? ', port)
                isPluggedRef.current = true;
                pluggedPortRef.current = port;
                window.dispatchEvent(new CustomEvent('wirePluggedIn', {detail: {port: pluggedPortRef.current}}))  
              } */
              
            }
           


            
            
          // Return closest port info
          return [closestDistance, closestPort.portX, closestPort.portY];
        }


        function checkDistance(lastPoint) {
          const portarray = calculateDistanceToPort(lastPoint);
          let dist = portarray[0]
          let portX = portarray[1]
          let portY = portarray[2]

          if(dist >= 175) {
            imgRef.current = 0; 
          } else if (dist >= 110) {
            imgRef.current = 1;
          } else if (dist >= 70) {
            imgRef.current = 2;
          } else if (dist >= 30) {
            imgRef.current = 3;
          }else if (dist >= 0) {
            imgRef.current = 4;
          }


          renderJack(lastPoint, portX, portY, dist); // Re-render with new index
        }
      
      


  
  useEffect(() => {
  
    //Matter.Render.run(render);

  
    // create runner
    var runner = Matter.Runner.create();
    
    // run the engine
    Matter.Runner.run(runner, engine);
        
    return () => {

      Matter.Runner.stop(runner, engine);
      
    }
    

  }, []);





  
  function RouteButton(Route, left, top, pushMeimageIndex) {

    

    return (
         <img className='route-button hidden' 
         id={Route} 
         src={push_me_images[pushMeimageIndex]} 
         onMouseEnter={() => portButtonHoverRef.current = true}
         onMouseLeave={() => portButtonHoverRef.current = false}

         style={{
          zIndex: 42,
          position: 'absolute',
          left: left,
          top: top,
          
        }} />
    );
  }


  const [positions, setPositions] = useState({
    book: {left: '100', top: '100'},
    audio: {left: '100', top: '100'},
    flower: {left: '100', top: '100'}
  });

  
  // Port selectors
  const PORTS = {
    book: '.book-port',
    audio: '.audio-port', 
    flower: '.flower-port'
  };

  function getPosition(selector) {
    const el = document.querySelector(selector);
    const styles = getComputedStyle(el);

    return {
      left: parseFloat(styles.left),
      top: parseFloat(styles.top),
      width: parseFloat(styles.width),
      height: parseFloat(styles.height)
    };
  }



  // Create a ref 
  const positionsRef = useRef({
    book: {left: '100', top: '100'},
    audio: {left: '100', top: '100'},
    flower: {left: '100', top: '100'}
  }); 

  useEffect(() => {

    // Get positions
    const bookPos = getPosition(PORTS.book);
    const audioPos = getPosition(PORTS.audio);
    const flowerPos = getPosition(PORTS.flower);

    // Set positions on ref instead of state
    positionsRef.current = {
      book: bookPos,
      audio: audioPos,
      flower: flowerPos
    };

  }, [PORTS]);


  /*
  const updatePositions = () => {


      setPositions({
        book: bookPos,
        audio: audioPos,
        flower: flowerPos
      });
  }

  useEffect(() => {

  updatePositions()

  }, [PORTS]);

*/

    return ( 


<div className="port-container">

  <Router>

  <div className="colour-test" />



        <div className="flex-container">
        
          <div className="wire">  
          
            

            
      

            <img className="book-port" src={audio_port_img} 
                    style={{
                    }}  />     

            <Link to={'/Salt'}  id="book-link" 

            
          
            onClick={(e) => {
              if (!isMobile) {
                setRouteTime(true);
              }
            }}
            onTouchStart={(e) => {
              if (isMobile) {
                window.history.pushState({urlPath:'/Salt'}, "",'/Salt');
                window.location.hash+= '/'  // This is nonsense that triggers the link to actually update the url.
                setRouteTime(true);
              }
            }}

            >
      
            {RouteButton('book-button', positionsRef.current.book.left+(200 * positionsRef.current.book.width/273),
                                        positionsRef.current.book.top+(35 * positionsRef.current.book.width/273), pushMeimageIndex)}
      
            </Link>
                  
                  
      
            <img className="audio-port" src={audio_port_img} 
                  style={{
                  }}  /> 
      
            <Link to={'/Audio'} id="audio-link" 
            
            onClick={() => {
              if (!isMobile) {
                setRouteTime(true);
              }
            }}
            onTouchStart={(e) => {
              if (isMobile) {
                window.history.pushState({urlPath:'/Audio'}, "",'/Audio');
                window.location.hash+= '/'  // This is nonsense that triggers the link to actually update the url.
                setRouteTime(true);
              }
            }}
            
            >
      
            {RouteButton('audio-button', positionsRef.current.audio.left+(200 * positionsRef.current.audio.width/273), 
                                         positionsRef.current.audio.top+(35 * positionsRef.current.audio.width/273), pushMeimageIndex)}
            
            </Link>   
      
      
      
            <img className="flower-port" src={audio_port_img} 
                  style={{
                  }}  />
            
            <Link to='/Salt_Sim_3' id="sim-link" 
            
            onClick={() => {
              if (!isMobile) {
                setRouteTime(true);
              }
            }}
            onTouchStart={(e) => {
              if (isMobile) {
                window.history.pushState({urlPath:'/Salt_Sim_3'}, "",'/Salt_Sim_3');
                window.location.hash+= '/'  // This is nonsense that triggers the link to actually update the url.
                setRouteTime(true);
              }
            }}
            
            >
      
            {RouteButton('flower-button', positionsRef.current.flower.left+(200 * positionsRef.current.flower.width/273), 
                                         positionsRef.current.flower.top+(35 * positionsRef.current.flower.width/273), pushMeimageIndex)}
      
            </Link>
      
      
          </div> 
          
         
        
        </div>

      
      {routeTime &&

        <div className="nested-view" 
      
      style={{
        position: 'relative',
        top: '0.75vw', 
        left: '10vw',
        width: '80vw',
        height: '80vh', 
        zIndex: !routeTime ? 1 : 100,
        border: '3px solid black',
        overflow: 'hidden'
      }}
      
      flex="1" >
      

      <button 
      
      style={{
        position: 'absolute',
        right: '20px',
        top:'20px',
        zIndex: "101",  //zindex and pointer were to try and make the button click and it still dunt
        pointerEvents: "auto",
      }}

      flex="1"
      

      onClick={() => {
        if (!isMobile) {
          setRouteTime(false);
        }
      }}
      onTouchStart={() => {
        if (isMobile) {
          setRouteTime(false);
        }
      }}
      
      >

        X

      </button>

      <Routes flex="1"> 

      

      <Route path="Salt" element={<Book id='bookElement'/>} /> 

      <Route path="Audio" element={<Audio />} /> 


      <Route path="Salt_Sim_3" element={
      
        <div className={'nested-div'} 
          id='nested-div'
          style={{ 
            width: '100%', 
            height: '100%', 
            overflow: 'clip', 
            position: 'absolute',
            }}>

   

        <Salt_Sim_3/>
 
        </div>
        
      
      } /> 
      
      </Routes>


      </div>
    }



  </Router>

</div>
     )

    
}

export default Wire;


{/*<Route path="/Audiobook" element={<Audiobook />} /> */}

            // TIme 2 level.

            // With nay.

            // Who is super kewl.

            // And has just finished their hand in.

            // cus they a 

            // BALLER

            // Oh gosh and maybe the plugged stuff should be in the loop. It was earlier and the plugged true
            // behaviour was correct. But now that we're out of the for loop that isn't even working at all.
            // kk
            // stop now. XOXOXOXOXO



  
              ///ahh is 3 in the morning and you aren't getting anywhere.

              //The below are the key consoles to look out for.
              //The numbers change in one direction, but not the other.
              // The animation is not smooth.
              // Something fukky is going on.

              // AHGHGHHAHGhghghhg

              // good luck
              // 15/08/2023
