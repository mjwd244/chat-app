import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../components/UserContext';
import UserDetailsCss from '../UserDetails.module.css';


export const createConversation = async (mainuser,userId) => {
  if (mainuser.length === 0) {
    console.error("Main user not found");
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/api/auth/conversations', {
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
  const { mainuser, rerender, setRerender } = useUser();
console.log(mainuser)
  // Functions

  const getUserByUserId = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/users/${userId}`);
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
      const response = await axios.post(`http://localhost:5000/api/auth/users/${mainuser[0].userId}/friends`, {
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
    </div>
  );
};

export default UserDetails;