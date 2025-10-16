import React from 'react';
import styles from "../style.scss";

const MessageStatus = ({ status }) => {
  if (!status) return null;
  
  switch(status) {
    case 'sent':
      return <span className={styles.messageStatus}>✓</span>;
    case 'delivered':
      return <span className={styles.messageStatus}>✓✓</span>;
    case 'seen':
      return <span className={`${styles.messageStatus} ${styles.seen}`}>✓✓</span>;
    case 'pending':
      return <span className={styles.messageStatus}>⏳</span>;
    case 'blocked':
      return <span className={styles.messageStatus}>🚫</span>;
    default:
      return null;
  }
};

export default MessageStatus;