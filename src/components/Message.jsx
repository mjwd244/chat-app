import React, { useState, useEffect } from 'react';
import { useUser } from '../components/UserContext';
import styles from '../assets/Groupchat.module.css';
import { pinMessage, unpinMessage, deleteMessage, saveEdit,handleEditMessage } from '../utils/messageutils/messageOperations';
import { renderMessageFile, formatMessageTimestamp } from '../utils/messageutils/messageRenderers';
import { comparemessagedates } from '../utils/messageutils/dateUtils';
import { setupSocketListeners } from '../utils/messageutils/socketHandlers';
import { setupMessageObserver } from '../utils/messageutils/observerUtils';
import MessageReaction from '../components/MessageReaction';
import MessageStatus from '../components/MessageStatus';
import { useClickOutside, useGlobalClick } from '../hooks/messagehooks/useClickHandlers'; 
import { handleMessageReaction,handleMessageOptions } from '../utils/messageutils/messageHandlers';
import { useMessageClasses } from '../hooks/messagehooks/useMessageClasses';
const SECRET_PASS = "XkhZG4fW2t2W";

const Message = ({ message, friendObject, messageClasses, componentType }) => {
  const { mainuser, socket, socketReady, setMessage, actuallmessagesId, selectedUser } = useUser();
  const [messageClass, setMessageClass] = useState('');
  const [messageInfoClass, setMessageInfoClass] = useState('');
  const [messageContentClass, setMessageContentClass] = useState('');
  const [arraydates, setArrayDates] = useState([]);
  const [showMessageMenu, setShowMessageMenu] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [pinnedMessages, setPinnedMessages] = useState(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [showReactions, setShowReactions] = useState(null);

  const onReaction = handleMessageReaction(socket, mainuser, friendObject, actuallmessagesId, setMessage,message);
  const onPin = pinMessage(setPinnedMessages);
  const onUnpin = unpinMessage(setPinnedMessages);
  const onDelete = deleteMessage(socket, mainuser, actuallmessagesId, setShowMessageMenu);

  useEffect(() => {
    if (!socket || !socketReady || !messageClass) return;
    const cleanup = setupMessageObserver(socket, messageClass, styles, actuallmessagesId, mainuser, selectedUser);
    return cleanup;
  }, [socket, socketReady, messageClass, actuallmessagesId, mainuser, selectedUser]);

  useEffect(() => {
    if (!socket || !socketReady) return;
    const cleanup = setupSocketListeners(socketReady, socket, setMessage, mainuser, selectedUser, actuallmessagesId);
    return cleanup;
  }, [socket, socketReady]);

  useClickOutside(`.${styles.reactionPanel}`, () => setShowReactions(null));
  useGlobalClick(() => setShowMessageMenu(false));

  const handleMessageOptionsWrapper = (msg, event) => {
    handleMessageOptions(msg, event, setMenuPosition, setSelectedMessage, setShowMessageMenu);
  };
  
  useMessageClasses(componentType, messageClasses, setMessageClass, setMessageInfoClass, setMessageContentClass);

  useEffect(() => {
    if (!Array.isArray(message) || message.length === 0) return;
    const dates = comparemessagedates(message);
    setArrayDates(dates);
  }, [message]);

  // Helper Function: Render Date Tag
  const renderDateTag = (currentDateTag, previousDateTag) => {
    if (currentDateTag && currentDateTag !== previousDateTag) {
      return (
        <div className="startconversationTitel">
          <p>{currentDateTag}</p>
        </div>
      );
    }
    return null;
  };

  // Helper Function: Render Message Menu
  const renderMessageMenu = (msg) => {
    if (!showMessageMenu || selectedMessage?._id !== msg._id) return null;
    return (
      <div className="messageMenu" style={{ position: 'fixed', top: menuPosition.top, left: menuPosition.left }}>
        {!pinnedMessages.has(msg._id) ? (
          <button onClick={() => onPin(selectedMessage)}>Pin Message</button>
        ) : (
          <button onClick={() => onUnpin(selectedMessage)}>Unpin Message</button>
        )}
        <button onClick={() => onDelete('self')}>Delete for me</button>
        {msg.sender === mainuser[0].userId && (
          <button onClick={() => onDelete('everyone')}>Delete for everyone</button>
        )}
        <button onClick={() => handleEditMessage(selectedMessage)}>Edit</button>
        <button className={styles.reactionTrigger} onClick={() => setShowReactions(showReactions === msg._id ? null : msg._id)}>😀</button>
      </div>
    );
  };

  // Helper Function: Render Message Content
  const renderMessageContent = (msg) => {
    return (
      <div className={messageContentClass}>
        <p className={styles.text}>{msg.text}</p>
        {msg.sender === mainuser[0].userId && <MessageStatus status={msg.status} />}
        {showReactions === msg._id && <MessageReaction message={msg} onReact={onReaction} />}
        {msg.reactions?.length > 0 && (
          <div className={styles.reactionsList}>
            {msg.reactions.map((reaction, idx) => (
              <span key={idx} className={styles.reaction}>{reaction.reaction}</span>
            ))}
          </div>
        )}
        {msg.fileURL && <div className={styles.file}>{renderMessageFile(msg.fileURL)}</div>}
      </div>
    );
  };

  // Early Return for No Messages
  if (!Array.isArray(message) || message.length === 0) {
    return <div className={messageContentClass}><p>No messages to display</p></div>;
  }

  return (
    <>
      {message
        .filter((msg) => msg.source === componentType) // Filter by componentType
        .filter((msg) => !msg.deletedFor?.includes(mainuser[0].userId)) // Filter deleted messages
        .map((msg, index) => {
          // Determine photoURL based on componentType
          const photoURL =
            componentType === "chat"
              ? friendObject.find((friend) => friend.id === msg.sender)?.photo || mainuser[0].photoURL
              : msg.sender.id === mainuser[0].userId
              ? mainuser[0].photoURL
              : msg.sender.photo;

          // Determine date tags for chat messages
          const currentDateTag = arraydates[message.length - (index + 1)];
          const previousDateTag = index > 0 ? arraydates[message.length - index] : null;

          return (
            <div key={index}>
              {/* Render date tag for chat messages */}
              {componentType === "chat" && renderDateTag(currentDateTag, previousDateTag)}

              {/* Render the message */}
              <div
                className={`${messageClass} ${
                  (componentType === "chat" && msg.sender === mainuser[0].userId) ||
                  (componentType === "group" && msg.sender.id === mainuser[0].userId)
                    ? styles.owner
                    : styles.notowner
                } ${pinnedMessages.has(msg._id) ? "pinned-message" : ""} ${
                  msg.pending ? "pending-message" : ""
                }`}
                onContextMenu={(e) => handleMessageOptionsWrapper(msg, e)}
                data-message-id={msg._id}
              >
                {/* Pending indicator */}
                {msg.pending && <span className="pending-indicator">⏳</span>}

                {/* Message menu */}
                {renderMessageMenu(msg)}

                {/* Edit message input */}
                {isEditing && selectedMessage._id === msg._id && (
                  <div className={messageContentClass}>
                    <input value={editText} onChange={(e) => setEditText(e.target.value)} />
                    <button onClick={saveEdit}>Save</button>
                  </div>
                )}

                {/* Message info (photo and timestamp) */}
                <div className={messageInfoClass}>
                  <img src={photoURL} alt="" />
                  <p>{formatMessageTimestamp(msg.timestamp)}</p>
                </div>

                {/* Message content (text, reactions, files) */}
                {renderMessageContent(msg)}
              </div>
            </div>
          );
        })}
    </>
  );
};

export default Message;
