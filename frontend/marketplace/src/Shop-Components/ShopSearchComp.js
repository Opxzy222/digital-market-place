import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import '../Shop-CSS/SearchComponent.css';

function ShopSearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery) {
      alert('Please enter a search query.');
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setLoading(true);

        try {
          const response = await axios.get('https://172.24.210.76:8000/shop-product-search/', {
            params: {
              input: searchQuery,
              lat: latitude,
              lon: longitude
            }
          });

          setSearchResults(response.data);
          navigate('/shop-homepage/search-result', { state: { searchResults: response.data } });
        } catch (error) {
          setError('Error searching for products. Please try again.');
          console.error('Error searching for products:', error);
        } finally {
          setLoading(false);
        }
      }, (error) => {
        console.error('Error getting location:', error);
        setError('Error getting location. Please enable location services and try again.');
        setLoading(false);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
      setError('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className='s-full-container'>
      <div className='s-display-container'>
        <h3 className='shop-near-me'>Find shops near you</h3>
        {error && <p className="error">{error}</p>}
        <div className="s-search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to buy?"
            className="s-search-input"
            disabled={loading}
          />
          <button onClick={handleSearch} className="s-search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {searchResults.length > 0 && (
          <div className='search-results'>
            {searchResults.map(result => (
              <div key={result.id} className='search-result'>
                <h4>{result.name}</h4>
                <p>{result.description}</p>
                <p>{result.address}</p>
                <p>Distance: {result.distance} meters</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopSearchComponent;
