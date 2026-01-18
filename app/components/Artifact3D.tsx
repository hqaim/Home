import React from 'react';

interface Artifact3DProps {
  scale?: number;
  style?: React.CSSProperties;
}

const Artifact3D: React.FC<Artifact3DProps> = ({ scale = 1, style = {} }) => {
  return (
    <div className="artifact-stage" style={{ transform: `scale(${scale})`, margin: 0, ...style }}>
      <div className="logo-container">
        <div className="holo-globe">
          <div className="globe-sphere">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="globe-ring"></div>
            ))}
          </div>
        </div>
        <div className="holo-citadel-contained">
          <div className="citadel-hex"></div>
        </div>
        <div className="animated-logo">
          <img
            alt="HQAIM Arrow"
            className="logo-arrow"
            src="https://quotes-app.wordsofwisdom.in/assets/AIM_icon.svg"
          />
          <img
            alt="HQAIM Target"
            className="logo-target"
            src="https://quotes-app.wordsofwisdom.in/assets/HQ-icon.svg"
          />
        </div>
      </div>
    </div>
  );
};

export default Artifact3D;
