// SearchResultsPage.js

import React from 'react';
import { useLocation } from 'react-router-dom';
import '../CSS/SearchResults.css'; 
import { Link } from 'react-router-dom';

function SearchResultsPage() {
  const location = useLocation();
  const searchResults = location.state?.searchResults || [];

  return (
    <div className='search-results-container'>
      <h2>Search Results</h2>
    <div className="search-results-sub-container">
      <div className="product-grid">
        {searchResults.map((product) => (
          <div key={product.id} className="product-item">
            <Link to={`/product/${product.id}`}>
            <img src={'http://localhost:8000/' + product.image} alt={product.title} />
    
            <h3>{product.title}</h3>
            <p>Price: {product.price}</p>
            </Link>
           
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default SearchResultsPage;
