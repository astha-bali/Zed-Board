import api from './client';

export const sprintApi = {
  getByProject: (projectId) => api.get(`/sprints/project/${projectId}`),
  create: (projectId, data) => api.post(`/sprints/project/${projectId}`, data),
  update: (id, data) => api.put(`/sprints/${id}`, data),
  start: (id, data) => api.put(`/sprints/${id}/start`, data),
  complete: (id) => api.put(`/sprints/${id}/complete`, {})
};
