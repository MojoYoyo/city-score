import React from 'react';
import { useLocation } from '../../context/LocationContext';
import { useData } from '../../context/DataContext';
import { 
  getScoreColor, 
  getScoreDescription, 
  getCriteriaIcon 
} from '../../services/utils/formatters';

/**
 * Summary view component for combined score
 */
const SummaryView = () => {
  const { selectedLocation } = useLocation();
  const { scores } = useData();

  if (!scores || !scores.combined || !selectedLocation) {
    return null;
  }

  // Format address name
  const formatAddress = (address) => {
    // Trim to reasonable length
    if (address.length > 60) {
      return address.substring(0, 57) + '...';
    }
    return address;
  };

  // Get scores for all criteria
  const criteriaTiles = Object.entries(scores)
    .filter(([key]) => key !== 'combined')
    .map(([key, value]) => {
      if (!value) return null;
      
      // Get friendly name for criteria
      const criteriaName = {
        'transportation': 'Transportation',
        'greenSpaces': 'Green Spaces',
        'education': 'Education',
        'healthcare': 'Healthcare',
        'shopping': 'Shopping',
        'foodDining': 'Food & Dining',
        'recreationSports': 'Sport',
        'cultural': 'Cultural'
      }[key] || key;
      
      return (
        <div key={key} className="criteria-tile" style={{
          flex: '1 0 calc(50% - 0.5rem)',
          padding: '0.75rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ 
            fontSize: '1.5rem', 
            marginBottom: '0.25rem' 
          }}>
            {getCriteriaIcon(key)}
          </div>
          <div style={{ 
            fontWeight: 'bold',
            fontSize: '0.9rem',
            marginBottom: '0.25rem'
          }}>
            {criteriaName}
          </div>
          <div style={{ 
            fontSize: '1.3rem', 
            fontWeight: 'bold',
            color: getScoreColor(value.totalScore)
          }}>
            {value.totalScore}
          </div>
          <div style={{ 
            fontSize: '0.8rem',
            color: '#666'
          }}>
            {getScoreDescription(value.totalScore, key)}
          </div>
        </div>
      );
  }).filter(Boolean);

  return (
    <div className="summary-view">
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Location Summary</h3>
        <div style={{ 
          fontSize: '0.9rem', 
          color: '#666',
          wordBreak: 'break-word'
        }}>
          {formatAddress(selectedLocation.name)}
        </div>
      </div>
      
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        {/* Overall score circle */}
        <div style={{ 
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: getScoreColor(scores.combined.totalScore),
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginRight: '1rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {scores.combined.totalScore}
        </div>
        
        {/* Overall score description */}
        <div>
          <div style={{ 
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            Overall Score
          </div>
          <div style={{ 
            color: getScoreColor(scores.combined.totalScore),
            fontWeight: 'bold'
          }}>
            {getScoreDescription(scores.combined.totalScore, 'combined')}
          </div>
          <div style={{ 
            fontSize: '0.8rem',
            color: '#666',
            marginTop: '0.25rem'
          }}>
            Based on {scores.combined.contributingFactors} criteria
          </div>
        </div>
      </div>
      
      {/* Individual criteria tiles */}
      <div style={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        {criteriaTiles}
      </div>
      
      <div style={{ 
        marginTop: '1rem',
        fontSize: '0.8rem',
        color: '#666',
        backgroundColor: '#f5f5f5',
        padding: '0.75rem',
        borderRadius: '4px'
      }}>
        <strong>Note:</strong> All scores are on a 0-100 scale.
      </div>
    </div>
  );
};

export default SummaryView;