import { useEffect } from 'react';
import { useUser } from '../../components/UserContext';

export const useReactionSocket = (setMessage) => {
    const {  socket, socketReady } = useUser();
  useEffect(() => {
    if (socketReady && socket) {
      socket.on('messageReacted', ({ messageId, reaction, userId }) => {
        setMessage(prevMessages =>
          prevMessages.map(msg =>
            msg._id === messageId
              ? {
                  ...msg,
                  reactions: [...(msg.reactions || []), { userId, reaction }]
                }
              : msg
          )
        );
      });
  
      return () => socket.off('messageReacted');
    }
  }, [socket, socketReady]);
};