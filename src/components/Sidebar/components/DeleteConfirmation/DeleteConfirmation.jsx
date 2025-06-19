import { useEffect, useRef } from 'react';
import './DeleteConfirmation.css';

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
      <div className="delete-confirm-buttons">
        <button 
          className="confirm-delete"
          onClick={handleConfirm}
          type="button"
          aria-label="Confirm delete"
        >
          Delete
        </button>
        <button 
          className="cancel-delete"
          onClick={handleCancel}
          type="button"
          aria-label="Cancel delete"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};