import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';

const Welcome = () => {
  const { mainuser } = useUser();
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-navbar">
        <div className="logo">CompanyChat</div>
        <div className="auth-buttons">
          <Link to="/register" className="auth-button register">Register</Link>
          <Link to="/login" className="auth-button login">Login</Link>
        </div>
      </div>
      
      <div className="welcome-content">
        <h1>Internal Communication Made Simple</h1>
        <p>Secure, fast, and efficient team chat for our company</p>
        
        <div className="features">
          <div className="feature-item">
            <h3>Direct Messaging</h3>
            <p>Quick communication with team members</p>
          </div>
          <div className="feature-item">
            <h3>File Sharing</h3>
            <p>Share documents securely</p>
          </div>
          <div className="feature-item">
            <h3>Data Privacy</h3>
            <p>All data stays within our company</p>
          </div>
        </div>

        {mainuser && mainuser.length > 0 ? (
          <Link to="/home" className="start-button">
            Open Chat
          </Link>
        ) : (
          <div className="future-note">
            <p className="beta-tag">Beta Version 1.0</p>
            <p className="roadmap">
              Future updates will include: Video calls, Calendar integration, 
              and Team channels
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;