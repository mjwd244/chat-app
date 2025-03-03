import CryptoJS from 'crypto-js';
export const determineMessageStatus = (selectedUser) => {
    if (!selectedUser?.[0]) return 'sent';
    
    const status = selectedUser[0].status;
    const isDate = !isNaN(new Date(status));
    
    if (isDate || status === 'offline') return 'sent';
    if (status === 'online' || ['away', 'busy', 'doNotDisturb'].includes(status)) return 'delivered';
    
    return 'sent';
  };
  
  export const createEncryptedMessage = (text, SECRET_PASS) => {
    return CryptoJS.AES.encrypt(
      JSON.stringify(text),
      SECRET_PASS
    ).toString();
  };
  
  export const createMessageObject = (text, fileURL, actuallmessagesId, mainuser, messageStatus) => {
    return {
      conversationId: actuallmessagesId,
      text: text,
      encrypted: true,
      fileURL: fileURL || null,
      sender: mainuser[0].userId,
      timestamp: new Date().toISOString(),
      status: messageStatus
    };
  };