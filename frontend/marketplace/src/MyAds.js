import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/MyAds.css'; // Import CSS file for styling

function MyAdverts() {
  const [products, setProducts] = useState([]);
  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const formData = new FormData();
        formData.append('id', user_id);
        const response = await axios.post('http://localhost:8000/user-products/', formData);
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
      <h2>My Products</h2>
      <div className="product-list">
        {/* Check if products is an array before mapping over it */}
        {Array.isArray(products.product) && (
          <div className="products-container">
            {products.product.map(product => (
              <div key={product.id} className="product">
                <img src={'http://localhost:8000/' + product.image} alt={product.title} />
                <div className="product-details">
                  <h3>{product.title}</h3>
                  <p>Description: {product.description}</p>
                  <p>Price: {product.price}</p>
                  <p>Seller: {product.seller}</p>
                  <p>Product Name: {product.product_name}</p>
                  <p>Negotiable: {product.negotiable ? 'Yes' : 'No'}</p>
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
