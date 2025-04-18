import React, { createContext, useState, useContext } from 'react';

// Create context
const LocationContext = createContext();

/**
 * Provider component for location data
 */
export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Select a new location
  const selectLocation = (location) => {
    setSelectedLocation(location);
  };

  // Clear the selected location
  const clearLocation = () => {
    setSelectedLocation(null);
  };

  // Context value
  const value = {
    selectedLocation,
    selectLocation,
    clearLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

/**
 * Custom hook to use the location context
 */
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};