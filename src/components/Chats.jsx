  import React, { useState, useEffect, useRef } from 'react';
  import { useUser } from '../components/UserContext';
  import CryptoJS from 'crypto-js';
  const SECRET_PASS = "XkhZG4fW2t2W"; 

  export const Chats = ({ highlightedUsers, isBlackOverlay,setIsGroupChat }) => {

    const { setSelectedUser,friend,setFriends, setMessage, message,
    mainuser, rerender,socket, setRerender,unreadCounts, setUnreadCounts, setActuallMessageId,isGroupChat,selectedUser ,setShowCreateGroup, actuallmessagesId,selectedFriends,setSelectedFriends,setfriendUserTimestampSave,setmainUserTimeStampSave} = useUser();
    const mainuserRef = useRef(mainuser);
    const clickedElementRef = useRef(null);
    const [isSelected, setIsSelected] = useState({});


    const handleSelectFriend = (chat) => {
      if (isSelected[chat.friendId]) {
        setIsSelected((prevIsSelected) => ({ ...prevIsSelected, [chat.friendId]: false }));
      } else {

        setIsSelected((prevIsSelected) => ({ ...prevIsSelected, [chat.friendId]: true }));
        
      }
    };

    useEffect(() => {
      mainuserRef.current = mainuser;
      if (mainuserRef.current && mainuserRef.current.userId) {
        console.log(mainuserRef.current.userId);
      } else {
        console.log('mainuserRef is not defined or empty');
      }
    }, [mainuser]);

    useEffect(() => {
      if (!socket) {
        console.error('Socket is not initialized');
        return;
      }

      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      /*socket.on('currentOnlineUsers', (onlineUsers) => {
        console.log('Current online users:', onlineUsers);
        setOnlineStatus(onlineUsers);
      });*/

      socket.on('updateUserStatus', ({ userId, isOnline }) => {
        console.log(`User ${userId} is now ${isOnline ? 'online' : 'offline'}`);
      
        if (mainuserRef.current && mainuserRef.current[0] && mainuserRef.current[0].userId) {
          TodisplayFriendsinChatsComponent(mainuserRef.current[0].userId);
        }
      });
      return () => {
        socket.off('currentOnlineUsers');
        socket.off('updateUserStatus');
      };
  
    }, [socket]);  


    const fetchAndDisplayConversationMessages = async (userId) => {
      try {
          const response = await fetch(`http://localhost:5000/api/auth/conversations/${mainuser[0].userId}/${userId[0].id}`);
          const data = await response.json();
          setActuallMessageId(data.conversationId);
  
          const decryptedMessages = data.messages.map(message => {
              // Check the encrypted flag we set when sending
              if (message.encrypted === true) {  
                  try {
                      const decryptedBytes = CryptoJS.AES.decrypt(message.text, SECRET_PASS);
                      const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
                      
                      console.log('Encrypted message:', message.text);
                      console.log('Decrypted text:', decryptedText);
                      
                      return {
                          ...message,
                          text: JSON.parse(decryptedText), // Parse since we stringified during encryption
                          encrypted: false,
                          source: 'chat'
                      };
                  } catch (error) {
                      console.log('Decryption failed for message:', message);
                      return message;
                  }
              }
              return { ...message, source: 'chat' };
          });
  
          setMessage(decryptedMessages);
      } catch (error) {
          console.error(`Error fetching messages: ${error}`);
          setActuallMessageId(null);
      }
  };
  //setmainUserTimeStampSave(null);
  //setfriendUserTimestampSave(null);

  useEffect(() => {

    if(selectedFriends){
      fetchAndDisplayConversationMessages(selectedUser);
    }
    else{
      setSelectedUser([])
    }

  }, [selectedFriends]);

    const DeleteFriendfromdatabase = async (friendId) => {
      try {
        await fetch(`http://localhost:5000/api/auth/friends/${mainuserRef.current[0].userId}/${friendId}`, { method: 'DELETE' });
        console.log(`Friend with ID ${friendId} deleted successfully`);
        setRerender(rerender + 1);
      } catch (error) {
        console.error(`Error deleting friend: ${error}`);
      }
    };

    const TodisplayFriendsinChatsComponent = async (userId) => {  
      try {

        const response = await fetch(`http://localhost:5000/api/auth/friends/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const friendsData = await response.json();
        if (friendsData && friendsData.numberOfFriends > 0) {
          setFriends(friendsData.friends);
          console.log("Friends data:", friendsData.friends); // Directly log the object
          console.dir(friendsData.friends); // Use console.dir for an interactive list
          console.log("Full friends data object:", JSON.stringify(friendsData, null, 2)); // Use JSON.stringify for readable format
        } else {
          console.log("No friends found.");
        }
        return friendsData;
      } catch (error) {
        console.error(`Error fetching friends: ${error}`);
      }
    };

    useEffect(() => {
      if (mainuserRef.current && mainuserRef.current[0] && mainuserRef.current[0].userId) {
        TodisplayFriendsinChatsComponent(mainuserRef.current[0].userId);
      }
    }, [rerender]);



    /*useEffect(() => {
      // Function to be called at each interval
      const fetchData =  () => {
        try {
          
  
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      // Set up the interval
      const intervalId = setInterval(fetchData, 5000); // 5000 ms = 5 seconds

      // Clean up the interval on component unmount or when dependencies change
      return () => clearInterval(intervalId);
    }, [onlineStatus]); // Empty dependency array to run only once on component mount*/

    const getStatusMessage = (status) => {
      
    
      // Check for specific statuses
      switch (status) {
        case 'online':
          return 'Online';
        case 'away':
          return 'Away';
        case 'busy':
          return 'Busy';
        case 'doNotDisturb':
          return 'Do Not Disturb';
        case 'offline':
          return 'Offline';
        default:
          // If status is a valid date string
          let date = new Date(status);
          if (!isNaN(date)) {
            return `Offline since ${date.toLocaleString()}`;
          } else {
            // Default if no valid status or timestamp is available
            return 'Unknown Status';
          }
      }
    }
    const handleSelectConversation = (user) => {
      
      setUnreadCounts(prev => ({
          ...prev,
          [user]: 0
      }));
  };
  
  
    
    return (
      <div className='chats'>
        {friend ? (
          friend.map((chat) => (
            <div className={`userChat ${isBlackOverlay && highlightedUsers.includes(chat.friendId) ? 'highlight' : ''}`}
                key={chat.friendId}
                onClick={(e) => {
                  const element = e.currentTarget;
                  if (element.classList.contains('highlight')) {
                    DeleteFriendfromdatabase(chat.friendId);
                  } else {
                    setSelectedUser([{
                      id: chat.friendId,
                      displayName: chat.friendName,
                      photo: chat.photo,
                      status: chat.status,
                      publicKey: chat.publicKey
                    }]);
                    handleSelectFriend(chat);
                    setMessage([]);
                    setSelectedFriends(prevToggle => !prevToggle);
                    handleSelectConversation(chat.friendId);
                  }
                }}
            >
              <div className="userChatInfo">
                <div className='userChatInfocolumn'>
                <span>{chat.friendName}</span>
                <img src={chat.photo} alt="" />
                <span>{getStatusMessage(chat.status)}</span>
                {isSelected[chat.friendId] && <span>Selected</span>}
                </div>
                <div className='userChatInforow'>
                    {unreadCounts && chat.friendId && unreadCounts[chat.friendId] > 0 && (
                          <div className="unread-badge">
                              {unreadCounts[chat.friendId]}
                          </div>
                      )}
                </div>


              </div>
            </div>
          ))
        ) : null}
      </div>
    );
  };


  export default Chats;


