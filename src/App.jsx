import { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar';
import { ChatContainer } from './components/ChatContainer/ChatContainer';
import { ChatProvider, useChatContext } from './context/ChatContext.jsx';
import { UserProvider } from './context/UserContext';
import './App.css';

// Create a separate component that uses the chat context
const AppContent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 480);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentChatId, chatSessions } = useChatContext();
  
  const currentChat = chatSessions?.find(chat => chat.id === currentChatId);
  const currentChatTitle = currentChat?.title;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const small = window.innerWidth < 480;
      setIsMobile(mobile);
      setIsSmallScreen(small);
      
      if (!mobile && sidebarOpen) {
        setSidebarOpen(false);
        document.body.classList.remove('sidebar-open');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const toggleSidebar = (collapsed) => {
    if (isMobile) {
      const newState = !sidebarOpen;
      setSidebarOpen(newState);
      if (newState) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
    } else if (collapsed !== undefined) {
      setIsSidebarCollapsed(collapsed);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const closeSidebar = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
      document.body.classList.remove('sidebar-open');
    }
  };
  
  useEffect(() => {
    if (!isMobile) return;
    
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector('.sidebar');
      const menuButton = document.querySelector('.mobile-menu-button');
      
      if (sidebarOpen && sidebar && menuButton && 
          !sidebar.contains(event.target) && 
          !menuButton.contains(event.target)) {
        closeSidebar();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, sidebarOpen]);

  return (
    <div className={`app-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar} 
        isMobile={isMobile}
        isOpen={sidebarOpen}
      />
      {isMobile && (
        <div 
          className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      <div className="main-container">
        <Header 
          onMenuClick={toggleSidebar} 
          currentChatTitle={currentChatTitle}
        />
        <main className="main-content">
          <ChatContainer />
        </main>
      </div>
    </div>
  );
};

// Main App component that wraps everything with providers
function App() {
  return (
    <UserProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </UserProvider>
  );
}

export default App;
