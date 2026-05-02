const express = require('express');
const router = express.Router();
const {
  createProject, getProjects, getProject,
  updateProject, deleteProject, addMember, removeMember
} = require('../controllers/projectController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(auth);

// Anyone can list/view projects they belong to
router.route('/')
  .post(roleCheck('admin'), createProject)   // Admin only
  .get(getProjects);

router.route('/:id')
  .get(getProject)
  .put(roleCheck('admin'), updateProject)    // Admin only
  .delete(roleCheck('admin'), deleteProject); // Admin only

// Admin only: manage members
router.post('/:id/members', roleCheck('admin'), addMember);
router.delete('/:id/members/:userId', roleCheck('admin'), removeMember);

module.exports = router;
