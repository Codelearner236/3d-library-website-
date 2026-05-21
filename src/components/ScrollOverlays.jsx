import React from 'react';

export const ScrollOverlays = ({ onEnter }) => {
  return (
    <>
      {/* Page 1: Intro (Centered exactly over the blob) */}
      <div style={{ position: 'absolute', top: '0vh', left: '0vw', width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
        <h1 style={{ fontSize: 'clamp(4rem, 12vw, 9rem)', fontWeight: 800, textAlign: 'center', margin: 0, letterSpacing: '-0.04em', color: '#ffffff', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))', lineHeight: 1 }}>
          Library.
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#ffffff', marginTop: '20px', letterSpacing: '0.4em', textTransform: 'uppercase', fontWeight: 700, textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
          Scroll to explore
        </p>
      </div>

      {/* Page 2: Concept (Floating minimal text) */}
      <div style={{ position: 'absolute', top: '100vh', left: '0vw', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', padding: '0 10vw', pointerEvents: 'none' }}>
        <div style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 200, margin: '0 0 20px 0', color: '#f8fafc', letterSpacing: '-0.04em', lineHeight: 1.1 }}>Infinite<br/>Knowledge.</h2>
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: '#94a3b8', lineHeight: 1.6, fontWeight: 300 }}>
            Step into the next generation of digital learning. Curated resources, powerful research tools, and a global community of scholars await.
          </p>
        </div>
      </div>

      {/* Page 3: Immersive Experience (Floating minimal text) */}
      <div style={{ position: 'absolute', top: '200vh', right: '0vw', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 10vw', pointerEvents: 'none' }}>
        <div style={{ maxWidth: '600px', textAlign: 'right' }}>
          <h2 style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 200, margin: '0 0 20px 0', color: '#f8fafc', letterSpacing: '-0.04em', lineHeight: 1.1 }}>State of<br/>the Art.</h2>
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: '#94a3b8', lineHeight: 1.6, fontWeight: 300 }}>
            Experience an interactive, seamless platform designed to make research feel effortless and beautifully engaging.
          </p>
        </div>
      </div>

      {/* Page 4: Call to Action */}
      <div style={{ position: 'absolute', top: '300vh', left: '0vw', width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pointerEvents: 'auto' }}>
        <h2 style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 200, margin: '0 0 40px 0', color: '#f8fafc', letterSpacing: '-0.04em' }}>Enter The Library</h2>
        <button 
          onClick={onEnter} 
          style={{ 
            padding: '18px 48px',
            fontSize: '1.1rem',
            fontWeight: 400,
            color: '#fff',
            cursor: 'pointer',
            borderRadius: '100px',
            backgroundColor: 'transparent',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#fff';
            e.currentTarget.style.color = '#000';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Get Started
        </button>
      </div>
    </>
  );
};
