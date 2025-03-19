import { useState } from 'react';
import CryptoJS from 'crypto-js';

const SECRET_PASS = "XkhZG4fW2t2W";

export const useMessageHandlers = (
  socket,
  mainuser,
  selectedUser,
  actuallmessagesId,
  setMessage
) => {
  const [triggersend, setTriggersend] = useState(false);

  const storeUnsentMessage = (text, fileURL) => {
    const unsentMessages = JSON.parse(localStorage.getItem('unsentMessages') || '[]');
    const newMessage = {
      text,
      fileURL,
      conversationId: actuallmessagesId,
      sender: mainuser[0].userId,
      timestamp: new Date().toISOString(),
      pending: true,
    };

    unsentMessages.push(newMessage);
    localStorage.setItem('unsentMessages', JSON.stringify(unsentMessages));

    setMessage((prev) => [...prev, { ...newMessage, source: 'chat' }]);
  };

  const sendStoredMessages = async () => {
    const unsentMessages = JSON.parse(localStorage.getItem('unsentMessages') || '[]');
    if (unsentMessages.length === 0) return;

    setMessage((prev) =>
      prev.map((msg) => (msg.pending ? { ...msg, pending: false } : msg))
    );

    for (const message of unsentMessages) {
      try {
        await sendMessage(message.text, message.fileURL);
      } catch (error) {
        console.error('Failed to send stored message:', error);
        return;
      }
    }

    localStorage.removeItem('unsentMessages');
  };

  const sendMessage = async (text, fileURL) => {
    if (!actuallmessagesId || !text.trim()) return;

    let messageStatus = 'sent';
    if (selectedUser && selectedUser[0]) {
      const status = selectedUser[0].status;
      const isDate = !isNaN(new Date(status));
      if (isDate || status === 'offline') {
        messageStatus = 'sent';
      } else if (status === 'online' || ['away', 'busy', 'doNotDisturb'].includes(status)) {
        messageStatus = 'delivered';
      }
    }

    const encryptedText = CryptoJS.AES.encrypt(
      JSON.stringify(text),
      SECRET_PASS
    ).toString();

    const messageToSend = {
      conversationId: actuallmessagesId,
      text: encryptedText,
      encrypted: true,
      fileURL: fileURL || null,
      sender: mainuser[0].userId,
      timestamp: new Date().toISOString(),
      status: messageStatus,
    };

    const messageToDisplay = {
      ...messageToSend,
      text: text,
      source: 'chat',
    };

    delete messageToDisplay.conversationId;

    setMessage((prev) => [...prev, messageToDisplay]);

    socket.emit('sendMessage', {
      ...messageToSend,
      receiverId: selectedUser[0].id,
    });
  };

  return {
    storeUnsentMessage,
    sendStoredMessages,
    sendMessage,
    triggersend,
    setTriggersend,
  };
};