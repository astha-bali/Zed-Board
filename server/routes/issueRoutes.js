const express = require('express');
const router = express.Router();
const {
  createIssue, getIssues, getIssue, searchIssues,
  updateIssue, deleteIssue, updateIssueStatus,
  reorderIssues, getDashboardStats, logHours
} = require('../controllers/issueController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/dashboard/stats', getDashboardStats);
router.get('/search', searchIssues);
router.put('/reorder', reorderIssues);

router.post('/project/:projectId', createIssue);
router.get('/project/:projectId', getIssues);

router.route('/:id')
  .get(getIssue)
  .put(updateIssue)
  .delete(deleteIssue);

router.put('/:id/status', updateIssueStatus);
router.put('/:id/log-hours', logHours);

module.exports = router;
