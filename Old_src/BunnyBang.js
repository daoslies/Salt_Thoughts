import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';



class bunChar {

  constructor(name, price, increase, count, image, htmlID) {

    this.name = name;
    this.price = price;
    this.increase = increase;
    this.output = 0;
    this.count = count;
    this.image = image;
    this.htmlID = htmlID;
    this.can_buy = function(bun_count_1) {if (bun_count_1 < this.price) {document.getElementById(this.htmlID).style.color = "pink"}
    else {document.getElementById(this.htmlID).style.color = "green"}}

  }




  // kk progress got made and then everything broke when you tried to do 
  //<Charlie.Welcome bun={Charlie}/> Cus it would be too simple and straightforward for that to juts work.

  //but it means you can base errrything off the specific clas rather than retype out all the variables everytime.

  // either way, your class system is juuust about working atm.

  Welcome({self}) {

  
    function this_button() {

      

      document.getElementById(self.htmlID).innerHTML = self.price;
      if (bun_count_1 > self.price) {self.count += 1; bun_count_1 -= self.price; self.price = self.price + (self.price*self.count*0.5);}
      document.getElementById(self.htmlID + '1').innerHTML = "level "+self.count;
      
      self.output = self.count * self.increase;
      
      //document.getElementById("Ovens").innerHTML = Oven_price ;
    };
    
    
    return <h1> <div id = {self.htmlID}> {self.price} </div> <button onClick={this_button}><img src = {self.image} width = "150" height = "150"></img></button><span id={self.htmlID + '1'} >Level 0</span> </h1>;

}
  
  


} 

function Bun_Click(props) {


  
  function button_1() {

    console.log('did it');
    console.log(bun_count_1);
  
    bun_count_1 += 1;
    document.getElementById("bunCount1").innerHTML = bun_count_1;
  };
  
  
  return <h1><button onClick={button_1}><img src ="https://cdn.discordapp.com/attachments/743175969807794178/1043962209262374952/sad.png" width = "150" height = "150"></img></button> </h1>;

//<input type="image" src = "https://cdn.discordapp.com/attachments/743175969807794178/1043962209262374952/sad.png" alt="BunCount" width="48"></input>

  
};


function Breeder(props) {

  function button_2() {

    console.log('button 2');
    if (bun_count_1 > breeder_price) {bun_breeder_1 += 1; bun_count_1 -= breeder_price; breeder_price = Math.ceil(breeder_price * 2.1);}
    document.getElementById("bunBreederCount1").innerHTML = "level"+bun_breeder_1;
    document.getElementById("Breeder").innerHTML = breeder_price ;
  };


  return <h1> <div id = "Breeder"> {breeder_price} </div> <button onClick={button_2}><img src ="https://cdn.discordapp.com/attachments/743175969807794178/1043962208939417710/cuteo.png" width = "150" height = "150"></img></button><span id="bunBreederCount1">0</span></h1>;


};


var bun_per_tick = 0

var bun_count_1 = 0
var bun_breeder_1 = 0
var breeder_price = 50
var bun_in_the_ovens_1 = 0
var Oven_price = 10000

let Charlie = new bunChar("Charlie", 5, 1, 0, "https://cdn.discordapp.com/attachments/743175969807794178/1043962208939417710/cuteo.png", "CharlieHtml")

let Jermaine = new bunChar("Jermaine", 100, 5, 0, "https://cdn.discordapp.com/attachments/743175969807794178/1043961971768315934/protistantbun.png", "JermaineHtml")

let Smolsk = new bunChar("Smolsk", 1000, 50, 0, "https://cdn.discordapp.com/attachments/743175969807794178/1043961970845569235/bunface.png", "SmolskHtml")

let Holy_Hector = new bunChar("Hector The Holy", 10000, 500, 0, "https://cdn.discordapp.com/attachments/743175969807794178/1043961971462123641/preistbun.png", "HolyHectorHtml")

let Fancy_Harold = new bunChar("Fancy Harold", 100000, 50000, 0, "https://cdn.discordapp.com/attachments/743175969807794178/1043962209962823730/waiterbun.png", "FancyHaroldHtml")

let True_Bun = new bunChar("The One True Bun", 100000, 50000, 0, "https://cdn.discordapp.com/attachments/743175969807794178/1043962209635672124/sea_rabbit.png", "TrueBunHtml")

//<Charlie.Welcome name={Charlie.count} />

    //<Jermaine.Welcome name={Jermaine.count} />
function BunBang() {

  async function check() {

    document.getElementById("bunCount1").innerHTML = bun_count_1;

    bun_per_tick = Charlie.output + Jermaine.output + Smolsk.output + Holy_Hector.output + Fancy_Harold.output + True_Bun.output;
    bun_count_1 += bun_per_tick;

    document.getElementById("bunPerTick").innerHTML = "Buns Per Tick: " + bun_per_tick;
    document.getElementById("bunBreederCount1").innerHTML = "level "+bun_breeder_1
    document.getElementById("bunCount1").innerHTML = bun_count_1
    document.getElementById("bun_in_the_oven_Count1").innerHTML = "level "+bun_in_the_ovens_1

    Charlie.can_buy(bun_count_1)
    Jermaine.can_buy(bun_count_1)

    if (bun_count_1 < breeder_price) {document.getElementById("Breeder").style.color = "grey"}
      else {document.getElementById("Breeder").style.color = "green"}

    if (bun_count_1 < Oven_price) {document.getElementById("Ovens").style.color = "grey"}
      else {document.getElementById("Ovens").style.color = "green"}
  }
  
  // Write this line
  
  useEffect(() => {
    check()
   }, []);
  
  
  setInterval(check, 100);


  return (

    

    <div className="App">

    <aside className ="ButtonMenu">

      <h1> Spend Buns to gain levels</h1>

    <Bun_Click name={bun_count_1} />
    

    <Charlie.Welcome self={Charlie}/>

    <Jermaine.Welcome self={Jermaine}/>

    <Smolsk.Welcome self={Smolsk}/>

    <Holy_Hector.Welcome self={Holy_Hector}/>

    <Fancy_Harold.Welcome self={Fancy_Harold}/>

    <True_Bun.Welcome self={True_Bun}/>


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

export default BunBang;
