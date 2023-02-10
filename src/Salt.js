import Matter, { Bodies, Composite } from 'matter-js';

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

class Salt {

    constructor(name, engine, outputSaltCountCallback, initialNeuron) {
  
      this.name = name;
      this.engine = engine;
  
      this.outputSaltCountCallback = outputSaltCountCallback;
  
      this.initNeuron = initialNeuron;
      this.currentNeuron = null; 
      this.previousNeuron = null; 
  
      this.position_x = this.initNeuron.wire.position.x -75;
      this.position_y = this.initNeuron.wire.position.y;
  
      this.htmlID = this.name + 'ID'
      var num = Math.floor( Math.random() * 5);
      this.img = ImageArray[num];
  
      this.saltStyle = {
        position: "absolute",
        height: '20px',
        width: '20px',
        left: this.position_x + "px",
        top: this.position_y + "px",
  
      };
      
      this.wire = Bodies.circle(this.position_x, this.position_y, 10);
      this.wire.mass += 1.5
  
      Composite.add(this.engine.world, this.wire);
  
      //salt.props.self.head_towards(salt.props.self, nextLayerNeurons, network);
      
      this.head_init = function head_init(self, network) {
          var force = { x: 0, y: 0 };
          const forceScale_main = 0.0000007;
          var forceScale = forceScale_main

          // code for making the salt move towards the initial_neuron if no current neuron has been set
          const force_x = 10 * forceScale * (this.initNeuron.wire.position.x - this.wire.position.x)
          const force_y = 10 * forceScale * (this.initNeuron.wire.position.y - this.wire.position.y)

          force.x -= force_x;
          force.y -= force_y; 

          self.wire.force.x -= force.x; 
          self.wire.force.y -= force.y;
      }


      this.head_towards = function head_towards(self, nextLayerNeurons, network) {
        // Calculate the activations for the salt based on the weights and biases of the current neuron
        
        //console.log('AreweHeading: ', self, nextLayerNeurons, network)
      
        if (this.currentNeuron) {

          var force = { x: 0, y: 0 };
          const forceScale_main = 0.0000007;
          var forceScale = forceScale_main

          const curr_neuron = self.currentNeuron.props.neuron;

  
          if (curr_neuron.type === 'output') {
              // code for making the salt move towards the current neuron's position
              const force_x = 10 * forceScale * (curr_neuron.wire.position.x - this.wire.position.x)
              const force_y = 10 * forceScale * (curr_neuron.wire.position.y - this.wire.position.y)
  
              force.x -= force_x;
              force.y -= force_y;
  
              self.wire.frictionAir = 5;
              self.wire.mass = 10;
        
            } else {
            // code for calculating activations and force based on nextLayerNeurons
            const saltCount = curr_neuron.saltCount;
            const activations = curr_neuron.calculateActivation(nextLayerNeurons, saltCount, network);
            var max_active_index = [].reduce.call(activations, (m, c, i, arr) => c > arr[m] ? i : m, 0);
            //console.log('activates: ', activations)
            // Calculate the total force to apply to the salt based on the activations of the next layer neurons
            for (let i = 0; i < nextLayerNeurons.length; i++) {
              const neuron = nextLayerNeurons[i].props.neuron;
              const activation = activations[i];
              forceScale = forceScale_main;
              
              if (neuron.layer === network.maxLayerArray.length-1 && i === max_active_index ) {
                  forceScale = forceScale * 5;
                  //alert()
                }
              if (neuron && activation) {
                const force_x = activation * forceScale * (neuron.wire.position.x - this.wire.position.x);
                const force_y = activation * forceScale * (neuron.wire.position.y - this.wire.position.y);
                force.x -= force_x;
                force.y -= force_y;
              }}}
  
        // Use the force to determine the direction in which the salt should move
        self.wire.force.x -= force.x; 
        self.wire.force.y -= force.y;
            
              }


      };
      
  
      this.update_pos = function update_pos(self, network) {
        // Update the position of the salt on the page
        self.position_x = this.wire.position.x;
        self.position_y = this.wire.position.y;
        var self_obj = document.getElementById(self.htmlID);
        self_obj.style.left = self.position_x + "px";
        self_obj.style.top = self.position_y  + "px";
        // Check if the salt has entered a new neuron and update the currentNeuron if necessary
        this.updateCurrentNeuron(self, network);
      };
      
      this.updateCurrentNeuron = function updateCurrentNeuron(self, network) {
        // Set a collision threshold distance in pixels
        const collisionThreshold = 50;
      
        // Check if the salt is within the collision threshold distance of any neuron
        const collidesWithNeuron = network.neural_welcome_list.find(neuron => {
          return Matter.Vector.magnitude(Matter.Vector.sub(self.wire.position, neuron.props.neuron.wire.position)) < collisionThreshold;
        });
      
        // If the salt is within the collision threshold distance of a neuron, update the currentNeuron property
        if (collidesWithNeuron && this.currentNeuron !== collidesWithNeuron) {
          if (this.previousNeuron) {
          this.previousNeuron.props.neuron.removeSalt(); }
          this.previousNeuron = this.currentNeuron;
          this.currentNeuron = collidesWithNeuron;
          this.currentNeuron.props.neuron.addSalt();
  
          if (this.currentNeuron.props.neuron.type === "output") {
            this.outputSaltCountCallback();
          }
          
          if (this.previousNeuron) {
          if (this.previousNeuron.props.neuron.type === "output") {
            this.outputSaltCountCallback();
          }}
  
          
          //console.log('collisions: ', this, this.currentNeuron)
  
        }
      }
    }
  
    
  
    Welcome({self}) {
      //const key = `${self.name}-${Date.now()}`; // Generate a unique key using the salt's name and a timestamp
      return <img src={ImageArray[Math.floor(Math.random() * 5)]} 
              className="App-logo" id={self.htmlID} alt="salt"  style = {self.saltStyle} />;
    }
  
  };


  export default Salt;