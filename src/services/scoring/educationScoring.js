import { calculateDistance } from '../utils/distanceCalculation';

// Distances in meters for score calculations
const DISTANCES = [250, 500, 750, 1000];

/**
 * Calculate education score for a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Array} educationalInstitutions - Array of educational institutions
 * @returns {Object} - Score result
 */
export const calculateEducationScore = (lat, lng, educationalInstitutions) => {
  // If no data is available, return null
  if (!educationalInstitutions || educationalInstitutions.length === 0) {
    return null;
  }

  // Group institutions by type
  const institutionsByType = {
    university: [],
    college: [],
    school: [],
    kindergarten: [],
    library: []
  };

  // Count institutions by type and distance
  const counts = {
    university: { total: 0, byDistance: [0, 0, 0, 0] },
    college: { total: 0, byDistance: [0, 0, 0, 0] },
    school: { total: 0, byDistance: [0, 0, 0, 0] },
    kindergarten: { total: 0, byDistance: [0, 0, 0, 0] },
    library: { total: 0, byDistance: [0, 0, 0, 0] }
  };

  // Process each institution
  educationalInstitutions.forEach(inst => {
    // Skip if missing type or coordinates
    if (!inst.type || !inst.latitude || !inst.longitude) return;

    // Normalize the institution type if needed
    const type = normalizeEducationalType(inst.type);
    
    // Calculate distance if not already provided
    const distance = inst.distance || 
      calculateDistance(lat, lng, inst.latitude, inst.longitude);
    
    // Add to appropriate group
    if (institutionsByType[type]) {
      institutionsByType[type].push({ ...inst, distance });
      
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
  // Using weighted scoring based on type and distance
  const typeWeights = {
    university: 2.5,
    college: 2.0,
    school: 1.5,
    kindergarten: 1.0,
    library: 0.8
  };
  
  // Distance weights decrease with distance
  const distanceWeights = [1.0, 0.7, 0.4, 0.2];
  
  // Calculate score for each type
  const scoreByType = {};
  let rawScore = 0;
  
  Object.keys(institutionsByType).forEach(type => {
    let typeScore = 0;
    
    for (let i = 0; i < DISTANCES.length; i++) {
      // Add weighted score for institutions at each distance band
      typeScore += counts[type].byDistance[i] * typeWeights[type] * distanceWeights[i];
    }
    
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
 * Normalize educational institution type to a standard category
 * @param {string} type - Original institution type
 * @returns {string} - Normalized type
 */
const normalizeEducationalType = (type) => {
  const normalized = type.toLowerCase();
  
  if (normalized.includes('university')) {
    return 'university';
  } else if (normalized.includes('college')) {
    return 'college';
  } else if (normalized.includes('school')) {
    return 'school';
  } else if (normalized.includes('kindergarten') || normalized.includes('preschool')) {
    return 'kindergarten';
  } else if (normalized.includes('library')) {
    return 'library';
  } else {
    return 'school'; // Default
  }
};