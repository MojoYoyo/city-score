import React from 'react';
import { formatCulturalCounts, getCulturalIcon } from '../../../services/utils/formatters';

/**
 * Cultural score component
 */
const CulturalScore = ({ score }) => {
  if (!score) {
    return <p>Cultural score not available.</p>;
  }

  const formattedCounts = formatCulturalCounts(score.breakdown.counts);
  
  return (
    <div>
      {formattedCounts.length > 0 ? (
        <div>
          {formattedCounts.map((item, index) => (
            <div key={index} className="cultural-type">
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '6px' }}>{getCulturalIcon(item.type)}</span>
                <strong>{item.type}:</strong> {item.total}
              </span>
              <span style={{ color: '#666', fontSize: '13px' }}>
                <span title="Within 250m">{item.within250m}</span> / 
                <span title="Within 500m">{item.within500m}</span> / 
                <span title="Within 750m">{item.within750m}</span> / 
                <span title="Within 1000m">{item.within1000m}</span>
              </span>
            </div>
          ))}
          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#666', textAlign: 'right' }}>
            (counts by distance: 250m / 500m / 750m / 1000m)
          </div>
        </div>
      ) : (
        <p>No cultural amenities found within 1km.</p>
      )}
      
      <div style={{ marginTop: '1rem' }}>
        <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '6px', marginBottom: '12px' }}>
          Score Breakdown
        </h4>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {Object.entries(score.breakdown.byType).map(([type, value]) => {
            if (value <= 0) return null;
            
            // Get friendly name for the type
            const typeName = {
              'museum': 'Museum',
              'theatre': 'Theater',
              'cinema': 'Cinema',
              'gallery': 'Art Gallery'
            }[type] || type.charAt(0).toUpperCase() + type.slice(1);
            
            // Calculate percentage contribution to the total score
            const percentage = Math.round((value / score.rawScore) * 100);
            
            // Determine if this is the primary contributor to the score
            const isPrimary = percentage > 30;
            
            return (
              <li key={type} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '0.5rem',
                padding: '4px 0',
                fontWeight: isPrimary ? 'bold' : 'normal',
                color: isPrimary ? '#000' : undefined
              }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '6px' }}>{getCulturalIcon(typeName)}</span>
                  {typeName}
                </span>
                <span>
                  <strong>{Math.round(value * 10) / 10}</strong> points 
                  <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '4px' }}>
                    ({percentage}%)
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CulturalScore;