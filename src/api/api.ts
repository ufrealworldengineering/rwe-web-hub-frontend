import axios, { 
  type AxiosInstance, 
  type AxiosError, 
  type InternalAxiosRequestConfig, 
  type AxiosResponse 
} from 'axios';
import { useAuthStore } from './store/authStore';


interface ApiError {}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Error Handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const authStore = useAuthStore.getState();

    // 1. Handle Network Errors
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
      } as ApiError);
    }

    const status = error.response.status;

    // 2. Handle 401 Unauthorized 
    if (status === 401) {
      await authStore.refreshToken();
    }

    // 3. Handle 403 Forbidden 
    if (status === 403) {
      console.error("Access denied. You do not have permissions for this action.");
    }

    return Promise.reject(error);
  }
);

export default api;