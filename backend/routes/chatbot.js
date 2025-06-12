const express = require('express');
const router = express.Router();
const { askChatbot } = require('../controllers/Chatbot');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/ask', isAuthenticated, askChatbot);

module.exports = router;
