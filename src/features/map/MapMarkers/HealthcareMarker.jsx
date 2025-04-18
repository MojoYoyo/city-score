import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getHealthcareIcon } from '../../../services/utils/formatters';

/**
 * Healthcare marker component for the map
 */
const HealthcareMarker = ({ marker }) => {
  // Create a custom icon based on healthcare type
  const createIcon = () => {
    // Configuration based on healthcare type
    const iconConfig = {
      hospital: {
        color: '#e63946', // Red
        size: 14,
        borderColor: 'white',
        borderWidth: 2
      },
      clinic: {
        color: '#e76f51', // Orange-Red
        size: 12,
        borderColor: 'white',
        borderWidth: 1
      },
      doctor: {
        color: '#f4a261', // Orange
        size: 10,
        borderColor: 'white',
        borderWidth: 1
      },
      pharmacy: {
        color: '#2a9d8f', // Teal
        size: 10,
        borderColor: 'white',
        borderWidth: 1
      }
    };
    
    // Get the appropriate icon config or use default
    const config = iconConfig[marker.type] || {
      color: '#e63946',
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
      className: 'healthcare-icon',
      iconSize: [config.size, config.size],
      iconAnchor: [config.size/2, config.size/2]
    });
  };
  
  // Format popup content
  const getPopupContent = () => {
    // Get user-friendly name for the type
    const typeDisplay = marker.type.charAt(0).toUpperCase() + marker.type.slice(1);
    
    return (
      <div style={{ maxWidth: '250px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{marker.name}</h3>
        <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Type:</strong> {typeDisplay}</p>
        
        {marker.emergency && (
          <p style={{ margin: '4px 0', fontSize: '14px', color: '#e63946' }}>
            <strong>Emergency Service Available</strong>
          </p>
        )}
        
        {marker.speciality && (
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Speciality:</strong> {marker.speciality}
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

export default HealthcareMarker;