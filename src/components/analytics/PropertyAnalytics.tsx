
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface PropertyAnalyticsProps {
  data: any | null;
}

const CHART_COLORS = ['#14306B', '#1A4B8C', '#0E2255', '#0F52BA', '#FF8200', '#138808', '#6C757D'];

const PropertyAnalytics: React.FC<PropertyAnalyticsProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <div className="text-center p-5">
          <h3 className="text-lg font-medium text-gray-600">No Analytics Data Available</h3>
          <p className="text-sm text-gray-500 mt-2">
            Perform a search that returns property records to generate analytics.
          </p>
        </div>
      </div>
    );
  }
  
  const { encumbrancesByType, encumbrancesByStatus, sourceDistribution } = data;
  
  const sourceDistributionData = Object.entries(sourceDistribution).map(([name, value]) => ({ 
    name, 
    value 
  }));

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Property Data Analytics</CardTitle>
            <CardDescription>Visual representation of search results data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {encumbrancesByType && encumbrancesByType.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Encumbrances by Type</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={encumbrancesByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {encumbrancesByType.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value} records`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              {encumbrancesByStatus && encumbrancesByStatus.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Encumbrances by Status</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={encumbrancesByStatus}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [`${value} records`, 'Count']} />
                      <Legend />
                      <Bar dataKey="value" name="Count" fill="#14306B">
                        {encumbrancesByStatus.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              {sourceDistributionData && sourceDistributionData.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Source Portal Distribution</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={sourceDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sourceDistributionData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value} records`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PropertyAnalytics;
