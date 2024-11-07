import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Shop-CSS/ShopList.css';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const formData = new FormData();
        formData.append('user_id', userId);

        const response = await axios.post('https://172.24.210.76:8000/shops-product-count/', formData);
        setShops(response.data);
      } catch (error) {
        console.error('Error fetching shops', error);
      }
    };
    fetchShops();
  }, [userId]);

  const shopNames = ['Shop A', 'Shop B', 'Shop C', 'Shop D', 'Shop E', 'Shop F'];

  const handleShopClick = (shopId) => {
    navigate('/shop-homepage/shop-product', { state: { shop_id: shopId } });
  };

  const handleManageShopPage = (shopId) => {
    navigate(`/manage-shop-page`, { state: { shop_id: shopId } });
  };

  const handleCloseShop = async (shopId) => {
    const confirmed = window.confirm('Are you sure you want to close this shop?');
    if (!confirmed) return;

    try {
      await axios.delete(`https://172.24.210.76:8000/close-shop/${shopId}/`);
      setShops(shops.filter(shop => shop.id !== shopId));
    } catch (error) {
      console.error('Error closing shop', error);
    }
  };

  return (
    <div className="shop-list-container">
      <h1>My Shops</h1>
      <div className="shops">
        {shops.map((shop, index) => (
          <div key={shop.id} className="shop-card">
            <h2>{shopNames[index % shopNames.length]}</h2>
            <p><strong>{shop.name}</strong></p>
            <p>Products Available: {shop.product_count}</p>
            <div className="shop-card-buttons">
              <button onClick={() => handleShopClick(shop.id)} className='view-shop-button'>Shop Product</button>
              <Link 
                to={`/shop-homepage/admin-shop-page/${shop.id}`}
                >
                <button className='manage-shop-button'>Shop Page</button>
              </Link >
              <button onClick={() => handleCloseShop(shop.id)} className='close-shop-button'>Close Shop</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopList;