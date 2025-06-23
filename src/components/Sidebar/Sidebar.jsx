import { FiPlus } from 'react-icons/fi';
import { ChatList } from './components/ChatList/ChatList';
import { useChatContext } from '../../context/ChatContext';
import './Sidebar.css';
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
    <>
      <div 
        className="sidebar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sidebar-header">
          <button 
            className="new-chat-button" 
            onClick={handleCreateNewChat}
            disabled={loading}
            aria-label="New Chat"
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
          />
        </div>
      </div>
    </>
  );
};