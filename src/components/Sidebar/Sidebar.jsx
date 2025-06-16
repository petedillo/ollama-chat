import './Sidebar.css'
import { useChatContext } from '../../context/ChatContext';

export const Sidebar = () => {
  const { 
    chatSessions, 
    currentChatId, 
    loading, 
    createNewChat, 
    switchChat 
  } = useChatContext();

  const handleCreateNewChat = () => {
    createNewChat();
  };

  const handleChatSelect = (chatId) => {
    switchChat(chatId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button 
          className="new-chat-button" 
          onClick={handleCreateNewChat}
        >
          New Chat
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
              className={`chat-item ${chat.id === currentChatId ? 'active' : ''}`}
              onClick={() => handleChatSelect(chat.id)}
            >
              <div className="chat-title">{chat.title}</div>
              <div className="chat-date">{formatDate(chat.updatedAt)}</div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};