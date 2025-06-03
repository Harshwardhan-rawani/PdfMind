const express = require('express');
const router = express.Router();
const { uploadPDF, uploadMiddleware } = require('../controllers/uploadController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Protected route for PDF uploads
router.post('/pdf', isAuthenticated, uploadMiddleware, uploadPDF);

module.exports = router; 