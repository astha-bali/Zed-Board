import api from './client';

export const adminApi = {
  getUsers: (params = '') => api.get(`/admin/users${params ? '?' + params : ''}`),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  updateRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  toggleStatus: (id) => api.put(`/admin/users/${id}/status`, {})
};
