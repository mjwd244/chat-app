import { useState, useEffect, useCallback } from 'react';
import CryptoJS from 'crypto-js';

const SECRET_PASS = "XkhZG4fW2t2W";

export const useChatsData = (mainuser, setMessage, setActuallMessageId, setFriends, setRerender, rerender, selectedFriends, selectedUser, setSelectedUser) => {
 

  

  const fetchAndDisplayConversationMessages = async (userId) => {
    console.log('Fetching messages for user:', userId); // Debugging
    try {
      const response = await fetch(`http://localhost:5000/api/auth/conversations/${mainuser[0].userId}/${userId[0].id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched conversation data:', data); // Debugging
      setActuallMessageId(data.conversationId);

      const decryptedMessages = data.messages.map(message => {
        if (message.encrypted === true) {
          try {
            const decryptedBytes = CryptoJS.AES.decrypt(message.text, SECRET_PASS);
            const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
            return {
              ...message,
              text: JSON.parse(decryptedText),
              encrypted: false,
              source: 'chat'
            };
          } catch (error) {
            console.log('Decryption failed for message:', message);
            return message;
          }
        }
        return { ...message, source: 'chat' };
      });

      setMessage(decryptedMessages);
    } catch (error) {
      console.error(`Error fetching messages: ${error}`);
      setActuallMessageId(null);
    }
  };

  // Add useEffect for selectedFriends
  useEffect(() => {
    if (selectedFriends) {
      fetchAndDisplayConversationMessages(selectedUser);
    } else {
      setSelectedUser([]);
    }
  }, [selectedFriends]);

  const DeleteFriendfromdatabase = async (friendId) => {
    try {
      await fetch(`http://localhost:5000/api/auth/friends/${mainuser[0].userId}/${friendId}`, { method: 'DELETE' });
      console.log(`Friend with ID ${friendId} deleted successfully`);
      setRerender(rerender + 1);
    } catch (error) {
      console.error(`Error deleting friend: ${error}`);
    }
  };

  const TodisplayFriendsinChatsComponent = useCallback((userId) => {
    // Logic to fetch and display friends
    fetch(`http://localhost:5000/api/auth/friends/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.friends) {
          setFriends(data.friends);
        }
      })
      .catch((error) => {
        console.error('Error fetching friends:', error);
      });
  }, [setFriends]);


  useEffect(() => {
    if (mainuser && mainuser[0] && mainuser[0].userId) {
      TodisplayFriendsinChatsComponent(mainuser[0].userId);
    }
  }, [rerender, mainuser]);

  return {
    fetchAndDisplayConversationMessages,
    DeleteFriendfromdatabase,
    TodisplayFriendsinChatsComponent,
  };
};
