import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Shop-CSS/FollowedShops.css'; // Assuming you have a CSS file for styling

const FollowedShopsPreview = () => {
  const [shops, setShops] = useState([]);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchFollowedShops = async () => {
      try {
        const response = await axios.get(`https://192.168.0.194:8000/shops/followed/${userId}/`);
        setShops(response.data);
      } catch (error) {
        console.error('Error fetching followed shops:', error);
      }
    };

    fetchFollowedShops();
  }, [userId]);

  const previewShops = shops.slice(0, 3);

  return (
    <div className='fs-container'>
      <h2 className='fs-header'>Followed Shops</h2>
      <div className='fs-shop-list'>
        {previewShops.map(shop => (
          <Link to={`/shop-homepage/shop-page/${shop.id}`} key={shop.id} className='fs-shop-item'>
            <div className='fs-shop-image-container'>
              <img src={shop.image} alt={shop.name} className='fs-shop-image' />
            </div>
            <p className='fs-shop-name'>{shop.name}</p>
          </Link>
        ))}
      </div>
      {shops.length > 3 && (
        <Link to="/followed-shops" className='fs-show-all-button'>
          Show All
        </Link>
      )}
    </div>
  );
};

export default FollowedShopsPreview;
