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
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // Max height 200px
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [messageInput]);

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
    // Allow Shift+Enter for new line
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage) return;

    const result = await sendMessage(trimmedMessage);
    if (result) {
      setMessageInput('');
      // Reset textarea height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return { 
    messageInput, 
    setMessageInput, 
    handleSendMessage, 
    handleKeyDown,
    textareaRef
  };
};

export const ChatContainer = () => {
  const { currentChat, loading, error, clearError, sendMessage } = useChatContext();
  const { 
    messageInput, 
    setMessageInput, 
    handleSendMessage, 
    handleKeyDown,
    textareaRef 
  } = useMessageHandler(sendMessage);
  const messagesEndRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChat?.messages]);

  // Focus the textarea when chat changes or loading state changes
  useEffect(() => {
    if (!loading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [loading, currentChat?.id]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Focus the textarea when pressing / (but not when in an input or textarea)
      if (e.key === '/' && 
          document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }
      // Submit form with Cmd+Enter or Ctrl+Enter
      else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (formRef.current && messageInput.trim()) {
          handleSendMessage(e);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [messageInput]);

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
          {loading && <div className="loading-indicator">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>}
          <div ref={messagesEndRef} />
        </div>

        <form 
          ref={formRef}
          className="input-container" 
          onSubmit={handleSendMessage} 
          autoComplete="off"
        >
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={loading || !currentChat}
              className="message-input"
              rows="1"
              autoComplete="off"
              spellCheck="true"
              aria-label="Message input"
            />
            <button
              type="submit"
              disabled={loading || !messageInput.trim() || !currentChat}
              className="send-button"
              aria-label="Send message"
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
          <div className="input-hints">
            <span className="hint">Shift + Enter for new line</span>
            <span className="hint">Ctrl + Enter to send</span>
          </div>
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