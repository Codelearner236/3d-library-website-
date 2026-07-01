require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const sequelize = require('./config/db');
const bcrypt = require('bcryptjs');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { OAuth2Client } = require('google-auth-library');
const { sendOTP } = require('./utils/mailer');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const User = require('./models/User');
const Book = require('./models/Book');
const Student = require('./models/Student');

const app = express();

// Local JSON file storage removed in favor of PostgreSQL

const otpStore = new Map(); // Store OTPs in memory temporarily
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_admin_key_3d_library';

// Connect and sync PostgreSQL database
sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL successfully!');
    return sequelize.sync();
  })
  .then(() => {
    console.log('PostgreSQL database synchronized successfully!');
  })
  .catch(err => console.error('PostgreSQL connection/sync error:', err));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_API_KEY");

async function categorizeBook(title, author) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an expert librarian. Categorize the book titled "${title}" by "${author}".
Choose EXACTLY ONE category from this list:
- Horror
- Fiction
- Story
- Sci-Fi
- Biography
- Mystery
- Fantasy
- Educational
- Thriller

Note: Exam preparations, quantitative aptitude, textbooks, and study guides MUST be categorized as "Educational".

Return ONLY the exact category name from the list above. Do not include any punctuation or extra words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim().replace(/[^a-zA-Z-]/g, '');

    const validCategories = ["Horror", "Fiction", "Story", "Sci-Fi", "Biography", "Mystery", "Fantasy", "Educational", "Thriller"];
    const matchedCategory = validCategories.find(c => c.toLowerCase() === text.toLowerCase());

    if (matchedCategory) {
      return matchedCategory;
    } else {
      console.warn(`AI returned unmatched category: "${text}". Filtering manually...`);
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes('aptitude') || lowerTitle.includes('exam') || lowerTitle.includes('guide')) {
        return "Educational";
      }
      return "Fiction"; // Default fallback
    }
  } catch (error) {
    console.error("AI Categorization failed:", error);
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('aptitude') || lowerTitle.includes('exam') || lowerTitle.includes('guide')) {
      return "Educational";
    }
    return "Fiction"; // Default fallback
  }
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure upload directories exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Local JSON database arrays removed

// Admin Credentials (Securely loaded from Environment Variables)
const ADMIN_USER = process.env.ADMIN_USER || 'admin_fallback';
const ADMIN_PASS = process.env.ADMIN_PASS || 'pass_fallback';

// 1. Authentication Endpoints
// Send OTP for Registration
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists in DB
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    otpStore.set(email, { 
      otp, 
      userData: { name, email, password },
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    const sent = await sendOTP(email, otp);
    if (sent) {
      res.json({ success: true, message: 'OTP sent successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send OTP email. Please check server SMTP settings.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Verify OTP & Complete Registration
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = otpStore.get(email);

    if (!record || record.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP expired or invalid' });
    }
    if (record.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP' });
    }

    const hashedPassword = await bcrypt.hash(record.userData.password, 10);
    await User.create({
      name: record.userData.name,
      email,
      password: hashedPassword,
      role: 'student'
    });
    otpStore.delete(email); // clear OTP

    res.json({ success: true, message: 'Student registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Verification failed', error: error.message });
  }
});

// Google Login/Register
app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Register them automatically
      user = await User.create({ name, email, googleId, role: 'student' });
    }

    const jwtToken = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '2h' });
    res.json({ success: true, token: jwtToken, role: user.role, name: user.name });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid Google token', error: error.message });
  }
});

// User/Admin Login (using DB)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Admin fallback
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = jwt.sign({ username, role: 'admin' }, SECRET_KEY, { expiresIn: '2h' });
      return res.json({ success: true, token, role: 'admin' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (!user.password) {
      return res.status(401).json({ success: false, message: 'Please login with Google' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '2h' });
    res.json({ success: true, token, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });
  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.admin = decoded;
    next();
  });
};

