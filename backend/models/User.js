const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  bytes: { type: Number },
  created_at: { type: Date, default: Date.now },
  pages: { type: Number, default: 0 }, // Add pages field
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  pdfs: [pdfSchema],
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);