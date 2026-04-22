import React from 'react';
import { useNavigate } from 'react-router-dom';
import RevealText from '../components/RevealText';
import TiltWrapper from '../components/TiltWrapper';
import CyberBackground from '../components/CyberBackground';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ 
      width: '100%', 
      height: '100vh', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* High-tech React Three Fiber Background */}
      <CyberBackground />
      
      {/* Interactive 3D Overlay Text */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        padding: '20px',
        zIndex: 10
      }}>
        <TiltWrapper>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <RevealText text="WELCOME" delay={0.2} />
            <RevealText text="TO THE LIBRARY" delay={0.4} />
            
            <p style={{
              marginTop: '15px',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              fontWeight: '500',
              textAlign: 'center',
              maxWidth: '600px',
              animation: 'fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) 1.2s both',
              textShadow: '0 4px 15px rgba(0,0,0,0.5)'
            }}>
              Your gateway to infinite knowledge, curated digital resources, and a state-of-the-art interactive learning experience.
            </p>
          </div>
        </TiltWrapper>
      </div>

      {/* Button to test interaction */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20
      }}>
        <button 
          onClick={() => navigate('/register')} 
          className="btn-primary"
          style={{ 
            animation: 'fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) 1.5s both',
            padding: '16px 40px',
            fontSize: '1.2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
        >
          Enter Library
        </button>
      </div>
    </div>
  );
};

export default Home;
