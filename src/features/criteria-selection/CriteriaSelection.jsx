import React from 'react';
import { useCriteria } from '../../context/CriteriaContext';

/**
 * Criteria selection component
 */
const CriteriaSelection = ({ isLoading }) => {
  const { selectedCriteria, updateCriteria } = useCriteria();
  
  // All available criteria with their display information
  const availableCriteria = [
    { id: 'transportation', label: 'Transportation Access', emoji: '🚌', defaultChecked: false },
    { id: 'greenSpaces', label: 'Green Spaces', emoji: '🌳', defaultChecked: false },
    { id: 'education', label: 'Educational Facilities', emoji: '🏫', defaultChecked: false },
    { id: 'healthcare', label: 'Healthcare Facilities', emoji: '🏥', defaultChecked: false },
    { id: 'shopping', label: 'Shopping & Daily Necessities', emoji: '🛒', defaultChecked: false },
    { id: 'foodDining', label: 'Food & Dining', emoji: '🍽️', defaultChecked: false },
    { id: 'recreationSports', label: 'Recreation & Sports', emoji: '🏊', defaultChecked: false },
    { id: 'cultural', label: 'Cultural Amenities', emoji: '🎭', defaultChecked: false }
  ];

  const handleCriteriaToggle = (criteriaId) => {
    const updatedCriteria = { ...selectedCriteria };
    updatedCriteria[criteriaId] = !updatedCriteria[criteriaId];
    updateCriteria(updatedCriteria);
  };

  return (
    <div className="criteria-selection">
      <h3 style={{ marginBottom: '0.75rem' }}>Scoring Criteria</h3>
      <div className="criteria-options">
        {availableCriteria.map((criteria) => (
          <div key={criteria.id} className="criteria-option">
            <label 
              className={`criteria-label ${selectedCriteria[criteria.id] ? 'selected' : ''}`}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0.5rem',
                marginBottom: '0.5rem',
                backgroundColor: selectedCriteria[criteria.id] ? '#e6effd' : '#f5f5f5',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                border: `1px solid ${selectedCriteria[criteria.id] ? '#aac8f0' : '#e0e0e0'}`
              }}
            >
              <input
                type="checkbox"
                checked={selectedCriteria[criteria.id]}
                onChange={() => handleCriteriaToggle(criteria.id)}
                disabled={isLoading}
                style={{ marginRight: '0.5rem' }}
              />
              <span style={{ marginRight: '0.5rem' }}>{criteria.emoji}</span>
              {criteria.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CriteriaSelection;