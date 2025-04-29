
import { SearchFormData } from '@/components/search/PropertySearchForm';

// Mock API endpoints - in a real app, these would point to actual endpoints
const API_ENDPOINTS = {
  doris: '/api/search/doris',
  dlr: '/api/search/dlr',
  cersai: '/api/search/cersai',
  mca21: '/api/search/mca',
};

export interface SearchResult {
  portalId: string;
  portalName: string;
  status: 'loading' | 'found' | 'notFound' | 'unavailable';
  data: Record<string, any> | null;
}

// Portal metadata
const PORTALS = {
  doris: {
    id: 'doris',
    name: 'DORIS',
    description: 'Delhi Online Registration Information System',
  },
  dlr: {
    id: 'dlr',
    name: 'DLR',
    description: 'Department of Land Records',
  },
  cersai: {
    id: 'cersai',
    name: 'CERSAI',
    description: 'Central Registry of Securitisation Asset Reconstruction and Security Interest',
  },
  mca21: {
    id: 'mca21',
    name: 'MCA21',
    description: 'Ministry of Corporate Affairs Portal',
  }
};

// Mock function to simulate API responses
const mockSearchApi = (
  portalId: string, 
  formData: SearchFormData
): Promise<SearchResult> => {
  return new Promise((resolve) => {
    // Simulate network delay
    const delay = 1500 + Math.random() * 2000; // 1.5 to 3.5 seconds
    
    setTimeout(() => {
      // For demo purposes: simulate different responses
      const randomOutcome = Math.random();
      
      // Example property data for "found" status
      const exampleData = {
        doris: {
          'Property Type': formData.propertyType === 'urban' ? 'Residential Flat' : 'Agricultural Land',
          'Owner Name': formData.ownerName,
          'Property ID': formData.propertyId || 'DLRS' + Math.floor(Math.random() * 1000000),
          'Registration Date': '15/03/2022',
          'Market Value': '₹ 82,45,000',
          'Property Area': formData.propertyType === 'urban' ? '1250 sq.ft' : '2.5 acres',
          'Registration Office': 'Delhi South',
        },
        dlr: {
          'Survey Number': formData.propertyId || 'KH-' + Math.floor(Math.random() * 100) + '/' + Math.floor(Math.random() * 100),
          'Owner': formData.ownerName,
          'Land Type': formData.propertyType === 'urban' ? 'Urban Development Authority' : 'Agricultural',
          'Area': formData.propertyType === 'urban' ? '1250 sq.ft' : '2.5 acres',
          'Village/Ward': 'Sample Village',
          'District': 'Sample District',
          'Last Updated': '22/05/2023',
          'Land Use': formData.propertyType === 'urban' ? 'Residential' : 'Farming',
        },
        cersai: {
          'Asset ID': 'CERSAI-' + Math.floor(Math.random() * 10000000),
          'Borrower Name': formData.ownerName,
          'Security Type': 'Immovable Property',
          'Creation Date': '08/11/2021',
          'Secured Creditor': 'Sample Bank Ltd.',
          'Property Description': formData.address,
          'Charge Amount': '₹ 56,00,000',
          'Status': 'Active'
        },
        mca21: {
          'Company Name': formData.ownerName + ' Enterprises Ltd.',
          'CIN': 'U' + Math.floor(Math.random() * 10000000) + 'DL2020PTC' + Math.floor(Math.random() * 100000),
          'Company Status': 'Active',
          'Address': formData.address,
          'Date of Incorporation': '12/08/2020',
          'Authorized Capital': '₹ 10,00,000',
          'Paid Up Capital': '₹ 5,00,000',
          'Company Category': 'Private'
        }
      };

      // Return different statuses based on randomOutcome
      if (randomOutcome < 0.7) {
        // 70% chance of finding records
        resolve({
          portalId,
          portalName: PORTALS[portalId as keyof typeof PORTALS].name,
          status: 'found',
          data: exampleData[portalId as keyof typeof exampleData]
        });
      } else if (randomOutcome < 0.9) {
        // 20% chance of not finding records
        resolve({
          portalId,
          portalName: PORTALS[portalId as keyof typeof PORTALS].name,
          status: 'notFound',
          data: null
        });
      } else {
        // 10% chance of service being unavailable
        resolve({
          portalId,
          portalName: PORTALS[portalId as keyof typeof PORTALS].name,
          status: 'unavailable',
          data: null
        });
      }
    }, delay);
  });
};

export const searchProperty = async (formData: SearchFormData): Promise<SearchResult[]> => {
  try {
    // Determine which portals to search
    let portalsToSearch: string[] = [];
    
    if (formData.portal === 'auto') {
      // Logic to determine appropriate portals based on inputs
      portalsToSearch = ['doris', 'dlr', 'cersai', 'mca21'];
      
      // Urban properties are more likely in DORIS, rural in DLR
      if (formData.propertyType === 'rural') {
        // Reorder to prioritize DLR for rural properties
        portalsToSearch = ['dlr', 'doris', 'cersai', 'mca21'];
      }
    } else {
      // User selected a specific portal
      portalsToSearch = [formData.portal];
    }
    
    // Initialize results with loading state
    const initialResults = portalsToSearch.map(portalId => ({
      portalId,
      portalName: PORTALS[portalId as keyof typeof PORTALS].name,
      status: 'loading' as const,
      data: null
    }));
    
    // Start all searches in parallel
    const searchPromises = portalsToSearch.map(portalId => 
      mockSearchApi(portalId, formData)
    );
    
    // Return results as they come in
    return Promise.all(searchPromises);
    
  } catch (error) {
    console.error('Error searching property:', error);
    throw error;
  }
};
