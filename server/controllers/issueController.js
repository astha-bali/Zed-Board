const Issue = require('../models/Issue');
const { generateIssueKey } = require('../utils/issueKeyGenerator');

const PEOPLE_FIELDS = 'name email avatar';
const populateIssue = (query) => query
  .populate('assignee', PEOPLE_FIELDS)
  .populate('reporter', PEOPLE_FIELDS)
  .populate('reviewer', PEOPLE_FIELDS)
  .populate('qa', PEOPLE_FIELDS);

// @desc    Create issue
exports.createIssue = async (req, res, next) => {
  try {
    const { title, description, type, priority, assignee, reviewer, qa, sprint, storyPoints, labels, dueDate, sdlcPhase, estimatedHours, status } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

    const issueKey = await generateIssueKey(req.params.projectId);
    const maxOrder = await Issue.findOne({ project: req.params.projectId, status: status || 'backlog' }).sort('-order').select('order');

    const issue = await Issue.create({
      title, description, issueKey,
      type: type || 'task',
      status: status || 'backlog',
      priority: priority || 'medium',
      assignee: assignee || null,
      reporter: req.user._id,
      reviewer: reviewer || null,
      qa: qa || null,
      project: req.params.projectId,
      sprint, storyPoints, labels, dueDate,
      sdlcPhase: sdlcPhase || 'development',
      estimatedHours: estimatedHours || 0,
      order: maxOrder ? maxOrder.order + 1 : 0
    });

    const populated = await populateIssue(Issue.findById(issue._id));
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project issues
exports.getIssues = async (req, res, next) => {
  try {
    const { status, priority, type, assignee, reviewer, qa, sprint, search, sdlcPhase } = req.query;
    const filter = { project: req.params.projectId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (type) filter.type = type;
    if (assignee) filter.assignee = assignee;
    if (reviewer) filter.reviewer = reviewer;
    if (qa) filter.qa = qa;
    if (sprint) filter.sprint = sprint;
    if (sdlcPhase) filter.sdlcPhase = sdlcPhase;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { issueKey: { $regex: search, $options: 'i' } }
      ];
    }

    const issues = await populateIssue(Issue.find(filter)).sort('order');
    res.json({ success: true, data: issues });
  } catch (error) {
    next(error);
  }
};

// @desc    Global search issues
exports.searchIssues = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json({ success: true, data: [] });

    // Admins can search all issues, members only issues in projects they belong to
    // For simplicity right now, since we don't have project privacy strictly enforced at the search level for members yet,
    // we'll just search all issues but limit to 10
    const filter = {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { issueKey: { $regex: q, $options: 'i' } }
      ]
    };

    const issues = await Issue.find(filter)
      .populate('project', 'name key')
      .populate('assignee', 'name avatar')
      .sort('-updatedAt')
      .limit(10);
      
    res.json({ success: true, data: issues });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single issue
exports.getIssue = async (req, res, next) => {
  try {
    const issue = await populateIssue(
      Issue.findById(req.params.id)
        .populate('project', 'name key members')
        .populate('sprint', 'name status')
    );
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });
    res.json({ success: true, data: issue });
  } catch (error) {
    next(error);
  }
};

// @desc    Update issue
exports.updateIssue = async (req, res, next) => {
  try {
    if (req.body.status === 'done' || req.body.status === 'deployed') {
      req.body.completedAt = new Date();
    } else if (req.body.status && req.body.status !== 'done' && req.body.status !== 'deployed') {
      req.body.completedAt = null;
    }

    const issue = await populateIssue(
      Issue.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    );
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });
    res.json({ success: true, data: issue });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete issue
exports.deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Update issue status (drag-and-drop)
exports.updateIssueStatus = async (req, res, next) => {
  try {
    const { status, order } = req.body;
    const updateData = { status, order };
    if (status === 'done' || status === 'deployed') updateData.completedAt = new Date();
    else updateData.completedAt = null;

    const issue = await populateIssue(
      Issue.findByIdAndUpdate(req.params.id, updateData, { new: true })
    );
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });
    res.json({ success: true, data: issue });
  } catch (error) {
    next(error);
  }
};

// @desc    Batch reorder issues
exports.reorderIssues = async (req, res, next) => {
  try {
    const { issues } = req.body;
    const bulkOps = issues.map(issue => ({
      updateOne: {
        filter: { _id: issue._id },
        update: { status: issue.status, order: issue.order }
      }
    }));
    await Issue.bulkWrite(bulkOps);
    res.json({ success: true, message: 'Issues reordered' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats (role-aware: admin sees all, member sees own)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'manager';

    // If admin, match ALL issues; if member, match only assigned
    const matchFilter = isAdmin ? {} : { assignee: userId };

    const myIssues = isAdmin
      ? await populateIssue(Issue.find({}).populate('project', 'name key')).sort('-updatedAt').limit(15)
      : await populateIssue(Issue.find({ assignee: userId }).populate('project', 'name key')).sort('-updatedAt').limit(10);

    const statusCounts = await Issue.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const priorityCounts = await Issue.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    const typeCounts = await Issue.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const pointsSummary = await Issue.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalAssigned: { $sum: '$storyPoints' },
          completed: {
            $sum: { $cond: [{ $in: ['$status', ['done', 'deployed']] }, '$storyPoints', 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $in: ['$status', ['in_progress', 'code_review', 'testing', 'uat']] }, '$storyPoints', 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        myIssues, statusCounts, priorityCounts, typeCounts,
        pointsSummary: pointsSummary[0] || { totalAssigned: 0, completed: 0, inProgress: 0 },
        isAdminView: isAdmin
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log hours on an issue
exports.logHours = async (req, res, next) => {
  try {
    const { hours } = req.body;
    const issue = await populateIssue(
      Issue.findByIdAndUpdate(req.params.id, { $inc: { loggedHours: hours } }, { new: true })
    );
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });
    res.json({ success: true, data: issue });
  } catch (error) {
    next(error);
  }
};
