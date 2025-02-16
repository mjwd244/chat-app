import React, { useEffect, useState } from 'react';
import FriendSearchCss from '../FriendSearch.module.css'; // Import the CSS file for styling
import { useUser } from '../components/UserContext';
import { useNavigate } from 'react-router-dom';

const FriendSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedResults, setSuggestedResults] = useState([]);
  const navigate = useNavigate();
  const { mainuser } = useUser();
  
  const userId = mainuser.map(user => user.userId)[0];
  console.log(typeof userId); 

  useEffect(() => {
    if (searchTerm) {
      const fetchUsers = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/auth/search-users?searchTerm=${searchTerm}&userId=${userId}`);
          if (!response.ok) {
            throw new Error('Error fetching users');
          }
          const results = await response.json();
          setSuggestedResults(results);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      fetchUsers();
    }
  }, [searchTerm, userId]);

  const handleSearch = () => {
    navigate('/userspage', { state: { searchTerm } });
  };

  return (
    <div className={FriendSearchCss.friendsearchcontainer}>
      <input
        type="text"
        placeholder="Enter friend's username"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={FriendSearchCss.searchinput}
      />
      <button onClick={handleSearch} className={FriendSearchCss.searchbutton}>
        Search
      </button>
      <ul className={FriendSearchCss.searchresults}>
        {suggestedResults.map((user) => (
          <li key={user._id}>
            <button onClick={() => onSearch(user._id)}>
              <img src={user.photoURL} alt="" />
              <p>{user.displayName}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendSearch;