import React from 'react';
import Select from 'react-select';

const ProductSuggestions = ({
    groupedProductSuggestions,
    selectedProducts,
    handleProductChange,
    handleCheckboxChange,
    handleProductPriceChange,
    handleRemoveProduct
}) => {
    return (
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
                                placeholder={`Select ${subcategory} products`}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                closeMenuOnSelect={false}
                            />
                            {selectedProducts[category] && selectedProducts[category][subcategory] && selectedProducts[category][subcategory].length > 0 && (
                                <div className="table-wrapper">
                                    <table className="shop-products-table">
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
                                                        <button className="remove-button" onClick={() => handleRemoveProduct(category, subcategory, product.value)}>Remove</button>
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
    );
};

export default ProductSuggestions;
