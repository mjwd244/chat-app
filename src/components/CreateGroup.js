import React, { useState,  useEffect , useRef} from 'react';
import styles from '../assets/Groupchat.module.css';
import Messages from "./Messages";
import { useChat, useUser } from './UserContext';

const CreateGroup = ({ selectedFriends, onClose }) => {
  const { actuallmessagesId,setActuallMessageId, mainuser, message, setMessage, selectedUser ,groups} = useUser();

  const [messageInput, setMessageInput] = useState(''); 
  const [localMessages, setLocalMessages] = useState([]); // New state for displaying messages in the UI
  const [ws, setWs] = useState(null);
  const [messageTexts, setMessageTexts] = useState([]); 

  const messageClasses = {
    messagegroup: styles.messagegroup,
    groupmessageInfo: styles.messagegroupInfo,
    groupmessageContent: styles.messagegroupContent,
    wholecontainer: styles.messagesParent,
  }


  useEffect(() => {
      console.log(groups);
  },[groups])

  useEffect(() => {  
    
    const socket = new WebSocket('wss://616f-2a02-8071-5e71-4260-b0b6-52a5-6ef0-1d40.ngrok-free.app/ws');
    setWs(socket);
  
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };
  
    socket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      console.log('Message received from server:', receivedMessage);
      setMessage((prevMessages) => [...prevMessages, receivedMessage]);
    };
  
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    return () => {
      socket.close();
    };
  }, []);
 
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return; // Ignore empty messages

    // Display the message immediately in the UI
    const newMessage = { sender: mainuser[0].userId, text: messageInput };
  

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(newMessage));
      console.log('Message sent via WebSocket:', newMessage); // Log confirmation
    }
  
    console.log(actuallmessagesId)
    try {
      // Send the message to the backend to save in the database
      const token = localStorage.getItem('token');
      console.log(actuallmessagesId)
      const response = await fetch(`https://localhost:5000/api/auth/groups/${actuallmessagesId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: messageInput, sender: mainuser[0].userId }), // Include sender ID
      });

      if (!response.ok) {
        throw new Error('Error sending message');
      }

      // Add message to the global state after it's saved in the backend
      const data = await response.json();
      setMessage([...message, { ...data.newMessage, source: 'group' }]);
      setMessageInput(''); // Clear the input
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  useEffect(() => {
    console.log('Groups state:', groups);
    const fetchMessages = async () => {
      if (groups && Array.isArray(groups.messages)) {
        setActuallMessageId(groups.id);
  
        const fetchedMessages = groups.messages.map(message => ({
          text: message.text,
          source: 'group',
          sender: message.sender,
          timestamp  : message.timestamp
        }));
        setMessage(fetchedMessages); 

        
      } else {
        console.log("No groups available or groups.messages is not an array");
      }
    };
  
    fetchMessages();
  }, [groups]);

  useEffect(() => {
    if (messageTexts.length > 0) {
    // setMessage(messageTexts);
    }
  }, [messageTexts]);

  useEffect(() => {
    console.log('Updated message state:', message);
  }, [message]);

  return (

    <div className={styles.groupContainer}>
      
      <div className={styles.friendsJoinedContainer}>
        <h2>Friends joined the chat:</h2>
        <ul>

          {selectedUser.map((friend) => (
            <img key={friend.id} src={friend.photo} alt={friend.displayName} />
          ))}
        </ul>
      </div>

      {/* Displaying the messages */}
      <div className={styles.messageswholecontainer}>
        <Messages
          message={message}  // Combine saved and local messages for live display
          messageClasses={messageClasses}
          componentType={"group"}
        />
      </div>

      <div className={styles.inputDiv}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Enter message"
          className={styles.messageInput}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default CreateGroup;