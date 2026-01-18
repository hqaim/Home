import React from 'react';
import Artifact3D from './Artifact3D';

interface ThinkingIndicatorProps {
  theme: string;
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ theme }) => {
  return (
    <div className="message-row assistant-msg">
      <div className="message-avatar">
        <img
          src={theme === 'light' ? "https://assets.hqaim.com/images/HQAIM_ICON.svg" : "https://assets.hqaim.com/images/HQAIM-App_Logo.svg"}
          alt="AI"
        />
      </div>
      <div className="message-bubble-wrapper" style={{ padding: '0.75rem 1.25rem', minWidth: '180px' }}>
        <div className="thinking-container">
          {/* Small Scaled Artifact */}
          <div style={{ width: '40px', height: '40px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Artifact3D scale={0.35} style={{ marginTop: 0, marginBottom: 0 }} />
          </div>
          <span className="thinking-text">Thinking...</span>
        </div>
      </div>
    </div>
  );
};

export default ThinkingIndicator;
