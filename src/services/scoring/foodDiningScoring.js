import { calculateDistance } from '../utils/distanceCalculation';

// Distances in meters for score calculations
const DISTANCES = [250, 500, 750, 1000];

/**
 * Calculate food & dining score for a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Array} foodDiningFacilities - Array of food & dining facilities
 * @returns {Object} - Score result
 */
export const calculateFoodDiningScore = (lat, lng, foodDiningFacilities) => {
  // If no data is available, return null
  if (!foodDiningFacilities || foodDiningFacilities.length === 0) {
    return null;
  }

  // Group facilities by type
  const facilitiesByType = {
    restaurant: [],
    cafe: [],
    pub: [],
    fast_food: []
  };

  // Count facilities by type and distance
  const counts = {
    restaurant: { total: 0, byDistance: [0, 0, 0, 0] },
    cafe: { total: 0, byDistance: [0, 0, 0, 0] },
    pub: { total: 0, byDistance: [0, 0, 0, 0] },
    fast_food: { total: 0, byDistance: [0, 0, 0, 0] }
  };

  // Process each facility
  foodDiningFacilities.forEach(facility => {
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
  // Using weighted scoring based on type and distance
  const typeWeights = {
    restaurant: 1.8,
    cafe: 1.5,
    pub: 1.2,
    fast_food: 1
  };
  
  // Distance weights decrease with distance
  const distanceWeights = [1.0, 0.7, 0.4, 0.2];
  
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
      
      // Add weighted score for this facility
      let facilityScore = typeWeights[type] * distanceWeights[distanceBand];
      
      // Bonus for outdoor seating
      if (facility.outdoor_seating) {
        facilityScore *= 1.2;
      }
      
      // Bonus for variety of cuisines
      if (facility.cuisine && facility.type === 'restaurant') {
        facilityScore *= 1.1;
      }
      
      typeScore += facilityScore;
    });
    
    // Apply diminishing returns for many establishments of the same type
    if (counts[type].total > 5) {
      typeScore = typeScore * (1 + Math.log10(counts[type].total / 5) * 0.3);
    }
    
    scoreByType[type] = typeScore;
    rawScore += typeScore;
  });
  
  // Calculate the final score on a 0-100 scale
  let totalScore = 0;
  
  if (rawScore > 0) {
    // Apply scaling formula to get a score between 0-100
    totalScore = Math.min(100, Math.round(Math.log10(rawScore + 1) * 50));
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