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
  onChatUpdateTitle
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

  if (loading && chats.length === 0) {
    return <div className="loading-indicator">Loading chats...</div>;
  }

  if (chats.length === 0) {
    return (
      <div className="empty-state">
        <p>No chat sessions yet</p>
        <p>Start a new conversation!</p>
      </div>
    );
  }

  return (
    <div className="chat-list">
      {chats.map(chat => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === currentChatId}
          isEditing={editingChatId === chat.id}
          isDeleting={deletingChatId === chat.id}
          editTitle={editTitle}
          onEditTitleChange={setEditTitle}
          onSelect={onChatSelect}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onConfirmDelete={handleConfirmDelete}
          onUpdateTitle={handleUpdateTitle}
          onCancel={handleCancel}
        />
      ))}
    </div>
  );
};