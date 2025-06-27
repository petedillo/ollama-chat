import { useState, useEffect, useRef } from 'react';
import { FiEdit2, FiTrash2, FiMessageSquare } from 'react-icons/fi';
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
    // Close any open dialogs when clicking on a chat item
    if (isEditing || isDeleting) {
      onCancel();
    }
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

  // Refs for handling focus and animations
  const itemRef = useRef(null);
  const wasCollapsed = useRef(isCollapsed);
  
  // Handle animation when expanding/collapsing
  useEffect(() => {
    if (wasCollapsed.current !== isCollapsed && itemRef.current) {
      // Trigger reflow for animation
      itemRef.current.style.transition = 'none';
      void itemRef.current.offsetHeight; // Force reflow
      itemRef.current.style.transition = '';
    }
    wasCollapsed.current = isCollapsed;
  }, [isCollapsed]);

  if (isEditing && !isCollapsed) {
    return (
      <EditChatForm
        initialTitle={chat.title}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    );
  }

  if (isDeleting && !isCollapsed) {
    return (
      <DeleteConfirmation
        onConfirm={handleConfirmDeleteClick}
        onCancel={handleCancelEdit}
      />
    );
  }

  const avatarText = chat.title ? chat.title.charAt(0).toUpperCase() : 'C';
  const showActions = isHovered && !isCollapsed && !isEditing && !isDeleting;
  const messagePreview = chat?.messages?.[0]?.content?.replace(/[^\w\s]/gi, '').substring(0, 30) || '';
  const isCurrentChat = chat.id === currentChatId;
  const lastMessageTime = chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <li
      ref={itemRef}
      className={`chat-item ${isCurrentChat ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={isCollapsed ? chat.title || 'Untitled Chat' : undefined}
      data-testid={`chat-item-${chat.id}`}
    >
      <div className="chat-item-avatar" data-active={isCurrentChat}>
        {isCollapsed ? (
          <FiMessageSquare className="chat-icon" />
        ) : (
          <span>{avatarText}</span>
        )}
      </div>
      
      {!isCollapsed ? (
        <div className="chat-item-content">
          <div className="chat-item-header">
            <h3 className="chat-item-title" title={chat.title || 'Untitled Chat'}>
              {chat.title || 'New Chat'}
            </h3>
            <span className="chat-item-time" title={formatDate(chat.updatedAt)}>
              {lastMessageTime}
            </span>
          </div>
          {messagePreview && (
            <p className="chat-item-preview">
              {messagePreview}{messagePreview.length === 30 ? '...' : ''}
            </p>
          )}
        </div>
      ) : (
        <div className="chat-item-tooltip">
          {chat.title || 'New Chat'}
          {lastMessageTime && <span className="tooltip-time">{lastMessageTime}</span>}
        </div>
      )}
      
      {showActions && (
        <div className="chat-item-actions">
          <button
            className="chat-item-edit"
            onClick={handleEditClick}
            aria-label="Edit chat title"
            data-testid="edit-chat-button"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            className="chat-item-delete"
            onClick={handleDeleteClick}
            aria-label="Delete chat"
            data-testid="delete-chat-button"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )}
      
      {isCurrentChat && !isCollapsed && <div className="active-indicator"></div>}
    </li>
  );
};