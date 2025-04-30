
import React from 'react';
import { MapPinned } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StateDistrictSelectorProps {
  state: string;
  district: string;
  onChange: (field: string, value: string) => void;
}

// List of Indian states
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

// Map of districts by state (showing a few for demo purposes)
const DISTRICTS_BY_STATE: Record<string, string[]> = {
  "Delhi": [
    "Central Delhi", "East Delhi", "New Delhi", "North Delhi", 
    "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", 
    "South East Delhi", "South West Delhi", "West Delhi"
  ],
  "Maharashtra": [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara",
    "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli",
    "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban",
    "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", 
    "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", 
    "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
  ],
  // Add more states and their districts as needed
};

const StateDistrictSelector: React.FC<StateDistrictSelectorProps> = ({
  state,
  district,
  onChange
}) => {
  const availableDistricts = state ? (DISTRICTS_BY_STATE[state] || []) : [];

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-2">
        <Label htmlFor="state" className="flex items-center gap-2">
          <MapPinned className="h-4 w-4" /> State
        </Label>
        <Select
          value={state}
          onValueChange={(value) => onChange('state', value)}
        >
          <SelectTrigger className="govt-input-focus">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            {INDIAN_STATES.map((stateName) => (
              <SelectItem key={stateName} value={stateName}>
                {stateName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="district" className="flex items-center gap-2">
          <MapPinned className="h-4 w-4" /> District
        </Label>
        <Select
          value={district}
          onValueChange={(value) => onChange('district', value)}
          disabled={!state || availableDistricts.length === 0}
        >
          <SelectTrigger className="govt-input-focus">
            <SelectValue placeholder={state ? "Select district" : "First select a state"} />
          </SelectTrigger>
          <SelectContent>
            {availableDistricts.map((districtName) => (
              <SelectItem key={districtName} value={districtName}>
                {districtName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StateDistrictSelector;
