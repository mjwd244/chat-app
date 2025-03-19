export const showNotification = (sender, message) => {
    const notification = new Notification(`${sender} sent you a message`, {
      body: message,
      icon: '/path/to/icon.png', // Optional: provide an icon
    });
  
    notification.onclick = () => {
      // Focus the chat application or redirect
      window.focus(); // or implement specific redirection
    };
  };
  
  export const playSound = () => {
    const audio = new Audio('/sounds/messagesound.wav');
    audio.play();
  };