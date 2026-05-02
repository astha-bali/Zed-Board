const User = require('../models/User');

// @desc    Get all users (admin/manager)
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, department } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (department) filter.department = department;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter).sort('-createdAt');
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (admin only)
// @route   PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['admin', 'manager', 'member'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate/Activate user (admin only)
// @route   PUT /api/admin/users/:id/status
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deactivating self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot deactivate yourself' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details (admin)
// @route   PUT /api/admin/users/:id
exports.updateUser = async (req, res, next) => {
  try {
    const { name, designation, department, organization } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, designation, department, organization },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user (admin only)
// @route   POST /api/admin/users
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, organization, designation, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      name, email, password,
      role: role || 'member',
      organization, designation, department
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
