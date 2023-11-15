import React, { useState, useEffect, useReducer } from 'react';
import * as d3 from 'd3';

import laserBoxImg from './Salt_Pics/LaserBox1.png';

import salt_1_im from './Salt_Pics/Salt_1.png';
import salt_2_im from './Salt_Pics/Salt_2.png';
import salt_3_im from './Salt_Pics/Salt_3.png';
import salt_4_im from './Salt_Pics/Salt_4.png';
import salt_5_im from './Salt_Pics/Salt_5.png';

var ImageArray = new Array();
ImageArray[0] = salt_1_im;
ImageArray[1] = salt_2_im;
ImageArray[2] = salt_3_im;
ImageArray[3] = salt_4_im;
ImageArray[4] = salt_5_im;






const EmbeddingRep = (props) => {


  const { particles, spawnParticleDispatcher } = props;

  const [dots, setDots] = useState([{
                                      x: 0,
                                      y: 0,
                                      opacity: Math.random() 
                                  }]);

  const [laserPosId, setLaserPosId] = useState(0)
  const [laserDelay, setLaserDelay] = useState(0);

  //const [particles, setParticles] = useState([]);


  const svg = d3.select('#svg-container');

    
  const vw = 50; // 50vw
  const width = window.innerWidth;
  const widthScaled = width/1707;
  const vwInPixels = (vw / 100) * width;
  const vhInPixels = 0.5 * window.innerHeight;
  
  const x_offset = vwInPixels - 70;
  const y_offset = vhInPixels - 50;
  
  // LaserBoxPosition 
  const wireNodeX = x_offset + 70;
  const wireNodeY = y_offset - 75;
  

  const killparticlepastY = 260 * widthScaled;  //240


  var laserbox_img;

  // Generate grid of dots
  const numDots = 100;
  const rows = 10;
  const cols = Math.ceil(numDots / rows); 

  const dotSize = 5 * widthScaled;
  const spacing = 10 * widthScaled; 

    // Track current row and col
    let row = 0;
    let col = 0;
  
    const initialDots = [];
  
      // Dots
  
    for (let i = 0; i < numDots; i++) {
  
      initialDots.push({
          // Set x,y based on col/row
          x: col * (dotSize + spacing),
          y: row * (dotSize + spacing),
    
          opacity: Math.random() 
      });
    
      col++; // Increment col
    
      // Check if at end of row
      if (col >= cols) {
          col = 0; // Reset col
          row++; // Next row
      }
    
      }


  

useEffect(() => {

  //svg.selectAll('laser').remove();  
 
  // Draw initial grid
  dots.map((dot, id)=> {

    // Black outline
    svg.append('circle') 
      .attr('id', `${id}-outline`)
      .attr('cx', (dot.x + 0 + wireNodeX-(70 * widthScaled))) 
      .attr('cy', (dot.y - 0 + wireNodeY+(85 * widthScaled)))   
      .attr('r', dotSize + 2) 
      .style('fill', 'black');

    svg.append('circle')
      .attr('id', 'circle-' + id) 
      .attr('class', 'embedNeuron')
      .attr('cx', (dot.x + 0 + wireNodeX-(70 * widthScaled))) 
      .attr('cy', (dot.y - 0 + wireNodeY+(85 * widthScaled))) 
      .attr('r', dotSize)
      .style('fill', '#10216e' ) 
      .style('opacity', dot.opacity)
      .style('z-index', 1);

      
    /////// Laser


    if (laserPosId % 10 == id % 10) { //laserPosId % 10 == id % 10
 
      svg.append('line')
      .style('stroke', 'red')      // Add stroke color
      .style('stroke-width', 2)     // Set stroke width
      .style('stroke-opacity', 0.75)
      .attr('class', 'laser')
      .attr('id', 'laser-line-' + laserPosId)
      .attr('x1', wireNodeX)
      .attr('y1', wireNodeY-25)
      .attr('x2', dot.x + 0 + wireNodeX-(70 * widthScaled))
      .attr('y2', dot.y - 0 + wireNodeY+(85 * widthScaled))
      .attr('z-index', 50);

      
      setLaserDelay(laserDelay + 1)

      if (laserDelay >= 3) {
        

        setLaserDelay(0)
        setLaserPosId(laserPosId + 1)

        if (laserPosId >= numDots -1) {
          setLaserPosId(0)
        }
      }


    }
      
  });


  // Spawn particle  
  if (Math.random() < 0.05) {
    spawnParticleDispatcher(dots);
  }
  

  if (particles)  {

  // Update existing particles
  particles.forEach(particle => {

    const index = particle.id % ImageArray.length;
    const image = ImageArray[index];

    svg.append('image')
      .attr('class', 'particle-img-')
      .attr('x', particle.x)
      .attr('y', particle.y)
      .attr('width', 10 * widthScaled) 
      .attr('height', 10 * widthScaled)
      .attr('href', image)
      //.style('opacity', particle.opacity);

  
   


 

    // Move
    
    // Get vector direction to center 
    var dx = wireNodeX - particle.x;
    var dy = wireNodeY - particle.y;
    if (Math.abs(dy) < 20) {
        dy = -5
    }

    // Normalize vector
    const mag = Math.sqrt(dx*dx + dy*dy);
    const udx = dx / mag;
    const udy = dy / mag;
    
    // Add vector to position
    particle.x += udx * (((Math.abs(udy)) ** 1.5)); 
    particle.y += udy;


    //p.y -= 0.1

  // Fade
  particle.opacity -= 0.001;

  // Remove if passed center // edge node
  if (particle.y < killparticlepastY) {

    particles.splice(particles.indexOf(particle), 1)

  }



})};

  
  // Render scene
  laserbox_img = svg.append('image')
  .attr('xlink:href', laserBoxImg)
  .attr('width', 230 * widthScaled)
  .attr('height', 344 * widthScaled)
  .attr('x', wireNodeX-(115 * widthScaled))
  .attr('y', wireNodeY-(90 * widthScaled));

  setDots(dots => initialDots);

  // Cleanup
  return () => {
    //clearInterval(dotsInterval);
    //clearInterval(particleInterval);
    //svg.selectAll('.particle-img-').remove()
    //svg.selectAll('circle').remove();
    svg.selectAll("*").remove();

  }

}, [dots, particles]);





// The below works to remove that warning.

// But is also slower and has weird fuckery with cleaning up stuff, including wire.

// So we are ignoring it for now.

// And sort of saying fuk you to that horrible lil warning that can fak right off.

/*


function initialDot_updates() {


  // Track current row and col
  let row = 0;
  let col = 0;

  const initialDots = [];

    // Dots

  for (let i = 0; i < numDots; i++) {

    initialDots.push({
        // Set x,y based on col/row
        x: col * (dotSize + spacing),
        y: row * (dotSize + spacing),
  
        opacity: Math.random() 
    });
  
    col++; // Increment col
  
    // Check if at end of row
    if (col >= cols) {
        col = 0; // Reset col
        row++; // Next row
    }
  
    }

    return initialDots;
    
  }
  



function particle_updates(particles) {

  if (particles)  {

    // Update existing particles
    particles.forEach(particle => {
  
      const index = particle.id % ImageArray.length;
      const image = ImageArray[index];
  
      svg.append('image')
        .attr('class', 'particle-img-')
        .attr('x', particle.x)
        .attr('y', particle.y)
        .attr('width', 10 * widthScaled) 
        .attr('height', 10 * widthScaled)
        .attr('href', image)
        //.style('opacity', particle.opacity);
  
    
  
      /////// Laser
  
  
      //svg.selectAll('line').remove();   
      svg.append('line')
      .style('stroke', 'red')      // Add stroke color
      .style('stroke-width', 2)     // Set stroke width
      .style('stroke-opacity', 0.5)
      .attr('class', 'laser')
      .attr('id', 'laser-line-' + particle.id)
      .attr('x1', wireNodeX)
      .attr('y1', wireNodeY-25)
      .attr('x2', particle.x) 
      .attr('y2', particle.y)  
      .attr('z-index', 50);
  
   
  
      // Move
      
      // Get vector direction to center 
      var dx = wireNodeX - particle.x;
      var dy = wireNodeY - particle.y;
      if (Math.abs(dy) < 20) {
          dy = -5
      }
  
      // Normalize vector
      const mag = Math.sqrt(dx*dx + dy*dy);
      const udx = dx / mag;
      const udy = dy / mag;
      
      // Add vector to position
      particle.x += udx * (((Math.abs(udy)) ** 1.5)); 
      particle.y += udy;
  
  
      //p.y -= 0.1
  
    // Fade
    particle.opacity -= 0.001;
  
    // Remove if passed center // edge node
    if (particle.y < killparticlepastY) {
  
      particles.splice(particles.indexOf(particle), 1)
  
    }
  
  
  })};  

}


function dot_update(dots) {

  // Draw initial grid
  dots.map((dot, id)=> {

    // Black outline
    svg.append('circle') 
      .attr('id', `${id}-outline`)
      .attr('cx', (dot.x + 0 + wireNodeX-(70 * widthScaled))) 
      .attr('cy', (dot.y - 0 + wireNodeY+(85 * widthScaled)))   
      .attr('r', dotSize + 2) 
      .style('fill', 'black');

    svg.append('circle')
      .attr('id', 'circle-' + id) 
      .attr('class', 'embedNeuron')
      .attr('cx', (dot.x + 0 + wireNodeX-(70 * widthScaled))) 
      .attr('cy', (dot.y - 0 + wireNodeY+(85 * widthScaled))) 
      .attr('r', dotSize)
      .style('fill', '#938332' ) 
      .style('opacity', dot.opacity)
      .style('z-index', 1);
      
  });

    // Spawn particle  
    if (Math.random() < 0.05) {
      spawnParticleDispatcher(dots);
    }

}


useEffect(() => {

  let animationFrameId;
  
  const updateActivations = () => {
    
    var initialDots = initialDot_updates(particles)

    setDots(initialDots)
    
    animationFrameId = requestAnimationFrame(updateActivations)
  }
  
  updateActivations();
  
  return () => {
    cancelAnimationFrame(animationFrameId)
    //svg.selectAll("*").remove();
  }

}, [])




useEffect(() => {

  let animationFrameId;
  
  const updateDots = () => {
    
    dot_update(dots) 
    
    animationFrameId = requestAnimationFrame(updateDots)
  }
  
  updateDots();
  
  return () => {

    cancelAnimationFrame(animationFrameId);
    //svg.selectAll("*").remove();
    
  }

}, [dots])


useEffect(() => {

  let animationFrameId;
  
  const updateParticles = () => {
    
    particle_updates(particles)

    
    laserbox_img = svg.append('image')
    .attr('xlink:href', laserBoxImg)
    .attr('width', 230 * widthScaled)
    .attr('height', 344 * widthScaled)
    .attr('x', wireNodeX-(115 * widthScaled))
    .attr('y', wireNodeY-(90 * widthScaled))
    .style('zIndex', 2);

    
    animationFrameId = requestAnimationFrame(updateParticles)
  }
  
  updateParticles();
  
  return () => {
    cancelAnimationFrame(animationFrameId)
    svg.selectAll("*").remove();
  }

}, [dots])


*/





/*
// Animation code
const animate = () => {
  // Update dots

  // Render scene
  laserbox_img = svg.append('image')
  .attr('xlink:href', laserBoxImg)
  .attr('width', 230 * widthScaled)
  .attr('height', 344 * widthScaled)
  .attr('x', wireNodeX-(115 * widthScaled))
  .attr('y', wireNodeY-(90 * widthScaled));
  
  // Request next frame
  window.requestAnimationFrame(animate)
}

// Start loop
useEffect(() => {
  animate();

  // Cleanup
  return () => {laserbox_img.remove(); window.cancelAnimationFrame(animate)};
}, [])


*/

// two beefs:

// moving the laser box to its own use effect with request aniamtion frame dun't even work unless you have dots
// as the depency. Dunt know y

// mabs this is helpful: https://css-tricks.com/using-requestanimationframe-with-react-hooks/#:~:text=The%20side%20effects%20of%20useEffect&text=This%20ultimately%20replaces%20the%20request,wouldn't%20be%20so%20nice.

// The salts never actually dissapear. (I don't think)


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



}

export default EmbeddingRep;