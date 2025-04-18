import React, { createContext, useState, useContext } from 'react';

// Create context
const CriteriaContext = createContext();

// Default criteria state
const DEFAULT_CRITERIA = {
  transportation: false,
  greenSpaces: false,
  education: false,
  healthcare: false,
  shopping: false,
  foodDining: false,
  recreationSports: false,
  cultural: false
};

/**
 * Provider component for criteria selection
 */
export const CriteriaProvider = ({ children }) => {
  const [selectedCriteria, setSelectedCriteria] = useState(DEFAULT_CRITERIA);

  // Update criteria
  const updateCriteria = (criteria) => {
    setSelectedCriteria(criteria);
  };

  // Toggle a single criterion
  const toggleCriterion = (criterionId) => {
    setSelectedCriteria(prev => ({
      ...prev,
      [criterionId]: !prev[criterionId]
    }));
  };

  // Reset to default criteria
  const resetCriteria = () => {
    setSelectedCriteria(DEFAULT_CRITERIA);
  };

  // Context value
  const value = {
    selectedCriteria,
    updateCriteria,
    toggleCriterion,
    resetCriteria
  };

  return (
    <CriteriaContext.Provider value={value}>
      {children}
    </CriteriaContext.Provider>
  );
};

/**
 * Custom hook to use the criteria context
 */
export const useCriteria = () => {
  const context = useContext(CriteriaContext);
  if (context === undefined) {
    throw new Error('useCriteria must be used within a CriteriaProvider');
  }
  return context;
};