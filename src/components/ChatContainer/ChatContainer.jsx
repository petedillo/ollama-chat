import { useState, useEffect, useRef } from 'react';
import { useChatContext } from '../../context/ChatContext';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import rehypePrism from '@mapbox/rehype-prism';
import remarkGfm from 'remark-gfm';
import 'prismjs/themes/prism-tomorrow.css';
import './ChatContainer.css';

export const ChatContainer = () => {
  const { currentChat, loading, error, clearError, sendMessage } = useChatContext();
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChat?.messages]);

  // Focus input after loading state changes
  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    const result = await sendMessage(messageInput);
    if (result) {
      setMessageInput('');
    }
  };

  // Markdown components configuration
  const markdownComponents = {
    code({node, inline, className, children, ...props}) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return !inline ? (
        <div className="code-block-wrapper">
          <div className="code-block-header">
            {language && <span className="code-language">{language}</span>}
          </div>
          <pre className={className}>
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      ) : (
        <code className="inline-code" {...props}>
          {children}
        </code>
      );
    },
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

  const renderMessage = (message) => {
    return (
      <div 
        key={message.id} 
        className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
      >
        <div className="message-role">{message.role === 'user' ? 'You' : 'Assistant'}</div>
        <div className="message-content">
          <ReactMarkdown
            rehypePlugins={[rehypeSanitize, rehypePrism]}
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    );
  };

  // Display error message
  const renderError = () => {
    if (!error) return null;
    
    return (
      <div className="error-message">
        <p>Error: {error}</p>
        <button onClick={clearError} className="dismiss-error">Dismiss</button>
      </div>
    );
  };

  return (
    <div className="chat-container">
      {renderError()}
      
      <div className="messages-container">
        {!currentChat ? (
          <div className="empty-chat">
            <h2>No chat selected</h2>
            <p>Select a chat from the sidebar or create a new one</p>
          </div>
        ) : currentChat.messages.length === 0 ? (
          <div className="empty-chat">
            <h2>Start a new conversation</h2>
            <p>Type a message below to begin chatting</p>
          </div>
        ) : (
          <>
            {currentChat.messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </>
        )}
        
        {loading && (
          <div className="loading-indicator">
            Assistant is thinking...
          </div>
        )}
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