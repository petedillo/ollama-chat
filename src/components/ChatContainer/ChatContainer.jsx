import { useState, useEffect, useRef } from 'react';
import { useChatContext } from '../../context/ChatContext';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import rehypePrism from '@mapbox/rehype-prism';
import remarkGfm from 'remark-gfm';
import 'prismjs/themes/prism-tomorrow.css';
import './ChatContainer.css';

// Extracted markdown components configuration
const MARKDOWN_COMPONENTS = {
  p: ({children}) => <p className="markdown-p">{children}</p>,
  h1: ({children}) => <h1 className="markdown-h1">{children}</h1>,
  h2: ({children}) => <h2 className="markdown-h2">{children}</h2>,
  h3: ({children}) => <h3 className="markdown-h3">{children}</h3>,
  a: ({children, href}) => <a className="markdown-link" href={href}>{children}</a>,
  ul: ({children}) => <ul className="markdown-ul">{children}</ul>,
  ol: ({children}) => <ol className="markdown-ol">{children}</ol>,
  blockquote: ({children}) => <blockquote className="markdown-blockquote">{children}</blockquote>,
  table: ({children}) => <table className="markdown-table">{children}</table>,
  th: ({children}) => <th className="markdown-th">{children}</th>,
  td: ({children}) => <td className="markdown-td">{children}</td>
};

// Extracted Message component
const Message = ({ message }) => (
  <div className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}>
    <div className="message-role">{message.role === 'user' ? 'You' : 'Assistant'}</div>
    <div className="message-content">
      <ReactMarkdown
        rehypePlugins={[rehypeSanitize, rehypePrism]}
        remarkPlugins={[remarkGfm]}
        components={MARKDOWN_COMPONENTS}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  </div>
);

// Extracted Error component
const ErrorMessage = ({ error, onDismiss }) => (
  <div className="error-message">
    <p>Error: {error}</p>
    <button onClick={onDismiss} className="dismiss-error">Dismiss</button>
  </div>
);

// Custom hook for message handling
const useMessageHandler = (sendMessage) => {
  const [messageInput, setMessageInput] = useState('');
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    const result = await sendMessage(messageInput);
    if (result) {
      setMessageInput('');
    }
  };

  return { messageInput, setMessageInput, handleSendMessage };
};

export const ChatContainer = () => {
  const { currentChat, loading, error, clearError, sendMessage } = useChatContext();
  const { messageInput, setMessageInput, handleSendMessage } = useMessageHandler(sendMessage);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChat?.messages]);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const renderChatContent = () => {
    if (!currentChat) {
      return <EmptyState message="Select a chat from the sidebar or create a new one" />;
    }
    if (currentChat.messages.length === 0) {
      return <EmptyState message="Type a message below to begin chatting" />;
    }
    return (
      <>
        {currentChat.messages.map(message => <Message key={message.id} message={message} />)}
        <div ref={messagesEndRef} />
      </>
    );
  };

  return (
    <div className="chat-container">
      {error && <ErrorMessage error={error} onDismiss={clearError} />}
      
      <div className="messages-container">
        {renderChatContent()}
        {loading && <div className="loading-indicator">Assistant is thinking...</div>}
      </div>
      
      <form className="input-container" onSubmit={handleSendMessage}>
        <input
          ref={inputRef}
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          disabled={loading || !currentChat}
          className="message-input"
        />
        <button 
          type="submit" 
          disabled={loading || !messageInput.trim() || !currentChat}
          className="send-button"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="empty-chat">
    <h2>No chat selected</h2>
    <p>{message}</p>
  </div>
);