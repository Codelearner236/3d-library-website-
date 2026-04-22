import React, { useState } from 'react';
import AdminDashboard from '../components/AdminDashboard';

const Admin = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://threed-library-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        window.location.reload(); // Refresh to update Navbar
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Server connection failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    window.location.href = '/'; // Redirect to home and refresh Navbar
  };

  if (token) {
    return <AdminDashboard onLogout={handleLogout} token={token} />;
  }

  return (
    <div className="page-container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 160px)' }}>
      <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center', fontSize: '1.8rem' }}>Admin Login</h2>
        {error && <div style={{ background: 'rgba(247, 37, 133, 0.2)', color: '#f72585', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              style={adminInputStyle}
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={adminInputStyle}
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '10px', width: '100%' }}>Login to Dashboard</button>
        </form>
      </div>
    </div>
  );
};

const adminInputStyle = { 
  width: '100%', 
  padding: '12px', 
  borderRadius: '8px', 
  border: '1px solid var(--border-color)', 
  background: 'var(--surface-color)', 
  color: 'var(--text-primary)',
  outline: 'none',
  fontSize: '1rem'
};

export default Admin;
