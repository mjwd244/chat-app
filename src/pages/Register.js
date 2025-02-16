import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from '../components/UserContext';
import GoogleLoginComponent from '../components/GoogleLoginComponent';
import CryptoJS from 'crypto-js';
const SECRET_PASS = "XkhZG4fW2t2W";

const Register = () => {
  const defaultPhotoURL = '/images/newone.jpg';
  const { seTheMainUser } = useUser(); // id, photo, displayName
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  


  console.log('Redirect Base URL:', process.env.REACT_APP_REDIRECT_BASE_URL);

  const handleSignUp = async (e) => {
    e.preventDefault();

    
    try {
        const response = await axios.post(`http://localhost:5000/api/auth/register`, {
            displayName,
            email,
            password,
            photoURL: defaultPhotoURL,
            secretKey: SECRET_PASS
        });

        if (response && response.data) {
            let token = response.data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('secretKey', SECRET_PASS);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            seTheMainUser([{
                userId: response.data.user.id,
                displayName: response.data.user.displayName,
                photo: response.data.user.photoURL,
            }]);

            navigate("/verify-email-prompt");
        }
    } catch (error) {
        console.error('Error creating user:', error);
    }
};



  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Lama Chat</span>
        <span className="title">Register</span>
        <form>
          <span>Display Name</span>
          <input
            required
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <span>Email</span>
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span>Password</span>
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input required style={{ display: "none" }} type="file" id="file" />
          <img src="" alt="" />
          <span>Add an avatar</span>
          <button onClick={handleSignUp}>Sign up</button>
          <GoogleLoginComponent />
        </form>
        <p>Already have an account? <a href={`${process.env.REACT_APP_REDIRECT_BASE_URL}/login`}>Login</a></p>
      </div>
    </div>
  );
};

export default Register;