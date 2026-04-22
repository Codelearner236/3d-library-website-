import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const carouselImages = [
  '/events/media__1776798746950.jpg',
  '/events/media__1776798746973.jpg',
  '/events/media__1776798746987.jpg',
  '/events/media__1776798747000.jpg',
  '/events/media__1776798747011.jpg',
  '/events/media__1776799018591.jpg',
  '/events/media__1776799018622.jpg'
];

const Events = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-play effect every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prevIdx) => (prevIdx + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Manual change handlers
  const nextSlide = () => {
    setCurrentIdx((prevIdx) => (prevIdx + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentIdx((prevIdx) => (prevIdx === 0 ? carouselImages.length - 1 : prevIdx - 1));
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="section-header">
        <h1 className="section-title" style={{ color: '#f72585' }}>Past Events</h1>
        <p className="section-subtitle">Take a look back at our community's previous celebrations and gatherings.</p>
      </div>

      {/* Hero Carousel Section */}
      <div className="glass-panel" style={{ position: 'relative', width: '100%', height: '500px', overflow: 'hidden', borderRadius: '16px', marginBottom: '60px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        {carouselImages.map((src, idx) => (
          <img 
            key={idx}
            src={src}
            alt={`Event ${idx}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: idx === currentIdx ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              zIndex: idx === currentIdx ? 1 : 0
            }}
          />
        ))}

        {/* Gradient Overlay for better aesthetics */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '150px', background: 'linear-gradient(to top, rgba(11,12,16,0.9), transparent)', zIndex: 2 }}></div>
        
        {/* Carousel Controls */}
        <button 
          onClick={prevSlide}
          style={{ position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', zIndex: 3, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', backdropFilter: 'blur(10px)', color: 'white' }}
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          style={{ position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)', zIndex: 3, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', backdropFilter: 'blur(10px)', color: 'white' }}
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', gap: '10px' }}>
          {carouselImages.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentIdx(idx)}
              style={{ width: '10px', height: '10px', borderRadius: '50%', border: 'none', background: idx === currentIdx ? '#f72585' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s' }}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Events Notice Format */}
      <div className="section-header" style={{ marginBottom: '20px' }}>
        <h2 className="section-title" style={{ color: 'var(--accent-color)', fontSize: '2rem' }}>Notice Board: Upcoming Events</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} className="delay-1">
        
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #f72585' }}>
          <p style={{ color: '#f72585', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>DATE: October 11, 2026</p>
          <h3 style={{ marginBottom: '8px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Notice for Virtual Reality in Education Seminar</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            All members are hereby informed that a special seminar on "Virtual Reality in Education" will be held. The session will cover modern techniques integrating VR and 3D web technologies to enhance learning experiences. 
          </p>
        </div>
        
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #4cc9f0' }}>
          <p style={{ color: '#4cc9f0', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>DATE: November 05, 2026</p>
          <h3 style={{ marginBottom: '8px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Notice for 3D Holographic Book Projections</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            This is to notify everyone regarding the upcoming live demonstration of 3D Holographic Book Projections. Members are encouraged to attend and discover the future of interactive reading.
          </p>
        </div>
        
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #4361ee' }}>
          <p style={{ color: '#4361ee', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>DATE: December 12, 2026</p>
          <h3 style={{ marginBottom: '8px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Notice for Sci-Fi Author Meet & Greet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            An exclusive Q&A session with acclaimed sci-fi authors will take place. This is a unique opportunity to engage in an immersive discussion about the future of literature and technology.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Events;
