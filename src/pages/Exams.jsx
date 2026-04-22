import React, { useState } from 'react';

const Exams = () => {
  const [rollNo, setRollNo] = useState('');

  const handleDownload = () => {
    if (!rollNo.trim()) return alert('Please enter your Roll Number');
    window.open(`http://localhost:5000/api/public/admit-card/${rollNo.trim()}`, '_blank');
  };
  return (
    <div className="page-container animate-fade-in">
      <div className="section-header">
        <h1 className="section-title">Exam Preparation Center</h1>
        <p className="section-subtitle">Access past papers, mock tests, and track your progress.</p>
      </div>

      <div className="grid-3 delay-1">
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
          <h2>University Entrance</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '10px 0' }}>Practice tests tailored for global university admission exams.</p>
          <button className="btn-primary" style={{ marginTop: '10px', width: '100%' }}>Start Mock Test</button>
        </div>
        
        <div className="glass-card" style={{ borderLeft: '4px solid #f72585' }}>
          <h2>High School Boards</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '10px 0' }}>Comprehensive past papers and interactive study guides.</p>
          <button className="btn-primary" style={{ marginTop: '10px', width: '100%' }}>View Materials</button>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #7209b7' }}>
          <h2>Language Proficiency</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '10px 0' }}>Test your language skills with our gamified assessment tool.</p>
          <button className="btn-primary" style={{ marginTop: '10px', width: '100%' }}>Take Assessment</button>
        </div>
      </div>

      <div className="section-header" style={{ marginTop: '60px' }}>
        <h2 className="section-title">Student Admit Card</h2>
        <p className="section-subtitle">Download your exam admit card to participate in the upcoming finals.</p>
      </div>

      <div className="glass-panel delay-2" style={{ padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ flex: '1 1 260px', minWidth: 0 }}>
          <h3 style={{ color: 'var(--accent-color)', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>Official Admit Card Download</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '5px', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>Enter your registered Roll Number to generate your personalized admit card.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', flex: '0 1 auto' }}>
          <input 
            type="text" 
            placeholder="Enter Roll Number" 
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)', outline: 'none', minWidth: '180px', width: '100%', maxWidth: '250px' }}
          />
          <button onClick={handleDownload} className="btn-primary" style={{ margin: '0', whiteSpace: 'nowrap' }}>
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Exams;
