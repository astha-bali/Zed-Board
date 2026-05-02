const express = require('express');
const router = express.Router();
const { searchUsers, getUser } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/search', searchUsers);
router.get('/:id', getUser);

module.exports = router;
