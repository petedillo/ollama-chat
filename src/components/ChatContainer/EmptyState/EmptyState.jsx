import React from 'react';
import './EmptyState.css';

export const EmptyState = ({ message }) => (
  <div className="empty-chat">
    <h2>No chat selected</h2>
    <p>{message}</p>
  </div>
);
