import React, { RefObject } from 'react';

interface InputAreaProps {
  chatMode: boolean;
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSubmit: () => void;
  onVoiceInput: () => void;
  isListening: boolean;
  inputHasText: boolean;
  compassRef: RefObject<HTMLButtonElement>;
  iconRef: RefObject<HTMLDivElement>;
  textareaRef: RefObject<HTMLTextAreaElement>;
}

const InputArea: React.FC<InputAreaProps> = ({
  chatMode,
  inputValue,
  onInputChange,
  onKeyDown,
  onSubmit,
  onVoiceInput,
  isListening,
  inputHasText,
  compassRef,
  iconRef,
  textareaRef
}) => {
  
  // --- INTERNAL STYLES: Guarantees Design Integrity ---
  const styles = `
    .input-wrapper { 
        width: 100%; 
        max-width: 650px; 
        position: relative; 
        z-index: 20; 
        animation: fade-in-up 0.8s ease-out 0.6s backwards; 
        transition: all 0.5s ease;
        margin-bottom: 1.5rem;
    }
    
    .input-wrapper.chat-mode { 
        position: fixed; 
        bottom: 60px; 
        margin-top: 0; 
        width: calc(100% - 260px - 3rem); /* Subtract Sidebar */
        max-width: 800px;
    }
    
    .search-container { 
        background: rgba(20, 20, 30, 0.6); 
        border: 1px solid rgba(255, 255, 255, 0.1); 
        border-radius: 12px; 
        backdrop-filter: blur(12px); 
        padding: 0.6rem; 
        transition: all 0.3s ease; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
        display: flex; 
        flex-direction: column; 
    }
    
    .search-container:focus-within { 
        border-color: rgba(34, 211, 238, 0.4); 
        box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.4), 0 8px 30px rgba(0,0,0,0.15); 
    }
    
    .search-textarea { 
        width: 100%; 
        background: transparent; 
        border: none; 
        color: #f1f5f9; 
        font-family: inherit;
        font-size: 0.95rem; 
        line-height: 1.5; 
        padding: 0.4rem; 
        resize: none; 
        outline: none; 
        min-height: 40px; 
        max-height: 200px; 
        overflow-y: auto; 
    }
    .search-textarea::placeholder { color: #64748b; }
    
    .action-row { display: flex; justify-content: space-between; align-items: center; margin-top: 0.25rem; padding: 0 0.25rem; }
    .action-left { display: flex; gap: 0.5rem; }
    .action-right { display: flex; align-items: center; gap: 0.5rem; }
    
    .icon-btn { background: transparent; border: none; color: #64748b; padding: 6px; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; }
    .icon-btn:hover { color: #f1f5f9; background: rgba(255,255,255,0.05); }
    .icon-btn svg, .icon-btn i { font-size: 1rem; }
    .listening-active { color: #06b6d4 !important; animation: pulse 1.5s infinite; }
    
    .submit-btn { width: 36px; height: 36px; background: transparent; color: #64748b; display: flex; align-items: center; justify-content: center; transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.1s linear; cursor: pointer; border: none; padding: 0; position: relative; }
    .submit-btn.has-input { color: #06b6d4; filter: drop-shadow(0 0 5px rgba(34, 211, 238, 0.4)); }
    .compass-wrapper { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; }
    .submit-btn svg { width: 22px; height: 22px; fill: currentColor; }
    .submit-btn:hover { transform: scale(1.1); }
    
    .input-disclaimer { width: 100%; text-align: center; font-size: 0.75rem; color: rgba(255, 255, 255, 0.5); margin-top: 0.6rem; font-weight: 500; opacity: 0.9; pointer-events: none; }

    @media (max-width: 900px) { 
        .input-wrapper.chat-mode { width: calc(100% - 3rem); } 
        .input-wrapper { width: 95%; }
    }
  `;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style>{styles}</style>
      <div className={`input-wrapper ${chatMode ? 'chat-mode' : ''}`}>
        <div className="search-container">
          <textarea
            ref={textareaRef}
            className="search-textarea"
            placeholder={isListening ? "Listening..." : "Ask anything..."}
            rows={1}
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
          ></textarea>

          <div className="action-row">
            <div className="action-left">
              <button className="icon-btn" title="Attach file"><i className="fa-solid fa-paperclip"></i></button>
              <button className={`icon-btn ${isListening ? 'listening-active' : ''}`} title="Voice Input" onClick={onVoiceInput}>
                <i className={`fa-solid ${isListening ? 'fa-spinner fa-spin' : 'fa-microphone'}`}></i>
              </button>
            </div>
            <div className="action-right">
              <button className={`submit-btn ${inputHasText ? 'has-input' : ''}`} id="compassBtn" ref={compassRef} title="Submit" onClick={onSubmit}>
                <div className="compass-wrapper" id="compassIcon" ref={iconRef}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M12 3.5L14.5 9H9.5L12 3.5Z" fill="currentColor"/>
                    <path d="M12 20.5L9.5 15H14.5L12 20.5Z" fill="currentColor" opacity="0.4"/>
                    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="input-disclaimer">Even HQ AI Models can make mistakes, so double-check it.</div>
      </div>
    </div>
  );
};

export default InputArea;

