import { FiPlus, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { ChatList } from './components/ChatList/ChatList';
import { UserProfile } from './components/UserProfile/UserProfile';
import { useChatContext } from '../../context/ChatContext.jsx';
import './Sidebar.css';

export const Sidebar = ({ isCollapsed, onToggle, isMobile, isOpen, onClose }) => {
  const sidebarClasses = [
    'sidebar',
    isCollapsed && !isMobile ? 'collapsed' : '',
    isMobile ? 'mobile' : '',
    isMobile && isOpen ? 'open' : ''
  ].filter(Boolean).join(' ');
  
  // Close sidebar when a chat is selected on mobile
  const handleChatSelect = (chatId) => {
    switchChat(chatId);
    if (isMobile) {
      onClose?.();
    }
  };
  const { 
    chatSessions, 
    currentChatId, 
    loading, 
    createNewChat, 
    updateChatTitle,
    removeChat,
    switchChat 
  } = useChatContext();
  
  // Sort chats by most recently updated
  const sortedChats = [...chatSessions]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    
  const chatsToShow = sortedChats;

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

  return (
    <div className={sidebarClasses}>
      <div className="sidebar-header">
        {(!isCollapsed || isMobile) && <h2 className="sidebar-title">Chats</h2>}
        {!isMobile && (
          <button className="toggle-btn" onClick={() => onToggle(!isCollapsed)}>
            {isCollapsed ? <FiChevronsRight /> : <FiChevronsLeft />}
          </button>
        )}
      </div>
      <div className="sidebar-content">
        <button 
          className="new-chat-button" 
          onClick={handleCreateNewChat} 
          disabled={loading}
        >
          <FiPlus />
          {!isCollapsed && <span>New Chat</span>}
        </button>
        <div className="chat-list-container">
          <ChatList 
            chats={chatsToShow}
            currentChatId={currentChatId}
            loading={loading}
            onChatSelect={handleChatSelect}
            onChatEdit={handleChatEdit}
            onChatDelete={handleChatDelete}
            isCollapsed={isCollapsed}
          />
        </div>
      </div>
      
      {/* User Profile Section */}
      <UserProfile isCollapsed={isCollapsed} />
    </div>
  );
};
