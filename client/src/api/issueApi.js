import api from './client';

export const issueApi = {
  getByProject: (projectId, params = '') => api.get(`/issues/project/${projectId}${params ? '?' + params : ''}`),
  getOne: (id) => api.get(`/issues/${id}`),
  create: (projectId, data) => api.post(`/issues/project/${projectId}`, data),
  update: (id, data) => api.put(`/issues/${id}`, data),
  remove: (id) => api.delete(`/issues/${id}`),
  updateStatus: (id, data) => api.put(`/issues/${id}/status`, data),
  reorder: (data) => api.put('/issues/reorder', data),
  getDashboardStats: () => api.get('/issues/dashboard/stats'),
  logHours: (id, hours) => api.put(`/issues/${id}/log-hours`, { hours }),
  searchGlobal: (query) => api.get(`/issues/search?q=${encodeURIComponent(query)}`)
};
