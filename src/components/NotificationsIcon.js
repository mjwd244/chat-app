import React from 'react';
import { useUser } from './UserContext';
import NotificationIcon from '../img/notification.png';

const NotificationsIcon = () => {
  const { 
    notifications, 
    setNotifications,
    showNotifications, 
    setShowNotifications,
    socket,
    mainuser,
    friends,
    setFriends,
    rerender,
    setRerender
  } = useUser();

  // Debug notifications
  console.log('NotificationsIcon - Current notifications:', notifications);
  console.log('NotificationsIcon - Notifications length:', notifications.length);

  const handleAccept = async (requestData) => {
    socket.emit('acceptFriendRequest', {
      requestId: requestData.requestId,
      fromUserId: requestData.fromUserId,
      toUserId: mainuser[0].userId
    });
    fetchFriendsList(mainuser[0].userId);
    setRerender(rerender + 1);
  };

  const handleDecline = async (requestData) => {
    socket.emit('declineFriendRequest', {
      requestId: requestData.requestId,
      fromUserId: requestData.fromUserId,
      toUserId: mainuser[0].userId
    });
  };

  // NEW: Remove notification after starting chat
 const handleStartChat = (notif, index) => {
  // TODO: Add your navigation or chat opening logic here
  setNotifications(prev =>
    prev.filter((n, i) => i !== index)
  );
   fetchFriendsList(mainuser[0].userId);
};


 const fetchFriendsList = async (userId) => {
   fetch(`https://localhost:5000/api/auth/friends/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.friends) {
          setFriends(data.friends);
        }
      })
      .catch((error) => {
        console.error('Error fetching friends:', error);
      });
  
};


  return (
    <div className="notifications-wrapper" style={{ position: 'relative' }}>
      <img 
        src={NotificationIcon} 
        alt="Notifications" 
        style={{ cursor: 'pointer', width: '24px', height: '24px' }}
        onClick={() => setShowNotifications(!showNotifications)} 
      />
      {notifications.length > 0 && (
        <span style={{
          position: 'absolute',
          top: '-5px',
          right: '-5px',
          background: '#ff5555',
          color: 'white',
          borderRadius: '50%',
          width: '16px',
          height: '16px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {notifications.length}
        </span>
      )}
      
      {showNotifications && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: '250px',
          maxHeight: '300px',
          overflowY: 'auto',
          background: '#2f2d52',
          border: '1px solid #3e3c61',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}>
          <div style={{ padding: '10px', borderBottom: '1px solid #3e3c61' }}>
            <h4 style={{ margin: 0, color: 'white' }}>Notifications</h4>
          </div>
          
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ 
                padding: '15px', 
                color: '#8da4f1',
                textAlign: 'center' 
              }}>
                No new notifications
              </div>
            ) : (
              <ul style={{ 
                margin: 0, 
                listStyle: 'none', 
                padding: 0 
              }}>
                {notifications.map((notif, index) => (
                  <li key={index} style={{
                    padding: '10px',
                    borderBottom: '1px solid #3e3c61',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <img 
                      src={notif.toUserPhoto || notif.fromUserPhoto || 'default-avatar.png'} 
                      alt="" 
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        color: 'white',
                        marginBottom: '4px' 
                      }}>
                        {notif.sentByMe
                          ? notif.toUserName
                          : notif.fromUserName}
                      </div>
                      <div style={{ 
                        color: '#8da4f1',
                        fontSize: '14px' 
                      }}>
                        {notif.sentByMe
                          ? notif.status === 'pending'
                            ? 'You sent a friend request'
                            : notif.status === 'accepted'
                              ? 'Friend request accepted'
                              : ''
                          : 'Sent you a friend request'}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      {/* Outgoing request (sent by me) */}
                      {notif.sentByMe && notif.status === 'pending' && (
                        <span style={{
                          background: '#8da4f1',
                          color: 'white',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '13px',
                          textAlign: 'center'
                        }}>
                          Pending
                        </span>
                      )}
                      {notif.sentByMe && notif.status === 'accepted' && (
                        <button
                          style={{
                            background: '#8da4f1',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleStartChat(notif, index)}
                        >
                          Confirm 
                        </button>
                      )}
                      {/* Incoming request (not sent by me) */}
                      {!notif.sentByMe && (
                        <>
                          <button 
                            onClick={() => handleAccept(notif)}
                            style={{
                              background: '#8da4f1',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              color: 'white',
                              cursor: 'pointer'
                            }}
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleDecline(notif)}
                            style={{
                              background: '#ff5555',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              color: 'white',
                              cursor: 'pointer'
                            }}
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsIcon;