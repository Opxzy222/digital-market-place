import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import '../Shop-CSS/ShopManager.css';
import ShopHeader from '../Shop-Components/ShopHeader';

function ShopManager({ isAuthenticated, handleLogout }) {
    const [groupedProductSuggestions, setGroupedProductSuggestions] = useState({});
    const [selectedProducts, setSelectedProducts] = useState({});
    const [customProducts, setCustomProducts] = useState([]);
    const [customProductName, setCustomProductName] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const shop_id = location.state.shop_id;

    useEffect(() => {
        const fetchProductSuggestions = async () => {
            try {
                const formData = new FormData();
                formData.append('shop_id', shop_id);
                const response = await axios.post('https://172.24.210.76:8000/product-suggestion/', formData);
                const { product_suggestions, selected_products } = response.data;

                if (product_suggestions && selected_products) {
                    setGroupedProductSuggestions(product_suggestions);

                    const preselectedProducts = selected_products
                        .filter(product => !product.custom_name)
                        .reduce((acc, product) => {
                            const suggestion = Object.values(product_suggestions).flatMap(subcategories => Object.values(subcategories).flat()).find(s => s.id === product.product_suggestion_id);
                            if (suggestion) {
                                const category = Object.keys(product_suggestions).find(key =>
                                    Object.values(product_suggestions[key]).flat().some(s => s.id === product.product_suggestion_id)
                                );
                                const subcategory = Object.keys(product_suggestions[category]).find(subkey =>
                                    product_suggestions[category][subkey].some(s => s.id === product.product_suggestion_id)
                                );
                                if (category && subcategory) {
                                    acc[`${category}-${subcategory}`] = acc[`${category}-${subcategory}`] || [];
                                    acc[`${category}-${subcategory}`].push({
                                        value: product.product_suggestion_id,
                                        label: suggestion.name,
                                    });
                                }
                            }
                            return acc;
                        }, {});

                    setSelectedProducts(preselectedProducts);

                    const customProductsList = selected_products
                        .filter(product => product.custom_name)
                        .map(product => product.custom_name);

                    setCustomProducts(customProductsList);
                } else {
                    console.error('Error: Missing product suggestions or selected products in the response.');
                }
            } catch (error) {
                console.error('Error fetching product suggestions:', error);
            }
        };

        fetchProductSuggestions();
    }, [shop_id]);

    const handleAddCustomProduct = () => {
        if (customProductName) {
            setCustomProducts([...customProducts, customProductName]);
            setCustomProductName('');
        }
    };

    const handleRemoveCustomProduct = (index) => {
        setCustomProducts(customProducts.filter((_, i) => i !== index));
    };

    const handleProductChange = (category, subcategory, selectedOptions) => {
        setSelectedProducts(prevState => ({
            ...prevState,
            [`${category}-${subcategory}`]: selectedOptions
        }));
    };

    const handleSubmitProducts = async () => {
        try {
            const formData = new FormData();
            formData.append('shop_id', shop_id);
            Object.values(selectedProducts).flat().forEach(product => {
                formData.append('product_suggestions[]', product.value);
            });
            customProducts.forEach(customProduct => {
                formData.append('custom_products[]', customProduct);
            });

            const response = await axios.post('https://172.24.210.76:8000/add-product-to-shop/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Products added:', response.data);
            navigate('/shop-homepage/shop-product', { state: { shop_id } });
        } catch (error) {
            console.error('Error adding products to shop:', error);
        }
    };

    return (
        <div>
            <ShopHeader 
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
            />
            <div className="container">
                <h2 className="shp-manager-title">Manage Your Shop's Products</h2>
                <div className="section">
                    {Object.keys(groupedProductSuggestions).map(category => (
                        <div key={category} className="category-container">
                            <h3>{category}</h3>
                            {Object.keys(groupedProductSuggestions[category]).map(subcategory => (
                                <div key={subcategory} className="split-container">
                                    <h5>{subcategory}</h5>
                                    <Select
                                        isMulti
                                        options={groupedProductSuggestions[category][subcategory].map(product => ({
                                            value: product.id,
                                            label: product.name,
                                        }))}
                                        value={selectedProducts[`${category}-${subcategory}`] || []}
                                        onChange={selectedOptions => handleProductChange(category, subcategory, selectedOptions)}
                                        placeholder={`Select ${subcategory} products`}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="section flex-row">
                    <input
                        className="custom-product-input"
                        type="text"
                        value={customProductName}
                        onChange={(e) => setCustomProductName(e.target.value)}
                        placeholder="Enter custom product name"
                    />
                    <button className="button add-button" onClick={handleAddCustomProduct}>Add Custom Product</button>
                </div>
                {customProducts.length > 0 && (
                    <div className="section">
                        <h3 className="subtitle">Custom Products</h3>
                        <div className="custom-product-list">
                            {customProducts.map((product, index) => (
                                <div className="custom-product-item" key={index}>
                                    {product}
                                    <button className="remove-button" onClick={() => handleRemoveCustomProduct(index)}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 18L18 6M6 6L18 18" stroke="#ff5c5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <button className="button submit-button" onClick={handleSubmitProducts}>Submit All Products</button>
            </div>
        </div>
    );
}

export default ShopManager;
