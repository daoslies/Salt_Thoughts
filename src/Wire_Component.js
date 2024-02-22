import React, { useState, useEffect, useRef, useCallback } from 'react'; 

import Matter from 'matter-js';
import * as d3 from 'd3';

import "./Menu.css";

import jack_1_img from './Salt_Pics/jack_1.png';
import jack_2_img from './Salt_Pics/jack_2.png';
import jack_3_img from './Salt_Pics/jack_3.png';
import jack_4_img from './Salt_Pics/jack_4_Audio.png';
import jack_5_img from './Salt_Pics/jack_5_Audio.png';

import { engine } from './Engine'; 



var jackImageArray = new Array();
jackImageArray[0] = jack_1_img;
jackImageArray[1] = jack_2_img;
jackImageArray[2] = jack_3_img;
jackImageArray[3] = jack_4_img;
jackImageArray[4] = jack_5_img;




// HMmmmmm maybe this is a dead version of wire. Potentially delete 21/02/24.




export function Wire({wireStaysPluggedCusOfHoverRef, setPlugged}) {

  const [routeTime, setRouteTime] = useState(false);

//Can maybe remove the plugbuttontime state as we are using the pluggedPortRef_Audio ref

  const imgRef = useRef(0);
  const isPluggedRef_Audio = useRef(false);
  const pluggedPortRef_Audio = useRef(null);

  
  // 2. Create world and world options
  const world = engine.world;
  world.gravity.y = 0;




  console.log('World in AUDIO wire: ', world)

  /*
  var render = Matter.Render.create({
      element: document.body,
      engine: undefined
    }); 

  render.engine = engine
  */

  const vw = 50; // 50vw
  var width = window.innerWidth;
  var vwInPixels = (vw / 100) * width;
  var scaledWidth = width/1707

  var vhInPixels = (window.innerHeight * 0.5) - 50 ;
  
  var wire_start_pos_x = vwInPixels;
  var wire_start_pos_y = vhInPixels * 5; //325 - 85 - 60;
  
  
  const [wireBodies_Audio, setwireBodies_Audio] = useState([]);


  let plug_rect = null;
  let plugCon = null;



    // Animation frame
  function onAnimationFrame_MatterEvents() {

    console.log('Engie: ', engine)
    console.log()

    var wireBodies = world.bodies;
    
    if (!routeTime)  {
      
    width = window.innerWidth;
    scaledWidth = width/1707;
    vwInPixels = (vw / 100) * width;
    vhInPixels = (window.innerHeight * 0.5);
    
    wire_start_pos_x = vwInPixels * 1.1;
    wire_start_pos_y = vhInPixels * 2; //325 - 85 - 60;

    const points = wireBodies.map(b => b.position);

    console.log('wireBodies_Audio before Lines: ', wireBodies)
    console.log('Points: ', points)


    points[0].x = wire_start_pos_x;
    points[0].y = wire_start_pos_y-(90 * scaledWidth * 0.85);

    const svg = d3.select('#svg-container-audio');

    svg.selectAll('*').remove(); 

    svg.selectAll('line') 
      .data(points)
      .enter()
      .append('line')
      .attr('class', 'wire')
      .style('stroke', 'black')      // Add stroke color
      .style('stroke-width', (d,i) => 7 + Math.sin(((Date.now() / 250) + ((points.length - i)/(points.length/10)) * Math.PI * 100) +  Math.sin((Date.now() / 200) + ((points.length - i)/(points.length))) * 2) )     // Set stroke width
      .style('opacity', 1)
      .style('zIndex', 50)
      .attr('x1', (d, i) => i === 0 ? wire_start_pos_x  - 125 : points[i - 1].x - 125)
      .attr('y1', (d, i) => i === 0 ? wire_start_pos_y  - 90 : points[i - 1].y - 90)
      .attr('x2', (d,i) => points[i].x - 125) 
      .attr('y2', (d,i) => points[i].y+1 - 90);   

     
    svg.selectAll('.jack-image').remove(); 

    console.log('SVG Check', svg)

    checkDistance(points[points.length - 1])

    //Lock in that plug if we're plugged in.

    if (isPluggedRef_Audio.current) {

    

      if (!plug_rect) {

          plug_rect = Matter.Bodies.rectangle(pluggedPortRef_Audio.current.portX, pluggedPortRef_Audio.current.portY, 10, 10, { isStatic: true }); //event.clientX, event.clientY,
          
          Matter.World.add(world, plug_rect); 

          const justWireBodies = wireBodies.filter(body => body.identifier === 'Wire');

          if (wireBodies.length > 0) {
            plugCon = Matter.Constraint.create({ 
              bodyA: plug_rect, 
              bodyB: justWireBodies[justWireBodies.length - 1],  
              stiffness: 0.5,
              length: 0, 
              aaplugidentify: 'PlugCOn'
            }); 

            console.log('Plug Con', plugCon)
    
            Matter.World.add(world, plugCon); 
          }
    
          }




    }
    
    
    if (!isPluggedRef_Audio.current) {

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

  if (world.bodies.length < 1) {

  initialiseWire()

  }

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

function initialiseWire() {


  var tempBodies = []
  // 4. Create chain of circle bodies for wire 

  
  let wireBody = Matter.Bodies.circle(wire_start_pos_x, wire_start_pos_y, 5, {
    restitution: 0.5, 
    friction: 0.5, 
    isStatic: true
  });


  Matter.World.add(world, wireBody);

  tempBodies = [...tempBodies, wireBody]
  //setwireBodies_Audio(wireBodies_Audio => [...wireBodies_Audio, wireBody]);
  
  for (let i = 0; i < 25; i++) {
    let wireBody = Matter.Bodies.circle(i * 15 + 30, 30, 5, {
      restitution: 0.5, 
      friction: 0.01,
      identifier: 'Wire'
      
    });

  //wireBody.velocity.x += 1;
  //wireBody.force.x += 0.0005;
  //wireBody.force.y += 0.00005
  
  Matter.World.add(world, wireBody);

  tempBodies = [...tempBodies, wireBody]
  //setwireBodies_Audio(wireBodies_Audio => [...wireBodies_Audio, wireBody]);
    
  }
  
  // Connect bodies with constraints
  for (let i = 0; i < tempBodies.length - 1 ; i++) {//

  
    let constraint = Matter.Constraint.create({ 
        bodyA: tempBodies[i],  
        bodyB: tempBodies[i + 1],
        stiffness: 0.009,
        length: 5
      })

    Matter.World.add(world, constraint);


      ///////////////////////////////////////////////////////////////////////////////////////////////////////////

      // THe faff is somat to do with the constraints.
    
    }
    


  setwireBodies_Audio(tempBodies)

  
  
}
    
// Mouse Events



    // Add mouse contraint
    let mouse_rect = null;
    let mouseCon = null;

    const mousedownevent = (event) => {


      if (!wireStaysPluggedCusOfHoverRef.current) {
      
      if (!mouse_rect) {
        //alert()
      mouse_rect = Matter.Bodies.rectangle(event.clientX, event.clientY, 10, 10, { isStatic: true }); //event.clientX, event.clientY,
      
      Matter.World.add(world, mouse_rect); 

      
      if (wireBodies_Audio.length > 0) {
        mouseCon = Matter.Constraint.create({ 
          bodyA: mouse_rect, 
          bodyB: wireBodies_Audio[wireBodies_Audio.length - 1],  
          stiffness: 0.25,
          length: 0 
        }); 

        Matter.World.add(world, mouseCon); }
      
      }}}

      const mouseupevent = (event) => {
        Matter.World.remove(world, mouse_rect);
        mouse_rect = null;
        
        if (wireBodies_Audio.length > 0) {
        Matter.World.remove(world, mouseCon);
        mouseCon = null;
        }
      }



    let isMouseMoving = false;
    
    const handleMouseMove = (event) => {
      if (!isMouseMoving) {
        isMouseMoving = true;
        requestAnimationFrame(() => {
          // Update the object's position here
          if (mouse_rect) {
            mouse_rect.position.x = event.clientX;
            mouse_rect.position.y = event.clientY;
          }
          
        });
        isMouseMoving = false; // this used to be inside the if (mouse_rect)
      }
    };

    useEffect(() => {

      document.addEventListener('mousedown', mousedownevent);
      document.addEventListener('mouseup', mouseupevent);
    
      document.addEventListener('mousemove', handleMouseMove);
    
      return () => {
        // Cleanup: Remove the event listener when the component unmounts
        
        document.removeEventListener('mousedown', mousedownevent);
        document.removeEventListener('mouseup', mouseupevent);

        document.removeEventListener('mousemove', handleMouseMove);

      };
    }, [wireBodies_Audio]); 
    
        
        

        const renderJack = (lastPoint, portX, portY, dist) => {

        
          width = window.innerWidth;
          var scaledWidth = width/1707;

          // Calculate orientation angle
          let angle = Math.atan2(portY - lastPoint.y, portX - lastPoint.x) * (180 / Math.PI);



          let posx = lastPoint.x - (100 * scaledWidth);
          let posy = lastPoint.y - (150 * scaledWidth);

          let rot_origx = lastPoint.x;
          let rot_origy = lastPoint.y;
          
          if (isPluggedRef_Audio.current) {
            posx = portX-(100 * scaledWidth);
            posy = portY-(150 * scaledWidth);
            if (dist < 30) {angle = 210;}
          }


          const svg = d3.select('#svg-container-audio');

          svg.append('image')
          .attr('href', jackImageArray[imgRef.current])  //[jackImageIndex])
          .attr('x', posx) 
          .attr('y', posy)
          .attr('transform',  `translate(-120,-75)rotate(${angle + 90} ${rot_origx} ${rot_origy})`)
          .attr('width', 200 * scaledWidth)
          .attr('height', 200 * scaledWidth) 
          .attr('class', 'jack-image')
          .style('zIndex', 15)

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
            
            const audioBookPos = getPosition(document.querySelector('.audioBook-port'));
            const musicPos = getPosition(document.querySelector('.music-port'));


            var ports = {
              port_1: {port: 1, portX: audioBookPos.left + (65 * audioBookPos.width/237), portY: audioBookPos.top + (65 * audioBookPos.width/237)}, 
              port_2: {port: 2, portX: musicPos.left + (65 * musicPos.width/237), portY: musicPos.top + (65 * musicPos.width/237) },
            };

            // Wassup with book pos being in the audio one?     
            //  port_2: {port: 2, portX: audioPos.left + (65 * bookPos.width/237), portY: audioPos.top + (65 * bookPos.width/237) },


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
              pluggedPortRef_Audio.current = closestPort;

            
              var distance_threshold = 40 //15

              if(dist <= distance_threshold) {
                isPluggedRef_Audio.current = true; // Dispatch event if plugged in
                window.dispatchEvent(new CustomEvent('wirePluggedIn', {detail: {port: pluggedPortRef_Audio.current}}))  
              }

              if(dist >= distance_threshold + 1) {
                isPluggedRef_Audio.current = false;
                pluggedPortRef_Audio.current = null;
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

              if (pluggedPortRef_Audio.current.port == port.port) {


                closestPort = port; 
                closestDistance = 0;
                console.log('Port? ', port)
                isPluggedRef_Audio.current = true;
                pluggedPortRef_Audio.current = port;
                window.dispatchEvent(new CustomEvent('wirePluggedIn', {detail: {port: pluggedPortRef_Audio.current}}))  
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

    //alert('1')

   if (isPluggedRef_Audio.current) {


    var currentPort = pluggedPortRef_Audio.current.port;

    setPlugged(currentPort)

   }

   else {

    setPlugged(false)

   }


  }, [pluggedPortRef_Audio.current]);
      


  
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


/*
  const [positions, setPositions] = useState({
    audioBook: {left: '100', top: '100'},
    music: {left: '100', top: '100'},
  });
*/
  
  // Port selectors
  const PORTS = {
    audioBook: '.audioBook-port',
    music: '.music-port', 
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
    audioBook: {left: '100', top: '100'},
    music: {left: '100', top: '100'},
  }); 

  useEffect(() => {

    // Get positions
    const audioBookPos = getPosition(PORTS.audioBook);
    const musicPos = getPosition(PORTS.music);

    // Set positions on ref instead of state
    positionsRef.current = {
      audioBook: audioBookPos,
      music: musicPos,
    };

  }, [PORTS]);

  

    return ( 


<div className="port-container">

  <div className='audioBook-port' style={{
    left:'64vw',
    top:'60vh',
    width: '5vw'
  }}></div>

  <div className='music-port'style={{
    left:'40.5vw',
    top:'65.5vh',
    width: '5vw'
  }}></div> 


  <div className="colour-test" />



        <div className="flex-container">
        
          <div className="wire">  
    
          </div> 

        </div>

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
