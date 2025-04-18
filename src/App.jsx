import React from 'react';
import { LocationProvider } from './context/LocationContext';
import { CriteriaProvider } from './context/CriteriaContext';
import { DataProvider } from './context/DataContext';
import Header from './components/layout/Header';
import AddressSearch from './features/address-search/AddressSearch';
import CriteriaSelection from './features/criteria-selection/CriteriaSelection';
import Map from './features/map/Map';
import ScoreCard from './features/scores/ScoreCard';
import { useData } from './context/DataContext';
import { useLocation } from './context/LocationContext';
import Spinner from './components/common/Spinner';

/**
 * Content component - renders main app content
 */
const Content = () => {
  const { selectedLocation } = useLocation();
  const { isLoading, scores } = useData();

  return (
    <div className="content">
      <div className="sidebar">
        <AddressSearch isLoading={isLoading} />
        
        <div style={{ marginTop: '1rem' }}>
          <CriteriaSelection isLoading={isLoading} />
        </div>
        
        {isLoading && (
          <div style={{ padding: '2rem 0', textAlign: 'center' }}>
            <Spinner message="Loading data..." />
          </div>
        )}
        
        {!isLoading && selectedLocation && scores && (
          <ScoreCard />
        )}
        
        {!isLoading && !selectedLocation && (
          <div style={{ padding: '1rem', textAlign: 'center' }}>
            <p>Search for an address in Warsaw to see its scores.</p>
          </div>
        )}
      </div>
      
      <div className="map-container">
        <Map />
      </div>
    </div>
  );
};

/**
 * Main App component
 */
function App() {
  return (
    <LocationProvider>
      <CriteriaProvider>
        <DataProvider>
          <div className="app-container">
            <Header title="Warsaw City Score" />
            <Content />
          </div>
        </DataProvider>
      </CriteriaProvider>
    </LocationProvider>
  );
}

export default App;