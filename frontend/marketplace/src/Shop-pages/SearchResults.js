import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../Shop-CSS/SearchResult.css'; 
import ShopHeader from '../Shop-Components/ShopHeader';

function SearchResults({ isAuthenticated, handleLogout }) {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const results = location.state?.searchResults || [];
    setSearchResults(results);
    setLoading(false); // Set loading to false once we have the results
  }, [location.state]);

  if (loading) {
    return <div className='sh-loading'>Loading...</div>; // Simple loading indicator
  }

  return (
    <div>
      <ShopHeader 
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
      />
      <div className='sh-results-container'>
        <div className='sh-results-grid'>
          {searchResults.length > 0 ? (
            searchResults.map(shop => (
              <div key={shop.id} className='sh-shop-card'>
                <div className='sh-shop-header'>
                  <div className='sh-image-container'>
                    {shop.image && 
                      <img 
                        src={'https://192.168.0.194:8000/' + shop.image} 
                        alt={`${shop.name}`} 
                        className='sh-shop-image' 
                      />
                    }
                  </div>
                  <div className='sh-shop-info'>
                    <h3 className='sh-shop-name'>{shop.name}</h3>
                    <p className='sh-shop-address'>{shop.address}</p>
                    <p className='sh-shop-distance'>Distance: {shop.distance} meters</p>
                  </div>
                </div>
                <div className='rv-shop-categories'>
                    {shop.categories.map((category) => (
                      <span key={category.id} className="rv-category-badge">{category.name}</span>
                    ))}
                </div>
                <p className='sh-shop-description'>{shop.description}</p>
                <div className='sh-buttons'>
                  <Link 
                    to={`/shop-homepage/send-messages/${shop.id}?name=${encodeURIComponent(shop.name)}`}
                  >
                    <button className='sh-message-button'>Message</button>
                  </Link >
                  <Link 
                    to={`/shop-homepage/shop-page/${shop.id}`}
                  >
                    <button className='sh-whatsapp-button'>Go to Shop</button>
                  </Link >
                </div>
              </div>
            ))
          ) : (
            <p className='sh-no-results'>No shops found matching your criteria.</p>
          )}
        </div>
        <Link to="/shop-homepage" className='sh-back-link'>Back to Search</Link>
      </div>
    </div>
  );
}

export default SearchResults;
