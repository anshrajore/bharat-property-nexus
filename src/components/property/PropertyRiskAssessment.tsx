
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, FileCheck, ShieldCheck, BadgeInfo, GanttChart } from 'lucide-react';
import { UnifiedPropertyRecord } from '@/services/dataIntegrationService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PropertyRiskAssessmentProps {
  property: UnifiedPropertyRecord | null;
  loading: boolean;
}

const PropertyRiskAssessment: React.FC<PropertyRiskAssessmentProps> = ({
  property,
  loading
}) => {
  // Calculate different risk scores based on property data
  const calculateRiskScores = () => {
    if (!property) return null;
    
    // The calculations here would normally be much more complex
    // This is just a simplified demo version
    
    const hasActiveEncumbrances = property.encumbrances.some(e => e.status.toLowerCase() === 'active');
    const encumbranceCount = property.encumbrances.length;
    
    return {
      titleRisk: 100 - property.trustworthinessScore,
      financialRisk: hasActiveEncumbrances ? 65 : 25,
      legalRisk: property.legalStatus === 'Clear' ? 15 : 60,
      overallRisk: Math.round((100 - property.trustworthinessScore) * 0.4 + 
                   (hasActiveEncumbrances ? 65 : 25) * 0.3 +
                   (property.legalStatus === 'Clear' ? 15 : 60) * 0.3)
    };
  };
  
  const riskScores = calculateRiskScores();
  
  const getRiskColor = (riskScore: number) => {
    if (riskScore < 30) return 'text-green-600';
    if (riskScore < 60) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const getRiskProgressColor = (riskScore: number) => {
    if (riskScore < 30) return 'bg-green-600';
    if (riskScore < 60) return 'bg-amber-600';
    return 'bg-red-600';
  };
  
  const getRiskLabel = (riskScore: number) => {
    if (riskScore < 30) return 'Low Risk';
    if (riskScore < 60) return 'Moderate Risk';
    return 'High Risk';
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!property || !riskScores) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cannot perform risk assessment. Property data is unavailable.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gov-blue">Property Risk Analysis</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldCheck className="mr-2 h-5 w-5" />
            Overall Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full border-8 flex items-center justify-center mb-4"
                style={{ borderColor: getRiskProgressColor(riskScores.overallRisk) }}>
                <div className="text-center">
                  <span className={`text-4xl font-bold ${getRiskColor(riskScores.overallRisk)}`}>
                    {riskScores.overallRisk}%
                  </span>
                  <p className={`${getRiskColor(riskScores.overallRisk)}`}>
                    {getRiskLabel(riskScores.overallRisk)}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-center max-w-lg">
                This property has an overall risk assessment score of {riskScores.overallRisk}%, indicating a 
                {' '}{getRiskLabel(riskScores.overallRisk).toLowerCase()} level of risk for potential buyers or lenders.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TooltipProvider>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      Title Risk
                      <Tooltip>
                        <TooltipTrigger>
                          <BadgeInfo className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Risk associated with title clarity and ownership disputes</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={getRiskColor(riskScores.titleRisk)}>
                          {getRiskLabel(riskScores.titleRisk)}
                        </span>
                        <span className="font-bold">{riskScores.titleRisk}%</span>
                      </div>
                      <Progress value={riskScores.titleRisk} className="h-2" 
                        style={{ backgroundColor: '#e5e7eb' }}>
                        <div className="h-full" style={{ backgroundColor: getRiskProgressColor(riskScores.titleRisk), width: `${riskScores.titleRisk}%` }} />
                      </Progress>
                    </div>
                  </CardContent>
                </Card>
              
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      Financial Risk
                      <Tooltip>
                        <TooltipTrigger>
                          <BadgeInfo className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Risk related to mortgages, liens, and other financial encumbrances</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={getRiskColor(riskScores.financialRisk)}>
                          {getRiskLabel(riskScores.financialRisk)}
                        </span>
                        <span className="font-bold">{riskScores.financialRisk}%</span>
                      </div>
                      <Progress value={riskScores.financialRisk} className="h-2" 
                        style={{ backgroundColor: '#e5e7eb' }}>
                        <div className="h-full" style={{ backgroundColor: getRiskProgressColor(riskScores.financialRisk), width: `${riskScores.financialRisk}%` }} />
                      </Progress>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      Legal Risk
                      <Tooltip>
                        <TooltipTrigger>
                          <BadgeInfo className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Risk related to legal disputes, violations, or regulatory issues</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={getRiskColor(riskScores.legalRisk)}>
                          {getRiskLabel(riskScores.legalRisk)}
                        </span>
                        <span className="font-bold">{riskScores.legalRisk}%</span>
                      </div>
                      <Progress value={riskScores.legalRisk} className="h-2" 
                        style={{ backgroundColor: '#e5e7eb' }}>
                        <div className="h-full" style={{ backgroundColor: getRiskProgressColor(riskScores.legalRisk), width: `${riskScores.legalRisk}%` }} />
                      </Progress>
                    </div>
                  </CardContent>
                </Card>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-amber-500 pl-4 py-2 bg-amber-50">
              <h4 className="font-medium">Active Mortgage</h4>
              <p className="text-sm text-gray-600">
                There is an active mortgage with State Bank of India which constitutes a financial encumbrance on the property.
              </p>
            </div>
            
            {property.legalStatus !== 'Clear' && (
              <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                <h4 className="font-medium">Legal Status Issues</h4>
                <p className="text-sm text-gray-600">
                  The property has legal status issues that need resolution.
                </p>
              </div>
            )}
            
            {property.trustworthinessScore < 90 && (
              <div className="border-l-4 border-amber-500 pl-4 py-2 bg-amber-50">
                <h4 className="font-medium">Trust Score Below 90%</h4>
                <p className="text-sm text-gray-600">
                  The property's trustworthiness score is {property.trustworthinessScore}%, which indicates potential documentation or verification gaps.
                </p>
              </div>
            )}
            
            <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
              <h4 className="font-medium">Positive Factor: Clear Registration</h4>
              <p className="text-sm text-gray-600">
                Property registration is properly documented and verified in government records.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileCheck className="mr-2 h-5 w-5" />
              Recommended Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium flex items-center">
                <GanttChart className="h-4 w-4 mr-2" />
                Due Diligence Checklist
              </h4>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center mr-2">
                    <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Verify property boundaries with official survey records
                </li>
                <li className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center mr-2">
                    <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Review property tax payment history
                </li>
                <li className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-amber-500 flex items-center justify-center mr-2">
                    <div className="h-1 w-1 bg-white rounded-full"></div>
                  </div>
                  Request detailed mortgage statement from State Bank of India
                </li>
                <li className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-amber-500 flex items-center justify-center mr-2">
                    <div className="h-1 w-1 bg-white rounded-full"></div>
                  </div>
                  Verify zoning compliance with municipal authorities
                </li>
                <li className="flex items-center">
                  <div className="h-4 w-4 rounded-full border border-gray-300 mr-2"></div>
                  Conduct independent property valuation
                </li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg bg-gov-blue/5">
              <h4 className="font-medium">Expert Recommendation</h4>
              <p className="mt-2 text-sm text-gray-600">
                Based on our analysis, we recommend obtaining a comprehensive title insurance policy to mitigate potential title-related risks associated with this property.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyRiskAssessment;
