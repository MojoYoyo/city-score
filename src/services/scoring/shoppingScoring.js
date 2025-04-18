import { calculateDistance } from '../utils/distanceCalculation';

// Distances in meters for score calculations
const DISTANCES = [250, 500, 750, 1000];

/**
 * Calculate shopping score for a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Array} shoppingFacilities - Array of shopping facilities
 * @returns {Object} - Score result
 */
export const calculateShoppingScore = (lat, lng, shoppingFacilities) => {
  // If no data is available, return null
  if (!shoppingFacilities || shoppingFacilities.length === 0) {
    return null;
  }

  // Group facilities by type
  const facilitiesByType = {
    supermarket: [],
    convenience: [],
    mall: [],
    market: []
  };

  // Count facilities by type and distance
  const counts = {
    supermarket: { total: 0, byDistance: [0, 0, 0, 0] },
    convenience: { total: 0, byDistance: [0, 0, 0, 0] },
    mall: { total: 0, byDistance: [0, 0, 0, 0] },
    market: { total: 0, byDistance: [0, 0, 0, 0] }
  };

  // Process each facility
  shoppingFacilities.forEach(facility => {
    // Skip if missing type or coordinates
    if (!facility.type || !facility.latitude || !facility.longitude) return;

    // Calculate distance if not already provided
    const distance = facility.distance || 
      calculateDistance(lat, lng, facility.latitude, facility.longitude);
    
    // Add to appropriate group
    if (facilitiesByType[facility.type]) {
      facilitiesByType[facility.type].push({ ...facility, distance });
      
      // Update counts
      counts[facility.type].total++;
      
      // Count by distance bands
      for (let i = 0; i < DISTANCES.length; i++) {
        if (distance <= DISTANCES[i]) {
          counts[facility.type].byDistance[i]++;
        }
      }
    }
  });

  // Calculate scores for each type
  // Using weighted scoring based on type, size and distance
  const typeWeights = {
    supermarket: 2.0,
    convenience: 1.0,
    mall: 2.5,
    market: 1.5
  };
  
  // Distance weights decrease with distance
  const distanceWeights = [1.0, 0.7, 0.4, 0.2];
  
  // Size weights
  const sizeWeights = {
    small: 0.7,
    medium: 1.0,
    large: 1.5
  };
  
  // Calculate score for each type
  const scoreByType = {};
  let rawScore = 0;
  
  Object.keys(facilitiesByType).forEach(type => {
    let typeScore = 0;
    
    facilitiesByType[type].forEach(facility => {
      // Calculate distance band
      let distanceBand = 3; // Default to the furthest band
      for (let i = 0; i < DISTANCES.length; i++) {
        if (facility.distance <= DISTANCES[i]) {
          distanceBand = i;
          break;
        }
      }
      
      // Apply size modifier if available
      const sizeModifier = facility.size && sizeWeights[facility.size] 
        ? sizeWeights[facility.size] 
        : 1.0;
      
      // Add weighted score for this facility
      typeScore += typeWeights[type] * distanceWeights[distanceBand] * sizeModifier;
    });
    
    scoreByType[type] = typeScore;
    rawScore += typeScore;
  });
  
  // Calculate the final score on a 0-100 scale
  let totalScore = 0;
  
  if (rawScore > 0) {
    // Apply scaling formula to get a score between 0-100
    totalScore = Math.min(100, Math.round(Math.log10(rawScore + 1) * 35));
  }
  
  // Return the comprehensive scoring result
  return {
    totalScore,
    rawScore,
    breakdown: {
      byType: scoreByType,
      counts
    }
  };
};