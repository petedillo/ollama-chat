import React, { useEffect, useRef } from 'react';
import './InputArea.css';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
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
  const formRef = useRef(null);
  const isComposing = useRef(false);

  // Auto-resize textarea based on content
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
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
  }, [loading, currentChat?.id]);

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

  useHotkeys('ctrl+k, cmd+k', (e) => {
    if (document.activeElement?.tagName !== 'TEXTAREA') {
      e.preventDefault();
      textareaRef.current?.focus();
    }
  }, { enableOnFormTags: true });

  const handleComposition = (e) => {
    isComposing.current = e.type === 'compositionstart';
  };

  return (
    <form 
      ref={formRef}
      className="input-form" 
      onSubmit={(e) => {
        e.preventDefault();
        if (!isComposing.current) {
          handleSendMessage(e);
        }
      }}
      autoComplete="off"
    >
      <div className={`input-container ${loading ? 'loading' : ''}`}>
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
            overflowY: 'auto'
          }}
        />
        <button
          type="submit"
          disabled={loading || !messageInput.trim() || !currentChat}
          className="send-button"
          aria-label={loading ? 'Sending...' : 'Send message'}
          aria-busy={loading}
          style={{
            opacity: (loading || !messageInput.trim() || !currentChat) ? 0.6 : 1
          }}
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
        <span className="hint">Ctrl + K to focus input</span>
      </div>
    </form>
  );
};

export default InputArea;
