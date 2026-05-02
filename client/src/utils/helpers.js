import { ISSUE_TYPES, PRIORITIES, STATUSES, SDLC_PHASES, ROLES } from './constants';

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const getIssueTypeInfo = (type) => ISSUE_TYPES.find(t => t.value === type) || ISSUE_TYPES[1];
export const getPriorityInfo = (priority) => PRIORITIES.find(p => p.value === priority) || PRIORITIES[2];
export const getStatusInfo = (status) => STATUSES.find(s => s.value === status) || STATUSES[0];
export const getSdlcPhaseInfo = (phase) => SDLC_PHASES.find(p => p.value === phase) || SDLC_PHASES[2];
export const getRoleInfo = (role) => ROLES.find(r => r.value === role) || ROLES[2];

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
};

export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

export const generateAvatarColor = (name) => {
  if (!name) return '#6366f1';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#22c55e', '#06b6d4', '#3b82f6'];
  return colors[Math.abs(hash) % colors.length];
};
