import React, { useEffect, useRef, useState } from 'react';
import './InputArea.css';
import { FaPaperPlane, FaSpinner, FaExpand, FaCompress } from 'react-icons/fa';
import { useHotkeys } from 'react-hotkeys-hook';

const InputArea = ({
  messageInput,
  setMessageInput,
  handleSendMessage,
  handleKeyDown,
  textareaRef,
  loading,
  currentChat
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const formRef = useRef(null);
  const isComposing = useRef(false);

  // Auto-resize textarea based on content
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const maxHeight = isExpanded ? '50vh' : '200px';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        isExpanded ? 500 : 200
      )}px`;
      textareaRef.current.style.overflowY = 
        textareaRef.current.scrollHeight > 200 ? 'auto' : 'hidden';
    }
  };
  // Focus and adjust textarea on changes
  useEffect(() => {
    if (!loading && textareaRef.current) {
      textareaRef.current.focus();
      adjustTextareaHeight();
    }
  }, [loading, currentChat?.id, isExpanded]);

  // Adjust height when message changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [messageInput]);

  // Handle keyboard shortcuts
  // Handle keyboard shortcuts with react-hotkeys-hook
  useHotkeys('ctrl+enter, cmd+enter', (e) => {
    if (messageInput.trim() && !isComposing.current) {
      e.preventDefault();
      formRef.current.requestSubmit();
    }
  }, { enableOnFormTags: true }, [messageInput]);

  useHotkeys('/', (e) => {
    if (document.activeElement?.tagName !== 'INPUT' && 
        document.activeElement?.tagName !== 'TEXTAREA') {
      e.preventDefault();
      textareaRef.current?.focus();
    }
  }, { enableOnFormTags: false });

  const handleComposition = (e) => {
    isComposing.current = e.type === 'compositionstart';
  };

  const toggleExpand = (e) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
    setTimeout(() => {
      adjustTextareaHeight();
      textareaRef.current?.focus();
    }, 0);
  };

  return (
    <form 
      ref={formRef}
      className="input-container" 
      onSubmit={(e) => {
        e.preventDefault();
        if (!isComposing.current) {
          handleSendMessage(e);
        }
      }}
      autoComplete="off"
    >
      <div className={`input-wrapper ${loading ? 'loading' : ''}`}>
        <div className="input-content">
          <textarea
            ref={textareaRef}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleComposition}
            onCompositionEnd={handleComposition}
            placeholder="Message..."
            disabled={loading || !currentChat}
            className="message-input"
            rows="1"
            autoComplete="off"
            spellCheck="true"
            aria-label="Message input"
            style={{
              resize: 'none',
              maxHeight: isExpanded ? '50vh' : '200px',
              overflowY: 'auto'
            }}
          />
          <button
            type="button"
            onClick={toggleExpand}
            className="expand-button"
            aria-label={isExpanded ? 'Minimize' : 'Expand'}
            disabled={loading || !currentChat}
          >
            {isExpanded ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading || !messageInput.trim() || !currentChat}
          className="send-button"
          aria-label={loading ? 'Sending...' : 'Send message'}
          aria-busy={loading}
        >
          {loading ? (
            <FaSpinner className="spinner" />
          ) : (
            <FaPaperPlane className="icon" />
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
