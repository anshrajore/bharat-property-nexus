
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import AppHeader from '@/components/layout/AppHeader';
import PropertySearchForm, { SearchFormData } from '@/components/search/PropertySearchForm';
import SearchResults from '@/components/search/SearchResults';
import AboutSystem from '@/components/about/AboutSystem';
import { searchProperty } from '@/services/searchService';
import DocumentScanner from '@/components/ocr/DocumentScanner';
import PropertyMap from '@/components/maps/PropertyMap';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, MapPin } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPropertyCoordinates, setSelectedPropertyCoordinates] = useState<{lat: number; lng: number} | null>(null);
  const [selectedPropertyAddress, setSelectedPropertyAddress] = useState<string | null>(null);
  const [isOcrDialogOpen, setIsOcrDialogOpen] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [extractedPropertyId, setExtractedPropertyId] = useState<string | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (formData: SearchFormData) => {
    try {
      setIsSearching(true);
      setSearchTerm(formData.ownerName);
      
      const displayName = `${formData.ownerName} ${formData.propertyId ? `(${formData.propertyId})` : ''}`;

      // Show a loading toast
      toast({
        title: "Initiating search",
        description: `Searching for property details of ${displayName}`,
      });
      
      // Initialize with loading state for better UX
      let portalsToSearch: string[];
      if (formData.portal === 'auto') {
        portalsToSearch = ['doris', 'dlr', 'cersai', 'mca21'];
        if (formData.propertyType === 'rural') {
          // Reorder for rural properties
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
      
      // Update with initial loading state
      setSearchResults(initialResults);
      
      // Scroll to results if they exist
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

      // Perform the actual search
      const results = await searchProperty(formData);
      
      // Update with final results
      setSearchResults(results);
      
      // Extract location data from the first successful result for map view
      const successfulResult = results.find(r => r.status === 'found' && r.data?.location);
      if (successfulResult && successfulResult.data?.location) {
        setSelectedPropertyCoordinates({
          lat: successfulResult.data.location.latitude,
          lng: successfulResult.data.location.longitude
        });
        setSelectedPropertyAddress(successfulResult.data.address);
      }
      
      // Show completion toast
      const foundCount = results.filter(r => r.status === 'found').length;
      if (foundCount > 0) {
        toast({
          title: "Search complete",
          description: `Found property records in ${foundCount} database${foundCount > 1 ? 's' : ''}`,
          variant: "default", // Changed from "success" to "default"
        });
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

  const handleExtractedText = (text: string) => {
    setExtractedPropertyId(text);
    setIsOcrDialogOpen(false);
    
    toast({
      title: "Property ID Extracted",
      description: `Successfully extracted: ${text}`,
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AppHeader />
      
      <main className="flex-grow py-8 px-4 container max-w-7xl">
        <div className="space-y-12">
          {/* Hero section */}
          <section className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gov-blue mb-4">Bharat Property Nexus</h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              A unified search interface for all government property databases, designed to simplify property verification across India.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-gov-blue hover:bg-gov-blue/90">
                <Link to="/about">Learn More</Link>
              </Button>
              <Button variant="outline" onClick={() => setIsOcrDialogOpen(true)}>
                <FileText className="mr-2 h-4 w-4" />
                Scan Document
              </Button>
            </div>
          </section>
          
          {/* Search Form */}
          <section className="mb-8">
            <PropertySearchForm 
              onSearch={handleSearch} 
              isLoading={isSearching} 
              extractedPropertyId={extractedPropertyId}
            />
          </section>
          
          {/* Search Results */}
          <section ref={resultsRef}>
            {searchResults.length > 0 && (
              <>
                <SearchResults results={searchResults} searchTerm={searchTerm} />
                
                {selectedPropertyCoordinates && (
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Property Location</h2>
                      <Button variant="outline" onClick={() => setIsMapDialogOpen(true)}>
                        <MapPin className="mr-2 h-4 w-4" />
                        View Larger Map
                      </Button>
                    </div>
                    <div className="h-[300px]">
                      <PropertyMap 
                        latitude={selectedPropertyCoordinates.lat} 
                        longitude={selectedPropertyCoordinates.lng}
                        address={selectedPropertyAddress || undefined}
                        ownerName={searchTerm}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
          
          {/* About Section */}
          <section id="about" className="pt-8 mt-16 border-t">
            <h2 className="text-2xl font-bold text-center mb-6">About the System</h2>
            <AboutSystem />
          </section>
        </div>
      </main>
      
      {/* OCR Document Scanner Dialog */}
      <Dialog open={isOcrDialogOpen} onOpenChange={setIsOcrDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Document Scanner</DialogTitle>
          </DialogHeader>
          <DocumentScanner onExtractedText={handleExtractedText} />
        </DialogContent>
      </Dialog>
      
      {/* Map Dialog */}
      <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
        <DialogContent className="sm:max-w-[800px] sm:h-[600px]">
          <DialogHeader>
            <DialogTitle>Property Location</DialogTitle>
          </DialogHeader>
          {selectedPropertyCoordinates && (
            <div className="h-[500px]">
              <PropertyMap 
                latitude={selectedPropertyCoordinates.lat} 
                longitude={selectedPropertyCoordinates.lng}
                address={selectedPropertyAddress || undefined}
                ownerName={searchTerm}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Footer */}
      <footer className="bg-gov-blue text-white py-6 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Bharat Property Nexus</h3>
              <p className="text-sm text-gray-300">
                A unified property information system for transparent and efficient property verification across India.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-gray-300 hover:text-white">Home</Link></li>
                <li><Link to="/about" className="text-sm text-gray-300 hover:text-white">About</Link></li>
                <li><Link to="/help" className="text-sm text-gray-300 hover:text-white">Help</Link></li>
                <li><Link to="/auth" className="text-sm text-gray-300 hover:text-white">Login/Register</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Contact</h3>
              <address className="not-italic text-sm text-gray-300">
                Ministry of Housing & Urban Affairs<br />
                Nirman Bhawan, Maulana Azad Road<br />
                New Delhi - 110011<br />
                <a href="mailto:support@bharatpropertynexus.gov.in" className="hover:text-white">
                  support@bharatpropertynexus.gov.in
                </a>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-xs text-gray-400">
            <p>&copy; {new Date().getFullYear()} Bharat Property Nexus. All rights reserved.</p>
            <p className="mt-1">This is a government portal developed for unified property information retrieval.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
