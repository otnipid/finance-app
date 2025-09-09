import axios from 'axios';

// In development, use relative URLs (handled by Vite proxy)
// In production, use the full URL to the API service
const API_BASE_URL = import.meta.env.PROD 
  ? 'http://finance-api:80'  // Production URL (in-cluster)
  : '';                      // Development (relative URLs)

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to ensure consistent trailing slashes
api.interceptors.request.use(config => {
  // Skip for non-API URLs or URLs that already end with a slash
  if (config.url && !config.url.endsWith('/') && 
      !config.url.includes('.')) {  // Skip for static assets
    config.url += '/';
  }
  return config;
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add authentication headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      if (error.response.status === 401) {
        // Handle unauthorized
        console.error('Unauthorized access - please log in');
      } else if (error.response.status === 404) {
        console.error('The requested resource was not found');
      } else if (error.response.status >= 500) {
        console.error('Server error - please try again later');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.message);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const apiEndpoints = {
  accounts: {
    list: '/accounts/',
    get: (id: number) => `/accounts/${id}`,
    create: '/accounts/',
    delete: (id: number) => `/accounts/${id}`,
  },
  transactions: {
    list: '/transactions/',
    create: '/transactions/',
    delete: (id: number) => `/transactions/${id}`,
  },
  budgetCategories: {
    list: '/budget-categories/',
    create: '/budget-categories/',
    delete: (id: number) => `/budget-categories/${id}`,
  },
  savingsBuckets: {
    list: '/savings-buckets/',
    create: '/savings-buckets/',
    delete: (id: number) => `/savings-buckets/${id}`,
  },
};
