import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Search, BookOpen, Menu, X, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isAdmin = !!localStorage.getItem('adminToken');
  const isStudent = !!localStorage.getItem('studentToken');
  const studentName = localStorage.getItem('studentName');

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentName');
    window.location.href = '/';
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);

  const renderThemeIcon = () => {
    if (theme === 'light') return <Sun size={20} />;
    if (theme === 'dark') return <Moon size={20} />;
    return <Monitor size={20} />;
  };

  return (
    <nav className="navbar glass-panel">
      <Link to="/" className="logo">
        <BookOpen size={24} color="var(--accent-color)" />
        New Apurba Sangha <span>Library</span>
      </Link>
      
      <div className={`nav-links${menuOpen ? ' open' : ''}`}>
        <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} end>Home</NavLink>
        <NavLink to="/books" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Books</NavLink>
        <NavLink to="/events" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Events</NavLink>
        <NavLink to="/exams" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Exams</NavLink>
        <NavLink to="/about" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>
        {isAdmin && <NavLink to="/admin" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} style={{ color: 'var(--accent-color)' }}>Admin Panel</NavLink>}
        
        {/* Mobile-only actions inside the hamburger menu */}
        <div className="navbar-actions-mobile">
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="search-btn" style={{ flex: 1, justifyContent: 'center', borderRadius: '8px', padding: '12px 16px', gap: '10px', border: '1px solid var(--border-color)' }}>
              <Search size={20} />
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Search</span>
            </button>
            <button onClick={toggleTheme} className="search-btn" style={{ borderRadius: '8px', padding: '12px 16px', border: '1px solid var(--border-color)' }}>
              {renderThemeIcon()}
            </button>
          </div>
          {isStudent ? (
            <>
              <span style={{ fontSize: '0.95rem', color: 'var(--accent-color)', padding: '0 16px' }}>Hi, {studentName?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: '10px 16px', fontSize: '0.9rem', margin: 0, width: '100%', textAlign: 'center' }}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '10px 16px', fontSize: '0.9rem', textAlign: 'center', width: '100%' }}>Login</Link>
          )}
        </div>
      </div>

      {/* Desktop actions */}
      <div className="navbar-actions-desktop" style={{ position: 'relative' }}>
        <button className="search-btn" onClick={toggleTheme} title={`Theme: ${theme}`}>
          {renderThemeIcon()}
        </button>
        <button className="search-btn">
          <Search size={20} />
        </button>
        {isStudent ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--accent-color)', whiteSpace: 'nowrap' }}>Hi, {studentName?.split(' ')[0]}</span>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 15px', fontSize: '0.85rem', margin: 0 }}>Logout</button>
          </div>
        ) : (
          <Link to="/login" className="btn-primary" style={{ padding: '8px 15px', fontSize: '0.85rem' }}>Login</Link>
        )}
      </div>

      {/* Hamburger button (mobile only) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button className="hamburger-btn" onClick={toggleMenu} aria-label={menuOpen ? 'Close menu' : 'Open menu'} style={{ paddingLeft: '5px' }}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile overlay backdrop */}
      <div className={`mobile-overlay${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />
    </nav>
  );
};

export default Navbar;
