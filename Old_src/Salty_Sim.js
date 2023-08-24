import neuron_im from './Neuron.png';
import salt_1_im from './Salt_Pics/Salt_1.png';
import salt_2_im from './Salt_Pics/Salt_2.png';
import salt_3_im from './Salt_Pics/Salt_3.png';
import salt_4_im from './Salt_Pics/Salt_4.png';
import salt_5_im from './Salt_Pics/Salt_5.png';

import './App.css';
import React, { useEffect } from 'react';

import Matter, { Events } from 'matter-js';





//import Matter, { Events }  from 'matter-attractors';
//<link href="\node_modules\matter-attractors" />

//




var ImageArray = new Array();
ImageArray[0] = salt_1_im;
ImageArray[1] = salt_2_im;
ImageArray[2] = salt_3_im;
ImageArray[3] = salt_4_im;
ImageArray[4] = salt_5_im;

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Mouse = Matter.Mouse;

var engine;
var boxA;
var boxB;



engine = Engine.create(); 
engine.world.gravity.scale = 0;

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine
});     

var mouse_area = document.getElementById('buttons')

 // add mouse control
 var mouse = Mouse.create(mouse_area);

 Events.on(engine, 'afterUpdate', function() {
    
  
     if (!mouse.position.x) {
       return;
     }


     var bodies = Composite.allBodies(engine.world);
     var target_x = mouse.position.x;
     var target_y = mouse.position.y;
     /*
     // smoothly move the attractor body towards the mouse
     for (var i = 0; i < bodies.length; i++) {
      var body = bodies[i];
      

      if (body.isStatic || body.isSleeping)
              {
              
              }
          
          else
              {


              var body_x = body.position.x;
              var body_y = body.position.y;
              
              var distance = Math.sqrt(Math.pow((body_x - target_x),2) + Math.pow((body_y = target_y),2))
              
              var direction_x = body_x - target_x;
              var direction_y = body_y - target_y;

              var force_x = direction_x * (1/distance) * 0.001;
              var force_y = direction_y * (1/distance) * 0.001;

              body.force.x -= force_x;
              body.force.y -= force_y;
                  
              
              body.force.y += body.mass * 0.0001; 
              
              }
  };*/
 });
 





Events.on(engine, 'beforeUpdate', function() {
    var bodies = Composite.allBodies(engine.world);

    var target_x =  mouse.position.x;
    var target_y =  mouse.position.y;

    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];
        

        if (body.isStatic || body.isSleeping)
                {
                
                }
            
            else
                {
                var body_x = body.position.x;
                var body_y = body.position.y;
                
                var distance = Math.sqrt(Math.pow((body_x - target_x),2) + Math.pow((body_y - target_y),2))
                
                var direction_x = body_x - target_x;
                var direction_y = body_y - target_y;

                var force_x = direction_x * Math.min(0.3, (1/(distance**2))) * 0.1;
                var force_y = direction_y * Math.min(0.5, (1/(distance**2))) * 1;

                body.force.x -= force_x;
                body.force.y -= force_y;
                
                body.force.y += body.mass * 0.001;
                
                }
    }
});


class Salt {

  constructor(name) {

    this.name = name;
    /* [this.position, this.setPosition] = useState({
      x: 0,
      y: 0
    }); */

    this.position_x = 0;

    this.htmlID = this.name + 'ID'
    var num = Math.floor( Math.random() * 5);
    this.img = ImageArray[num];

    this.saltStyle = {
      position: "absolute",
      height: '50px',
      width: '50px',
      left: this.position_x + "px",
      top: this.position_y + "px",

    };
    
    this.wire = Bodies.circle(300, 100, 25);

    Composite.add(engine.world, this.wire);

    this.update_pos = function update_pos(self) {

      self.position_x = this.wire.position.x;
      self.position_y = this.wire.position.y;

      var self_obj = document.getElementById(self.htmlID);


      //alert(self_obj.style)
      self_obj.style.left = self.position_x + "px";
      self_obj.style.top = self.position_y  + "px";
  
    } 
    

  }

  

