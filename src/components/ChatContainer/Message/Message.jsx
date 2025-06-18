import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import rehypePrism from '@mapbox/rehype-prism';
import remarkGfm from 'remark-gfm';
import { MARKDOWN_COMPONENTS } from '../constants/markdownComponents'; // .jsx extension not needed
import './Message.css';

const Message = ({ message }) => (
  <div className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}>
    <div className="message-role">{message.role === 'user' ? 'You' : 'Assistant'}</div>
    <div className="message-content">
      <ReactMarkdown
        rehypePlugins={[rehypeSanitize, rehypePrism]}
        remarkPlugins={[remarkGfm]}
        components={MARKDOWN_COMPONENTS}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  </div>
);

export default Message;
