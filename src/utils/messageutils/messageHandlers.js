export const handleMessageReaction = (socket, mainuser, friendObject, actuallmessagesId, setMessage, messages) => (messageId, reaction) => {
  console.log('Message at reaction time:', messages.find(m => m._id === messageId));
  
  socket.emit('messageReaction', {
    messageId,
    reaction,
    userId: mainuser[0].userId,
    receiverId: friendObject[0].id,
    conversationId: actuallmessagesId,
  });

  setMessage((prevMessages) =>
    prevMessages.map((msg) =>
      msg._id === messageId
        ? { ...msg, reactions: [{ userId: mainuser[0].userId, reaction }] }
        : msg
    )
  );
};

  export const handleMessageOptions = (
    msg,
    event,
    setMenuPosition,
    setSelectedMessage,
    setShowMessageMenu
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuPosition({ top: event.clientY, left: event.clientX });
    setSelectedMessage(msg);
    setShowMessageMenu(true);
  };

 
  