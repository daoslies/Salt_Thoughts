import neuron_im from './Neuron.png';

import Matter, { Bodies, Composite } from 'matter-js';

import * as d3 from 'd3';

import NeuronGraph from './Neuron_WB_Graph';


class Neuron {
    constructor(name, engine, pos_x, pos_y, id, layer, index, type) {
      this.name = name;
      this.engine = engine;
      this.htmlID = this.name + 'ID';
      this.x = pos_x; ///mabs delete these at some point
      this.y = pos_y;
      this.init_pos = {x: pos_x, y: pos_y};
      this.id = id;
      this.layer = layer;
      this.index = index;

      this.vizData = null;
      this.node = null;

      this.graph = null;
      this.clickCount = -1;
      this.holdTimeoutRef = null;
      this.isHolding = false;
  
      this.type = type;
  
      this.saltCount = 0;  // Initialize saltCount to 0
      this.everSalt = 0;

      this.canvasWidth = window.innerWidth;
      this.canvasHeight = window.innerHeight;
      this.prevCanvasHeight = this.canvasHeight;

      this.SFH = (this.canvasHeight / this.prevCanvasHeight)

      this.left_in_px = (this.init_pos.x) * 0.1 * (this.canvasWidth * 0.8/ 100);
      this.top_in_px = (this.init_pos.y) * 0.15 * (this.canvasHeight * 0.8/ 100);

      this.wire_size_in_px =  0.0284495 * this.canvasHeight // = 20 @ full screen 703

      this.state = {
        imgStyle: {
          position: "absolute",
          height: '70px',   //'12%',
          width: 'auto',  /* Automatically adjust height based on aspect ratio */
          aspectRatio: 1, /* Defines a 1:1 aspect ratio (square) */
          left: (this.init_pos.x - 40) * 0.1 + "%",
          top: (this.init_pos.y - 15) * 0.15 + "%",
          opacity: 0.8,
          textalign: "center",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          objectFit: 'cover',
          transform: 'scale(' + (window.innerHeight * 0.0014224751) + ')'
        }
      };

      
      this.wire = Bodies.circle(this.left_in_px, this.top_in_px, this.wire_size_in_px, {
        isStatic: true,
        neuron_type: this.type,
        neuron_id: this.id,
        collisionFilter: {         
          'group': -1,
          'category': 2,
          'mask': 0,}
      });

      Matter.Body.scale(this.wire, this.SFH, this.SFH)

      Composite.add(this.engine.world, this.wire);


    } 
  
    Welcome({self}) {
      
      function neur_click() {


        //alert(self.id + self.type + self.wire.neuron_type);

        console.log(self)
        // Filter out connection objects with sourceNeuronId
        var targetConnections = self.connections.filter(connection => connection.targetNeuronId);
        const sourceConnections = self.connections.filter(connection => connection.sourceNeuronId);

        //Filter out invalid connections
        const connectedConnections = self.vizData.validConnections.filter(con => con.source.id === self.wire.id || con.target.id === self.wire.id);
        console.log('TARGETS 1', targetConnections)
        targetConnections = targetConnections.filter(targetConnection =>
          connectedConnections.some(connectedConnection =>
            connectedConnection.source.id === self.wire.id &&
            connectedConnection.target.neuron_id === targetConnection.targetNeuronId
          )
        );
        console.log('Targets2', targetConnections)
        console.log('connected', connectedConnections)


        // Extract weight and bias arrays from filtered connections
        //const weights = sourceConnections.map(connection => connection.weight);
        const weights = targetConnections.map(connection => connection.weight);
        const biases = targetConnections.map(connection => connection.bias);
        const targets = targetConnections.map(connection => connection.targetNeuronId);

        
        
        self.clickCount +=1;

        if (self.clickCount >= targetConnections.length) {

          self.clickCount=0 
          neur_over()

        }



        self.engine.neuronGraph = <NeuronGraph  weight={weights[self.clickCount]} bias={biases[self.clickCount]} target = {targets[self.clickCount]} 
                                                neuronID = {self.id} engine = {self.engine} />;
        



        console.log(self.id, 'Clicked :  ',  'W: ', weights, '   B:  ', biases)

        // Highlight currently graphed connection
        //const connectedConnectionIndex = self.clickCount % targetConnections.length; // Calculate the index of the currently graphed connection
        //const connectedConnection = targetConnections[self.clickCount]; // Get the currently graphed connection
        
        if (self.clickCount >= 0) {
        const connectedConnections = self.vizData.validConnections.filter(con => con.source.id === self.wire.id  && `${con.key.split('-')[2]}-${con.key.split('-')[3]}` === targetConnections[self.clickCount].targetNeuronId);

        // Select the connection and update its style#

        //console.log(`${self.id}-${connectedConnection.targetNeuronId}`)
        const connection = d3.selectAll('.connection')
        .filter(function(d) {
          return  connectedConnections.some(con => con.key === d.key);
            //d.source.id === self.id &&
            //d.target.id === targetConnections[self.clickCount].targetNeuronId
        });
        connection
          .style('stroke', 'yellow') // Set the desired highlight color (e.g., red)
          .style('stroke-width', d => Math.max(Math.min(d.width * 5,7),0.7)); // Set the desired highlight stroke width (e.g., 3 pixels)
        }


      }
      

      function neur_over() {

        //Change colour of all links, not related to this neuron, to black 
        // (and back)
        d3.selectAll(".connection")
        .style("stroke", "black");

        // Get all the connections that are linked to this node
        //console.log('Valid Connections: ', self.vizData.validConnections)
        //console.log('do t + S match the id? ', self.wire.id)
        //console.log('self: ', self)

        const connectedConnections = self.vizData.validConnections.filter(con => con.source.id === self.wire.id || con.target.id === self.wire.id);
        
        console.log('ConnectedConex: ', connectedConnections)
        // Set the color of the connected connections back to the original color
        const connections = d3.selectAll(".connection")
          .filter(function(d) {
            return connectedConnections.some(con => con.key === d.key);
          });
        connections.style("stroke", d => d.colour)
        .attr("stroke-width", d => d.width);
          }

        function neur_away() {

          const connections = d3.selectAll(".connection")
          connections.style("stroke", d => d.colour)
          .attr("stroke-width", d => d.width);

        }

        //Implementing hold down to clear graph

        const handleMouseDown = () => {
          self.isHolding = true;
          self.holdTimeoutRef.current = setTimeout(() => {
            // Handle hold event logic here

            if (self.isHolding === true){self.engine.neuronGraph = null; console.log('Graph Cleared');}
            
          }, 2500); // Set the duration for holding (in milliseconds)
        };

        const handleMouseUp = () => {
          self.isHolding = false; 
          clearTimeout(self.holdTimeoutRef.current);
        };

        const handleMouseLeave = () => {
          self.isHolding = false;
          clearTimeout(self.holdTimeoutRef.current);
        };

        
        
      return (
        
        <img
          src={neuron_im}
          neuron={self}
          className="App-logo"
          id={self.htmlID}
          key={self.htmlID}
          alt="Neuron"
          style={self.state.imgStyle}
          onClick={neur_click}
          onTouchStart={neur_click}
          onMouseOver={neur_over}
          onMouseOut={neur_away}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
        
        );
    }
  
