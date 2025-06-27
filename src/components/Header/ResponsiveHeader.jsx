import { useResponsiveHeader } from './hooks/useResponsiveHeader';
import { MobileHeader } from './components/MobileHeader';
import { DesktopHeader } from './components/DesktopHeader';

export const ResponsiveHeader = ({ onMenuClick, currentChatTitle }) => {
  const { isMobile, formatTitle } = useResponsiveHeader();

  return isMobile ? (
    <MobileHeader 
      onMenuClick={onMenuClick} 
      currentChatTitle={currentChatTitle}
      formatTitle={formatTitle}
    />
  ) : (
    <DesktopHeader 
      currentChatTitle={currentChatTitle}
      formatTitle={formatTitle}
    />
  );
};
