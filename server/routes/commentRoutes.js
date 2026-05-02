const express = require('express');
const router = express.Router();
const { addComment, getComments, updateComment, deleteComment } = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/issue/:issueId', addComment);
router.get('/issue/:issueId', getComments);

router.route('/:id')
  .put(updateComment)
  .delete(deleteComment);

module.exports = router;
