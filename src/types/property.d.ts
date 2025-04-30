
export interface UnifiedPropertyRecord {
  // Core property information
  propertyId: string;
  ownerName: string;
  address?: string;
  state?: string;
  district?: string;
  pinCode?: string;
  propertyType?: "urban" | "rural";
  registrationNumber?: string;
  registrationDate?: string;
  marketValue?: string;
  propertyArea?: string;
  registrationOffice?: string;
  encumbranceStatus?: "active" | "discharged" | "pending";
  
  // Additional normalized fields that might come from various sources
  landType?: string;
  lastUpdated?: string;
  landUse?: string;
  securedCreditor?: string;
  chargeAmount?: string;
  
  // Metadata about the record
  dataSource: string;
  portalOrigin: string;
}

export type PropertySearchFilters = {
  state?: string;
  district?: string;
  propertyType?: "urban" | "rural";
  encumbranceStatus?: "active" | "discharged" | "pending";
};
