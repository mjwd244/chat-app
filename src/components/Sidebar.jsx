import React , { useState, useEffect }from 'react'
import Navbar from './Navbar'
import Search from './Search'
import Chats from './Chats'
import { useUser } from './UserContext';
import axios from 'axios'; 

const Sidebar = ({highlightedUsers, isBlackOverlay,setIsGroupChat})  => {
  const { setGroupId,setShowCreateGroup,setMessage,groups,setGroups, mainuser, rerender ,setRerender} = useUser();
  const [showlistedgroups , setShowlistedgroups] = useState(false)
    const [friendSearched, setFriendSearched] = useState('');
  




  useEffect(() => {
    if (showlistedgroups) {
      fetchGroups();
    }
  }, [showlistedgroups,rerender]); 


  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = mainuser[0].userId; // Ensure this is correctly set
      
      const response = await fetch(`http://localhost:5000/api/auth/groups?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
       
        
          setGroups(data.groups);
       
    
      } else {
        console.error('Failed to fetch group details');
      }
    } catch (error) {
      console.error('Error fetching group details:', error);
    }
  };

  /*useEffect(()=>{
    console.log("groups" + groups)
  },[groups])*/

  const handleToggleView = () => {
    setShowlistedgroups(true)
    setIsGroupChat(true)
  };
  
  const handleToggleView1 = () => {
    setShowlistedgroups(false)
    setIsGroupChat(false)
    setShowCreateGroup(false)
    setMessage([])
  };
  const handleGroupClick = (group) => {

    setIsGroupChat(true)
    setShowCreateGroup(true)
    setGroups(group)
    setMessage([])
  }

  const deleteGroup = async (groupId) =>{
    console.log(`Attempting to delete group with ID: ${groupId}`); // Debugging line
    try {
      
      const token = localStorage.getItem('token'); // Assuming you use token-based authentication
      const response = await axios.delete(`https://localhost:5000/api/auth/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log(`Group with ID ${groupId} deleted successfully`);
        setRerender(rerender + 1); // Trigger a re-render to update the UI
        setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
      }
    } catch (error) {
      console.error(`Error deleting group: ${error}`);
    }
  }


   const groupsButtonStyle = {
    padding: '10px 20px',
    margin: '10px',
    backgroundColor: '#7c4dff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  };




  return (
    <div className='sidebar'>
      {showlistedgroups ? (
        <div className='groups-container'>
          <button 
            style={{
              ...groupsButtonStyle,
              backgroundColor: '#6b42dd'
            }} 
            onClick={handleToggleView1}
          >
            ← Back to Friends
          </button>
          <div className='groups-list'>
            {Array.isArray(groups) && groups.length > 0 ? (
              groups.map((group) => (
                <div 
                  key={group.id} 
                  className={`group-item ${isBlackOverlay && showlistedgroups ? 'highlight' : ''}`}
                  onClick={() => handleGroupClick(group)}
                >
                  <span className="group-name">{group.groupName}</span>
                  {isBlackOverlay && showlistedgroups && (
                    <button 
                      className="delete-group"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGroup(group.id);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="no-groups">
                <p>No groups available</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <button 
            style={groupsButtonStyle}
            onClick={handleToggleView}
          >
            <span>👥</span> View Groups
          </button>
          <Navbar />
          <Search friendSearched={friendSearched} setFriendSearched={setFriendSearched} />
          <Chats 
            highlightedUsers={highlightedUsers} 
            isBlackOverlay={isBlackOverlay} 
            setIsGroupChat={setIsGroupChat} 
            friendSearched={friendSearched} 
          />
        </div>
      )}
    </div>
  );
}

export default Sidebar;