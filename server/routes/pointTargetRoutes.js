const express = require('express');
const router = express.Router();
const { createTarget, getProjectTargets, getUserTargets, updateTarget, deleteTarget } = require('../controllers/pointTargetController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(auth);

router.post('/', roleCheck('admin', 'manager'), createTarget);
router.get('/project/:projectId', getProjectTargets);
router.get('/user/:userId', getUserTargets);
router.put('/:id', roleCheck('admin', 'manager'), updateTarget);
router.delete('/:id', roleCheck('admin', 'manager'), deleteTarget);

module.exports = router;
