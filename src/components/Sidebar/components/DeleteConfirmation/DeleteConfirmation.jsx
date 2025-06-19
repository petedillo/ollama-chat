import { useEffect, useRef } from 'react';
import './DeleteConfirmation.css';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
export const DeleteConfirmation = ({ onConfirm, onCancel }) => {
  const containerRef = useRef(null);

  // Handle click outside to cancel
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onCancel(e);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  const handleConfirm = (e) => {
    e?.stopPropagation();
    onConfirm(e);
  };

  const handleCancel = (e) => {
    e?.stopPropagation();
    onCancel(e);
  };

  return (
    <div 
      ref={containerRef}
      className="delete-confirm-container"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="delete-confirm-content">
        <FaTrash className="delete-icon" />
        <span className="delete-confirm-text">Delete?</span>
        <div className="delete-confirm-actions">
          <button 
            type="button"
            className="cancel-button"
            onClick={handleCancel}
            aria-label="Cancel deletion"
          >
            <FaTimes size={14} />
          </button>
          <button 
            type="button"
            className="confirm-button"
            onClick={handleConfirm}
            aria-label="Confirm deletion"
          >
            <FaCheck size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};