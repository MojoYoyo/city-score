import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from '../../context/LocationContext';
import { useMapMarkers } from '../../hooks/useMapMarkers';
import MapLegend from './MapLegend';
import TransportationMarker from './MapMarkers/TransportationMarker';
import GreenSpaceMarker from './MapMarkers/GreenSpaceMarker';
import EducationMarker from './MapMarkers/EducationMarker';
import HealthcareMarker from './MapMarkers/HealthcareMarker';
import ShoppingMarker from './MapMarkers/ShoppingMarker';
import FoodDiningMarker from './MapMarkers/FoodDiningMarker';
import RecreationSportsMarker from './MapMarkers/RecreationSportsMarker';
import CulturalMarker from './MapMarkers/CulturalMarker';

// Fix for the default marker icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png',
});

// Custom component to recenter the map when selectedLocation changes
function MapCenterUpdater() {
  const { selectedLocation } = useLocation();
  const map = useMap();
  
  useEffect(() => {
    if (selectedLocation && selectedLocation.coordinates) {
      map.flyTo(selectedLocation.coordinates, 16);
    }
  }, [selectedLocation, map]);
  
  return null;
}

/**
 * Main map component
 */
const Map = () => {
  const { selectedLocation } = useLocation();
  const markers = useMapMarkers();
  
  // Default center - Warsaw city center
  const defaultCenter = [52.2297, 21.0122];
  
  // Render appropriate marker component based on marker type
  const renderMarker = (marker, index) => {
    switch (marker.markerType) {
      case 'transportation':
        return <TransportationMarker key={`transport-${marker.id || index}`} marker={marker} />;
      case 'greenSpace':
        return <GreenSpaceMarker key={`green-${marker.id || index}`} marker={marker} />;
      case 'education':
        return <EducationMarker key={`education-${marker.id || index}`} marker={marker} />;
      case 'healthcare':
        return <HealthcareMarker key={`healthcare-${marker.id || index}`} marker={marker} />;
      case 'shopping':
        return <ShoppingMarker key={`shopping-${marker.id || index}`} marker={marker} />;
      case 'foodDining':
        return <FoodDiningMarker key={`food-${marker.id || index}`} marker={marker} />;
      case 'recreationSports':
        return <RecreationSportsMarker key={`recreation-${marker.id || index}`} marker={marker} />;
      case 'cultural':
        return <CulturalMarker key={`cultural-${marker.id || index}`} marker={marker} />;
      default:
        return null;
    }
  };
  
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapLegend />
      <MapContainer 
        center={selectedLocation?.coordinates || defaultCenter} 
        zoom={selectedLocation ? 16 : 13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Update map center when selectedLocation changes */}
        <MapCenterUpdater />
        
        {/* Show marker for selected location */}
        {selectedLocation && (
          <>
            <Marker 
              position={selectedLocation.coordinates}
              zIndexOffset={1000} // Ensure the main location marker is above other markers
            />
            
            {/* Show circles for different distances */}
            <Circle 
              center={selectedLocation.coordinates}
              radius={250}
              pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.05, weight: 1 }}
            />
            <Circle 
              center={selectedLocation.coordinates}
              radius={500}
              pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.03, weight: 1 }}
            />
            <Circle 
              center={selectedLocation.coordinates}
              radius={1000}
              pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.01, weight: 1 }}
            />
          </>
        )}
        
        {/* Render all markers */}
        <LayerGroup>
          {markers.map((marker, index) => renderMarker(marker, index))}
        </LayerGroup>
      </MapContainer>
    </div>
  );
};

export default Map;