const mongoose = require('mongoose');

const pointTargetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  // Target points for a period
  targetPoints: {
    type: Number,
    required: true,
    min: 0
  },
  // Period type
  period: {
    type: String,
    enum: ['sprint', 'weekly', 'monthly', 'quarterly'],
    default: 'sprint'
  },
  periodStart: {
    type: Date,
    required: true
  },
  periodEnd: {
    type: Date,
    required: true
  },
  // Set by manager
  setBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

pointTargetSchema.index({ user: 1, project: 1, period: 1 });

module.exports = mongoose.model('PointTarget', pointTargetSchema);
