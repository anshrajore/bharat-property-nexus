
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import AppHeader from '@/components/layout/AppHeader';
import PropertySearchForm, { SearchFormData } from '@/components/search/PropertySearchForm';
import SearchResults from '@/components/search/SearchResults';
import AboutSystem from '@/components/about/AboutSystem';
import { searchProperty } from '@/services/searchService';
import { Button } from '@/components/ui/button';
import { MessagesSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
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

  // Function to handle VAPI bot click
  const handleVapiBotClick = () => {
    window.open('https://vapi.ai?demo=true&shareKey=c42849ce-d6c4-4dd3-ac8c-24482acfd70a&assistantId=9cc6edcc-8468-435b-b332-08b4051b7587', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AppHeader />
      
      <main className="flex-grow py-8 px-4 container max-w-7xl">
        <div className="space-y-12">
          {/* Hero section */}
          <section className="text-center mb-8">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-gov-blue mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Bharat Property Nexus
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-700 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              A unified search interface for all government property databases, designed to simplify property verification across India.
            </motion.p>
          </section>
          
          {/* Search Form */}
          <motion.section 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <PropertySearchForm onSearch={handleSearch} isLoading={isSearching} />
          </motion.section>
          
          {/* Search Results */}
          <section ref={resultsRef}>
            {searchResults.length > 0 && (
              <SearchResults results={searchResults} searchTerm={searchTerm} />
            )}
          </section>
          
          {/* About Section */}
          <section id="about" className="pt-8 mt-16 border-t">
            <h2 className="text-2xl font-bold text-center mb-6">About the System</h2>
            <AboutSystem />
          </section>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gov-blue text-white py-6 mt-16 relative">
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
                <li><a href="#" className="text-sm text-gray-300 hover:text-white">Home</a></li>
                <li><a href="#about" className="text-sm text-gray-300 hover:text-white">About</a></li>
                <li><a href="#help" className="text-sm text-gray-300 hover:text-white">Help</a></li>
                <li><a href="#" className="text-sm text-gray-300 hover:text-white">Contact Us</a></li>
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

        {/* VAPI Agent Bot Button */}
        <motion.div 
          className="fixed bottom-6 right-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 1
          }}
        >
          <Button 
            onClick={handleVapiBotClick}
            className="rounded-full p-4 bg-gov-orange hover:bg-gov-orange-dark shadow-lg flex items-center gap-2"
            size="lg"
          >
            <MessagesSquare className="h-6 w-6" />
            <span className="hidden sm:inline">Chat with Property Assistant</span>
          </Button>
        </motion.div>
      </footer>
    </div>
  );
};

export default Index;
