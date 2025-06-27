import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FaSpinner } from 'react-icons/fa';
import { MARKDOWN_COMPONENTS, MARKDOWN_PLUGINS } from '../constants/markdownComponents';
import './Message.css';

const Message = ({ message, isStreaming = false, isLast = false }) => {
  const isUser = message.role === 'user';
  const timestamp = new Date(message.createdAt || Date.now()).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`message ${isUser ? 'user-message' : 'assistant-message'} ${isLast ? 'last-message' : ''}`}>
      <div className="message-content">
        <div className="message-header">
          <span className="message-role">{isUser ? 'You' : 'Assistant'}</span>
          <span className="message-time">{timestamp}</span>
        </div>
        <div className={`message-text ${isStreaming && isLast ? 'streaming' : ''}`}>
          {isStreaming && isLast && !message.content ? (
            <div className="loading-indicator">
              <FaSpinner className="spinner" />
              <span>Generating response...</span>
            </div>
          ) : (
            <>
              <ReactMarkdown
                remarkPlugins={MARKDOWN_PLUGINS.remark}
                rehypePlugins={MARKDOWN_PLUGINS.rehype}
                components={MARKDOWN_COMPONENTS}
                skipHtml={true}
              >
                {message.content}
              </ReactMarkdown>
              {isStreaming && isLast && <span className="streaming-cursor">▍</span>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
