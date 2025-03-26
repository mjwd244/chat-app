import { useEffect, useRef } from 'react';

export const useSocketListenersChats = (socket, mainuser,TodisplayFriendsinChatsComponent) => {
  const mainuserRef = useRef(mainuser);

  useEffect(() => {
    mainuserRef.current = mainuser;
  }, [mainuser]);

  useEffect(() => {
    if (!socket) {
      console.error('Socket is not initialized');
      return;
    }

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('updateUserStatus', ({ userId, isOnline }) => {
      console.log(`User ${userId} is now ${isOnline ? 'online' : 'offline'}`);
      if (mainuserRef.current && mainuserRef.current[0] && mainuserRef.current[0].userId) {
        TodisplayFriendsinChatsComponent(mainuserRef.current[0].userId);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('updateUserStatus');
    };
  }, [socket,TodisplayFriendsinChatsComponent ]);
};