import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Shop-CSS/FollowedShops.css'; // Assuming you have a CSS file for styling

const AllFollowedShops = () => {
  const [shops, setShops] = useState([]);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchAllFollowedShops = async () => {
      try {
        const response = await axios.get(`https://192.168.0.194:8000/shops/followed/${userId}/`);
        setShops(response.data);
      } catch (error) {
        console.error('Error fetching all followed shops:', error);
      }
    };

    fetchAllFollowedShops();
  }, [userId]);

  return (
    <div className='fs-container'>
      <h2 className='fs-header'>Shops you follow</h2>
      <div className='fs-shop-list'>
        {shops.map(shop => (
          <Link to={`/shop-homepage/shop-page/${shop.id}`} key={shop.id} className='fs-shop-item'>
            <div className='fs-shop-image-container'>
              <img src={shop.image} alt={shop.name} className='fs-shop-image' />
            </div>
            <p className='fs-shop-name'>{shop.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllFollowedShops;
