const ConnectionStatus = {
  isOnline: () => window.navigator.onLine,
  subscribe: (callback) => {
      const handleOnline = () => {
          console.log('Network status: Online');
          callback(true);
      };
      
      const handleOffline = () => {
          console.log('Network status: Offline');
          callback(false);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Initial status check
      callback(window.navigator.onLine);

      return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
      };
  }
};

export { ConnectionStatus };