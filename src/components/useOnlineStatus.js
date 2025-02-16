import { useEffect, useState } from 'react';

const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const updateOnlineStatus = () => {
            const condition = navigator.onLine;
            console.log('HALLO Connection status changed:', condition ? 'online' : 'offline');
            setIsOnline(condition);
            document.body.dataset.connectionStatus = condition ? 'online' : 'offline';
        };

        window.ononline = (event) => {
            console.log("You are now connected to the network.");
          };
          window.onoffline = (event) => {
            console.log("The network connection has been lost.");
          };

        // Set initial status
        updateOnlineStatus();

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, []);

    return isOnline;
};

export default useOnlineStatus;