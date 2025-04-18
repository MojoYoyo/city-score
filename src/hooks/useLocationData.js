import { useState, useCallback } from 'react';
import { 
  fetchTransportationStops,
  fetchGreenSpaces,
  fetchEducationalInstitutions,
  fetchHealthcareFacilities,
  fetchShoppingFacilities,
  fetchFoodDiningFacilities,
  fetchRecreationSportsFacilities,
  fetchCulturalAmenities
} from '../api';
import {
  calculateTransportationScore,
  calculateGreenSpacesScore,
  calculateEducationScore,
  calculateHealthcareScore,
  calculateShoppingScore,
  calculateFoodDiningScore,
  calculateRecreationSportsScore,
  calculateCulturalScore,
  calculateCombinedScore
} from '../services/scoring';

/**
 * Custom hook to fetch and manage location data and scores
 * @returns {Object} Location data, scores, and fetch functions
 */
export const useLocationData = () => {
  const [locationData, setLocationData] = useState({});
  const [scores, setScores] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch data for a selected location based on criteria
   * @param {Object} location - Selected location with coordinates
   * @param {Object} criteria - Selected criteria flags
   */
  const fetchData = useCallback(async (location, criteria) => {
    if (!location) {
      setLocationData({});
      setScores(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [lat, lng] = location.coordinates;
      console.log(`Fetching data for ${location.name} at [${lat}, ${lng}]`);
      
      // Prepare object to hold all fetched data
      const fetchedData = {};
      
      // Fetch data based on selected criteria
      if (criteria.transportation) {
        console.log('Fetching transportation data...');
        const transportStops = await fetchTransportationStops(lat, lng, 1000);
        // Filter out entries without proper type information
        fetchedData.transportation = transportStops.filter(stop => 
          stop.type && stop.type !== 'unknown' && 
          typeof stop.latitude === 'number' && 
          typeof stop.longitude === 'number'
        );
      }
      
      if (criteria.greenSpaces) {
        console.log('Fetching green spaces data...');
        const greenSpaces = await fetchGreenSpaces(lat, lng, 1000);
        fetchedData.greenSpaces = greenSpaces.filter(space => 
          space.type && space.type !== 'unknown' && 
          typeof space.latitude === 'number' && 
          typeof space.longitude === 'number'
        );
      }
      
      if (criteria.education) {
        console.log('Fetching educational institutions data...');
        const education = await fetchEducationalInstitutions(lat, lng, 1000);
        fetchedData.education = education.filter(inst => 
          inst.type && inst.type !== 'unknown' && 
          typeof inst.latitude === 'number' && 
          typeof inst.longitude === 'number'
        );
      }
      
      if (criteria.healthcare) {
        console.log('Fetching healthcare facilities data...');
        const healthcare = await fetchHealthcareFacilities(lat, lng, 1000);
        fetchedData.healthcare = healthcare.filter(facility => 
          facility.type && facility.type !== 'unknown' && 
          typeof facility.latitude === 'number' && 
          typeof facility.longitude === 'number'
        );
      }
      
      if (criteria.shopping) {
        console.log('Fetching shopping facilities data...');
        const shopping = await fetchShoppingFacilities(lat, lng, 1000);
        fetchedData.shopping = shopping.filter(facility => 
          facility.type && facility.type !== 'unknown' && 
          typeof facility.latitude === 'number' && 
          typeof facility.longitude === 'number'
        );
      }
      
      if (criteria.foodDining) {
        console.log('Fetching food & dining facilities data...');
        const foodDining = await fetchFoodDiningFacilities(lat, lng, 1000);
        fetchedData.foodDining = foodDining.filter(facility => 
          facility.type && facility.type !== 'unknown' && 
          typeof facility.latitude === 'number' && 
          typeof facility.longitude === 'number'
        );
      }
      
      if (criteria.recreationSports) {
        console.log('Fetching recreation & sports facilities data...');
        const recreationSports = await fetchRecreationSportsFacilities(lat, lng, 1000);
        fetchedData.recreationSports = recreationSports.filter(facility => 
          facility.type && facility.type !== 'unknown' && 
          typeof facility.latitude === 'number' && 
          typeof facility.longitude === 'number'
        );
      }
      
      if (criteria.cultural) {
        console.log('Fetching cultural amenities data...');
        const cultural = await fetchCulturalAmenities(lat, lng, 1000);
        fetchedData.cultural = cultural.filter(amenity => 
          amenity.type && amenity.type !== 'unknown' && 
          typeof amenity.latitude === 'number' && 
          typeof amenity.longitude === 'number'
        );
      }
      
      // Update the data state
      setLocationData(prevData => ({
        ...prevData,
        ...fetchedData
      }));
      
      // Calculate scores for all criteria
      calculateScores(lat, lng, fetchedData, criteria);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
      setLocationData({});
      setScores(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Calculate scores for all active criteria
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {Object} fetchedData - Fetched location data
   * @param {Object} criteria - Selected criteria flags
   */
  const calculateScores = (lat, lng, fetchedData, criteria) => {
    console.log('Calculating scores for selected criteria...');
    
    // Initialize scores object
    const calculatedScores = {};
    
    // Calculate scores for each active criterion
    if (criteria.transportation && fetchedData.transportation) {
      calculatedScores.transportation = calculateTransportationScore(lat, lng, fetchedData.transportation);
    }
    
    if (criteria.greenSpaces && fetchedData.greenSpaces) {
      calculatedScores.greenSpaces = calculateGreenSpacesScore(lat, lng, fetchedData.greenSpaces);
    }
    
    if (criteria.education && fetchedData.education) {
      calculatedScores.education = calculateEducationScore(lat, lng, fetchedData.education);
    }
    
    if (criteria.healthcare && fetchedData.healthcare) {
      calculatedScores.healthcare = calculateHealthcareScore(lat, lng, fetchedData.healthcare);
    }
    
    if (criteria.shopping && fetchedData.shopping) {
      calculatedScores.shopping = calculateShoppingScore(lat, lng, fetchedData.shopping);
    }
    
    if (criteria.foodDining && fetchedData.foodDining) {
      calculatedScores.foodDining = calculateFoodDiningScore(lat, lng, fetchedData.foodDining);
    }
    
    if (criteria.recreationSports && fetchedData.recreationSports) {
      calculatedScores.recreationSports = calculateRecreationSportsScore(lat, lng, fetchedData.recreationSports);
    }
    
    if (criteria.cultural && fetchedData.cultural) {
      calculatedScores.cultural = calculateCulturalScore(lat, lng, fetchedData.cultural);
    }
    
    // Calculate combined score if we have any individual scores
    const activeScores = Object.keys(calculatedScores).filter(key => calculatedScores[key] !== null);
    if (activeScores.length > 0) {
      calculatedScores.combined = calculateCombinedScore(calculatedScores, criteria);
    }
    
    console.log('Calculated scores:', calculatedScores);
    
    // Update scores state
    setScores(calculatedScores);
  };

  return {
    locationData,
    scores,
    fetchData,
    isLoading,
    error
  };
};