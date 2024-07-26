import React, { useState } from 'react';
import Select from 'react-select';

const CustomProducts = ({ customProducts, setCustomProducts, subcategories }) => {
    const [customProductName, setCustomProductName] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);

    const handleAddCustomProduct = () => {
        if (customProductName && selectedSubcategory) {
            setCustomProducts([...customProducts, { name: customProductName, subcategory_id: selectedSubcategory.value, is_available: true, price: '' }]);
            setCustomProductName('');
            setSelectedSubcategory(null);
        }
    };

    const handleRemoveCustomProduct = (index) => {
        setCustomProducts(customProducts.filter((_, i) => i !== index));
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

    const handleCustomProductSubcategoryChange = (index, value) => {
        setCustomProducts(prevState => {
            const newProducts = [...prevState];
            newProducts[index].subcategory_id = value;
            return newProducts;
        });
    };

    return (
        <>
            <div className="section flex-row">
                <Select
                    options={subcategories.map(subcat => ({
                        value: subcat.id,
                        label: subcat.name
                    }))}
                    value={selectedSubcategory}
                    onChange={setSelectedSubcategory}
                    placeholder="Select Subcategory"
                    className="react-select-container"
                    classNamePrefix="react-select"
                />
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
                <div className="section split-container">
                    <h3 className="subtitle">Custom Products</h3>
                    <div className="table-wrapper">
                        <table className="shop-products-table">
                            <thead>
                                <tr>
                                    <th>Subcategory</th>
                                    <th>Product Name</th>
                                    <th>Is Available</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customProducts.map((product, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Select
                                                options={subcategories.map(subcat => ({
                                                    value: subcat.id,
                                                    label: subcat.name
                                                }))}
                                                value={subcategories.find(subcat => subcat.id === product.subcategory_id)}
                                                onChange={(selectedOption) => handleCustomProductSubcategoryChange(index, selectedOption.value)}
                                                placeholder="Select Subcategory"
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="custom-product-name-input"
                                                value={product.name}
                                                onChange={(e) => handleCustomProductNameChange(index, e.target.value)}
                                                placeholder="Enter product name"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={product.is_available}
                                                onChange={() => handleCustomProductCheckboxChange(index)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="price-input"
                                                value={product.price}
                                                onChange={(e) => handleCustomProductPriceChange(index, e.target.value)}
                                                placeholder="Enter price"
                                            />
                                        </td>
                                        <td>
                                            <button className="remove-button" onClick={() => handleRemoveCustomProduct(index)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default CustomProducts;
