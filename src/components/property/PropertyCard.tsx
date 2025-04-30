
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UnifiedPropertyRecord } from '@/services/dataIntegrationService';
import { Calendar, FileText, MapPin, FileSearch, Download, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { downloadAsPdf, shareViaWhatsApp } from '@/utils/shareResults';
import { toast } from '@/hooks/use-toast';

interface PropertyCardProps {
  property: UnifiedPropertyRecord;
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showingDetails, setShowingDetails] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      // Convert property to SearchResult format for downloadAsPdf
      downloadAsPdf({
        portalId: property.sourcePortal.toLowerCase(), // Add portalId property
        portalName: property.sourcePortal,
        status: 'found',
        data: property
      });
      
      toast({
        title: "PDF Downloaded",
        description: "Property details have been exported to PDF",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Download Failed",
        description: "Could not generate the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Property Record: ${property.propertyId}`,
          text: `Property details for ${property.ownerName} at ${property.propertyLocation}`,
          url: window.location.href,
        });
        
        toast({
          title: "Shared Successfully",
          description: "Property details have been shared",
        });
      } catch (error) {
        console.error("Error sharing:", error);
        
        if ((error as Error).name !== 'AbortError') {
          toast({
            title: "Sharing Failed",
            description: "Could not share the property details",
            variant: "destructive",
          });
        }
      }
    } else {
      // If Web Share API is not available, use our WhatsApp sharing function
      shareViaWhatsApp({
        portalId: property.sourcePortal.toLowerCase(), // Add portalId property
        portalName: property.sourcePortal,
        status: 'found',
        data: property
      });
      
      toast({
        title: "WhatsApp Sharing",
        description: "Opening WhatsApp to share property details",
      });
    }
  };

  // Determine the status color for encumbrances
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'discharged':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get accuracy indicator classes based on trustworthiness score
  const getTrustworthinessIndicator = (score: number) => {
    if (score >= 90) {
      return 'text-green-600';
    } else if (score >= 75) {
      return 'text-yellow-600';
    } else {
      return 'text-red-600';
    }
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 hover:border-gov-blue ${className} hover-float`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg md:text-xl mb-1 flex items-center">
              <span className="mr-2">{property.ownerName}</span>
              <Badge variant="outline" className="ml-2 border-gov-blue text-gov-blue">
                {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
              </Badge>
            </CardTitle>
            <CardDescription className="flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
              {property.propertyLocation}
            </CardDescription>
          </div>
          <Badge 
            className={`px-2 py-1 rounded font-medium ${
              property.sourcePortal === 'CERSAI' ? 'bg-gov-blue text-white' : 
              property.sourcePortal === 'DORIS' ? 'bg-gov-orange text-white' :
              property.sourcePortal === 'DLR' ? 'bg-gov-green text-white' :
              'bg-gov-purple text-white'
            }`}
          >
            {property.sourcePortal}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2 pb-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
          <div className="text-sm">
            <span className="text-gray-500 block text-xs">Property ID:</span>
            <span className="font-medium">{property.propertyId || 'N/A'}</span>
          </div>
          
          {property.registrationDate && (
            <div className="text-sm">
              <span className="text-gray-500 block text-xs">
                {property.sourcePortal === 'MCA21' ? 'Incorporation Date:' : 'Registration Date:'}
              </span>
              <span className="font-medium flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
                {property.registrationDate}
              </span>
            </div>
          )}
        </div>
        
        <div className="mb-3">
          <h4 className="text-sm font-semibold mb-1">Encumbrances</h4>
          {property.encumbrances.length > 0 ? (
            <ul className="space-y-1.5">
              {property.encumbrances.map((encumbrance, index) => (
                <li key={index} className="text-xs flex justify-between items-center">
                  <span>{encumbrance.type} {encumbrance.holder ? `- ${encumbrance.holder}` : ''}</span>
                  <Badge className={`${getStatusColor(encumbrance.status)}`}>
                    {encumbrance.status.charAt(0).toUpperCase() + encumbrance.status.slice(1)}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">No encumbrances found.</p>
          )}
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-4 slide-in-bottom">
            <div>
              <h4 className="text-sm font-semibold mb-1">Source Information</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="text-xs">
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="ml-1">{property.lastUpdated}</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">Trust Score:</span>
                  <span className={`ml-1 font-medium ${getTrustworthinessIndicator(property.trustworthinessScore)}`}>
                    {property.trustworthinessScore}/100
                  </span>
                </div>
              </div>
            </div>
            
            {property.sourceDocuments && (
              <div>
                <h4 className="text-sm font-semibold mb-1">Source Documents</h4>
                <div className="flex flex-wrap gap-2">
                  {property.sourceDocuments.map((doc, index) => (
                    <Badge key={index} variant="outline" className="flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      {doc.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex flex-wrap justify-between gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gov-blue hover:text-gov-blue hover:bg-gov-blue/10"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
        
        <div className="flex gap-2">
          <Dialog open={showingDetails} onOpenChange={setShowingDetails}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <FileSearch className="h-4 w-4 mr-1" />
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Property Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                <div>
                  <h3 className="text-lg font-semibold">{property.ownerName}</h3>
                  <p className="text-gray-500">{property.propertyLocation}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(property).map(([key, value]) => {
                    // Skip complex objects or arrays for this simple view
                    if (key === 'encumbrances' || key === 'coordinates' || key === 'sourceDocuments') return null;
                    
                    return (
                      <div key={key} className="border-b pb-2">
                        <div className="text-sm text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="font-medium">
                          {typeof value === 'string' ? value : JSON.stringify(value)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Encumbrances</h4>
                  <div className="space-y-2">
                    {property.encumbrances.map((encumbrance, index) => (
                      <div key={index} className="border rounded p-3">
                        <div className="flex justify-between">
                          <span className="font-medium">{encumbrance.type}</span>
                          <Badge className={getStatusColor(encumbrance.status)}>
                            {encumbrance.status}
                          </Badge>
                        </div>
                        <div className="mt-1 text-sm">
                          <div>Holder: {encumbrance.holder}</div>
                          {encumbrance.value && <div>Value: {encumbrance.value}</div>}
                          {encumbrance.date && <div>Date: {encumbrance.date}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowingDetails(false)}>Close</Button>
                <Button onClick={handleDownloadPdf}>
                  <Download className="h-4 w-4 mr-1" />
                  Download PDF
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
            <Download className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
