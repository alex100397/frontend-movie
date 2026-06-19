import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

// In dev, Vite proxies /api -> backend. In prod, set VITE_API_URL.
const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// Request interceptor not needed anymore for auth because 
// the browser automatically attaches the HttpOnly 'jwt' cookie
// thanks to withCredentials: true.

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default api;
