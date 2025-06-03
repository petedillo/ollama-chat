import { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchAllChatSessions, 
  fetchChatById, 
  createChat, 
  sendChatMessage 
} from '../services/chatService';

// Create the chat context
const ChatContext = createContext();

// Custom hook to use the chat context
export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [chatSessions, setChatSessions] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error state
  const clearError = () => {
    setError(null);
  };

  // Fetch all chat sessions
  const fetchChatSessions = async () => {
    try {
      setLoading(true);
      clearError();
      
      const data = await fetchAllChatSessions();
      setChatSessions(data);
      
      // Set current chat to the most recent one if none is selected
      if (data.length > 0 && !currentChatId) {
        setCurrentChatId(data[0].id);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching chat sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific chat session with messages
  const fetchChat = async (id) => {
    if (!id) return;
    
    try {
      setLoading(true);
      clearError();
      
      const data = await fetchChatById(id);
      setCurrentChat(data);
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching chat ${id}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new chat session
  const createNewChat = async (title = 'New Chat') => {
    try {
      setLoading(true);
      clearError();
      
      const newChat = await createChat(title);
      setChatSessions([newChat, ...chatSessions]);
      setCurrentChatId(newChat.id);
      setCurrentChat({ ...newChat, messages: [] });
      
      return newChat;
    } catch (err) {
      setError(err.message);
      console.error('Error creating new chat:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Send a message in the current chat
  const sendMessage = async (content) => {
    if (!currentChatId) {
      // Create a new chat if none exists
      const newChat = await createNewChat();
      if (!newChat) return null;
    }
    
    try {
      setLoading(true);
      clearError();
      
      const { userMessage, assistantMessage } = await sendChatMessage(currentChatId, content);
      
      // Update current chat with new messages
      setCurrentChat(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage, assistantMessage],
        updatedAt: assistantMessage.createdAt
      }));
      
      // Update the chat in the sessions list
      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, updatedAt: assistantMessage.createdAt } 
            : chat
        )
      );
      
      return { userMessage, assistantMessage };
    } catch (err) {
      setError(err.message);
      console.error('Error sending message:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Switch to a different chat
  const switchChat = (chatId) => {
    setCurrentChatId(chatId);
    clearError(); // Clear any errors when switching chats
  };

  // Load chat sessions on component mount
  useEffect(() => {
    fetchChatSessions();
  }, []);

  // Load current chat whenever currentChatId changes
  useEffect(() => {
    if (currentChatId) {
      fetchChat(currentChatId);
    }
  }, [currentChatId]);

  // Context value
  const value = {
    chatSessions,
    currentChat,
    currentChatId,
    loading,
    error,
    clearError,
    fetchChatSessions,
    createNewChat,
    sendMessage,
    switchChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
