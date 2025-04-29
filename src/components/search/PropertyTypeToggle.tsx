
import React from 'react';
import { cn } from '@/lib/utils';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';

interface PropertyTypeToggleProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const PropertyTypeToggle: React.FC<PropertyTypeToggleProps> = ({
  value,
  onChange,
  className,
}) => {
  // Ensure there's always a value
  const handleValueChange = (newValue: string) => {
    if (newValue) onChange(newValue);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium text-gray-700">Property Type</label>
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={handleValueChange}
        className="grid grid-cols-2 w-full border rounded-md overflow-hidden"
      >
        <ToggleGroupItem 
          value="urban"
          aria-label="Urban Property"
          className={cn(
            "data-[state=on]:bg-gov-blue data-[state=on]:text-white py-2.5 text-sm font-medium border-r",
            value === 'urban' ? 'bg-gov-blue text-white' : 'bg-white'
          )}
        >
          Urban
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="rural"
          aria-label="Rural Property"
          className={cn(
            "data-[state=on]:bg-gov-blue data-[state=on]:text-white py-2.5 text-sm font-medium",
            value === 'rural' ? 'bg-gov-blue text-white' : 'bg-white'
          )}
        >
          Rural
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default PropertyTypeToggle;
