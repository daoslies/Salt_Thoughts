import { useState, useEffect, useRef } from 'react'; 

const About_Menu = ({ isAboutMenu, setIsAboutMenu }) => { 

  /*

    useEffect(() => {

      if (isAboutMenu) {

        const script = document.createElement('script');
        script.src = 'https://your-thoughts-are-made-of-salt.ck.page/08af753a37/index.js';
        //script.async = false;
        script.dataset.uid = '08af753a37';

        const container = document.getElementById('convertkit-form-container');
        container.appendChild(script);
      
        return () => {
          if (container) {
          //container.removeChild(script);
          }
        };
      }


    }, [isAboutMenu]);

    https://script.google.com/macros/s/AKfycbw5XsZbthnVkI6OLxf3Y5QkniuBZigOZABOzlhh0XgspS2ZcbTAZSi5M-UJGymQ4F1x/exec

    */


  function MailingList() {
      const [isLoading, setIsLoading] = useState(false);
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        const action = form.action;
    
        setIsLoading(true); // Set loading state to true
    
        try {
          const response = await fetch(action, {
            method: 'POST',
            body: data,
          });
    
          if (response.ok) {
            alert("You're in. I'll send you a message when there's news.");
            form.reset();
          } else {
            alert('Oops! Something went wrong. Please try again.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Oops! Something went wrong. Please try again.');
        }
    
        setIsLoading(false); // Set loading state back to false
      };
    
      return (
        <form
          method="POST"
          action="https://script.google.com/macros/s/AKfycbw5XsZbthnVkI6OLxf3Y5QkniuBZigOZABOzlhh0XgspS2ZcbTAZSi5M-UJGymQ4F1x/exec"
          onSubmit={handleSubmit}
        >
          Name:<br />
          <input name="Name" type="text" />
          <br />
          Email:<br />
          <input name="Email" type="email" />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Subscribing...' : 'Subscribe!'}
          </button>
        </form>
      );
    }


  function Dropdown({ title, children }) {
    const [open, setOpen] = useState(false);
    const [closing, setClosing] = useState(false);

    const handleToggle = () => {
      if (closing) {
        return; // If the dropdown is in closing mode, do nothing
      }
  
      if (open) {
        setClosing(true);
        setTimeout(() => {
          setOpen(false);
          setClosing(false);
        }, 500); // Adjust this value to match the transition duration
      } else {
        setOpen(true);
      }
    };
  
    return (
      <div className="about-menu-drop-downs">
        <div
          className="about-menu-drop-down-buttons"
          style={{
            color: 'white',
            width: '90%',
            overflow: 'hidden',
            border: '3px solid black',
            marginLeft: 'auto',
            marginRight: 0,
          }}
          onClick={handleToggle}
          onTouchStart={handleToggle}
        >
          {title}
        </div>
  
        <div className={`about-menu-drop-down-wrapper 
                      ${open ? 'open' : ''} ${closing ? 'closing' : ''}`}>
          {children}
        </div>
      </div>
    );
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
        
        <aboutmenu className='aboutmenu'>

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

          <p>So, I'm writing this book. </p>
          <p>It's taking a silly amount of time (and a further, equally silly, amount of time has been spent making this silly website)</p>
          <p>But, I do genuinly think it's quite good.</p>
          <p>I'm engaged by it at least, and I hope you will be too.</p> 
          <p>And that's exactly the point: I'm putting all this effort in because I think it'll be worthwhile
            for people to read it. </p>
          <p>I think it'll be worthwhile for YOU to read it.</p>
          <p>There's this viewpoint about the nature of knowledge, which the book intends to convey to you, and I think it'll shift the lens through which you view your life, your self and your universe in a way that you'll appreciate. </p>
          <p>And what I'm asking of you is quite simply to enter your email below so I can send you a message when the book is ready for you to read.</p>

          <MailingList/>
          {/* <div id="convertkit-form-container"></div> */}

          {/* 

          oh gosh, so in some way you need to have an 

          @saltthoughts.co.uk email address for convertkit email to work 

          https://community.convertkit.com/others-c6zdto80/post/the-incentive-email-never-gets-sent-there-is-no-where-i-have-found-that-A7H1OVDVvFTFk16?highlight=PYDMJgEd4DBw6Dl

          https://help.convertkit.com/en/articles/2502505-why-do-i-need-my-own-domain-to-send-email

          https://www.123-reg.co.uk/web-hosting/

          https://www.hover.com/ ## just to add another website into your current set jup -.-

          ## Potentially mailchimp does not require a custom domain.

          ## Fuk all this biz, let's just set up a google sheet.

                - https://script.google.com/macros/s/AKfycbw5XsZbthnVkI6OLxf3Y5QkniuBZigOZABOzlhh0XgspS2ZcbTAZSi5M-UJGymQ4F1x/exec


          */}

          <p>And that's why it's useful for you to enter your email.</p>
          <p>It's also useful for the book itself, because I'm trying to get publishers to take an interest in it.</p>
          <p>And I have a feeling that is going to be very difficult ;) </p>
          <p>If we can show them that we've got a list of even 50 people who are interested, I think it would help a whole awful lot.</p>

          <p>So whack your email in for yourself.</p>
          <p>But know that you're doing it for the world of salt as well.</p>

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