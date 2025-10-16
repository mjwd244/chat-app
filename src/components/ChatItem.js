import React, { useEffect, useState } from 'react';
import { getStatusMessage } from '../utils/chatsutils/getStatusMessage'; // Import the utility function
import { useClickOutside } from '../hooks/chatshooks/chatseffectsHandlers.js';

export const ChatItem = ({
  chat,
  isBlackOverlay,
  highlightedUsers,
  isSelected,
  handleSelectFriend,
  DeleteFriendfromdatabase,
  setSelectedUser,
  setMessage,
  setSelectedFriends,
  handleSelectConversation,
  unreadCounts,
  blockedUsers,
  handleBlockUser,
  handleUnblockUser,
  isMenuVisible,
  toggleMenu,
  blockedByUsers
}) => {

  useEffect(() => {
    console.log('ChatItem useEffect triggered');
    console.log('Current blockedByUsers:', blockedByUsers);
    console.log('Current chat.friendId:', chat.friendId);
    
    if (blockedByUsers && chat.friendId) {
      const isBlocked = blockedByUsers.includes(chat.friendId);
      console.log(`Is ${chat.friendName} blocked:`, isBlocked);
    }
  }, [blockedByUsers, chat.friendId]);
 

  const haveBlockedUser = blockedUsers && blockedUsers.includes(chat.friendId);
  const isBlockedByUser = blockedByUsers && blockedByUsers.includes(chat.friendId);
 
  // Helper function to handle click events
  const handleClick = (e) => {
    const element = e.currentTarget;
    if (element.classList.contains('highlight')) {
      DeleteFriendfromdatabase(chat.friendId);
    } else {
      setSelectedUser([{
        id: chat.friendId,
        displayName: chat.friendName,
        photo: chat.photo,
        status: chat.status,
        publicKey: chat.publicKey
      }]);
      handleSelectFriend(chat);
      setMessage([]);
      setSelectedFriends(prevToggle => !prevToggle);
      handleSelectConversation(chat.friendId);
    }
  };
 

 

  // Helper function to render the user chat info
  const renderUserChatInfo = () => (
    <div className="userChatInfo">

     


      
    </div>
  );

  return (
    <div
      className={`userChat ${isBlackOverlay && highlightedUsers.includes(chat.friendId) ? 'highlight' : ''}`}
      key={chat.friendId}
      onClick={handleClick}
    >
      <div className='userChatInfoandImg'>
    <div className='userChatImgcolumn'>
      {isBlockedByUser && (
      <span className="block-tag blocked-by-tag">Blocked You</span>
      )}
      {haveBlockedUser && (
        <span className="block-tag blocking-tag">Blocked</span>
      )}
       <img src={chat.photo} alt="" />
    </div>

    <div className='userChatInfocolumn'>
        <span>{chat.friendName}</span>
       
        <span>{getStatusMessage(chat.status)}</span>
        {isSelected[chat.friendId] && <span>Selected</span>}
    </div>

    </div>
     
      
      <div className='extraoptionscolumn'>

        <div className='absentmessagecontainer'>
        {unreadCounts && chat.friendId && unreadCounts[chat.friendId] > 0 && (
          <button className="unread-badge">
            {unreadCounts[chat.friendId]}
            {console.log('Rendering badge for', chat.friendId, 'count:', unreadCounts[chat.friendId])}
          </button>
        )}
    
        </div>

      <div className='threedotsrow'>

      <button className="menu-button" onClick={toggleMenu}>
        …
      </button>
   
      {isMenuVisible && (
        <div className="menu-options">
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              if (haveBlockedUser) {
                handleUnblockUser(chat.friendId);
              } else {
                handleBlockUser(chat.friendId);
              }
              toggleMenu(); 
            }}
          >
            {haveBlockedUser ? 'Unblock User' : 'Block User'}
          </button> 
        </div>
      )}
      
        </div>
          
        </div>
      
  
    </div>
  );
};
