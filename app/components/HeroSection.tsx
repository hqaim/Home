import React from 'react';

// --- ARTIFACT COMPONENT (Inlined to ensure it exists) ---
const Artifact3D = ({ scale = 1, style = {} }: { scale?: number, style?: React.CSSProperties }) => (
    <div className="artifact-stage" style={{ transform: `scale(${scale})`, margin: 0, ...style }}>
        <div className="logo-container">
            <div className="holo-globe"><div className="globe-sphere">{[...Array(6)].map((_, i) => <div key={i} className="globe-ring"></div>)}</div></div>
            <div className="holo-citadel-contained"><div className="citadel-hex"></div></div>
            <div className="animated-logo">
                <img alt="HQAIM Arrow" className="logo-arrow" src="https://quotes-app.wordsofwisdom.in/assets/AIM_icon.svg" />
                <img alt="HQAIM Target" className="logo-target" src="https://quotes-app.wordsofwisdom.in/assets/HQ-icon.svg" />
            </div>
        </div>
    </div>
);

interface HeroSectionProps {
  visible: boolean;
  badgeVisible: boolean;
  badgeState: number;
  titles: { text: string; class: string }[];
  titleIndex: number;
  suggestions: any[];
  onSuggestionClick: (prompt: string) => void;
  onRotateSuggestions: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  visible,
  badgeVisible,
  badgeState,
  titles,
  titleIndex,
  suggestions,
  onSuggestionClick,
  onRotateSuggestions
}) => {
  const phrases = ["Strategic foresight", "Actionable intelligence", "Verifiable insight"];

  const renderBadgeContent = () => {
    if (badgeState === 0) {
      return (
        <>
          <span className="status-dot"></span>
          <span className="hq-text">Live</span>
          <span className="rotating-plus">+</span>
          <span className="ai-text">Intelligence</span>
          <span className="mastery-text">Engine</span>
        </>
      );
    } else if (badgeState === 1) {
      return (
        <>
          <span className="status-dot"></span>
          <span className="hq-text">Verified</span>
          <span className="rotating-plus" style={{ animation: 'none', margin: '0 5px', fontSize: '0.8em' }}>•</span>
          <span className="ai-text">Real-Time</span>
          <span className="rotating-plus" style={{ animation: 'none', margin: '0 5px', fontSize: '0.8em' }}>•</span>
          <span className="mastery-text">Strategic</span>
        </>
      );
    } else {
      const phraseIndex = badgeState - 2;
      return (
        <>
          <span className="status-dot"></span>
          <span className="phrase-text">{phrases[phraseIndex] || phrases[0]}</span>
        </>
      );
    }
  };

  return (
    <div className={`hero-section ${!visible ? 'hidden' : ''}`}>
      <Artifact3D scale={0.8} style={{ marginTop: '-2rem', marginBottom: '2.5rem' }} />

      <div className="hero-badge" style={{ opacity: badgeVisible ? 1 : 0 }}>
        {renderBadgeContent()}
      </div>

      <h1 className="hero-title">
        {titles.map((title, i) => (
          <span key={i} className={`${title.class} title-line ${i === titleIndex ? 'active' : ''}`}>
            {title.text}
          </span>
        ))}
      </h1>

      <div className="hero-desc">Answer intelligence that understands what you mean before responding.</div>

      <div className="suggestions-row">
        {suggestions.map((sugg) => (
          <button
            key={sugg.id}
            className="suggestion-chip"
            onClick={() => onSuggestionClick(sugg.prompt)}
            title={sugg.label}
          >
            <i className={`fa-solid ${sugg.icon}`} style={{ color: sugg.color }}></i>
            <span>{sugg.label}</span>
          </button>
        ))}

        <button className="more-trigger" onClick={onRotateSuggestions} title="Rotate suggestions">
          <i className="fa-solid fa-arrows-rotate"></i>
        </button>
      </div>
    </div>
  );
};

export default HeroSection;


