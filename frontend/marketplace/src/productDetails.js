import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CSS/productDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = new FormData();
        formData.append('id', id);

        const response = await axios.post('http://localhost:8000/product/', formData);
        setProduct(response.data.product);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchData();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  console.log(product)
  console.log(product.price)

  return (
    <div className='product-container'>
      <div className='product-details'>
      <h2>Product Details</h2>
      <p className='title'>Title: {product.title}</p>
      
      <img src={'http://localhost:8000/' + product.image} alt={product.title} />
      
      <p className='description'>Description</p>
      <p className='content'>{product.description}</p>
      
      <p className='price'>₦{product.price}</p>
      <p className='contact'>seller's name: {product.seller}</p>
      <p className='contact'>contact: {product.phone}</p>
      </div>
    </div>
  );
}

export default ProductDetails;
