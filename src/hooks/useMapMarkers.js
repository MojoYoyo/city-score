import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useCriteria } from '../context/CriteriaContext';

/**
 * Custom hook to generate map markers based on available data and selected criteria
 * @returns {Array} Formatted markers for the map
 */
export const useMapMarkers = () => {
  const { locationData } = useData();
  const { selectedCriteria } = useCriteria();
  
  // Generate markers based on location data and selected criteria
  const markers = useMemo(() => {
    const allMarkers = [];
    
    // Add transportation stops if available
    if (locationData.transportation && selectedCriteria.transportation) {
      allMarkers.push(...locationData.transportation.map(stop => ({
        ...stop,
        markerType: 'transportation'
      })));
    }
    
    // Add green spaces if available
    if (locationData.greenSpaces && selectedCriteria.greenSpaces) {
      allMarkers.push(...locationData.greenSpaces.map(space => ({
        ...space,
        markerType: 'greenSpace'
      })));
    }
    
    // Add educational institutions if available
    if (locationData.education && selectedCriteria.education) {
      allMarkers.push(...locationData.education.map(inst => ({
        ...inst,
        markerType: 'education'
      })));
    }
    
    // Add healthcare facilities if available
    if (locationData.healthcare && selectedCriteria.healthcare) {
      allMarkers.push(...locationData.healthcare.map(facility => ({
        ...facility,
        markerType: 'healthcare'
      })));
    }
    
    // Add shopping facilities if available
    if (locationData.shopping && selectedCriteria.shopping) {
      allMarkers.push(...locationData.shopping.map(facility => ({
        ...facility,
        markerType: 'shopping'
      })));
    }
    
    // Add food & dining facilities if available
    if (locationData.foodDining && selectedCriteria.foodDining) {
      allMarkers.push(...locationData.foodDining.map(facility => ({
        ...facility,
        markerType: 'foodDining'
      })));
    }
    
    // Add recreation & sports facilities if available
    if (locationData.recreationSports && selectedCriteria.recreationSports) {
      allMarkers.push(...locationData.recreationSports.map(facility => ({
        ...facility,
        markerType: 'recreationSports'
      })));
    }
    
    // Add cultural amenities if available
    if (locationData.cultural && selectedCriteria.cultural) {
      allMarkers.push(...locationData.cultural.map(amenity => ({
        ...amenity,
        markerType: 'cultural'
      })));
    }
    
    return allMarkers;
  }, [locationData, selectedCriteria]);
  
  return markers;
};