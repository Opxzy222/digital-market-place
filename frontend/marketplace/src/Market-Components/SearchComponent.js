// SearchComponent.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../CSS/SearchComponent.css'; // Import the CSS file

function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      // Make a request to search for products
      const response = await axios.get(`https://192.168.0.194:8000//product-search/?input=${encodeURIComponent(searchQuery)}`);
      
      // Navigate to the search results page and pass the search results as state
      navigate('/market-homepage/search-results', { state: { searchResults: response.data } });
      console.log(response.data)
    } catch (error) {
      console.error('Error searching for products:', error)
    }
  };

  return (
    <div className=''>
      <div className='how-to-sell'>
        
      </div>
      <div className='display-container'>
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="what do you want to buy?"
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">Search</button>
        </div>
        
      </div>
    </div>
  );
}

export default SearchComponent;
