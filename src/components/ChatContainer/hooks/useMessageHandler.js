import { useState, useEffect, useRef } from 'react';

export const useMessageHandler = (sendMessage) => {
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
    e?.preventDefault();
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
