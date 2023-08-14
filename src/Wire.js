import React, { useState, useEffect, useRef, createContext } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Link }  from "react-router-dom";
import ReactDOM from 'react-dom';
import Matter from 'matter-js';
import * as d3 from 'd3';

import Salt from "./Salty"

import { useNavbar } from './App.js';


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






function Wire(props) {

  const [navbarExpanded, setNavbarExpanded] = useNavbar();

  const [bookRef_, setBookRef_] = useState([]);
  const [audioRef_, setAudioRef_] = useState([]);
  const [simRef_, setSimRef_] = useState([]);
  
  const [plugButtonTime, setPlugButtonTime] = useState(false);

  const [portButtonHover, setportButtonHover] = useState(false);

//Can maybe remove the plugbuttontime state as we are using the pluggedportref ref

  const imgRef = useRef(0);
  const isPluggedRef = useRef(false);
  const pluggedPortRef = useRef(null)

   const portButtonHoverRef = useRef(false)

  useEffect(() => {
    
    setBookRef_(props.bookRouteRef.current);
    setAudioRef_(props.audioRouteRef.current);
    setSimRef_(props.simRouteRef.current);

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

  if (!plugButtonTime && navbarExpanded) {   //// Question marks on && navbarExpanded

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


  /*
   */

  //Can maybe remove the plugbuttontime state as we are using the pluggedportref ref

  if (plugButtonTime) {
 
  //"Push me";

}

if (!plugButtonTime) {
 
  //const textElement = bookRef_;

  //textElement.classList.add('hidden');
  //textElement.style.pointerEvents = 'none';
        
  //textElement.innerHTML = "";
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


  //console.log('text: ', textElement)

  //textElement.innerHTML = "Hello";

  //console.log('text2: ', textElement)


  const enginex = React.useRef(null);
  enginex.current = Matter.Engine.create();

  var engine = enginex.current; 

  //const enginex = React.useRef(null);

  //enginex.current = Matter.Engine.create();

  //var engine = enginex.current;

  //const engine = useContext(WireContext); 

  
  const wire_start_pos_x = 560 + 70;
  const wire_start_pos_y = 325 - 85 - 60;
  
  const [wireBodies, setWireBodies] = useState([]);

  //const [mouseRect, setmouseRect] = useState([]);
  // 1. Create physics engine
  const blueLightRef = useRef(null);

  let plug_rect = null;
  let plugCon = null;
  let blue_light_counter = 0;
  let blue_light_button_check = false;


  useEffect(() => { 

  

  Matter.Events.on(engine, 'afterUpdate', () => {

    const points = wireBodies.map(b => b.position);

    //console.log('Points: ', points)
    const svg = d3.select('#svg-container');
    //svg.selectAll('line').remove();   
    //console.log('2nd w0ire', wireBodies)
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
          //mouse.setStatic(mouse, true);
          
          if (wireBodies.length > 0) {
            plugCon = Matter.Constraint.create({ 
              bodyA: plug_rect, 
              bodyB: wireBodies[wireBodies.length - 1],  
              stiffness: 0.5,
              length: 0, 
              aaplugidentify: 'PlugCOn'
            }); 
    
            Matter.World.add(world, plugCon); }
    
          }


      //Blue Light

      //timer]

      //console.log('Blue: ', blue_light_counter)

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
        //alert()
        }

        Matter.World.remove(world, plug_rect);  
        plug_rect = null;

        console.log('World: ', world)

        

      }
    }

    
    
    

      
  });

  
}, []);

// 2. Create world and world options
const world = engine.world;
world.gravity.y = 0;

var render = Matter.Render.create({
    element: document.body,
    engine: engine
  });     



  
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
  
   
  //console.log('wireBOdies', wireBodies)
  
  
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
    
    
    
    var mouse_area = document.getElementById('svg-container')

    // add mouse control
    var mouse = Matter.Mouse.create(mouse_area);



    // Add mouse contraint
    let mouse_rect = null;
    let mouseCon = null;

    const mousedownevent = (event) => {
      
      if (!pluggedPortRef.current || !portButtonHoverRef.current) {


      mouse_rect = Matter.Bodies.rectangle(event.clientX, event.clientY, 10, 10, { isStatic: true }); //event.clientX, event.clientY,
       
      //setmouseRect(mouse_rect)
      
      Matter.World.add(world, mouse_rect); 
      //mouse.setStatic(mouse, true);
      
      if (wireBodies.length > 0) {
        mouseCon = Matter.Constraint.create({ 
          bodyA: mouse_rect, 
          bodyB: wireBodies[wireBodies.length - 1],  
          stiffness: 0.05,
          length: 0 
        }); 

        Matter.World.add(world, mouseCon); }
      
      }}
    
    useEffect(() => {

      document.addEventListener('mousedown', mousedownevent);
      
      return () => document.removeEventListener('mousedown', mousedownevent);
    }, []);

    

        
    document.addEventListener('mousemove', (event) => {

      //mouse_rect.position.x = mouse.position.x;
      //mouse_rect.position.y = mouse.position.y;
      if (mouse_rect) {
      mouse_rect.position.x = event.clientX;
      mouse_rect.position.y = event.clientY;
      }
      
      //Matter.Body.applyForce(mouse_rect, mouse_rect.position, {
      //  x: mouse_rect.position.x - event.clientX,
      //   y: mouse_rect.position.y - event.clientY
      // });
    });
    
        
        document.addEventListener('mouseup', () => {
          Matter.World.remove(world, mouse_rect);
          
          if (wireBodies.length > 0) {
          Matter.World.remove(world, mouseCon);
          mouseCon = null;
          }
        })

        // Jack plug

        //const [jackImageIndex, setJackImageIndex] = useState(0);
       


        const renderJack = (lastPoint, portX, portY, dist) => {


          // Get last wire point
          //const lastPoint = wireBodies[wireBodies.length - 1].position; 
        
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
            //rot_origx = portX-100;
            //rot_origy = portY-150;
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

          /*<image 
              href={jackImageArray[jackImageIndex]} 
              x={lastPoint.x}
              y={lastPoint.y}
              width={50} // image width
              height={50} // image height
              transform={`rotate(${angle}, ${lastPoint.x}, ${lastPoint.y})`} 
            /> */
        
          return (
            <></>
          );
        }

        function calculateDistanceToPort(lastPoint) {


          const viewportHeight = window.innerHeight; // viewport height in pixels
          const viewportWidth = window.innerWidth; // viewport width in pixels
          
          const vhRatio = viewportHeight / 100; // 100vh = viewportHeight pixels
          const vwRatio = viewportWidth / 100; // 100vw = viewportWidth pixels
        
          
          var ports = {
            port_1: {port: 1, portX: 305, portY: 265}, 
            port_2: {port: 2, portX: 825, portY: 260},
            port_3: {port: 3, portX: 555, portY: 565}
          };

          if (!navbarExpanded) {
            ports = {
              port_1: {port: 1, portX: 305 - (13 * vwRatio) , portY: 265 - (25 * vhRatio)},
              port_2: {port: 2, portX: 825, portY: 260},
              port_3: {port: 3, portX: 555, portY: 565}
            };

          }

          else {

            ports = {
              port_1: {port: 1, portX: 305, portY: 265}, 
              port_2: {port: 2, portX: 825, portY: 260},
              port_3: {port: 3, portX: 555, portY: 565}
            };


          }    
          

          let closestDistance = Infinity;
          let closestPort = null;

          let dist = null;

          // Loop through ports
          for (const portName in ports) {

            const port = ports[portName];
            
            // Calculate distance 
            const dx = lastPoint.x - port.portX;
            const dy = lastPoint.y - port.portY;
            dist = Math.sqrt(dx*dx + dy*dy);

            // Check if closest
            if(dist < closestDistance) {
              closestDistance = dist;
              closestPort = port; 


            if(dist <= 15) {
              isPluggedRef.current = true;
              pluggedPortRef.current = closestPort;
              //console.log('Plugs: ', pluggedPortRef.current, isPluggedRef.current) 
            }

            if(dist >= 16) {
              isPluggedRef.current = false;
              //pluggedPortRef.current = closestPort;
              //console.log('Plugs: ', pluggedPortRef.current, isPluggedRef.current) 
            } 
             
            //console.log('Plugs: ', dist, isPluggedRef.current)
              // Dispatch event if plugged in
            if(isPluggedRef.current) {
              window.dispatchEvent(new CustomEvent('wirePluggedIn', {detail: {port: pluggedPortRef.current}}))  


          }


            }

            
            }



            ////// Here is where you should be looking.

            //If you remove the isPluggedRef.current = false then the plug will stay plugged. 
            // But we want it removable. That is relatively key.

            // check the console logs filtered by 'Plugs'. unsure. Maybe somat to do with the for loop. 
            // DOne/.

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
  
    Matter.Render.run(render);

  
    // create runner
    var runner = Matter.Runner.create();
    
    // run the engine
    Matter.Runner.run(runner, engine);
        
    

  }, []);


  useEffect(() => {

  }, []);

    
    const [dragStart, setDragStart] = useState(null); 
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        /*
    const svg = d3.select('#svg-container');
    
    svg.on('mousedown', (event) => {
        var mouse = d3.pointer(event, svg.node());
        setDragStart({ x: mouse[0], y: mouse[1] });
    });
    
    svg.on('mousemove', (event) => {
        if (dragStart) {
        var mouse = d3.pointer(event, svg.node());

        const points = wireBodies.map(b => b.position);

        const delta = {
            x: mouse[0] - dragStart.x,
            y: mouse[1] - dragStart.y
        };
        //setDragStart({ x: mouse[0], y: mouse[1] });    
        setMousePos({
            x: mouse[0],
            y: mouse[1] 
        });
        
        svg.selectAll('line')
            .attr('x1', (d,i) => i === 0 ? 0 : points[i - 1].x+ delta.x)//line.x1 + delta.x) 
            .attr('y1', (d,i) => i === 0 ? 0 : points[i - 1].y + delta.y)//line.x2 + delta.x) 
            .attr('x2', (d,i) => points[i].x + delta.x)//line.y1 + delta.y)
            .attr('y2', (d,i) => points[i].y+1 + delta.y)//line.y2 + delta.y);
    }
    });
    
    svg.on('mouseup', () => {
        setDragStart(null);
    });  */
    

    }, [dragStart]);

    return ( 
        <div></div>

     )

     //<button position="absolute" top="100px" left="400px"></button>
// 

//<div id="svg-portal"></div>
//</SVGContainer>

      //
    
    //{dragStart && <circle cx={dragStart.x} cy={dragStart.y} r={5} fill="blue" /> }
    //<circle cx={mousePos.x} cy={mousePos.y} r={5} fill="red" /> 
    
}

export default Wire;
