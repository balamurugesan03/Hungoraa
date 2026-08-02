import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('hungora-admin-auth');
  if (stored) {
    const { state } = JSON.parse(stored);
    if (state?.accessToken) config.headers.Authorization = `Bearer ${state.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hungora-admin-auth');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
