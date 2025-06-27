import { useState, useEffect, useRef } from 'react';
import { FiPlus } from 'react-icons/fi';
import './ToggleArrow.css';
import { ChatList } from '../components/ChatList/ChatList';
import { UserProfile } from '../components/UserProfile/UserProfile';
import { useChatContext } from '../../../context/ChatContext';
import './DesktopSidebar.css';

export const DesktopSidebar = ({ isCollapsed, onToggle }) => {
  const { 
    chatSessions, 
    currentChatId, 
    loading, 
    createNewChat, 
    updateChatTitle,
    removeChat,
    switchChat 
  } = useChatContext();
  
  const sidebarRef = useRef(null);
  
  // Sort chats by most recently updated
  const sortedChats = [...chatSessions]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    
  const handleCreateNewChat = () => {
    createNewChat();
  };

  const handleChatEdit = async (chatId, newTitle) => {
    try {
      await updateChatTitle(chatId, newTitle);
      return true;
    } catch (error) {
      console.error('Failed to update chat title:', error);
      return false;
    }
  };

  const handleChatDelete = async (chatId) => {
    try {
      await removeChat(chatId);
      return true;
    } catch (error) {
      console.error('Failed to delete chat:', error);
      return false;
    }
  };
  
  const handleChatSelect = (chatId) => {
    switchChat(chatId);
  };

  return (
    <div className="desktop-sidebar-container">
      <button 
        type="button"
        className="sidebar-toggle-btn"
        onClick={onToggle}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <div className={`toggle-arrow ${isCollapsed ? 'right' : 'left'}`}>
          <span className="arrow-line"></span>
          <span className="arrow-line"></span>
        </div>
      </button>
      
      <div 
        ref={sidebarRef}
        className={`desktop-sidebar ${isCollapsed ? 'collapsed' : ''}`}
      >
        <div className="sidebar-header">
          <h2 className="sidebar-title">Chats</h2>
        </div>
      
      <div className="sidebar-content">
        <button 
          className="new-chat-button" 
          onClick={handleCreateNewChat}
          disabled={loading}
          aria-label="New Chat"
        >
          <FiPlus />
          {!isCollapsed && <span>New Chat</span>}
        </button>
        
        <div className="chat-list-container">
          <ChatList
            chats={sortedChats}
            currentChatId={currentChatId}
            onChatSelect={handleChatSelect}
            onChatEdit={handleChatEdit}
            onChatDelete={handleChatDelete}
            isCollapsed={isCollapsed}
          />
        </div>
      </div>
      
        <div className="sidebar-footer">
          <UserProfile isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  );
};
