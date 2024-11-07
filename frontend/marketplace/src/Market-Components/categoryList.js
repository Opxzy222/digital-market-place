import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../CSS/CategoryList.css';
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



function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [hoveredSubcategoryId, setHoveredSubcategoryId] = useState(null);

  useEffect(() => {
    // Fetch category data
    axios.get('https://172.24.210.76:8000/category-product-count/')
      .then(response => {
        const categoryArray = Object.values(response.data);
        setCategories(categoryArray);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleCategoryHover = (categoryId) => {
    const formData = new FormData()
    formData.append('id', categoryId)
    // Fetch subcategories data for the hovered category
    axios.post('https://172.24.210.76:8000/subcategories-product-count/', formData)
      .then(response => {
        const subcategoriesArray = Object.values(response.data)
        setSubcategories(subcategoriesArray)
        setHoveredCategoryId(categoryId); // Update hovered category ID
      })
      .catch(error => {
        console.error('Error fetching subcategories:', error);
      });
  };

  const handleSubcategoryHover = (subcategoryId) => {
    setHoveredSubcategoryId(subcategoryId); // Update hovered subcategory ID
  };

  const handleMouseLeave = () => {
    setHoveredCategoryId(null); // Reset hovered category ID
    setHoveredSubcategoryId(null); // Reset hovered subcategory ID
    setSubcategories([]); // Clear subcategories
  };

  // Icon mapping for categories
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

  return (
    <div className='category-container' onMouseLeave={handleMouseLeave}>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      </Helmet>
      <div>
        <div className='heading-display-container'>
          <h3 className='heading-display'>All Categories</h3>
        </div>
        <div className='categorylist-container'>
        <ul className='categoryList'>
          {categories.map(category => (
            <li 
              key={category.id} 
              onMouseEnter={() => handleCategoryHover(category.id)} 
              className={hoveredCategoryId === category.id ? 'hovered' : ''} // Add a class when hovered
            >
              {/* Check if the category has an associated icon */}
              <>
              <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="category-item">
                {categoryIconMap[category.name.toLowerCase()] && (
                  <img src={categoryIconMap[category.name.trim().toLowerCase()]} alt={`${category.name} Icon`} className="icon" />
                )}
                <div className="category-details">
                  <span className="product-name">{category.name}</span>
                  <span style={{ color: 'silver' }}>{` (${category.count})`}</span>
                   <span className="arrow">&gt;</span>
                </div>
              </Link>
              </>
            </li>
          ))}
        </ul>
        </div>
      </div>
      {subcategories.length > 0 && (
        <ul className='subcategoryList'>
          {subcategories.map(subcategory => (
            <li 
              key={subcategory.id} 
              onMouseEnter={() => handleSubcategoryHover(subcategory.id)}
              onMouseLeave={() => setHoveredSubcategoryId(null)} // Reset hovered subcategory ID on leave
              className={hoveredSubcategoryId === subcategory.id ? 'hovered' : ''} // Add a class when hovered
            >
              <Link to={`/subcategory/${subcategory.id}`} className='product-name'>
                {subcategory.name}
              </Link>
              <span style={{ color: 'silver' }}>{` (${subcategory.product_count})`}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoryList;