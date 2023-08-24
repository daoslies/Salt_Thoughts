import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

import laserBoxImg from './Salt_Pics/LaserBox1.png';

const EmbeddingRep = () => {

  //Embeddingarraystartposition
  const x_offset = 560;
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
  dots.forEach(dot => {

    // Black outline
    svg.append('circle') 
      .attr('id', `${dot.id}-outline`)
      .attr('cx', dot.x + x_offset)
      .attr('cy', dot.y + y_offset)
      .attr('r', dotSize + 2) 
      .style('fill', 'black');

    svg.append('circle')
      .attr('id', dot.id)
      .attr('class', 'embedNeuron')
      .attr('cx', dot.x + x_offset)
      .attr('cy', dot.y + y_offset)
      .attr('r', dotSize)
      .style('fill', 'green') 
      .style('opacity', dot.opacity);
  });


  // Spawn particle  
  if (Math.random() < 0.8) {
    spawnParticle();
  }

  // Update existing particles
  particles.forEach(particle => {
    
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
    svg.selectAll('circle').remove();
    laserbox_img.remove();
  }

}, [dots]);



// Create particle container 
//const particleContainer = svg.append('g').attr('id', 'particles')


  /*
    const [dots, setDots] = useState([]);
    const svg = d3.select('#svg-container');

    const x_offset = 560;
    const y_offset = 325;

    // Generate grid of dots
    const numDots = 100;
    const rows = 10;
    const cols = Math.ceil(numDots / rows); 

    const dotSize = 5;
    const spacing = 10; 

    // Track current row and col
    let row = 0;
    let col = 0;


  useEffect(() => {
  

    const initialDots = [];

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

    setDots(initialDots);

   
    // Draw initial grid
    dots.forEach(dot => {

      // Black outline
      svg.append('circle') 
        .attr('id', `${dot.id}-outline`)
        .attr('cx', dot.x + x_offset)
        .attr('cy', dot.y + y_offset)
        .attr('r', dotSize + 2) 
        .style('fill', 'black');

      svg.append('circle')
        .attr('id', dot.id)
        .attr('class', 'embedNeuron')
        .attr('cx', dot.x + x_offset)
        .attr('cy', dot.y + y_offset)
        .attr('r', dotSize)
        .style('fill', 'green') 
        .style('opacity', dot.opacity)
    });

    // Update opacities on interval
    const interval = setInterval(() => {
      
      setDots(prevDots => prevDots.map(dot => {
        return {
          ...dot,
          opacity: Math.random()  
        };
      }));

      dots.forEach(dot => {
        svg.select(`circle#${dot.id}`)  
          .style('opacity', dot.opacity);
      });

    }, 1000);

    // Cleanup
    return () => {
      clearInterval(interval);
      svg.selectAll('circle').remove();
    }

  }, [dots]);

  const centerY = 240;
 
   
// State to store particles  
const [particles, setParticles] = useState([]);

// Create particle container 
//const particleContainer = svg.append('g').attr('id', 'particles');

useEffect(() => {

  // Animation loop
  const animate = () => {

    //svg.selectAll('circle.particle').remove();

    // Remove particles  
    //particleContainer.selectAll('div').remove();

    // Spawn particle  
    if (Math.random() < 0.5) {
      spawnParticle();
    }

    

    // Center point 
    const wireNodeX = x_offset + 70;
    const wireNodeY = y_offset - 75;


    // Update existing particles
    particles.forEach(p => {

        // Move
        
        // Get vector direction to center 
        var dx = wireNodeX - p.x;
        var dy = wireNodeY - p.y;
        if (Math.abs(dy) < 20) {
            dy = -5
        }

        // Normalize vector
        const mag = Math.sqrt(dx*dx + dy*dy);
        const udx = dx / mag;
        const udy = dy / mag;
        
        // Add vector to position
        p.x += udx * (((Math.abs(udy)) ** 1.5)); 
        p.y += udy;


        //p.y -= 0.1

      // Fade
      p.opacity -= 0.001;

      // Remove if passed center // edge node
      if (p.y < centerY) {

        setParticles(prev => {
            const copy = [...prev];
            copy.splice(copy.indexOf(p), 1)  
            return copy;
          })
      }

    });



    
    // Redraw particles
    
    svg.selectAll('circle.particle')
    .data(particles) 
    .join('circle')
    .attr('class', 'particle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 5) 
    .style('fill', 'green') 
    .style('opacity', d => d.opacity)

    // Request next frame
    requestAnimationFrame(animate);


  }

  animate();

}, [dots]);

// Spawn particle helper
function spawnParticle() {

     // Select random circle element
     if (dots[0]) {
     let neuron = {x : 50, y : 50};

     
        neuron = dots[parseInt(Math.random() * dots.length)];
     

    // Get its position  
    const x = neuron.x + x_offset;
    const y = neuron.y + y_offset;

  // Logic to generate x, y  
  particles.push({
    x: x,
    y: y,
    opacity: neuron.opacity
  });



  setParticles([...particles]);

 

}

*/

 
  /////////It's lagging. Y IS IT LAGGIGNG! (somat to do with the particles. and their rendering.)


  return (
    <>
    </>
  );

}

export default EmbeddingRep;