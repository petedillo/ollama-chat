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
      // First, update the UI optimistically
      const wasLastChat = chatSessions.length === 1 && chatSessions[0].id === chatId;
      
      // If this is the last chat, clear the current chat first
      if (wasLastChat) {
        setCurrentChatId(null);
        setCurrentChat(null);
      }
      
      // Remove the chat from sessions
      const updatedChatSessions = chatSessions.filter(chat => chat.id !== chatId);
      setChatSessions(updatedChatSessions);
      
      // Perform the actual deletion
      await deleteChat(chatId);
      
      // If we deleted the current chat
      if (currentChatId === chatId) {
        if (updatedChatSessions.length > 0) {
          // Switch to the first available chat
          const nextChatId = updatedChatSessions[0].id;
          setCurrentChatId(nextChatId);
          
          // Fetch the chat to update the currentChat state
          const chatData = await fetchChatById(nextChatId);
          setCurrentChat(chatData);
        } else if (!wasLastChat) {
          // Only create a new chat if this wasn't the last chat
          // (if it was the last chat, we already cleared the state)
          const newChat = await createNewChat();
          if (newChat) {
            setCurrentChatId(newChat.id);
            setCurrentChat({ ...newChat, messages: [] });
          } else {
            // Reset to initial state if creating new chat fails
            setCurrentChatId(null);
            setCurrentChat(null);
          }
        }
      }
      
      return true;
    } catch (err) {
      // If there was an error, refetch the chats to restore consistent state
      await fetchChatSessions();
      if (currentChatId) {
        await fetchChat(currentChatId);
      } else if (chatSessions.length > 0) {
        // If we have chats but no current chat, set the first one as current
        setCurrentChatId(chatSessions[0].id);
        await fetchChat(chatSessions[0].id);
      }
      
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
