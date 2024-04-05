// Product.js
import React from 'react';

function Product({ image, title, price }) {
  return (
    <div className="product">
      <div className='product-img'>
      <img src={'http://localhost:8000/' + image} alt={title} />
      </div>
      <h3>{title}</h3>
      <p> ₦{price}</p>
    </div>
  );
}

export default Product;
