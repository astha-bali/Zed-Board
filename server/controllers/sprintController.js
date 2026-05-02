const Sprint = require('../models/Sprint');
const Issue = require('../models/Issue');

// @desc    Create sprint
// @route   POST /api/projects/:projectId/sprints
exports.createSprint = async (req, res, next) => {
  try {
    const { name, goal, startDate, endDate } = req.body;

    const sprintCount = await Sprint.countDocuments({ project: req.params.projectId });

    const sprint = await Sprint.create({
      name: name || `Sprint ${sprintCount + 1}`,
      project: req.params.projectId,
      goal,
      startDate,
      endDate,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: sprint });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project sprints
// @route   GET /api/projects/:projectId/sprints
exports.getSprints = async (req, res, next) => {
  try {
    const sprints = await Sprint.find({ project: req.params.projectId })
      .sort('-createdAt');

    res.json({ success: true, data: sprints });
  } catch (error) {
    next(error);
  }
};

// @desc    Update sprint
// @route   PUT /api/sprints/:id
exports.updateSprint = async (req, res, next) => {
  try {
    const sprint = await Sprint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!sprint) {
      return res.status(404).json({ success: false, message: 'Sprint not found' });
    }

    res.json({ success: true, data: sprint });
  } catch (error) {
    next(error);
  }
};

// @desc    Start sprint
// @route   PUT /api/sprints/:id/start
exports.startSprint = async (req, res, next) => {
  try {
    const sprint = await Sprint.findByIdAndUpdate(
      req.params.id,
      {
        status: 'active',
        startDate: req.body.startDate || new Date(),
        endDate: req.body.endDate
      },
      { new: true }
    );

    if (!sprint) {
      return res.status(404).json({ success: false, message: 'Sprint not found' });
    }

    res.json({ success: true, data: sprint });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete sprint
// @route   PUT /api/sprints/:id/complete
exports.completeSprint = async (req, res, next) => {
  try {
    const sprint = await Sprint.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );

    if (!sprint) {
      return res.status(404).json({ success: false, message: 'Sprint not found' });
    }

    // Move incomplete issues to backlog (sprint = null)
    await Issue.updateMany(
      { sprint: sprint._id, status: { $ne: 'done' } },
      { sprint: null }
    );

    res.json({ success: true, data: sprint });
  } catch (error) {
    next(error);
  }
};
