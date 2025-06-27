import React from 'react';
import { useChatContext } from '../../context/ChatContext.jsx';
import { useMessageHandler } from './hooks/useMessageHandler';
import MessagesContainer from './MessagesContainer/MessagesContainer';
import InputArea from './InputArea/InputArea';
import { ErrorMessage } from './ErrorMessage/ErrorMessage';
import './ChatContainer.css';

export const ChatContainer = () => {
  const { currentChat, loading, error, clearError, sendMessage } = useChatContext();
  const { 
    messageInput, 
    setMessageInput, 
    handleSendMessage, 
    handleKeyDown, 
    textareaRef 
  } = useMessageHandler(sendMessage);

  return (
    <div className="chat-container">
      <div className="messages-wrapper">
        {error && <ErrorMessage error={error} onDismiss={clearError} />}
        
        <MessagesContainer 
          messages={currentChat?.messages || []} 
          loading={loading} 
          currentChat={currentChat} 
        />
      </div>
      
      <InputArea
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        handleSendMessage={handleSendMessage}
        handleKeyDown={handleKeyDown}
        textareaRef={textareaRef}
        loading={loading}
        currentChat={currentChat}
      />
    </div>
  );
};

export default ChatContainer;