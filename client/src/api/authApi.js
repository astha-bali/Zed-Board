import api from './client';

export const authApi = {
  registerMember: (data) => api.post('/auth/register', data),
  registerAdmin: (data) => api.post('/auth/register/admin', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};
