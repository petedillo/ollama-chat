import React, { useState, useEffect } from 'react';
import InputArea from './InputArea';
import MobileInputArea from './MobileInputArea';

const ResponsiveInputArea = (props) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile ? (
    <MobileInputArea {...props} />
  ) : (
    <InputArea {...props} />
  );
};

export default ResponsiveInputArea;
