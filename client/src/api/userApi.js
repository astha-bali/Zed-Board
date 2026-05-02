import api from './client';

export const userApi = {
  search: (query) => api.get(`/users/search?q=${encodeURIComponent(query)}`),
  getOne: (id) => api.get(`/users/${id}`)
};
