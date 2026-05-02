import api from './client';

export const commentApi = {
  getByIssue: (issueId) => api.get(`/comments/issue/${issueId}`),
  create: (issueId, data) => api.post(`/comments/issue/${issueId}`, data),
  update: (id, data) => api.put(`/comments/${id}`, data),
  remove: (id) => api.delete(`/comments/${id}`)
};
