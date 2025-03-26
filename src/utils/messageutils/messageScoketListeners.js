import { showNotification, playSound } from './notificationUtils';

export const messageScoketListeners = (socketReady , socket, setMessage, mainuser, selectedUser, actuallmessagesId) => {
  if (!socket || !socketReady) return;
  
    socket.on('messageStatusUpdated', ({ messageId, status }) => {
      setMessage((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, status } : msg
        )
      );
    });
  
    socket.on('messageReacted', ({ messageId, reaction, userId }) => {
      setMessage((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId
            ? { ...msg, reactions: [{ userId, reaction }] }
            : msg
        )
      );
    });
  
    socket.on('messageDeleted', ({ messageId, type }) => {
      setMessage((prevMessages) =>
        prevMessages.filter((msg) => {
          if (type === 'everyone') {
            return msg._id !== messageId;
          }
          if (type === 'self' && mainuser[0].userId === msg.sender) {
            return msg._id !== messageId;
          }
          return true;
        })
      );
    });
  
    socket.on('receiveMessage', (newMessage) => {
      let decryptedText;
  
      if (newMessage.encrypted) {
        const bytes = CryptoJS.AES.decrypt(newMessage.text, SECRET_PASS);
        decryptedText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  
        const messageToDisplay = {
          ...newMessage,
          text: decryptedText,
          encrypted: false,
          source: 'chat',
        };
  
        setMessage((prev) => [...prev, messageToDisplay]);
  
        if (Notification.permission === 'granted') {
          showNotification(newMessage.sender, decryptedText);
          playSound();
        }
      } else {
        setMessage((prev) => [...prev, { ...newMessage, source: 'chat' }]);
  
        if (Notification.permission === 'granted') {
          showNotification(newMessage.sender, newMessage.text);
          playSound();
        }
      }
    });
  
    return () => {
      socket.off('messageStatusUpdated');
      socket.off('messageReacted');
      socket.off('messageDeleted');
      socket.off('receiveMessage');
    };
  };