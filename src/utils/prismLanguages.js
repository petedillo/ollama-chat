import Prism from 'prismjs';
import 'prismjs/components/prism-bash';

// Register zsh as an alias for bash since they share similar syntax
Prism.languages.zsh = Prism.languages.bash;

// Optional: Add any zsh-specific syntax if needed
Prism.languages.zsh['parameter'] = [
  /\$[\w\d_]+/,
  /\$\{[^}]+\}/,
  /\$\([^)]+\)/,
  /[^\w\d\s]\-[a-zA-Z]+/,
];

export default Prism;
