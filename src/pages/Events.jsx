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

    </div>
  );
};

export default Events;
