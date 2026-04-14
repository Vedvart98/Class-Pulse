import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  requestMagicLink: (email: string) =>
    api.post('/auth/request-magic-link', { email }),
  
  verifyToken: (token: string) =>
    api.post('/auth/verify-token', { token }),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
};

export const announcementApi = {
  getAll: () => api.get('/announcements'),
  getById: (id: number) => api.get(`/announcements/${id}`),
  create: (data: { title: string; content: string; priority: string }) =>
    api.post('/announcements', data),
  update: (id: number, data: { title: string; content: string; priority: string }) =>
    api.put(`/announcements/${id}`, data),
  delete: (id: number) => api.delete(`/announcements/${id}`),
};

export const userApi = {
  getAll: () => api.get('/users'),
  register: (data: { name: string; email: string }) => api.post('/users/register', data),
  create: (data: { name: string; email: string }) => api.post('/users', data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

export default api;