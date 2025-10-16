import { useEffect,useRef } from 'react';
import CryptoJS from 'crypto-js';
import { playSound } from '../../utils/messageutils/notificationUtils';
import {  useUser } from '../../components/UserContext';


const SECRET_PASS = "XkhZG4fW2t2W";

export const chatSocketListeners = ({
  socket,
  socketReady,
  mainuser,
  selectedUser,
  actuallmessagesId,
  setMessage,
  message,  
  setUnreadCounts,
  setBlockedUsers,
  setBlockedByUsers,
  setNotifications
}) => {

  
  const blockedUsersRequestedRef = useRef(false);


  const socketConnectedRef = useRef(false);

  useEffect(() => {
    if (!socket || !socketReady) return;

    socket.on('connect', () => {
      console.log('Socket connected!');
      socketConnectedRef.current = true;
      
      // Request blocked users list whenever socket connects if user is logged in
      if (mainuser && mainuser[0]) {
        console.log('Requesting blocked users list after socket connection');
        socket.emit('getBlockedByUsersList', {
          userId: mainuser[0].userId
        });
      }
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected!');
      socketConnectedRef.current = false;
    });

    // Listen for user status updates
    socket.on('updateUserStatus', ({ userId, isOnline }) => {
      if (isOnline) {
        const messagesToUpdate = message.filter(
          (msg) => msg.status === 'sent' && msg.sender === mainuser[0].userId
        );

        messagesToUpdate.forEach((msg) => {
          socket.emit('updateMessageStatus', {
            conversationId: actuallmessagesId,
            timestamp: msg.timestamp,
            sender: msg.sender,
            newStatus: 'delivered',
          });
        });

        setMessage((prevMessages) =>
          prevMessages.map((msg) =>
            msg.sender === mainuser[0].userId && msg.status === 'sent'
              ? { ...msg, status: 'delivered' }
              : msg
          )
        );
      }
    });

    // Listen for new unread messages
    socket.on('newUnreadMessage', (data) => {
      console.log('Received newUnreadMessage event:', data);
      if (data.receiverId === mainuser[0].userId) {
        const isCurrentChat = selectedUser && selectedUser[0] && selectedUser[0].id === data.senderId;
        if (!isCurrentChat) {
          playSound();
          setUnreadCounts((prev) => ({
            ...prev,
            [data.senderId]: (prev[data.senderId] || 0) + 1,
          }));
        }
      }
    });

    // Listen for new messages
    socket.on('receiveMessage', (newMessage) => {
      const isRelevantMessage =
        newMessage.conversationId === actuallmessagesId &&
        (
          (selectedUser && selectedUser[0] && newMessage.sender === selectedUser[0].id) ||
          newMessage.receiverId === mainuser[0].userId
        );
    
    

      if (isRelevantMessage) {
        if (newMessage.encrypted) {
          const bytes = CryptoJS.AES.decrypt(newMessage.text, SECRET_PASS);
          const decryptedText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

          const messageToDisplay = {
            ...newMessage,
            text: decryptedText,
            encrypted: false,
            source: 'chat',
          };

          delete messageToDisplay.conversationId;

          setMessage((prev) => {
            const messageExists = prev.some(
              (msg) =>
                msg.timestamp === newMessage.timestamp &&
                msg.sender === newMessage.sender
            );
            if (messageExists) return prev;
            return [...prev, messageToDisplay];
          });
        } else {
          const messageToDisplay = {
            ...newMessage,
            source: 'chat',
          };

          delete messageToDisplay.conversationId;

          setMessage((prev) => {
            const messageExists = prev.some(
              (msg) =>
                msg.timestamp === newMessage.timestamp &&
                msg.sender === newMessage.sender
            );
            if (messageExists) return prev;
            return [...prev, { ...newMessage, source: 'chat' }];
          });
        }
      }
    });

    socket.on('youHaveBeenBlocked', (data) => {
      
      const { blockerId } = data;
      
      // Add this user to your blockedByUsers array
      setBlockedByUsers(prev => {
        if (!prev.includes(blockerId)) {
          return [...prev, blockerId];
        }
        return prev;
      });
    });

    socket.on('youHaveBeenUnblocked', (data) => {
     
      const { unblockerId } = data;
      
      // Remove from blockedByUsers array
      setBlockedByUsers(prev => prev.filter(id => id !== unblockerId));
    });

   

    socket.on('blockedByUsersList', (data) => {
      console.log('Raw received data:', data);
      
      // Set both arrays in one event
      if (data.blockedByIds && Array.isArray(data.blockedByIds)) {
        console.log('Setting blockedByUsers to:', data.blockedByIds);
        setBlockedByUsers(data.blockedByIds);
      }
      
     if (data.blockedIds && Array.isArray(data.blockedIds)) {
        console.log('Setting blockedUsers to:', data.blockedIds);
        setBlockedUsers(data.blockedIds);
      }
    });


    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('updateUserStatus');
      socket.off('newUnreadMessage');
      socket.off('receiveMessage');
      socket.off('youHaveBeenBlocked');   
      socket.off('youHaveBeenUnblocked');
      socket.off('blockedByUsersList');   
    };
  }, [socket, socketReady, mainuser, selectedUser, actuallmessagesId, message]);


  useEffect(() => {
    if (!socket || !socketReady || !mainuser || !mainuser[0]) return;
    
    console.log('Emitting getBlockedByUsersList');
    socket.emit('getBlockedByUsersList', {
      userId: mainuser[0].userId
    });

    // Add immediate console log of current state
    
}, [socket, socketReady, mainuser]);








};