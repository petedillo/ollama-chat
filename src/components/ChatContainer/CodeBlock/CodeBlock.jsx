import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import './CodeBlock.css';

// Register zsh as an alias for bash
Prism.languages.zsh = Prism.languages.bash;

// Add any zsh-specific syntax
Prism.languages.zsh['parameter'] = [
  /\$[\w\d_]+/,
  /\$\{[^}]+\}/,
  /\$\([^)]+\)/,
  /[^\w\d\s]\-[a-zA-Z]+/,
];

export const CodeBlock = ({ language, children }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      // Highlight the code block
      Prism.highlightElement(codeRef.current);
    }
  }, [children, language]);

  return (
    <pre className={`language-${language}`}>
      <code ref={codeRef} className={`language-${language}`}>
        {children}
      </code>
    </pre>
  );
};

export default CodeBlock;
