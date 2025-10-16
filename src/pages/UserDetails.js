import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../components/UserContext';
import UserDetailsCss from '../assets/UserDetails.module.css';


export const createConversation = async (mainuser,userId) => {
  if (mainuser.length === 0) {
    console.error("Main user not found");
    return;
  } 

  try {
    const response = await axios.post('https://localhost:5000/api/auth/conversations', {
      userId1: mainuser[0].userId,
      userId2: userId,
    });

    if (response.data.newConversation) {
      console.log("Conversation created successfully");
    } else {
      console.log("Conversation already exists");
    }
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error creating conversation:", error);
    return null; // Return null in case of an error
  }
};

const UserDetails = ({ userId, onClose }) => {
  // Constants
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const { mainuser, rerender, setRerender ,socket,socketReady} = useUser();
console.log(mainuser)
  // Functions

  const getUserByUserId = async (userId) => {
    try {
      const response = await axios.get(`https://localhost:5000/api/auth/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        await getUserByUserId(userId);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false); // Set loading state to false when done
      }
    };
    getUser();
  }, [userId]);

  const addToFriendList = async () => { 
    if (mainuser.length === 0) {
      console.error("Main user not found");
      return;
    }

    console.log("HERE YOUR PUBLICK KEY", JSON.stringify(user.publicKey, null, 2));
  

    try {
      const response = await axios.post(`https://localhost:5000/api/auth/users/${mainuser[0].userId}/friends`, {
        friendId: userId,
        friendName: user.displayName,
        photo: user.photoURL,
        publicKey: user.publicKey,
      });

      if (response.data.success) {
        console.log("Friend added successfully");
        setRerender(rerender + 1);
      } else {
        console.error("Error adding friend:", response.data.message);
      }
    } catch (error) {
      console.error(`Error adding friend: ${error}`);
    }
  };

useEffect(() => {
  if (!socket) {
    console.log("No socket instance available");
    return;
  }

  const checkConnection = () => {
    console.log("Checking socket connection...", {
      socketId: socket.id,
      connected: socket.connected,
      ready: socketReady
    });

    if (!socket.connected) {
      console.log("Socket not connected, attempting to connect...");
      socket.connect();
    }
  };

  checkConnection();

  socket.on('connect', () => {
    console.log('Socket connected with ID:', socket.id);
    // Wait a short moment to ensure everything is ready
    setTimeout(() => {
      if (socket.connected) {
        console.log("Socket is fully ready");
      }
    }, 500);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected!');
  });

  // Check connection status every few seconds
  const intervalId = setInterval(checkConnection, 3000);

  return () => {
    clearInterval(intervalId);
    socket.off('connect');
    socket.off('disconnect');
  };
}, [socket, socketReady]);

const sendFriendRequest = async () => {
  try {
    console.log('=== FRIEND REQUEST DEBUG START ===');
    console.log('Socket status:', {
      exists: !!socket,
      connected: socket?.connected,
      id: socket?.id,
      ready: socketReady
    });
    
    console.log('Main user:', mainuser);
    console.log('Target user ID:', userId);
    
    // Basic validation
    if (!socket) {
      throw new Error('Socket not available');
    }
    
    if (!socket.connected) {
      console.error('Socket is not connected. Current state:', socket.connected);
      throw new Error('Socket not connected');
    }
    
    if (!mainuser || mainuser.length === 0) {
      console.error('Main user validation failed:', mainuser);
      throw new Error('Main user not found');
    }

    const requestData = {
      fromUserId: mainuser[0].userId,
      fromUserName: mainuser[0].displayName,
      fromUserPhoto: mainuser[0].photoURL,
      toUserId: userId
    };

    console.log("Request data to send:", requestData);
    
    // Add a temporary listener to see if we get ANY response
    const tempListener = (data) => {
      console.log('Received ANY socket event:', data);
    };
    
    // Listen for any events temporarily
    socket.onAny(tempListener);
    
    // Emit the friend request
    console.log("Emitting 'sendFriendRequest' event...");
    socket.emit('sendFriendRequest', requestData);
    console.log("Event emitted successfully");
    
    // Clean up temp listener after 3 seconds
    setTimeout(() => {
      socket.offAny(tempListener);
      console.log('Temp listener removed');
    }, 3000);
    
    console.log('=== FRIEND REQUEST DEBUG END ===');

  } catch (error) {
    console.error('=== FRIEND REQUEST ERROR ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    alert('Failed to send friend request: ' + error.message);
  }
};

  useEffect(() => {
  if (!socket || !socketReady) return;

  socket.on('friendRequestSent', (response) => {
    if (response.success) {
      alert(response.message);
    }
  });

  socket.on('friendRequestError', (error) => {
    alert(error.message);
  });

  return () => {
    socket.off('friendRequestSent');
    socket.off('friendRequestError');
  };
}, [socket, socketReady]);








  if (loading) {
    return <div>Loading...</div>; // Return loading indicator
  }

  if (!user || !user.displayName) {
    return <div>User not found</div>; // Return error message if user data is not available
  }

  return (
    <div className={UserDetailsCss.userdetailscontainer}>
      <button onClick={onClose}>x</button>
      <img src={user.photoURL} alt="" className={UserDetailsCss.userphoto} />
      <h2 className={UserDetailsCss.username}>{user.displayName}</h2>
      <p className={UserDetailsCss.useremail}>{user.email}</p>
      <button className={UserDetailsCss.addfriendbutton} onClick={addToFriendList}>Add Friend</button>
       <button 
        className={UserDetailsCss.addfriendbutton} 
        onClick={sendFriendRequest}
      >
        Send Friend Request
      </button>
    </div>
  );
};

export default UserDetails;