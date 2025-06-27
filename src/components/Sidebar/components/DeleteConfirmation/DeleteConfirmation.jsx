import { useEffect, useRef } from 'react';
import './DeleteConfirmation.css';
import { FiAlertTriangle, FiCheck, FiX } from 'react-icons/fi';

export const DeleteConfirmation = ({ onConfirm, onCancel }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  return (
    <div className="delete-confirmation-overlay">
      <div className="delete-confirmation-modal" ref={modalRef}>
        <div className="delete-confirmation-header">
          <FiAlertTriangle className="delete-warning-icon" />
          <h3 className="delete-confirmation-title">Confirm Deletion</h3>
        </div>
        <p className="delete-confirmation-text">
          Are you sure you want to permanently delete this chat?
        </p>
        <div className="delete-confirmation-actions">
          <button onClick={onCancel} className="delete-action-btn cancel-btn">
            <FiX /> No
          </button>
          <button onClick={onConfirm} className="delete-action-btn confirm-btn">
            <FiCheck /> Yes
          </button>
        </div>
      </div>
    </div>
  );
};