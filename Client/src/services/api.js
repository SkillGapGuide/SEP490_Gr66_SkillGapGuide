import axios from 'axios';
const BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080';
// 1. api instance - Cấu hình cơ bản axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  // headers: {
  //   'Content-Type': 'application/json',
  // }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Handle different error status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // Handle forbidden
         
          break;
        case 404:
          // Handle not found
          alert('Resource not found. Please check the URL or contact support.');
          break;
        default:
          // Handle other errors
          alert(`An error occurred: ${error.response.data.message || 'Unknown error'}`);
          console.error('API Error:', error.response.data);
          break;
      }
    }
    return Promise.reject(error);
  }
);

// 2. apiService - Wrapper với xử lý lỗi và interface đơn giản
export const apiService = {
  get: async (endpoint, params = {}) => {
    try {
      // Sử dụng api instance bên trong
      return await api.get(endpoint, { params });
    } catch (error) {
      throw error;
    }
  },

  post: async (endpoint, data = {}) => {
    try {
      return await api.post(endpoint, data);
    } catch (error) {
      throw error;
    }
  },

  put: async (endpoint, data = {}) => {
    try {
      return await api.put(endpoint, data);
    } catch (error) {
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      return await api.delete(endpoint);
    } catch (error) {
      throw error;
    }
  },

  patch: async (endpoint, data = {}) => {
    try {
      return await api.patch(endpoint, data);
    } catch (error) {
      throw error;
    }
  }
};

export default apiService;
