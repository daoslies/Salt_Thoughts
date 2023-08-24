import React, { useState, useEffect, useRef, createContext } from 'react'; 

import Matter from 'matter-js';
import * as d3 from 'd3';

import "./Menu.css";

import audio_port_img from './Salt_Pics/audio_port.png';

import blue_light_img from './Salt_Pics/BlueLight.png';

import jack_1_img from './Salt_Pics/jack_1.png';
import jack_2_img from './Salt_Pics/jack_2.png';
import jack_3_img from './Salt_Pics/jack_3.png';
import jack_4_img from './Salt_Pics/jack_4.png';
import jack_5_img from './Salt_Pics/jack_5.png';

var jackImageArray = new Array();
jackImageArray[0] = jack_1_img;
jackImageArray[1] = jack_2_img;
jackImageArray[2] = jack_3_img;
jackImageArray[3] = jack_4_img;
jackImageArray[4] = jack_5_img;





// First thing 2 deal with my lad: y won't the position be absolute?? everythign else is hidden :/






function Wire() {

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

  
  //const bookRouteRef = useRef(null);
  //const audioRouteRef = useRef(null);
  //const simRouteRef = useRef(null);

  useEffect(() => {
    
    //setBookRef_(bookRouteRef);
    //setAudioRef_(audioRouteRef);
    //setSimRef_(simRouteRef);

    //var navbarExpanded = props.navbarExpanded;

  }, []);


  const bookElement = bookRef_;
  const audioElement = audioRef_;
  const simElement = simRef_;

  try {
    
    bookElement.addEventListener('mouseenter', (event) => {
      //setportButtonHover(true)
      portButtonHoverRef.current = true;

    });
  
    audioElement.addEventListener('mouseenter', (event) => {
      //setportButtonHover(true)
      portButtonHoverRef.current = true;
    });
  
    simElement.addEventListener('mouseenter', (event) => {
      //setportButtonHover(true)
      portButtonHoverRef.current = true;

    });

    bookElement.addEventListener('mouseleave', (event) => {
      //setportButtonHover(true)
      portButtonHoverRef.current = false;
    });
  
    audioElement.addEventListener('mouseleave', (event) => {
      //setportButtonHover(true)
      portButtonHoverRef.current = false;
    });
  
    simElement.addEventListener('mouseleave', (event) => {
      //setportButtonHover(true)
      portButtonHoverRef.current = false;
    });

  } catch (error) {
    
  }

  


  if (plugButtonTime) {

    if (pluggedPortRef.current.port == 1) {

      bookElement.classList.remove('hidden');
      bookElement.style.pointerEvents = 'auto';

    }

    if (pluggedPortRef.current.port == 2) {

      audioElement.classList.remove('hidden');
      audioElement.style.pointerEvents = 'auto';
      
    }

    if (pluggedPortRef.current.port == 3) {

      simElement.classList.remove('hidden');
      simElement.style.pointerEvents = 'auto';
      
    }

  }

  if ((!plugButtonTime && navbarExpanded)) {   //// Question marks on && navbarExpanded

      try {
        
        bookElement.classList.add('hidden')
        bookElement.style.pointerEvents = 'none';

        audioElement.classList.add('hidden')
        audioElement.style.pointerEvents = 'none';

        simElement.classList.add('hidden')
        simElement.style.pointerEvents = 'none';

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
  
  const wire_start_pos_x = 560 + 88;
  const wire_start_pos_y = 325 - 85 - 60;
  
  const [wireBodies, setWireBodies] = useState([]);

  // 1. Create physics engine
  const blueLightRef = useRef(null);

  let plug_rect = null;
  let plugCon = null;
  let blue_light_counter = 0;
  let blue_light_button_check = false;

    // Animation frame
  function onAnimationFrame_MatterEvents() {

    const points = wireBodies.map(b => b.position);

    const svg = d3.select('#svg-container');

    svg.selectAll('line') 
      .data(points)
      .enter()
      .append('line')
      .attr('class', 'wire')
      .style('stroke', 'black')      // Add stroke color
      .style('stroke-width', (d,i) => 7 + Math.sin(((Date.now() / 250) + ((points.length - i)/(points.length/10)) * Math.PI * 100) +  Math.sin((Date.now() / 200) + ((points.length - i)/(points.length))) * 2) )     // Set stroke width
      .style('opacity', 1)
      .attr('x1', (d, i) => i === 0 ? wire_start_pos_x : points[i - 1].x)
      .attr('y1', (d, i) => i === 0 ? wire_start_pos_y : points[i - 1].y)
      .attr('x2', (d,i) => points[i].x) 
      .attr('y2', (d,i) => points[i].y+1);   

     
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

      blue_light_counter += 1;

     

      if (blue_light_counter >= 100) {
        
        svg.append('image')
        .attr('href', blue_light_img)  //[jackImageIndex])
        .attr('x', pluggedPortRef.current.portX+75) 
        .attr('y', pluggedPortRef.current.portY-22)
        .attr('width', 51)
        .attr('height', 42) 
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

  useEffect(() => { 

  Matter.Events.on(engine, 'afterUpdate', () => {

      // Trigger visual update (It's the bit above)
  requestAnimationFrame(onAnimationFrame_MatterEvents); 

  });

  /// Potentially you should add a cleanup function here 24/08/2023

  
}, []);

// 2. Create world and world options
const world = engine.world;
world.gravity.y = 0;

/*var render = Matter.Render.create({
    element: document.body,
    engine: engine
  });     
*/
  
  // 4. Create chain of circle bodies for wire 
  
  if (wireBodies.length <= 4) {

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
    
    
    
    //var mouse_area = document.getElementById('svg-container')

    // add mouse control
    //var mouse = Matter.Mouse.create(mouse_area);



    // Add mouse contraint
    let mouse_rect = null;
    let mouseCon = null;

    const mousedownevent = (event) => {
      
      if (!pluggedPortRef.current || !portButtonHoverRef.current) {

      if (!mouse_rect) {
      mouse_rect = Matter.Bodies.rectangle(event.clientX, event.clientY, 10, 10, { isStatic: true }); //event.clientX, event.clientY,
      
      Matter.World.add(world, mouse_rect); 
      
      if (wireBodies.length > 0) {
        mouseCon = Matter.Constraint.create({ 
          bodyA: mouse_rect, 
          bodyB: wireBodies[wireBodies.length - 1],  
          stiffness: 0.05,
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

      
    
    useEffect(() => {

      document.addEventListener('mousedown', mousedownevent);
      document.addEventListener('mouseup', mouseupevent);

      return () => 

      document.removeEventListener('mousedown', mousedownevent);
      //document.removeEventListener('mouseup', mouseupevent);

    }, []);

    

        
    document.addEventListener('mousemove', (event) => {

      if (mouse_rect) {
      mouse_rect.position.x = event.clientX;
      mouse_rect.position.y = event.clientY;
      }
      
    });
    
        
        

        const renderJack = (lastPoint, portX, portY, dist) => {

        
          // Calculate orientation angle
          let angle = Math.atan2(portY - lastPoint.y, portX - lastPoint.x) * (180 / Math.PI);



          let posx = lastPoint.x -100;
          let posy = lastPoint.y -150;

          let rot_origx = lastPoint.x;
          let rot_origy = lastPoint.y;
          
          if (isPluggedRef.current) {
            posx = portX-100;
            posy = portY-150;
            angle = 0;

          }


          const svg = d3.select('#svg-container');

          svg.append('image')
          .attr('href', jackImageArray[imgRef.current])  //[jackImageIndex])
          .attr('x', posx) 
          .attr('y', posy)
          .attr('transform', `rotate(${angle + 90} ${rot_origx} ${rot_origy})`)
          .attr('width', 200)
          .attr('height', 200) 
          .attr('class', 'jack-image')

        }

  
          function calculateDistanceToPort(lastPoint) {
  

  
            var ports = {
              port_1: {port: 1, portX: 305, portY: 265 }, 
              port_2: {port: 2, portX: 825, portY: 260 },
              port_3: {port: 3, portX: 555, portY: 565 }
            };
          
            
               
          let closestDistance = Infinity;
          let closestPort = null;
          let dist = null;
          
          function portDistanceCheck(dist, port, closestDistance) {

            // Check if closest
            if(dist < closestDistance) {
              closestDistance = dist;
              closestPort = port; 
              pluggedPortRef.current = closestPort;

            
              var distance_threshold = 15

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
                //alert('ref'+pluggedPortRef.current.port)
                //alert('ref'+port.port)

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
          } else if (dist >= 60) {
            imgRef.current = 2;
          } else if (dist >= 15) {
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
        
    

  }, []);


  useEffect(() => {

  }, []);

    

    return ( 
        <div>

          <img className="book-button" src={audio_port_img} 
                style={{
                }}  />

          <img className="audio-button" src={audio_port_img} 
                style={{
                }}  /> 

          <img className="flower-button" src={audio_port_img} 
                style={{
                }}  />

        </div>
     )

    
}

export default Wire;




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