  Welcome({self}) {

    

    

    function neur_load()
    {};

    
    return <img src={ImageArray[Math.floor(Math.random() * 5)]} 
            className="App-logo" id={self.htmlID} alt="salt"  style = {self.saltStyle} />;

  

  };

};

class Neuron {

  constructor(name) {

    this.name = name;
    this.htmlID = this.name + 'ID'

    this.neuronStyle = {
      position: "absolute",
      height: '100px',
      width: '100px',
      left: this.position_x + "px",
      top: this.position_y + "px",
      opacity: 0.8
    };

    this.wire = Bodies.circle(300, 300, 50, {
      isStatic: true,
      plugin: {
        attractors: [
          function(bodyA, bodyB) {
            return {
              x: (bodyA.position.x - bodyB.position.x) * -5,
              y: (bodyA.position.y - bodyB.position.y) * -5,
            };
          }
        ]
      }}
    );

    //this.wire.isStatic = true;

    //this.wire.ignoreGravity = true;

    Composite.add(engine.world, this.wire);

    this.update_pos = function update_pos(self) {

      self.position_x = this.wire.position.x;
      self.position_y = this.wire.position.y;

      var self_obj = document.getElementById(self.htmlID);


      //alert(self_obj.style)
      self_obj.style.left = self.position_x + "px";
      self_obj.style.top = self.position_y  + "px";
  
    } 

  }

  Welcome({self}) {

    function neur_load()
    {};

    
    return <img src={neuron_im} className="App-logo" id={self.htmlID} alt="Neuron" style={self.neuronStyle} onClick={neur_load} />;

  

  };

};

let neuron_1 = new Neuron("Net")
let salt_1 = new Salt("Salty")
let salt_2 = new Salt("Salty2")
let salt_3 = new Salt("SaltY3")


var start = "False";






function Salt_Sim() {

    function physics() {

      //alert('we going')
        start = "True";


        // create two boxes and a ground
        //boxA = Bodies.circle(400, 200, 80, 80);
        //boxB = Bodies.circle(450, 50, 80, 80);
        var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
        
        // add all of the bodies to the world
        Composite.add(engine.world, [ground]);

        // run the renderer
        Render.run(render);

        // create runner
        var runner = Runner.create();

        // run the engine
        Runner.run(runner, engine);
      
      }

    async function check() {

      
    
      salt_1.update_pos(salt_1);
      salt_2.update_pos(salt_2);
      salt_3.update_pos(salt_3);
      neuron_1.update_pos(neuron_1);



      var quick_check = document.getElementById("quickcheck");
      quick_check.innerHTML = Math.round(salt_1.wire.position) + " <- wire .. obj -> " + Math.round(salt_1.position_x) + ', ' + Math.round(salt_1.position_y)
        + ' mouse: ' + Math.round(mouse.position.x)+ ', ' + Math.round(mouse.position.y)  ;
      

      
      
    
    }
    
    // Write this line
    
    useEffect(() => {
      if (start === "True") {
      check()
                           }
     }, []);
    
    
    setInterval(check, 10);
  
  
    return (
  
      
  
      <div className="App">

      <aside className ="ButtonMenu" id='buttons' >
  
        <h1> Spend Buns to gain levels</h1>
        <div id ='quickcheck'>s</div>

        <button onClick={physics}>Click Me </button> 

        <neuron_1.Welcome self={neuron_1} />

        <salt_1.Welcome self={salt_1} />
        <salt_2.Welcome self={salt_2} />
        <salt_3.Welcome self={salt_3} />

      </aside>
  
  
        <header className="App-header">
  
  
          <img src="https://media.discordapp.net/attachments/743175969807794178/1040724536011788398/crossbun.png" className="App-logo" alt="logo" />
          <p>
            Bang Some Bun
          </p>
  
          <h1><span id="bunCount1">0</span></h1>
  
          <h1><span className="Smol-writing" id="bunPerTick">Buns Per Tick: 0</span></h1>
  
  
        </header>
      </div>
    );
  }
  
  export default Salt_Sim;