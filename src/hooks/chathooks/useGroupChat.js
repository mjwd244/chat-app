import { useState, useEffect } from 'react';

export const useGroupChat = (groupId, mainuser, setRerender) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('');

  const updateGroupActionLabel = async () => {
    try {
      const response = await fetch(
        `https://localhost:5000/api/auth/groups/state/${mainuser[0].userId}/${groupId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.ok) {
        setButtonLabel('delete group');
      } else {
        setButtonLabel('leave group');
      }
    } catch (error) {
      console.error('Error checking user state:', error);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      updateGroupActionLabel();
    }
  }, [showDropdown]);

  const handleGroupDeletionOrExit = async () => {
    if (buttonLabel === 'delete group') {
      try {
        const response = await fetch(
          `https://localhost:5000/api/auth/groups/${groupId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.ok) {
          setRerender((prev) => prev + 1);
        }
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    } else {
      try {
        const response = await fetch(
          `https://localhost:5000/api/auth/groups/userRemovel/${mainuser[0].userId}/${groupId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.ok) {
          setRerender((prev) => prev + 1);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return {
    showDropdown,
    setShowDropdown,
    buttonLabel,
    handleGroupDeletionOrExit,
  };
};