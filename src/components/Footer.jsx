import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer glass-panel">
      <div className="footer-content page-container" style={{ paddingBottom: '20px', paddingTop: '40px', minHeight: 'auto' }}>
        <div className="grid-3">
          <div className="footer-section">
            <Link to="/" className="logo" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', marginBottom: '15px', display: 'inline-flex' }}>
              <BookOpen size={24} color="var(--accent-color)" />
              New Apurba Sangha <span>Library</span>
            </Link>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', maxWidth: '300px', marginTop: '10px' }}>
              Redefining the boundaries of learning through immersive web technology. Discover, learn, and grow with us.
            </p>
          </div>

          <div className="footer-section">
            <h4 style={{ marginBottom: '15px', fontSize: 'clamp(0.95rem, 2vw, 1.05rem)' }}>Quick Links</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/books" className="footer-link">Digital Repository</Link></li>
              <li><Link to="/events" className="footer-link">Upcoming Events</Link></li>
              <li><Link to="/exams" className="footer-link">Exam Preparation</Link></li>
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/admin" className="footer-link" style={{ opacity: 0.6, fontSize: '0.85rem', marginTop: '10px', display: 'inline-block' }}>Admin Login</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 style={{ marginBottom: '15px', fontSize: 'clamp(0.95rem, 2vw, 1.05rem)' }}>Contact Us</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', wordBreak: 'break-all' }}><MapPin size={16} color="var(--accent-color)" style={{ flexShrink: 0 }} /> 123 Education Hub, Knowledge City</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={16} color="var(--accent-color)" style={{ flexShrink: 0 }} /> info@apurbasanghalibrary.org</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={16} color="var(--accent-color)" style={{ flexShrink: 0 }} /> +91 98765 43210</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom" style={{ borderTop: '1px solid var(--border-color)', padding: '20px 16px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', flexDirection: 'column', fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>&copy; {new Date().getFullYear()} New Apurba Sangha Library. All rights reserved.</p>
        <p style={{ color: 'var(--text-primary)', fontWeight: '500', background: 'var(--surface-color)', padding: '5px 15px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
          Made by <span style={{ color: 'var(--accent-color)' }}>B.Karmakar</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
