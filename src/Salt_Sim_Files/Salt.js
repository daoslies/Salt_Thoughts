import Matter, { Bodies, Composite } from 'matter-js';

import salt_1_im from '../Salt_Pics/Salt_1.png';
import salt_2_im from '../Salt_Pics/Salt_2.png';
import salt_3_im from '../Salt_Pics/Salt_3.png';
import salt_4_im from '../Salt_Pics/Salt_4.png';
import salt_5_im from '../Salt_Pics/Salt_5.png';

var ImageArray = new Array();
ImageArray[0] = salt_1_im;
ImageArray[1] = salt_2_im;
ImageArray[2] = salt_3_im;
ImageArray[3] = salt_4_im;
ImageArray[4] = salt_5_im;

class Salt {

    constructor(name, engine, outputSaltCountCallback, initialNeuron, output_x) {
  
      this.name = name;
      this.engine = engine;
  
      this.outputSaltCountCallback = outputSaltCountCallback;
  
      this.initNeuron = initialNeuron;
      this.currentNeuron = null; 
      this.previousNeuron = null; 

      this.stopCountPump = 0;
      this.stopCountNudge = 0;
  
      this.position_x = this.initNeuron.wire.position.x - ( 75 * 0.075 * (window.innerWidth * 0.8/ 100)); // * 0.1 * (window.innerWidth * 0.8/ 100);
      this.position_y = this.initNeuron.wire.position.y //* 0.2 * (window.innerHeight * 0.8/ 100);

      this.output_x = output_x;
  
      this.htmlID = this.name + 'ID'
      var num = Math.floor( Math.random() * 5);
      this.img = ImageArray[num];
  
      this.saltStyle = {
        position: "absolute",
        height: '4.4%',  /*20px*/
        aspectRatio: 1,
        width: 'auto',
        left: this.position_x * 0.1+ "%",
        top: this.position_y * 0.18 + "%",
  
      };

      this.wire_size_in_px = 10 // 2.2

      //alert('SIZE' + this.wire_size_in_px)
      
      this.wire = Bodies.circle(this.position_x, this.position_y, this.wire_size_in_px);  //wire size was 10
      this.wire.mass += 2  //* (0.1778 * (window.innerHeight * 0.8/ 100))  ///// 1.5
      console.log('Wire MASS', this.wire.mass, this.wire.id)
      //alert(this.wire.mass)
      //alert(window.innerHeight)
      //alert((0.17781 * window.innerHeight * 0.8/ 100))

      Matter.Body.scale(this.wire, (0.17781 * window.innerHeight * 0.8/ 100), (0.17781 * window.innerHeight * 0.8/ 100))
      //this.wire.mass = 2.394 // 2.394
      Matter.Body.set(this.wire, 'mass', 5)
      console.log('Wire MASS - post scale - ', this.wire.mass, this.wire.id)

      this.wire.salt = true;
      

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
            const saltCount = curr_neuron.saltCount;  //obvs was saltCOunt , but changed to EverSalt
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

                  // Is this for providing extra force at the final connection?
                }
              if (neuron && activation) {
                const force_x = activation * forceScale * (neuron.wire.position.x - this.wire.position.x);
                const force_y = activation * forceScale * (neuron.wire.position.y - this.wire.position.y);
                force.x -= force_x;
                force.y -= force_y;
              }}
              
              
              //Nudge if stopped
              
              const pumpThreshold = 0.000005;
              const nudgeThreshold = 0.000000005;
              if (-nudgeThreshold < self.wire.force.x && self.wire.force.x < nudgeThreshold 
                && -nudgeThreshold < self.wire.force.y && self.wire.force.y < nudgeThreshold) {
                  //Count how many stops it has been still for, if greater than 10, gizzit a nudge
                  self.stopCountNudge += 1;

                  if (self.stopCountNudge > 450) {

                    if (output_x.wire.position.x && this.wire.position.x) {
                      const nudgeforce = output_x.wire.position.x - this.wire.position.x;
                      const absNudgeforce = Math.abs(nudgeforce);
                      const forceMagnitude = Math.pow(absNudgeforce, 0.05) * 0.1;

                      if (!isNaN(forceMagnitude) && forceMagnitude !== 0 && isFinite(forceMagnitude)) {
                          const forceDirection = Math.sign(nudgeforce);
                          force.x -= forceMagnitude * forceDirection;

                          const forceDirectionY = Math.sign(output_x.wire.position.y - this.wire.position.y);

                          const randomYForce = (Math.random() * 2) - 1;
                          force.y -= forceDirectionY * Math.abs(randomYForce) * 0.1;

                          self.stopCountNudge = 0;
                      }
                  }

                  }
  
                }

                //Pump if slow
              else if (-pumpThreshold < self.wire.force.x && self.wire.force.x < pumpThreshold 
                && -pumpThreshold < self.wire.force.y && self.wire.force.y < pumpThreshold) {
                  //Count how many stops it has been still for, if greater than 10, gizzit a nudge
                  self.stopCountPump += 1;

                  if (self.stopCountPump > 250) {

                    force.x *= 10000;
                    force.y *= 10000;

                    const beforeOrAfterOutputs = Math.sign(output_x.wire.position.x - this.wire.position.x);
                    
                    console.log('Before or After', output_x.wire.position.x, this.wire.position.x)

                    // We're dealing with this fucker. It's that 100 specifically. He is being very frustrating

                    // And mabs you need to visualise in some way.
                    


                    //alert(beforeOrAfterOutputs)
                    if (beforeOrAfterOutputs > 0) {
                    force.y +=  Math.random() < 0.5 ? 0.005 : -0.005; // randomly push up or down by 0.5
                    force.x -= 0.0005;
                  }
                    else {
                    //force.y +=  Math.random() < 0.5 ? 0.005 : -0.005;
                    force.x += 0.0005;
                    }

                    self.stopCountPump = 200;

                  }
  
                }


              // Just be flippin faster

              const slowCoachThreshold = 0.000005;
              if (-slowCoachThreshold < self.wire.force.x && self.wire.force.x < slowCoachThreshold 
                && -slowCoachThreshold < self.wire.force.y && self.wire.force.y < slowCoachThreshold) {
                  //Count how many stops it has been still for, if greater than 10, gizzit a nudge

                    force.x *= 1 / (Math.abs(force.x) * 1000)
                    force.y *= 1 / (Math.abs(force.y) * 1000)

                    self.stopCountNudge += 1; // because this is maybe preventing the nudge from occuring otherwise.
            
                    // should functioanlsie as this is a copy n paste of above.
                    if (self.stopCountNudge > 200) {

                      if (output_x.wire.position.x && this.wire.position.x) {
                        const nudgeforce = output_x.wire.position.x - this.wire.position.x;
                        const absNudgeforce = Math.abs(nudgeforce);
                        const forceMagnitude = Math.pow(absNudgeforce, 0.05) * 0.1;
  
                        if (!isNaN(forceMagnitude) && forceMagnitude !== 0 && isFinite(forceMagnitude)) {
                            const forceDirection = Math.sign(nudgeforce);
                            force.x -= forceMagnitude * forceDirection;
  
                            const forceDirectionY = Math.sign(output_x.wire.position.y - this.wire.position.y);
  
                            const randomYForce = (Math.random() * 2) - 1;
                            force.y -= forceDirectionY * Math.abs(randomYForce) * 0.1;
  
                            self.stopCountNudge = 0;
                        }
                    }
  
                    }
            }


          }
  
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

        try {
          if (self_obj.style) {
            self_obj.style.left = self.position_x + "px";
            self_obj.style.top = self.position_y  + "px";
            // Check if the salt has entered a new neuron and update the currentNeuron if necessary
            this.updateCurrentNeuron(self, network);
          }
        } catch (error) {
          //pass
        }
      };
      
      this.updateCurrentNeuron = function updateCurrentNeuron(self, network) {
        // Set a collision threshold distance in pixels
        const collisionThreshold = 0.106685633 * window.innerHeight // = 75 @ full screen 703 ;
        //alert(collisionThreshold)
      
        // Check if the salt is within the collision threshold distance of any neuron
        const collidesWithNeuron = network.neural_welcome_list.find(neuron => {
          return Matter.Vector.magnitude(Matter.Vector.sub(self.wire.position, neuron.props.neuron.wire.position)) < collisionThreshold;
        });

        //console.log('Currentneuron Check: ', this.currentNeuron)
        if (this.currentNeuron){
        if (collidesWithNeuron && this.currentNeuron.props.neuron.type !== 'input') {self.stopCount = 0;}}

        //console.log('Collides!', collidesWithNeuron)
      
        // If the salt is within the collision threshold distance of a neuron, update the currentNeuron property
        if (collidesWithNeuron && this.currentNeuron !== collidesWithNeuron) {

          //reset nudging critera
          this.stopCountPump = 0;
          this.stopCountNudge = 0;
          
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

      const handleClick = () => {
        // Handle the click event here
        console.log("The salt object was clicked!", self);
      };

      //const key = `${self.name}-${Date.now()}`; // Generate a unique key using the salt's name and a timestamp
      return <img src={ImageArray[Math.floor(Math.random() * 5)]} 
              className="App-logo" id={self.htmlID} alt="salt"  style = {self.saltStyle} onClick={handleClick} />;
    }
  
  };


  export default Salt;