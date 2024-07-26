import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Shop-CSS/SearchResult.css'; 

const RecentlyVisitedShops = () => {
  const [shops, setShops] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchRecentlyVisitedShops = async () => {
      try {
        const response = await axios.get(`https://192.168.0.194:8000/shops/recently-visited/${userId}/`);
        setShops(response.data.recently_visited_shops);
      } catch (error) {
        console.error('Error fetching recently visited shops:', error);
      }
    };

    fetchRecentlyVisitedShops();
  }, [userId]);

  const handleShowMore = () => {
    setShowAll(true);
  };

  const shopsToDisplay = showAll ? shops : shops.slice(0, 3);

  return (
    <div>
      <h2 className='sh-results-header'>Recently Visited Shops</h2>
      <div className='sh-results-container'>
        <div className='rv-results-grid'>
          {shopsToDisplay.map((shop) => (
            <div key={shop.id} className='sh-shop-card'>
              <div className='sh-shop-header'>
                <div className='sh-image-container'>
                  {shop.image && (
                    <img 
                      src={'https://192.168.0.194:8000/' + shop.image} 
                      alt={`${shop.name}`} 
                      className='sh-shop-image' 
                    />
                  )}
                </div>
                <div className='sh-shop-info'>
                  <h3 className='sh-shop-name'>{shop.name}</h3>
                  <p className='sh-shop-address'>{shop.address}</p>
                  <p className='rv-visited-at'>Visited on: {new Date(shop.visited_at).toLocaleDateString()}</p>
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
                </Link>
                <Link 
                  to={`/shop-homepage/shop-page/${shop.id}`}
                >
                  <button className='sh-whatsapp-button'>Go to Shop</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        {!showAll && shops.length > 3 && (
          <button onClick={handleShowMore} className='rv-show-more-button'>Show More</button>
        )}
        {showAll && (
          <Link to="/recently-visited-shops" className='rv-show-more-button'>View All Recently Visited Shops</Link>
        )}
      </div>
    </div>
  );
};

export default RecentlyVisitedShops;
