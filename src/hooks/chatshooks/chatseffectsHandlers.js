import { useEffect,useState } from 'react';

// Custom hook to handle click outside logic

export const useActiveMenu = () => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  let isMenuVisible;
  
  useEffect(() => {
    const handleOutsideClick = () => {
      if (activeMenuId !== null) {
        setActiveMenuId(null);
      }
    };

    // Only add listener if a menu is open
    if (activeMenuId !== null) {
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [activeMenuId]);

  // Function to toggle a specific menu
  const toggleMenu = (menuId) => (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveMenuId(current => current === menuId ? null : menuId);
  };

  return {
    activeMenuId,
    setActiveMenuId,
    toggleMenu,
    isMenuVisible: (menuId) => activeMenuId === menuId
  };
};
