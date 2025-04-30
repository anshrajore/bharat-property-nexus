
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, ArrowLeft, Bookmark, Building, MapPin, Calendar, FileBox, ChevronDown, ChevronUp, FileCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import PropertyMap from '@/components/maps/PropertyMap';
import { downloadAsPdf, shareViaWhatsApp } from '@/utils/shareResults';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import PropertyDocumentViewer from '@/components/property/PropertyDocumentViewer';
import PropertyValueHistory from '@/components/property/PropertyValueHistory';
import PropertyRiskAssessment from '@/components/property/PropertyRiskAssessment';
import RelatedProperties from '@/components/property/RelatedProperties';
import { UnifiedPropertyRecord } from '@/services/dataIntegrationService';

const PropertyDetails = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { toast } = useToast();
  const [property, setProperty] = useState<UnifiedPropertyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch property details
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      try {
        // This would be a real API call in production
        // For now, we'll simulate fetching data with a timeout
        setTimeout(() => {
          // Mock data
          const mockProperty: UnifiedPropertyRecord = {
            propertyId: propertyId || 'PROP123456',
            propertyType: 'Urban',
            ownerName: 'Rajesh Kumar',
            propertyLocation: '42 Nehru Place, New Delhi, 110019',
            registrationDate: '2021-08-15',
            sourcePortal: 'DORIS',
            encumbrances: [
              { 
                type: 'Mortgage',
                holder: 'State Bank of India',
                status: 'Active',
                value: '₹24,00,000',
                date: '2021-09-10'
              },
              {
                type: 'Property Tax Lien',
                holder: 'Delhi Municipal Corporation',
                status: 'Resolved',
                value: '₹45,000',
                date: '2022-03-15'
              }
            ],
            lastUpdated: '2023-06-12',
            trustworthinessScore: 85,
            sourceDocuments: ['property_deed', 'sales_agreement', 'tax_clearance'],
            coordinates: {
              latitude: 28.5493,
              longitude: 77.2634
            },
            propertyValue: {
              current: '₹1,25,00,000',
              history: [
                { year: 2019, value: 9000000 },
                { year: 2020, value: 10500000 },
                { year: 2021, value: 11000000 },
                { year: 2022, value: 12000000 },
                { year: 2023, value: 12500000 }
              ]
            },
            propertySize: '1250 sq. ft.',
            constructionYear: 2010,
            propertyFeatures: ['3 Bedrooms', '2 Bathrooms', 'Parking', 'Garden'],
            neighborhoodDetails: {
              schools: 4,
              hospitals: 2,
              parks: 3,
              commercialZones: 2,
              crimeRate: 'Low'
            },
            legalStatus: 'Clear',
            zoning: 'Residential',
            documentHistory: [
              { 
                id: 'DOC001',
                type: 'Initial Registration',
                date: '2010-06-10',
                parties: ['Anil Sharma (Seller)', 'Rajesh Kumar (Buyer)'],
                status: 'Completed'
              },
              {
                id: 'DOC002',
                type: 'Mortgage Agreement',
                date: '2021-09-10',
                parties: ['Rajesh Kumar', 'State Bank of India'],
                status: 'Active'
              }
            ]
          };
          
          setProperty(mockProperty);
          setLoading(false);
        }, 1500);
        
      } catch (error) {
        console.error('Error fetching property details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load property details. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };
    
    fetchPropertyDetails();
  }, [propertyId, toast]);

  const handleDownloadPdf = () => {
    if (property) {
      downloadAsPdf({
        portalId: property.sourcePortal.toLowerCase(),
        portalName: property.sourcePortal,
        status: 'found',
        data: property
      });
      toast({
        title: 'PDF Downloaded',
        description: 'Property details have been exported to PDF',
      });
    }
  };

  const handleShare = () => {
    if (property) {
      if (navigator.share) {
        navigator.share({
          title: `Property Record: ${property.propertyId}`,
          text: `Property details for ${property.ownerName} at ${property.propertyLocation}`,
          url: window.location.href,
        }).catch(error => {
          if (error.name !== 'AbortError') {
            shareViaWhatsApp({
              portalId: property.sourcePortal.toLowerCase(),
              portalName: property.sourcePortal,
              status: 'found',
              data: property
            });
          }
        });
      } else {
        shareViaWhatsApp({
          portalId: property.sourcePortal.toLowerCase(),
          portalName: property.sourcePortal,
          status: 'found',
          data: property
        });
        toast({
          title: 'Sharing',
          description: 'Opening WhatsApp to share property details',
        });
      }
    }
  };

  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  const renderPropertyHeader = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      );
    }

    if (!property) return null;

    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gov-blue">
              {property.ownerName}'s Property
            </h1>
            <p className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {property.propertyLocation}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleDownloadPdf} 
              variant="outline" 
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button 
              onClick={handleShare}
              variant="outline"
              className="flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" className="flex items-center gap-1">
              <Bookmark className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-gov-blue text-white border-none">
            ID: {property.propertyId}
          </Badge>
          <Badge variant="outline" className="border-gov-blue text-gov-blue">
            {property.propertyType}
          </Badge>
          <Badge variant="outline" className={
            property.encumbrances.some(e => e.status.toLowerCase() === 'active')
              ? "bg-amber-100 text-amber-800 border-amber-200"
              : "bg-green-100 text-green-800 border-green-200"
          }>
            {property.encumbrances.some(e => e.status.toLowerCase() === 'active')
              ? "Has Active Encumbrances"
              : "No Active Encumbrances"}
          </Badge>
          <Badge variant="outline" className={
            property.trustworthinessScore > 80
              ? "bg-green-100 text-green-800 border-green-200"
              : property.trustworthinessScore > 60
              ? "bg-amber-100 text-amber-800 border-amber-200"
              : "bg-red-100 text-red-800 border-red-200"
          }>
            Trust Score: {property.trustworthinessScore}/100
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button */}
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" className="flex items-center text-gov-blue hover:text-gov-blue hover:bg-gov-blue/10">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Search
          </Button>
        </Link>
      </div>
      
      {/* Property header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        {renderPropertyHeader()}
      </motion.div>
      
      {/* Main content */}
      <Tabs 
        defaultValue="overview" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full md:w-fit grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">Value History</TabsTrigger>
          <TabsTrigger value="riskAnalysis">Risk Analysis</TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="overview" className="space-y-6 mt-4">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Skeleton className="h-[400px] w-full" />
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-[350px] w-full" />
                  </div>
                </div>
              ) : property ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Property Map */}
                    <Card className="overflow-hidden">
                      <CardHeader className="bg-gov-blue text-white py-3">
                        <CardTitle className="text-lg flex items-center">
                          <MapPin className="h-5 w-5 mr-2" />
                          Property Location
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 h-[350px]">
                        {property.coordinates && (
                          <PropertyMap 
                            latitude={property.coordinates.latitude}
                            longitude={property.coordinates.longitude}
                            address={property.propertyLocation}
                            ownerName={property.ownerName}
                          />
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Property Details */}
                    <div className="space-y-6">
                      {/* Property Details */}
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-lg flex items-center">
                            <Building className="h-5 w-5 mr-2" />
                            Property Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2 divide-y">
                          <div className="grid grid-cols-2 py-2">
                            <span className="text-gray-500">Property Type</span>
                            <span>{property.propertyType}</span>
                          </div>
                          <div className="grid grid-cols-2 py-2">
                            <span className="text-gray-500">Property Size</span>
                            <span>{property.propertySize}</span>
                          </div>
                          <div className="grid grid-cols-2 py-2">
                            <span className="text-gray-500">Construction Year</span>
                            <span>{property.constructionYear}</span>
                          </div>
                          <div className="grid grid-cols-2 py-2">
                            <span className="text-gray-500">Registration Date</span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                              {property.registrationDate}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 py-2">
                            <span className="text-gray-500">Current Value</span>
                            <span>{property.propertyValue?.current}</span>
                          </div>
                          <div className="grid grid-cols-2 py-2">
                            <span className="text-gray-500">Zoning</span>
                            <span>{property.zoning}</span>
                          </div>
                          <div className="grid grid-cols-2 py-2">
                            <span className="text-gray-500">Legal Status</span>
                            <span className={
                              property.legalStatus === 'Clear' 
                                ? "text-green-600" 
                                : "text-amber-600"
                            }>
                              {property.legalStatus}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Features */}
                      {property.propertyFeatures && (
                        <div className="flex flex-wrap gap-2">
                          {property.propertyFeatures.map((feature, index) => (
                            <Badge key={index} variant="outline" className="py-1.5">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Encumbrances Section */}
                  <Card>
                    <CardHeader 
                      className="py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleSection('encumbrances')}
                    >
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center">
                          <FileCog className="h-5 w-5 mr-2" />
                          Encumbrances & Liens
                        </CardTitle>
                        {activeSection === 'encumbrances' ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </CardHeader>
                    
                    <AnimatePresence>
                      {activeSection === 'encumbrances' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <CardContent>
                            {property.encumbrances.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {property.encumbrances.map((encumbrance, index) => (
                                  <div 
                                    key={index} 
                                    className={`p-4 rounded-lg border ${
                                      encumbrance.status.toLowerCase() === 'active'
                                        ? 'border-amber-200 bg-amber-50'
                                        : 'border-green-200 bg-green-50'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <h3 className="font-semibold">{encumbrance.type}</h3>
                                      <Badge className={`${
                                        encumbrance.status.toLowerCase() === 'active'
                                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                                          : encumbrance.status.toLowerCase() === 'resolved'
                                          ? 'bg-green-100 text-green-800 border-green-200'
                                          : 'bg-gray-100 text-gray-800 border-gray-200'
                                      }`}>
                                        {encumbrance.status}
                                      </Badge>
                                    </div>
                                    <p className="text-sm mt-2">Holder: {encumbrance.holder}</p>
                                    <div className="flex justify-between mt-2 text-sm">
                                      <span>Value: {encumbrance.value}</span>
                                      <span>Date: {encumbrance.date}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-center py-4 text-gray-500">
                                No encumbrances found for this property.
                              </p>
                            )}
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                  
                  {/* Neighborhood Details Section */}
                  <Card>
                    <CardHeader 
                      className="py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleSection('neighborhood')}
                    >
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center">
                          <MapPin className="h-5 w-5 mr-2" />
                          Neighborhood Details
                        </CardTitle>
                        {activeSection === 'neighborhood' ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </CardHeader>
                    
                    <AnimatePresence>
                      {activeSection === 'neighborhood' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <CardContent>
                            {property.neighborhoodDetails ? (
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="p-4 rounded-lg border bg-gray-50 text-center">
                                  <span className="block text-2xl font-bold text-gov-blue">
                                    {property.neighborhoodDetails.schools}
                                  </span>
                                  <span className="text-sm text-gray-500">Schools</span>
                                </div>
                                <div className="p-4 rounded-lg border bg-gray-50 text-center">
                                  <span className="block text-2xl font-bold text-gov-blue">
                                    {property.neighborhoodDetails.hospitals}
                                  </span>
                                  <span className="text-sm text-gray-500">Hospitals</span>
                                </div>
                                <div className="p-4 rounded-lg border bg-gray-50 text-center">
                                  <span className="block text-2xl font-bold text-gov-blue">
                                    {property.neighborhoodDetails.parks}
                                  </span>
                                  <span className="text-sm text-gray-500">Parks</span>
                                </div>
                                <div className="p-4 rounded-lg border bg-gray-50 text-center">
                                  <span className="block text-2xl font-bold text-gov-blue">
                                    {property.neighborhoodDetails.commercialZones}
                                  </span>
                                  <span className="text-sm text-gray-500">Commercial Zones</span>
                                </div>
                                <div className="p-4 rounded-lg border bg-gray-50 text-center">
                                  <span className={`block text-2xl font-bold ${
                                    property.neighborhoodDetails.crimeRate === 'Low' 
                                      ? 'text-green-600'
                                      : property.neighborhoodDetails.crimeRate === 'Medium'
                                      ? 'text-amber-600'
                                      : 'text-red-600'
                                  }`}>
                                    {property.neighborhoodDetails.crimeRate}
                                  </span>
                                  <span className="text-sm text-gray-500">Crime Rate</span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-center py-4 text-gray-500">
                                No neighborhood details available.
                              </p>
                            )}
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                  
                  {/* Related Properties */}
                  <RelatedProperties propertyLocation={property.propertyLocation} />
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Property details not found.</p>
                  <Button className="mt-4" asChild>
                    <Link to="/">Return to Search</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Documents Tab */}
            <TabsContent value="documents">
              <PropertyDocumentViewer 
                propertyId={propertyId || ''} 
                documents={property?.documentHistory || []} 
                sourceDocuments={property?.sourceDocuments || []}
                loading={loading}
              />
            </TabsContent>
            
            {/* Value History Tab */}
            <TabsContent value="history">
              <PropertyValueHistory 
                propertyValueHistory={property?.propertyValue?.history || []} 
                propertyId={propertyId || ''} 
                loading={loading}
              />
            </TabsContent>
            
            {/* Risk Analysis Tab */}
            <TabsContent value="riskAnalysis">
              <PropertyRiskAssessment 
                property={property} 
                loading={loading}
              />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default PropertyDetails;
