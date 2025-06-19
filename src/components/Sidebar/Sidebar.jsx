import { FiPlus } from 'react-icons/fi';
import { ChatList } from './components/ChatList/ChatList';
import { useChatContext } from '../../context/ChatContext';
import './Sidebar.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const sidebarRef = useRef(null);
  
  const { 
    chatSessions, 
    currentChatId, 
    loading, 
    createNewChat, 
    updateChatTitle,
    removeChat,
    switchChat 
  } = useChatContext();
  
  // Sort chats by most recently updated and get the ones to display
  const sortedChats = [...chatSessions]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    
  // Get chats to show based on collapsed state
  const chatsToShow = isCollapsed ? sortedChats.slice(0, 5) : sortedChats;

  const handleCreateNewChat = () => {
    createNewChat();
    // Collapse sidebar on mobile after creating a new chat
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  };

  const handleChatSelect = (chatId) => {
    switchChat(chatId);
    // Collapse sidebar on mobile after selecting a chat
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  };
  
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsCollapsed(true);
    }
  };
  
  useEffect(() => {
    if (isCollapsed) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCollapsed]);

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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <aside 
        ref={sidebarRef}
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => isCollapsed && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="sidebar-header">
          <button 
            className="new-chat-button" 
            onClick={handleCreateNewChat}
            disabled={loading}
          >
            <FiPlus className="new-chat-icon" />
            <span className="button-text">New Chat</span>
          </button>
        </div>
        
        <div className="chat-list-container">
          <ChatList 
            chats={chatsToShow}
            currentChatId={currentChatId}
            loading={loading}
            onChatSelect={handleChatSelect}
            onChatEdit={handleChatEdit}
            onChatDelete={handleChatDelete}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
        </div>

        <button 
          className="toggle-sidebar-button"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </aside>
      
      {/* Clickable overlay when sidebar is expanded on mobile */}
      {!isCollapsed && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};