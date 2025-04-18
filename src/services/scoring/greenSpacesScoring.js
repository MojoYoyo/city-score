import { calculateDistance } from '../utils/distanceCalculation';

// Distances in meters for score calculations
const DISTANCES = [250, 500, 750, 1000];

/**
 * Calculate green spaces score for a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Array} greenSpaces - Array of green spaces
 * @returns {Object} - Score result
 */
export const calculateGreenSpacesScore = (lat, lng, greenSpaces) => {
  // If no data is available, return null
  if (!greenSpaces || greenSpaces.length === 0) {
    return null;
  }

  // Group spaces by type
  const spacesByType = {
    park: [],
    garden: [],
    forest: [],
    playground: [],
    nature_reserve: []
  };

  // Count spaces by type and distance
  const counts = {
    park: { total: 0, byDistance: [0, 0, 0, 0] },
    garden: { total: 0, byDistance: [0, 0, 0, 0] },
    forest: { total: 0, byDistance: [0, 0, 0, 0] },
    playground: { total: 0, byDistance: [0, 0, 0, 0] },
    nature_reserve: { total: 0, byDistance: [0, 0, 0, 0] }
  };

  // Process each green space
  greenSpaces.forEach(space => {
    // Skip if missing type or coordinates
    if (!space.type || !space.latitude || !space.longitude) return;

    // Normalize the space type if needed
    const type = normalizeGreenSpaceType(space.type);
    
    // Calculate distance if not already provided
    const distance = space.distance || 
      calculateDistance(lat, lng, space.latitude, space.longitude);
    
    // Add to appropriate group
    if (spacesByType[type]) {
      spacesByType[type].push({ ...space, distance });
      
      // Update counts
      counts[type].total++;
      
      // Count by distance bands
      for (let i = 0; i < DISTANCES.length; i++) {
        if (distance <= DISTANCES[i]) {
          counts[type].byDistance[i]++;
        }
      }
    }
  });

  // Calculate scores for each type
  // Using weighted scoring based on type, size, and distance
  const typeWeights = {
    park: 1.5,              // Base weight for parks
    garden: 0.1,            // Minor contribution
    forest: 3.0,            // Major green asset
    playground: 0.1,        // Minimal weight
    nature_reserve: 4.0     // Premium green space
  };
  
  // Modified distance weights - less steep dropoff to value nearby major parks more
  const distanceWeights = [1.0, 0.65, 0.4, 0.2];
  
  // Enhanced size weights - large parks are MUCH more valuable
  const sizeWeights = {
    small: 0.1,    // Small spaces have limited impact
    medium: 1.0,   // Medium spaces are baseline
    large: 5.0     // Large parks are MAJOR assets to an area
  };
  
  // Calculate score for each type
  const scoreByType = {};
  let rawScore = 0;
  
  Object.keys(spacesByType).forEach(type => {
    let typeScore = 0;
    
    spacesByType[type].forEach(space => {
      // Calculate distance band
      let distanceBand = 3; // Default to the furthest band
      for (let i = 0; i < DISTANCES.length; i++) {
        if (space.distance <= DISTANCES[i]) {
          distanceBand = i;
          break;
        }
      }
      
      // Apply size modifier if available
      const sizeModifier = space.size && sizeWeights[space.size] 
        ? sizeWeights[space.size] 
        : 1.0;
      
      // Add weighted score for this space
      typeScore += typeWeights[type] * distanceWeights[distanceBand] * sizeModifier;
      
      // Bonus for spaces with amenities
      if (space.amenities && space.amenities.length > 0) {
        typeScore += space.amenities.length * 0.2 * distanceWeights[distanceBand];
      }
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

/**
 * Normalize green space type to a standard category
 * @param {string} type - Original green space type
 * @returns {string} - Normalized type
 */
const normalizeGreenSpaceType = (type) => {
  const normalized = type.toLowerCase();
  
  if (normalized.includes('park')) {
    return 'park';
  } else if (normalized.includes('garden')) {
    return 'garden';
  } else if (normalized.includes('forest') || normalized.includes('wood')) {
    return 'forest';
  } else if (normalized.includes('playground')) {
    return 'playground';
  } else if (normalized.includes('nature') || normalized.includes('reserve')) {
    return 'nature_reserve';
  } else {
    return 'park'; // Default
  }
};