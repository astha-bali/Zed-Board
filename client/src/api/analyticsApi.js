import api from './client';

export const analyticsApi = {
  getUserAnalytics: (userId) => api.get(`/analytics/user/${userId}`),
  getOverallAnalytics: (projectId) => api.get(`/analytics/overall${projectId ? '?projectId=' + projectId : ''}`),
  getProjectAnalytics: (projectId) => api.get(`/analytics/project/${projectId}`)
};
