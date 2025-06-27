import { FiMenu } from 'react-icons/fi';
import './MobileHeader.css';

export const MobileHeader = ({ onMenuClick, currentChatTitle, formatTitle }) => {
  return (
    <header className="mobile-header">
      <div className="mobile-header-left">
        <button 
          className="mobile-menu-button" 
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <FiMenu size={24} />
        </button>
        <div className="mobile-header-content">
          <h1 className="mobile-app-title">Dio</h1>
          {currentChatTitle && (
            <div className="mobile-chat-title-container">
              <span className="mobile-divider">/</span>
              <h2 className="mobile-chat-title" title={currentChatTitle}>
                {formatTitle(currentChatTitle)}
              </h2>
            </div>
          )}
        </div>
      </div>
      <div className="mobile-header-actions">
        {/* Mobile-specific actions can go here */}
      </div>
    </header>
  );
};
