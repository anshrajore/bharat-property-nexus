
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Flag, Navigation } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LocationSelectorProps {
  selectedState: string;
  onStateChange: (value: string) => void;
  selectedDistrict: string;
  onDistrictChange: (value: string) => void;
}

// Indian states and union territories
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

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedState,
  onStateChange,
  selectedDistrict,
  onDistrictChange
}) => {
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  useEffect(() => {
    // Update districts when state changes
    if (selectedState) {
      setAvailableDistricts(DISTRICTS_BY_STATE[selectedState] || DEFAULT_DISTRICTS);
      // Reset district selection when state changes
      onDistrictChange('');
    } else {
      setAvailableDistricts([]);
    }
  }, [selectedState, onDistrictChange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="state" className="flex items-center gap-2">
          <Flag className="h-4 w-4" /> State/Union Territory
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Select value={selectedState} onValueChange={onStateChange}>
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
            </TooltipTrigger>
            <TooltipContent>
              <p>Select state for more accurate results</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label htmlFor="district" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" /> District
        </Label>
        <Select 
          value={selectedDistrict} 
          onValueChange={onDistrictChange}
          disabled={!selectedState}
        >
          <SelectTrigger id="district" className="w-full govt-input-focus">
            <SelectValue placeholder="Select district" />
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
    </div>
  );
};

export default LocationSelector;
