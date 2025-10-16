import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSocket, disconnectSocket } from './socket';


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
      try {
        console.log("Initializing socket for user:", mainuser[0].userId);
        const newSocket = getSocket();
  
        // Reset socketReady to false when initializing a new socket
        setSocketReady(false);
  
        // Wait for the socket to be ready
        newSocket.ready.then(() => {
          console.log('Socket is ready');
          setSocketReady(true);
          // Emit once when ready (initial)
          if (mainuser[0]?.userId) {
            console.log('Emitting userOnline (ready) for', mainuser[0].userId);
            newSocket.emit('userOnline', mainuser[0].userId);
          }
        }).catch((error) => {
          console.error('Error waiting for socket to be ready:', error);
        });
  
        // Always (re-)emit on connect/reconnect so server maps userId -> socketId
        const onConnect = () => {
          console.log('Socket connected:', newSocket.id);
          if (mainuser[0]?.userId) {
            console.log('Emitting userOnline (connect) for', mainuser[0].userId);
            console.log('About to emit userOnline for', mainuser[0]?.userId, 'on socket', newSocket.id);
            newSocket.emit('userOnline', mainuser[0].userId);
          }
        };
        const onReconnect = (attempt) => {
          console.log('Socket reconnected on attempt', attempt, 'id:', newSocket.id);
          if (mainuser[0]?.userId) {
            console.log('Emitting userOnline (reconnect) for', mainuser[0].userId);
            console.log('About to emit userOnline for', mainuser[0]?.userId, 'on socket', newSocket.id);
            newSocket.emit('userOnline', mainuser[0].userId);
          }
        };
        const onDisconnect = (reason) => {
          console.log('Socket disconnected:', reason);
        };
  
        newSocket.on('connect', onConnect);
        newSocket.on('reconnect', onReconnect);
        newSocket.on('disconnect', onDisconnect);
  
        setSocket(newSocket);
  
        // Cleanup listeners when mainuser changes or component unmounts
        return () => {
          try {
            newSocket.off('connect', onConnect);
            newSocket.off('reconnect', onReconnect);
            newSocket.off('disconnect', onDisconnect);
          } catch (e) {
            console.warn('Error cleaning up socket listeners:', e);
          }
        };
      } catch (error) {
        console.error('Error setting up socket:', error);
      }
    }
  }, [mainuser]);



    useEffect(() => {
    if (!socket || !socketReady) return;
  
    console.log('Setting up global friend request listeners');
  
    // Friend request notification listener
    socket.on('newFriendRequest', (requestData) => {
      console.log('New friend request received:', requestData);
      console.log('Current notifications before adding:', notifications);
      setNotifications(prev => {
        const newNotifications = [...prev, {
          type: 'friendRequest',
          ...requestData,
          timestamp: new Date()
        }];
        console.log('New notifications array:', newNotifications);
        return newNotifications;
      });
    });

  socket.on('friendRequestSent', (response) => {
    if (response.success) {
      setNotifications(prev => [
        ...prev,
        {
          type: 'friendRequest',
          status: 'pending',
          toUserId: response.toUserId,
          toUserName: response.toUserName,
          toUserPhoto: response.toUserPhoto,
          sentByMe: true,
          timestamp: new Date()
        }
      ]);
    }
  });


  
    // Accept/Decline response listeners
  socket.on('friendRequestAccepted', (data) => {
    if (mainuser[0]?.userId === data.toUserId) {
      // Recipient: remove notification and refresh friends
      setNotifications(prev =>
        prev.filter(notif =>
          !(notif.type === 'friendRequest' && notif.fromUserId === data.fromUserId)
        )
      );
      
    } else if (mainuser[0]?.userId === data.fromUserId) {
      // Sender: update notification and refresh friends
      setNotifications(prev =>
        prev.map(notif =>
          notif.type === 'friendRequest' &&
          notif.toUserId === data.toUserId &&
          notif.status === 'pending'
            ? { ...notif, status: 'accepted' }
            : notif
        )
      );
      
    }
  });

  
    socket.on('friendRequestDeclined', (data) => {
      console.log('Friend request declined:', data);
      // Remove from notifications when declined
      setNotifications(prev => 
        prev.filter(notif => 
          !(notif.type === 'friendRequest' && notif.fromUserId === data.fromUserId)
        )
      );

      
    });
  
    return () => {
      socket.off('newFriendRequest');
      socket.off('friendRequestAccepted');
      socket.off('friendRequestDeclined');
      socket.off('friendRequestSent');
    };
  }, [socket, socketReady]);




  
const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);
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
  const [unreadCounts, setUnreadCounts] = useState({});
  const [blockedByUsers, setBlockedByUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
   const [status, setStatus] = useState('online');
   const [firends2 , setFriends2] = useState([]); // Always an array




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
    socket,
    socketReady,
    unreadCounts,
    setUnreadCounts,
    blockedByUsers,
    setBlockedByUsers,
    blockedUsers,
    setBlockedUsers,
    status,
    setStatus,
     notifications,
  setNotifications,
  showNotifications,
  setShowNotifications,
  firends2,
  setFriends2
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