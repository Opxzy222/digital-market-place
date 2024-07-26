import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import ShopHeader from '../Shop-Components/ShopHeader';
import '../Shop-CSS/shopProduct.css'; // Import the CSS file

function ShopProduct({ isAuthenticated, handleLogout }) {
    const [categorizedProducts, setCategorizedProducts] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const shop_id = location.state ? location.state.shop_id : null;

    useEffect(() => {
        if (!shop_id) {
            console.error('Shop ID not found');
            return;
        }

        const fetchShopProducts = async () => {
            try {
                const formData = new FormData();
                formData.append('shop_id', shop_id);
                const response = await axios.post('https://192.168.0.194:8000/shop-products/', formData);
                setCategorizedProducts(response.data);
            } catch (error) {
                console.error('Error fetching shop products:', error);
            }
        };

        fetchShopProducts();
    }, []); // Empty dependency array ensures the effect runs only once

    if (!shop_id) {
        return <div>Shop ID not found. Please try again.</div>;
    }

    const handleUpdateProductsClick = () => {
        navigate('/shop-homepage/update-shop-product', { state: { shop_id } });
    };

    return (
        <div className='shp-full-container'>
            <ShopHeader 
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
            />
            <div className="shp-product-container">
                <p className="shp-title">Manage Your Shop's Products</p>
                <button className="update-button" onClick={handleUpdateProductsClick}>
                    Edit Shop Products
                </button>
                <div className="section">
                    {categorizedProducts.map(categoryData => (
                        <div key={categoryData.category} className="category-section">
                            <div className="category-title">{categoryData.category}</div>
                            {categoryData.subcategories.map(subcategoryData => (
                                <div key={subcategoryData.subcategory} className="subcategory-section">
                                    <h5 className="subcategory-title">{subcategoryData.subcategory}</h5>
                                    <table className="shop-products-table">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Is Available</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subcategoryData.products.map(product => (
                                                <tr key={product.id}>
                                                    <td>{product.product_name}</td>
                                                    <td>{product.is_available ? '✔️' : '❌'}</td>
                                                    <td>{product.price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ShopProduct;
