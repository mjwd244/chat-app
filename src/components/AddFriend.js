import React from 'react';
import FriendSearch from './FriendSearch';
import AddfriendCss from '../assets/AddFriend.module.css'; // Import the CSS file for styling
import { useChat } from './UserContext';

const AddFriend = ({onSearchAdd}) => {
  const { setShowAddFriend } = useChat();

  const handleSearchS=(searchTerm) =>{

    onSearchAdd(searchTerm)
  }

  const closeUi=() =>{
    setShowAddFriend(false);
  }
  
  return (
    <div>
        <div className={AddfriendCss.searchwindow}>
          <FriendSearch onSearch={handleSearchS} />
          <button className={AddfriendCss.closebutton}  onClick={closeUi}>
            Close
          </button>
        </div>
    </div>
  );
};

export default AddFriend;

