import { useEffect } from 'react';
import CryptoJS from 'crypto-js';

const SECRET_PASS = "XkhZG4fW2t2W";

export const useSocketListeners = ({
  socket,
  socketReady,
  mainuser,
  selectedUser,
  actuallmessagesId,
  setMessage,
  message,  
  setUnreadCounts,

}) => {
  useEffect(() => {
    if (!socket || !socketReady) return;

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
        (newMessage.sender === selectedUser[0].id ||
          newMessage.receiverId === mainuser[0].userId);

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

    return () => {
      socket.off('updateUserStatus');
      socket.off('newUnreadMessage');
      socket.off('receiveMessage');
    };
  }, [socket, socketReady, mainuser, selectedUser, actuallmessagesId, message]);
};