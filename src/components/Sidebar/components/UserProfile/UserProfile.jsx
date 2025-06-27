import React from 'react';
import { FiSettings, FiUser } from 'react-icons/fi';
import './UserProfile.css';

export const UserProfile = () => {
  // Mock user data
  const user = {
    name: 'User',
    email: 'user@example.com',
    avatar: null
  };

  const handleSettingsClick = (e) => {
    e.preventDefault();
    // Settings is disabled
  };

  return (
    <div className="user-profile">
      <div className="user-avatar disabled">
        <div className="avatar-placeholder">
          <FiUser className="avatar-icon" />
        </div>
      </div>
      
      <div className="user-info disabled">
        <div className="user-name">{user.name}</div>
        <div className="user-email">{user.email}</div>
      </div>
      
      <button 
        className="settings-button disabled"
        onClick={handleSettingsClick}
        aria-label="Settings"
        disabled
      >
        <FiSettings className="settings-icon" />
      </button>
    </div>
  );
};
