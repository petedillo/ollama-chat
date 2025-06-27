import React, { useState, useEffect, memo, useCallback, useRef } from 'react';
import { ChatItem } from '../ChatItem/ChatItem';
import { FiMessageSquare, FiLoader } from 'react-icons/fi';
import './ChatList.css';

export const ChatList = memo(({ 
  chats = [], 
  currentChatId, 
  loading, 
  onChatSelect, 
  onChatEdit, 
  onChatDelete,
  isCollapsed = false
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

  // Reset editing and deleting states when collapsing/expanding
  useEffect(() => {
    if (isCollapsed) {
      setEditingChatId(null);
      setDeletingChatId(null);
    }
  }, [isCollapsed]);
  
  // Auto-focus the edit input when editing starts
  const editInputRef = useRef(null);
  useEffect(() => {
    if (editingChatId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingChatId]);

  return (
    <div className={`chat-list ${isCollapsed ? 'collapsed' : ''}`}>
      {loading ? (
        <div className="loading-indicator">
          <FiLoader className="loading-icon" />
          {!isCollapsed && <span>Loading chats...</span>}
        </div>
      ) : chats.length === 0 ? (
        <div className="empty-state">
          <FiMessageSquare className="empty-state-icon" />
          {!isCollapsed && (
            <>
              <p className="empty-state-title">No Chats Yet</p>
              <p className="empty-state-text">Start a new conversation</p>
            </>
          )}
        </div>
      ) : (
        <div className="chat-items">
          {chats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              currentChatId={currentChatId}
              isActive={chat.id === currentChatId}
              isEditing={editingChatId === chat.id}
              isDeleting={deletingChatId === chat.id}
              onSelect={onChatSelect}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onConfirmDelete={handleConfirmDelete}
              onUpdateTitle={handleUpdateTitle}
              onCancel={handleCancel}
              isCollapsed={isCollapsed}
              editTitle={editTitle}
              onEditTitleChange={(e) => setEditTitle(e.target.value)}
              editInputRef={editingChatId === chat.id ? editInputRef : null}
            />
          ))}
        </div>
      )}
    </div>
  );
});