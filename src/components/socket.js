import io from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (!socket) {
    console.log('Creating new socket instance...');
    socket = io('https://localhost:5000', {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      timeout: 20000,
      // Add these options for better debugging
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // Add connection event listeners
    socket.on('connect', () => {
      console.log('Socket connected with ID:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Add a promise to wait for the socket to be ready
    socket.ready = new Promise((resolve) => {
      console.log('Waiting for socket to be ready...');
      socket.on('connect', () => {
        console.log('Socket is ready!');
        resolve(true);
      });
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('Disconnecting socket:', socket.id);
    socket.disconnect();
    socket = null;
  }
};