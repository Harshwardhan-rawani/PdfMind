const express = require('express');
const router = express.Router();
const { signup, login, logout, verify } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', verify);

module.exports = router; 