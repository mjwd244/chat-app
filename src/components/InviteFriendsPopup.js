import React, { useState, useEffect } from 'react';
import styles from '../assets/InviteFriendsPopup.module.css'; // Create a CSS module for styling
import { useUser } from './UserContext';

const InviteFriendsPopup = ({ friend,selectedFriends,setSelectedFriends,  onClose }) => {
 

  const handleSelectFriend = (friend) => {
    if (!selectedFriends) {
      setSelectedFriends([]);
    }

    if (selectedFriends.includes(friend)) {
      setSelectedFriends(selectedFriends.filter(f => f !== friend));
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <h2>Select Friends to Invite</h2>
        <div className={styles.friendsList}>
          {friend.map(friend => (
            <div key={friend.id} className={styles.friendItem}>
              <img src={friend.photo} alt={friend.displayName} />
              <span>{friend.displayName}</span>
              <button onClick={() => handleSelectFriend(friend)}>
                {selectedFriends && selectedFriends.includes(friend) ? 'Deselect' : 'Select'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InviteFriendsPopup;