import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginComponent = () => {
 

  const defaultPhotoURL = '/images/newone.jpg';
  const { mainuser, seTheMainUser } = useUser();
  const navigate = useNavigate();




 

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      console.log('Google login success:', credentialResponse);
      const token = credentialResponse.credential;
      const response = await axios.post('http://localhost:5000/api/auth/google', { token });
      console.log('Login successful, backend response:', response.data);
      // Handle the response from your backend server
      // For example, save the token and navigate to the home page
      localStorage.setItem('jwtToken', response.data.token);
      console.log(response.data.user);
      seTheMainUser([
        {
          userId: response.data.user._id,
          displayName: response.data.user.displayName,
          email: response.data.user.email, // Ensure email is included
          photoURL: response.data.user.photoURL || defaultPhotoURL,
        },
      ]);

      navigate('/');
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google login failed:', error);
  };

  return (
    <div>
      <h1>Google Login</h1>
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleLoginFailure}
      />
    </div>
  );
};

export default GoogleLoginComponent;