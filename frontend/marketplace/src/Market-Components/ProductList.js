import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from './Product';
import '../CSS/productList.css';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

function ProductsList({ isAuthenticated }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from backend
    axios.get('https://172.24.210.76:8000//display-products/')
      .then(response => {
        console.log('Response data:', response.data); // Log the response data
        setProducts(response.data.products)
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  return (
    <div className='product-list-container'>
      <Helmet>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      </Helmet>
      
      <h3 className='heading'>Hot & Trending ads</h3>
      <div className="products-list">
        {products.map(product => (
           <Link  className='link' to={`/market-homepage/product/${product.id}`}>
            <Product
            key={product.id}
            image={product.image} 
            title={product.title}
            price={product.price}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductsList;
