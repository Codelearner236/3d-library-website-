import React, { useRef, useState } from 'react';

const TiltWrapper = ({ children }) => {
  const tiltRef = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!tiltRef.current) return;
    
    const { left, top, width, height } = tiltRef.current.getBoundingClientRect();
    
    // Normalize mouse position between -1 and 1
    const x = ((e.clientX - left) / width) * 2 - 1;
    const y = ((e.clientY - top) / height) * 2 - 1;

    // Max rotation in degrees
    const maxRotateX = 15;
    const maxRotateY = 15;

    const rotateX = -y * maxRotateX; // Invert y for intuitive tilt
    const rotateY = x * maxRotateY;

    setStyle({
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)' // Smooth tight follow
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)' // Slow ease back
    });
  };

  return (
    <div 
      ref={tiltRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div style={{ 
        transformStyle: 'preserve-3d', 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center',
        ...style 
      }}>
        {children}
      </div>
    </div>
  );
};

export default TiltWrapper;
