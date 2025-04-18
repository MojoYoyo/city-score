import React, { useState } from 'react';
import { useCriteria } from '../../context/CriteriaContext';

/**
 * Map legend component
 */
const MapLegend = () => {
  const { selectedCriteria } = useCriteria();
  const [collapsed, setCollapsed] = useState(false);

  // Legend data for each criteria type
  const legendItems = {
    transportation: [
      { label: 'Metro Station', color: '#C60C30', shape: 'circle', size: 14 },
      { label: 'Train Station', color: '#1E3A8A', shape: 'circle', size: 14 },
      { label: 'Tram Stop', color: '#059669', shape: 'circle', size: 12 },
      { label: 'Bus Stop', color: '#F59E0B', shape: 'circle', size: 10 },
    ],
    greenSpaces: [
      { label: 'Park', color: '#22c55e', shape: 'circle', size: 12 },
      { label: 'Forest', color: '#15803d', shape: 'circle', size: 14 },
      { label: 'Garden', color: '#4ade80', shape: 'circle', size: 10 },
      { label: 'Playground', color: '#86efac', shape: 'circle', size: 8 },
      { label: 'Nature Reserve', color: '#166534', shape: 'circle', size: 14 },
    ],
    education: [
      { label: 'University', color: '#7e22ce', shape: 'circle', size: 14 },
      { label: 'College', color: '#9333ea', shape: 'circle', size: 12 },
      { label: 'School', color: '#a855f7', shape: 'circle', size: 10 },
      { label: 'Kindergarten', color: '#c084fc', shape: 'circle', size: 8 },
      { label: 'Library', color: '#581c87', shape: 'circle', size: 10 },
    ],
    healthcare: [
      { label: 'Hospital', color: '#e63946', shape: 'circle', size: 14 },
      { label: 'Clinic', color: '#e76f51', shape: 'circle', size: 12 },
      { label: 'Doctor', color: '#f4a261', shape: 'circle', size: 10 },
      { label: 'Pharmacy', color: '#2a9d8f', shape: 'circle', size: 10 },
    ],
    shopping: [
      { label: 'Supermarket', color: '#ff9500', shape: 'circle', size: 14 },
      { label: 'Convenience Store', color: '#ffcc00', shape: 'circle', size: 10 },
      { label: 'Shopping Mall', color: '#ff2d55', shape: 'circle', size: 16 },
      { label: 'Market', color: '#34c759', shape: 'circle', size: 12 },
    ],
    foodDining: [
      { label: 'Restaurant', color: '#8a2be2', shape: 'circle', size: 12 },
      { label: 'Cafe', color: '#964b00', shape: 'circle', size: 10 },
      { label: 'Pub', color: '#663399', shape: 'circle', size: 12 },
      { label: 'Fast Food', color: '#ff5f1f', shape: 'circle', size: 10 },
    ],
    recreationSports: [
      { label: 'Sports Center', color: '#007aff', shape: 'circle', size: 14 },
      { label: 'Swimming Pool', color: '#5ac8fa', shape: 'circle', size: 12 },
      { label: 'Fitness Center', color: '#af52de', shape: 'circle', size: 12 },
      { label: 'Sports Field', color: '#34c759', shape: 'circle', size: 12 },
      { label: 'Tennis Court', color: '#ffcc00', shape: 'circle', size: 10 },
    ],
    cultural: [
      { label: 'Museum', color: '#8e44ad', shape: 'circle', size: 12 },
      { label: 'Theater', color: '#e74c3c', shape: 'circle', size: 12 },
      { label: 'Cinema', color: '#d35400', shape: 'circle', size: 12 },
      { label: 'Art Gallery', color: '#16a085', shape: 'circle', size: 10 },
    ],
  };

  // Only show sections that are active based on selected criteria
  const activeSections = Object.keys(selectedCriteria).filter(
    (key) => selectedCriteria[key]
  );

  // If there are no active criteria or the legend is collapsed, show minimal UI
  if (activeSections.length === 0 || collapsed) {
    return (
      <div className="map-legend">
        <div className="legend-title">
          <span>Map Legend</span>
          <button 
            className="legend-toggle" 
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand legend" : "Collapse legend"}
          >
            {collapsed ? '▼' : '▲'}
          </button>
        </div>
        {collapsed && <div style={{ fontSize: '10px' }}>Click to expand</div>}
      </div>
    );
  }

  // Helper function to get more readable section names
  const getSectionTitle = (key) => {
    switch (key) {
      case 'transportation':
        return 'Transportation';
      case 'greenSpaces':
        return 'Green Spaces';
      case 'education':
        return 'Education';
      case 'healthcare':
        return 'Healthcare';
      case 'shopping':
        return 'Shopping';
      case 'foodDining':
        return 'Food & Dining';
      case 'recreationSports':
        return 'Recreation & Sports';
      case 'cultural':
        return 'Cultural';
      default:
        return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  return (
    <div className="map-legend">
      <div className="legend-title">
        <span>Map Legend</span>
        <button 
          className="legend-toggle" 
          onClick={() => setCollapsed(!collapsed)}
          title="Collapse legend"
        >
          ▲
        </button>
      </div>

      {activeSections.map((section) => (
        <div key={section} className="legend-section">
          <div className="legend-section-title">{getSectionTitle(section)}</div>
          {legendItems[section]?.map((item, index) => (
            <div key={`${section}-${index}`} className="legend-item">
              <div
                className={`legend-icon ${item.shape === 'square' ? 'square' : ''}`}
                style={{
                  backgroundColor: item.color,
                  width: `${item.size * 0.85}px`,
                  height: `${item.size * 0.85}px`,
                  border: '1px solid white',
                  boxShadow: '0 0 1px rgba(0,0,0,0.3)',
                }}
              ></div>
              <div className="legend-label">{item.label}</div>
            </div>
          ))}
        </div>
      ))}

      <div style={{ marginTop: '8px', fontSize: '10px', color: '#666' }}>
        <span>⊙ Selected location</span>
        <br />
        <span>○ Distance indicators: 250m, 500m, 1000m</span>
      </div>
    </div>
  );
};

export default MapLegend;