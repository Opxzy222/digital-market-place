import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/createAd.css';
import Header from '../Market-Components/Header'; 
import FileUploader from '../Market-Components/dropZone';
import AttributeInputs from '../Market-Components/CategoryAttribute';
import { useDropzone } from 'react-dropzone';

function ProductForm({ isAuthenticated, handleLogout }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [subsubcategories, setSubsubcategories] = useState([]);
  const [selectedSubsubcategory, setSelectedSubsubcategory] = useState('');
  const [subsubsubcategories, setSubsubsubcategories] = useState([]);
  const [selectedSubsubsubcategory, setSelectedSubsubsubcategory] = useState('');
  const [subsubsubsubcategories, setSubsubsubsubcategories] = useState([]);
  const [selectedSubsubsubsubcategory, setSelectedSubsubsubsubcategory] = useState('');
  const [categoryAttributes, setCategoryAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({
    category: false,
    subcategory: false,
    subsubcategory: false,
    subsubsubcategory: false,
    subsubsubsubcategory: false
  });

  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    axios.post('https://192.168.0.194:8000//category/dropdown-options/')
      .then(response => setCategories(response.data.categories))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const fetchCategoryAttributes = async (categoryId) => {
    try {
      const formData = new FormData();
      formData.append('category_id', categoryId);
      const response = await axios.post('https://192.168.0.194:8000//category/attribute/', formData);
      setCategoryAttributes(response.data.attribute);
    } catch (error) {
      console.error('Error fetching attributes:', error);
    }
  };

  const fetchSubcategories = async (parentId, setter) => {
    try {
      const formData = new FormData();
      formData.append('parent_id', parentId);
      const response = await axios.post('https://192.168.0.194:8000//category/subcategories/', formData);
      setter(response.data.subcategories);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');
    setSelectedSubsubcategory('');
    setSelectedSubsubsubcategory('');
    setSelectedSubsubsubsubcategory('');
    setErrors({ ...errors, category: false });

    fetchCategoryAttributes(categoryId);
    fetchSubcategories(categoryId, setSubcategories);
  };

  const handleSubcategoryChange = async (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    setSelectedSubsubcategory('');
    setSelectedSubsubsubcategory('');
    setSelectedSubsubsubsubcategory('');
    setErrors({ ...errors, subcategory: false });

    fetchCategoryAttributes(subcategoryId);
    fetchSubcategories(subcategoryId, setSubsubcategories);
  };

  const handleSubsubcategoryChange = async (subSubcategoryId) => {
    setSelectedSubsubcategory(subSubcategoryId);
    setSelectedSubsubsubcategory('');
    setSelectedSubsubsubsubcategory('');
    setErrors({ ...errors, subsubcategory: false });

    fetchCategoryAttributes(subSubcategoryId);
    fetchSubcategories(subSubcategoryId, setSubsubsubcategories);
  };

  const handleSubsubsubcategoryChange = async (subSubSubcategoryId) => {
    setSelectedSubsubsubcategory(subSubSubcategoryId);
    setSelectedSubsubsubsubcategory('');
    setErrors({ ...errors, subsubsubcategory: false });

    fetchCategoryAttributes(subSubSubcategoryId);
    fetchSubcategories(subSubSubcategoryId, setSubsubsubsubcategories);
  };

  const handleSubsubsubsubcategoryChange = (subSubSubSubcategoryId) => {
    setSelectedSubsubsubsubcategory(subSubSubSubcategoryId);
    setErrors({ ...errors, subsubsubsubcategory: false });

    fetchCategoryAttributes(subSubSubSubcategoryId);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
    }
  });

  const handleFileChange = (selectedFiles) => {
    setImages(selectedFiles);
  };

  const handleAttributeChange = (attributeId, valueId, isChecked) => {
    setSelectedAttributes(prevState => {
      if (isChecked !== undefined) {
        const values = prevState[attributeId] || [];
        if (isChecked) {
          return { ...prevState, [attributeId]: [...values, valueId] };
        } else {
          return { ...prevState, [attributeId]: values.filter(id => id !== valueId) };
        }
      } else {
        return { ...prevState, [attributeId]: valueId };
      }
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCategory) {
      setErrors({ ...errors, category: true });
      return;
    }
    if (!selectedSubcategory && subcategories.length > 0) {
      setErrors({ ...errors, subcategory: true });
      return;
    }
    if (!selectedSubsubcategory && subsubcategories.length > 0) {
      setErrors({ ...errors, subsubcategory: true });
      return;
    }
    if (!selectedSubsubsubcategory && subsubsubcategories.length > 0) {
      setErrors({ ...errors, subsubsubcategory: true });
      return;
    }
    if (!selectedSubsubsubsubcategory && subsubsubsubcategories.length > 0) {
      setErrors({ ...errors, subsubsubsubcategory: true });
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('user_id', user_id);

    if (image) formData.append('display_image', image);
    if (images.length > 0) {
      images.forEach((img, index) => formData.append(`images[${index}]`, img));
      console.log(images)
    }

    for (const [attributeId, value] of Object.entries(selectedAttributes)) {
      formData.append(`attributes[${attributeId}]`, value);
    }

    let categoryId = selectedSubsubsubsubcategory || selectedSubsubsubcategory || selectedSubsubcategory || selectedSubcategory || selectedCategory;
    formData.append('category_id', categoryId);

    try {
      const response = await axios.post('https://192.168.0.194:8000//create-product/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Product created successfully');
      console.log('Product created successfully:', response.data);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="product-form-container">
      <Header
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          />
      <form onSubmit={handleFormSubmit} className="product-form">
        <div className="form-group">
          <select className="form-control" value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          {errors.category && <span className="error-message">Please select a category</span>}
        </div>

        {selectedCategory && (
          <div className="form-group">
            <select className="form-control" value={selectedSubcategory} onChange={(e) => handleSubcategoryChange(e.target.value)} disabled={subcategories.length === 0}>
              <option value="">Select a subcategory</option>
              {subcategories.map(subcategory => (
                <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
              ))}
            </select>
            {errors.subcategory && <span className="error-message">Please select a subcategory</span>}
          </div>
        )}

        {selectedSubcategory && (
          <div className="form-group">
            <select className="form-control" value={selectedSubsubcategory} onChange={(e) => handleSubsubcategoryChange(e.target.value)} disabled={subsubcategories.length === 0}>
              <option value="">Select a sub-subcategory</option>
              {subsubcategories.map(subsubcategory => (
                <option key={subsubcategory.id} value={subsubcategory.id}>{subsubcategory.name}</option>
              ))}
            </select>
            {errors.subsubcategory && <span className="error-message">Please select a sub-subcategory</span>}
          </div>
        )}

        {selectedSubsubcategory && (
          <div className="form-group">
            <select className="form-control" value={selectedSubsubsubcategory} onChange={(e) => handleSubsubsubcategoryChange(e.target.value)} disabled={subsubsubcategories.length === 0}>
              <option value="">Select a sub-sub-subcategory</option>
              {subsubsubcategories.map(subsubsubcategory => (
                <option key={subsubsubcategory.id} value={subsubsubcategory.id}>{subsubsubcategory.name}</option>
              ))}
            </select>
            {errors.subsubsubcategory && <span className="error-message">Please select a sub-sub-subcategory</span>}
          </div>
        )}

        {selectedSubsubsubcategory && (
          <div className="form-group">
            <select className="form-control" value={selectedSubsubsubsubcategory} onChange={(e) => handleSubsubsubsubcategoryChange(e.target.value)} disabled={subsubsubsubcategories.length === 0}>
              <option value="">Select a sub-sub-sub-subcategory</option>
              {subsubsubsubcategories.map(subsubsubsubcategory => (
                <option key={subsubsubsubcategory.id} value={subsubsubsubcategory.id}>{subsubsubsubcategory.name}</option>
              ))}
            </select>
            {errors.subsubsubsubcategory && <span className="error-message">Please select a sub-sub-sub-subcategory</span>}
          </div>
        )}

        <AttributeInputs attributes={categoryAttributes} handleAttributeChange={handleAttributeChange} />

        <div className="form-group">
          <input type="text" className="form-control" placeholder="Input title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <input type="text" className="form-control" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="form-group">
          <input type="text" className="form-control" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="img-select">
          <div {...getRootProps({ className: 'drop-zone-image' })}>
            <input {...getInputProps()} className="form-control-file" />
            <p>+</p>
          </div>
          {image && <img src={URL.createObjectURL(image)} className="image-item" alt="select" />}
        </div>
        <FileUploader handleFileChange={handleFileChange} />

        <div className="form-group">
          <button type="submit" className="create-ad-submit">Submit</button>
        </div>
      </form>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
}

export default ProductForm;
