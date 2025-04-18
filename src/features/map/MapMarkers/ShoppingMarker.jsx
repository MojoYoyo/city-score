import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getShoppingIcon } from '../../../services/utils/formatters';

/**
 * Shopping marker component for the map
 */
const ShoppingMarker = ({ marker }) => {
  // Create a custom icon based on shopping type
  const createIcon = () => {
    // Configuration based on shopping type
    const iconConfig = {
      supermarket: {
        color: '#ff9500', // Orange
        size: 14,
        borderColor: 'white',
        borderWidth: 1
      },
      convenience: {
        color: '#ffcc00', // Yellow
        size: 10,
        borderColor: 'white',
        borderWidth: 1
      },
      mall: {
        color: '#ff2d55', // Pink
        size: 16,
        borderColor: 'white',
        borderWidth: 2
      },
      market: {
        color: '#34c759', // Green
        size: 12,
        borderColor: 'white',
        borderWidth: 1
      }
    };
    
    // Get the appropriate icon config or use default
    const config = iconConfig[marker.type] || {
      color: '#ff9500',
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
      className: 'shopping-icon',
      iconSize: [config.size, config.size],
      iconAnchor: [config.size/2, config.size/2]
    });
  };
  
  // Format popup content
  const getPopupContent = () => {
    // Get user-friendly name for the type
    const typeDisplay = {
      'supermarket': 'Supermarket',
      'convenience': 'Convenience Store',
      'mall': 'Shopping Mall',
      'market': 'Market'
    }[marker.type] || marker.type.charAt(0).toUpperCase() + marker.type.slice(1);
    
    return (
      <div style={{ maxWidth: '250px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{marker.name}</h3>
        <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Type:</strong> {typeDisplay}</p>
        
        {marker.brand && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Brand:</strong> {marker.brand}
          </p>
        )}
        
        {marker.size && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Size:</strong> {marker.size.charAt(0).toUpperCase() + marker.size.slice(1)}
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

export default ShoppingMarker;