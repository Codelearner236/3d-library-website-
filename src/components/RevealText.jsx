import React from 'react';

const RevealText = ({ text, delay = 0 }) => {
  const words = text.split(' ');

  return (
    <div className="reveal-text-container">
      {words.map((word, index) => (
        <span key={index} className="reveal-word-wrapper">
          <span 
            className="reveal-word" 
            style={{ animationDelay: `${delay + (index * 0.15)}s` }}
          >
            {word}
          </span>
          {index < words.length - 1 && <span className="reveal-space">&nbsp;</span>}
        </span>
      ))}
    </div>
  );
};

export default RevealText;
