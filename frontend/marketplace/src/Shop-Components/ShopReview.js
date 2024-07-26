// ShopReview.js
import React from 'react';
import ReactStars from 'react-stars';
import '../Shop-CSS/ShopReview.css';

const ShopReview = ({ reviews = [] }) => {
  return (
    <div className="reviews-container">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div className="review" key={review.id}>
            <div className="review-header">
              <span className="reviewer-name">{review.reviewer__fullname}</span>
              <ReactStars
                count={5}
                size={24}
                value={review.rating}
                edit={false}
                color2={'#ffd700'}
              />
            </div>
            <div className="review-comment">{review.comment}</div>
          </div>
        ))
      ) : (
        <div>No reviews yet.</div>
      )}
    </div>
  );
};

export default ShopReview;
