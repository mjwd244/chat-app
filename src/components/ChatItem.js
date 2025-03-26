import React, { useEffect } from 'react';
import { getStatusMessage } from '../utils/chatsutils/getStatusMessage'; // Import the utility function

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
  unreadCounts
}) => {
  
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
 

  useEffect(() => {
    console.log('ChatItem Props:', {
      chat,
      isSelected,
      unreadCounts,
      highlightedUsers,
      isBlackOverlay,
    });
  }, [chat, isSelected, unreadCounts, highlightedUsers, isBlackOverlay]);

  useEffect(() => {
    console.log('ChatItem Props:', { chat, isSelected, unreadCounts });
  }, [chat, isSelected, unreadCounts]);


  // Helper function to render the user chat info
  const renderUserChatInfo = () => (
    <div className="userChatInfo">
      <div className='userChatInfocolumn'>
        <span>{chat.friendName}</span>
        <img src={chat.photo} alt="" />
        <span>{getStatusMessage(chat.status)}</span>
        {isSelected[chat.friendId] && <span>Selected</span>}
      </div>
      <div className='userChatInforow'>
        {unreadCounts && chat.friendId && unreadCounts[chat.friendId] > 0 && (
          <div className="unread-badge">
            {unreadCounts[chat.friendId]}
            {console.log('Rendering badge for', chat.friendId, 'count:', unreadCounts[chat.friendId])}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`userChat ${isBlackOverlay && highlightedUsers.includes(chat.friendId) ? 'highlight' : ''}`}
      key={chat.friendId}
      onClick={handleClick}
    >
      {renderUserChatInfo()}
    </div>
  );
};