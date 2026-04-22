import React, { useState, useEffect } from 'react';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const studentToken = localStorage.getItem('studentToken');

  const categories = ['All', 'Horror', 'Fiction', 'Story', 'Sci-Fi', 'Biography', 'Mystery', 'Fantasy', 'Educational', 'Thriller'];

  useEffect(() => {
    fetch('https://threed-library-backend.onrender.com/api/public/books')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBooks(data.books);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch books', err);
        setLoading(false);
      });
  }, []);

  const filteredBooks = selectedCategory === 'All' 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  const handleReadBook = (book) => {
    if (!book.isPremium) {
      window.open(book.fileUrl, '_blank');
      return;
    }

    // Premium book - must be logged in
    if (!studentToken) {
      alert('Please login to purchase this book.');
      window.location.href = '/login';
      return;
    }

    // Try to read - if purchased, backend will return fileUrl
    fetch(`https://threed-library-backend.onrender.com/api/books/read/${book.id}`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.fileUrl) {
          window.open(data.fileUrl, '_blank');
        } else {
          // Not purchased yet - initiate payment
          initiatePayment(book);
        }
      })
      .catch(() => initiatePayment(book));
  };

  const initiatePayment = async (book) => {
    try {
      const orderRes = await fetch('https://threed-library-backend.onrender.com/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studentToken}`
        },
        body: JSON.stringify({ amount: book.price, bookId: book.id, type: 'book' })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert('Could not create payment order. Please try again.');
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: 'INR',
        name: 'New Apurba Sangha Library',
        description: `Purchase: ${book.title}`,
        order_id: orderData.order.id,
        handler: async function (response) {
          // Verify payment
          const verifyRes = await fetch('https://threed-library-backend.onrender.com/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${studentToken}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookId: book.id,
              type: 'book'
            })
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert('Payment successful! You can now read this book.');
            // Now read the book
            const readRes = await fetch(`https://threed-library-backend.onrender.com/api/books/read/${book.id}`, {
              headers: { 'Authorization': `Bearer ${studentToken}` }
            });
            const readData = await readRes.json();
            if (readData.fileUrl) window.open(readData.fileUrl, '_blank');
          } else {
            alert('Payment verification failed.');
          }
        },
        prefill: { name: localStorage.getItem('studentName') || '' },
        theme: { color: '#4cc9f0' }
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
    } catch (err) {
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="section-header">
        <h1 className="section-title">Digital Repository</h1>
        <p className="section-subtitle">Browse and interact with our collection of categorized books.</p>
      </div>

      <div className="filter-bar delay-1">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading books...</p>
      ) : filteredBooks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface-color)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No books found in this category.</p>
          <button onClick={() => setSelectedCategory('All')} className="btn-secondary" style={{ marginTop: '20px' }}>Clear Filter</button>
        </div>
      ) : (
        <div className="grid-3 delay-2">
          {filteredBooks.map((book) => (
            <div key={book.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              {book.isPremium && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'linear-gradient(135deg, #f72585, #7209b7)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: '#fff', zIndex: '5' }}>
                  ₹{book.price}
                </div>
              )}
              <div style={{ width: '100%', height: '220px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <p style={{color: 'var(--text-secondary)'}}>No Cover</p>
                )}
              </div>
              
              {book.category && (
                <span className={`category-tag ${book.category.toLowerCase().replace(' ', '-')}`}>
                  {book.category}
                </span>
              )}
              
              <h3 style={{width: '100%', textAlign: 'left', marginBottom: '5px', fontSize: '1.1rem'}}>{book.title}</h3>
              <p style={{width: '100%', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '15px'}}>{book.author}</p>
              
              <button onClick={() => handleReadBook(book)} className={book.isPremium ? "btn-primary" : "btn-secondary"} style={{ width: '100%', margin: '0', textAlign: 'center', border: book.isPremium ? 'none' : undefined, marginTop: 'auto' }}>
                {book.isPremium ? 'Buy & Read' : 'Read Online'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
