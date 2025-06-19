import { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { DeleteConfirmation } from '../DeleteConfirmation/DeleteConfirmation';
import { EditChatForm } from '../EditChatForm/EditChatForm';
import './ChatItem.css';

export const ChatItem = ({
  chat,
  currentChatId,
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

  // Get the first message preview (first 30 chars) if it exists
  const messagePreview = chat?.messages?.[0]?.content?.substring(0, 30) || '';
  const isCurrentChat = chat.id === currentChatId;

  const initial = chat.title ? chat.title.charAt(0).toUpperCase() : 'N';

  if (isEditing) {
    return (
      <EditChatForm
        initialTitle={chat.title}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    );
  }

  if (isDeleting) {
    return (
      <DeleteConfirmation
        onConfirm={handleConfirmDeleteClick}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <li
      className={`chat-item ${isCurrentChat ? 'active' : ''} ${isEditing ? 'editing' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={chat.title || 'Untitled Chat'}
    >
      <div className="chat-item-initial" aria-hidden="true">
        {initial}
      </div>
      <div className="chat-item-content" style={{ height: '100%', display: 'flex', alignItems: 'center', width: '100%' }}>
        <div className="chat-item-content">
          <div className="chat-item-title">
            {chat.title || ''}
          </div>
          <div className="chat-preview">
            {messagePreview}
          </div>
        </div>
        <div className="chat-item-actions">
          <button
            className="edit-button"
            onClick={handleEditClick}
            aria-label="Edit chat title"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            className="delete-button"
            onClick={handleDeleteClick}
            aria-label="Delete chat"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
    </li>
  );
};