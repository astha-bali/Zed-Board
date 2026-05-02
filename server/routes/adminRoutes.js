const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, toggleUserStatus, updateUser, createUser } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(auth);
router.use(roleCheck('admin', 'manager'));

router.route('/users')
  .get(getAllUsers)
  .post(roleCheck('admin'), createUser);

router.put('/users/:id', updateUser);
router.put('/users/:id/role', roleCheck('admin'), updateUserRole);
router.put('/users/:id/status', roleCheck('admin'), toggleUserStatus);

module.exports = router;
