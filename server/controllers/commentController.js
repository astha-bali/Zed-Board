const Comment = require('../models/Comment');

// @desc    Add comment
// @route   POST /api/issues/:issueId/comments
exports.addComment = async (req, res, next) => {
  try {
    const { body } = req.body;

    if (!body) {
      return res.status(400).json({ success: false, message: 'Comment body is required' });
    }

    const comment = await Comment.create({
      body,
      issue: req.params.issueId,
      author: req.user._id
    });

    await comment.populate('author', 'name email avatar');

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get issue comments
// @route   GET /api/issues/:issueId/comments
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ issue: req.params.issueId })
      .populate('author', 'name email avatar')
      .sort('createdAt');

    res.json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
exports.updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      { body: req.body.body },
      { new: true }
    ).populate('author', 'name email avatar');

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    res.json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id
    });

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
