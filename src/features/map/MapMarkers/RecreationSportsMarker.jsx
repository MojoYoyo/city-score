import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getRecreationSportsIcon } from '../../../services/utils/formatters';

/**
 * Recreation & Sports marker component for the map
 */
const RecreationSportsMarker = ({ marker }) => {
  // Create a custom icon based on recreation & sports type
  const createIcon = () => {
    // Configuration based on recreation & sports type
    const iconConfig = {
      sports_centre: {
        color: '#007aff', // Blue
        size: 14,
        borderColor: 'white',
        borderWidth: 1
      },
      swimming_pool: {
        color: '#5ac8fa', // Light blue
        size: 12,
        borderColor: 'white',
        borderWidth: 1
      },
      fitness_centre: {
        color: '#af52de', // Purple
        size: 12,
        borderColor: 'white',
        borderWidth: 1
      },
      pitch: {
        color: '#34c759', // Green
        size: 12,
        borderColor: 'white',
        borderWidth: 1
      },
      tennis: {
        color: '#ffcc00', // Yellow
        size: 10,
        borderColor: 'white',
        borderWidth: 1
      }
    };
    
    // Get the appropriate icon config or use default
    const config = iconConfig[marker.type] || {
      color: '#007aff',
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
      className: 'recreation-sports-icon',
      iconSize: [config.size, config.size],
      iconAnchor: [config.size/2, config.size/2]
    });
  };
  
  // Format popup content
  const getPopupContent = () => {
    // Get user-friendly name for the type
    const typeDisplay = {
      'sports_centre': 'Sports Center',
      'swimming_pool': 'Swimming Pool',
      'fitness_centre': 'Fitness Center',
      'pitch': 'Sports Field',
      'tennis': 'Tennis Court'
    }[marker.type] || marker.type.charAt(0).toUpperCase() + marker.type.slice(1).replace('_', ' ');
    
    return (
      <div style={{ maxWidth: '250px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{marker.name}</h3>
        <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Type:</strong> {typeDisplay}</p>
        
        {marker.sport && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Sport:</strong> {marker.sport.charAt(0).toUpperCase() + marker.sport.slice(1)}
          </p>
        )}
        
        {marker.indoor !== undefined && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Indoor:</strong> {marker.indoor ? 'Yes' : 'No'}
          </p>
        )}
        
        {marker.access && marker.access !== 'unknown' && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Access:</strong> {marker.access.charAt(0).toUpperCase() + marker.access.slice(1)}
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

export default RecreationSportsMarker;