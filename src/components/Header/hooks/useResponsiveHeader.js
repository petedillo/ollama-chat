import { useState, useEffect } from 'react';

export const useResponsiveHeader = () => {
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

  return {
    isMobile,
    isSmallScreen,
    formatTitle
  };
};
