import React from 'react';
import { ChatProvider } from './context/ChatContext.jsx';
import { UserProvider } from './context/UserContext';
import { AuthGuard } from './components/Auth/AuthGuard';
import { MainLayout } from './components/Layout/MainLayout';
import './App.css';

// Main App component that wraps everything with providers
function App() {
  return (
    <UserProvider>
      <ChatProvider>
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      </ChatProvider>
    </UserProvider>
  );
}

export default App;
