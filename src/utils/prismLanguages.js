import Prism from 'prismjs';

// 1. Import core components first
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';

// 2. Import languages in dependency order
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-css-extras';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';

// 3. Register zsh as an alias for bash if bash is available
if (Prism.languages.bash) {
  try {
    Prism.languages.zsh = { ...Prism.languages.bash };
    
    if (Prism.languages.zsh) {
      Prism.languages.zsh.parameter = [
        /\$[\w\d_]+/,
        /\$\{[^}]+\}/,
        /\$\([^)]+\)/,
        /[^\w\d\s]\-[a-zA-Z]+/,
      ];
    }
  } catch (error) {
    console.warn('Failed to register zsh language:', error);
  }
}

// 4. Add language aliases
const LANGUAGE_ALIASES = {
  'zsh': 'bash',
  'c++': 'cpp',
  'js': 'javascript',
  'py': 'python',
  'ts': 'typescript',
  'jsx': 'javascript',
  'tsx': 'typescript'
};

// 5. Export a function to get a language with fallbacks
export function getPrismLanguage(lang) {
  if (!lang) return 'text';
  
  // Normalize language name
  const normalizedLang = lang.toLowerCase();
  
  // Check for aliases
  const resolvedLang = LANGUAGE_ALIASES[normalizedLang] || normalizedLang;
  
  // Check if the language is loaded
  if (Prism.languages[resolvedLang]) {
    return resolvedLang;
  }
  
  // Fall back to text if language not found
  return 'text';
}

export default Prism;
