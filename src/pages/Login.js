import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from '../components/UserContext';
import GoogleLoginComponent from '../components/auth/GoogleLoginComponent';
import FacebookSDKLoader from '../components/auth/FacebookSDKLoader';
import FacebookLoginButton from '../components/auth/FacebookLoginButton';
import axios from "axios";



const Login = ({ onLogin }) => {
  
  const { mainuser, seTheMainUser ,socket , socketReady } = useUser();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
     
      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
     
      let token = data.token;
      localStorage.setItem('token', token); 
      token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      seTheMainUser([{
        userId: data._id,
        displayName: data.displayName,
        photoURL: data.photoURL,
      }]);
if (socketReady && socket) {
  socket.emit('userOnline', mainuser[0].userId);
}
      // Emit userOnline event after successful login
   
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <>
      <div className="formContainer">
        <div className="formWrapper">
          <FacebookSDKLoader />
          <h2>Login</h2>
          <span className="logo">Lama Chat</span>
          <span className="title">Login</span>
          <form onSubmit={handleSubmit}>
            <div>
              <span>Email:</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="email"
              />
            </div>
            <div>
              <span>Password:</span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="password"
              />
            </div>
            <Link to="/forgot-password" className="forgot">Forgot Password?</Link>
            <button type="submit">Login</button>
            
          </form>
          <GoogleLoginComponent />
            <FacebookLoginButton onLogin={onLogin} />
          <p>You don&apos;t have an account? <a href="/register">Register</a></p>
        </div>
      </div>
    </>
  );
};

export default Login;