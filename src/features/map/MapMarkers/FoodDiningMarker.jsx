import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getFoodDiningIcon } from '../../../services/utils/formatters';

/**
 * Food & Dining marker component for the map
 */
const FoodDiningMarker = ({ marker }) => {
  // Create a custom icon based on food & dining type
  const createIcon = () => {
    // Configuration based on food & dining type
    const iconConfig = {
      restaurant: {
        color: '#8a2be2', // Purple
        size: 12,
        borderColor: 'white',
        borderWidth: 1
      },
      cafe: {
        color: '#964b00', // Brown
        size: 10,
        borderColor: 'white',
        borderWidth: 1
      },
      pub: {
        color: '#663399', // Dark purple
        size: 12,
        borderColor: 'white',
        borderWidth: 1
      },
      fast_food: {
        color: '#ff5f1f', // Orange-red
        size: 10,
        borderColor: 'white',
        borderWidth: 1
      }
    };
    
    // Get the appropriate icon config or use default
    const config = iconConfig[marker.type] || {
      color: '#8a2be2',
      size: 12,
      borderColor: 'white',
      borderWidth: 1
    };
    
    // Create HTML for the icon
    const iconHtml = `<div style="
      background-color: ${config.color}; 
      width: ${config.size}px; 
      height: ${config.size}px; 
      border-radius: 50%; 
      border: ${config.borderWidth}px solid ${config.borderColor};"
    ></div>`;
    
    return L.divIcon({
      html: iconHtml,
      className: 'food-dining-icon',
      iconSize: [config.size, config.size],
      iconAnchor: [config.size/2, config.size/2]
    });
  };
  
  // Format popup content
  const getPopupContent = () => {
    // Get user-friendly name for the type
    const typeDisplay = {
      'restaurant': 'Restaurant',
      'cafe': 'Cafe',
      'pub': 'Pub',
      'fast_food': 'Fast Food'
    }[marker.type] || marker.type.charAt(0).toUpperCase() + marker.type.slice(1).replace('_', ' ');
    
    return (
      <div style={{ maxWidth: '250px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{marker.name}</h3>
        <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Type:</strong> {typeDisplay}</p>
        
        {marker.cuisine && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Cuisine:</strong> {marker.cuisine.charAt(0).toUpperCase() + marker.cuisine.slice(1)}
          </p>
        )}
        
        {marker.outdoor_seating && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Outdoor Seating:</strong> Yes
          </p>
        )}
        
        {marker.takeaway && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Takeaway:</strong> Yes
          </p>
        )}
        
        {marker.distance && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Distance:</strong> {Math.round(marker.distance)}m
          </p>
        )}
        
        <p style={{ margin: '4px 0', fontSize: '12px', color: '#777' }}>
          Coordinates: [{marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}]
        </p>
      </div>
    );
  };
  
  // Don't render if coordinates are invalid
  if (!marker.latitude || !marker.longitude || 
      isNaN(marker.latitude) || isNaN(marker.longitude) ||
      marker.latitude === 0 || marker.longitude === 0) {
    return null;
  }
  
  const position = [
    parseFloat(marker.latitude),
    parseFloat(marker.longitude)
  ];
  
  return (
    <Marker 
      position={position}
      icon={createIcon()}
    >
      <Popup>
        {getPopupContent()}
      </Popup>
    </Marker>
  );
};

export default FoodDiningMarker;