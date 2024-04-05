// SearchComponent.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import './CSS/SearchComponent.css'; // Import the CSS file

function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      // Make a request to search for products
      const response = await axios.get(`http://localhost:8000/product-search/?input=${encodeURIComponent(searchQuery)}`);
      
      // Navigate to the search results page and pass the search results as state
      navigate('/search-results', { state: { searchResults: response.data } });
      console.log(response.data)
    } catch (error) {
      console.error('Error searching for products:', error);
    }
  };

  return (
    <div className='display-container'>
    <div className="search-container">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search product..."
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      <div >
      <div className='image-container'>
        
      </div>
      <Link to='create-ad' className='button-link'>
        <button className="button-below-image">SELL</button>
      </Link>
    </div>
  </div>
);
}

export default SearchComponent;
