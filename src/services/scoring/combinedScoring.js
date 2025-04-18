/**
 * Calculate combined score based on selected criteria
 * @param {Object} scores - Object containing scores for each criteria
 * @param {Object} selectedCriteria - Selected criteria flags
 * @returns {Object|null} - Combined score or null if no scores available
 */
export const calculateCombinedScore = (scores, selectedCriteria) => {
  // If no scores are selected or available, return null
  const availableScores = Object.keys(scores).filter(key => 
    selectedCriteria[key] && scores[key] !== null
  );
  
  if (availableScores.length === 0) {
    return null;
  }
  
  // Calculate weighted average of selected scores
  let totalWeight = 0;
  let weightedScoreSum = 0;
  
  availableScores.forEach(key => {
    // Define weights for each criteria
    const weights = {
      transportation: 1.0,
      greenSpaces: 0.8,
      education: 0.7
    };
    
    const weight = weights[key] || 1.0;
    totalWeight += weight;
    weightedScoreSum += scores[key].totalScore * weight;
  });
  
  const averageScore = Math.round(weightedScoreSum / totalWeight);
  
  // Return the combined score
  return {
    totalScore: averageScore,
    contributingFactors: availableScores.length,
    breakdown: availableScores.reduce((obj, key) => {
      obj[key] = scores[key].totalScore;
      return obj;
    }, {})
  };
};