import { useEffect, useRef } from 'react';

export const useSocketListenersChats = (
  socket,
  mainuser,
  TodisplayFriendsinChatsComponent,
  setBlockedUsers,
  friend
) => {
  const mainuserRef = useRef(mainuser);

  useEffect(() => {
    mainuserRef.current = mainuser;
  }, [mainuser]);

  useEffect(() => {
    if (!socket) {
      // Only log once, not on every render
      if (process.env.NODE_ENV === 'development') {
        console.warn('useSocketListenersChats: Socket is not initialized yet.');
      }
      return;
    }

    const handleConnect = () => {
      console.log('Connected to WebSocket server');
    };

    const handleUpdateUserStatus = ({ userId, status }) => {
      console.log(`User ${userId} is now ${status}`);
      if (
        mainuserRef.current &&
        mainuserRef.current[0] &&
        mainuserRef.current[0].userId
      ) {
        setTimeout(() => {
          TodisplayFriendsinChatsComponent(mainuserRef.current[0].userId);
        }, 1000);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('updateUserStatus', handleUpdateUserStatus);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('updateUserStatus', handleUpdateUserStatus);
    };
  }, [socket, TodisplayFriendsinChatsComponent, friend]);

  useEffect(() => {
    if (!socket) return;

    const handleBlockSuccess = ({ blockedId }) => {
      setBlockedUsers(prev => {
        if (!prev.includes(blockedId)) {
          return [...prev, blockedId];
        }
        return prev;
      });
      if (mainuser && mainuser[0]) {
        TodisplayFriendsinChatsComponent(mainuser[0].userId);
      }
    };

    const handleUnblockSuccess = ({ unblockedId }) => {
      setBlockedUsers(prev => prev.filter(id => id !== unblockedId));
      if (mainuser && mainuser[0]) {
        TodisplayFriendsinChatsComponent(mainuser[0].userId);
      }
    };

    socket.on('blockUserSuccess', handleBlockSuccess);
    socket.on('unblockUserSuccess', handleUnblockSuccess);

    return () => {
      socket.off('blockUserSuccess', handleBlockSuccess);
      socket.off('unblockUserSuccess', handleUnblockSuccess);
    };
  }, [socket, mainuser, TodisplayFriendsinChatsComponent, setBlockedUsers]);
};