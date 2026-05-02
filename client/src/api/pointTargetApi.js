import api from './client';

export const pointTargetApi = {
  create: (data) => api.post('/point-targets', data),
  getByProject: (projectId) => api.get(`/point-targets/project/${projectId}`),
  getByUser: (userId) => api.get(`/point-targets/user/${userId}`),
  update: (id, data) => api.put(`/point-targets/${id}`, data),
  remove: (id) => api.delete(`/point-targets/${id}`)
};
