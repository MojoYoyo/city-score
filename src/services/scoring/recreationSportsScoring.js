import { calculateDistance } from '../utils/distanceCalculation';

// Distances in meters for score calculations
const DISTANCES = [250, 500, 750, 1000];

/**
 * Calculate recreation & sports score for a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Array} recreationSportsFacilities - Array of recreation & sports facilities
 * @returns {Object} - Score result
 */
export const calculateRecreationSportsScore = (lat, lng, recreationSportsFacilities) => {
  // If no data is available, return null
  if (!recreationSportsFacilities || recreationSportsFacilities.length === 0) {
    return null;
  }

  // Group facilities by type
  const facilitiesByType = {
    sports_centre: [],
    swimming_pool: [],
    fitness_centre: [],
    pitch: [],
    tennis: []
  };

  // Count facilities by type and distance
  const counts = {
    sports_centre: { total: 0, byDistance: [0, 0, 0, 0] },
    swimming_pool: { total: 0, byDistance: [0, 0, 0, 0] },
    fitness_centre: { total: 0, byDistance: [0, 0, 0, 0] },
    pitch: { total: 0, byDistance: [0, 0, 0, 0] },
    tennis: { total: 0, byDistance: [0, 0, 0, 0] }
  };

  // Process each facility
  recreationSportsFacilities.forEach(facility => {
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
    sports_centre: 2.0,
    swimming_pool: 1.8,
    fitness_centre: 1.5,
    pitch: 1.2,
    tennis: 1.0
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
      
      // Bonus for public access
      if (facility.access === 'public') {
        facilityScore *= 1.3;
      }
      
      typeScore += facilityScore;
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