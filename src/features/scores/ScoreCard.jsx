import React, { useState } from 'react';
import { useLocation } from '../../context/LocationContext';
import { useData } from '../../context/DataContext';
import { useCriteria } from '../../context/CriteriaContext';
import ScoreVisualization from './ScoreVisualization';
import SummaryView from './SummaryView';
import TransportationScore from './criteria/TransportationScore';
import GreenSpaceScore from './criteria/GreenSpaceScore';
import EducationScore from './criteria/EducationScore';
import HealthcareScore from './criteria/HealthcareScore';
import ShoppingScore from './criteria/ShoppingScore';
import FoodDiningScore from './criteria/FoodDiningScore';
import RecreationSportsScore from './criteria/RecreationSportsScore';
import CulturalScore from './criteria/CulturalScore';
import { getCriteriaIcon, getScoreColor, getScoreDescription } from '../../services/utils/formatters';

/**
 * Score card component
 */
const ScoreCard = () => {
  const { selectedLocation } = useLocation();
  const { scores, isLoading } = useData();
  const { selectedCriteria } = useCriteria();
  const [activeTab, setActiveTab] = useState('combined');
  
  // If no scores or no selected location, return null
  if (!scores || !selectedLocation) {
    return null;
  }

  // Check if we have any selected criteria with valid scores
  const availableCriteria = Object.keys(selectedCriteria).filter(
    key => selectedCriteria[key] && scores[key] !== null
  );
  
  if (availableCriteria.length === 0) {
    return (
      <div className="score-card">
        <h3>No Data Available</h3>
        <p>No scoring criteria selected or no data available for the selected criteria.</p>
      </div>
    );
  }

  // Get tab content based on active tab
  const renderTabContent = () => {
    if (activeTab === 'combined') {
      // Show the summary view for combined score
      return <SummaryView />;
    } else if (activeTab === 'transportation' && scores.transportation) {
      return <TransportationScore score={scores.transportation} />;
    } else if (activeTab === 'greenSpaces' && scores.greenSpaces) {
      return <GreenSpaceScore score={scores.greenSpaces} />;
    } else if (activeTab === 'education' && scores.education) {
      return <EducationScore score={scores.education} />;
    } else if (activeTab === 'healthcare' && scores.healthcare) {
      return <HealthcareScore score={scores.healthcare} />;
    } else if (activeTab === 'shopping' && scores.shopping) {
      return <ShoppingScore score={scores.shopping} />;
    } else if (activeTab === 'foodDining' && scores.foodDining) {
      return <FoodDiningScore score={scores.foodDining} />;
    } else if (activeTab === 'recreationSports' && scores.recreationSports) {
      return <RecreationSportsScore score={scores.recreationSports} />;
    } else if (activeTab === 'cultural' && scores.cultural) {
      return <CulturalScore score={scores.cultural} />;
    } else {
      return <p>No data available for this criteria.</p>
    }
  };
  
  // Get the current active score
  const currentScore = activeTab === 'combined' 
    ? scores.combined 
    : scores[activeTab];
  
  const scoreValue = currentScore ? currentScore.totalScore : 0;

  // Get user-friendly name for criteria
  const getCriteriaName = (criteriaId) => {
    const criteriaNames = {
      'transportation': 'Transportation',
      'greenSpaces': 'Green Spaces',
      'education': 'Education',
      'healthcare': 'Healthcare',
      'shopping': 'Shopping',
      'foodDining': 'Food & Dining',
      'recreationSports': 'Recreation',
      'cultural': 'Cultural'
    };
    
    return criteriaNames[criteriaId] || criteriaId.charAt(0).toUpperCase() + criteriaId.slice(1);
  };

  // Render the score overview section with all category scores
  const renderScoreOverview = () => {
    if (!scores.combined) return null;
    
    return (
      <div className="score-overview" style={{ 
        marginTop: '1rem', 
        marginBottom: '1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '10px'
      }}>
        {availableCriteria.map(criteria => {
          const criteriaScore = scores[criteria];
          if (!criteriaScore) return null;
          
          return (
            <div 
              key={criteria}
              className="score-category"
              onClick={() => setActiveTab(criteria)}
              style={{
                textAlign: 'center',
                padding: '8px 4px',
                borderRadius: '4px',
                backgroundColor: activeTab === criteria ? '#f0f7ff' : '#f5f5f5',
                cursor: 'pointer',
                border: `1px solid ${activeTab === criteria ? '#aac8f0' : '#e0e0e0'}`
              }}
            >
              <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                {getCriteriaIcon(criteria)}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {getCriteriaName(criteria)}
              </div>
              <div style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold',
                color: getScoreColor(criteriaScore.totalScore),
                marginTop: '4px'
              }}>
                {criteriaScore.totalScore}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="score-card">
      <h3 style={{ marginBottom: '4px' }}>Location Score</h3>
      <p style={{ fontSize: '14px', color: '#666', marginTop: '0' }}>{selectedLocation.name}</p>
      
      <div 
        className="score-circle" 
        style={{ 
          background: getScoreColor(scoreValue),
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        {scoreValue}
      </div>
      
      <p style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>
        {getScoreDescription(scoreValue, activeTab)}
      </p>
      
      <ScoreVisualization score={scoreValue} criteriaType={activeTab} />
      
      {/* Category Scores Overview - all visible at once */}
      {renderScoreOverview()}
      
      {/* Tabs for different score types */}
      <div className="score-tabs" style={{ 
        display: 'flex', 
        borderBottom: '1px solid #ddd',
        marginBottom: '1rem',
        overflowX: 'auto'
      }}>
        {scores.combined && (
          <button 
            className={`tab-button ${activeTab === 'combined' ? 'active' : ''}`}
            onClick={() => setActiveTab('combined')}
            style={{
              flex: 1,
              padding: '0.5rem',
              backgroundColor: activeTab === 'combined' ? '#304878' : '#f5f5f5',
              color: activeTab === 'combined' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px 4px 0 0',
              cursor: 'pointer',
              fontWeight: activeTab === 'combined' ? 'bold' : 'normal',
              minWidth: '100px'
            }}
          >
            {getCriteriaIcon('combined')} Overall
          </button>
        )}
        
        {availableCriteria.map(criteria => (
          <button 
            key={criteria}
            className={`tab-button ${activeTab === criteria ? 'active' : ''}`}
            onClick={() => setActiveTab(criteria)}
            style={{
              flex: 1,
              padding: '0.5rem',
              backgroundColor: activeTab === criteria ? '#304878' : '#f5f5f5',
              color: activeTab === criteria ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px 4px 0 0',
              cursor: 'pointer',
              fontWeight: activeTab === criteria ? 'bold' : 'normal',
              minWidth: '100px'
            }}
          >
            {getCriteriaIcon(criteria)} {getCriteriaName(criteria)}
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      <div className="tab-content">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>Loading data...</div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};

export default ScoreCard;