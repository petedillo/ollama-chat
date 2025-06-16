import { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchAllChatSessions, 
  fetchChatById, 
  createChat, 
  sendChatMessage,
  updateChat,
  deleteChat
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
  const createNewChat = async () => {
    try {
      setLoading(true);
      clearError();
      
      // Create a new chat with a default title
      const title = 'New Chat';
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
  
  // Update a chat's title
  const updateChatTitle = async (chatId, newTitle) => {
    if (!chatId || !newTitle?.trim()) return null;
    
    try {
      const updatedChat = await updateChat(chatId, { title: newTitle });
      
      // Update in chatSessions
      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === chatId ? { ...chat, title: newTitle, updatedAt: updatedChat.updatedAt } : chat
        )
      );
      
      // Update current chat if it's the one being edited
      if (currentChatId === chatId) {
        setCurrentChat(prev => ({
          ...prev,
          title: newTitle,
          updatedAt: updatedChat.updatedAt
        }));
      }
      
      return updatedChat;
    } catch (err) {
      setError(err.message);
      console.error('Error updating chat title:', err);
      throw err;
    }
  };
  
  // Delete a chat session
  const removeChat = async (chatId) => {
    if (!chatId) return false;
    
    try {
      await deleteChat(chatId);
      
      // Remove from chatSessions
      setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
      
      // If the deleted chat is the current one, switch to another chat or create a new one
      if (currentChatId === chatId) {
        const remainingChats = chatSessions.filter(chat => chat.id !== chatId);
        if (remainingChats.length > 0) {
          setCurrentChatId(remainingChats[0].id);
        } else {
          // No chats left, create a new one
          const newChat = await createNewChat();
          if (newChat) {
            setCurrentChatId(newChat.id);
          } else {
            setCurrentChatId(null);
            setCurrentChat(null);
          }
        }
      }
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting chat:', err);
      return false;
    }
  };

  // Send a message in the current chat
  const sendMessage = async (content) => {
    let chatId = currentChatId;
    let isNewChat = false;
    
    // Create a new chat if none exists
    if (!chatId) {
      const newChat = await createNewChat();
      if (!newChat) return null;
      chatId = newChat.id;
      isNewChat = true;
    }
    
    try {
      setLoading(true);
      clearError();
      
      // For new chats, we need to wait a bit to ensure the chat is created
      if (isNewChat) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      const { userMessage, assistantMessage } = await sendChatMessage(chatId, content);
      
      // Update current chat with new messages
      setCurrentChat(prev => ({
        ...prev,
        messages: [...(prev?.messages || []), userMessage, assistantMessage],
        updatedAt: assistantMessage.createdAt
      }));
      
      // Update the chat in the sessions list
      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === chatId 
            ? { 
                ...chat, 
                updatedAt: assistantMessage.createdAt,
                // Update title if it's still the default title and this is the first message
                title: chat.title === 'New Chat' && isNewChat 
                  ? userMessage.content.slice(0, 30) + (userMessage.content.length > 30 ? '...' : '')
                  : chat.title
              } 
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
    updateChatTitle,
    removeChat,
    sendMessage,
    switchChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
