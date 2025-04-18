import React from 'react';
import { getScoreColor } from '../../services/utils/formatters';

/**
 * Score visualization component
 */
const ScoreVisualization = ({ score, criteriaType }) => {
  if (!score) return null;

  // Calculate the percentage fill for the bar
  const percentage = score;
  const barColor = getScoreColor(score);

  // Create score segments for the visualization
  const segments = [
    { min: 0, max: 20, label: 'Poor', color: '#dc2626' },
    { min: 20, max: 40, label: 'Low', color: '#ea580c' },
    { min: 40, max: 60, label: 'Medium', color: '#ca8a04' },
    { min: 60, max: 80, label: 'Good', color: '#65a30d' },
    { min: 80, max: 100, label: 'Excellent', color: '#15803d' }
  ];

  const segmentLabels = ['Poor', 'Low', 'Medium', 'Good', 'Excellent'];

  return (
    <div className="score-visualization" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
      {/* Score gradient bar */}
      <div style={{ position: 'relative', height: '12px', backgroundColor: '#e5e7eb', borderRadius: '6px', overflow: 'hidden', marginBottom: '0.5rem' }}>
        {/* Colored segments */}
        <div style={{ 
          display: 'flex', 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}>
          {segments.map((segment, i) => (
            <div 
              key={i}
              style={{ 
                flex: segment.max - segment.min, 
                backgroundColor: segment.color,
                opacity: 0.3
              }}
            />
          ))}
        </div>
        
        {/* Progress indicator */}
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${percentage}%`,
          backgroundColor: barColor,
          borderRadius: '6px',
          transition: 'width 0.5s ease'
        }} />
        
        {/* Score marker */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: `${percentage}%`,
          transform: 'translate(-50%, -50%)',
          width: '14px',
          height: '14px',
          backgroundColor: 'white',
          border: `3px solid ${barColor}`,
          borderRadius: '50%',
          zIndex: 2
        }} />
      </div>
      
      {/* Segment labels */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        fontSize: '0.7rem',
        color: '#666'
      }}>
        {segmentLabels.map((label, i) => (
          <div key={i} style={{ textAlign: i === 0 ? 'left' : i === 4 ? 'right' : 'center' }}>
            {label}
          </div>
        ))}
      </div>
      
      {/* Score explanation */}
      <div style={{ 
        fontSize: '0.8rem',
        marginTop: '0.5rem',
        padding: '0.5rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '4px',
        textAlign: 'center'
      }}>
        <span>
          <strong>{criteriaType === 'transportation' ? 'Transportation' : 
                  criteriaType === 'greenSpaces' ? 'Green Space' : 
                  criteriaType === 'education' ? 'Education' : 'Overall'} Score:</strong> {' '}
          {score < 30 ? 'Limited access or availability.' : 
           score < 50 ? 'Basic access or availability.' : 
           score < 70 ? 'Good access or availability.' : 
           score < 85 ? 'Very good access or availability.' : 'Excellent access or availability.'}
        </span>
      </div>
    </div>
  );
};

export default ScoreVisualization;