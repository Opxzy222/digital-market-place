import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../Shop-CSS/ShopCategoryList.css';
import carIcon from '../Image/car-icon.svg';
import computerIcon from '../Image/computer-icon.png';
import phoneIcon from '../Image/phone-icon.png';
import furnitureIcon from '../Image/furniture-icon.png';
import applianceIcon from '../Image/home-appliance-icon.png';
import wearsIcon from '../Image/wear-icon.png';
import propertyIcon from '../Image/property-icon.png';
import beautyIcon from '../Image/health-beauty-icon2.png';
import servicesIcon from '../Image/services-icon1.jpg';
import babiesIcon from '../Image/babies-icon.jpg';
import agricIcon from '../Image/agric-icon.jpg';

function ShopCategoryList() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://172.24.210.76:8000/shop-categories/')
      .then(response => {
        const categoryArray = Object.values(response.data);
        setCategories(categoryArray);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const categoryIconMap = {
    "vehicles": carIcon,
    "electronics": computerIcon,
    "phone": phoneIcon,
    "furniture": furnitureIcon,
    "": applianceIcon,
    "fashion": wearsIcon,
    "property": propertyIcon,
    "health & beauty": beautyIcon,
    "services": servicesIcon,
    "babies & kiddies": babiesIcon,
    "agriculture & food": agricIcon,
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    navigate(`/shop-homepage/subcategories/${categoryId}`, { state: { categoryId: categoryId, categoryName: categoryName }});
  };

  return (
    <div className='s-category-container'>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      </Helmet>
      <div>
        <div className='s-heading-display'>
          <h2 className='category-heading'>Shop Categories</h2>
          <Link to="/all-categories" className='show-more'>Show more...</Link>
        </div>
        <div className='s-categorylist-container'>
          <ul className='s-categoryList'>
            {categories.map(category => (
              <li key={category.id} onClick={() => handleCategoryClick(category.id, category.name)}>
                <div className="s-category-item">
                  {categoryIconMap[category.name.toLowerCase()] && (
                    <img src={categoryIconMap[category.name.trim().toLowerCase()]} alt={`${category.name} Icon`} className="s-icon" />
                  )}
                  <div className="s-category-details">
                    <span className="s-product-name">{category.name}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ShopCategoryList;
