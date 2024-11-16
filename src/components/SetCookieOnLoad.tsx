import { useEffect } from 'react';

const SetCookieOnLoad = () => {
  useEffect(() => {
    const setCookie = async () => {
      try {
        const response = await fetch('https://mutubackend.com/set-cookie', {
          method: 'POST',  // Use POST method as you need to set the cookie
          headers: {
            'Content-Type': 'application/json',  // Add necessary headers
          },
          credentials: 'include',  // Ensure credentials (cookies) are sent with the request
          body: JSON.stringify({ /* Add any necessary body data if required */ }),
        });

        if (response.ok) {
          console.log('Cookie set successfully');
        } else {
          console.error('Failed to set cookie', response.status);
        }
      } catch (error) {
        console.error('Error setting cookie:', error);
      }
    };

    setCookie();  // Trigger cookie setting on page load
  }, []);  // Empty dependency array ensures this runs once when the component mounts

  return null;  // You can return something here if needed for your component
};

export default SetCookieOnLoad;
