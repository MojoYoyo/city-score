import { calculateDistance } from '../utils/distanceCalculation';

// Distances in meters for score calculations
const DISTANCES = [250, 500, 750, 1000];

/**
 * Calculate cultural score for a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Array} culturalAmenities - Array of cultural amenities
 * @returns {Object} - Score result
 */
export const calculateCulturalScore = (lat, lng, culturalAmenities) => {
  // If no data is available, return null
  if (!culturalAmenities || culturalAmenities.length === 0) {
    return null;
  }

  // Group amenities by type
  const amenitiesByType = {
    museum: [],
    theatre: [],
    cinema: [],
    gallery: []
  };

  // Count amenities by type and distance
  const counts = {
    museum: { total: 0, byDistance: [0, 0, 0, 0] },
    theatre: { total: 0, byDistance: [0, 0, 0, 0] },
    cinema: { total: 0, byDistance: [0, 0, 0, 0] },
    gallery: { total: 0, byDistance: [0, 0, 0, 0] }
  };

  // Process each amenity
  culturalAmenities.forEach(amenity => {
    // Skip if missing type or coordinates
    if (!amenity.type || !amenity.latitude || !amenity.longitude) return;

    // Calculate distance if not already provided
    const distance = amenity.distance || 
      calculateDistance(lat, lng, amenity.latitude, amenity.longitude);
    
    // Add to appropriate group
    if (amenitiesByType[amenity.type]) {
      amenitiesByType[amenity.type].push({ ...amenity, distance });
      
      // Update counts
      counts[amenity.type].total++;
      
      // Count by distance bands
      for (let i = 0; i < DISTANCES.length; i++) {
        if (distance <= DISTANCES[i]) {
          counts[amenity.type].byDistance[i]++;
        }
      }
    }
  });

  // Calculate scores for each type
  // Using weighted scoring based on type and distance
  const typeWeights = {
    museum: 1.8,
    theatre: 1.5,
    cinema: 1.2,
    gallery: 1.0
  };
  
  // Distance weights decrease with distance
  const distanceWeights = [1.0, 0.7, 0.4, 0.2];
  
  // Calculate score for each type
  const scoreByType = {};
  let rawScore = 0;
  
  Object.keys(amenitiesByType).forEach(type => {
    let typeScore = 0;
    
    amenitiesByType[type].forEach(amenity => {
      // Calculate distance band
      let distanceBand = 3; // Default to the furthest band
      for (let i = 0; i < DISTANCES.length; i++) {
        if (amenity.distance <= DISTANCES[i]) {
          distanceBand = i;
          break;
        }
      }
      
      // Add weighted score for this amenity
      typeScore += typeWeights[type] * distanceWeights[distanceBand];
    });
    
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