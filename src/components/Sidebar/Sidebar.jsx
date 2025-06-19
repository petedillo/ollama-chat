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
      
      <ChatList 
        chats={chatSessions}
        currentChatId={currentChatId}
        loading={loading}
        onChatSelect={handleChatSelect}
        onChatEdit={handleChatEdit}
        onChatDelete={handleChatDelete}
        onChatUpdateTitle={updateChatTitle}
      />
    </aside>
  );
};