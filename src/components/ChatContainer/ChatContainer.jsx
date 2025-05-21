import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import rehypePrism from '@mapbox/rehype-prism'
import remarkGfm from 'remark-gfm'
import 'prismjs/themes/prism-tomorrow.css'
import { sendChatMessage } from '../../services/ollamaService'
import './ChatContainer.css'

export const ChatContainer = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef(null)
  const inputRef = useRef(null) // Add ref for input focus

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Focus input after message is sent
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isLoading])

  // Handle streaming response from Ollama
  const handleStreamResponse = async (reader, decoder, assistantMessage) => {
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(Boolean)
        
        for (const line of lines) {
          const data = JSON.parse(line)
          if (data.done) break
          
          const messageContent = data.message?.content || data.content || ''
          assistantMessage.content += messageContent
          setMessages(prev => [...prev.slice(0, -1), { ...assistantMessage }])
        }
      }
    } catch (error) {
      console.error('Error processing stream:', error)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await sendChatMessage([...messages, userMessage])
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = { role: 'assistant', content: '' }
      setMessages(prev => [...prev, assistantMessage])

      await handleStreamResponse(reader, decoder, assistantMessage)
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Markdown components configuration
  const markdownComponents = {
    code({node, inline, className, children, ...props}) {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''
      
      return !inline ? (
        <div className="code-block-wrapper">
          <div className="code-block-header">
            {language && <span className="code-language">{language}</span>}
          </div>
          <pre className={className}>
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      ) : (
        <code className="inline-code" {...props}>
          {children}
        </code>
      )
    },
    p: ({children}) => <p className="markdown-p">{children}</p>,
    h1: ({children}) => <h1 className="markdown-h1">{children}</h1>,
    h2: ({children}) => <h2 className="markdown-h2">{children}</h2>,
    h3: ({children}) => <h3 className="markdown-h3">{children}</h3>,
    a: ({children, href}) => <a className="markdown-link" href={href}>{children}</a>,
    ul: ({children}) => <ul className="markdown-ul">{children}</ul>,
    ol: ({children}) => <ol className="markdown-ol">{children}</ol>,
    blockquote: ({children}) => <blockquote className="markdown-blockquote">{children}</blockquote>,
    table: ({children}) => <table className="markdown-table">{children}</table>,
    th: ({children}) => <th className="markdown-th">{children}</th>,
    td: ({children}) => <td className="markdown-td">{children}</td>
  }

  // Message renderer
  const renderMessage = (msg, index) => {
    return (
      <div key={index} className={`message ${msg.role}`}>
        {msg.role === 'user' ? (
          msg.content
        ) : (
          <div className="markdown">
            <ReactMarkdown 
              rehypePlugins={[rehypeSanitize, rehypePrism]}
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    )
  }

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="message assistant loading">
      Assistant is typing...
    </div>
  )

  return (
    <div className="chat-container">
      <div className="messages" ref={chatContainerRef}>
        {messages.map((msg, index) => renderMessage(msg, index))}
        {isLoading && <LoadingIndicator />}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  )
}