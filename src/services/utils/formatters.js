/**
 * Format transportation counts for display
 * @param {Object} counts - Counts by type and distance
 * @returns {Array} - Formatted counts for display
 */
export const formatTransportationCounts = (counts) => {
  return Object.entries(counts).map(([type, data]) => {
    // Create more readable type names
    const typeNames = {
      'metro': 'Metro',
      'train': 'Train/Rail',
      'tram': 'Tram',
      'bus': 'Bus'
    };
    
    return {
      type: typeNames[type] || type.charAt(0).toUpperCase() + type.slice(1),
      total: data.total,
      within250m: data.byDistance[0],
      within500m: data.byDistance[1],
      within750m: data.byDistance[2],
      within1000m: data.byDistance[3]
    };
  }).filter(item => item.total > 0);
};

/**
 * Format green spaces counts for display
 * @param {Object} counts - Counts by type and distance
 * @returns {Array} - Formatted counts for display
 */
export const formatGreenSpaceCounts = (counts) => {
  return Object.entries(counts).map(([type, data]) => {
    // Create more readable type names
    const typeNames = {
      'park': 'Park',
      'garden': 'Garden',
      'forest': 'Forest',
      'playground': 'Playground',
      'nature_reserve': 'Nature Reserve'
    };
    
    return {
      type: typeNames[type] || type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '),
      total: data.total,
      within250m: data.byDistance[0],
      within500m: data.byDistance[1],
      within750m: data.byDistance[2],
      within1000m: data.byDistance[3]
    };
  }).filter(item => item.total > 0);
};

/**
 * Format education counts for display
 * @param {Object} counts - Counts by type and distance
 * @returns {Array} - Formatted counts for display
 */
export const formatEducationCounts = (counts) => {
  return Object.entries(counts).map(([type, data]) => {
    // Create more readable type names
    const typeNames = {
      'university': 'University',
      'college': 'College',
      'school': 'School',
      'kindergarten': 'Kindergarten',
      'library': 'Library'
    };
    
    return {
      type: typeNames[type] || type.charAt(0).toUpperCase() + type.slice(1),
      total: data.total,
      within250m: data.byDistance[0],
      within500m: data.byDistance[1],
      within750m: data.byDistance[2],
      within1000m: data.byDistance[3]
    };
  }).filter(item => item.total > 0);
};

/**
 * Get color based on score
 * @param {number} score - Score value (0-100)
 * @returns {string} - Color hex code
 */
export const getScoreColor = (score) => {
  if (score >= 85) return '#15803d'; // Dark Green
  if (score >= 70) return '#65a30d'; // Green
  if (score >= 50) return '#ca8a04'; // Yellow
  if (score >= 30) return '#ea580c'; // Orange
  return '#dc2626'; // Red
};

/**
 * Get description based on score
 * @param {number} score - Score value (0-100)
 * @param {string} type - Type of criteria
 * @returns {string} - Description
 */
export const getScoreDescription = (score, type) => {
  // For transportation
  if (type === 'transportation') {
    if (score >= 85) return 'Excellent transportation access';
    if (score >= 70) return 'Very good transportation access';
    if (score >= 50) return 'Good transportation access';
    if (score >= 30) return 'Limited transportation access';
    return 'Poor transportation access';
  }
  
  // For green spaces
  if (type === 'greenSpaces') {
    if (score >= 85) return 'Excellent green space access';
    if (score >= 70) return 'Very good green space access';
    if (score >= 50) return 'Good green space access';
    if (score >= 30) return 'Limited green space access';
    return 'Poor green space access';
  }
  
  // For education
  if (type === 'education') {
    if (score >= 85) return 'Excellent educational facilities nearby';
    if (score >= 70) return 'Very good educational access';
    if (score >= 50) return 'Good educational access';
    if (score >= 30) return 'Limited educational access';
    return 'Poor educational access';
  }
  
  // For combined score
  if (score >= 85) return 'Excellent location overall';
  if (score >= 70) return 'Very good location';
  if (score >= 50) return 'Good location';
  if (score >= 30) return 'Average location';
  return 'Below average location';
};

/**
 * Get icon for criteria type
 * @param {string} criteriaType - Type of criteria
 * @returns {string} - Emoji icon
 */
export const getCriteriaIcon = (criteriaType) => {
  const icons = {
    'combined': '🏙️',
    'transportation': '🚌',
    'greenSpaces': '🌳',
    'education': '🏫'
  };
  return icons[criteriaType] || '📊';
};

/**
 * Get icon for transportation type
 * @param {string} type - Type of transportation
 * @returns {string} - Emoji icon
 */
export const getTransportIcon = (type) => {
  const icons = {
    'Metro': '🚇',
    'Train/Rail': '🚆',
    'Tram': '🚊',
    'Bus': '🚌'
  };
  return icons[type] || '🚏';
};

/**
 * Get icon for green space type
 * @param {string} type - Type of green space
 * @returns {string} - Emoji icon
 */
export const getGreenSpaceIcon = (type) => {
  const icons = {
    'Park': '🏞️',
    'Garden': '🌷',
    'Forest': '🌲',
    'Playground': '🎪',
    'Nature Reserve': '🌿'
  };
  return icons[type] || '🌳';
};

/**
 * Get icon for education type
 * @param {string} type - Type of education
 * @returns {string} - Emoji icon
 */
