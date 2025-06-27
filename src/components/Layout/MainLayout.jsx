import { useState, useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar';
import { DesktopSidebar } from '../Sidebar/DesktopSidebar/DesktopSidebar';
import { ChatContainer } from '../ChatContainer/ChatContainer';
import './MainLayout.css';

export const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Start collapsed by default
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
          // Collapse sidebar by default on desktop
          setIsSidebarCollapsed(true);
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

  const toggleSidebar = (event) => {
    // Prevent event bubbling to avoid multiple toggles
    if (event) {
      event.stopPropagation();
    }
    
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
      setIsSidebarCollapsed(!isSidebarCollapsed);
      // Force reflow to ensure smooth animation
      const sidebar = document.querySelector('.desktop-sidebar');
      if (sidebar) {
        sidebar.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
      document.body.classList.remove('sidebar-open');
    }
  };

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="main-content">
        <Header 
          currentChatTitle={currentChatTitle} 
          onMenuClick={toggleSidebar}
          className={isMobile ? 'mobile-header' : 'desktop-header'}
        />
        
        <div className="content-wrapper">
          {!isMobile && (
            <DesktopSidebar 
              isCollapsed={isSidebarCollapsed}
              onToggle={toggleSidebar}
            />
          )}
          <div className="chat-area" onClick={isMobile ? closeMobileSidebar : undefined}>
            {isMobile && (
              <>
                <Sidebar 
                  isCollapsed={isSidebarCollapsed} 
                  isMobile={true}
                  isOpen={sidebarOpen}
                  onClose={closeMobileSidebar}
                  onToggle={toggleSidebar}
                />
                <div 
                  className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
                  onClick={closeMobileSidebar}
                  aria-hidden="true"
                />
              </>
            )}
            <ChatContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
