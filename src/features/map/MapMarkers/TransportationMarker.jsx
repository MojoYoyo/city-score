import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getTransportIcon } from '../../../services/utils/formatters';

/**
 * Transportation marker component for the map
 */
const TransportationMarker = ({ marker }) => {
  // Create a custom icon based on transportation type
  const createIcon = () => {
    // Configuration based on transportation type
    const iconConfig = {
      metro: {
        color: '#C60C30', // Red
        size: 14,
        borderColor: 'white',
        borderWidth: 2
      },
      train: {
        color: '#1E3A8A', // Dark blue
        size: 14,
        borderColor: 'white',
        borderWidth: 2
      },
      tram: {
        color: '#059669', // Green
        size: 12,
        borderColor: 'white',
        borderWidth: 1
      },
      bus: {
        color: '#F59E0B', // Orange
        size: 10,
        borderColor: 'white',
        borderWidth: 1
      }
    };
    
    // Get the appropriate icon config or use default
    const config = iconConfig[marker.type] || iconConfig.bus;
    
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
      className: 'transportation-icon',
      iconSize: [config.size, config.size],
      iconAnchor: [config.size/2, config.size/2]
    });
  };
  
  // Format popup content
  const getPopupContent = () => {
    // Get user-friendly name for the type
    const typeDisplay = {
      'metro': 'Metro Station',
      'train': 'Train Station',
      'tram': 'Tram Stop',
      'bus': 'Bus Stop'
    }[marker.type] || marker.type.charAt(0).toUpperCase() + marker.type.slice(1);
    
    return (
      <div style={{ maxWidth: '250px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{marker.name}</h3>
        <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Type:</strong> {typeDisplay}</p>
        
        {marker.lines && Array.isArray(marker.lines) && marker.lines.length > 0 && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Lines:</strong> {marker.lines.join(', ')}
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

export default TransportationMarker;