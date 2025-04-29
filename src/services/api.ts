
import axios from 'axios';

// Base URLs for different government portals
const API_ENDPOINTS = {
  doris: 'https://api.doris.delhi.gov.in/v1',  // Delhi Online Registration Information System
  dlr: 'https://api.landrecords.gov.in/v1',     // Department of Land Records
  cersai: 'https://api.cersai.org.in/api',      // Central Registry of Securitisation Asset Reconstruction
  mca21: 'https://api.mca.gov.in/api/v1'        // Ministry of Corporate Affairs
};

// Timeout settings (in milliseconds)
const API_TIMEOUT = 15000;

// Create axios instances for each API
const createApiInstance = (baseURL: string) => {
  return axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
};

// API clients for each portal
const dorisApi = createApiInstance(API_ENDPOINTS.doris);
const dlrApi = createApiInstance(API_ENDPOINTS.dlr);
const cersaiApi = createApiInstance(API_ENDPOINTS.cersai);
const mca21Api = createApiInstance(API_ENDPOINTS.mca21);

// Export the API instances
export {
  dorisApi,
  dlrApi,
  cersaiApi,
  mca21Api
};

// Add interceptors for error handling (example)
[dorisApi, dlrApi, cersaiApi, mca21Api].forEach(api => {
  api.interceptors.response.use(
    response => response,
    error => {
      // Log errors to console (in production, you might want to send to a monitoring service)
      console.error('API Error:', error);
      
      // Return a standardized error object
      return Promise.reject({
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Unknown error occurred',
        originalError: error
      });
    }
  );
});
