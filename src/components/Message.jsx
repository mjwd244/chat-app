import React, { useState, useEffect, act } from 'react';
import { useUser } from '../components/UserContext';
import styles from '../Groupchat.module.css';
import CryptoJS from 'crypto-js';

const SECRET_PASS = "XkhZG4fW2t2W";
const Messages = ({ message, friendObject, messageClasses, componentType }) => {
  const { mainuser,socket, socketReady ,setMessage ,actuallmessagesId,selectedUser } = useUser();
  const [messageClass, setMessageClass] = useState();
  const [messageInfoClass, setMessageInfoClass] = useState();
  const [messageContentClass, setMessageContentClass] = useState();
  const [arraydates, setarraydates] = useState([]);
  const newArrayDates = [];
  const [showMessageMenu, setShowMessageMenu] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [effectCount, setEffectCount] = useState(0);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [pinnedMessages, setPinnedMessages] = useState(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [showReactions, setShowReactions] = useState(null);


  const MessageReaction = ({ message, onReact }) => {
    const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];
    
    return (
      <div className={styles.reactionPanel}>
        {reactions.map((emoji) => (
          <button 
            key={emoji} 
            onClick={() => onReact(message._id, emoji)}
            className={styles.reactionButton}
          >
            {emoji}
          </button>
        ))}
      </div>
    );
  };

  const MessageStatus = ({ status }) => {
    if (!status) return null;
    
    switch(status) {
        case 'sent':
            return <span className="message-status">✓</span>;  // One check
        case 'delivered':
            return <span className="message-status">✓✓</span>; // Two checks
        case 'seen':
            return <span className="message-status seen">✓✓</span>; // Blue checks
        case 'pending':
            return <span className="message-status">⏳</span>; // Pending
        default:
            return null;
    }
};


useEffect(() => {
  if (!socket || !socketReady || !messageClass) return;

  let isWindowFocused = document.hasFocus();

  const handleBlur = () => {
    isWindowFocused = false;
  };

  const handleFocus = () => {
    isWindowFocused = true;
  };

  const messageObserver = new IntersectionObserver(
    (entries) => {
      if (isWindowFocused) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const messageElement = entry.target;
            if (!messageElement.hasAttribute('data-seen')) {
              const messageId = messageElement.dataset.messageId;
              socket.emit('messageRead', {
                messageId,
                conversationId: actuallmessagesId,
                readerId: mainuser[0].userId,
                senderId: selectedUser[0].id
              });
              messageElement.setAttribute('data-seen', 'true');
              console.log('Message seen:', messageId);
            }
          }
        });
      }
    },
    { threshold: 1 }
  );

  // Start observing new messages
  const startObserving = () => {
    const messages = document.querySelectorAll(`.${messageClass}.${styles.notowner}:not([data-seen])`);
    messages.forEach(msg => messageObserver.observe(msg));
  };

  window.addEventListener('focus', handleFocus);
  window.addEventListener('blur', handleBlur);
  
  // Initial observation
  startObserving();

  // Watch for new messages
  const messageWatcher = new MutationObserver(startObserving);
  messageWatcher.observe(document.body, { childList: true, subtree: true });

  socket.on('messageStatusUpdated', ({ messageId, status }) => {
    setMessage(prevMessages =>
      prevMessages.map(msg =>
        msg._id === messageId ? { ...msg, status } : msg
      )
    );
  });

  return () => {
    window.removeEventListener('focus', handleFocus);
    window.removeEventListener('blur', handleBlur);
    messageObserver.disconnect();
    messageWatcher.disconnect();
    socket.off('messageStatusUpdated');
  };
}, [socket, socketReady, messageClass, actuallmessagesId, mainuser, selectedUser]);



  const handleReaction = (messageId, reaction) => {
    socket.emit('messageReaction', {
      messageId,
      reaction,
      userId: mainuser[0].userId,
      receiverId: friendObject[0].id,  // Add receiver ID
      conversationId: actuallmessagesId
    });
    
    setMessage(prevMessages =>
      prevMessages.map(msg =>
        msg._id === messageId
          ? {
              ...msg,
              reactions: [
                { userId: mainuser[0].userId, reaction }]
            }
          : msg
      )
    );
  };


  useEffect(() => {
    if (socketReady && socket) {
      socket.on('messageReacted', ({ messageId, reaction, userId }) => {
        setMessage(prevMessages =>
          prevMessages.map(msg =>
            msg._id === messageId
              ? {
                  ...msg,
                  reactions: [...(msg.reactions || []), { userId, reaction }]
                }
              : msg
          )
        );
      });
  
      return () => socket.off('messageReacted');
    }
  }, [socket, socketReady]);


  useEffect(() => {
    const handleClickOutside = (event) => {
        // Check if click is outside both the reaction panel AND the trigger button
        if (!event.target.closest(`.${styles.reactionPanel}`) && showReactions) {
            setShowReactions(null);
        }
    };

    document.addEventListener('mouseup', handleClickOutside);

    return () => {
        document.removeEventListener('mouseup', handleClickOutside);
    };
}, [showReactions]);

  const handleMessageOptions = (msg, event) => {
    event.preventDefault();
    console.log('Message selected:', msg);
 
    setMenuPosition({
      top: event.clientY,
      left: event.clientX
  });
    // Add conversationId to the message if it's not already there
    const messageWithConversation = {
        ...msg,
        conversationId: actuallmessagesId // from your UserContext
    };
    setSelectedMessage(messageWithConversation);
    setShowMessageMenu(true);
  };

  const handlePinMessage = (msg) => {

    setPinnedMessages(prev => {
      const newPinned = new Set(prev);
      newPinned.add(msg._id);
      return newPinned;
    });
    fetch(`http://localhost:5000/api/auth/messages/${msg._id}/pin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pinned: true
      })
    });

    setShowMessageMenu(false);
  };

  const handleUnpinMessage = (msg) => {
    setPinnedMessages(prev => {
      const newPinned = new Set(prev);
      newPinned.delete(msg._id);
      return newPinned;
    });

    fetch(`http://localhost:5000/api/auth/messages/${msg._id}/unpin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    setShowMessageMenu(false);
  };

  const handleEditMessage = (msg) => {
    setEditText(msg.text);
    setIsEditing(true);
    setSelectedMessage(msg);
    setShowMessageMenu(false);
  };

  const saveEdit = () => {
    fetch(`http://localhost:5000/api/auth/messages/${selectedMessage._id}/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: editText,
        conversationId: actuallmessagesId
      })
    })
    .then(response => response.json())
    .then(data => {
      setMessage(prevMessages => 
        prevMessages.map(msg => 
          msg._id === selectedMessage._id ? {...msg, text: editText} : msg
        )
      );
      setIsEditing(false);  // This will close the input
      setSelectedMessage(null);  // Clear selected message
    });
  };


  

  useEffect(() => {
    const handleClick = () => setShowMessageMenu(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleDeleteMessage = (type) => {
    if (!selectedMessage) return;

    console.log('Before socket emit - Selected Message:', selectedMessage);
  
    console.log('Emitting delete event with type:', type);
    console.log('Deleting message with ID:', selectedMessage._id);
    console.log('Conversation ID:', selectedMessage.conversationId);
    socket.emit('deleteMessage', {
      conversationId: selectedMessage.conversationId,
      messageId: selectedMessage._id,
      type, // 'self' or 'everyone'
      userId: mainuser[0].userId
    });

    console.log('After socket emit - Delete event sent');

    setShowMessageMenu(false);
  };

  useEffect(() => {
    setEffectCount(prev => prev + 1);
    console.log('useEffect render count:', effectCount);
    
    if (socketReady && socket) {
        console.log('Setting up messageDeleted listener, render #', effectCount);
        
        socket.on('messageDeleted', ({ messageId, type }) => {
            console.log('MessageDeleted event received, render #', effectCount);
            
            setMessage(prevMessages => {
                console.log('Previous messages, render #', effectCount);
                const filtered = prevMessages.filter(msg => {
                    if (type === 'everyone') {
                        return msg._id !== messageId;
                    }
                    if (type === 'self' && mainuser[0].userId === msg.sender) {
                        return msg._id !== messageId;
                    }
                    return true;
                });
                console.log('Filtered messages, render #', effectCount);
                return filtered;
            });
        });

        return () => socket.off('messageDeleted');
    }
}, [socket, socketReady] );

  useEffect(() => {
    if (componentType === 'chat') {
      setMessageClass(messageClasses.message);
      setMessageInfoClass(messageClasses.messageInfo);
      setMessageContentClass(messageClasses.messageContent);
    } else if (componentType === 'group') {
      setMessageClass(messageClasses.messagegroup);
      setMessageInfoClass(messageClasses.groupmessageInfo);
      setMessageContentClass(messageClasses.groupmessageContent);
    }
  }, [componentType, messageClasses]);

  useEffect(() => {
    if (!Array.isArray(message) || message.length === 0) {
      console.log("No messages available.");
      return;
    }
    console.log(message);
    const dates = comparemessagedates();
    setarraydates(dates);
  }, [message]);

  

  function formatTimestampToDate1(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const monthNumber = date.getMonth() + 1;
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const dayName = date.toLocaleString('default', { weekday: 'long' });
    return { day, monthNumber, year, monthName, dayName };
  }

  function formatTimestampToDate() {
    const date = new Date();
    const day = date.getDate();
    const monthNumber = date.getMonth() + 1;
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const dayName = date.toLocaleString('default', { weekday: 'long' });
    return { day, monthNumber, year, monthName, dayName };
  }

  const produceptagsbycomparingdates = (messages) => {
    let messagedate = formatTimestampToDate1(messages);
    let currentdate = formatTimestampToDate();
    let dateTag = null;

    if (messagedate.year !== currentdate.year) {
      dateTag = `${messagedate.day},  ${messagedate.monthName}, ${messagedate.year}`;
    } else if (messagedate.monthNumber !== currentdate.monthNumber) {
      dateTag = `${messagedate.day}, ${messagedate.monthName}, ${messagedate.year}`;
    } else if (messagedate.day !== currentdate.day) {
      if (messagedate.day === currentdate.day - 1) {
        dateTag = 'Yesterday';
      } else if (messagedate.day === currentdate.day - 2) {
        dateTag = messagedate.dayName;
      } else if (messagedate.day === currentdate.day - 3) {
        dateTag = messagedate.dayName;
      } else if (messagedate.day === currentdate.day - 4) {
        dateTag = messagedate.dayName;
      } else if (messagedate.day === currentdate.day - 5) {
        dateTag = messagedate.dayName;
      } else if (messagedate.day === currentdate.day - 6) {
        dateTag = messagedate.dayName;
      } else {
        dateTag = `${messagedate.day}, ${messagedate.monthNumber},  ${messagedate.year}`;
      }
    } else if (messagedate.day === currentdate.day) {
      dateTag = 'Today';
    }
    return dateTag;
  };

  const comparemessagedates = () => {
    let counter = message.length;
    console.log("counter " + counter);

    for (let i = 1; i <= counter; i++) {
      newArrayDates.push(produceptagsbycomparingdates(message[counter - i].timestamp));
    }
    console.log("newArrayDates " + newArrayDates);
    return newArrayDates;
  };

  function formatTimestampToTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const renderFile = (fileURL) => {
    const fileExtension = fileURL.split('.').pop().toLowerCase();
    const filename = fileURL.split('/').pop();
  
    const handleDownload = () => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `http://localhost:5000/uploads/${filename}`, true);
      xhr.responseType = 'blob';
  
      xhr.onload = function() {
        if (this.status === 200) {
          // Read the response as a blob
          const encryptedBlob = this.response;
  
          const reader = new FileReader();
          reader.onload = function(event) {
            const encryptedData = event.target.result; // Read the encrypted data
  
            // Decrypt the file data
            const decryptedData = CryptoJS.AES.decrypt(encryptedData, SECRET_PASS).toString(CryptoJS.enc.Utf8);
  
            // Create a Blob from the decrypted data
            const decryptedBlob = new Blob([decryptedData], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(decryptedBlob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename; // Use the original filename
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          };
  
          reader.readAsText(encryptedBlob); // Read the blob as text for decryption
        } else {
          console.error('Error downloading file:', this.statusText);
        }
      };
  
      xhr.onerror = function() {
        console.error('Request failed with status:', this.status);
      };
  
      xhr.send();
    };
  
    // Existing render conditions for different file types
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return (
        <div>
          <img src={fileURL} alt="file" />
          <button onClick={handleDownload}>Download Image</button>
        </div>
      );
    } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(fileExtension)) {
      return <button onClick={handleDownload}>Download Document</button>;
    } else if (['mp3', 'wav'].includes(fileExtension)) {
      return (
        <div>
          <audio controls src={fileURL} />
          <button onClick={handleDownload}>Download Audio</button>
        </div>
      );
    } else if (['mp4'].includes(fileExtension)) {
      return (
        <div>
          <video controls src={fileURL} />
          <button onClick={handleDownload}>Download Video</button>
        </div>
      );
    } else {
      return <button onClick={handleDownload}>Download File</button>;
    }
  };


  useEffect(() => {
    if (!socketReady || !socket) return;

    socket.on('receiveMessage', (newMessage) => {
      let decryptedText;

      if (newMessage.encrypted) {
        // Decrypt the received message
        const bytes = CryptoJS.AES.decrypt(newMessage.text, SECRET_PASS);
        decryptedText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        
        // Create message object with decrypted text
        const messageToDisplay = {
          ...newMessage,
          text: decryptedText,
          encrypted: false,
          source: 'chat'
        };
        
        setMessage(prev => [...prev, messageToDisplay]);

        // Display notification and play sound
        if (Notification.permission === 'granted') {
          showNotification(newMessage.sender, decryptedText);
          playSound();
        }
      } else {
        decryptedText = newMessage.text;
        setMessage(prev => [...prev, { ...newMessage, source: 'chat' }]);

        // Display notification and play sound
        if (Notification.permission === 'granted') {
          showNotification(newMessage.sender, newMessage.text);
          playSound();
        }
      }
    });

    return () => socket.off('receiveMessage');
  }, [socket, socketReady]);



  const showNotification = (sender, message) => {
    const notification = new Notification(`${sender} sent you a message`, {
      body: message,
      icon: '/path/to/icon.png', // Optional: provide an icon
    });

    notification.onclick = () => {
      // Focus the chat application or redirect
      window.focus(); // or implement specific redirection
    };
  };

  const playSound = () => {
    const audio = new Audio('/sounds/messagesound.wav');
    audio.play();
  };




  return (
    <>
      {Array.isArray(message) && message.length > 0 && componentType === "chat" && (
        Array.isArray(friendObject) && friendObject.length > 0 ? (
          message.filter((msg) => msg.source === componentType)
          .filter((msg) => !msg.deletedFor?.includes(mainuser[0].userId))
          .map((msg, index) => {
            const friend = friendObject.find((friend) => friend.id === msg.sender);
            const isFriend = !!friend;
            const photoURL = isFriend ? friend.photo : mainuser[0].photoURL;

            const currentDateTag = arraydates[message.length - (index + 1)];
            const previousDateTag = index > 0 ? arraydates[message.length - index] : null;

            return (
              <div key={index}>
                {currentDateTag && currentDateTag !== previousDateTag && (
                  <div className="startconversationTitel">
                    <p>{currentDateTag}</p>
                  </div>
                )}
                <div
                    className={`${messageClass} ${msg.sender === mainuser[0].userId ? styles.owner : styles.notowner} ${pinnedMessages.has(msg._id) ? 'pinned-message' : ''} ${msg.pending ? 'pending-message' : ''} `}
                  onContextMenu={(e) => handleMessageOptions(msg, e)}
                  data-message-id={msg._id}
                >

                  {msg.pending && <span className="pending-indicator">⏳</span>}
                  
                   {showMessageMenu && selectedMessage?._id === msg._id && (
                      <div className="messageMenu"
                      style={{ 
                        position: 'fixed',
                        top: menuPosition.top,
                        left: menuPosition.left
                    }}
                      >
                        {!pinnedMessages.has(msg._id) ? (
                          <button onClick={() => handlePinMessage(selectedMessage)}>
                            Pin Message
                          </button>
                        ) : (
                          <button onClick={() => handleUnpinMessage(selectedMessage)}>
                            Unpin Message
                          </button>
                        )}
                        <button onClick={() => handleDeleteMessage('self')}>
                          Delete for me
                        </button>
                        {msg.sender === mainuser[0].userId && (
                          <button onClick={() => handleDeleteMessage('everyone')}>
                            Delete for everyone
                          </button>
                        )}
                        <button onClick={() => handleEditMessage(selectedMessage)}>
                          Edit
                        </button>

                        <button 
                       className={styles.reactionTrigger}
                       onClick={() => setShowReactions(showReactions === msg._id ? null : msg._id)}
                    >
                      😀
                    </button>
                      </div>
                    )}

                        {isEditing && selectedMessage._id === msg._id && (
                          <div className={messageContentClass}>
                            <input 
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                            />
                            <button onClick={saveEdit}>Save</button>
                          </div>
                        ) }

                  <div className={messageInfoClass}>
                    <img src={photoURL} alt="" />
                    <p>{formatTimestampToTime(msg.timestamp)}</p>
                  </div>
                  <div className={messageContentClass}>
                    <p className={styles.text}>{msg.text}</p>

                    {msg.sender === mainuser[0].userId && (
                      <MessageStatus status={msg.status} />
                    )}

                    {showReactions === msg._id && (
                      <MessageReaction 
                       message={msg} 
                        onReact={handleReaction}
                      />
                    )}

                    {msg.reactions && msg.reactions.length > 0 && (
                        <div className={styles.reactionsList}>
                          {msg.reactions.map((reaction, index) => (
                            <span key={index} className={styles.reaction}>
                              {reaction.reaction}
                            </span>
                          ))}
                        </div>
                    )} 

                    {msg.fileURL && (
                      <div className={styles.file}>
                        {renderFile(msg.fileURL)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={messageContentClass}>
            <p>No messages to display</p>
          </div>
        )
      )}

      {Array.isArray(message) && message.length > 0 && componentType === "group" && (
        message.filter((msg) => msg.source === componentType)
        .filter((msg) => !msg.deletedFor?.includes(mainuser[0].userId))
        .map((msg, index) => {
          return (
            <div key={index}>
              <div
                className={`${messageClass} ${msg.sender.id === mainuser[0].userId ? styles.owner : styles.notowner
                  }`}
              >
                <div className={messageInfoClass}>
                  <img src={msg.sender.id === mainuser[0].userId ? mainuser[0].photoURL : msg.sender.photo} alt="" />
                  <p>{formatTimestampToTime(msg.timestamp)}</p>
                </div>
                <div className={messageContentClass}>
                  <p className={styles.text}>{msg.text}</p>
                  {msg.fileURL && (
                    <div className={styles.file}>
                      {renderFile(msg.fileURL)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </>
  );
};

export default Messages;  