// 2. Book & Cover Upload (now supports premium)
// Fields: bookFile, coverImage
app.post('/api/admin/books', verifyToken, upload.fields([{ name: 'bookFile', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), async (req, res) => {
  try {
    const bookData = req.body;
    const files = req.files;

    if (!files || !files.bookFile || !files.coverImage) {
      console.error("Upload failed: Missing files in request");
      return res.status(400).json({ success: false, message: 'Please upload both a book file and a cover image.' });
    }

    // Use manually selected category if provided, otherwise fall back to AI
    let category = bookData.category && bookData.category.trim() !== '' ? bookData.category : null;
    if (!category) {
      try {
        category = await categorizeBook(bookData.title, bookData.author);
      } catch (aiErr) {
        console.error("AI Categorization failed during upload:", aiErr.message);
        category = "Fiction";
      }
    }

    const createdBook = await Book.create({
      title: bookData.title || 'Untitled Book',
      author: bookData.author || 'Unknown Author',
      category: category,
      coverUrl: `${BASE_URL}/uploads/${files.coverImage[0].filename}`,
      fileUrl: `${BASE_URL}/uploads/${files.bookFile[0].filename}`,
      isPremium: bookData.isPremium === 'true' || bookData.isPremium === true,
      price: parseInt(bookData.price) || 0
    });

    res.json({ success: true, message: 'Book uploaded successfully with AI categorization!', book: createdBook });
  } catch (err) {
    console.error("Internal Upload Error:", err);
    res.status(500).json({ success: false, message: 'Upload failed: ' + err.message });
  }
});

// Public books list
app.get('/api/public/books', async (req, res) => {
  try {
    const dbBooks = await Book.findAll({ order: [['createdAt', 'DESC']] });
    
    const safeBooks = dbBooks.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      coverUrl: book.coverUrl,
      fileUrl: book.isPremium ? null : book.fileUrl,
      isPremium: book.isPremium,
      price: book.price
    }));
    res.json({ success: true, books: safeBooks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch books: ' + err.message });
  }
});

// Delete a book (admin only)
app.delete('/api/admin/books/:id', verifyToken, async (req, res) => {
  try {
    const bookId = req.params.id;
    await Book.destroy({ where: { id: bookId } });
    res.json({ success: true, message: 'Book deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete book: ' + err.message });
  }
});

// Protected book reading (only for purchased premium books)
app.get('/api/books/read/:bookId', verifyToken, async (req, res) => {
  try {
    const rawBookId = req.params.bookId;
    const book = await Book.findByPk(rawBookId);

    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (!book.isPremium) {
      return res.json({ success: true, fileUrl: book.fileUrl });
    }

    // Check if user has purchased this book
    const user = await User.findByPk(req.admin.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const hasPurchased = user.purchasedBooks && user.purchasedBooks.includes(rawBookId.toString());
    if (!hasPurchased) {
      return res.status(403).json({ message: 'You have not purchased this book' });
    }

    res.json({ success: true, fileUrl: book.fileUrl });
  } catch (err) {
    console.error("Read book error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== PAYMENT ENDPOINTS ====================

// Create Razorpay Order
app.post('/api/payment/create-order', verifyToken, async (req, res) => {
  try {
    const { amount, bookId, type } = req.body; // type: 'book' or 'exam'

    const options = {
      amount: amount * 100, // Razorpay takes amount in paise
      currency: 'INR',
      receipt: `receipt_${type}_${Date.now()}`,
      notes: { bookId: bookId || '', type, userId: req.admin.id || '' }
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not create order', error: err.message });
  }
});

// Verify Payment & Grant Access
app.post('/api/payment/verify', verifyToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookId, type } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Grant access based on type
    const user = await User.findByPk(req.admin.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (type === 'book' && bookId) {
      const currentPurchased = user.purchasedBooks || [];
      if (!currentPurchased.includes(bookId)) {
        await user.update({
          purchasedBooks: [...currentPurchased, bookId]
        });
      }
    } else if (type === 'exam') {
      const currentExams = user.paidExams || [];
      if (!currentExams.includes(bookId)) {
        await user.update({
          paidExams: [...currentExams, bookId]
        });
      }
    }

    res.json({ success: true, message: 'Payment verified and access granted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Verification failed', error: err.message });
  }
});

// Get Razorpay public key
app.get('/api/payment/key', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// 3. Manage Exams
app.post('/api/admin/exams', verifyToken, (req, res) => {
  const examData = req.body;
  // In a real scenario, we would push this to a database
  res.json({ success: true, message: `Exam '${examData.title || 'Untitled'}' scheduled successfully!`, examData });
});

app.put('/api/admin/exams/:id', verifyToken, (req, res) => {
  const examId = req.params.id;
  const examData = req.body;
  res.json({ success: true, message: `Exam ${examId} updated successfully`, examData });
});

// 4. Event Upload
app.post('/api/admin/events', verifyToken, (req, res) => {
  const eventData = req.body;
  res.json({ success: true, message: 'Event created successfully', eventData });
});

// 5. Event Edit
app.put('/api/admin/events/:id', verifyToken, (req, res) => {
  const eventId = req.params.id;
  const eventData = req.body;
  res.json({ success: true, message: `Event ${eventId} updated successfully`, eventData });
});

// 6. Register Student for Admit Card
app.post('/api/admin/student', verifyToken, async (req, res) => {
  try {
    const { name, rollNo, exam } = req.body;
    if (!name || !rollNo) return res.status(400).json({ success: false, message: 'Name and Roll No are required' });

    const [student, created] = await Student.findOrCreate({
      where: { rollNo },
      defaults: { name, exam: exam || 'General Assessment' }
    });

    if (!created) {
      await student.update({ name, exam: exam || 'General Assessment' });
    }

    res.json({ success: true, message: 'Student registered successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to register student: ' + err.message });
  }
});

// 7. Public Admit Card Generation
app.get('/api/public/admit-card/:rollNo', async (req, res) => {
  try {
    const rollNo = req.params.rollNo;
    const student = await Student.findOne({ where: { rollNo } });

    if (!student) {
      return res.status(404).send('Student not found. Please check your Roll Number.');
    }

    // Create a PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    res.setHeader('Content-disposition', `attachment; filename=AdmitCard_${rollNo}.pdf`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Design the PDF
    doc.rect(20, 20, 555, 300).stroke('#4cc9f0'); // Outer border
    doc.rect(25, 25, 545, 290).stroke('#adb5bd'); // Inner border

    doc.fontSize(24).fillColor('#0b0c10').text('NEW APURBA SANGHA LIBRARY', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).fillColor('#7209b7').text('OFFICIAL ADMIT CARD', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(14).fillColor('black');
    doc.text(`Student Name : ${student.name.toUpperCase()}`, 50, 150);
    doc.text(`Roll Number  : ${student.rollNo}`, 50, 180);
    doc.text(`Examination  : ${student.exam}`, 50, 210);

    doc.moveDown(2);
    doc.fontSize(10).fillColor('gray').text('Please bring a printed copy of this admit card to the examination center.', 50, 280, { align: 'center' });

    doc.end();
  } catch (err) {
    res.status(500).send('Failed to generate admit card: ' + err.message);
  }
});

app.get('/', (req, res) => {
  res.json({ success: true, message: '3D Library Backend API is running successfully!' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
