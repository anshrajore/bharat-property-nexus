
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface Portal {
  id: string;
  name: string;
  description: string;
  agency: string;
}

interface PortalSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const PORTALS: Portal[] = [
  {
    id: 'auto',
    name: 'Auto Detect',
    description: 'System will detect the appropriate portal based on the input.',
    agency: 'All Agencies',
  },
  {
    id: 'doris',
    name: 'DORIS',
    description: 'Delhi Online Registration Information System',
    agency: 'Delhi Government',
  },
  {
    id: 'dlr',
    name: 'DLR',
    description: 'Department of Land Records',
    agency: 'State Revenue Departments',
  },
  {
    id: 'cersai',
    name: 'CERSAI',
    description: 'Central Registry of Securitisation Asset Reconstruction and Security Interest',
    agency: 'Ministry of Finance',
  },
  {
    id: 'mca21',
    name: 'MCA21',
    description: 'Ministry of Corporate Affairs Portal',
    agency: 'Ministry of Corporate Affairs',
  },
];

const PortalSelector: React.FC<PortalSelectorProps> = ({
  value,
  onChange,
  className,
}) => {
  const selectedPortal = PORTALS.find(portal => portal.id === value) || PORTALS[0];

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium text-gray-700">Select Portal</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full border-gray-300 bg-white rounded-md">
          <SelectValue placeholder="Select a portal">
            <span className="block truncate">{selectedPortal.name}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Government Portals</SelectLabel>
            {PORTALS.map((portal) => (
              <SelectItem 
                key={portal.id} 
                value={portal.id}
                className="cursor-pointer py-2.5 pl-2.5 flex items-start hover:bg-gray-100"
              >
                <div className="flex flex-col">
                  <span className="font-semibold">{portal.name}</span>
                  <span className="text-xs text-gray-500">{portal.description}</span>
                  <span className="text-xs italic text-gray-500">{portal.agency}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PortalSelector;
