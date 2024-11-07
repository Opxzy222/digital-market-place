// Product.js
import React from 'react';

function Product({ image, title, price }) {
  return (
    <div className="product">
      
      <img src={'https://172.24.210.76:8000//' + image} alt={title} />
      
      <div className='price-title'>
        <p>{title}</p>
        <p className='price'> ₦{price}</p>
      </div>
    </div>
  )
}

export default Product;
