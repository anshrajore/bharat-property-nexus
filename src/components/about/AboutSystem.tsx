
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check } from 'lucide-react';

const AboutSystem: React.FC = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-md">
      <CardHeader className="bg-gov-blue text-white rounded-t-lg">
        <CardTitle className="text-xl">About Bharat Property Nexus</CardTitle>
        <CardDescription className="text-gray-200">
          Unified Property Information System
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <p className="text-gray-600">
            Bharat Property Nexus is an innovative government initiative to unify property search across multiple databases. 
            This platform allows citizens and officials to search for property information using a standardized interface 
            instead of navigating multiple government portals.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-gray-50 p-4 rounded-md border">
              <h3 className="font-semibold text-gov-blue mb-2">Supported Portals</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">DORIS</span>
                    <p className="text-sm text-gray-600">Delhi Online Registration Information System</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">DLR</span>
                    <p className="text-sm text-gray-600">Department of Land Records</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">CERSAI</span>
                    <p className="text-sm text-gray-600">Central Registry of Securitisation Asset Reconstruction and Security Interest</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">MCA21</span>
                    <p className="text-sm text-gray-600">Ministry of Corporate Affairs Portal</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md border">
              <h3 className="font-semibold text-gov-blue mb-2">Key Features</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">Unified Search</span>
                    <p className="text-sm text-gray-600">Search multiple databases with one form</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">Standardized Format</span>
                    <p className="text-sm text-gray-600">Consistent presentation of property information</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">Rural & Urban Properties</span>
                    <p className="text-sm text-gray-600">Support for both urban and rural property types</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">Report Generation</span>
                    <p className="text-sm text-gray-600">Download property information in PDF format</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="faq-1">
              <AccordionTrigger>What information do I need to search for a property?</AccordionTrigger>
              <AccordionContent>
                You'll need at least the owner's name, PIN code, and one of the following: Property ID, Registration Number, or the complete address.
                For rural properties, providing the Survey Number is recommended.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-2">
              <AccordionTrigger>How do I know which government portal to select?</AccordionTrigger>
              <AccordionContent>
                If you're unsure, select "Auto Detect" and our system will search across all relevant databases based on your inputs.
                For urban properties in Delhi, DORIS is recommended. For rural land records, DLR is more appropriate.
                CERSAI is useful for checking if a property has any secured loans against it.
                MCA21 is specifically for properties owned by registered companies.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-3">
              <AccordionTrigger>Can I download the property information?</AccordionTrigger>
              <AccordionContent>
                Yes, once the search is complete and results are found, you can download a PDF report containing all the property details.
                This report can be used for reference purposes. However, for legal verification, please visit the respective government offices.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-4">
              <AccordionTrigger>Is there a limit to how many searches I can perform?</AccordionTrigger>
              <AccordionContent>
                For public users, there is a limit of 5 searches per day. Government officials can login to access unlimited searches.
                This limit helps ensure system performance and prevents automated scraping of the data.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutSystem;
