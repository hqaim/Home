import React from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: (e: React.MouseEvent) => void;
  // ALIGNED WITH SIDEBAR: Optional array to prevent build type errors
  recentChats?: any[]; 
  onLoadChat?: (id: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  onNewChat, 
  recentChats = [], // Default to empty array if undefined
  onLoadChat 
}) => {
  return (
    <div className={`mobile-nav-overlay ${isOpen ? 'active' : ''}`} id="mobileOverlay">
      <a href="#" className="mobile-new-chat-btn" onClick={(e) => { onClose(); onNewChat(e); }}>
        <i className="fa-solid fa-plus"></i> New Chat
      </a>

      <a href="https://www.hqaim.com/about.html" className="mobile-nav-link" onClick={onClose}>About</a>
      <a href="https://aiartisan.hqaim.com/" className="mobile-nav-link" onClick={onClose}>AI Artisan</a>
      <a href="https://patternforge.hqaim.com/" className="mobile-nav-link" onClick={onClose}>Pattern Forge</a>
      <a href="https://prompt.hqaim.com/" className="mobile-nav-link" onClick={onClose}>Prompt</a>
      <a href="https://geo.hqaim.com/" className="mobile-nav-link" onClick={onClose}>GEO</a>
      <a href="https://blog.hqaim.com/" className="mobile-nav-link" onClick={onClose}>Blog</a>
      <a href="https://www.hqaim.com/contact.html" className="mobile-nav-link" onClick={onClose}>Contact</a>

      <div className="mobile-section-divider"></div>

      <span className="mobile-menu-label">Recent Chats</span>

      {/* DYNAMIC HISTORY LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        {recentChats.length === 0 && <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>No recent chats</span>}

        {recentChats.map((chat: any) => (
          <a 
            key={chat.id} 
            href="#" 
            className="mobile-history-link" 
            onClick={(e) => { 
              e.preventDefault(); 
              onClose(); 
              if (onLoadChat) onLoadChat(chat.id); 
            }}
          >
            {chat.title || "Untitled Chat"}
          </a>
        ))}
      </div>

      <div className="mobile-section-divider"></div>

      <a href="#" className="mobile-signup-btn" onClick={onClose}>Sign Up / Login</a>

      <button className="mobile-exit-btn" onClick={onClose}>
        <i className="fa-solid fa-xmark"></i> Exit Menu
      </button>
    </div>
  );
};

export default MobileMenu;


