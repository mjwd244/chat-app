import { useUser } from '../../components/UserContext';

export const useReactionHandler = (friendObject, actuallmessagesId) => {
  const { mainuser, socket, setMessage } = useUser();

  const handleReaction = (messageId, reaction) => {
    socket.emit('messageReaction', {
      messageId,
      reaction,
      userId: mainuser[0].userId,
      receiverId: friendObject[0].id,
      conversationId: actuallmessagesId
    });
    
    setMessage(prevMessages =>
      prevMessages.map(msg =>
        msg._id === messageId
          ? {
              ...msg,
              reactions: [
                { userId: mainuser[0].userId, reaction }
              ]
            }
          : msg
      )
    );
  };

  return handleReaction;
};