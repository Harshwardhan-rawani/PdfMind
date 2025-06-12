const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const pdfParse = require('pdf-parse');
const cloudinary = require('cloudinary').v2;


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

exports.uploadPDF = async (req, res) => {
  try {
    console.log('File upload request received:', req.file);
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Always get userId from JWT
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (err) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    // Count number of pages using pdf-parse
    let numPages = 0;
    try {
      const pdfData = await pdfParse(req.file.buffer);
      numPages = pdfData.numpages || 0;
    } catch (err) {
      console.error('Error parsing PDF for page count:', err);
      numPages = 0;
    }
    // Upload to Cloudinary with original filename
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: 'pdfmind/pdfs',
          format: 'pdf',
          type: "upload",
          public_id: path.parse(req.file.originalname).name // Use original filename (without extension)
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    // Save PDF info to user's pdfs array in MongoDB
    const pdfData = {
      title: req.file.originalname,
      url: result.secure_url,
      public_id: result.public_id,
      bytes: result.bytes,
      created_at: result.created_at,
      pages: numPages
    };
    await User.findByIdAndUpdate(
      userId,
      { $push: { pdfs: pdfData } },
      { new: true }
    );
    res.json({
      message: 'File uploaded successfully',
      url: result.secure_url,
      public_id: result.public_id,
      pages: numPages
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
};

// Controller to handle GET /pdfs - list all uploaded PDFs (Firebase example)
exports.listPDFs = async (req, res) => {
  try {
    // Extract token from cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    // Verify token and get userId
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
      
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // Fetch user's PDFs from MongoDB
    const user = await User.findById(userId).select('pdfs');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    res.json(user.pdfs);

  } catch (error) {
    console.error('Error listing PDFs:', error);
    res.status(500).json({ message: 'Error fetching PDFs' });
  }
};

// Delete a PDF for the authenticated user
exports.deletePDF = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const { pdfId } = req.params;
    if (!pdfId) {
      return res.status(400).json({ message: 'PDF id required' });
    }
    // Find user and PDF
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const pdf = user.pdfs.id(pdfId);
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    // Remove from Cloudinary
    await cloudinary.uploader.destroy(pdf.public_id, { resource_type: 'raw' });
    // Remove from user's pdfs array
    pdf.deleteOne();
    await user.save();
    res.json({ message: 'PDF deleted successfully' });
  } catch (error) {
    console.error('Delete PDF error:', error);
    res.status(500).json({ message: 'Error deleting PDF' });
  }
};

// Get PDF info by id for chat context
exports.getPDFInfo = async (req, res) => {
  try {
    const token = req.cookies.token;
    

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const { pdfId } = req.params;
    if (!pdfId) {
      return res.status(400).json({ message: 'PDF id required' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const pdf = user.pdfs.id(pdfId);
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    return res.json({
      title: pdf.title,
      pages: pdf.pages,
      created_at: pdf.created_at,
      bytes: pdf.bytes,
      public_id: pdf.public_id,
      url: pdf.url
    });
  } catch (error) {
    console.error('Get PDF info error:', error);
    res.status(500).json({ message: 'Error fetching PDF info' });
  }
};

// Rename a PDF for the authenticated user
exports.renamePDF = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const { pdfId } = req.params;
    const { title } = req.body;
    if (!pdfId || !title) {
      return res.status(400).json({ message: 'PDF id and new title required' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const pdf = user.pdfs.id(pdfId);
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    pdf.title = title;
    await user.save();
    res.json({ message: 'PDF renamed successfully', title });
  } catch (error) {
    console.error('Rename PDF error:', error);
    res.status(500).json({ message: 'Error renaming PDF' });
  }
};

// Export the multer middleware for use in routes
exports.uploadMiddleware = upload.single('file');