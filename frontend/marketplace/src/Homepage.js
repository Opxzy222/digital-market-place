import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './CSS/Homepage.css';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [hoveredSubcategoryId, setHoveredSubcategoryId] = useState(null);

  useEffect(() => {
    // Fetch category data
    axios.get('http://127.0.0.1:8000/category-product-count/')
      .then(response => {
        const categoryArray = Object.values(response.data);
        setCategories(categoryArray)
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleCategoryHover = (categoryId) => {
    const formData = new FormData()
    formData.append('id', categoryId)
    // Fetch subcategories data for the hovered category
    axios.post('http://127.0.0.1:8000/subcategories-product-count/', formData)
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
    setHoveredCategoryId(null); // Reset hovered category
    setHoveredSubcategoryId(null); // Reset hovered subcategory
  };

  return (
    <div className='category-container'>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      </Helmet>
      <ul className='categoryList'>
        {categories.map(category => (
          <li 
            key={category.id} 
            onMouseEnter={() => handleCategoryHover(category.id)} 
            onMouseLeave={handleMouseLeave} // Add onMouseLeave event handler
            className={hoveredCategoryId === category.id ? 'hovered' : ''} // Add a class when hovered
          >
            <Link to={`/products?category=${encodeURIComponent(category.name)}`} className='product-name'>
              {category.name}
            </Link>
            <span style={{ color: 'silver' }}>{` (${category.count})`}</span>
          </li>
        ))}
      </ul>
      {subcategories.length > 0 && (
        <ul className='subcategoryList' onMouseLeave={handleMouseLeave}>
          {subcategories.map(subcategory => (
            <li 
              key={subcategory.id} 
              onMouseEnter={() => handleSubcategoryHover(subcategory.id)}
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
      <div className='product-view'>
        
      </div>
    </div>
  );
}

export default CategoryList;
