import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const verifyEmail = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
            console.log('Email verified successfully!', response.data);
            navigate('/login'); // Redirect to login page after successful verification
          } catch (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.error('Error verifying email:', error.response.data);
              console.error('Status code:', error.response.status);
              console.error('Headers:', error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              console.error('No response received:', error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.error('Error setting up request:', error.message);
            }
            console.error('Config:', error.config);
          }
        };

    if (token) {
      verifyEmail();
    } else {
      console.error('No token found in query parameters');
    }
  }, [location, navigate]); // Dependencies: re-run effect if location or navigate changes

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Lama Chat</span>
        <span className="title">Verifying your email...</span>
      </div>
    </div>
  );
};

export default VerifyEmail;