const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Issue title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    default: ''
  },
  issueKey: {
    type: String,
    unique: true
  },
  type: {
    type: String,
    enum: ['story', 'task', 'bug', 'epic', 'subtask', 'improvement'],
    default: 'task'
  },
  // Enhanced SDLC statuses
  status: {
    type: String,
    enum: ['backlog', 'todo', 'in_progress', 'code_review', 'testing', 'uat', 'done', 'deployed'],
    default: 'backlog'
  },
  priority: {
    type: String,
    enum: ['lowest', 'low', 'medium', 'high', 'highest'],
    default: 'medium'
  },
  labels: [{
    type: String,
    trim: true
  }],
  // People — assignee, reporter, reviewer, QA
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  qa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  sprint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sprint',
    default: null
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    default: null
  },
  // Point system
  storyPoints: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // Time tracking
  estimatedHours: {
    type: Number,
    default: 0
  },
  loggedHours: {
    type: Number,
    default: 0
  },
  dueDate: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  // SDLC phase
  sdlcPhase: {
    type: String,
    enum: ['requirements', 'design', 'development', 'testing', 'deployment', 'maintenance'],
    default: 'development'
  }
}, {
  timestamps: true
});

// Auto-set completedAt when status changes to done/deployed
issueSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'done' || this.status === 'deployed') {
      this.completedAt = new Date();
    } else {
      this.completedAt = null;
    }
  }
  next();
});

issueSchema.index({ project: 1, status: 1 });
issueSchema.index({ project: 1, sprint: 1 });
issueSchema.index({ assignee: 1 });
issueSchema.index({ assignee: 1, status: 1 });
issueSchema.index({ reviewer: 1 });
issueSchema.index({ qa: 1 });

module.exports = mongoose.model('Issue', issueSchema);
