import React, { useState } from 'react';
import { useUser } from './UserContext';
import { useNavigate, Link } from "react-router-dom";



const Navbar = props => {
  
  const { mainuser,socket, seTheMainUser } = useUser();
  const navigate = useNavigate();
  const [status, setStatus] = useState('online');

  const handleLogout = async () => {

 
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to log out: ${response.status} ${errorText}`);
      }
      socket.emit('useroffline', mainuser[0].userId);
      // Clear localStorage
      localStorage.removeItem('mainuser'); // Remove specific item
     
      seTheMainUser([]); // Set mainuser to an empty array on logout
     
      navigate("/login");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (socket && mainuser.length > 0) {
      socket.emit('changeStatus', { userId: mainuser[0].userId, status: newStatus });
    }
  };

  return (
    <div className='navbar'>
      <span className='logo'>Lama Chat</span>
      <div className='user'>
        {mainuser ? (
          <>
            <Link to={`/user/${mainuser[0].userId}`}>
              <img src= {mainuser[0].photoURL} alt="" />
            </Link>
            <span>{mainuser[0].displayName}</span>
            <select value={status} onChange={(e) => handleStatusChange(e.target.value)} className='status'>
              <option value="online">Online</option>
              <option value="away">Away</option>
              <option value="busy">Busy</option>
              <option value="doNotDisturb">Do Not Disturb</option>
              <option value="offline">Offline</option>
            </select>
          </>
        ) : (
          <span>Loading...</span>
        )}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;