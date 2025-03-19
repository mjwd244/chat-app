export const pinMessage = (setPinnedMessages) => (msg) => {
    setPinnedMessages((prev) => new Set(prev).add(msg._id));
    fetch(`http://localhost:5000/api/auth/messages/${msg._id}/pin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pinned: true,
      }),
    });
  };
  
  export const unpinMessage = (setPinnedMessages) => (msg) => {
    setPinnedMessages((prev) => {
      const newPinned = new Set(prev);
      newPinned.delete(msg._id);
      return newPinned;
    });
  
    fetch(`http://localhost:5000/api/auth/messages/${msg._id}/unpin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  
  export const deleteMessage = (socket, mainuser, actuallmessagesId, setShowMessageMenu) => (type, selectedMessage) => {
    if (!selectedMessage) return;
  
    console.log('Before socket emit - Selected Message:', selectedMessage);
    console.log('Emitting delete event with type:', type);
    console.log('Deleting message with ID:', selectedMessage._id);
    console.log('Conversation ID:', selectedMessage.conversationId);
  
    socket.emit('deleteMessage', {
      conversationId: actuallmessagesId,
      messageId: selectedMessage._id,
      type, // 'self' or 'everyone'
      userId: mainuser[0].userId,
    });
  
    console.log('After socket emit - Delete event sent');
    setShowMessageMenu(false);
  };

  export const handleEditMessage = (setEditText, setIsEditing, setSelectedMessage, setShowMessageMenu) => (msg) => {
    setEditText(msg.text);
    setIsEditing(true);
    setSelectedMessage(msg);
    setShowMessageMenu(false);
  };
  
  export const saveEdit = (selectedMessage, editText, actuallmessagesId, setMessage, setIsEditing, setSelectedMessage) => {
    fetch(`http://localhost:5000/api/auth/messages/${selectedMessage._id}/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: editText,
        conversationId: actuallmessagesId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === selectedMessage._id ? { ...msg, text: editText } : msg
          )
        );
        setIsEditing(false);
        setSelectedMessage(null);
      });
  };