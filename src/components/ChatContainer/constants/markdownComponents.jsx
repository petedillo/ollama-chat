
import { CodeBlock } from '../CodeBlock/CodeBlock';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

// Register languages
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';

export const MARKDOWN_COMPONENTS = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    
    if (inline || !match) {
      return <code className={className} {...props}>{children}</code>;
    }
    
    return (
      <CodeBlock language={match[1].toLowerCase()}>
        {String(children).replace(/\n$/, '')}
      </CodeBlock>
    );
  },
  p: ({ children }) => <p className="markdown-p">{children}</p>,
  h1: ({ children }) => <h1 className="markdown-h1">{children}</h1>,
  h2: ({ children }) => <h2 className="markdown-h2">{children}</h2>,
  h3: ({ children }) => <h3 className="markdown-h3">{children}</h3>,
  a: ({ children, href }) => (
    <a className="markdown-link" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="markdown-ul">{children}</ul>,
  ol: ({ children }) => <ol className="markdown-ol">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="markdown-blockquote">{children}</blockquote>
  ),
  table: ({ children }) => <table className="markdown-table">{children}</table>,
  th: ({ children }) => <th className="markdown-th">{children}</th>,
  td: ({ children }) => <td className="markdown-td">{children}</td>
};

export const MARKDOWN_PLUGINS = {
  rehype: [rehypeSanitize],
  remark: [remarkGfm]
};
