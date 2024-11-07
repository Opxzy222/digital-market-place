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
                const response = await axios.post('https://172.24.210.76:8000/product-suggestion/', formData);
                const { product_suggestions, selected_products } = response.data;
                
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
                                            category_id: suggestion.category_id,
                                            subcategory_id: suggestion.subcategory_id,
                                            category_name: category,
                                            subcategory_name: subcategory
                                        });
                                    }
                                }
                            }
                            return acc;
                        }, {});
    
                    setSelectedProducts(preselectedProducts);
    
                    const customProductsList = selected_products
                        .filter(product => product.custom_name)
                        .map(product => {
                            const category = Object.keys(product_suggestions).find(key => 
                                key === product.category_name);
                            const subcategory = category ? 
                                Object.keys(product_suggestions[category]).find(subcat => 
                                    subcat === product.subcategory_name) 
                                : undefined;
    
                            return {
                                name: product.custom_name,
                                category: category,
                                subcategory: subcategory,
                                is_available: product.is_available,
                                price: product.price || '',
                                category_id: product.category_id,
                                subcategory_id: product.subcategory_id,
                                category_name: category,
                                subcategory_name: subcategory
                            };
                        });
    
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
        console.log('Adding Custom Product:', customProductName, customProductCategory, customProductSubcategory);
    
        if (!customProductName) {
            console.error('Product name is required');
            return;
        }
    
        if (customProductCategory && !customProductSubcategory) {
            alert('Please select a subcategory.');
            return;
        }
    
        const category = customProductCategory ? groupedProductSuggestions[customProductCategory] : null;
        const subcategory = category ? category[customProductSubcategory] : null;
    
        const category_id = subcategory ? subcategory[0]?.category_id : '';
        const subcategory_id = subcategory ? subcategory[0]?.subcategory_id : '';
    
        const newCustomProduct = {
            name: customProductName,
            category: customProductCategory || '',
            subcategory: customProductSubcategory || '',
            category_id: category_id || '',
            subcategory_id: subcategory_id || '',
            is_available: true,
            price: '',
            category_name: customProductCategory || '',
            subcategory_name: customProductSubcategory || ''
        };
    
        setCustomProducts([
            ...customProducts,
            newCustomProduct
        ]);
    
        setCustomProductName('');
        setCustomProductCategory('');
        setCustomProductSubcategory('');
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
                    is_available: prevState[category]?.[subcategory]?.find(p => p.value === option.value)?.is_available ?? true,
                    category_id: groupedProductSuggestions[category]?.[subcategory]?.find(p => p.id === option.value)?.category_id,
                    subcategory_id: groupedProductSuggestions[category]?.[subcategory]?.find(p => p.id === option.value)?.subcategory_id,
                    category_name: category,
                    subcategory_name: subcategory
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
        const updatedProducts = [...customProducts];
        updatedProducts[index].name = value;
        setCustomProducts(updatedProducts);
    };

    const handleCustomProductCategoryChange = (index, selectedOption) => {
        setCustomProducts(prevState => {
            const newProducts = [...prevState];
            newProducts[index].category = selectedOption.value;
            newProducts[index].category_id = groupedProductSuggestions[selectedOption.value]?.[0]?.category_id || '';
            newProducts[index].category_name = selectedOption.value;
            return newProducts;
        });
    };

    const handleCustomProductSubcategoryChange = (index, selectedOption) => {
        setCustomProducts(prevState => {
            const newProducts = [...prevState];
            newProducts[index].subcategory = selectedOption.value;
            newProducts[index].subcategory_id = groupedProductSuggestions[newProducts[index].category]?.[selectedOption.value]?.[0]?.subcategory_id || '';
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
                    formData.append(`category_id_${product.value}`, product.category_id);
                    formData.append(`subcategory_id_${product.value}`, product.subcategory_id);
                });
            });
    
            customProducts.forEach((customProduct, index) => {
                formData.append('custom_products[]', customProduct.name);
                formData.append(`is_available_custom_${index}`, customProduct.is_available);
                formData.append(`price_custom_${index}`, customProduct.price);
                formData.append(`category_custom_${index}`, customProduct.category_id || ''); // Allow empty category_id
                formData.append(`subcategory_custom_${index}`, customProduct.subcategory_id || ''); 
            });
    
            const response = await axios.post('https://172.24.210.76:8000/update-shop-products/', formData, {
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
        <div className="shop-manager-container">
            <ShopHeader isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
            <div className="shop-manager-content">
                <h2 className="mt-5 mb-4">Update Shop Products</h2>
                <form onSubmit={e => { e.preventDefault(); handleSubmitProducts(); }}>
                    {Object.entries(groupedProductSuggestions).map(([category, subcategories]) => (
                        <div key={category} className="split-container">
                            <h3>{category}</h3>
                            {Object.entries(subcategories).map(([subcategory, products]) => (
                                <div key={subcategory} className="subcategory-container">
                                    <h4 className='subcat'>{subcategory}</h4>
                                    <Select
                                        isMulti
                                        value={selectedProducts[category]?.[subcategory] || []}
                                        options={products.map(product => ({ value: product.id, label: product.name }))}
                                        onChange={selectedOptions => handleProductChange(category, subcategory, selectedOptions)}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        closeMenuOnSelect={false}
                                    />
                                    {selectedProducts[category]?.[subcategory]?.length > 0 && (
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
                                                                    Remove
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
                    <div className="custom-product">
                        {customProducts.length > 0 && (
                            <div className="cst-table-wrapper">
                                <table className='sho-shop-products-table'>
                                    <thead>
                                        <tr>
                                            <th>Product Name</th>
                                            <th>Category</th>
                                            <th>Subcategory</th>
                                            <th>Is Available</th>
                                            <th>Price</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customProducts.map((product, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={product.name}
                                                        onChange={e => handleCustomProductNameChange(index, e.target.value)}
                                                        className="cst-name-input"
                                                        placeholder="Enter product name"
                                                    />
                                                </td>
                                                <td>
                                                    <div className='cst-sub-cat-name'>{product.category_name}</div>
                                                </td>
                                                <td>
                                                    <div className='cst-sub-cat-name'>{product.subcategory_name}</div>
                                                </td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={product.is_available}
                                                        onChange={() => handleCustomProductCheckboxChange(index)}
                                                        className='cst-check-box'
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={product.price}
                                                        onChange={e => handleCustomProductPriceChange(index, e.target.value)}
                                                        placeholder="Price"
                                                        className="price-input"
                                                    />
                                                </td>
                                                <td>
                                                    <button type="button" className="removee-button" onClick={() => handleRemoveCustomProduct(index)}>Remove</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <h3>Add Custom Product</h3>
                            </div>
                        )}
                        <div className="custom-product-inputs">
                            <input
                                type="text"
                                placeholder="Product Name"
                                value={customProductName}
                                onChange={e => setCustomProductName(e.target.value)}
                                className="custom-name-input"
                            />
                            <Select
                                value={customProductCategory ? { value: customProductCategory, label: customProductCategory } : null}
                                options={Object.keys(groupedProductSuggestions).map(category => ({ value: category, label: category }))}
                                onChange={selectedOption => {
                                    setCustomProductCategory(selectedOption ? selectedOption.value : '');
                                    if (!selectedOption) {
                                        setCustomProductSubcategory(''); // Clear subcategory when category is cleared
                                    }
                                }}
                                placeholder="Select Category"
                                className="cst-react-select-container"
                                classNamePrefix="cst-react-select"
                                isClearable
                            />
                            <Select
                                value={customProductSubcategory ? { value: customProductSubcategory, label: customProductSubcategory } : null}
                                options={
                                    customProductCategory
                                        ? Object.keys(groupedProductSuggestions[customProductCategory]).map(subcategory => ({ value: subcategory, label: subcategory }))
                                        : []
                                }
                                onChange={selectedOption => setCustomProductSubcategory(selectedOption.value)}
                                placeholder="Select Subcategory"
                                className="cst-react-select-container"
                                classNamePrefix="react-select"
                            />
                            <button type="button" onClick={handleAddCustomProduct} className='add-button'>Add Custom Product</button>
                        </div>
                    </div>
                    <button type="submit" className="submit-button">Update Products</button>
                </form>
            </div>
        </div>
    );
}
    
export default UpdateShopProducts;      