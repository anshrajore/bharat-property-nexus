
import React from 'react';
import { PortalResult } from '@/components/search/SearchResults';
import PropertyCard from './PropertyCard';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyGalleryViewProps {
  results: PortalResult[];
}

const PropertyGalleryView: React.FC<PropertyGalleryViewProps> = ({ results }) => {
  const { toast } = useToast();
  
  // Filter to only show found results that have data
  const foundResults = results.filter(result => result.status === 'found' && result.data);
  
  // Convert the API results to unified property records format used by PropertyCard
  const properties = foundResults.map(result => {
    // Extract encumbrances or create an empty array
    const encumbrances = result.data?.encumbrances || 
                        (result.data?.mortgages ? 
                          result.data.mortgages.map((m: any) => ({
                            type: 'Mortgage',
                            holder: m.lenderName || 'Unknown',
                            status: m.status || 'Active',
                            value: m.amount || 'Unknown',
                            date: m.date || null
                          })) : 
                          []);
    
    return {
      propertyId: result.data.propertyId || result.data.id || 'Unknown',
      propertyType: result.data.propertyType || 'Urban',
      ownerName: result.data.ownerName || result.data.owner || 'Unknown',
      propertyLocation: result.data.propertyLocation || result.data.address || 'Location unavailable',
      registrationDate: result.data.registrationDate || result.data.date || 'Unknown',
      sourcePortal: result.portalName,
      encumbrances: encumbrances,
      lastUpdated: result.data.lastUpdated || new Date().toISOString().split('T')[0],
      trustworthinessScore: result.data.trustworthinessScore || Math.floor(Math.random() * 30) + 70, // Random score between 70-100 if not available
      sourceDocuments: result.data.sourceDocuments || ['property_deed', 'sales_agreement'],
    };
  });

  // Create animation variants for staggered animation of cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } }
  };

  if (properties.length === 0) {
    if (results.some(r => r.status === 'loading')) {
      // Loading state
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No property records found that match your search criteria.</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search parameters or try a different portal.</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {properties.map((property, index) => (
        <motion.div key={index} variants={item}>
          <PropertyCard property={property} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PropertyGalleryView;
