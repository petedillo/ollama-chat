import React from 'react';
import { FiSettings, FiUser, FiLogOut } from 'react-icons/fi';
import { useUser } from '../../../../context/UserContext';
import './UserProfile.css';

export const UserProfile = () => {
  const { user, signOut } = useUser();
  const { name, email, avatar, status } = user;

  const handleSettingsClick = (e) => {
    e.preventDefault();
    console.log('Settings clicked');
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut();
  };

  return (
    <div className="user-profile">
      <div className="user-avatar">
        {avatar ? (
          <img src={avatar} alt={name} className="avatar-image" />
        ) : (
          <div className="avatar-placeholder">
            <FiUser className="avatar-icon" />
          </div>
        )}
        {status && <span className={`status-indicator ${status}`}></span>}
      </div>
      
      <div className="user-info">
        <div className="user-name">{name}</div>
        <div className="user-email" title={email}>
          {email}
        </div>
      </div>
      
      <div className="user-actions">
        <button 
          className="icon-button"
          onClick={handleSettingsClick}
          aria-label="Settings"
          title="Settings"
        >
          <FiSettings className="icon" />
        </button>
        
        <button 
          className="icon-button sign-out"
          onClick={handleSignOut}
          aria-label="Sign out"
          title="Sign out"
        >
          <FiLogOut className="icon" />
        </button>
      </div>
    </div>
  );
};
