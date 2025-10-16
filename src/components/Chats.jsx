import React, { useState,useEffect } from 'react';
import { useUser } from '../components/UserContext';
import { useSocketListenersChats } from '../hooks/chatshooks/useSocketListenersChats';
import { useChatsData } from '../hooks/chatshooks/useChatsData';
import { useActiveMenu } from '../hooks/chatshooks/chatseffectsHandlers.js';

import { ChatItem } from './ChatItem';

export const Chats = ({ highlightedUsers, isBlackOverlay, setIsGroupChat,friendSearched }) => {
  const { setSelectedUser, friend, setFriends, setMessage, mainuser, rerender, socket, setRerender, unreadCounts, setUnreadCounts, setActuallMessageId, selectedUser,selectedFriends, setSelectedFriends , blockedByUsers,setBlockedByUsers,blockedUsers,setBlockedUsers } = useUser();
  const [isSelected, setIsSelected] = useState({});

  const filteredFriends = Array.isArray(friend)
    ? friend.filter(chat =>
        chat.friendName?.toLowerCase().includes(friendSearched.toLowerCase()) ||
        chat.friendEmail?.toLowerCase().includes(friendSearched.toLowerCase())
      )
    : [];
  
  
  const {
    handleBlockUser,handleUnblockUser,
      DeleteFriendfromdatabase, TodisplayFriendsinChatsComponent 
  } = useChatsData(socket ,mainuser, 
    setMessage, setActuallMessageId, setFriends, 
    setRerender, rerender, selectedFriends, 
    selectedUser, setSelectedUser,setBlockedUsers, blockedUsers);

  useSocketListenersChats(socket, mainuser,TodisplayFriendsinChatsComponent,setBlockedUsers,friend);

  const { activeMenuId, toggleMenu, isMenuVisible } = useActiveMenu();


  const handleSelectConversation = (user) => {
    setUnreadCounts(prev => ({ ...prev, [user]: 0 }));
  };

  const handleSelectFriend = (chat) => {
    setIsSelected((prevIsSelected) => ({
      ...prevIsSelected,
      [chat.friendId]: !prevIsSelected[chat.friendId],
    }));
  };

  

 return (
  <div className='chats'>
    {filteredFriends.length > 0 ? (
      filteredFriends.map((chat) => (
        <ChatItem
          key={chat.friendId}
          friendId={chat.friendId}
          chat={chat}
          isBlackOverlay={isBlackOverlay}
          highlightedUsers={highlightedUsers}
          isSelected={isSelected}
          handleSelectFriend={handleSelectFriend}
          DeleteFriendfromdatabase={DeleteFriendfromdatabase}
          setSelectedUser={setSelectedUser}
          setMessage={setMessage}
          setSelectedFriends={setSelectedFriends}
          handleSelectConversation={handleSelectConversation}
          unreadCounts={unreadCounts}
          blockedUsers={blockedUsers}
          handleBlockUser={handleBlockUser}
          handleUnblockUser={handleUnblockUser}
          isMenuVisible={isMenuVisible(chat.friendId)}
          toggleMenu={toggleMenu(chat.friendId)}
          blockedByUsers={blockedByUsers}
        />
      ))
    ) : (
      <div style={{ color: '#8da4f1', padding: '20px', textAlign: 'center' }}>
        No friends found.
      </div>
    )}
  </div>
);
};

export default Chats;