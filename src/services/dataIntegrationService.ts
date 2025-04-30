
import { SearchFormData } from '@/components/search/PropertySearchForm';
import { format } from 'date-fns';

// Define standard data structure for unified records
export interface UnifiedPropertyRecord {
  propertyId: string;
  ownerName: string;
  registrationNumber?: string;
  propertyType: 'urban' | 'rural';
  propertyLocation: string;
  coordinates?: { latitude: number; longitude: number };
  registrationDate?: string;
  marketValue?: string;
  encumbrances: Array<{
    type: string;
    holder: string;
    value?: string;
    date?: string;
    status: 'active' | 'discharged' | 'pending';
  }>;
  sourcePortal: string;
  lastUpdated: string;
  trustworthinessScore: number;
  sourceDocuments?: string[];
}

// Data normalization functions
const normalizeDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  try {
    if (typeof date === 'string') {
      // Try to parse Indian date format DD/MM/YYYY or convert ISO date
      const parts = date.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
      }
      return new Date(date).toISOString().split('T')[0];
    }
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Date normalization error:', error);
    return '';
  }
};

const normalizePropertyType = (type: string | undefined): 'urban' | 'rural' => {
  if (!type) return 'urban';
  
  const urbanKeywords = ['flat', 'apartment', 'urban', 'residential', 'commercial'];
  const ruralKeywords = ['land', 'agricultural', 'rural', 'farm'];
  
  type = type.toLowerCase();
  
  if (urbanKeywords.some(keyword => type.includes(keyword))) {
    return 'urban';
  }
  
  if (ruralKeywords.some(keyword => type.includes(keyword))) {
    return 'rural';
  }
  
  return 'urban'; // Default to urban if uncertain
};

const normalizeAddress = (address: any): string => {
  if (typeof address === 'string') return address;
  
  if (address && typeof address === 'object') {
    const parts = [];
    if (address.line) parts.push(address.line);
    if (address.district) parts.push(address.district);
    if (address.state) parts.push(address.state);
    if (address.pincode) parts.push(address.pincode);
    
    return parts.join(', ');
  }
  
  return '';
};

// Process each data source type into the unified format
export const normalizeDorisData = (data: any): UnifiedPropertyRecord => {
  return {
    propertyId: data['Property ID'] || '',
    ownerName: data['Owner Name'] || '',
    registrationNumber: data['Registration Number'] || '',
    propertyType: normalizePropertyType(data['Property Type']),
    propertyLocation: data['Address'] || '',
    coordinates: data.Location || undefined,
    registrationDate: normalizeDate(data['Registration Date']),
    marketValue: data['Market Value'] || '',
    encumbrances: [
      {
        type: 'Mortgage',
        holder: 'Not Available',
        status: 'active',
      }
    ],
    sourcePortal: 'DORIS',
    lastUpdated: normalizeDate(data['Registration Date']) || new Date().toISOString().split('T')[0],
    trustworthinessScore: 85,
    sourceDocuments: ['registration_deed', 'property_card']
  };
};

export const normalizeDlrData = (data: any): UnifiedPropertyRecord => {
  return {
    propertyId: data['Survey Number'] || '',
    ownerName: data['Owner'] || '',
    propertyType: normalizePropertyType(data['Land Type']),
    propertyLocation: data['Address'] || `${data['Village/Ward'] || ''}, ${data['District'] || ''}, ${data['State'] || ''}`,
    coordinates: data.Location || undefined,
    registrationDate: '',
    marketValue: '',
    encumbrances: [
      {
        type: 'Land Use Restriction',
        holder: 'Land Revenue Department',
        status: 'active',
      }
    ],
    sourcePortal: 'DLR',
    lastUpdated: normalizeDate(data['Last Updated']),
    trustworthinessScore: 80,
    sourceDocuments: ['land_record', 'revenue_receipt']
  };
};

export const normalizeCersaiData = (data: any): UnifiedPropertyRecord => {
  return {
    propertyId: data['Asset ID'] || '',
    ownerName: data['Borrower Name'] || '',
    propertyType: normalizePropertyType(data['Security Type']),
    propertyLocation: data['Address'] || `${data['District'] || ''}, ${data['State'] || ''}`,
    coordinates: data.Location || undefined,
    registrationDate: normalizeDate(data['Creation Date']),
    marketValue: '',
    encumbrances: [
      {
        type: 'Security Interest',
        holder: data['Secured Creditor'] || 'Unknown Bank',
        value: data['Charge Amount'] || '',
        status: data['Status']?.toLowerCase() === 'active' ? 'active' : 'discharged',
      }
    ],
    sourcePortal: 'CERSAI',
    lastUpdated: normalizeDate(data['Creation Date']),
    trustworthinessScore: 90,
    sourceDocuments: ['security_agreement', 'charge_document']
  };
};

export const normalizeMcaData = (data: any): UnifiedPropertyRecord => {
  return {
    propertyId: data['CIN'] || '',
    ownerName: data['Company Name'] || '',
    propertyType: 'urban',
    propertyLocation: data['Address'] || `${data['District'] || ''}, ${data['State'] || ''}`,
    coordinates: data.Location || undefined,
    registrationDate: normalizeDate(data['Date of Incorporation']),
    marketValue: `Authorized Capital: ${data['Authorized Capital'] || 'Unknown'}`,
    encumbrances: [
      {
        type: 'Corporate Charge',
        holder: 'Ministry of Corporate Affairs',
        value: data['Paid Up Capital'] || '',
        status: 'active',
      }
    ],
    sourcePortal: 'MCA21',
    lastUpdated: normalizeDate(data['Date of Incorporation']),
    trustworthinessScore: 75,
    sourceDocuments: ['incorporation_certificate', 'annual_return']
  };
};

// Main function to normalize all data
export const normalizePropertyData = (sourcePortal: string, data: any): UnifiedPropertyRecord | null => {
  try {
    switch (sourcePortal.toLowerCase()) {
      case 'doris':
        return normalizeDorisData(data);
      case 'dlr':
        return normalizeDlrData(data);
      case 'cersai':
        return normalizeCersaiData(data);
      case 'mca21':
        return normalizeMcaData(data);
      default:
        console.error(`Unknown portal type: ${sourcePortal}`);
        return null;
    }
  } catch (error) {
    console.error(`Error normalizing data from ${sourcePortal}:`, error);
    return null;
  }
};
