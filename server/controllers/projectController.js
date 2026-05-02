const Project = require('../models/Project');

// @desc    Create project
// @route   POST /api/projects
exports.createProject = async (req, res, next) => {
  try {
    const { name, key, description } = req.body;

    if (!name || !key) {
      return res.status(400).json({ success: false, message: 'Name and key are required' });
    }

    const project = await Project.create({
      name,
      key: key.toUpperCase(),
      description,
      lead: req.user._id,
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }]
    });

    await project.populate('lead', 'name email avatar');
    await project.populate('members.user', 'name email avatar');

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's projects
// @route   GET /api/projects
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      'members.user': req.user._id
    })
      .populate('lead', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .sort('-createdAt');

    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('lead', 'name email avatar')
      .populate('members.user', 'name email avatar');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
exports.updateProject = async (req, res, next) => {
  try {
    const { name, description, lead } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, lead },
      { new: true, runValidators: true }
    )
      .populate('lead', 'name email avatar')
      .populate('members.user', 'name email avatar');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
exports.addMember = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const alreadyMember = project.members.find(m => m.user.toString() === userId);
    if (alreadyMember) {
      return res.status(400).json({ success: false, message: 'User is already a member' });
    }

    project.members.push({ user: userId, role: role || 'member' });
    await project.save();
    await project.populate('members.user', 'name email avatar');

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
exports.removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.members = project.members.filter(
      m => m.user.toString() !== req.params.userId
    );
    await project.save();
    await project.populate('members.user', 'name email avatar');

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};
