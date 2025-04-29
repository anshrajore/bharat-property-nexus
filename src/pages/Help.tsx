import React from 'react';
import AppHeader from '@/components/layout/AppHeader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, HelpCircle } from 'lucide-react';

const Help = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AppHeader />
      
      <main className="flex-grow py-8 px-4 container max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gov-blue mb-6">Help & Support</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I search for a property?</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Enter the owner's name in the search form</li>
                        <li>Provide either a Property ID, Registration Number, or complete address</li>
                        <li>Select the property type (Urban or Rural)</li>
                        <li>Choose a specific portal or use the Auto Detect option</li>
                        <li>Click the "Search" button to initiate the search</li>
                      </ol>
                      <p className="mt-2 text-sm text-gray-600">
                        Our system will then query the relevant government databases and display the results within seconds.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Which government databases are searched?</AccordionTrigger>
                    <AccordionContent>
                      <p>Bharat Property Nexus connects to the following official government databases:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li><strong>DORIS</strong> - Delhi Online Registration Information System</li>
                        <li><strong>DLR</strong> - Department of Land Records</li>
                        <li><strong>CERSAI</strong> - Central Registry of Securitisation Asset Reconstruction and Security Interest</li>
                        <li><strong>MCA21</strong> - Ministry of Corporate Affairs Portal</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>How do I use the OCR document scanner?</AccordionTrigger>
                    <AccordionContent>
                      <p>The OCR (Optical Character Recognition) scanner allows you to extract information from property documents:</p>
                      <ol className="list-decimal pl-5 space-y-2 mt-2">
                        <li>Click on the "Scan Document" button in the search form</li>
                        <li>Upload or drag-and-drop your property document (supports JPG, PNG, PDF)</li>
                        <li>Click "Extract All Text" to process the document</li>
                        <li>Use "Find Property ID" to automatically locate property identifiers</li>
                        <li>The extracted information will be populated in the search form</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger>What information can I see on the map?</AccordionTrigger>
                    <AccordionContent>
                      <p>The property map feature shows the geographical location of the property along with:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Exact location marker on an interactive Google Map</li>
                        <li>Property boundaries (where available)</li>
                        <li>Surrounding landmarks and infrastructure</li>
                        <li>Distance to nearest public services</li>
                      </ul>
                      <p className="mt-2 text-sm text-gray-600">
                        Note: The accuracy of the map data depends on the information available in the government databases.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger>Is there a limit on the number of searches?</AccordionTrigger>
                    <AccordionContent>
                      <p>Yes, there are usage limits based on your account type:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li><strong>Public Users:</strong> 5 searches per day</li>
                        <li><strong>Registered Users:</strong> 20 searches per day</li>
                        <li><strong>Government Officials:</strong> Unlimited searches</li>
                      </ul>
                      <p className="mt-2 text-sm text-gray-600">
                        To increase your search limit, please register for an account or contact your department administrator for official access.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-md border">
                    <h3 className="font-medium text-lg mb-2">Getting Started with Bharat Property Nexus</h3>
                    <div className="aspect-video bg-gray-800 rounded-md flex items-center justify-center text-white">
                      <p>Tutorial Video Placeholder</p>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      A comprehensive guide to using all features of the system.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-md border">
                    <h3 className="font-medium text-lg mb-2">Advanced Search Techniques</h3>
                    <div className="aspect-video bg-gray-800 rounded-md flex items-center justify-center text-white">
                      <p>Tutorial Video Placeholder</p>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Learn how to use advanced filters and search options.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Helpline</h3>
                  <p className="text-gray-600">1800-123-4567</p>
                  <p className="text-xs text-gray-500">Monday to Friday, 10:00 AM - 6:00 PM</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Email Support</h3>
                  <p className="text-gray-600">support@bharatpropertynexus.gov.in</p>
                  <p className="text-xs text-gray-500">Response within 48 hours</p>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Submit a Ticket
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-blue-600 hover:underline flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Quick Start Guide (PDF)
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Property Search Manual (PDF)
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Documentation Scanner Guide (PDF)
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Footer (reusing from the Index page) */}
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
                <li><a href="/" className="text-sm text-gray-300 hover:text-white">Home</a></li>
                <li><a href="/help" className="text-sm text-gray-300 hover:text-white">Help</a></li>
                <li><a href="/about" className="text-sm text-gray-300 hover:text-white">About</a></li>
                <li><a href="/auth" className="text-sm text-gray-300 hover:text-white">Login</a></li>
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

export default Help;
