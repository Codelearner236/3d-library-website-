import React from 'react';

const About = () => {
  return (
    <div className="page-container animate-fade-in">
      <div className="section-header">
        <h1 className="section-title">About Our Digital Library</h1>
        <p className="section-subtitle">Redefining the boundaries of learning through immersive 3D web technology.</p>
      </div>

      <div className="glass-panel delay-1" style={{ padding: '40px', marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Our Mission</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', lineHeight: '1.8' }}>
          We believe that learning should not be confined to flat, 2D screens. Our mission is to leverage modern web technologies—specifically WebGL and Spline 3D—to create an interactive, spatial environment where knowledge comes alive. From floating interactive books to virtual event spaces, we are building the library of the future.
        </p>
      </div>

      <div className="grid-3 delay-2">
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--accent-color)', marginBottom: '10px' }}>10k+</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Interactive 3D Books</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#f72585', marginBottom: '10px' }}>500+</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Virtual Events Hosted</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#7209b7', marginBottom: '10px' }}>50k+</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Active Students</p>
        </div>
      </div>
    </div>
  );
};

export default About;
