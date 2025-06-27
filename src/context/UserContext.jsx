import { createContext, useContext, useState } from 'react';

// Create the user context
const UserContext = createContext();

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Mock user data
const mockUser = {
  id: 'user-123',
  name: 'User',
  email: 'user@example.com',
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(mockUser);

  // Update user settings
  const updateSettings = (newSettings) => {
    setUser(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings,
      },
    }));
  };

  // Sign out (just for demonstration)
  const signOut = () => {
    // In a real app, this would clear auth tokens, etc.
    console.log('User signed out');
  };

  return (
    <UserContext.Provider 
      value={{
        user,
        updateSettings,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
