import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ onLogout, token }) => {
  const [message, setMessage] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  const fetchBooks = () => {
    setLoadingBooks(true);
    fetch('https://threed-library-backend.onrender.com/api/public/books')
      .then(res => res.json())
      .then(data => { if (data.success) setBooks(data.books); })
      .finally(() => setLoadingBooks(false));
  };

  useEffect(() => { fetchBooks(); }, []);

  const headers = { 'Authorization': `Bearer ${token}` };

  const handleBookUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('isPremium', isPremium);
    const response = await fetch('https://threed-library-backend.onrender.com/api/admin/books', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    const data = await response.json();
    setMessage(data.message || 'Book uploaded successfully!');
    setIsPremium(false);
    e.target.reset();
    fetchBooks(); // Refresh book list after upload
  };

  const handleDeleteBook = async (bookId, bookTitle) => {
    if (!window.confirm(`Delete "${bookTitle}"? This cannot be undone.`)) return;
    const response = await fetch(`https://threed-library-backend.onrender.com/api/admin/books/${bookId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setMessage(data.message || 'Book deleted!');
    fetchBooks(); // Refresh list
  };

  const handleEventUpload = async (e) => {
    e.preventDefault();
    const response = await fetch('https://threed-library-backend.onrender.com/api/admin/events', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Event' })
    });
    const data = await response.json();
    setMessage(data.message || 'Event uploaded successfully!');
  };

  const handleExamEdit = async () => {
    const response = await fetch('https://threed-library-backend.onrender.com/api/admin/exams/1', {
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
    const response = await fetch('https://threed-library-backend.onrender.com/api/admin/student', {
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

            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Category</label>
            <select name="category" required style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a0a0b0' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px' }}>
              <option value="" disabled selected>— Select a Category —</option>
              <option value="Horror">Horror</option>
              <option value="Fiction">Fiction</option>
              <option value="Story">Story</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Biography">Biography</option>
              <option value="Mystery">Mystery</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Educational">Educational</option>
              <option value="Thriller">Thriller</option>
            </select>

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
              const response = await fetch('https://threed-library-backend.onrender.com/api/admin/exams', {
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

      {/* Manage Books — delete duplicates or wrong entries */}
      <div className="glass-card" style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '16px', color: '#f72585' }}>Manage Uploaded Books</h2>
        {loadingBooks ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading books...</p>
        ) : books.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No books uploaded yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {books.map(book => (
              <div key={book.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-color)', borderRadius: '10px', padding: '12px 16px', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                  {book.coverUrl && <img src={book.coverUrl} alt={book.title} style={{ width: '42px', height: '56px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{book.title}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{book.author}</p>
                  </div>
                  <span style={{ background: 'rgba(76,201,240,0.15)', color: '#4cc9f0', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', flexShrink: 0 }}>{book.category}</span>
                </div>
                <button
                  onClick={() => handleDeleteBook(book.id, book.title)}
                  style={{ background: 'rgba(247,37,133,0.15)', color: '#f72585', border: '1px solid rgba(247,37,133,0.4)', borderRadius: '8px', padding: '7px 18px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', flexShrink: 0, transition: 'all 0.2s' }}
                  onMouseEnter={e => e.target.style.background = 'rgba(247,37,133,0.35)'}
                  onMouseLeave={e => e.target.style.background = 'rgba(247,37,133,0.15)'}
                >🗑 Delete</button>
              </div>
            ))}
          </div>
        )}
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
