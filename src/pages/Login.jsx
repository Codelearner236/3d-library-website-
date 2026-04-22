import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('studentToken', data.token);
        localStorage.setItem('studentName', data.name);
        window.location.href = '/'; // Redirect to home to update Navbar state
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred during login.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('studentToken', data.token);
        localStorage.setItem('studentName', data.name);
        window.location.href = '/'; 
      } else {
        setError(data.message || 'Google login failed');
      }
    } catch (err) {
      setError('An error occurred during Google login.');
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Student Login</h2>
        {error && <div style={{ background: 'rgba(255,0,0,0.2)', color: '#ff4d4d', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={inputStyle} />
          <input type="password" placeholder="Password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={inputStyle} />
          <button type="submit" className="btn-primary" style={{ marginTop: '10px', width: '100%' }}>Login to Account</button>
        </form>
        
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: 'var(--text-secondary)' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          <span style={{ padding: '0 10px', fontSize: '0.9rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google login was unsuccessful.')}
            useOneTap
          />
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-color)' }}>Register here</Link>
        </p>
        <div style={{ textAlign: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border-color)' }}>
          <Link to="/admin" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Are you an Admin? <span style={{ color: 'var(--accent-color)' }}>Login here</span></Link>
        </div>
      </div>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)', outline: 'none' };

export default Login;
