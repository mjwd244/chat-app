import React from 'react';
import styles from "../style.scss";

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

export default MessageReaction;