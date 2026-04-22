import React, { useState } from 'react';

const AdminDashboard = ({ onLogout, token }) => {
  const [message, setMessage] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  const headers = { 'Authorization': `Bearer ${token}` };

  const handleBookUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('isPremium', isPremium);
    const response = await fetch('http://localhost:5000/api/admin/books', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    const data = await response.json();
    setMessage(data.message || 'Book uploaded successfully!');
    setIsPremium(false);
    e.target.reset();
  };

  const handleEventUpload = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/admin/events', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Event' })
    });
    const data = await response.json();
    setMessage(data.message || 'Event uploaded successfully!');
  };

  const handleExamEdit = async () => {
    const response = await fetch('http://localhost:5000/api/admin/exams/1', {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Updated' })
    });
    const data = await response.json();
    setMessage(data.message || 'Exam edited successfully!');
  };

  const handleStudentRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch('http://localhost:5000/api/admin/student', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    setMessage(data.message || 'Student registered successfully!');
    e.target.reset();
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="section-subtitle">Manage books, events, exams, and settings.</p>
        </div>
        <button onClick={onLogout} className="btn-secondary">Logout</button>
      </div>

      {message && <div style={{ background: 'var(--accent-glow)', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>{message}</div>}

      <div className="grid-3">
        {/* Book Upload */}
        <div className="glass-card">
          <h2 style={{ marginBottom: '15px' }}>Upload Book</h2>
          <form onSubmit={handleBookUpload} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Book Title</label>
            <input type="text" name="title" required style={inputStyle} />

            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Author</label>
            <input type="text" name="author" required style={inputStyle} />
            
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Book File (PDF/EPUB)</label>
            <input type="file" name="bookFile" required style={{ color: 'var(--text-primary)' }} />
            
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Cover Image</label>
            <input type="file" name="coverImage" required style={{ color: 'var(--text-primary)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
              <input type="checkbox" id="isPremium" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-color)' }} />
              <label htmlFor="isPremium" style={{ fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: '600' }}>Premium Book (Paid)</label>
            </div>
            
            {isPremium && (
              <div>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Price (₹)</label>
                <input type="number" name="price" placeholder="e.g. 99" required style={inputStyle} />
              </div>
            )}
            
            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Upload</button>
          </form>
        </div>

        {/* Event Management */}
        <div className="glass-card">
          <h2 style={{ marginBottom: '15px' }}>Manage Events</h2>
          <form onSubmit={handleEventUpload} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Event Name</label>
            <input type="text" name="eventName" required style={inputStyle} />
            <button type="submit" className="btn-primary">Create Event</button>
          </form>
          <hr style={{ borderColor: 'var(--border-color)', margin: '15px 0' }} />
          <button onClick={() => setMessage('Event 1 edited successfully!')} className="btn-secondary" style={{ width: '100%', margin: '0' }}>Edit Existing Event</button>
        </div>

        {/* Exam Management & Admit Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={{ marginBottom: '15px', color: '#f72585' }}>Schedule Exam</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const payload = Object.fromEntries(formData.entries());
              const response = await fetch('http://localhost:5000/api/admin/exams', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              const data = await response.json();
              setMessage(data.message || 'Exam created successfully!');
              e.target.reset();
            }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Exam Title</label>
              <input type="text" name="title" placeholder="e.g. Mid-Term Assessment" required style={inputStyle} />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Date</label>
                  <input type="date" name="date" required style={{...inputStyle, colorScheme: 'dark'}} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Time</label>
                  <input type="time" name="time" required style={{...inputStyle, colorScheme: 'dark'}} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                <input type="checkbox" name="isPaid" id="isPaidExam" style={{ width: '18px', height: '18px', accentColor: '#f72585' }} />
                <label htmlFor="isPaidExam" style={{ fontSize: '0.9rem', color: '#f72585', fontWeight: '600' }}>Require Payment</label>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '10px', background: 'linear-gradient(135deg, #f72585, #7209b7)', border: 'none' }}>Create Exam</button>
            </form>
          </div>

          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '5px 0' }} />

          <div>
            <h2 style={{ marginBottom: '10px', color: '#4cc9f0' }}>Student Admit Card</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>Register a student to automatically generate their PDF Admit Card.</p>
            <form onSubmit={handleStudentRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" name="name" placeholder="Student Full Name" required style={inputStyle} />
              <input type="text" name="rollNo" placeholder="Roll Number / ID" required style={inputStyle} />
              <input type="text" name="exam" placeholder="Target Exam Name" required style={inputStyle} />
              <button type="submit" className="btn-secondary" style={{ width: '100%', margin: '0', borderColor: '#4cc9f0', color: '#4cc9f0' }}>Register & Generate</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%', 
  padding: '8px', 
  borderRadius: '5px', 
  border: '1px solid var(--border-color)', 
  background: 'var(--surface-color)', 
  color: 'var(--text-primary)'
};

export default AdminDashboard;
