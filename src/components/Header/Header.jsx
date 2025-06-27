import { FiMenu } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import './Header.css';

export const Header = ({ onMenuClick, currentChatTitle }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 480);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const small = window.innerWidth < 480;
      setIsMobile(mobile);
      setIsSmallScreen(small);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial state
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Format chat title with smart truncation
  const formatTitle = (title) => {
    if (!title) return 'New Chat';
    
    // Get the first two words
    const words = title.split(' ');
    if (words.length <= 1) return title; 
    
    // Always show first word + ": " + part of second word
    const minTitle = `${words[0]}: ${words[1].substring(0, 3)}...`;
    
    // Adjust max length based on screen size
    let maxLength;
    if (isSmallScreen) {
      maxLength = 25; 
    } else if (isMobile) {
      maxLength = 35;
    } else {
      return title; 
    }
    
    // If our minimum title is longer than max, use it
    if (minTitle.length >= maxLength) {
      return minTitle;
    }
    
    // Otherwise, show as much as we can while keeping at least the minimum
    return title.length > maxLength 
      ? `${title.substring(0, maxLength - 3)}...`
      : title;
  };

  return (
    <header className="header">
      <div className="header-left">
        {isMobile && (
          <button 
            className="mobile-menu-button" 
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <FiMenu size={24} />
          </button>
        )}
        <div className="header-content">
          <h1 className="app-title">Dio</h1>
          {currentChatTitle && (
            <div className="chat-title-container">
              <span className="divider">/</span>
              <h2 className="chat-title" title={currentChatTitle}>
                {formatTitle(currentChatTitle)}
              </h2>
            </div>
          )}
        </div>
      </div>
      <div className="header-actions">
        {/* Add any header actions here */}
      </div>
    </header>
  )
}