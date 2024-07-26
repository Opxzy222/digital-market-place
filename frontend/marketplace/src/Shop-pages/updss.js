import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import '../Shop-CSS/ShopManager.css';
import ShopHeader from '../Shop-Components/ShopHeader';

function UpdateShopProducts({ isAuthenticated, handleLogout }) {
    const [groupedProductSuggestions, setGroupedProductSuggestions] = useState({});
    const [selectedProducts, setSelectedProducts] = useState({});
    const [customProducts, setCustomProducts] = useState([]);
    const [customProductName, setCustomProductName] = useState('');
    const [customProductCategory, setCustomProductCategory] = useState('');
    const [customProductSubcategory, setCustomProductSubcategory] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const shop_id = location.state.shop_id;

    useEffect(() => {
        const fetchProductSuggestions = async () => {
            try {
                const formData = new FormData();
                formData.append('shop_id', shop_id);
                const response = await axios.post('https://192.168.0.194:8000/product-suggestion/', formData);
                const { product_suggestions, selected_products } = response.data;
                console.log(product_suggestions);
                console.log(selected_products);

                if (product_suggestions && selected_products) {
                    setGroupedProductSuggestions(product_suggestions);

                    const preselectedProducts = selected_products
                        .filter(product => !product.custom_name)
                        .reduce((acc, product) => {
                            const suggestion = Object.values(product_suggestions).flatMap(subcats => Object.values(subcats).flat()).find(s => s.id === product.product_suggestion_id);
                            if (suggestion) {
                                const category = Object.keys(product_suggestions).find(key =>
                                    Object.values(product_suggestions[key]).flat().some(s => s.id === product.product_suggestion_id)
                                );
                                if (category) {
                                    const subcategory = Object.keys(product_suggestions[category]).find(subcat =>
                                        product_suggestions[category][subcat].some(s => s.id === product.product_suggestion_id)
                                    );
                                    if (subcategory) {
                                        acc[category] = acc[category] || {};
                                        acc[category][subcategory] = acc[category][subcategory] || [];
                                        acc[category][subcategory].push({
                                            value: product.product_suggestion_id,
                                            label: suggestion.name,
                                            is_available: product.is_available,
                                            price: product.price || '',
                                            custom_name: product.custom_name,
                                            category_id: product.category_id, // Ensure ID is handled if present
                                            subcategory_name: product.subcategory,
                                        });
                                    }
                                }
                            }
                            return acc;
                        }, {});

                    setSelectedProducts(preselectedProducts);

                    const customProductsList = selected_products
                        .filter(product => product.custom_name)
                        .map(product => ({
                            name: product.custom_name,
                            category: product.category,
                            subcategory: product.subcategory,
                            is_available: product.is_available,
                            price: product.price || '',
                            category_id: product.category_id, // Ensure ID is handled if present
                            subcategory_name: product.subcategory,
                        }));

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
        if (customProductName && customProductCategory && customProductSubcategory) {
            const category = groupedProductSuggestions[customProductCategory];
            const subcategory = category ? category[customProductSubcategory] : null;
    
            if (category && subcategory) {
                const category_id = subcategory[0]?.category_id || '';
                setCustomProducts([
                    ...customProducts,
                    {
                        name: customProductName,
                        category: customProductCategory,
                        subcategory: customProductSubcategory,
                        category_id: category_id,  // Set category_id
                        subcategory_name: customProductSubcategory,
                        is_available: true,
                        price: ''
                    }
                ]);
                setCustomProductName('');
                setCustomProductCategory('');
                setCustomProductSubcategory('');
            } else {
                console.error('Invalid category or subcategory');
            }
        }
    };
    

    const handleRemoveCustomProduct = (index) => {
        setCustomProducts(customProducts.filter((_, i) => i !== index));
    };

    const handleRemoveProduct = (category, subcategory, productId) => {
        setSelectedProducts(prevState => ({
            ...prevState,
            [category]: {
                ...prevState[category],
                [subcategory]: prevState[category][subcategory].filter(product => product.value !== productId),
            }
        }));
    };

    const handleProductChange = (category, subcategory, selectedOptions) => {
        setSelectedProducts(prevState => ({
            ...prevState,
            [category]: {
                ...prevState[category],
                [subcategory]: selectedOptions.map(option => ({
                    ...option,
                    is_available: prevState[category]?.[subcategory]?.find(p => p.value === option.value)?.is_available ?? true
                }))
            }
        }));
    };

    const handleCheckboxChange = (category, subcategory, productId) => {
        setSelectedProducts(prevState => ({
            ...prevState,
            [category]: {
                ...prevState[category],
                [subcategory]: prevState[category][subcategory].map(product =>
                    product.value === productId
                        ? { ...product, is_available: !product.is_available }
                        : product
                )
            }
        }));
    };

    const handleProductPriceChange = (category, subcategory, productId, value) => {
        setSelectedProducts(prevState => ({
            ...prevState,
            [category]: {
                ...prevState[category],
                [subcategory]: prevState[category][subcategory].map(product =>
                    product.value === productId
                        ? { ...product, price: value || '' }
                        : product
                )
            }
        }));
    };

    const handleCustomProductCheckboxChange = (index) => {
        setCustomProducts(prevState => {
            const newProducts = [...prevState];
            newProducts[index] = {
                ...newProducts[index],
                is_available: !newProducts[index].is_available
            };
            return newProducts;
        });
    };

    const handleCustomProductPriceChange = (index, value) => {
        setCustomProducts(prevState => {
            const newProducts = [...prevState];
            newProducts[index].price = value;
            return newProducts;
        });
    };

    const handleCustomProductNameChange = (index, value) => {
        setCustomProducts(prevState => {
            const newProducts = [...prevState];
            newProducts[index].name = value;
            return newProducts;
        });
    };

    const handleCustomProductCategoryChange = (index, selectedOption) => {
        setCustomProducts(prevState => {
            const newProducts = [...prevState];
            newProducts[index].category = selectedOption.value;
            newProducts[index].category_id = groupedProductSuggestions[selectedOption.value][0]?.category_id;
            return newProducts;
        });
    };

    const handleCustomProductSubcategoryChange = (index, selectedOption) => {
        setCustomProducts(prevState => {
            const newProducts = [...prevState];
            newProducts[index].subcategory = selectedOption.value;
            newProducts[index].subcategory_name = selectedOption.value;
            return newProducts;
        });
    };

    const handleSubmitProducts = async () => {
        try {
            const formData = new FormData();
            formData.append('shop_id', shop_id);
    
            Object.entries(selectedProducts).forEach(([category, subcategories]) => {
                Object.values(subcategories).flat().forEach(product => {
                    formData.append('product_suggestions[]', product.value);
                    formData.append(`is_available_${product.value}`, product.is_available);
                    formData.append(`price_${product.value}`, product.price);
                });
            });
    
            customProducts.forEach((customProduct, index) => {
                formData.append('custom_products[]', customProduct.name);
                formData.append(`is_available_custom_${index}`, customProduct.is_available);
                formData.append(`price_custom_${index}`, customProduct.price);
                formData.append(`category_custom_${index}`, customProduct.category_id);
                formData.append(`subcategory_custom_${index}`, customProduct.subcategory_name);
            });
    
            // Log the form data
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
    
            const response = await axios.post('https://192.168.0.194:8000/update-shop-products/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Products updated:', response.data);
            navigate('/shop-homepage/shop-product', { state: { shop_id } });
        } catch (error) {
            console.error('Error updating products:', error);
        }
    };

    return (
        <div>
            <ShopHeader 
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
            />
            <div className="container">
                <h2 className="shp-manager-title">Update Your Shop's Products</h2>
                <div className="section">
                    {Object.keys(groupedProductSuggestions).map(category => (
                        <div key={category} className="split-container">
                            <h4>{category}</h4>
                            {Object.keys(groupedProductSuggestions[category]).map(subcategory => (
                                <div key={subcategory} className="subcategory-container">
                                    <h5>{subcategory}</h5>
                                    <Select
                                        isMulti
                                        options={Array.isArray(groupedProductSuggestions[category][subcategory]) ? groupedProductSuggestions[category][subcategory].map(product => ({
                                            value: product.id,
                                            label: product.name,
                                        })) : []}
                                        value={selectedProducts[category] && selectedProducts[category][subcategory] ? selectedProducts[category][subcategory] : []}
                                        onChange={selectedOptions => handleProductChange(category, subcategory, selectedOptions)}
                                        placeholder={`Select products for ${subcategory}`}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        closeMenuOnSelect={false}
                                    />
                                    {selectedProducts[category] && selectedProducts[category][subcategory] && selectedProducts[category][subcategory].length > 0 && (
                                        <div className="table-wrapper">
                                            <table className='sho-shop-products-table'>
                                                <thead>
                                                    <tr>
                                                        <th>Product Name</th>
                                                        <th>Is Available</th>
                                                        <th>Price</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedProducts[category][subcategory].map(product => (
                                                        <tr key={product.value}>
                                                            <td style={{ textAlign: 'left' }}>{product.label}</td>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={product.is_available}
                                                                    onChange={() => handleCheckboxChange(category, subcategory, product.value)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="price-input"
                                                                    value={product.price || ''}
                                                                    onChange={(e) => handleProductPriceChange(category, subcategory, product.value, e.target.value)}
                                                                    placeholder="Enter price"
                                                                />
                                                            </td>
                                                            <td>
                                                                <button className="removee-button" onClick={() => handleRemoveProduct(category, subcategory, product.value)}>
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="section">
                    <h4>Add Custom Product</h4>
                    <input
                        type="text"
                        value={customProductName}
                        onChange={(e) => setCustomProductName(e.target.value)}
                        placeholder="Product Name"
                    />
                    <Select
    options={Object.keys(groupedProductSuggestions).map(category => ({
        value: groupedProductSuggestions[category].category_id,
        label: category,
    }))}
    value={customProductCategory ? { value: customProductCategory.id, label: customProductCategory.name } : null}
    onChange={selectedOption => setCustomProductCategory({ id: selectedOption.value, name: selectedOption.label })}
    placeholder="Select Category"
    className="react-select-container"
    classNamePrefix="react-select"
/>
<Select
    options={customProductCategory ? Object.values(groupedProductSuggestions[customProductCategory.name]).map(subcategory => ({
        value: subcategory.subcategory_id,
        label: subcategory.subcategory_name,
    })) : []}
    value={customProductSubcategory ? { value: customProductSubcategory.id, label: customProductSubcategory.name } : null}
    onChange={selectedOption => setCustomProductSubcategory({ id: selectedOption.value, name: selectedOption.label })}
    placeholder="Select Subcategory"
    className="react-select-container"
    classNamePrefix="react-select"
/>
                    <button onClick={handleAddCustomProduct}>Add Custom Product</button>
                </div>
                <div className="section">
                    <h4>Custom Products</h4>
                    <div className="custom-product-list">
                        {customProducts.map((product, index) => (
                            <div key={index} className="product-item">
                                <input
                                    type="checkbox"
                                    checked={product.is_available}
                                    onChange={() => handleCustomProductCheckboxChange(index)}
                                />
                                <input
                                    type="text"
                                    value={product.name}
                                    onChange={(e) => handleCustomProductNameChange(index, e.target.value)}
                                    placeholder="Product Name"
                                />
                                 <Select
                                name={`custom-product-category-${index}`}
                                options={Object.keys(groupedProductSuggestions).map(category => ({
                                    value: groupedProductSuggestions[category].category_id,
                                    label: category,
                                }))}
                                value={product.category ? { value: product.category.id, label: product.category.name } : null}
                                onChange={(selectedOption) => {
                                    handleCustomProductCategoryChange(index, selectedOption);
                                    setCustomProductSubcategory(null); // Reset subcategory when category changes
                                }}
                                className="basic-select"
                                classNamePrefix="select"
                            />
                            {product.category && (
                                <Select
                                    name={`custom-product-subcategory-${index}`}
                                    options={Object.values(groupedProductSuggestions[product.category.name]).map(subcategory => ({
                                        value: subcategory.subcategory_id,
                                        label: subcategory.subcategory_name,
                                    }))}
                                    value={product.subcategory ? { value: product.subcategory.id, label: product.subcategory.name } : null}
                                    onChange={(selectedOption) => handleCustomProductSubcategoryChange(index, selectedOption)}
                                    className="basic-select"
                                    classNamePrefix="select"
                                />
                            )}
                            <input
                                type="text"
                                value={product.price}
                                onChange={(e) => handleCustomProductPriceChange(index, e.target.value)}
                                placeholder="Price"
                            />
                                <button onClick={() => handleRemoveCustomProduct(index)}>Remove</button>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="submit-button" onClick={handleSubmitProducts}>Update Products</button>
            </div>
        </div>
    );
}

export default UpdateShopProducts;
