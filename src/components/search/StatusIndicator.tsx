
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X, AlertTriangle, Loader } from 'lucide-react';

export type StatusType = 'loading' | 'found' | 'notFound' | 'unavailable';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  className,
}) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'loading':
        return {
          icon: Loader,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-500',
          label: label || 'Loading...',
          animation: 'animate-spin',
        };
      case 'found':
        return {
          icon: Check,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500',
          label: label || 'Found',
          animation: '',
        };
      case 'notFound':
        return {
          icon: X,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          iconColor: 'text-red-500',
          label: label || 'Not Found',
          animation: '',
        };
      case 'unavailable':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-500',
          label: label || 'Unavailable',
          animation: '',
        };
      default:
        return {
          icon: AlertTriangle,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-500',
          label: 'Unknown Status',
          animation: '',
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-md border',
      config.bgColor,
      config.textColor,
      config.borderColor,
      className
    )}>
      <IconComponent 
        className={cn('h-4 w-4', config.iconColor, config.animation)} 
      />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
};

export default StatusIndicator;
