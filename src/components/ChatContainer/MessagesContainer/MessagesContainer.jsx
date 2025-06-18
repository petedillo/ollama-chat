import React, { useEffect, useRef } from 'react';
import Message from '../Message/Message';
import { EmptyState } from '../EmptyState/EmptyState';
import './MessagesContainer.css';

const MessagesContainer = ({ messages, loading, currentChat }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const renderContent = () => {
    if (!currentChat) {
      return <EmptyState message="Select a chat from the sidebar or create a new one" />;
    }
    
    if (messages.length === 0) {
      return <EmptyState message="Type a message below to begin chatting" />;
    }

    return (
      <>
        {messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
        {loading && (
          <div className="loading-indicator">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </>
    );
  };

  return (
    <div className="messages-container">
      {renderContent()}
    </div>
  );
};

export default MessagesContainer;
