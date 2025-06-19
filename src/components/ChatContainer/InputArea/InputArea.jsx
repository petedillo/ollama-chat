import React, { useEffect } from 'react';
import './InputArea.css';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';

const InputArea = ({
  messageInput,
  setMessageInput,
  handleSendMessage,
  handleKeyDown,
  textareaRef,
  loading,
  currentChat
}) => {
  // Focus the textarea when chat changes or loading state changes
  useEffect(() => {
    if (!loading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [loading, currentChat?.id]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
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
        if (messageInput.trim()) {
          handleSendMessage(e);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [messageInput]);

  return (
    <form 
      className="input-container" 
      onSubmit={handleSendMessage} 
      autoComplete="off"
    >
      <div className={`input-wrapper ${loading ? 'loading' : ''}`}>
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
          aria-label={loading ? 'Sending...' : 'Send message'}
        >
          {loading ? (
            <FaSpinner className="spinner-icon" />
          ) : (
            <FaPaperPlane className="send-icon" />
          )}
        </button>
      </div>
      <div className="input-hints">
        <span className="hint">Shift + Enter for new line</span>
        <span className="hint">Ctrl + Enter to send</span>
      </div>
    </form>
  );
};

export default InputArea;
