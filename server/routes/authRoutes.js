const express = require('express');
const router = express.Router();
const { registerMember, registerAdmin, login, getMe, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', registerMember);
router.post('/register/admin', registerAdmin);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);

module.exports = router;
