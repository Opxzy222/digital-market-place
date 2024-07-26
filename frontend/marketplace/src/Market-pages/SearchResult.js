// SearchResultsPage.js

import React from 'react';
import { useLocation } from 'react-router-dom';
import '../CSS/SearchResults.css'; 
import { Link } from 'react-router-dom';
import Header from '../Market-Components/Header'; 

function SearchResultsPage({ isAuthenticated, handleLogout }) {
  const location = useLocation();
  const searchResults = location.state?.searchResults || [];

  return (
    <div className='search-results-container'>
      <Header
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          />
      <h2>Search Results</h2>
    <div className="search-results-sub-container">
      <div className="product-grid">
        {searchResults.map((product) => (
          <div key={product.id} className="product-item">
            <Link to={`/market-homepage/product/${product.id}`} className='result-link'>
              <img src={'https://192.168.0.194:8000//' + product.image} alt={product.title} />
    
              <p className='result-title'>{product.title}</p>
              <h3 className='result-price'>Price: {product.price}</h3>
            </Link>
           
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default SearchResultsPage;
