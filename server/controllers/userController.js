const User = require('../models/User');

// @desc    Search users
// @route   GET /api/users/search?q=
exports.searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    let query = {};
    if (q) {
      query = {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query).limit(100).select('name email avatar');

    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by id
// @route   GET /api/users/:id
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('name email avatar');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
