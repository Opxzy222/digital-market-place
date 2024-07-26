import React, { useState } from 'react';
import axios from 'axios';
import '../Shop-CSS/ShopReview.css';
import Rating from 'react-rating-stars-component';

const ReviewForm = ({ shopId, onReviewSubmitted }) => {
  const userId = localStorage.getItem('user_id');
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment) {
      setError('Comment cannot be empty.');
      return;
    }

    const formData = new FormData();
    formData.append('shop', shopId);
    formData.append('user', userId);
    formData.append('rating', rating);
    formData.append('comment', comment);

    try {
      const response = await axios.post(`https://192.168.0.194:8000/shops/reviews/submit/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onReviewSubmitted(response.data);
      setRating(1);
      setComment('');
      setError('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="form-group">
        <label>Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="form-control"
          rows="4"
        ></textarea>
        {error && <p className="error">{error}</p>}
      </div>
      <div className="form-group">
        <label>Rating</label>
        <div className='shop-rating'>
          <Rating
            count={5}
            size={24}
            activeColor="#ffd700"
            value={rating}
            onChange={(newRating) => setRating(newRating)}
          />
        </div>
      </div>
      <p className="rating-notice">Please select a rating before submitting your review.</p>
      <button type="submit" className="shop-rating-btn">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
