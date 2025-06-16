import { useState, useRef, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import './Sidebar.css';
import { useChatContext } from '../../context/ChatContext';

export const Sidebar = () => {
  const { 
    chatSessions, 
    currentChatId, 
    loading, 
    createNewChat, 
    updateChatTitle,
    removeChat,
    switchChat 
  } = useChatContext();
  
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const editInputRef = useRef(null);

  const handleCreateNewChat = () => {
    createNewChat();
    setShowDeleteConfirm(null);
  };

  const handleChatSelect = (chatId, e) => {
    // Don't switch if clicking on edit/delete buttons
    if (e && (e.target.closest('.edit-button') || e.target.closest('.delete-button'))) {
      return;
    }
    switchChat(chatId);
    setShowDeleteConfirm(null);
  };
  
  const startEditing = (chat, e) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
    setShowDeleteConfirm(null);
    
    // Focus the input after a small delay to ensure it's rendered
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
        editInputRef.current.select();
      }
    }, 0);
  };
  
  const saveEdit = async (e) => {
    e.stopPropagation();
    if (!editingChatId || !editTitle.trim()) return;
    
    try {
      await updateChatTitle(editingChatId, editTitle.trim());
      setEditingChatId(null);
    } catch (err) {
      console.error('Failed to update chat title:', err);
    }
  };
  
  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditingChatId(null);
  };
  
  const handleDeleteClick = (chatId, e) => {
    e.stopPropagation();
    setShowDeleteConfirm(showDeleteConfirm === chatId ? null : chatId);
  };
  
  const confirmDelete = async (chatId, e) => {
    e.stopPropagation();
    await removeChat(chatId);
    setShowDeleteConfirm(null);
  };
  
  const handleKeyDown = (e, chatId) => {
    if (e.key === 'Enter') {
      saveEdit(e);
    } else if (e.key === 'Escape') {
      cancelEdit(e);
    }
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
  
  // Close edit mode when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editingChatId && !e.target.closest('.editing')) {
        setEditingChatId(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingChatId]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button 
          className="new-chat-button" 
          onClick={handleCreateNewChat}
          disabled={loading}
        >
          <FiPlus className="new-chat-icon" />
          <span>New Chat</span>
        </button>
      </div>
      
      <div className="chat-list">
        {loading && chatSessions.length === 0 ? (
          <div className="loading-indicator">Loading chats...</div>
        ) : chatSessions.length === 0 ? (
          <div className="empty-state">
            <p>No chat sessions yet</p>
            <p>Start a new conversation!</p>
          </div>
        ) : (
          chatSessions.map(chat => (
            <div 
              key={chat.id} 
              className={`chat-item ${chat.id === currentChatId ? 'active' : ''} ${chat.id === editingChatId ? 'editing' : ''}`}
              onClick={(e) => handleChatSelect(chat.id, e)}
            >
              {editingChatId === chat.id ? (
                <div className="edit-title-container">
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, chat.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="edit-title-input"
                    placeholder="Chat title"
                  />
                  <button 
                    className="save-edit-button"
                    onClick={saveEdit}
                    title="Save"
                  >
                    <FiCheck />
                  </button>
                  <button 
                    className="cancel-edit-button"
                    onClick={cancelEdit}
                    title="Cancel"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <div className="chat-content">
                  <div className="chat-title">{chat.title || 'Untitled Chat'}</div>
                  <div className="chat-date">{formatDate(chat.updatedAt || chat.createdAt)}</div>
                  <div className="chat-actions">
                    <button 
                      className="edit-button"
                      onClick={(e) => startEditing(chat, e)}
                      title="Rename chat"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <div className="delete-wrapper">
                      <button 
                        className="delete-button"
                        onClick={(e) => handleDeleteClick(chat.id, e)}
                        title="Delete chat"
                      >
                        <FiTrash2 size={14} />
                      </button>
                      {showDeleteConfirm === chat.id && (
                        <div className="delete-confirm">
                          <span>Delete?</span>
                          <button 
                            className="confirm-delete"
                            onClick={(e) => confirmDelete(chat.id, e)}
                          >
                            Yes
                          </button>
                          <button 
                            className="cancel-delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(null);
                            }}
                          >
                            No
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
};