const Project = require('../models/Project');

// Generate a unique issue key like "ZED-42"
const generateIssueKey = async (projectId) => {
  const project = await Project.findByIdAndUpdate(
    projectId,
    { $inc: { issueCounter: 1 } },
    { new: true }
  );
  return `${project.key}-${project.issueCounter}`;
};

module.exports = { generateIssueKey };
