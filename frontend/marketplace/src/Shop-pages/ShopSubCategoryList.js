import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../Shop-CSS/ShopSubCategoryList.css';

function SubCategoryList() {
  const location = useLocation();
  const { categoryId, categoryName } = location.state || {};
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://172.24.210.76:8000/shop-subcategories/${categoryId}/`)
      .then(response => {
        setSubcategories(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching subcategories:', error);
      });
  }, [categoryId]);

  const handleSubcategoryClick = async (subcategoryId) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.get('https://172.24.210.76:8000/shop-category-search/', {
            params: {
              subcategory_id: subcategoryId,
              lat: latitude,
              lon: longitude
            }
          });

          navigate('/shop-homepage/search-result', { state: { searchResults: response.data } });
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      }, (error) => {
        console.error('Error getting location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  if (loading) {
    return <div className='sb-loading'>Loading...</div>;
  }

  return (
    <div className='sb-container'>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      </Helmet>
      <div>
        <p className='sb-heading'>{categoryName}</p>
        <ul className='sb-category-list'>
          {subcategories.map(subcategory => (
            <li key={subcategory.id} className='sb-category-item'>
              <div onClick={() => handleSubcategoryClick(subcategory.id)} className="sb-link">
                <div className="sb-category-details">
                  <span className="sb-product-name">{subcategory.name}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SubCategoryList;
