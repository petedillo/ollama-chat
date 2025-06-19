import { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { DeleteConfirmation } from '../DeleteConfirmation/DeleteConfirmation';
import { EditChatForm } from '../EditChatForm/EditChatForm';
import './ChatItem.css';

export const ChatItem = ({
  chat,
  isActive,
  isEditing,
  isDeleting,
  editTitle,
  onEditTitleChange,
  onSelect,
  onEdit,
  onDelete,
  onConfirmDelete,
  onUpdateTitle,
  onCancel
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(chat.id);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(chat.id, e);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(chat);
  };

  const handleSaveEdit = (newTitle) => {
    onUpdateTitle(chat.id, newTitle);
  };

  const handleCancelEdit = (e) => {
    e?.stopPropagation();
    onCancel(e);
  };

  const handleConfirmDeleteClick = (e) => {
    onConfirmDelete(chat.id, e);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Maintain consistent height for all states
  const contentHeight = '60px';

  return (
    <div 
      className={`chat-item ${isActive ? 'active' : ''} ${isEditing ? 'editing' : ''} ${isDeleting ? 'deleting' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ minHeight: contentHeight, height: contentHeight }}
    >
      <div className="chat-item-content" style={{ height: '100%', display: 'flex', alignItems: 'center', width: '100%' }}>
        {isEditing ? (
          <EditChatForm 
            initialTitle={editTitle}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        ) : isDeleting ? (
          <div className="delete-confirmation-wrapper" style={{ width: '100%' }}>
            <DeleteConfirmation 
              onConfirm={handleConfirmDeleteClick}
              onCancel={handleCancelEdit}
            />
          </div>
        ) : (
          <div className="chat-content" style={{ width: '100%' }}>
            <div className="chat-info" style={{ flex: 1, minWidth: 0 }}>
              <div className="chat-title">{chat.title || 'Untitled Chat'}</div>
              <div className="chat-date">{formatDate(chat.updatedAt || chat.createdAt)}</div>
            </div>
            <div className={`chat-actions ${isHovered || isActive ? 'visible' : ''}`}>
              <button 
                className="edit-button"
                onClick={handleEditClick}
                title="Rename chat"
                aria-label="Rename chat"
              >
                <FiEdit2 size={16} />
              </button>
              <button 
                className="delete-button"
                onClick={handleDeleteClick}
                title="Delete chat"
                aria-label="Delete chat"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};