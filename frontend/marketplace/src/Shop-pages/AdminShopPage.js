import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Reviews from '../Shop-Components/ShopReview';
import Followers from '../Shop-Components/ShopFollowers';
import ShopPostForm from '../Shop-Components/ShopPostForm';
import AdminShopPosts from '../Shop-Components/AdminShopPosts';
import '../Shop-CSS/ShopPage.css';
import '../Shop-CSS/ShopPostForm.css';

const ShopPage = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [activeTab, setActiveTab] = useState('posts');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await axios.get(`https://192.168.0.194:8000/shops/${shopId}/`);
        setShop({ ...response.data, reviews: response.data.reviews || [] });
        setError('');
      } catch (error) {
        console.error('Error fetching shop data:', error);
        setError('Failed to fetch shop data. Please try again later.');
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`https://192.168.0.194:8000/shops/${shopId}/reviews/`);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const fetchFollowerCount = async () => {
      try {
        const response = await axios.get(`https://192.168.0.194:8000/shops/${shopId}/followers/`);
        setFollowerCount(response.data.count);
      } catch (error) {
        console.error('Error fetching follower count:', error);
      }
    };

    fetchShopData();
    fetchReviews();
    fetchFollowerCount();
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
    <div className="sp-container">
      <div className="sp-header">
        <img
          className="sp-profile-pic"
          src={shop.image || "https://via.placeholder.com/80"}
          alt="Shop Profile"
        />
        <div className="sp-info">
          <h1>{shop.name}</h1>
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
            <ShopPostForm shopId={shopId} />
            <AdminShopPosts shopId={shopId} />
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
        {activeTab === 'followers' && <Followers shopId={shopId} />}
        {activeTab === 'reviews' && (
          <div>
            <Reviews reviews={reviews} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
