export const handleReaction = (messageId, reaction, userId, receiverId, conversationId, socket, setMessage) => {
    socket.emit('messageReaction', {
      messageId,
      reaction,
      userId,
      receiverId,
      conversationId
    });
    
    setMessage(prevMessages =>
      prevMessages.map(msg =>
        msg._id === messageId
          ? {
              ...msg,
              reactions: [
                { userId, reaction }
              ]
            }
          : msg
      )
    );
  };