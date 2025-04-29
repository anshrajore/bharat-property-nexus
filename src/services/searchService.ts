
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
          'Registration Date': formData.dateRange.from ? format(formData.dateRange.from) : '15/03/2022',
          'Market Value': '₹ 82,45,000',
          'Property Area': formData.propertyType === 'urban' ? '1250 sq.ft' : '2.5 acres',
          'Registration Office': 'Delhi South',
          'State': formData.state || 'Delhi',
          'District': formData.district || 'South Delhi',
          'Address': formData.address || 'Sample Address',
          'Location': {
            latitude: 28.6139 + (Math.random() - 0.5) / 10,
            longitude: 77.2090 + (Math.random() - 0.5) / 10
          }
        },
        dlr: {
          'Survey Number': formData.propertyId || 'KH-' + Math.floor(Math.random() * 100) + '/' + Math.floor(Math.random() * 100),
          'Owner': formData.ownerName,
          'Land Type': formData.propertyType === 'urban' ? 'Urban Development Authority' : 'Agricultural',
          'Area': formData.propertyType === 'urban' ? '1250 sq.ft' : '2.5 acres',
          'Village/Ward': formData.district || 'Sample Village',
          'District': formData.district || 'Sample District',
          'State': formData.state || 'Maharashtra',
          'Last Updated': formData.dateRange.to ? format(formData.dateRange.to) : '22/05/2023',
          'Land Use': formData.propertyType === 'urban' ? 'Residential' : 'Farming',
          'Address': formData.address || 'Sample Rural Address',
          'Location': {
            latitude: 19.0760 + (Math.random() - 0.5) / 10,
            longitude: 72.8777 + (Math.random() - 0.5) / 10
          }
        },
        cersai: {
          'Asset ID': 'CERSAI-' + Math.floor(Math.random() * 10000000),
          'Borrower Name': formData.ownerName,
          'Security Type': 'Immovable Property',
          'Creation Date': formData.dateRange.from ? format(formData.dateRange.from) : '08/11/2021',
          'Secured Creditor': 'Sample Bank Ltd.',
          'Property Description': formData.address || 'Sample Property Description',
          'Charge Amount': '₹ 56,00,000',
          'Status': 'Active',
          'State': formData.state || 'Karnataka',
          'District': formData.district || 'Bengaluru Urban',
          'Address': formData.address || 'Sample CERSAI Address',
          'Location': {
            latitude: 12.9716 + (Math.random() - 0.5) / 10,
            longitude: 77.5946 + (Math.random() - 0.5) / 10
          }
        },
        mca21: {
          'Company Name': formData.ownerName + ' Enterprises Ltd.',
          'CIN': 'U' + Math.floor(Math.random() * 10000000) + 'DL2020PTC' + Math.floor(Math.random() * 100000),
          'Company Status': 'Active',
          'Address': formData.address || 'Corporate Address',
          'State': formData.state || 'Gujarat',
          'District': formData.district || 'Ahmedabad',
          'Date of Incorporation': formData.dateRange.from ? format(formData.dateRange.from) : '12/08/2020',
          'Authorized Capital': '₹ 10,00,000',
          'Paid Up Capital': '₹ 5,00,000',
          'Company Category': 'Private',
          'Location': {
            latitude: 23.0225 + (Math.random() - 0.5) / 10,
            longitude: 72.5714 + (Math.random() - 0.5) / 10
          }
        }
      };

      // Location data adjustment based on state/district if provided
      if (formData.state) {
        const stateCoordinates: Record<string, {lat: number, lng: number}> = {
          "Delhi": { lat: 28.6139, lng: 77.2090 },
          "Maharashtra": { lat: 19.0760, lng: 72.8777 },
          "Karnataka": { lat: 12.9716, lng: 77.5946 },
          "Tamil Nadu": { lat: 13.0827, lng: 80.2707 },
          "Uttar Pradesh": { lat: 26.8467, lng: 80.9462 },
          "Gujarat": { lat: 23.0225, lng: 72.5714 },
          "West Bengal": { lat: 22.5726, lng: 88.3639 },
          "Rajasthan": { lat: 26.9124, lng: 75.7873 },
          "Andhra Pradesh": { lat: 16.5062, lng: 80.6480 },
          "Telangana": { lat: 17.3850, lng: 78.4867 },
        };
        
        if (stateCoordinates[formData.state]) {
          const baseCoords = stateCoordinates[formData.state];
          
          Object.values(exampleData).forEach(data => {
            if (data.Location) {
              data.Location.latitude = baseCoords.lat + (Math.random() - 0.5) / 50;
              data.Location.longitude = baseCoords.lng + (Math.random() - 0.5) / 50;
            }
          });
        }
      }

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

// Helper function to format dates consistently
function format(date: Date): string {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

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
      
      // If state is provided, we can make more intelligent routing decisions
      if (formData.state) {
        // Just an example of routing logic - could be expanded based on real systems
        if (formData.state === 'Delhi') {
          portalsToSearch = ['doris', 'mca21', 'cersai', 'dlr']; // DORIS first for Delhi
        } else if (formData.state === 'Maharashtra' || formData.state === 'Gujarat') {
          if (formData.propertyType === 'urban') {
            portalsToSearch = ['doris', 'mca21', 'cersai', 'dlr'];
          } else {
            portalsToSearch = ['dlr', 'cersai', 'doris', 'mca21'];
          }
        }
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
