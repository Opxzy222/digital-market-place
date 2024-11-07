import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Shop-CSS/ShopPostForm.css';

const AdminShopPosts = ({ shopId }) => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`https://172.24.210.76:8000/shops/${shopId}/posts/`);
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [shopId]);

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

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      try {
        await axios.delete(`https://172.24.210.76:8000/shops/${shopId}/posts/${postId}/`);
        setPosts(posts.filter(post => post.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div>
      <div className="shop-posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="shop-post-item">
            {post.media && post.media.length > 0 ? (
              <img src={post.media[0].url} alt="Post" onClick={() => handleImageClick(post)} />
            ) : (
              <p>No image available</p>
            )}
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
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

export default AdminShopPosts;
