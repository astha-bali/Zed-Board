// Icon component names from lucide-react (imported in components)
export const ISSUE_TYPES = [
  { value: 'story', label: 'Story', icon: 'BookOpen', color: '#22c55e' },
  { value: 'task', label: 'Task', icon: 'CheckSquare', color: '#3b82f6' },
  { value: 'bug', label: 'Bug', icon: 'Bug', color: '#ef4444' },
  { value: 'epic', label: 'Epic', icon: 'Zap', color: '#a855f7' },
  { value: 'subtask', label: 'Subtask', icon: 'GitBranch', color: '#06b6d4' },
  { value: 'improvement', label: 'Improvement', icon: 'Lightbulb', color: '#f59e0b' }
];

export const PRIORITIES = [
  { value: 'highest', label: 'Highest', icon: 'ChevronsUp', color: '#ef4444' },
  { value: 'high', label: 'High', icon: 'ChevronUp', color: '#f97316' },
  { value: 'medium', label: 'Medium', icon: 'Minus', color: '#f59e0b' },
  { value: 'low', label: 'Low', icon: 'ChevronDown', color: '#3b82f6' },
  { value: 'lowest', label: 'Lowest', icon: 'ChevronsDown', color: '#94a3b8' }
];

export const STATUSES = [
  { value: 'backlog', label: 'Backlog', color: '#64748b', icon: 'Inbox' },
  { value: 'todo', label: 'To Do', color: '#94a3b8', icon: 'Circle' },
  { value: 'in_progress', label: 'In Progress', color: '#3b82f6', icon: 'Loader' },
  { value: 'code_review', label: 'Code Review', color: '#8b5cf6', icon: 'GitPullRequest' },
  { value: 'testing', label: 'Testing', color: '#f59e0b', icon: 'FlaskConical' },
  { value: 'uat', label: 'UAT', color: '#f97316', icon: 'UserCheck' },
  { value: 'done', label: 'Done', color: '#22c55e', icon: 'CircleCheck' },
  { value: 'deployed', label: 'Deployed', color: '#06b6d4', icon: 'Rocket' }
];

export const STATUS_COLUMNS = ['backlog', 'todo', 'in_progress', 'code_review', 'testing', 'uat', 'done', 'deployed'];

export const SDLC_PHASES = [
  { value: 'requirements', label: 'Requirements', icon: 'ClipboardList', color: '#8b5cf6' },
  { value: 'design', label: 'Design', icon: 'Palette', color: '#ec4899' },
  { value: 'development', label: 'Development', icon: 'Code', color: '#3b82f6' },
  { value: 'testing', label: 'Testing', icon: 'FlaskConical', color: '#f59e0b' },
  { value: 'deployment', label: 'Deployment', icon: 'Rocket', color: '#22c55e' },
  { value: 'maintenance', label: 'Maintenance', icon: 'Wrench', color: '#94a3b8' }
];

export const ROLES = [
  { value: 'admin', label: 'Admin', color: '#ef4444', icon: 'Shield' },
  { value: 'manager', label: 'Manager', color: '#f59e0b', icon: 'BarChart3' },
  { value: 'member', label: 'Member', color: '#3b82f6', icon: 'User' }
];

export const POINT_PERIODS = [
  { value: 'sprint', label: 'Sprint' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' }
];
