import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'; // Adjust the import path as needed

const FacebookLoginButton = ({ onLogin }) => {
  const navigate = useNavigate();
  const { mainuser, seTheMainUser } = useUser(); // Corrected function name

  const [isLoading, setIsLoading] = useState(true);

  /*useEffect(() => {
    console.log('Initial mainuser:', mainuser);
  }, []);*/

  useEffect(() => {
    //console.log('Updated mainuser:', mainuser);
    setIsLoading(false);
  }, [mainuser]);

  const handleFacebookLogin = () => {
    if (typeof FB !== 'undefined') {
      FB.login(response => {
        if (response.authResponse) {
          // Get the access token and user ID from the response
          const { accessToken, userID } = response.authResponse;

          // Send access token and user ID to the backend
          fetch('http://localhost:5000/api/auth/facebook', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessToken, userID }),  // Pass accessToken and userID directly
          })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            // Log the response data
            console.log('Response data:', data);

            // Handle the response from the backend
            seTheMainUser([{
              userId: data.userId,
              displayName: data.name,
              email: data.email,
              photoURL: data.photoURL // Save the profile picture URL
            }]);
            console.log('mainuser set:', [{
              userId: data.userId,
              displayName: data.name,
              email: data.email,
              photoURL: data.photoURL // Log the profile picture URL
            }]);
      
            onLogin(data);  // e.g., update user state
            navigate('/');  // Redirect to home page
          })
          .catch(error => {
            console.error('Error during fetch:', error);
          });
        } else {
          console.error('User cancelled login or did not fully authorize.');
        }
      }, { scope: 'public_profile,email' });
    } else {
      console.error('Facebook SDK not loaded');
    }
  };

  return (
    <button onClick={handleFacebookLogin} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Login with Facebook'}
    </button>
  );
};

FacebookLoginButton.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default FacebookLoginButton;