import { calculateDistance } from '../utils/distanceCalculation';

// Distances in meters for score calculations
const DISTANCES = [250, 500, 750, 1000];

/**
 * Calculate transportation score for a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Array} transportationStops - Array of transportation stops
 * @returns {Object} - Score result
 */
export const calculateTransportationScore = (lat, lng, transportationStops) => {
  // If no data is available, return null
  if (!transportationStops || transportationStops.length === 0) {
    return null;
  }

  // Group stops by type and calculate distances
  const stopsByType = {
    metro: [],
    train: [],
    tram: [],
    bus: []
  };

  // Count stops by type and distance
  const counts = {
    metro: { total: 0, byDistance: [0, 0, 0, 0] },
    train: { total: 0, byDistance: [0, 0, 0, 0] },
    tram: { total: 0, byDistance: [0, 0, 0, 0] },
    bus: { total: 0, byDistance: [0, 0, 0, 0] }
  };

  // Process each stop
  transportationStops.forEach(stop => {
    // Skip if missing type or coordinates
    if (!stop.type || !stop.latitude || !stop.longitude) return;

    // Normalize the stop type to one of our categories
    const type = normalizeStopType(stop.type);
    
    // Calculate distance to the given coordinates if not already provided
    const distance = stop.distance || calculateDistance(lat, lng, stop.latitude, stop.longitude);
    
    // Add to appropriate group
    if (stopsByType[type]) {
      stopsByType[type].push({ ...stop, distance });
      
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

  // Calculate scores for each transportation type
  // Using weighted scoring based on type and distance
  const typeWeights = {
    metro: 3.0, // Metro/subway has highest weight
    train: 2.0, // Train stations have high weight
    tram: 1.5, // Trams are good for urban mobility
    bus: 1.0  // Buses are the baseline
  };
  
  // Distance weights decrease with distance
  const distanceWeights = [1.0, 0.7, 0.4, 0.2];
  
  // Calculate score for each type
  const scoreByType = {};
  let rawScore = 0;
  
  Object.keys(stopsByType).forEach(type => {
    // Base score calculation
    let typeScore = 0;
    
    for (let i = 0; i < DISTANCES.length; i++) {
      // Add weighted score for stops at each distance band
      typeScore += counts[type].byDistance[i] * typeWeights[type] * distanceWeights[i];
    }
    
    // Apply diminishing returns for many stops of the same type
    if (counts[type].total > 5) {
      typeScore = typeScore * (1 + Math.log10(counts[type].total / 5) * 0.5);
    }
    
    scoreByType[type] = typeScore;
    rawScore += typeScore;
  });
  
  // Calculate the final score on a 0-100 scale
  // Using a logarithmic scale to handle varying densities of transportation
  let totalScore = 0;
  
  if (rawScore > 0) {
    // Apply scaling formula to get a score between 0-100
    totalScore = Math.min(100, Math.round(Math.log10(rawScore + 1) * 40));
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
 * Normalize transportation stop type to a standard category
 * @param {string} type - Original stop type
 * @returns {string} - Normalized type
 */
const normalizeStopType = (type) => {
  const normalized = type.toLowerCase();
  
  if (normalized.includes('metro') || normalized.includes('subway')) {
    return 'metro';
  } else if (normalized.includes('train') || normalized.includes('rail')) {
    return 'train';
  } else if (normalized.includes('tram')) {
    return 'tram';
  } else {
    return 'bus'; // Default
  }
};