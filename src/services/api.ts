
import axios from 'axios';
import { SearchFormData } from '@/components/search/PropertySearchForm';

// Base URLs for different government portals
const API_BASE_URL = 'http://localhost:5000'; // Local Express server

// API timeout settings (in milliseconds)
const API_TIMEOUT = 15000;

// Create axios instance for API calls
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Format the search data for API request
const formatSearchRequestData = (formData: SearchFormData) => {
  return {
    ownerName: formData.ownerName,
    propertyId: formData.propertyId,
    registrationNumber: formData.registrationNumber,
    address: {
      line: formData.address,
      district: formData.district,
      state: formData.state,
      pincode: formData.pinCode
    },
    urban: formData.propertyType === 'urban',
    dateRange: formData.dateRange,
    includeHistorical: formData.includeHistorical
  };
};

// API service functions
export const searchPropertyInDoris = async (formData: SearchFormData) => {
  try {
    const response = await apiClient.post('/api/search/doris', formatSearchRequestData(formData));
    return response.data;
  } catch (error) {
    console.error('DORIS API Error:', error);
    return {
      source: 'DORIS',
      status: 'unavailable',
      message: 'Service temporarily unavailable',
      data: null
    };
  }
};

export const searchPropertyInDlr = async (formData: SearchFormData) => {
  try {
    const response = await apiClient.post('/api/search/dlr', formatSearchRequestData(formData));
    return response.data;
  } catch (error) {
    console.error('DLR API Error:', error);
    return {
      source: 'DLR',
      status: 'unavailable',
      message: 'Service temporarily unavailable',
      data: null
    };
  }
};

export const searchPropertyInCersai = async (formData: SearchFormData) => {
  try {
    const response = await apiClient.post('/api/search/cersai', formatSearchRequestData(formData));
    return response.data;
  } catch (error) {
    console.error('CERSAI API Error:', error);
    return {
      source: 'CERSAI',
      status: 'unavailable',
      message: 'Service temporarily unavailable',
      data: null
    };
  }
};

export const searchPropertyInMca = async (formData: SearchFormData) => {
  try {
    const response = await apiClient.post('/api/search/mca', formatSearchRequestData(formData));
    return response.data;
  } catch (error) {
    console.error('MCA21 API Error:', error);
    return {
      source: 'MCA21',
      status: 'unavailable',
      message: 'Service temporarily unavailable',
      data: null
    };
  }
};

// Function to search property in all portals or specific portal
export const searchProperty = async (formData: SearchFormData) => {
  try {
    // Determine which portals to search
    let searchPromises = [];
    
    if (formData.portal === 'auto' || formData.portal === 'doris') {
      searchPromises.push({
        portalId: 'doris',
        promise: searchPropertyInDoris(formData)
      });
    }
    
    if (formData.portal === 'auto' || formData.portal === 'dlr') {
      searchPromises.push({
        portalId: 'dlr',
        promise: searchPropertyInDlr(formData)
      });
    }
    
    if (formData.portal === 'auto' || formData.portal === 'cersai') {
      searchPromises.push({
        portalId: 'cersai',
        promise: searchPropertyInCersai(formData)
      });
    }
    
    if (formData.portal === 'auto' || formData.portal === 'mca21') {
      searchPromises.push({
        portalId: 'mca21',
        promise: searchPropertyInMca(formData)
      });
    }
    
    // Start all searches in parallel
    const results = await Promise.all(
      searchPromises.map(async ({ portalId, promise }) => {
        const response = await promise;
        return {
          portalId,
          portalName: getPortalName(portalId),
          status: response.status,
          data: response.data
        };
      })
    );
    
    return results;
    
  } catch (error) {
    console.error('Error searching property:', error);
    throw error;
  }
};

// Helper function to get portal name from ID
const getPortalName = (portalId: string): string => {
  const portalNames: Record<string, string> = {
    'doris': 'DORIS',
    'dlr': 'DLR',
    'cersai': 'CERSAI',
    'mca21': 'MCA21'
  };
  
  return portalNames[portalId] || portalId.toUpperCase();
};

// Export the API clients
export default {
  searchProperty,
  searchPropertyInDoris,
  searchPropertyInDlr,
  searchPropertyInCersai,
  searchPropertyInMca
};
