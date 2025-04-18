import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getEducationIcon } from '../../../services/utils/formatters';

/**
 * Education marker component for the map
 */
const EducationMarker = ({ marker }) => {
  // Create a custom icon based on educational institution type
  const createIcon = () => {
    // Configuration based on institution type
    const iconConfig = {
      university: {
        color: '#7e22ce', // Purple
        size: 14,
        borderColor: 'white',
        borderWidth: 2
      },
      college: {
        color: '#9333ea', // Light purple
        size: 12,
        borderColor: 'white',
        borderWidth: 1
      },
      school: {
        color: '#a855f7', // Very light purple
        size: 10,
        borderColor: 'white',
        borderWidth: 1
      },
      kindergarten: {
        color: '#c084fc', // Lavender
        size: 8,
        borderColor: 'white',
        borderWidth: 1
      },
      library: {
        color: '#581c87', // Very dark purple
        size: 10,
        borderColor: 'white',
        borderWidth: 1
      }
    };
    
    // Get the appropriate icon config or use default
    const config = iconConfig[marker.type] || iconConfig.school;
    
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
      className: 'education-icon',
      iconSize: [config.size, config.size],
      iconAnchor: [config.size/2, config.size/2]
    });
  };
  
  // Format popup content
  const getPopupContent = () => {
    // Get user-friendly name for the type
    const typeDisplay = marker.type.charAt(0).toUpperCase() + 
      marker.type.slice(1).replace('_', ' ');
    
    return (
      <div style={{ maxWidth: '250px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{marker.name}</h3>
        <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Type:</strong> {typeDisplay}</p>
        
        {marker.level && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Level:</strong> {marker.level.charAt(0).toUpperCase() + marker.level.slice(1)}
          </p>
        )}
        
        {marker.operator && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Operator:</strong> {marker.operator}
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

export default EducationMarker;