import { useEffect } from 'react';

// Handle clicks outside a specific element
export const useClickOutside = (ref, callback, delay = 200) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(ref)) {
        setTimeout(() => {
          callback();
        }, delay);
      }
    };

    document.addEventListener('mouseup', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [ref, callback, delay]);
};

// Handle global clicks (e.g., to close a menu), but ignore clicks on specific elements
export const useGlobalClick = (callback, ignoreSelector) => {
  useEffect(() => {
    const handleClick = (event) => {
      // Ignore clicks on the specified element(s)
      if (!event.target.closest(ignoreSelector)) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [callback, ignoreSelector]);
};