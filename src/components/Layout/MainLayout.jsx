import { useState, useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar';
import { ChatContainer } from '../ChatContainer/ChatContainer';

export const MainLayout = () => {
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

  const closeMobileSidebar = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
      document.body.classList.remove('sidebar-open');
    }
  };

  return (
    <div className="app-container">
      <Header 
        currentChatTitle={currentChatTitle}
        isSidebarCollapsed={isSidebarCollapsed}
        isMobile={isMobile}
        onMenuClick={toggleSidebar}
      />
      
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onClose={closeMobileSidebar}
          onToggle={toggleSidebar}
        />
        
        {isMobile && (
          <div 
            className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
            onClick={closeMobileSidebar}
            aria-hidden="true"
          />
        )}
        
        <div className="chat-area" onClick={closeMobileSidebar}>
          <ChatContainer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
