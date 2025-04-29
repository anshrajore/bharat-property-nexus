
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, FileText, Share2, ArrowDown } from 'lucide-react';
import StatusIndicator, { StatusType } from './StatusIndicator';
import { downloadAsPdf, shareViaWhatsApp, downloadAllResultsAsCsv } from '@/utils/shareResults';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export interface PortalResult {
  portalId: string;
  portalName: string;
  status: StatusType;
  data: Record<string, any> | null;
}

interface SearchResultsProps {
  results: PortalResult[];
  searchTerm: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results,
  searchTerm
}) => {
  const { toast } = useToast();
  const [jsonPreviewOpen, setJsonPreviewOpen] = useState(false);
  const [jsonData, setJsonData] = useState<any>(null);

  if (results.length === 0) {
    return null;
  }

  const handleExportPdf = (result: PortalResult) => {
    if (result.status === 'found' && result.data) {
      downloadAsPdf(result);
      toast({
        title: "PDF Generated",
        description: `Saved ${result.portalName} property data as PDF`,
      });
    } else {
      toast({
        title: "Cannot Export",
        description: "No data available to export",
        variant: "destructive",
      });
    }
  };

  const handleShareViaWhatsApp = (result: PortalResult) => {
    if (result.status === 'found' && result.data) {
      shareViaWhatsApp(result);
      toast({
        title: "WhatsApp Sharing",
        description: "Opening WhatsApp to share property details",
      });
    } else {
      toast({
        title: "Cannot Share",
        description: "No data available to share",
        variant: "destructive",
      });
    }
  };

  const handleExportAllCsv = () => {
    downloadAllResultsAsCsv(results);
    toast({
      title: "CSV Generated",
      description: "Saved all property data as CSV",
    });
  };

  const showJsonPreview = (data: any) => {
    setJsonData(data);
    setJsonPreviewOpen(true);
  };

  const renderResultContent = (result: PortalResult) => {
    if (result.status === 'loading') {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-pulse-opacity text-center">
            <p className="text-gray-500 mb-2">Searching in {result.portalName}...</p>
            <p className="text-xs text-gray-400">Please wait while we retrieve the property information</p>
          </div>
        </div>
      );
    }
    
    if (result.status === 'notFound') {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">No records found for this property in {result.portalName}.</p>
            <p className="text-xs text-gray-500">Try providing more accurate information or try another portal.</p>
          </div>
        </div>
      );
    }
    
    if (result.status === 'unavailable') {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">{result.portalName} is currently unavailable.</p>
            <p className="text-xs text-gray-500">The service might be under maintenance. Please try again later.</p>
          </div>
        </div>
      );
    }
    
    if (result.status === 'found' && result.data) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(result.data).map(([key, value]) => {
              // Skip rendering location data as it's shown on the map
              if (key === 'Location' || typeof value === 'object') {
                return null;
              }
              
              return (
                <div key={key} className="border rounded-md p-3 bg-gray-50">
                  <p className="text-xs font-medium text-gray-500 mb-1">{key}</p>
                  <p className="text-sm font-medium">{String(value)}</p>
                </div>
              );
            })}
          </div>
          
          <div className="flex flex-wrap justify-between items-center pt-4 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => showJsonPreview(result.data)}
              className="text-xs"
            >
              View Raw Data
            </Button>
            
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleExportPdf(result)}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    <span className="hidden sm:inline">PDF</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download as PDF</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleShareViaWhatsApp(result)}
                    className="flex items-center gap-1"
                  >
                    <Share2 className="h-3 w-3" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share via WhatsApp</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="py-4 text-center text-gray-500">
        No data available
      </div>
    );
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto shadow-md mt-8">
        <CardHeader className="bg-gov-blue-light text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Search Results</CardTitle>
              <CardDescription className="text-gray-200">
                Property information for "{searchTerm}"
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white hover:bg-gray-100 text-gov-blue border-none">
                  <FileText className="h-4 w-4 mr-2" />
                  Export
                  <ArrowDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportAllCsv}>
                  <Download className="h-4 w-4 mr-2" />
                  Download All as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  const foundResult = results.find(r => r.status === 'found');
                  if (foundResult) {
                    handleShareViaWhatsApp(foundResult);
                  } else {
                    toast({
                      title: "No Data Available",
                      description: "There are no results to share",
                      variant: "destructive",
                    });
                  }
                }}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share via WhatsApp
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue={results[0].portalId}>
            <TabsList className="grid grid-cols-4 mb-6">
              {results.map((result) => (
                <TabsTrigger 
                  key={result.portalId} 
                  value={result.portalId}
                  className="relative flex items-center justify-center gap-2 py-3"
                >
                  {result.portalName}
                  <div className="absolute -top-1 -right-1">
                    {result.status !== 'loading' && (
                      <div className={cn(
                        'h-2.5 w-2.5 rounded-full',
                        result.status === 'found' ? 'bg-green-500' : 
                        result.status === 'notFound' ? 'bg-red-500' : 
                        'bg-yellow-500'
                      )}></div>
                    )}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {results.map((result) => (
              <TabsContent key={result.portalId} value={result.portalId}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{result.portalName}</h3>
                  <StatusIndicator status={result.status} />
                </div>
                {renderResultContent(result)}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* JSON Preview Dialog */}
      <Dialog open={jsonPreviewOpen} onOpenChange={setJsonPreviewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Raw JSON Data</DialogTitle>
          </DialogHeader>
          <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[400px]">
            <pre className="text-xs">{JSON.stringify(jsonData, null, 2)}</pre>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setJsonPreviewOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default SearchResults;
