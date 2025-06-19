import { useState } from 'react';
import { ChatItem } from '../ChatItem/ChatItem';
import './ChatList.css';

export const ChatList = ({ 
  chats = [], 
  currentChatId, 
  loading, 
  onChatSelect, 
  onChatEdit, 
  onChatDelete,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [editingChatId, setEditingChatId] = useState(null);
  const [deletingChatId, setDeletingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleEdit = (chat) => {
    setEditTitle(chat.title || 'Untitled Chat');
    setEditingChatId(chat.id);
    setDeletingChatId(null);
  };

  const handleDelete = (chatId, e) => {
    e?.stopPropagation();
    setDeletingChatId(chatId);
    setEditingChatId(null);
  };

  const handleUpdateTitle = async (chatId, newTitle) => {
    if (!newTitle.trim()) return;
    
    try {
      const success = await onChatEdit(chatId, newTitle.trim());
      if (success) {
        setEditingChatId(null);
      }
    } catch (error) {
      console.error('Failed to update chat title:', error);
    }
  };

  const handleConfirmDelete = async (chatId, e) => {
    e?.stopPropagation();
    try {
      const success = await onChatDelete(chatId);
      if (success) {
        setDeletingChatId(null);
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const handleCancel = (e) => {
    e?.stopPropagation();
    setEditingChatId(null);
    setDeletingChatId(null);
  };

  const handleToggleCollapse = (e) => {
    e?.stopPropagation();
    onToggleCollapse?.();
  };

  return (
    <div className="chat-list">
      {loading ? (
        <div className="loading-indicator">Loading chats...</div>
      ) : chats.length === 0 ? (
        <div className="empty-state">No chats yet. Start a new chat!</div>
      ) : (
        <div>
          {chats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              currentChatId={currentChatId}
              isActive={chat.id === currentChatId}
              isCollapsed={isCollapsed}
              onSelect={onChatSelect}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUpdateTitle={handleUpdateTitle}
              onConfirmDelete={handleConfirmDelete}
              onCancel={handleCancel}
              isEditing={editingChatId === chat.id}
              isDeleting={deletingChatId === chat.id}
              editTitle={editTitle}
              onEditTitleChange={(e) => setEditTitle(e.target.value)}
            />
          ))}
          {chats.length > 5 && (
            <button 
              className="toggle-chat-list"
              onClick={handleToggleCollapse}
              aria-label={isCollapsed ? 'Show all chats' : 'Show less chats'}
            >
              {isCollapsed ? (
                <>
                  <FiChevronDown className="toggle-icon" />
                  <span className="toggle-text">Show more</span>
                </>
              ) : (
                <>
                  <FiChevronUp className="toggle-icon" />
                  <span className="toggle-text">Show less</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};