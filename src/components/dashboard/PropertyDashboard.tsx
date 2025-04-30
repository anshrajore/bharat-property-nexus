
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import PropertySearchForm, { SearchFormData } from '@/components/search/PropertySearchForm';
import SearchResults from '@/components/search/SearchResults';
import PropertyGalleryView from '@/components/property/PropertyGalleryView';
import PropertyAnalytics from '@/components/analytics/PropertyAnalytics';
import { searchProperty } from '@/services/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download, BarChart3, Grid3X3, List, Map } from 'lucide-react';
import { downloadAllResultsAsCsv } from '@/utils/shareResults';
import { AnimatePresence } from 'framer-motion';

interface PropertyDashboardProps {
  onMapView?: (coordinates: {lat: number; lng: number}, address: string | null) => void;
}

const PropertyDashboard: React.FC<PropertyDashboardProps> = ({ onMapView }) => {
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<string>('list');
  const [analyticsData, setAnalyticsData] = useState<any | null>(null);
  const [extractedPropertyId, setExtractedPropertyId] = useState<string | null>(null);
  
  const handleSearch = async (formData: SearchFormData) => {
    try {
      setIsSearching(true);
      setSearchTerm(formData.ownerName);
      
      const displayName = `${formData.ownerName} ${formData.propertyId ? `(${formData.propertyId})` : ''}`;
      const locationInfo = formData.district ? 
        `${formData.district}, ${formData.state}` : 
        (formData.state ? formData.state : '');

      toast({
        title: "Initiating search",
        description: `Searching for property details of ${displayName}${locationInfo ? ` in ${locationInfo}` : ''}`,
      });
      
      let portalsToSearch: string[];
      if (formData.portal === 'auto') {
        portalsToSearch = ['doris', 'dlr', 'cersai', 'mca21'];
        if (formData.propertyType === 'rural') {
          portalsToSearch = ['dlr', 'doris', 'cersai', 'mca21'];
        }
      } else {
        portalsToSearch = [formData.portal];
      }
      
      const initialResults = portalsToSearch.map(portalId => {
        const portalNames: Record<string, string> = {
          'doris': 'DORIS',
          'dlr': 'DLR',
          'cersai': 'CERSAI',
          'mca21': 'MCA21'
        };
        
        return {
          portalId,
          portalName: portalNames[portalId],
          status: 'loading' as const,
          data: null
        };
      });
      
      setSearchResults(initialResults);
      
      // Perform the actual search with enhanced search data
      const results = await searchProperty(formData);
      
      // Update with final results
      setSearchResults(results);
      
      // Generate analytics data based on search results
      generateAnalyticsData(results);
      
      // Show completion toast
      const foundCount = results.filter(r => r.status === 'found').length;
      if (foundCount > 0) {
        toast({
          title: "Search complete",
          description: `Found property records in ${foundCount} database${foundCount > 1 ? 's' : ''}`,
          variant: "default",
        });
        
        // Extract location data for map view
        const successfulResult = results.find(r => r.status === 'found' && r.data?.Location);
        if (successfulResult && successfulResult.data?.Location && onMapView) {
          onMapView(
            {
              lat: successfulResult.data.Location.latitude,
              lng: successfulResult.data.Location.longitude
            },
            successfulResult.data.propertyLocation || successfulResult.data.address
          );
        }
      } else {
        toast({
          title: "Search complete",
          description: "No property records found in any database",
          variant: "default",
        });
      }
      
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const generateAnalyticsData = (results: any[]) => {
    // Only generate if we have found results
    const foundResults = results.filter(r => r.status === 'found');
    if (foundResults.length === 0) return;
    
    // Extract encumbrances data
    const encumbrancesByType: Record<string, number> = {};
    const encumbrancesByStatus: Record<string, number> = {};
    
    foundResults.forEach(result => {
      if (result.data?.encumbrances) {
        result.data.encumbrances.forEach((encumbrance: any) => {
          // Count by type
          if (encumbrance.type) {
            encumbrancesByType[encumbrance.type] = (encumbrancesByType[encumbrance.type] || 0) + 1;
          }
          
          // Count by status
          if (encumbrance.status) {
            encumbrancesByStatus[encumbrance.status] = (encumbrancesByStatus[encumbrance.status] || 0) + 1;
          }
        });
      }
    });
    
    // Create data format for charts
    const analytics = {
      encumbrancesByType: Object.entries(encumbrancesByType).map(([name, value]) => ({ name, value })),
      encumbrancesByStatus: Object.entries(encumbrancesByStatus).map(([name, value]) => ({ name, value })),
      sourceDistribution: foundResults.reduce((acc: Record<string, number>, result) => {
        acc[result.portalName] = (acc[result.portalName] || 0) + 1;
        return acc;
      }, {}),
    };
    
    setAnalyticsData(analytics);
  };
  
  const handleDownloadResults = () => {
    if (searchResults.length === 0) {
      toast({
        title: "No data to export",
        description: "Please perform a search first",
        variant: "destructive",
      });
      return;
    }
    
    downloadAllResultsAsCsv(searchResults);
    toast({
      title: "Export successful",
      description: "Search results have been exported to CSV",
    });
  };
  
  const handleExtractedPropertyId = (id: string) => {
    setExtractedPropertyId(id);
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PropertySearchForm 
          onSearch={handleSearch} 
          isLoading={isSearching} 
          extractedPropertyId={extractedPropertyId}
        />
      </motion.div>
      
      {searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <Card className="border-gov-blue bg-white shadow-md">
            <CardContent className="p-0">
              <Tabs defaultValue={viewMode} onValueChange={setViewMode} className="w-full">
                <div className="flex flex-wrap items-center justify-between border-b p-4">
                  <TabsList className="bg-gray-100">
                    <TabsTrigger value="list" className="data-[state=active]:bg-gov-blue data-[state=active]:text-white">
                      <List className="h-4 w-4 mr-2" />
                      List View
                    </TabsTrigger>
                    <TabsTrigger value="gallery" className="data-[state=active]:bg-gov-blue data-[state=active]:text-white">
                      <Grid3X3 className="h-4 w-4 mr-2" />
                      Gallery View
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="data-[state=active]:bg-gov-blue data-[state=active]:text-white">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </TabsTrigger>
                  </TabsList>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownloadResults}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Export All
                  </Button>
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewMode}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="list" className="mt-0 p-4">
                      <SearchResults results={searchResults} searchTerm={searchTerm} />
                    </TabsContent>
                    
                    <TabsContent value="gallery" className="mt-0 p-4">
                      <PropertyGalleryView results={searchResults} />
                    </TabsContent>
                    
                    <TabsContent value="analytics" className="mt-0 p-4">
                      <PropertyAnalytics data={analyticsData} />
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default PropertyDashboard;
