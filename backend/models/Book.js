const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  coverUrl: { type: String },
  fileUrl: { type: String },
  price: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false },
  category: { type: String, default: 'Fiction' }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
