import React, { useState } from 'react';
import { useUser } from '../components/UserContext';
import { useSocketListenersChats } from '../hooks/chatshooks/useSocketListenersChats';
import { useChatsData } from '../hooks/chatshooks/useChatsData';

import { ChatItem } from './ChatItem';

export const Chats = ({ highlightedUsers, isBlackOverlay, setIsGroupChat }) => {
  const { setSelectedUser, friend, setFriends, setMessage, mainuser, rerender, socket, setRerender, unreadCounts, setUnreadCounts, setActuallMessageId, selectedUser,selectedFriends, setSelectedFriends } = useUser();

  const {
    isSelected, setIsSelected, fetchAndDisplayConversationMessages, DeleteFriendfromdatabase, TodisplayFriendsinChatsComponent
  } = useChatsData(mainuser, setMessage, setActuallMessageId, setFriends, setRerender, rerender, selectedFriends, selectedUser, setSelectedUser);

  useSocketListenersChats(socket, mainuser, TodisplayFriendsinChatsComponent);

  const handleSelectFriend = (chat) => {
    setIsSelected((prevIsSelected) => ({ ...prevIsSelected, [chat.friendId]: !prevIsSelected[chat.friendId] }));
  };

  const handleSelectConversation = (user) => {
    setUnreadCounts(prev => ({ ...prev, [user]: 0 }));
  };

  return (
    <div className='chats'>
      {friend ? (
        friend.map((chat) => (
          <ChatItem
            key={chat.friendId}
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
          />
        ))
      ) : null}
    </div>
  );
};

export default Chats;