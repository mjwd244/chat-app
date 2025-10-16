import React , { useState }from 'react'
import {  useUser } from '../components/UserContext';




const Search = ({ friendSearched, setFriendSearched }) => {

  
  
  const {selectedUser} = useUser();
 
  
  //const user = selectedUser && selectedUser.length > 0 ? selectedUser[0] : null;

  return (
    <div className='search'>

        
          <label>Find User</label>
         <input type="text" placeholder='Find a user' value={friendSearched}
         onChange={(e) => setFriendSearched(e.target.value)} />
         <button>Search</button> 
        
    </div>
  )
}

export default Search
