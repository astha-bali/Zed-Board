const PointTarget = require('../models/PointTarget');
const Issue = require('../models/Issue');

// @desc    Set point target for a user
// @route   POST /api/point-targets
exports.createTarget = async (req, res, next) => {
  try {
    const { user, project, sprint, targetPoints, period, periodStart, periodEnd, notes } = req.body;

    const target = await PointTarget.create({
      user, project, sprint,
      targetPoints, period,
      periodStart, periodEnd,
      setBy: req.user._id,
      notes
    });

    await target.populate('user', 'name email avatar');
    await target.populate('project', 'name key');
    await target.populate('setBy', 'name email');

    res.status(201).json({ success: true, data: target });
  } catch (error) {
    next(error);
  }
};

// @desc    Get targets for a project
// @route   GET /api/point-targets/project/:projectId
exports.getProjectTargets = async (req, res, next) => {
  try {
    const targets = await PointTarget.find({ project: req.params.projectId })
      .populate('user', 'name email avatar')
      .populate('project', 'name key')
      .populate('setBy', 'name email')
      .sort('-createdAt');

    res.json({ success: true, data: targets });
  } catch (error) {
    next(error);
  }
};

// @desc    Get targets for a specific user
// @route   GET /api/point-targets/user/:userId
exports.getUserTargets = async (req, res, next) => {
  try {
    const targets = await PointTarget.find({ user: req.params.userId })
      .populate('user', 'name email avatar')
      .populate('project', 'name key')
      .populate('sprint', 'name status')
      .populate('setBy', 'name email')
      .sort('-periodStart');

    res.json({ success: true, data: targets });
  } catch (error) {
    next(error);
  }
};

// @desc    Update target
// @route   PUT /api/point-targets/:id
exports.updateTarget = async (req, res, next) => {
  try {
    const target = await PointTarget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('user', 'name email avatar')
      .populate('project', 'name key');

    if (!target) {
      return res.status(404).json({ success: false, message: 'Target not found' });
    }

    res.json({ success: true, data: target });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete target
// @route   DELETE /api/point-targets/:id
exports.deleteTarget = async (req, res, next) => {
  try {
    const target = await PointTarget.findByIdAndDelete(req.params.id);
    if (!target) {
      return res.status(404).json({ success: false, message: 'Target not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
