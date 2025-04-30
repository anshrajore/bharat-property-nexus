
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import StatusIndicator, { StatusType } from './StatusIndicator';
import { UnifiedPropertyRecord } from '@/types/property';

export interface PortalResult {
  portalId: string;
  portalName: string;
  status: StatusType;
  data: UnifiedPropertyRecord | null;
}

interface SearchResultsProps {
  results: PortalResult[];
  searchTerm: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results,
  searchTerm
}) => {
  if (results.length === 0) {
    return null;
  }

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
      // Display our unified data format
      const data = result.data;
      
      // Filter out null/undefined values and metadata fields
      const displayData = Object.entries(data).filter(([key, value]) => {
        return value !== null && value !== undefined && !['dataSource', 'portalOrigin'].includes(key);
      }).reduce((acc, [key, value]) => {
        // Convert camelCase to Title Case for display
        const formattedKey = key.replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        
        acc[formattedKey] = value;
        return acc;
      }, {} as Record<string, any>);

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(displayData).map(([key, value]) => (
              <div key={key} className="border rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                <p className="text-xs font-medium text-gray-500 mb-1">{key}</p>
                <p className="text-sm font-medium">{String(value)}</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end pt-2">
            <Button variant="outline" className="flex items-center gap-2 text-sm">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
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
    <Card className="w-full max-w-4xl mx-auto shadow-md mt-8">
      <CardHeader className="bg-gov-blue-light text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Search Results</CardTitle>
            <CardDescription className="text-gray-200">
              Property information for "{searchTerm}"
            </CardDescription>
          </div>
          <Button variant="outline" className="bg-white hover:bg-gray-100 text-gov-blue border-none">
            <FileText className="h-4 w-4 mr-2" />
            Save All Results
          </Button>
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
  );
};

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default SearchResults;
