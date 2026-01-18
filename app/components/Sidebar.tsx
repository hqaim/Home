import React from 'react';

interface SidebarProps {
  onNewChat: (e: React.MouseEvent) => void;
  recentChats?: any[]; // Now used
  onLoadChat?: (id: string) => void; // Now used
  onClearHistory?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewChat, recentChats = [], onLoadChat }) => (
  <aside className="left-sidebar">
    <a href="#" className="new-chat-btn" onClick={onNewChat}>
      <i className="fa-solid fa-plus"></i> New Chat
    </a>
    
    <nav className="sidebar-nav">
      <a href="https://www.hqaim.com/about.html" className="sidebar-link"><i className="fa-solid fa-layer-group"></i> About</a>
      <a href="https://aiartisan.hqaim.com/" className="sidebar-link"><i className="fa-solid fa-wand-magic-sparkles"></i> AI Artisan</a>
      <a href="https://patternforge.hqaim.com/" className="sidebar-link"><i className="fa-solid fa-vector-square"></i> Pattern Forge</a>
      <a href="https://prompt.hqaim.com/" className="sidebar-link"><i className="fa-solid fa-terminal"></i> Prompt</a>
      <a href="https://geo.hqaim.com/" className="sidebar-link"><i className="fa-solid fa-magnifying-glass"></i> GEO</a>
      <a href="https://blog.hqaim.com/" className="sidebar-link"><i className="fa-solid fa-rss"></i> Blog</a>
      <a href="https://www.hqaim.com/contact.html" className="sidebar-link"><i className="fa-solid fa-envelope"></i> Contact</a>
    </nav>

    {/* DYNAMIC HISTORY SECTION */}
    <div className="chat-history">
      <span className="menu-label">Recent Chats</span>
      
      {/* Empty State */}
      {(!recentChats || recentChats.length === 0) && (
        <span style={{ fontSize: '0.8rem', opacity: 0.5, padding: '0 0.8rem' }}>No recent chats</span>
      )}

      {/* Map Logic */}
      {recentChats && recentChats.map((chat: any) => (
        <a 
          key={chat.id} 
          href="#" 
          className="history-link"
          onClick={(e) => { 
            e.preventDefault(); 
            if (onLoadChat) onLoadChat(chat.id); 
          }}
        >
          {chat.title || "Untitled Chat"}
        </a>
      ))}
    </div>

    <div className="sidebar-footer">
      <a href="#" className="signup-btn-side">Sign Up / Login</a>
    </div>
  </aside>
);

export default Sidebar;


