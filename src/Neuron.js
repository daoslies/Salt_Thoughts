import neuron_im from './Neuron.png';

import Matter, { Bodies, Composite } from 'matter-js';

import * as d3 from 'd3';


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
  
      this.type = type;
  
      this.saltCount = 0;  // Initialize saltCount to 0
      
      this.state = {
        imgStyle: {
          position: "absolute",
          height: '50px',
          width: '50px',
          left: this.init_pos.x - 25 + "px",
          top: this.init_pos.y + "px",
          opacity: 0.8,
          textalign: "center"
        }
      };
  
      
      this.wire = Bodies.circle(this.init_pos.x, this.init_pos.y, 25, {
        isStatic: true
      });
      this.wire.collisionFilter = {
        'group': -1,
        'category': 2,
        'mask': 0,
      };
      Composite.add(this.engine.world, this.wire);
    } 
  
    Welcome({self}) {
      function neur_click() {}
      //const [imgStyle, setImgStyle] = useState(self.neuronStyle);
      //const [neuron, setNeuron] = useState(self);
      function neur_over() {

        //Change colour of all links, not related to this neuron, to black 
        // (and back)
        d3.selectAll(".connection")
        .style("stroke", "black");

        // Get all the connections that are linked to this node
        console.log('Valid Connections: ', self.vizData.validConnections)
        console.log('do t + S match the id? ', self.wire.id)

        const connectedConnections = self.vizData.validConnections.filter(con => con.source.id === self.wire.id || con.target.id === self.wire.id);
        
        console.log('ConnectedConex: ', connectedConnections)
        // Set the color of the connected connections back to the original color
        const connections = d3.selectAll(".connection")
          .filter(function(d) {
            return connectedConnections.some(con => con.key === d.key);
          });
        connections.style("stroke", d => d.colour);
          }

        function neur_away() {

          const connections = d3.selectAll(".connection")
          connections.style("stroke", d => d.colour);

        }

      console.log('weolcome style: ', self)
      
      /*
      if (self.type === 'output') {
        
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
            onMouseOver={neur_over}
            onMouseOut={neur_away}
         />
  
          );
  
      }   */
  
  
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
          onMouseOver={neur_over}
          onMouseOut={neur_away}
        /> 
        );
    }
  
    getWeightAndBias(toNeuron, network) {
      
      const weight = network.weights[`${this.id}-${toNeuron.id}`];
      const bias = network.biases[toNeuron.id];
      return { weight, bias };
    }
  
  
    calculateActivation(nextLayerNeurons, saltCount, network) {
    let activations = [];
    //alert('checl')
    for (let i = 0; i < nextLayerNeurons.length; i++) {
      let neuron = nextLayerNeurons[i].props.neuron;
      let weightedSum = 0;
      console.log('checkity check on the ewight and bias cacl: ', this, neuron)
      const { weight, bias } = this.getWeightAndBias(neuron, network);
      weightedSum += (weight * saltCount) + bias;
      let activation = 1 / (1 + Math.exp(-weightedSum));
      activations.push(activation);
    }
    return activations;
  }
  
    // Method to increment saltCount
    addSalt() {
      this.saltCount++;
    }
  
    // Method to decrement saltCount
    removeSalt() {
      this.saltCount--;
    }
    
  }

  export default Neuron;