
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, FileText, Search, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Document {
  id: string;
  type: string;
  date: string;
  parties: string[];
  status: string;
}

interface PropertyDocumentViewerProps {
  propertyId: string;
  documents: Document[];
  sourceDocuments?: string[];
  loading: boolean;
}

const PropertyDocumentViewer: React.FC<PropertyDocumentViewerProps> = ({ 
  propertyId,
  documents,
  sourceDocuments = [],
  loading
}) => {
  const [selectedTab, setSelectedTab] = useState('transactions');
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const handlePreviewDocument = (document: Document) => {
    setPreviewDocument(document);
    setPreviewOpen(true);
  };
  
  const renderDocumentPreview = () => {
    if (!previewDocument) return null;
    
    // This would be replaced with actual document preview functionality
    // For demonstration, we'll show a simulated document
    return (
      <div className="space-y-6">
        <div className="border p-6 rounded-md bg-gray-50">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold">{previewDocument.type}</h3>
            <p className="text-gray-500">Document ID: {previewDocument.id}</p>
            <p className="text-gray-500">Date: {previewDocument.date}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Parties Involved:</h4>
              <ul className="list-disc pl-5 mt-1">
                {previewDocument.parties.map((party, index) => (
                  <li key={index}>{party}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium">Property Details:</h4>
              <p className="mt-1">Property ID: {propertyId}</p>
            </div>
            
            <div>
              <h4 className="font-medium">Status:</h4>
              <Badge className={
                previewDocument.status === 'Completed' 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-amber-100 text-amber-800 border-amber-200'
              }>
                {previewDocument.status}
              </Badge>
            </div>
            
            <div className="border-t pt-4 mt-6 text-center text-sm text-gray-500">
              <p>This is a digital representation of the document.</p>
              <p>For legal purposes, please refer to the original document.</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            className="bg-gov-blue hover:bg-gov-blue-dark"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Document
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gov-blue">Property Documents</h2>
      
      <Tabs 
        value={selectedTab} 
        onValueChange={setSelectedTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full md:w-fit grid-cols-2 md:grid-cols-3 gap-2">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="sourceDocuments">Source Documents</TabsTrigger>
          <TabsTrigger value="search">Document Search</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Transaction Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.id}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{doc.date}</TableCell>
                        <TableCell>
                          <Badge className={
                            doc.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            doc.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }>
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handlePreviewDocument(doc)}
                            className="flex items-center"
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No transaction documents available for this property.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sourceDocuments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Source Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sourceDocuments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sourceDocuments.map((doc, index) => (
                    <div 
                      key={index}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="bg-gov-blue-light p-2 rounded-md">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <span className="ml-3 capitalize">
                          {doc.split('_').join(' ')}
                        </span>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No source documents available for this property.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Document Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <input
                  placeholder="Search for documents by keywords, dates, or parties involved..."
                  className="w-full p-3 pr-12 border border-input rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-gov-blue"
                />
                <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-gov-blue/10 transition-colors">
                  Registration Deed
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gov-blue/10 transition-colors">
                  Mortgage Agreement
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gov-blue/10 transition-colors">
                  Property Tax
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gov-blue/10 transition-colors">
                  Encumbrance Certificate
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gov-blue/10 transition-colors">
                  Sale Deed
                </Badge>
              </div>
              
              <div className="text-center py-10 text-gray-500">
                Use the search box above to find specific documents related to this property.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Document Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          {renderDocumentPreview()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyDocumentViewer;
