import React, { useState } from 'react';
import axios from 'axios';
import styles from '../assets/Forgotpassword.module.css'; // Import the CSS module
import { useNavigate } from 'react-router-dom';

const Forgotpassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      navigate('/pass-reset-prompt'); 
    } catch (error) {
      setMessage('Error sending password reset email.');
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Forgotpassword;