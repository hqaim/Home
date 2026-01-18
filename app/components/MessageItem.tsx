import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '@/types';

interface MessageItemProps {
  msg: Message;
  theme: string;
}

// --- Code Block Component with Copy ---
const CodeBlock = ({ children, className }: any) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';
  const content = String(children).replace(/\n$/, '');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!String(children).includes('\n')) {
     return <code className="inline-code">{children}</code>;
  }

  return (
    <div className="code-block-wrapper">
      <div className="code-header">
        <span className="code-lang">{language}</span>
        <button className="copy-code-btn" onClick={handleCopyCode} title="Copy Code">
          <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="code-content">
        <code>{children}</code>
      </pre>
    </div>
  );
};

const MessageItem: React.FC<MessageItemProps> = ({ msg, theme }) => {
  const [msgCopied, setMsgCopied] = useState(false);
  const isAssistant = msg.role === 'assistant';

  // --- General Message Copy ---
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(msg.content).then(() => {
      setMsgCopied(true);
      setTimeout(() => setMsgCopied(false), 2000);
    });
  };

  return (
    <div className={`message-row ${!isAssistant ? 'user-msg' : 'ai-msg'}`}>
      {isAssistant && (
        <div className="message-avatar">
          <img 
            src={theme === 'light' ? "https://assets.hqaim.com/images/HQAIM_ICON.svg" : "https://assets.hqaim.com/images/HQAIM-App_Logo.svg"} 
            alt="AI" 
          />
        </div>
      )}

      <div className="message-bubble-wrapper">
        <div className="message-content markdown-content">
          <ReactMarkdown components={{ code: CodeBlock }}>
            {msg.content}
          </ReactMarkdown>
        </div>

        {/* RESTORED: Copy Button for AI Messages */}
        {isAssistant && (
          <div className="message-actions">
            <button 
              className={`action-btn ${msgCopied ? 'copied' : ''}`} 
              onClick={handleCopyMessage}
              title="Copy Response"
            >
              <i className={`fa-solid ${msgCopied ? 'fa-check' : 'fa-copy'}`}></i>
              <span>{msgCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
