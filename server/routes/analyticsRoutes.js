const express = require('express');
const router = express.Router();
const { getUserAnalytics, getOverallAnalytics, getProjectAnalytics } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/user/:userId', getUserAnalytics);
router.get('/overall', getOverallAnalytics);
router.get('/project/:projectId', getProjectAnalytics);

module.exports = router;
