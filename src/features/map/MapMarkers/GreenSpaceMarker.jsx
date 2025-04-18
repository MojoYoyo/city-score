import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getGreenSpaceIcon } from '../../../services/utils/formatters';

/**
 * Green space marker component for the map
 */
const GreenSpaceMarker = ({ marker }) => {
  // Create a custom icon based on green space type
  const createIcon = () => {
    // Configuration based on green space type
    const iconConfig = {
      park: {
        color: '#22c55e', // Green
        size: 12,
        borderColor: 'white',
        borderWidth: 1
      },
      garden: {
        color: '#4ade80', // Light green
        size: 10,
        borderColor: 'white',
        borderWidth: 1
      },
      forest: {
        color: '#15803d', // Dark green
        size: 14,
        borderColor: 'white',
        borderWidth: 1
      },
      playground: {
        color: '#86efac', // Very light green
        size: 8,
        borderColor: 'white',
        borderWidth: 1
      },
      nature_reserve: {
        color: '#166534', // Very dark green
        size: 14,
        borderColor: 'white',
        borderWidth: 2
      }
    };
    
    // Get the appropriate icon config or use default
    const config = iconConfig[marker.type] || iconConfig.park;
    
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
      className: 'greenSpace-icon',
      iconSize: [config.size, config.size],
      iconAnchor: [config.size/2, config.size/2]
    });
  };
  
  // Format popup content
  const getPopupContent = () => {
    // Get user-friendly name for the type
    const typeDisplay = marker.type.charAt(0).toUpperCase() + 
      marker.type.slice(1).replace('_', ' ');
    
    if (marker.clusterCount > 1) {
      return (
        <div style={{ maxWidth: '250px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{marker.name}</h3>
          <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Type:</strong> {typeDisplay}</p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Represents:</strong> {marker.clusterCount} green spaces in this area
          </p>
          
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
        </div>
      );
    }
    
    return (
      <div style={{ maxWidth: '250px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{marker.name}</h3>
        <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Type:</strong> {typeDisplay}</p>
        
        {marker.size && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Size:</strong> {marker.size.charAt(0).toUpperCase() + marker.size.slice(1)}
          </p>
        )}
        
        {marker.amenities && marker.amenities.length > 0 && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Amenities:</strong> {marker.amenities.join(', ')}
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

export default GreenSpaceMarker;