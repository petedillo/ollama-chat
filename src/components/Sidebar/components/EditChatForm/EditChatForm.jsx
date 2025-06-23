import { useRef, useEffect, useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import './EditChatForm.css';

export const EditChatForm = ({ initialTitle = '', onSave, onCancel }) => {
  const [title, setTitle] = useState(initialTitle);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave(e);
    } else if (e.key === 'Escape') {
      handleCancel(e);
    }
  };

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSave = (e) => {
    e?.stopPropagation();
    if (title.trim()) {
      onSave(title.trim());
    }
  };

  const handleCancel = (e) => {
    e?.stopPropagation();
    onCancel(e);
  };

  return (
    <div className="edit-title-container">
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="edit-title-input"
        placeholder="Chat title"
      />
      <button 
        className="save-edit-button"
        onClick={handleSave}
        title="Save"
        disabled={!title.trim()}
      >
        <FiCheck />
      </button>
      <button 
        className="cancel-edit-button"
        onClick={handleCancel}
        title="Cancel"
        type="button"
      >
        <FiX />
      </button>
    </div>
  );
};