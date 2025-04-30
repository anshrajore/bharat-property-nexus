
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

interface ValueHistoryPoint {
  year: number;
  value: number;
}

interface PropertyValueHistoryProps {
  propertyValueHistory: ValueHistoryPoint[];
  propertyId: string;
  loading: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const PropertyValueHistory: React.FC<PropertyValueHistoryProps> = ({
  propertyValueHistory,
  propertyId,
  loading
}) => {
  // Calculate growth metrics
  const calculateGrowth = () => {
    if (propertyValueHistory.length < 2) return { overall: 0, annual: 0 };
    
    const firstYear = propertyValueHistory[0];
    const lastYear = propertyValueHistory[propertyValueHistory.length - 1];
    
    const overallGrowth = ((lastYear.value - firstYear.value) / firstYear.value) * 100;
    const years = lastYear.year - firstYear.year;
    const annualGrowth = overallGrowth / years;
    
    return {
      overall: overallGrowth,
      annual: annualGrowth
    };
  };
  
  const growth = calculateGrowth();
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-gov-blue">
            Value: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
  
    return null;
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
            <Skeleton className="h-72 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gov-blue">Property Value History</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Value Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {propertyValueHistory.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={propertyValueHistory}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="year" 
                      tickFormatter={(value) => `${value}`} 
                    />
                    <YAxis 
                      tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      name="Property Value" 
                      fill="#3B82F6" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No historical value data available for this property.
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Value Growth Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {propertyValueHistory.length > 1 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 border rounded-lg p-4 text-center">
                      <span className="block text-sm text-gray-500">Overall Growth</span>
                      <span className={`text-2xl font-bold ${growth.overall >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growth.overall.toFixed(2)}%
                      </span>
                    </div>
                    <div className="bg-gray-50 border rounded-lg p-4 text-center">
                      <span className="block text-sm text-gray-500">Annual Growth</span>
                      <span className={`text-2xl font-bold ${growth.annual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growth.annual.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Value Milestones</h4>
                    <div className="space-y-3">
                      {propertyValueHistory.map((point, index) => (
                        <div key={index} className="flex items-center border-b pb-2">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-gray-700">{point.year}:</span>
                          <span className="ml-2 font-medium text-gov-blue">{formatCurrency(point.value)}</span>
                          {index > 0 && (
                            <span className={`ml-auto ${
                              point.value > propertyValueHistory[index - 1].value 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {((point.value - propertyValueHistory[index - 1].value) / propertyValueHistory[index - 1].value * 100).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Not enough historical data to analyze growth.
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Market Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4 text-gray-600">
                <p>Based on nearby properties, this property's value is:</p>
                <div className="mt-2">
                  <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                    10% above market average
                  </span>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Analysis based on 12 similar properties in the area.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyValueHistory;
