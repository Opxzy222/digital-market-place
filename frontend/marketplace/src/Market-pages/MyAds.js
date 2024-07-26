import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/MyAds.css';
import Header from '../Market-Components/Header'; 

function MyAdverts({ isAuthenticated, handleLogout }) {
  const [products, setProducts] = useState([]);
  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const formData = new FormData();
        formData.append('id', user_id);
        const response = await axios.post('http://192.168.0.194:8000//user-products/', formData);
        console.log('Response from server:', response.data); // Check the received data from the server
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [user_id]);

  console.log('Products state:', products); // Check the type of products state

  return (
    <div className="my-adverts-container">
      <Header
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          />
      <h2>My Products</h2>
      <div className="product-list">
        {/* Check if products is an array before mapping over it */}
        {Array.isArray(products.product) && (
          <div className="products-container">
            {products.product.map(product => (
              <div key={product.id} className="products">
                <img src={'http://192.168.0.194:8000//' + product.image} alt={product.title} className='prod-img' />
                <div className="product-info">
                  <div className='show-ad'><p>Show ad</p></div>
                  <div className='edit-ad'><p>Edit ad</p></div>
                  <div className='close-ad'><p>Close ad</p></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAdverts;
