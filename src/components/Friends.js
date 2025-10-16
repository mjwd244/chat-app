import React, { useState } from 'react';
import { useUser } from '../components/UserContext';
import styles from '../assets/FriendPage.module.scss';

const Friends = () => {
  const { mainuser } = useUser();
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Friends' },
    { id: 'online', label: 'Online' },
    { id: 'pending', label: 'Pending Requests' }
  ];

  return (
    <div className={styles.friendsPage}>
      <div className={styles.friendsContainer}>
        {/* Tabs Navigation - Similar to your existing nav styling */}
        <div className={styles.tabsContainer}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar - Matching your existing input styles */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search friends..."
            className={styles.searchInput}
          />
        </div>

        {/* Friends List - Similar to your chat list styling */}
        <div className={styles.friendsList}>
          {/* Friend Card - Using your existing card-like components */}
          <div className={styles.friendCard}>
            <div className={styles.friendAvatar}>
              <div className={styles.avatarImg}></div>
              <div className={styles.statusDot}></div>
            </div>
            <div className={styles.friendInfo}>
              <h3 className={styles.friendName}>John Doe</h3>
              <p className={styles.friendStatus}>Online</p>
            </div>
            <div className={styles.friendActions}>
              <button className={styles.actionButton}>Message</button>
              <button className={styles.actionButton}>More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;