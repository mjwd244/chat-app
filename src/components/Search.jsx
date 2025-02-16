import React , { useState }from 'react'
import {  useUser } from '../components/UserContext';




const Search = () => {

  
  const [searchTerm, setSearchTerm] = useState('');
  const {selectedUser} = useUser();
 
  
  const user = selectedUser && selectedUser.length > 0 ? selectedUser[0] : null;

  return (
    <div className='search'>
        <div className='searchForm'>
        
            <input type="text" placeholder='Find a user' value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} />
         


         <button>Search</button> 
        </div> 
      
        
        {user  ? (
        <div className="userChat">
          
          <div className="userChatInfo">
          <img src={user.photo} alt="" />
            <span>{user.displayName}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Search