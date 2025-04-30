
import { UnifiedPropertyRecord } from '@/types/property';

// Function to normalize dates to a standard format
export const normalizeDate = (dateStr: string): string => {
  // Support different date formats (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
  let date;
  
  // Try DD/MM/YYYY format
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts[0].length === 2 && parts.length === 3) {
      // DD/MM/YYYY format
      date = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
    } else {
      // MM/DD/YYYY format
      date = new Date(dateStr);
    }
  }
  // Try YYYY-MM-DD format
  else if (dateStr.includes('-')) {
    date = new Date(dateStr);
  }
  // Try other formats if needed
  else {
    date = new Date(dateStr);
  }
  
  // Return in standard DD/MM/YYYY format
  if (isNaN(date.getTime())) {
    return dateStr; // Return original if parsing failed
  }
  
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Function to normalize monetary values
export const normalizeMonetaryValue = (value: string): string => {
  // Remove non-numeric characters except decimal point
  const numericValue = value.replace(/[^\d.]/g, '');
  
  // Parse the numeric value
  const amount = parseFloat(numericValue);
  
  // Format as Indian currency
  if (isNaN(amount)) {
    return value; // Return original if parsing failed
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Function to transform portal-specific data to unified format
export const transformPortalData = (portalId: string, rawData: any): UnifiedPropertyRecord => {
  let unifiedData: Partial<UnifiedPropertyRecord> = {
    dataSource: portalId,
    portalOrigin: getPortalName(portalId)
  };
  
  switch (portalId) {
    case 'doris': 
      unifiedData = {
        ...unifiedData,
        propertyId: rawData['Property ID'] || '',
        ownerName: rawData['Owner Name'] || '',
        registrationDate: rawData['Registration Date'] ? normalizeDate(rawData['Registration Date']) : undefined,
        marketValue: rawData['Market Value'] ? normalizeMonetaryValue(rawData['Market Value']) : undefined,
        propertyArea: rawData['Property Area'] || '',
        registrationOffice: rawData['Registration Office'] || '',
        propertyType: 'urban',
        // Map other fields as needed
      };
      break;
      
    case 'dlr':
      unifiedData = {
        ...unifiedData,
        propertyId: rawData['Survey Number'] || '',
        ownerName: rawData['Owner'] || '',
        propertyArea: rawData['Area'] || '',
        landType: rawData['Land Type'] || '',
        lastUpdated: rawData['Last Updated'] ? normalizeDate(rawData['Last Updated']) : undefined,
        landUse: rawData['Land Use'] || '',
        propertyType: 'rural',
        // Map other fields as needed
      };
      break;
      
    case 'cersai':
      unifiedData = {
        ...unifiedData,
        ownerName: rawData['Borrower Name'] || '',
        registrationNumber: rawData['Asset ID'] || '',
        address: rawData['Property Description'] || '',
        registrationDate: rawData['Creation Date'] ? normalizeDate(rawData['Creation Date']) : undefined,
        securedCreditor: rawData['Secured Creditor'] || '',
        chargeAmount: rawData['Charge Amount'] ? normalizeMonetaryValue(rawData['Charge Amount']) : undefined,
        encumbranceStatus: rawData['Status']?.toLowerCase() === 'active' ? 'active' : 'discharged',
        // Map other fields as needed
      };
      break;
      
    case 'mca21':
      unifiedData = {
        ...unifiedData,
        ownerName: rawData['Company Name'] || '',
        registrationNumber: rawData['CIN'] || '',
        address: rawData['Address'] || '',
        registrationDate: rawData['Date of Incorporation'] ? normalizeDate(rawData['Date of Incorporation']) : undefined,
        // Map other fields as needed
      };
      break;
      
    default:
      // Handle unknown portal
      console.warn(`Unknown portal ID: ${portalId}`);
  }
  
  // Ensure all required fields are present
  return unifiedData as UnifiedPropertyRecord;
};

// Helper function to get portal name
const getPortalName = (portalId: string): string => {
  const portalNames: Record<string, string> = {
    'doris': 'Delhi Online Registration Information System',
    'dlr': 'Department of Land Records',
    'cersai': 'Central Registry of Securitisation Asset Reconstruction and Security Interest',
    'mca21': 'Ministry of Corporate Affairs Portal'
  };
  
  return portalNames[portalId] || portalId;
};
