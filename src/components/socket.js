import io from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      timeout: 20000
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};