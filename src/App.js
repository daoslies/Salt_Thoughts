import Menu from "./Menu"
import { useState, useEffect } from 'react'; 

import "./App.css";


import {isMobile} from 'react-device-detect';

const App = () => {
    // Add a state variable to control message visibility
    const [showMobileMessage, setShowMobileMessage] = useState(true);

    useEffect(() => {
        const updateMessageVisibility = () => {
          // Check if width is greater than or equal to height (landscape)
          const isLandscape = window.innerWidth >= window.innerHeight;
          setShowMobileMessage(isMobile && !isLandscape);
        };
    
        // Update message visibility on initial render and window resize
        updateMessageVisibility();
        window.addEventListener('resize', updateMessageVisibility);
    
        // Cleanup function to remove event listener on component unmount
        return () => window.removeEventListener('resize', updateMessageVisibility);
      }, [isMobile]);
  
    // Function to hide message on user click (optional)
    const handleDismissMessage = () => setShowMobileMessage(false);
  
    return (
      <div>
         <Menu />
        {/* Conditionally render message only if on mobile and message is visible */}
        {isMobile && showMobileMessage && (
          <div className="mobile-message">
            The World Of Salt is optimized for horizontal viewing.
            
             Please rotate your device (or access the site from your desktop computer)
            for the best experience.
            
            {/* Optional button to dismiss the message */}
            <button onClick={handleDismissMessage} onTouchStart={handleDismissMessage}>Dismiss</button>
          </div>
        )}
       
      </div>
    );
  };

export default App