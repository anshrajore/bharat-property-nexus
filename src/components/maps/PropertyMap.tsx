
import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// You'll need to add your Google Maps API key in a Supabase secret
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface PropertyMapProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  ownerName?: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  latitude = 28.6139, // Default to Delhi coordinates if none provided
  longitude = 77.2090,
  address = "Unknown Address",
  ownerName = "Unknown Owner" 
}) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };
  
  const center = {
    lat: latitude,
    lng: longitude
  };
  
  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <div className="p-3 bg-gov-blue text-white">
        <h3 className="text-lg font-semibold">Property Location</h3>
      </div>
      
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          options={options}
        >
          <Marker 
            position={center}
            onClick={() => setIsInfoOpen(true)}
          >
            {isInfoOpen && (
              <InfoWindow
                position={center}
                onCloseClick={() => setIsInfoOpen(false)}
              >
                <div className="p-2">
                  <h4 className="font-medium">{ownerName}</h4>
                  <p className="text-sm text-gray-600 mt-1">{address}</p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        </GoogleMap>
      </LoadScript>
      
      <div className="p-3 bg-gray-50 border-t">
        <p className="text-sm text-gray-600">
          <strong>Address:</strong> {address}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Coordinates:</strong> {latitude}, {longitude}
        </p>
      </div>
    </div>
  );
};

export default PropertyMap;