    getWeightAndBias(toNeuron, network) {
      
      const weight = network.weights[`${this.id}-${toNeuron.id}`];
      /////// DOING A TEST
      /// we are swapping from network.biases[toNeuron.id] to network.biases[this.id]
      const bias = network.biases[toNeuron.id];
      return { weight, bias };
    }
  
  
    calculateActivation(nextLayerNeurons, saltCount, network) {
    let activations = [];
    let total_current_salt = network.saltBag.saltList.length;
    //alert('checl')

    for (let i = 0; i < nextLayerNeurons.length; i++) {
      let neuron = nextLayerNeurons[i].props.neuron;
      const { weight, bias } = this.getWeightAndBias(neuron, network);
      let activation = 1 / (1 + Math.exp(-(  (10 * weight * (saltCount/25))) +  ( weight * ((bias * 0.5)-0.5)) - (5 * weight * weight)   )) ;


      //(10 * weight * (saltCount/45)) + (bias * 2)
      //sigmoid( (10 * weight * x) +  ( weight * ((bias * 0.5)-0.5)) - (5 * weight)  )
      //       let activation = 1 / (Math.exp(-((0.01+weight * (saltCount/total_current_salt) * 10) + bias)));

      // we want the weights in the rough range of 10 to -10 and the biases 2 to -2, we're * ing weight by 10 here 
        // and bias by 2, to achieve this, with our aim to keep both sets of real values between 1 and -1.

        // ok Also. Using (saltCount/total_current_salt), means that the network is always looking at
          // salt %, which means it can't just be like "this is a lil un, chuck it over there."
            // so we are just going to set max salt count (which I'm going to guess is like 45)
            // and that can then be consistent over all samples.
            // Crazy stuff, we're actually going to lower this to 30, cus it's pretty rare that you're ever going
            // to get over 30 salt in a neuron at once.

      activations.push(activation);
    }
    return activations;
  }
  
    // Method to increment saltCount
    addSalt() {
      this.saltCount++;
      this.everSalt++;
    }
  
    // Method to decrement saltCount
    removeSalt() {
      this.saltCount--;
    }

    updateWireFromScreenSize(finalLayerIndex) {

      this.canvasWidth = window.innerWidth;
      this.canvasHeight = window.innerHeight;

      var screenSizeWidthScalingFactor =  (this.canvasWidth * 0.8/ 100)

      this.SFH = (this.canvasHeight / this.prevCanvasHeight) //0.1778

      this.prevCanvasHeight = this.canvasHeight

      if (this.type != 'output') {
        if (this.type == 'input') {
          var lil_nudge = 0 * screenSizeWidthScalingFactor
        }
        else {
          var lil_nudge = 100 * screenSizeWidthScalingFactor
        }
      this.left_in_px = (this.init_pos.x + lil_nudge) * 0.1 * screenSizeWidthScalingFactor;
      }
      else {
        this.left_in_px = (this.init_pos.x + ((finalLayerIndex) * 175) ) * 0.1 * screenSizeWidthScalingFactor;
      }

      this.top_in_px = (this.init_pos.y) * 0.15 * (this.canvasHeight * 0.8/ 100);

      this.wire_size_in_px = 20 * (this.canvasHeight * 0.8/ 100)

      Matter.Body.scale(this.wire, this.SFH, this.SFH)

      
      //this.wire.position.x = this.left_in_px    
      //this.wire.position.y = this.top_in_px
      Matter.Body.set(this.wire, "position", {x: this.left_in_px , y: this.top_in_px})

      this.wire.circleRadius = this.wire_size_in_px

      // and transform the image.

      console.log(this.htmlID)

      if (document.getElementById(this.htmlID))
      {document.getElementById(this.htmlID).style.transform = 'scale(' + (window.innerHeight * 0.0014224751) + ')'}

      

    }
    
  }

  export default Neuron;