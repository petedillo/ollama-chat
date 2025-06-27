import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import { getPrismLanguage } from '../../../utils/prismLanguages';
import './CodeBlock.css';

// Language titles for display
const LANGUAGE_TITLES = {
  'bash': 'Bash',
  'c': 'C',
  'cpp': 'C++',
  'css': 'CSS',
  'html': 'HTML',
  'javascript': 'JavaScript',
  'jsx': 'JSX',
  'json': 'JSON',
  'python': 'Python',
  'tsx': 'TSX',
  'typescript': 'TypeScript',
  'text': 'Text'
};

export const CodeBlock = ({ language, children }) => {
  const codeRef = useRef(null);
  
  // Get the normalized language with fallback handling
  const normalizedLanguage = getPrismLanguage(language);

  useEffect(() => {
    if (codeRef.current) {
      try {
        // Highlight the code block with error handling
        Prism.highlightElement(codeRef.current);
      } catch (error) {
        console.warn(`Failed to highlight code block with language: ${language}`, error);
        // Fallback to plain text
        codeRef.current.className = 'language-text';
      }
    }
  }, [children, language]);

  return (
    <pre className={`language-${normalizedLanguage}`}>
      <code ref={codeRef} className={`language-${normalizedLanguage}`}>
        {children}
      </code>
    </pre>
  );
};

export default CodeBlock;
