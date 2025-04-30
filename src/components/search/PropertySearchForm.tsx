
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, IdCard, FileText, MapPin, Pin, Radio, Search } from 'lucide-react';
import PortalSelector from './PortalSelector';
import PropertyTypeToggle from './PropertyTypeToggle';

export interface SearchFormData {
  ownerName: string;
  propertyId: string;
  registrationNumber: string;
  address: string;
  pinCode: string;
  propertyType: string;
  portal: string;
}

interface PropertySearchFormProps {
  onSearch: (data: SearchFormData) => void;
  isLoading?: boolean;
}

const PropertySearchForm: React.FC<PropertySearchFormProps> = ({
  onSearch,
  isLoading = false,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SearchFormData>({
    ownerName: '',
    propertyId: '',
    registrationNumber: '',
    address: '',
    pinCode: '',
    propertyType: 'urban',
    portal: 'auto',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePropertyTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, propertyType: value }));
  };

  const handlePortalChange = (value: string) => {
    setFormData((prev) => ({ ...prev, portal: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = [
      { field: 'ownerName', label: 'Owner\'s Name' },
      { field: 'pinCode', label: 'PIN Code' }
    ];
    
    // Check if at least one identification field is filled
    const identificationFields = [
      'propertyId',
      'registrationNumber',
      'address'
    ];
    
    const hasIdentification = identificationFields.some(field => formData[field as keyof SearchFormData]?.trim());
    
    if (!hasIdentification) {
      toast({
        title: "Missing Information",
        description: "Please provide at least one of: Property ID, Registration Number, or Address",
        variant: "destructive",
      });
      return;
    }
    
    // Check required fields
    for (const { field, label } of requiredFields) {
      if (!formData[field as keyof SearchFormData]?.trim()) {
        toast({
          title: "Required Field Missing",
          description: `${label} is required`,
          variant: "destructive",
        });
        return;
      }
    }
    
    onSearch(formData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-md">
      <CardHeader className="bg-gov-blue text-white rounded-t-lg">
        <CardTitle className="text-xl">Unified Property Search</CardTitle>
        <CardDescription className="text-gray-200">
          Search across all government property databases with a single form
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ownerName" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Owner's Full Name*
              </Label>
              <Input
                id="ownerName"
                name="ownerName"
                placeholder="Enter owner's full name as per records"
                value={formData.ownerName}
                onChange={handleInputChange}
                className="govt-input-focus"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyId" className="flex items-center gap-2">
                <IdCard className="h-4 w-4" /> Property ID/Survey Number
              </Label>
              <Input
                id="propertyId"
                name="propertyId"
                placeholder={formData.propertyType === 'urban' ? "Enter Property ID" : "Enter Survey Number"}
                value={formData.propertyId}
                onChange={handleInputChange}
                className="govt-input-focus"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationNumber" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Registration Number
              </Label>
              <Input
                id="registrationNumber"
                name="registrationNumber"
                placeholder="Enter registration or document number"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                className="govt-input-focus"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Address
              </Label>
              <Input
                id="address"
                name="address"
                placeholder="Enter full property address"
                value={formData.address}
                onChange={handleInputChange}
                className="govt-input-focus"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pinCode" className="flex items-center gap-2">
                <Pin className="h-4 w-4" /> PIN Code*
              </Label>
              <Input
                id="pinCode"
                name="pinCode"
                placeholder="6-digit PIN code"
                value={formData.pinCode}
                onChange={handleInputChange}
                className="govt-input-focus"
                maxLength={6}
                pattern="[0-9]{6}"
                title="Please enter a valid 6-digit PIN code"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PropertyTypeToggle
                value={formData.propertyType}
                onChange={handlePropertyTypeChange}
              />

              <PortalSelector 
                value={formData.portal} 
                onChange={handlePortalChange} 
              />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-gov-orange hover:bg-gov-orange-dark text-white font-semibold py-3 flex items-center justify-center gap-2 shadow-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Search Property
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-3 text-xs text-gray-500 border-t">
        *Required fields. At least one identification field (Property ID, Registration Number, or Address) is also required.
      </CardFooter>
    </Card>
  );
};

export default PropertySearchForm;