export const getEducationIcon = (type) => {
  const icons = {
    'University': '🎓',
    'College': '🏛️',
    'School': '🏫',
    'Kindergarten': '🧸',
    'Library': '📚'
  };
  return icons[type] || '📕';
};

/**
 * Format healthcare facilities counts for display
 */
export const formatHealthcareCounts = (counts) => {
    return Object.entries(counts).map(([type, data]) => {
      const typeNames = {
        'hospital': 'Hospital',
        'clinic': 'Clinic',
        'doctor': 'Doctor',
        'pharmacy': 'Pharmacy'
      };
      
      return {
        type: typeNames[type] || type.charAt(0).toUpperCase() + type.slice(1),
        total: data.total,
        within250m: data.byDistance[0],
        within500m: data.byDistance[1],
        within750m: data.byDistance[2],
        within1000m: data.byDistance[3]
      };
    }).filter(item => item.total > 0);
  };
  
  /**
   * Format shopping facilities counts for display
   */
  export const formatShoppingCounts = (counts) => {
    return Object.entries(counts).map(([type, data]) => {
      const typeNames = {
        'supermarket': 'Supermarket',
        'convenience': 'Convenience Store',
        'mall': 'Shopping Mall',
        'market': 'Market'
      };
      
      return {
        type: typeNames[type] || type.charAt(0).toUpperCase() + type.slice(1),
        total: data.total,
        within250m: data.byDistance[0],
        within500m: data.byDistance[1],
        within750m: data.byDistance[2],
        within1000m: data.byDistance[3]
      };
    }).filter(item => item.total > 0);
  };
  
  /**
   * Format food & dining facilities counts for display
   */
  export const formatFoodDiningCounts = (counts) => {
    return Object.entries(counts).map(([type, data]) => {
      const typeNames = {
        'restaurant': 'Restaurant',
        'cafe': 'Cafe',
        'pub': 'Pub',
        'fast_food': 'Fast Food'
      };
      
      return {
        type: typeNames[type] || type.charAt(0).toUpperCase() + type.slice(1),
        total: data.total,
        within250m: data.byDistance[0],
        within500m: data.byDistance[1],
        within750m: data.byDistance[2],
        within1000m: data.byDistance[3]
      };
    }).filter(item => item.total > 0);
  };
  
  /**
   * Format recreation & sports facilities counts for display
   */
  export const formatRecreationSportsCounts = (counts) => {
    return Object.entries(counts).map(([type, data]) => {
      const typeNames = {
        'sports_centre': 'Sports Center',
        'swimming_pool': 'Swimming Pool',
        'fitness_centre': 'Fitness Center',
        'pitch': 'Sports Field',
        'tennis': 'Tennis Court'
      };
      
      return {
        type: typeNames[type] || type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '),
        total: data.total,
        within250m: data.byDistance[0],
        within500m: data.byDistance[1],
        within750m: data.byDistance[2],
        within1000m: data.byDistance[3]
      };
    }).filter(item => item.total > 0);
  };
  
  /**
   * Format cultural amenities counts for display
   */
  export const formatCulturalCounts = (counts) => {
    return Object.entries(counts).map(([type, data]) => {
      const typeNames = {
        'museum': 'Museum',
        'theatre': 'Theater',
        'cinema': 'Cinema',
        'gallery': 'Art Gallery'
      };
      
      return {
        type: typeNames[type] || type.charAt(0).toUpperCase() + type.slice(1),
        total: data.total,
        within250m: data.byDistance[0],
        within500m: data.byDistance[1],
        within750m: data.byDistance[2],
        within1000m: data.byDistance[3]
      };
    }).filter(item => item.total > 0);
  };
  
  /**
   * Get icon for healthcare facility type
   */
  export const getHealthcareIcon = (type) => {
    const icons = {
      'Hospital': '🏥',
      'Clinic': '🏥',
      'Doctor': '👨‍⚕️',
      'Pharmacy': '💊'
    };
    return icons[type] || '🏥';
  };
  
  /**
   * Get icon for shopping facility type
   */
  export const getShoppingIcon = (type) => {
    const icons = {
      'Supermarket': '🛒',
      'Convenience Store': '🏪',
      'Shopping Mall': '🛍️',
      'Market': '🧺'
    };
    return icons[type] || '🛒';
  };
  
  /**
   * Get icon for food & dining facility type
   */
  export const getFoodDiningIcon = (type) => {
    const icons = {
      'Restaurant': '🍽️',
      'Cafe': '☕',
      'Pub': '🍺',
      'Fast Food': '🍔'
    };
    return icons[type] || '🍴';
  };
  
  /**
   * Get icon for recreation & sports facility type
   */
  export const getRecreationSportsIcon = (type) => {
    const icons = {
      'Sports Center': '🏆',
      'Swimming Pool': '🏊',
      'Fitness Center': '🏋️',
      'Sports Field': '⚽',
      'Tennis Court': '🎾'
    };
    return icons[type] || '🏃';
  };
  
  /**
   * Get icon for cultural amenity type
   */
  export const getCulturalIcon = (type) => {
    const icons = {
      'Museum': '🏛️',
      'Theater': '🎭',
      'Cinema': '🎬',
      'Art Gallery': '🖼️'
    };
    return icons[type] || '🎨';
  };