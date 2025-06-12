const express = require('express');
const router = express.Router();
const { uploadPDF, uploadMiddleware, listPDFs, deletePDF, getPDFInfo, renamePDF } = require('../controllers/uploadController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Protected route for PDF uploads
router.post('/pdfs', isAuthenticated, uploadMiddleware, uploadPDF);

// Route to list all uploaded PDFs
router.get('/pdfs', listPDFs);

// Route to delete a PDF by id
router.delete('/pdfs/:pdfId', deletePDF);

// Route to rename a PDF by id
router.put('/pdfs/:pdfId/rename', renamePDF);

// Route to get PDF info by id for chat context
router.get('/pdf/:pdfId', isAuthenticated,getPDFInfo);

module.exports = router;