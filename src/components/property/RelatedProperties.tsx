
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building, Compass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface RelatedPropertiesProps {
  propertyLocation: string;
}

const RelatedProperties: React.FC<RelatedPropertiesProps> = ({ propertyLocation }) => {
  const { toast } = useToast();
  
  // In a real app, this would fetch related properties from an API
  // For now, we'll create some mock data
  const relatedProperties = [
    {
      id: 'PROP789012',
      ownerName: 'Priya Sharma',
      location: propertyLocation.replace(/\d+/, '38'),
      propertyType: 'Urban',
      price: '₹1,15,00,000',
      distance: '0.2 km',
      features: ['2 Bedrooms', '1 Bathroom', 'Parking']
    },
    {
      id: 'PROP345678',
      ownerName: 'Aditya Patel',
      location: propertyLocation.replace(/\d+/, '45'),
      propertyType: 'Urban',
      price: '₹1,35,00,000',
      distance: '0.3 km',
      features: ['3 Bedrooms', '2 Bathrooms', 'Garden']
    },
    {
      id: 'PROP901234',
      ownerName: 'Meera Reddy',
      location: propertyLocation.replace(/Nehru Place/, 'Lajpat Nagar'),
      propertyType: 'Urban',
      price: '₹1,05,00,000',
      distance: '1.5 km',
      features: ['2 Bedrooms', '2 Bathrooms', 'Balcony']
    }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Compass className="mr-2 h-5 w-5" />
          Nearby Properties
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedProperties.map((property) => (
            <Link
              key={property.id}
              to={`/property/${property.id}`}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              onClick={(e) => {
                e.preventDefault();
                toast({
                  title: "Feature Preview",
                  description: "This is a demonstration of related properties linking. Full implementation coming soon!",
                });
              }}
            >
              <div className="h-40 bg-gray-200 relative overflow-hidden">
                {/* In a real app, this would be an image of the property */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building className="h-16 w-16 text-gray-400" />
                </div>
                <div className="absolute bottom-2 right-2">
                  <Badge className="bg-gov-blue text-white">
                    {property.distance}
                  </Badge>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium">{property.ownerName}</h3>
                <p className="text-gray-500 text-sm flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {property.location}
                </p>
                <div className="mt-2 flex justify-between">
                  <Badge variant="outline">{property.propertyType}</Badge>
                  <span className="font-medium text-gov-blue">{property.price}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {property.features.map((feature, i) => (
                    <Badge key={i} variant="outline" className="bg-gray-50 text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedProperties;
