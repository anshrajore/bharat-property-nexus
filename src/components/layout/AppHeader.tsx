
import React from 'react';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full bg-gov-blue text-white py-3 px-4 flex items-center justify-between shadow-md", className)}>
      <div className="flex items-center">
        <img 
          src="/ashoka.svg" 
          alt="Emblem of India" 
          className="h-12 mr-4"
          onError={(e) => {
            // Fallback if the SVG isn't available
            e.currentTarget.src = "https://www.india.gov.in/sites/upload_files/npi/files/emblem-dark.png";
          }}
        />
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Bharat Property Nexus</h1>
          <p className="text-xs md:text-sm text-gray-200">Ministry of Housing & Urban Affairs</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <a href="#help" className="hover:underline text-sm">Help</a>
        <a href="#about" className="hover:underline text-sm">About</a>
        <button className="bg-white text-gov-blue px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
          Login
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
