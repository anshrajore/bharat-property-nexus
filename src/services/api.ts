
import axios from 'axios';
import { SearchFormData } from '@/components/search/PropertySearchForm';

// Configure axios with base settings
const api = axios.create({
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// This would be replaced with real API endpoints in production
const API_BASE_URL = 'https://api.bharatpropertynexus.gov.in';

// Endpoints for different portals
export const ENDPOINTS = {
  doris: `${API_BASE_URL}/search/doris`,
  dlr: `${API_BASE_URL}/search/dlr`,
  cersai: `${API_BASE_URL}/search/cersai`,
  mca21: `${API_BASE_URL}/search/mca21`,
};

// API functions for each portal
export const searchDoris = async (data: SearchFormData) => {
  try {
    const response = await api.post(ENDPOINTS.doris, data);
    return response.data;
  } catch (error) {
    console.error('Error searching DORIS:', error);
    throw error;
  }
};

export const searchDlr = async (data: SearchFormData) => {
  try {
    const response = await api.post(ENDPOINTS.dlr, data);
    return response.data;
  } catch (error) {
    console.error('Error searching DLR:', error);
    throw error;
  }
};

export const searchCersai = async (data: SearchFormData) => {
  try {
    const response = await api.post(ENDPOINTS.cersai, data);
    return response.data;
  } catch (error) {
    console.error('Error searching CERSAI:', error);
    throw error;
  }
};

export const searchMca21 = async (data: SearchFormData) => {
  try {
    const response = await api.post(ENDPOINTS.mca21, data);
    return response.data;
  } catch (error) {
    console.error('Error searching MCA21:', error);
    throw error;
  }
};

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific HTTP errors
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          console.error('Authentication required');
          break;
        case 403:
          // Forbidden
          console.error('You do not have permission to access this resource');
          break;
        case 429:
          // Too Many Requests
          console.error('Rate limit exceeded. Please try again later.');
          break;
        case 500:
          // Server Error
          console.error('Internal server error. Please try again later.');
          break;
        default:
          console.error(`Error ${error.response.status}: ${error.response.data.message || 'Something went wrong'}`);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response received from server. Please check your network connection.');
    } else {
      // Error setting up request
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
