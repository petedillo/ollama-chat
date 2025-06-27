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

  // Handle viewport changes and reset sidebar states accordingly
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const small = window.innerWidth < 480;
      const wasMobile = isMobile;
      
      // Always update screen size states
      setIsSmallScreen(small);
      
      // Only proceed with mobile state changes if it's different
      if (mobile !== wasMobile) {
        if (mobile) {
          // Switching to mobile view
          setIsMobile(true);
          setSidebarOpen(false);
          document.body.classList.remove('sidebar-open');
        } else {
          // Switching to desktop view
          setIsMobile(false);
          setSidebarOpen(false);
          document.body.classList.remove('sidebar-open');
          // Always expand the sidebar when switching to desktop
          setIsSidebarCollapsed(false);
        }
      }
    };

    // Throttle the resize handler to prevent excessive updates
    let resizeTimeout;
    const throttledResize = () => {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          resizeTimeout = null;
          handleResize();
        }, 100);
      }
    };

    window.addEventListener('resize', throttledResize);
    // Initial check
    handleResize();
    
    return () => {
      window.removeEventListener('resize', throttledResize);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, [isMobile, isSidebarCollapsed]);

  const toggleSidebar = (collapsed) => {
    if (isMobile) {
      // For mobile, just toggle the open state
      const newState = !sidebarOpen;
      setSidebarOpen(newState);
      if (newState) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
    } else {
      // For desktop, handle collapse/expand
      const newState = collapsed !== undefined ? collapsed : !isSidebarCollapsed;
      setIsSidebarCollapsed(newState);
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
