export const setupMessageObserver = (socket, messageClass, styles, actuallmessagesId, mainuser, selectedUser) => {
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
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const messageElement = entry.target;
              if (!messageElement.hasAttribute('data-seen')) {
                const messageId = messageElement.dataset.messageId;
                socket.emit('messageRead', {
                  messageId,
                  conversationId: actuallmessagesId,
                  readerId: mainuser[0].userId,
                  senderId: selectedUser[0].id,
                });
                messageElement.setAttribute('data-seen', 'true');
              }
            }
          });
        }
      },
      { threshold: 1 }
    );
  
    const startObserving = () => {
      const messages = document.querySelectorAll(`.${messageClass}.${styles.notowner}:not([data-seen])`);
      messages.forEach((msg) => messageObserver.observe(msg));
    };
  
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
  
    // Initial observation
    startObserving();
  
    // Watch for new messages
    const messageWatcher = new MutationObserver(startObserving);
    messageWatcher.observe(document.body, { childList: true, subtree: true });
  
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      messageObserver.disconnect();
      messageWatcher.disconnect();
    };
  };