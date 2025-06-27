import './DesktopHeader.css';

const truncateTitle = (title) => {
  if (!title) return '';
  return title.length > 15 ? `${title.substring(0, 15)}...` : title;
};

export const DesktopHeader = ({ currentChatTitle, formatTitle }) => {
  return (
    <header className="desktop-header">
      <div className="desktop-header-content">
        <div className="desktop-header-actions">
          {currentChatTitle && (
            <h2 
              className="desktop-chat-title" 
              title={currentChatTitle}
            >
              {formatTitle ? formatTitle(currentChatTitle) : truncateTitle(currentChatTitle)}
            </h2>
          )}
        </div>
      </div>
    </header>
  );
};
