import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Preloader = ({ onEnter, children }) => {
  const [entered, setEntered] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);

  // Simulate loading phases
  useEffect(() => {
    if (entered) return;
    
    const intervals = [
      setTimeout(() => setLoadingPhase(1), 800),
      setTimeout(() => setLoadingPhase(2), 1500),
      setTimeout(() => setLoadingPhase(3), 2200),
      setTimeout(() => setLoadingPhase(4), 2800)
    ];

    return () => intervals.forEach(clearTimeout);
  }, [entered]);

  const handleEnter = () => {
    setEntered(true);
    if (onEnter) onEnter();
    // Optional: play an ambient sound here if desired
    // const audio = new Audio('/ambient.mp3');
    // audio.loop = true;
    // audio.play().catch(e => console.log('Audio autoplay prevented'));
  };

  return (
    <>
      <AnimatePresence>
        {!entered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9999,
              backgroundColor: '#2a0a4a', // Deep purple base to match home
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px'
              }}
            >
              {/* Logo / Title */}
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                color: '#ffffff',
                textAlign: 'center',
                textShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}>
                THE NEW APURBA SANGHA <span style={{ color: '#ffffff' }}>LIBRARY</span>
              </h1>

              {/* Progress visualizer */}
              <div style={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: `${(loadingPhase / 4) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  style={{ height: '100%', background: '#ffffff', boxShadow: '0 0 10px #ffffff' }}
                />
              </div>

              {/* Status Text */}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {loadingPhase < 4 ? `Loading Core Modules... [${loadingPhase}/4]` : 'System Ready'}
              </div>

              {/* Enter Button */}
              <AnimatePresence>
                {loadingPhase === 4 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, backgroundColor: '#ffffff', color: '#2a0a4a' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEnter}
                    style={{
                      marginTop: '20px',
                      padding: '12px 32px',
                      background: 'transparent',
                      border: '1px solid #ffffff',
                      borderRadius: '30px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Click to Enter
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Disclaimer */}
              <div style={{ marginTop: '40px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🎧</span> Headphones Recommended
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content (Wrapped) */}
      <div style={{ 
        opacity: entered ? 1 : 0, 
        transition: 'opacity 1s ease 0.5s',
        pointerEvents: entered ? 'auto' : 'none'
      }}>
        {children}
      </div>
    </>
  );
};
