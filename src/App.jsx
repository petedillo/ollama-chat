import { useState } from 'react';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar';
import { ChatContainer } from './components/ChatContainer/ChatContainer';
import { ChatProvider } from './context/ChatContext';
import './App.css';

function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <ChatProvider>
      <div className={`app-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        <div className="main-container">
          <Header />
          <main className="main-content">
            <ChatContainer />
          </main>
        </div>
      </div>
    </ChatProvider>
  );
}

export default App
