
import React from 'react';
import AppHeader from '@/components/layout/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AppHeader />
      
      <main className="flex-grow py-8 px-4 container max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gov-blue mb-6">About Bharat Property Nexus</h1>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Bharat Property Nexus is an innovative government initiative aimed at transforming property verification 
                in India by creating a unified platform that seamlessly integrates multiple property databases.
              </p>
              <p>
                Our mission is to enhance transparency, reduce paperwork, and streamline the process of property verification 
                for citizens, financial institutions, and government bodies across the country.
              </p>
              <blockquote className="border-l-4 border-gov-blue pl-4 italic text-gray-600 my-4">
                "A transparent, accessible, and unified property information system for the digital age of India."
              </blockquote>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex">
                    <span className="bg-green-100 text-green-800 font-medium px-2 py-1 rounded-full text-xs mr-2">1</span>
                    <span>Create a standardized interface for all government property databases</span>
                  </li>
                  <li className="flex">
                    <span className="bg-green-100 text-green-800 font-medium px-2 py-1 rounded-full text-xs mr-2">2</span>
                    <span>Reduce time and bureaucracy in property verification processes</span>
                  </li>
                  <li className="flex">
                    <span className="bg-green-100 text-green-800 font-medium px-2 py-1 rounded-full text-xs mr-2">3</span>
                    <span>Enhance transparency in property ownership information</span>
                  </li>
                  <li className="flex">
                    <span className="bg-green-100 text-green-800 font-medium px-2 py-1 rounded-full text-xs mr-2">4</span>
                    <span>Provide a secure platform for information exchange</span>
                  </li>
                  <li className="flex">
                    <span className="bg-green-100 text-green-800 font-medium px-2 py-1 rounded-full text-xs mr-2">5</span>
                    <span>Support both urban and rural property verification needs</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">For Citizens</h3>
                    <p className="text-gray-600 text-sm">
                      Easy access to property information, reduced paperwork, faster verification processes, 
                      and protection against property fraud.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg">For Financial Institutions</h3>
                    <p className="text-gray-600 text-sm">
                      Streamlined due diligence, reduced processing time for property-backed loans, 
                      and enhanced security in property transactions.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg">For Government Bodies</h3>
                    <p className="text-gray-600 text-sm">
                      Improved interoperability between departments, enhanced data consistency, 
                      and better tax compliance monitoring.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Integrated Government Portals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-bold text-lg mb-2">DORIS</h3>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Delhi Online Registration Information System</h4>
                  <p className="text-sm">
                    DORIS maintains records for property registrations in Delhi, including sale deeds, 
                    mortgage documents, and lease agreements registered with the Delhi government.
                  </p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-bold text-lg mb-2">DLR</h3>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Department of Land Records</h4>
                  <p className="text-sm">
                    The DLR manages and updates land ownership records across states, including 
                    cadastral maps, land mutation records, and revenue surveys.
                  </p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-bold text-lg mb-2">CERSAI</h3>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Central Registry of Securitisation Asset Reconstruction and Security Interest</h4>
                  <p className="text-sm">
                    CERSAI maintains a centralized database of security interests created on properties 
                    to secure loans from banks and financial institutions.
                  </p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-bold text-lg mb-2">MCA21</h3>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Ministry of Corporate Affairs Portal</h4>
                  <p className="text-sm">
                    MCA21 includes data on corporate-owned properties and assets, including charges 
                    registered by companies against their properties.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Technology & Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Bharat Property Nexus utilizes cutting-edge web technologies to ensure a secure, 
                  responsive, and accessible platform for all users:
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border rounded-md p-3 text-center">
                    <h4 className="font-medium">Frontend</h4>
                    <p className="text-sm text-gray-600">React.js + Tailwind CSS</p>
                  </div>
                  
                  <div className="border rounded-md p-3 text-center">
                    <h4 className="font-medium">Backend</h4>
                    <p className="text-sm text-gray-600">Node.js + Express</p>
                  </div>
                  
                  <div className="border rounded-md p-3 text-center">
                    <h4 className="font-medium">Database</h4>
                    <p className="text-sm text-gray-600">PostgreSQL</p>
                  </div>
                  
                  <div className="border rounded-md p-3 text-center">
                    <h4 className="font-medium">Authentication</h4>
                    <p className="text-sm text-gray-600">Supabase Auth</p>
                  </div>
                </div>
                
                <h3 className="font-medium text-lg mt-4">Security Measures</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>End-to-end encryption for data transfer</li>
                  <li>Role-based access control for different user types</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Compliance with Government of India cyber security guidelines</li>
                  <li>Two-factor authentication for administrative access</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Development Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Bharat Property Nexus has been developed by a multi-disciplinary team of experts 
                from various government departments and technical consultants:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium">Ministry of Housing & Urban Affairs</h4>
                  <p className="text-sm text-gray-600">Project oversight and coordination</p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium">National Informatics Centre</h4>
                  <p className="text-sm text-gray-600">Technical implementation and infrastructure</p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium">Ministry of Electronics & IT</h4>
                  <p className="text-sm text-gray-600">Digital governance standards compliance</p>
                </div>
              </div>
            </CardContent>
          </Card>
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

export default About;
