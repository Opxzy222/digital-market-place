import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../Shop-CSS/AllCategories.css';
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

function AllCategories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://192.168.0.194:8000/all-shop-categories/')
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
    <div className='category-container-as'>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      </Helmet>
      <div>
        <h2 className='category-heading-as'>All Categories</h2>
        <div className='categorylist-container-as'>
          <ul className='categoryList-as'>
            {categories.map(category => (
              <li key={category.id} onClick={() => handleCategoryClick(category.id, category.name)}>
                <div className="category-item-as">
                  {categoryIconMap[category.name.toLowerCase()] && (
                    <img src={categoryIconMap[category.name.trim().toLowerCase()]} alt={`${category.name} Icon`} className="icon-as" />
                  )}
                  <div className="category-details-as">
                    <span className="product-name-as">{category.name}</span>
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

export default AllCategories;
