
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AppHeader from '@/components/layout/AppHeader';
import AboutSystem from '@/components/about/AboutSystem';
import DocumentScanner from '@/components/ocr/DocumentScanner';
import PropertyMap from '@/components/maps/PropertyMap';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, MapPin, Route, Search } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import PropertyDashboard from '@/components/dashboard/PropertyDashboard';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const { toast } = useToast();
  const [selectedPropertyCoordinates, setSelectedPropertyCoordinates] = useState<{lat: number; lng: number} | null>(null);
  const [selectedPropertyAddress, setSelectedPropertyAddress] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOcrDialogOpen, setIsOcrDialogOpen] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [extractedPropertyId, setExtractedPropertyId] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleExtractedText = (text: string) => {
    setExtractedPropertyId(text);
    setIsOcrDialogOpen(false);
    
    toast({
      title: "Property ID Extracted",
      description: `Successfully extracted: ${text}`,
      variant: "default",
    });
    
    // Scroll to search form
    setTimeout(() => {
      window.scrollTo({
        top: 250,
        behavior: 'smooth'
      });
    }, 500);
  };

  const handleMapView = (coordinates: {lat: number; lng: number}, address: string | null) => {
    setSelectedPropertyCoordinates(coordinates);
    setSelectedPropertyAddress(address);
    // Automatically open the map if coordinates are available
    setIsMapDialogOpen(true);
  };
  
  const scrollToSearch = () => {
    window.scrollTo({
      top: 180,
      behavior: 'smooth'
    });
  };
  
  const scrollToAbout = () => {
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader />
        
        <AnimatePresence>
          {isScrolled && (
            <motion.div 
              className="fixed bottom-6 right-6 z-40 flex gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                variant="outline"
                size="sm"
                className="bg-white shadow-md"
              >
                ↑ Back to top
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <main className="flex-grow py-8 px-4 container max-w-7xl">
          <div className="space-y-12">
            {/* Hero section with enhanced animation */}
            <motion.section 
              className="text-center mb-12 relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gov-blue-light/10 to-gov-orange/5 z-0"></div>
              <motion.div
                className="relative z-10 py-12"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold text-gov-blue mb-6"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Bharat Property Nexus
                </motion.h1>
                <motion.p 
                  className="text-xl text-gray-700 max-w-3xl mx-auto mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  A unified search interface for all government property databases, 
                  designed to simplify property verification across India.
                </motion.p>
                <motion.div 
                  className="flex flex-wrap justify-center gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Button 
                    className="bg-gov-blue hover:bg-gov-blue-dark text-white transition-all shadow-md"
                    onClick={scrollToSearch}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Start Searching
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsOcrDialogOpen(true)}
                    className="border-gov-blue text-gov-blue hover:bg-gov-blue/10 transition-all shadow-sm"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Scan Document
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={scrollToAbout}
                    className="text-gray-700 hover:text-gov-blue hover:bg-transparent"
                  >
                    Learn More ↓
                  </Button>
                </motion.div>
              </motion.div>
            </motion.section>
            
            {/* Search Dashboard */}
            <section className="mb-8" ref={resultsRef}>
              <PropertyDashboard onMapView={handleMapView} />
            </section>
            
            {/* About Section */}
            <section id="about" className="pt-12 mt-16 border-t" ref={aboutRef}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gov-blue">About the System</h2>
                <AboutSystem />
              </motion.div>
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
        
        {/* Enhanced Footer */}
        <footer className="bg-gradient-to-r from-gov-blue to-gov-blue-dark text-white py-10 mt-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Bharat Property Nexus</h3>
                <p className="text-sm text-gray-200">
                  A unified property information system for transparent and efficient property verification across India.
                </p>
                <div className="flex mt-4 space-x-3">
                  <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <span className="sr-only">Twitter</span>
                    {/* Twitter icon placeholder */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-sm text-gray-200 hover:text-white">Home</Link></li>
                  <li><Link to="/about" className="text-sm text-gray-200 hover:text-white">About</Link></li>
                  <li><Link to="/help" className="text-sm text-gray-200 hover:text-white">Help</Link></li>
                  <li><Link to="/auth" className="text-sm text-gray-200 hover:text-white">Login/Register</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <address className="not-italic text-sm text-gray-200">
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
    </TooltipProvider>
  );
};

export default Index;
