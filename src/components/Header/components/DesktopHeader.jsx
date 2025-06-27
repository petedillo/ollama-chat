import './DesktopHeader.css';

const truncateTitle = (title) => {
  if (!title) return '';
  return title.length > 15 ? `${title.substring(0, 15)}...` : title;
};

export const DesktopHeader = ({ currentChatTitle }) => {
  return (
    <header className="desktop-header">
      <div className="desktop-header-left">
        <h1 className="desktop-app-title">Dio</h1>
      </div>
      
      <div className="desktop-header-right">
        {currentChatTitle && (
          <h2 
            className="desktop-chat-title" 
            title={currentChatTitle}
          >
            {truncateTitle(currentChatTitle)}
          </h2>
        )}
      </div>
    </header>
  );
};
