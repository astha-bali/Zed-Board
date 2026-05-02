const Issue = require('../models/Issue');
const User = require('../models/User');
const Project = require('../models/Project');
const PointTarget = require('../models/PointTarget');

// @desc    Get analytics for a specific user
// @route   GET /api/analytics/user/:userId
exports.getUserAnalytics = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Total issues breakdown
    const statusCounts = await Issue.aggregate([
      { $match: { assignee: require('mongoose').Types.ObjectId.createFromHexString(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const priorityCounts = await Issue.aggregate([
      { $match: { assignee: require('mongoose').Types.ObjectId.createFromHexString(userId) } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const typeCounts = await Issue.aggregate([
      { $match: { assignee: require('mongoose').Types.ObjectId.createFromHexString(userId) } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Points earned (completed issues)
    const pointsEarned = await Issue.aggregate([
      {
        $match: {
          assignee: require('mongoose').Types.ObjectId.createFromHexString(userId),
          status: { $in: ['done', 'deployed'] }
        }
      },
      { $group: { _id: null, total: { $sum: '$storyPoints' } } }
    ]);

    // Total points assigned
    const totalPointsAssigned = await Issue.aggregate([
      { $match: { assignee: require('mongoose').Types.ObjectId.createFromHexString(userId) } },
      { $group: { _id: null, total: { $sum: '$storyPoints' } } }
    ]);

    // Points in progress
    const pointsInProgress = await Issue.aggregate([
      {
        $match: {
          assignee: require('mongoose').Types.ObjectId.createFromHexString(userId),
          status: { $in: ['in_progress', 'code_review', 'testing', 'uat'] }
        }
      },
      { $group: { _id: null, total: { $sum: '$storyPoints' } } }
    ]);

    // Recent completed issues
    const recentCompleted = await Issue.find({
      assignee: userId,
      status: { $in: ['done', 'deployed'] }
    })
      .populate('project', 'name key')
      .sort('-completedAt')
      .limit(10);

    // Point targets for this user
    const targets = await PointTarget.find({ user: userId })
      .populate('project', 'name key')
      .sort('-periodStart')
      .limit(5);

    // Completion trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const completionTrend = await Issue.aggregate([
      {
        $match: {
          assignee: require('mongoose').Types.ObjectId.createFromHexString(userId),
          completedAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
          count: { $sum: 1 },
          points: { $sum: '$storyPoints' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // SDLC phase distribution
    const sdlcDistribution = await Issue.aggregate([
      { $match: { assignee: require('mongoose').Types.ObjectId.createFromHexString(userId) } },
      { $group: { _id: '$sdlcPhase', count: { $sum: 1 } } }
    ]);

    const user = await User.findById(userId);

    res.json({
      success: true,
      data: {
        user,
        statusCounts,
        priorityCounts,
        typeCounts,
        pointsEarned: pointsEarned[0]?.total || 0,
        totalPointsAssigned: totalPointsAssigned[0]?.total || 0,
        pointsInProgress: pointsInProgress[0]?.total || 0,
        recentCompleted,
        targets,
        completionTrend,
        sdlcDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overall analytics (all users)
// @route   GET /api/analytics/overall
exports.getOverallAnalytics = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    const matchFilter = projectId
      ? { project: require('mongoose').Types.ObjectId.createFromHexString(projectId) }
      : {};

    // Total issues by status
    const statusCounts = await Issue.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Total points by user (leaderboard)
    const leaderboard = await Issue.aggregate([
      { $match: { ...matchFilter, status: { $in: ['done', 'deployed'] }, assignee: { $ne: null } } },
      {
        $group: {
          _id: '$assignee',
          totalPoints: { $sum: '$storyPoints' },
          completedIssues: { $sum: 1 }
        }
      },
      { $sort: { totalPoints: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          totalPoints: 1,
          completedIssues: 1,
          'user.name': 1,
          'user.email': 1,
          'user.avatar': 1,
          'user.role': 1,
          'user.department': 1
        }
      }
    ]);

    // Issues per user
    const issuesPerUser = await Issue.aggregate([
      { $match: { ...matchFilter, assignee: { $ne: null } } },
      {
        $group: {
          _id: '$assignee',
          total: { $sum: 1 },
          done: { $sum: { $cond: [{ $in: ['$status', ['done', 'deployed']] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $in: ['$status', ['in_progress', 'code_review', 'testing', 'uat']] }, 1, 0] } },
          todo: { $sum: { $cond: [{ $in: ['$status', ['backlog', 'todo']] }, 1, 0] } },
          points: { $sum: '$storyPoints' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $sort: { total: -1 } }
    ]);

    // Overall stats
    const totalIssues = await Issue.countDocuments(matchFilter);
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalProjects = await Project.countDocuments();

    const totalPoints = await Issue.aggregate([
      { $match: matchFilter },
      { $group: { _id: null, total: { $sum: '$storyPoints' } } }
    ]);

    const completedPoints = await Issue.aggregate([
      { $match: { ...matchFilter, status: { $in: ['done', 'deployed'] } } },
      { $group: { _id: null, total: { $sum: '$storyPoints' } } }
    ]);

    // Completion rate over time
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyCompletions = await Issue.aggregate([
      {
        $match: {
          ...matchFilter,
          completedAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
          count: { $sum: 1 },
          points: { $sum: '$storyPoints' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        statusCounts,
        leaderboard,
        issuesPerUser,
        totalIssues,
        totalUsers,
        totalProjects,
        totalPoints: totalPoints[0]?.total || 0,
        completedPoints: completedPoints[0]?.total || 0,
        dailyCompletions
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project-specific analytics
// @route   GET /api/analytics/project/:projectId
exports.getProjectAnalytics = async (req, res, next) => {
  try {
    const projectId = require('mongoose').Types.ObjectId.createFromHexString(req.params.projectId);

    const statusCounts = await Issue.aggregate([
      { $match: { project: projectId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const memberPerformance = await Issue.aggregate([
      { $match: { project: projectId, assignee: { $ne: null } } },
      {
        $group: {
          _id: '$assignee',
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $in: ['$status', ['done', 'deployed']] }, 1, 0] } },
          pointsCompleted: {
            $sum: { $cond: [{ $in: ['$status', ['done', 'deployed']] }, '$storyPoints', 0] }
          },
          totalPoints: { $sum: '$storyPoints' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $sort: { pointsCompleted: -1 } }
    ]);

    // Point targets for project
    const targets = await PointTarget.find({ project: req.params.projectId })
      .populate('user', 'name email avatar')
      .populate('setBy', 'name');

    // Calculate target vs actual for each member
    const targetVsActual = [];
    for (const target of targets) {
      const actual = await Issue.aggregate([
        {
          $match: {
            assignee: target.user._id,
            project: projectId,
            status: { $in: ['done', 'deployed'] },
            completedAt: { $gte: target.periodStart, $lte: target.periodEnd }
          }
        },
        { $group: { _id: null, earned: { $sum: '$storyPoints' } } }
      ]);

      targetVsActual.push({
        target: target.toObject(),
        actualPoints: actual[0]?.earned || 0,
        percentage: target.targetPoints > 0 
          ? Math.round(((actual[0]?.earned || 0) / target.targetPoints) * 100) 
          : 0
      });
    }

    res.json({
      success: true,
      data: {
        statusCounts,
        memberPerformance,
        targetVsActual
      }
    });
  } catch (error) {
    next(error);
  }
};
