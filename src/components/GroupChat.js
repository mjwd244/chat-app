import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import styles from '../assets/Groupchat.module.css';
import CreateGroup from './CreateGroup';
import InviteFriendsPopup from './InviteFriendsPopup'; // Import the new component

const GroupChat = () => {
 
   const {setIsGroupChat, isGroupChat,selectedFriends, setSelectedFriends, setActuallMessageId, friend,showCreateGroup,setShowCreateGroup,message} = useUser();
  
  
  const [showInvitePopup, setShowInvitePopup] = useState(false);
 
  console.log(message);

  const handleCloseCreateGroup = () => {
    setShowCreateGroup(false);
  };

  const onClose = () => {
    console.log('Closing group chat');
    setIsGroupChat(false);
  };

  const handleCloseInvitePopup = () => {
    setShowInvitePopup(false);
  };

  const addFriends = (event) =>{
    event.preventDefault(); // Prevent form submission
    setShowInvitePopup(true)
  }

  const handleGroupCreation = async (event) => {
    event.preventDefault(); // Prevent form submission
    if(!selectedFriends){
      alert("Please select friends to add to the group");
      return;
    }
    event.preventDefault();

    const groupName = event.target.elements.groupName.value;
    if (!groupName) {
      alert("Please enter a group name");
      return;
    }
    const userIds = selectedFriends.map(friend => friend.friendId); 
    const payload = {
      groupName,
      userIds,
    };
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/auth/create-group', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        console.log('Group created successfully!');
        setActuallMessageId(result.group._id); 
        setShowCreateGroup(true);
      } else {
        console.log('Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  useEffect(() =>{
    console.log(selectedFriends)
  }, [selectedFriends])

  return (
    <div className={styles.container}>
      <div className={styles.closebuttonHolder}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
      </div>
      {!showCreateGroup && (
        <form onSubmit={handleGroupCreation} className={styles.startdiv}>
          <h2>Please select the friends you want to add to the group chat</h2>

          <button className={styles.buttonaddgroupParticipants} onClick={addFriends}>+</button>

          <input
            type="text"
            name="groupName"
            placeholder="Enter group name"
            className={styles.groupNameInput}
          />

          <div>
            {selectedFriends && selectedFriends.map((friend) => (
              <img key={friend.id} src={friend.photo} alt={friend.displayName} />
            ))}
          </div>

          <div className={styles.bottomdiv}>
            <button type="submit" className={styles.creategroup}>
              Create Group
            </button>
          </div>
        </form>
      )}

      {showInvitePopup && (
        <InviteFriendsPopup
          friend={friend}
          selectedFriends={selectedFriends}
          setSelectedFriends={setSelectedFriends}
          onClose={handleCloseInvitePopup}
        />
      )}

      {showCreateGroup && <CreateGroup selectedFriends={selectedFriends} onClose={handleCloseCreateGroup} />}
    </div>
  );
};

export default GroupChat;