// Base API URL - can be configured in env vars if needed
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetch all chat sessions
 * @returns {Promise<Array>} Array of chat session objects
 */
export const fetchAllChatSessions = async () => {
  const response = await fetch(`${API_BASE_URL}/chat`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch chat sessions (${response.status})`);
  }
  return response.json();
};

/**
 * Fetch a single chat session with messages
 * @param {string} chatId - UUID of the chat session
 * @returns {Promise<Object>} Chat session object with messages
 */
export const fetchChatById = async (chatId) => {
  const response = await fetch(`${API_BASE_URL}/chat/${chatId}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch chat (${response.status})`);
  }
  return response.json();
};

/**
 * Create a new chat session
 * @param {string} title - Optional title for the chat (defaults to "New Chat")
 * @returns {Promise<Object>} Created chat session object
 */
export const createChat = async (title = 'New Chat') => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create chat (${response.status})`);
  }
  
  return response.json();
};

/**
 * Send a message in a chat session
 * @param {string} chatId - UUID of the chat session
 * @param {string} content - Message content
 * @param {string} role - Message role (defaults to "user")
 * @returns {Promise<Object>} Object containing userMessage and assistantMessage
 */
export const sendChatMessage = async (chatId, content, role = 'user') => {
  const response = await fetch(`${API_BASE_URL}/chat/${chatId}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, role }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to send message (${response.status})`);
  }
  
  return response.json();
};

/**
 * Update a chat session
 * @param {string} chatId - UUID of the chat session
 * @param {Object} updates - Object containing fields to update
 * @returns {Promise<Object>} Updated chat session object
 */
export const updateChat = async (chatId, updates) => {
  const response = await fetch(`${API_BASE_URL}/chat/${chatId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update chat (${response.status})`);
  }
  
  return response.json();
};

/**
 * Delete a chat session
 * @param {string} chatId - UUID of the chat session to delete
 * @returns {Promise<boolean>} True if deletion was successful
 */
export const deleteChat = async (chatId) => {
  const response = await fetch(`${API_BASE_URL}/chat/${chatId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete chat (${response.status})`);
  }
  
  return true;
};
