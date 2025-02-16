import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSocket, disconnectSocket } from './socket';
import { E2EEncryption } from '../utils/E2EEncryption';

const UserContext = createContext();
const ChatContext = createContext();

export const UserProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [socketReady, setSocketReady] = useState(false);
  const [mainuser, setMainUser] = useState(() => {
    const storedMainUser = localStorage.getItem('mainuser');
    if (storedMainUser) {
      try {
        const parsedUser = JSON.parse(storedMainUser);
        // Only use the stored user if it has all required fields
        if (parsedUser && parsedUser.userId && parsedUser.displayName && parsedUser.email) {
          return [parsedUser];
        }
      } catch (error) {
        console.error('Error parsing stored mainuser:', error);
      }
    }
    return []; // Initialize as an empty array if no valid user is found
  });

  useEffect(() => {
    if (mainuser.length > 0) {
      localStorage.setItem('mainuser', JSON.stringify(mainuser[0]));
      const newSocket = getSocket();
      setSocket(newSocket);
      newSocket.emit('userOnline', mainuser[0].userId);
      newSocket.on('connect', () => {
        setSocketReady(true);
      });
    } else {                  
      localStorage.removeItem('mainuser');
      disconnectSocket();
      setSocket(null);
    }

    return () => {
      disconnectSocket();
    };
  }, [mainuser]);
 
  const [friend, setFriends] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [message, setMessage] = useState([]);
  const [rerender, setRerender] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [actuallmessagesId, setActuallMessageId] = useState(null);
  const [groups, setGroups] = useState([]); 
  const [highlight, setHighlight] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [isGroupChat, setIsGroupChat] =  useState(false); 
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date()); // Add state for current time
  const [friendUserTimestampSave , setfriendUserTimestampSave ]  = useState();
  const [mainUserTimeStampSave, setmainUserTimeStampSave] = useState();
  const [unreadCounts, setUnreadCounts] = useState({});




  const seTheMainUser = async (users) => {
    if (Array.isArray(users) && users.length === 0) {
        setMainUser([]);
        return;
    }

    if (Array.isArray(users) && users.length > 0) {
        const validUsers = users.filter(user =>
            user && user.userId && user.displayName
        );

        if (validUsers.length > 0) {
            setMainUser(validUsers);
            
            // Ensure private key is available
          
        }
    }
};
  
  useEffect(() => {
    // Load user and keys from local storage on initial load
    const storedUser = JSON.parse(localStorage.getItem('mainuser'));
    if (storedUser) {
      seTheMainUser([storedUser]);
    }
  }, []);


  const userValue = {
    selectedUser,
    setSelectedUser,
    rerender,
    setRerender,
    actuallmessagesId,
    setActuallMessageId,
    message,
    setMessage,
    mainuser,
    seTheMainUser,
    friend,
    setFriends,
    groups, 
    setGroups,
    highlight,
    setHighlight,
    selectedFriends,
    setSelectedFriends, 
    groupId,
    setGroupId,
    isGroupChat,
    setIsGroupChat,
    showCreateGroup,
    setShowCreateGroup,
    currentTime,
    friendUserTimestampSave,
    setfriendUserTimestampSave,
    mainUserTimeStampSave,
    setmainUserTimeStampSave,
    socket,
    socketReady,
    unreadCounts,
    setUnreadCounts
  };

  const chatValue = {
    showAddFriend,
    setShowAddFriend,
  };

  return (
    <UserContext.Provider value={userValue}>
      <ChatContext.Provider value={chatValue}>
        {children}
      </ChatContext.Provider>
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

export const useChat = () => {
  return useContext(ChatContext);
};