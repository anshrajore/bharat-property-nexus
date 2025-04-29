
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, IdCard, FileText, MapPin, Pin, Radio, Search, Clock, Calendar, Flag } from 'lucide-react';
import PortalSelector from './PortalSelector';
import PropertyTypeToggle from './PropertyTypeToggle';
import LocationSelector from './LocationSelector';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SearchFormData {
  ownerName: string;
  propertyId: string;
  registrationNumber: string;
  address: string;
  pinCode: string;
  propertyType: string;
  portal: string;
  state: string;
  district: string;
  includeHistorical: boolean;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

interface PropertySearchFormProps {
  onSearch: (data: SearchFormData) => void;
  isLoading?: boolean;
  extractedPropertyId?: string | null;
}

// Indian states array
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", 
  "Ladakh", "Lakshadweep", "Puducherry"
];

// Districts by state (subset of districts for popular states)
const DISTRICTS_BY_STATE: Record<string, string[]> = {
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "South Delhi", "South West Delhi", "West Delhi"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Latur", "Dhule"],
  "Karnataka": ["Bengaluru Urban", "Belgaum", "Mysuru", "Shivamogga", "Tumakuru", "Dakshina Kannada", "Davanagere", "Udupi", "Dharwad", "Hassan"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Vellore", "Erode", "Thoothukkudi"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly", "Aligarh", "Moradabad", "Saharanpur"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand", "Bharuch"],
  "West Bengal": ["Kolkata", "Howrah", "Asansol", "Durgapur", "Bardhaman", "Siliguri", "Malda", "Kharagpur", "Darjeeling", "Jalpaiguri"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Sikar", "Sri Ganganagar"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kakinada", "Kadapa", "Anantapur"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet"]
};

// Default districts for states not in our list
const DEFAULT_DISTRICTS = ["District 1", "District 2", "District 3", "District 4", "District 5"];

const PropertySearchForm: React.FC<PropertySearchFormProps> = ({
  onSearch,
  isLoading = false,
  extractedPropertyId = null,
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
    state: '',
    district: '',
    includeHistorical: false,
    dateRange: {
      from: undefined,
      to: undefined
    }
  });

  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  // Effect to update propertyId when extractedPropertyId changes
  useEffect(() => {
    if (extractedPropertyId) {
      setFormData(prev => ({ ...prev, propertyId: extractedPropertyId }));
    }
  }, [extractedPropertyId]);

  // Effect to update districts when state changes
  useEffect(() => {
    // Update districts when state changes
    if (formData.state) {
      setAvailableDistricts(DISTRICTS_BY_STATE[formData.state] || DEFAULT_DISTRICTS);
      // Reset district selection when state changes
      setFormData(prev => ({ ...prev, district: '' }));
    } else {
      setAvailableDistricts([]);
    }
  }, [formData.state]);

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

  const handleStateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, state: value }));
  };

  const handleDistrictChange = (value: string) => {
    setFormData((prev) => ({ ...prev, district: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, includeHistorical: checked }));
  };

  const handleDateRangeChange = (range: { from: Date | undefined, to: Date | undefined }) => {
    setFormData((prev) => ({ ...prev, dateRange: range }));
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
    
    // Fixed: Check if string value exists and is not empty
    const hasIdentification = identificationFields.some(field => {
      const value = formData[field as keyof SearchFormData];
      return typeof value === 'string' && value.trim() !== '';
    });
    
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
      // Fixed: Check if string value exists and is not empty
      const value = formData[field as keyof SearchFormData];
      if (typeof value !== 'string' || value.trim() === '') {
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

  const displayFormattedDate = (date: Date | undefined) => {
    return date ? format(date, 'PP') : '';
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
              <Label htmlFor="state" className="flex items-center gap-2">
                <Flag className="h-4 w-4" /> State/Union Territory
              </Label>
              <Select value={formData.state} onValueChange={handleStateChange}>
                <SelectTrigger id="state" className="w-full govt-input-focus">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-[300px]">
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> District
              </Label>
              <Select 
                value={formData.district} 
                onValueChange={handleDistrictChange}
                disabled={!formData.state}
              >
                <SelectTrigger id="district" className="w-full govt-input-focus">
                  <SelectValue placeholder={formData.state ? "Select district" : "Select state first"} />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-[300px]">
                  {availableDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          <div className="border-t border-gray-200 pt-4">
            <Button
              type="button"
              variant="link"
              className="text-gov-blue p-0 h-auto font-medium flex items-center"
              onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}
            >
              {isAdvancedSearch ? 'Hide' : 'Show'} Advanced Options
            </Button>
            
            {isAdvancedSearch && (
              <div className="mt-4 space-y-6 border-l-2 border-gov-blue pl-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeHistorical"
                      checked={formData.includeHistorical}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <label
                      htmlFor="includeHistorical"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Include historical records (may take longer)
                    </label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Registration Date Range
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {formData.dateRange.from ? (
                            formData.dateRange.to ? (
                              <>
                                {displayFormattedDate(formData.dateRange.from)} - {displayFormattedDate(formData.dateRange.to)}
                              </>
                            ) : (
                              displayFormattedDate(formData.dateRange.from)
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarUI
                          initialFocus
                          mode="range"
                          defaultMonth={formData.dateRange.from}
                          selected={{
                            from: formData.dateRange.from,
                            to: formData.dateRange.to
                          }}
                          onSelect={(range) => {
                            handleDateRangeChange({
                              from: range?.from,
                              to: range?.to
                            });
                          }}
                          numberOfMonths={2}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            )}
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
