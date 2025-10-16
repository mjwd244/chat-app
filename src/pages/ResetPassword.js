import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../assets/ResetPassword.module.css'; // Import the CSS module

const Resetpassword = () => {
  const [password, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with password:', password); // Log the password being submitted
    try {
      await axios.post(`https://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMessage('Password has been reset.');
      navigate(`${process.env.REACT_APP_REDIRECT_BASE_URL}/login`);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        // Display the first validation error message
        setMessage(error.response.data.errors[0].msg);
      } else if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Error resetting password.');
      }
      console.log('Error response:', error.response); // Log the error response
    }
  };

  return (
    <div className={styles.resetPasswordContainer}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={password}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setMessage(''); // Clear the message when the user starts typing
            }}
            placeholder="Enter your new password"
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Resetpassword;