import React, { useState } from 'react';
import '../Shop-CSS/ShopPostForm.css';

const ShopPosts = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = (post, index = 0) => {
    setSelectedPost(post);
    setCurrentIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    setCurrentIndex(0);
  };

  const handleSlideIndicatorClick = (index) => {
    setCurrentIndex(index);
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % selectedPost.media.length);
  };

  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + selectedPost.media.length) % selectedPost.media.length);
  };

  return (
    <div>
      <div className="shop-posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="shop-post-item" onClick={() => handleImageClick(post)}>
            {post.media && post.media.length > 0 ? (
              <img src={post.media[0].url} alt="Post" />
            ) : (
              <p>No image available</p>
            )}
          </div>
        ))}
      </div>

      {selectedPost && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <span className="arrow left" onClick={handlePrevImage}>
              &#8249;
            </span>
            <img src={selectedPost.media[currentIndex].url} alt={`Post ${currentIndex + 1}`} />
            <span className="arrow right" onClick={handleNextImage}>
              &#8250;
            </span>
            <p>{selectedPost.description}</p>
            <div className="slide-indicators">
              {selectedPost.media.map((_, index) => (
                <span
                  key={index}
                  className={currentIndex === index ? 'active' : ''}
                  onClick={() => handleSlideIndicatorClick(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPosts;
