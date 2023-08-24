import React, { useState, useEffect } from 'react';
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

const EmbeddingRep = () => {

  //Embeddingarraystartposition

  const vw = 50; // 50vw
  const width = window.innerWidth;
  const vwInPixels = (vw / 100) * width;

  const x_offset = vwInPixels - (230 / 2);
  const y_offset = 325;

  // LaserBoxPosition 
  const wireNodeX = x_offset + 70;
  const wireNodeY = y_offset - 75;


  const [dots, setDots] = useState([]);
  const svg = d3.select('#svg-container');

  var laserbox_img;


  // Generate grid of dots
  const numDots = 100;
  const rows = 10;
  const cols = Math.ceil(numDots / rows); 

  const dotSize = 5;
  const spacing = 10; 

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


  const killparticlepastY = 240;

  // State to store particles  
  const [particles, setParticles] = useState([]);


      
  // Spawn particle helper
  function spawnParticle() {

    // Select random circle element
    if (dots[0]) {
    let neuron = {x : 50, y : 50};

    let id = parseInt(Math.random() * dots.length);

    
    neuron = dots[id];
    

    // Get its position  
    const x = neuron.x + x_offset;
    const y = neuron.y + y_offset;



    // Logic to generate x, y  
    particles.push({
    x: x,
    y: y,
    id: id,
    opacity: neuron.opacity
  });



  setParticles([...particles])

  }
  }


useEffect(() => {

  setDots(initialDots);

 
  // Draw initial grid
  dots.map((dot, id)=> {

    const image = ImageArray[Math.floor(Math.random() * ImageArray.length)];

    // Black outline
    svg.append('circle') 
      .attr('id', `${id}-outline`)
      .attr('cx', dot.x + x_offset)
      .attr('cy', dot.y + y_offset)
      .attr('r', dotSize + 2) 
      .style('fill', 'black');

    svg.append('circle')
      .attr('id', 'circle-' + id) 
      .attr('class', 'embedNeuron')
      .attr('cx', dot.x + x_offset)
      .attr('cy', dot.y + y_offset)
      .attr('r', dotSize)
      .style('fill', '#938332' ) 
      .style('opacity', dot.opacity)
      .style('z-index', 1);

/*
    svg.append('image')
      .attr('class', 'particle-img-')
      .attr('x', dot.x + x_offset+20)
      .attr('y', dot.y + y_offset)
      .attr('width', 25) 
      .attr('height', 50)
      .attr('href', image)
      .style('z-index', 10);
*/
      
  });




  // Spawn particle  
  if (Math.random() < 0.3) {
    spawnParticle();
  }

  // Update existing particles
  particles.forEach(particle => {

    const index = particle.id % ImageArray.length;
    const image = ImageArray[index];

    svg.append('image')
      .attr('class', 'particle-img-')
      .attr('x', particle.x)
      .attr('y', particle.y)
      .attr('width', 10) 
      .attr('height', 10)
      .attr('href', image)
      //.style('opacity', particle.opacity);

      /*
    
    // Black outline
    svg.append('circle') 
    .attr('id', `${particle.id}`)
    .join('circle')
    .attr('class', 'particle')
    .attr('cx', particle.x)
    .attr('cy', particle.y)
    .attr('r', dotSize + 2) 
    .style('fill', 'black')
    .style('opacity', particle.opacity + 0.2);

    svg.append('circle')
    .attr('id', `${particle.id}`)
    .join('circle')
    .attr('class', 'particle')
    .attr('cx', particle.x)
    .attr('cy', particle.y)
    .attr('r', 5) 
    .style('fill', 'green') 
    .style('opacity', particle.opacity);

    */

    /////// Laser


    svg.selectAll('line').remove();   
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

    setParticles(prev => {
        const copy = [...prev];
        copy.splice(copy.indexOf(particle), 1)  
        return copy;
      })
  }



});


laserbox_img = svg.append('image')
.attr('xlink:href', laserBoxImg)
.attr('width', 230)
.attr('height', 344)
.attr('x', wireNodeX-115)
.attr('y', wireNodeY-90);


  // Cleanup
  return () => {
    //clearInterval(dotsInterval);
    //clearInterval(particleInterval);
    svg.selectAll('.particle-img-').remove()
    svg.selectAll('circle').remove();
    laserbox_img.remove();
  }

}, [dots]);


}

export default EmbeddingRep;