import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from './LocationContext';
import { useCriteria } from './CriteriaContext';
import { useLocationData } from '../hooks/useLocationData';

// Create context
const DataContext = createContext();

/**
 * Provider component for location data and scores
 */
export const DataProvider = ({ children }) => {
  const { selectedLocation } = useLocation();
  const { selectedCriteria } = useCriteria();
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch location data using custom hook
  const { 
    locationData, 
    scores, 
    fetchData, 
    isLoading: dataLoading, 
    error 
  } = useLocationData();
  
  // Update loading state based on data loading
  useEffect(() => {
    setIsLoading(dataLoading);
  }, [dataLoading]);
  
  // Fetch data when location or criteria change
  useEffect(() => {
    if (selectedLocation) {
      fetchData(selectedLocation, selectedCriteria);
    }
  }, [selectedLocation, selectedCriteria, fetchData]);
  
  // Context value
  const value = {
    locationData,
    scores,
    isLoading,
    error
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

/**
 * Custom hook to use the data context
 */
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};