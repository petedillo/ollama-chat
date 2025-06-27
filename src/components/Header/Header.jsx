import { ResponsiveHeader } from './ResponsiveHeader';

export const Header = ({ onMenuClick, currentChatTitle }) => {
  return (
    <ResponsiveHeader 
      onMenuClick={onMenuClick} 
      currentChatTitle={currentChatTitle} 
    />
  );
};