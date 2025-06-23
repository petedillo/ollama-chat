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
  onCancel,
  isCollapsed = false
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

  const avatarText = chat.title ? chat.title.charAt(0).toUpperCase() : 'C';
  const showActions = isHovered && !isCollapsed && !isEditing && !isDeleting;
  const messagePreview = chat?.messages?.[0]?.content?.substring(0, 30) || '';
  const isCurrentChat = chat.id === currentChatId;

  return (
    <li
      className={`chat-item ${isCurrentChat ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={isCollapsed ? chat.title || 'Untitled Chat' : undefined}
    >
      <div className="chat-item-avatar">
        {avatarText}
      </div>
      
      {!isCollapsed && (
        <div className="chat-item-content">
          <div className="chat-item-title">
            {chat.title || 'Untitled Chat'}
          </div>
          {messagePreview && (
            <div className="chat-item-preview">
              {messagePreview}
            </div>
          )}
        </div>
      )}

      {showActions && (
        <div className="chat-item-actions">
          <button
            className="chat-item-action"
            onClick={handleEditClick}
            aria-label="Edit chat title"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            className="chat-item-action"
            onClick={handleDeleteClick}
            aria-label="Delete chat"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      )}
    </li>
  );
};