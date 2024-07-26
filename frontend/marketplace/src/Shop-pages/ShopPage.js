import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from '../Shop-Components/ShopReviewForm';
import Reviews from '../Shop-Components/ShopReview';
import Followers from '../Shop-Components/ShopFollowers';
import FollowButton from '../Shop-Components/FollowButton';
import ShopPosts from '../Shop-Components/ShopPosts';
import '../Shop-CSS/ShopPage.css';
import ShopHeader from '../Shop-Components/ShopHeader';

const ShopPage = ({ isAuthenticated, handleLogout }) => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [error, setError] = useState('');
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await axios.get(`https://192.168.0.194:8000/shops/${shopId}/combined/`);
        const data = response.data;

        setShop({
          id: data.shop.id,
          name: data.shop.name,
          description: data.shop.description,
          image: data.shop.image,
          categories: data.shop.categories,
          products: data.shop.products,
        });
        setReviews(data.reviews);
        setFollowerCount(data.follower_count);
        setFollowers(data.followers || []); // Ensure followers is an array
        setPosts(data.posts);
        setError('');
      } catch (error) {
        console.error('Error fetching shop data:', error);
        setError('Failed to fetch shop data. Please try again later.');
      }
    };

    const markShopAsVisited = async () => {
      try {
        await axios.post('https://192.168.0.194:8000/shops/recently-visited/', {
          shop_id: shopId,
          user_id: userId
        });
      } catch (error) {
        console.error('Error marking shop as visited:', error);
      }
    };

    fetchShopData();
    markShopAsVisited();
  }, [shopId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleReviewSubmitted = (newReview) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!shop) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ShopHeader 
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
      />
      <div className="sp-container">
        <div className="sp-header">
          <img
            className="sp-profile-pic"
            src={shop.image || "https://via.placeholder.com/80"}
            alt="Shop Profile"
          />
          <div className="sp-info">
            <h1>{shop.name}</h1>
            <div className="sp-buttons">
              <div>
                <FollowButton shopId={shopId} />
              </div>
              <Link 
                to={`/shop-homepage/send-messages/${shop.id}?name=${encodeURIComponent(shop.name)}`}
              >
                <button className='sp-message-btn'>Message</button>
              </Link>
            </div>
            <div className="sp-follower-count">
              {followerCount} Followers
            </div>
          </div>
        </div>

        <div className="sp-details">
          <div className="sp-category">
            {shop.categories.map(cat => cat.name).join(', ')}
          </div>
          <div className="sp-description">{shop.description}</div>
        </div>

        <div className="sp-nav">
          <div
            className={activeTab === 'posts' ? 'active' : ''}
            onClick={() => handleTabChange('posts')}
          >
            Posts
          </div>
          <div
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => handleTabChange('products')}
          >
            Products
          </div>
          <div
            className={activeTab === 'followers' ? 'active' : ''}
            onClick={() => handleTabChange('followers')}
          >
            Followers
          </div>
          <div
            className={activeTab === 'reviews' ? 'active' : ''}
            onClick={() => handleTabChange('reviews')}
          >
            Reviews
          </div>
        </div>

        <div className="sp-tab-content">
          {activeTab === 'posts' && (
            <div>
              <ShopPosts posts={posts} />
            </div>
          )}
          {activeTab === 'products' && (
            <div>
              {shop.products && shop.products.length > 0 ? (
                shop.products.map(categoryData => (
                  <div key={categoryData.category} className="category-section">
                    <h3 className="category-title">{categoryData.category}</h3>
                    {categoryData.subcategories.map(subcategoryData => (
                      <div key={subcategoryData.subcategory} className="subcategory-section">
                        <h5 className="subcategory-title">{subcategoryData.subcategory}</h5>
                        <table className="shop-products-table">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Is Available</th>
                              <th>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subcategoryData.products.map(product => (
                              <tr key={product.id}>
                                <td>{product.product_name}</td>
                                <td>{product.is_available ? '✔️' : '❌'}</td>
                                <td>{product.price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div>No products available.</div>
              )}
            </div>
          )}
          {activeTab === 'followers' && <Followers followers={followers} />}
          {activeTab === 'reviews' && (
            <div>
              <ReviewForm shopId={shopId} onReviewSubmitted={handleReviewSubmitted} />
              <Reviews reviews={reviews} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
