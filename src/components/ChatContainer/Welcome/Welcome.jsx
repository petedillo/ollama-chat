import React from 'react';
import { FiTerminal, FiMessageSquare, FiSend } from 'react-icons/fi';
import './Welcome.css';

export const Welcome = ({ type = 'welcome' }) => {
  const renderContent = () => {
    switch (type) {
      case 'empty-chat':
        return (
          <>
            <div className="welcome-logo">
              <FiMessageSquare className="welcome-icon" />
            </div>
            <h1 className="welcome-title">Start a new conversation</h1>
            <p className="welcome-subtitle">Your AI assistant is ready to help!</p>
            <p className="welcome-prompt">
              <FiSend className="inline-icon" /> Type a message below to begin chatting
            </p>
          </>
        );
      
      case 'welcome':
      default:
        return (
          <>
            <div className="welcome-logo">
              <FiTerminal className="welcome-icon" />
            </div>
            <h1 className="welcome-title">DioChat</h1>
            <p className="welcome-subtitle">Your AI-powered chat assistant.</p>
            <p className="welcome-prompt">Select a chat or start a new conversation to begin.</p>
          </>
        );
    }
  };

  return (
    <div className={`welcome-container ${type}`}>
      <div className="welcome-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Welcome;
