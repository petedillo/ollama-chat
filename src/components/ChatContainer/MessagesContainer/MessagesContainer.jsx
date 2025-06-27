import React, { useEffect, useRef } from 'react';
import Message from '../Message/Message';
import { Welcome } from '../Welcome/Welcome';
import './MessagesContainer.css';

const MessagesContainer = ({ messages, loading, currentChat }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const renderContent = () => {
    if (!currentChat || messages.length === 0) {
      return <Welcome />;
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
