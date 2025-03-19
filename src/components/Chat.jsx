import React, { useState, useEffect } from "react";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import Delete from "../img/delete.jpg";
import Messages from "./Messages";
import Input from "./Input";
import AddFriend from "./AddFriend";
import { useChat, useUser } from './UserContext';
import GroupChat from "./GroupChat";
import { createConversation } from '../pages/UserDetails';
import { Detector } from "react-detect-offline";
import { useSocketListeners } from '../hooks/chathooks/useSocketListeners';
import { useMessageHandlers } from '../hooks/chathooks/useMessageHandlers';
import { useGroupChat } from '../hooks/chathooks/useGroupChat';
import CryptoJS from 'crypto-js';

const SECRET_PASS = "XkhZG4fW2t2W"; // Add this at the top with other imports

const Chat = ({ onSearchChat, toggleBlackOverlay, isGroupChat, setIsGroupChat }) => {
    const { showAddFriend, setShowAddFriend } = useChat();
    const [inputValue, setInputValue] = useState('');
    const { friend, setUnreadCounts, actuallmessagesId, mainuser, message, socket, socketReady, setMessage, selectedUser, setActuallMessageId, groupId, rerender, setRerender } = useUser();
    const messageClasses = {
        message: 'message',
        messageInfo: 'messageInfo',
        messageContent: 'messageContent',
        wholecontainer: 'messages'
    };

    // Use custom hooks
    useSocketListeners({socket, socketReady, mainuser, selectedUser, actuallmessagesId, setMessage, message, setUnreadCounts});
    const { storeUnsentMessage, sendStoredMessages, sendMessage, triggersend, setTriggersend } = useMessageHandlers(socket, mainuser, selectedUser, actuallmessagesId, setMessage);
    const { showDropdown, setShowDropdown, buttonLabel, handleGroupDeletionOrExit } = useGroupChat(groupId, mainuser, setRerender);

    const handleSendWithConnectionCheck = (online, text, fileURL) => {
        if (!online) {
            console.log('Cannot send message - offline');
            storeUnsentMessage(text, fileURL);
            return;
        }
        setTriggersend(!triggersend);
        sendMessage(text, fileURL);
    };

     useEffect(() => {
            if (selectedUser && selectedUser[0]) {
                let status = selectedUser[0].status;
                const isDate = !isNaN(new Date(status));
                if (isDate) {
                    status = 'offline';
                } else { 
                    status = selectedUser[0].status;
                }
                console.log("Selected User Details:", {
                    id: selectedUser[0].id,
                    displayName: selectedUser[0].displayName,
                    photo: selectedUser[0].photo,
                    status: isDate ? 'offline' : status,
                    publicKey: selectedUser[0].publicKey // Log publicKey
                });
            }
        }, [selectedUser]);

    useEffect(() => {
        console.log("creating conversation ...")
        const createConversationIfNeeded = async () => {
            if (actuallmessagesId === null) {
                try {
                    const newConversation = await createConversation(mainuser, selectedUser[0].id);
                    
                    if (newConversation && newConversation.conversation) {
                        setActuallMessageId(newConversation.conversation._id);
                    } else {
                        console.error("Failed to create a new conversation.");
                    }
                } catch (error) {
                    console.error("Error creating conversation:", error.message);
                }
            }
        };
        selectedUser.length > 0 ? createConversationIfNeeded() : null;
    }, [actuallmessagesId, triggersend]);

    const highlightFriendsForDeletion = () => {
        const usersToHighlight = friend.map((friendItem) => friendItem.friendId);
        toggleBlackOverlay(usersToHighlight);
    };

    const toggleGroupOptionsDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    return (
        <>
            <div className="chat">
                <Detector
                    render={({ online }) => {
                        if (online) {
                            sendStoredMessages();
                        }
                        return (
                            <>
                                <div className="chatInfo">
                                    <div className="chatIcons">
                                        <img src={Cam} alt="" />
                                        <img src={Add} alt="" onClick={() => { setShowAddFriend(true); setIsGroupChat(false); }} />
                                        <div className="more-icon-wrapper">
                                            <img src={More} alt="" onClick={toggleGroupOptionsDropdown} />
                                            {showDropdown && (
                                                <div className="dropdown-menu">
                                                    <button onClick={handleGroupDeletionOrExit}>{buttonLabel}</button>
                                                </div>
                                            )}
                                        </div>
                                        <img src={Delete} alt="" onClick={highlightFriendsForDeletion} />
                                    </div>
                                </div>
                                {isGroupChat ? (
                                    <GroupChat setIsGroupChat={setIsGroupChat} />
                                ) : (
                                    <>
                                        <Messages 
                                            message={message} 
                                            friendObject={selectedUser} 
                                            messageClasses={messageClasses} 
                                            componentType={"chat"} 
                                        />
                                        <Input
                                            inputValue={inputValue}
                                            setInputValue={setInputValue}
                                            onSend={(text, fileURL) => handleSendWithConnectionCheck(online, text, fileURL)}
                                        />
                                        {showAddFriend && <AddFriend onSearchAdd={onSearchChat} />}
                                    </>
                                )}
                                <div style={{
                                    position: 'fixed',
                                    bottom: '20px',
                                    right: '20px',
                                    padding: '10px',
                                    backgroundColor: online ? '#4CAF50' : '#f44336',
                                    color: 'white',
                                    borderRadius: '4px'
                                }}>
                                    {online ? '🟢 Connected' : '🔴 Disconnected'}
                                </div>
                            </>
                        );
                    }}
                />
            </div>
        </>
    );
};

export default Chat;