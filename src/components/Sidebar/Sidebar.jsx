import { FiPlus, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { ChatList } from './components/ChatList/ChatList';
import { useChatContext } from '../../context/ChatContext';
import './Sidebar.css';



export const Sidebar = ({ isCollapsed, onToggle }) => {
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

  const handleChatSelect = (chatId) => {
    switchChat(chatId);
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
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!isCollapsed && <h1 className="sidebar-title">Dio Chat</h1>}
          <button className="toggle-btn" onClick={onToggle}>
            {isCollapsed ? <FiChevronsRight /> : <FiChevronsLeft />}
          </button>
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
      </div>
  );
};