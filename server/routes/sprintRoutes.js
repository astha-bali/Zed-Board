const express = require('express');
const router = express.Router();
const {
  createSprint, getSprints, updateSprint,
  startSprint, completeSprint
} = require('../controllers/sprintController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/project/:projectId', createSprint);
router.get('/project/:projectId', getSprints);

router.put('/:id', updateSprint);
router.put('/:id/start', startSprint);
router.put('/:id/complete', completeSprint);

module.exports = router;
