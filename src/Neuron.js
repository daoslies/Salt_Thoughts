import neuron_im from './Neuron.png';

import Matter, { Bodies, Composite } from 'matter-js';

class Neuron {
    constructor(name, engine, pos_x, pos_y, id, layer, index, type) {
      this.name = name;
      this.engine = engine;
      this.htmlID = this.name + 'ID';
      this.x = pos_x;
      this.y = pos_y
      this.init_pos = {x: pos_x, y: pos_y};
      this.id = id;
      this.layer = layer;
      this.index = index;
  
      this.type = type;
  
      this.saltCount = 0;  // Initialize saltCount to 0
      
      this.state = {
        imgStyle: {
          position: "absolute",
          height: '50px',
          width: '50px',
          left: this.init_pos.x - 25 + "px",
          top: this.init_pos.y - 25 + "px",
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
      function neur_click() {alert(self.img.style)}
      //const [imgStyle, setImgStyle] = useState(self.neuronStyle);
      //const [neuron, setNeuron] = useState(self);
  
      console.log('weolcome style: ', self)
      
      
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
         />
  
          );
  
      }
  
  
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
        /> 
        );
    }
  
    getWeightAndBias(toNeuron, network) {
      
      //console.log('in get weightandbias', this.id, toNeuron.id)
  
      //console.log('the dictionary key: ', `${this.id}-${toNeuron.id}`)
      //console.log('The fUll weight list: ', network.weights)
      //console.log(network.weights[`${this.id}-${toNeuron.id}`])
      //console.log(network.weights['0-0-1-0'])
      //console.log('bias time', network.biases)
      const weight = network.weights[`${this.id}-${toNeuron.id}`];
      const bias = network.biases[toNeuron.id];
      return { weight, bias };
    }
  
  
    calculateActivation(nextLayerNeurons, saltCount, network) {
    let activations = [];
    for (let i = 0; i < nextLayerNeurons.length; i++) {
      let neuron = nextLayerNeurons[i].props.neuron;
      let weightedSum = 0;
      console.log('checkity check on the ewight and bias cacl: ', this, neuron)
      const { weight, bias } = this.getWeightAndBias(neuron, network);
      weightedSum += weight * saltCount + bias;
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