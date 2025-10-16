import React from 'react'
import Message from "./Message"
import styles from '../assets/Groupchat.module.css';
import { useUser } from '../components/UserContext';

const Messages = ({message ,friendObject,messageClasses ,componentType,isChatOpen}) => {

let messageClass;
const { mainuser} = useUser();


  if (componentType === 'chat') {
    messageClass = messageClasses.wholecontainer;
    
  } else if (componentType === 'group') {
    messageClass = messageClasses.wholecontainer;
  
  }


  return (


    <div className={isChatOpen ? `${messageClass} chat-open` : messageClass}>
      
           <div className="startconversationTitel">
                {Array.isArray(friendObject) && friendObject.length > 0 ? (
                  <p>Conversation between {friendObject[0].displayName} and {mainuser[0].displayName}</p>
                  ) : (
                  <p>No friend selected for conversation</p>
                  )}
            </div> 
         
        <Message message={message} friendObject={friendObject}  messageClasses={messageClasses} componentType={componentType} /> 
       
       
    </div>
  )
}

export default Messages
