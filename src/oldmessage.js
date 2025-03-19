import React, { useState, useEffect, act } from 'react';
import { useUser } from '../components/UserContext';
import styles from '../Groupchat.module.css';
import CryptoJS from 'crypto-js';
import { handleMessageReaction, pinMessage, unpinMessage, deleteMessage } from '../utils/messageHandlers';
import { renderMessageFile, formatMessageTimestamp } from '../utils/messageRenderers';
import { formatTimestampToDate1, produceptagsbycomparingdates, comparemessagedates } from '../utils/dateUtils';
import { setupSocketListeners } from '../utils/socketHandlers';
import { setupMessageObserver } from '../utils/observerUtils';
import { handleEditMessage, saveEdit } from '../utils/editMessageUtils';
import MessageReaction from '../components/MessageReaction';
import MessageStatus from '../components/MessageStatus';

const SECRET_PASS = "XkhZG4fW2t2W";
const Message = ({ message, friendObject, messageClasses, componentType }) => {
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

  const onReaction = handleMessageReaction(socket, mainuser, friendObject, actuallmessagesId, setMessage);
  const onPin = pinMessage(setPinnedMessages);
  const onUnpin = unpinMessage(setPinnedMessages);
  const onDelete = deleteMessage(socket, mainuser, actuallmessagesId, setShowMessageMenu);


  useEffect(() => {
    if (!socket || !socketReady || !messageClass) return;
    const cleanup = setupMessageObserver(socket, messageClass, styles, actuallmessagesId, mainuser, selectedUser);
    return cleanup;
  }, [socket, socketReady, messageClass, actuallmessagesId, mainuser, selectedUser]);

  useEffect(() => {
    const cleanup = setupSocketListeners(socket, setMessage, mainuser, selectedUser, actuallmessagesId);
    return cleanup;
  }, [socket, socketReady]);

useEffect(() => {
  const handleClickOutside = (event) => {
    // Check if click is outside both the reaction panel AND the trigger button
    if (!event.target.closest(`.${styles.reactionPanel}`)) {
      // Add a slight delay before closing the panel
      setTimeout(() => {
        setShowReactions(null);
      }, 200); // 200ms delay
    }
  };

  if (showReactions !== null) {
    document.addEventListener('mouseup', handleClickOutside);
  }

  // Cleanup the event listener
  return () => {
    document.removeEventListener('mouseup', handleClickOutside);
  };
}, [showReactions]);

  const handleMessageOptions = (msg, event) => {
    event.preventDefault();
    event.stopPropagation(); 
    setMenuPosition({
      top: event.clientY,
      left: event.clientX
  });
    setSelectedMessage(msg);
    setShowMessageMenu(true);
  };

  useEffect(() => {
    const handleClick = () => setShowMessageMenu(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

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
    const dates = comparemessagedates();
    setarraydates(dates);
  }, [message]);

  
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
                          <button onClick={() => onPin(selectedMessage)}>
                            Pin Message
                          </button>
                        ) : (
                          <button onClick={() => onUnpin(selectedMessage)}>
                            Unpin Message
                          </button>
                        )}
                        <button onClick={() => onDelete('self')}>
                          Delete for me
                        </button>
                        {msg.sender === mainuser[0].userId && (
                          <button onClick={() => onDelete('everyone')}>
                            Delete for everyone
                          </button>
                        )}
                        <button onClick={() => handleEditMessage(selectedMessage)}>
                          Edit
                        </button>

                        <button 
                       className={styles.reactionTrigger}
                       onClick={() => setShowReactions(showReactions === msg._id ? null : msg._id)}>
                      😀
                    </button>
                      </div>
                    )}

                       { isEditing && selectedMessage._id === msg._id && (
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
                    <p>{formatMessageTimestamp(msg.timestamp)}</p>
                  </div>
                  <div className={messageContentClass}>
                    <p className={styles.text}>{msg.text}</p>

                    {msg.sender === mainuser[0].userId && (
                      <MessageStatus status={msg.status} />
                    )}

                    {showReactions === msg._id && (
                      <MessageReaction 
                       message={msg} 
                        onReact={onReaction}
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
                        {renderMessageFile(msg.fileURL)}
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
                  <p>{formatMessageTimestamp(msg.timestamp)}</p>
                </div>
                <div className={messageContentClass}>
                  <p className={styles.text}>{msg.text}</p>
                  {msg.fileURL && (
                    <div className={styles.file}>
                      {renderMessageFile(msg.fileURL)}
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

export default Message;  