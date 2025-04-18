import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getCulturalIcon } from '../../../services/utils/formatters';

/**
 * Cultural marker component for the map
 */
const CulturalMarker = ({ marker }) => {
  // Create a custom icon based on cultural amenity type
  const createIcon = () => {
    // Configuration based on cultural amenity type
    const iconConfig = {
      museum: {
        color: '#8e44ad', // Purple
        size: 12,
        borderColor: 'white',
        borderWidth: 1
      },
      theatre: {
        color: '#e74c3c', // Red
        size: 12,
        borderColor: 'white',
        borderWidth: 1
      },
      cinema: {
        color: '#d35400', // Orange
        size: 12,
        borderColor: 'white',
        borderWidth: 1
      },
      gallery: {
        color: '#16a085', // Teal
        size: 10,
        borderColor: 'white',
        borderWidth: 1
      }
    };
    
    // Get the appropriate icon config or use default
    const config = iconConfig[marker.type] || {
      color: '#8e44ad',
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
      className: 'cultural-icon',
      iconSize: [config.size, config.size],
      iconAnchor: [config.size/2, config.size/2]
    });
  };
  
  // Format popup content
  const getPopupContent = () => {
    // Get user-friendly name for the type
    const typeDisplay = {
      'museum': 'Museum',
      'theatre': 'Theater',
      'cinema': 'Cinema',
      'gallery': 'Art Gallery'
    }[marker.type] || marker.type.charAt(0).toUpperCase() + marker.type.slice(1);
    
    return (
      <div style={{ maxWidth: '250px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{marker.name}</h3>
        <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Type:</strong> {typeDisplay}</p>
        
        {marker.theme && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Theme:</strong> {marker.theme.charAt(0).toUpperCase() + marker.theme.slice(1)}
          </p>
        )}
        
        {marker.website && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Website:</strong> <a href={marker.website} target="_blank" rel="noopener noreferrer">{marker.website}</a>
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

export default CulturalMarker;