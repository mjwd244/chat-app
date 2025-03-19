import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';
import UserDetails from './UserDetails';
import { useUser } from '../components/UserContext';

const Home = ({ isGroupChat ,setIsGroupChat}) => {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isBlackOverlay, setIsBlackOverlay] = useState(false);
  const [highlightedUsers, setHighlightedUsers] = useState([]);

  const { mainuser} = useUser(); // Get the user from context
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [toggeluseeffect , settoogleUseeffect] = useState(false)

  useEffect(() => {
    const askForNotificationPermission = () => {
      const userConfirmed = window.confirm("Do you want to activate notifications?");
      if (userConfirmed) {
        requestNotificationPermission();
      }
    };

    askForNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
        playSound(); // Play sound after permission is granted
      } else {
        console.log("Notification permission denied.");
      }
    } else if (Notification.permission === "granted") {
      console.log("Notification permission already granted.");
      playSound(); // Play sound if permission was already granted
    }
  };

  const playSound = () => {
    const audio = new Audio('/sounds/messagesound.wav'); // Ensure this path is correct
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  };
  useEffect(() => {
    //console.log('Home component mounted or mainuser changed:', JSON.stringify(mainuser, null, 2));
    if (!mainuser || !mainuser[0] || !mainuser[0].userId) {
      console.error('Invalid user state detected:', JSON.stringify(mainuser, null, 2));
      navigate('/register');
    } else {
     // console.log('Valid user detected:', JSON.stringify(mainuser[0], null, 2));
    }
  }, [mainuser, navigate]);
  
  // Add this effect to log every time mainuser changes
/*  useEffect(() => {
    console.log('Mainuser changed in Home component:', JSON.stringify(mainuser, null, 2));
  }, [mainuser]);*/
  // If mainuser is not defined, do not render the component
  if (!mainuser || !mainuser[0] || !mainuser[0].userId) {
    return null;
  }



  const navigateToUserDetails = () => {
    setShowUserDetails(true);
  };

  const handleCloseUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUserId(null);
  };

  const handleSelectUser = (searchTerm) => {
    setSelectedUserId(searchTerm);
    navigateToUserDetails();
  };

  const toggleBlackOverlay = (usersToHighlight) => {
    setHighlightedUsers(usersToHighlight);
    setIsBlackOverlay(!isBlackOverlay);
  };

  const closeOverlay = () => {
    setIsBlackOverlay(false);
    setHighlightedUsers([]);

  };
  useEffect(() => {
  
   
  
},[toggeluseeffect]);
  return (
    <div className="home">
      <div className="container" onClick={() => settoogleUseeffect(!toggeluseeffect)}>
        <div className='mainmenubar'></div>
        <div className='sidebarmenu'>  
          <Link to="/main">
            <p>Main</p>
          </Link>
          <Link to="/friends">
            <p>Friends</p>
          </Link>
          <Link to="/Test">
            <p>Chat Groups</p>
          </Link> 
          <Link to="/profilepage">
            <p>Profile Page</p>
          </Link> 
          </div>
        <Sidebar highlightedUsers={highlightedUsers} isBlackOverlay={isBlackOverlay}  setIsGroupChat={setIsGroupChat} />
       
        {showUserDetails ? (
          <UserDetails
            userId={selectedUserId}
            onClose={handleCloseUserDetails}
          />
        ) : (
          <Chat onSearchChat={handleSelectUser} toggleBlackOverlay={toggleBlackOverlay} isGroupChat={isGroupChat} setIsGroupChat={setIsGroupChat}/>
        )}
      </div>
      {isBlackOverlay && (
        <div className="overlay" onClick={closeOverlay}>
          <span className="close-overlay" onClick={closeOverlay}>×</span>
        </div>
      )}
    </div>
  );
};

export default Home;