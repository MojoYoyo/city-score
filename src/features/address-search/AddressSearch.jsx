import React, { useState } from 'react';
import { useLocation } from '../../context/LocationContext';
import { searchAddress } from '../../api';
import Button from '../../components/common/Button';

/**
 * Address search component
 */
const AddressSearch = ({ isLoading }) => {
  const { selectLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    setIsSearching(true);
    setError(null);
    
    try {
      const results = await searchAddress(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('No results found. Try a different search term.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Error searching for address. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddressSelect = (result) => {
    selectLocation({
      coordinates: [parseFloat(result.lat), parseFloat(result.lon)],
      name: result.display_name,
      data: result
    });
    
    // Clear search results after selection
    setSearchResults([]);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Enter an address in Warsaw"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isSearching || isLoading}
        />
        <Button 
          type="submit"
          className="search-button"
          disabled={isSearching || isLoading}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </form>
      
      {error && (
        <div style={{ color: 'red', marginTop: '0.5rem' }}>
          {error}
        </div>
      )}
      
      {searchResults.length > 0 && (
        <div className="search-results">
          <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Search Results:</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {searchResults.map((result, index) => (
              <li 
                key={index}
                style={{ 
                  padding: '0.5rem', 
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer'
                }}
                onClick={() => handleAddressSelect(result)}
              >
                {result.display_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddressSearch;