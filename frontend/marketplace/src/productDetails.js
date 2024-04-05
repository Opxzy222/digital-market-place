import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProductDetails() {
  const { id } = useParams(); // Destructuring the 'id' parameter from the URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    console.log(id)
    const formData = new FormData()

    formData.append('id', id)
    // Fetch product details from the backend based on the product ID
    axios.post('http://localhost:8000/product/', formData)
      .then(response => {
        setProduct(response.data);
        console.log(response.data, 'gagagag')
        console.log(product, 'ofofo')
       
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
      });
  }, [id, product]);

  if (!product) {
    return <div>no product found</div>;
  }


  return (
    <div>
      {product ? (
        <>
          <h2>Product Details</h2>
          <p>Product ID: {product.id}</p>
          <p>Title: {product.title}</p>
          <p>Description: {product.description}</p>
          <p>Price: {product.price}</p>
          <img src={product.image} alt={product.title} />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
      }

export default ProductDetails;
