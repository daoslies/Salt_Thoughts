import { useState } from 'react'; 

const About_Menu = ({ isAboutMenu, setIsAboutMenu }) => { 


  function Dropdown({title, children}) {
    const [open, setOpen] = useState(false);
  
    return (
      <div className={'about-menu-drop-downs'}>

        <div className={'about-menu-drop-down-buttons'}
            style = {{
              width : '90%', 
              
              overflow: 'hidden',
              border: '3px solid black'}}
            onClick={() => setOpen(!open)}
            onTouchStart={() => setOpen(!open)}>

          {title}  

        </div>
        
        <div className={`about-menu-drop-down-wrapper ${open ? 'open' : 'closed'}`}>
        {children}
        </div>
      </div>
    )
  }

  return (

    <div className="about-menu-container">



      <div className={`about-menu-wrapper left ${isAboutMenu ? 'open' : 'collapsed'}`}
        style={{
          backgroundColor: 'rgb(0, 10, 57)',
          position: 'relative',
          top: '10vh', 
          width: '40vw',
          height: '80vh', 
          zIndex: 300,
          border: '5px solid black'
        }}>

        <button 
        
        style={{
          position: 'absolute',
          right: '20px',
          top:'20px',
          zIndex: "151",  //zindex and pointer were to try and make the button click and it still dunt
          pointerEvents: "auto",
        }}

        flex="1"
        
        onMouseDown={() => {setIsAboutMenu(false);}}
        onTouchStart={() => {setIsAboutMenu(false);}}>

          X

        </button>
        
        <aboutmenu>

            <header>Your Thoughts Are Made Of Salt is a book. </header>

            <p>It takes insights from biological brains, and insights from artifical brains to create a fictional alien brain that is used to explain
               concepts about the non-fictional brains that exist in our world today.</p>

            <header>It's Harry Potter in space. </header>
            
            <p>The Neuarks study at the Alabaster Institute of Digital-Neurology, where they make friends, commit atrocities of science and learn with you, the reader, how to understand modern developments in AI and mind reading.. </p>
            
            <header>And it needs YOUR assistance! </header>
            
            <p> Go open one of the tabs on the right ---> </p>

        </aboutmenu> 


      </div>


      <div className={`about-menu-wrapper right ${isAboutMenu ? 'open' : 'collapsed'}`}
        style={{
          backgroundColor: 'rgb(0, 10, 57)',
          position: 'absolute',
          top: '10vh', 
          width: '40vw',
          height: '80vh', 
          zIndex: 300,
          border: '5px solid black'
        }}>

        <button 
        
        style={{
          position: 'absolute',
          right: '20px',
          top:'20px',
          zIndex: "151",  //zindex and pointer were to try and make the button click and it still dunt
          pointerEvents: "auto",
        }}

        flex="1"
        
        onMouseDown={() => {setIsAboutMenu(false);}}
        onTouchStart={() => {setIsAboutMenu(false);}}>

          X

        </button>
        
        <aboutmenu>

        <Dropdown title=" For Publishers & Funding Bodies  ▼">
          <p>Content for section 1</p> 
        </Dropdown>

        <Dropdown title=" For Friends & Readers  ▼">
          <p>Content for section 2</p>
        </Dropdown>

        <Dropdown title=" For Clients & Employers  ▼">
          <p>Content for section 3</p>  
        </Dropdown>

        </aboutmenu> 


      </div>




    </div>
  );
};

export default About_Menu;