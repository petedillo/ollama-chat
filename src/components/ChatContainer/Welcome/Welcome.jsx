import React from 'react';
import { FiTerminal } from 'react-icons/fi';
import './Welcome.css';

export const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-logo">
          <FiTerminal className="welcome-icon" />
        </div>
        <h1 className="welcome-title">DioChat</h1>
        <p className="welcome-subtitle">Your AI-powered chat assistant.</p>
        <p className="welcome-prompt">Select a chat or start a new conversation to begin.</p>
      </div>
    </div>
  );
};
