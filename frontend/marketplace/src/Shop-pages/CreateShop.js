import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import '../Shop-CSS/CreateShop.css';
import ShopHeader from '../Shop-Components/ShopHeader';
import { useNavigate } from 'react-router-dom';

const animatedComponents = makeAnimated();

function CreateShop({ isAuthenticated, handleLogout }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [locationId, setLocationId] = useState('');
    const [geoLocation, setGeoLocation] = useState({ lat: '', lng: '' });
    const [address, setAddress] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [geoError, setGeoError] = useState('');
    const navigate = useNavigate();
    const user_id = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.post('https://172.24.210.76:8000/category/dropdown-options/');
                setCategories(response.data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryChange = async (event) => {
        const selectedCategoryId = event.target.value;
        setCategoryId(selectedCategoryId);

        try {
            const formData = new FormData();
            formData.append('parent_id', selectedCategoryId);

            const response = await axios.post('https://172.24.210.76:8000/category/subcategories/', formData);
            setSubcategories(response.data.subcategories);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    const handleSubcategoryChange = (selectedOptions) => {
        setSelectedSubcategories(selectedOptions);
    };

    const detectDevice = () => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(userAgent)) {
            return 'Android';
        }
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 'iOS';
        }
        return 'unknown';
    };

    const handleLocation = () => {
        if (navigator.geolocation) {
            console.log('Requesting geolocation...');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('Geolocation success:', position);
                    setGeoLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setGeoError(''); // Clear any previous error
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    const device = detectDevice();
                    let instructions = '';
    
                    if (device === 'Android') {
                        instructions = "For Android, go to Settings > Apps & notifications > [Your Browser] > Permissions > Location.";
                    } else if (device === 'iOS') {
                        instructions = "For iOS, go to Settings > Safari > Location > Set to 'Ask' or 'While Using the App'.";
                    }
    
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            setGeoError(
                                `Location access was denied. Please enable location services for this site in your browser settings. ${instructions}`
                            );
                            break;
                        case error.POSITION_UNAVAILABLE:
                            setGeoError("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            setGeoError("The request to get user location timed out.");
                            break;
                        case error.UNKNOWN_ERROR:
                            setGeoError("An unknown error occurred.");
                            break;
                        default:
                            setGeoError("An unknown error occurred.");
                            break;
                    }
                },
                {
                    timeout: 20000, // Increased timeout to 20 seconds
                    maximumAge: 0,  // Do not use cached location
                    enableHighAccuracy: true, // Request high accuracy
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            setGeoError('Geolocation is not supported by this browser.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const formData = new FormData();

            formData.append('shop_name', name);
            formData.append('description', description);
            formData.append('location_id', locationId);
            formData.append('geo_location', `POINT(${geoLocation.lng} ${geoLocation.lat})`);
            formData.append('address', address);
            selectedSubcategories.forEach(subcategory => {
                formData.append('subcategories[]', subcategory.value);
            });
            formData.append('shop_owner', user_id);

            const response = await axios.post('https://172.24.210.76:8000/create-shop/', formData);
            console.log('Shop created:', response.data);
            const shop_id = response.data.shop_id

            navigate('/shop-homepage/shop-manager', { state: { shop_id } });
        } catch (error) {
            console.error('Error creating shop:', error);
        }
    };

    return (
        <div>
            <ShopHeader 
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
            />
            <form className="create-shop-form" onSubmit={handleSubmit}>
                <h3 className='form-heading'>Fill form to create a digital shop</h3>
                <div className="form-group">
                    <label>Shop Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Shop Name" />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <select value={categoryId} onChange={handleCategoryChange} className='cat-select'>
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                {subcategories.length > 0 && (
                    <div className="form-group">
                        <label>Subcategory</label>
                        <Select
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={subcategories.map(subcategory => ({
                                value: subcategory.id,
                                label: subcategory.name,
                            }))}
                            value={selectedSubcategories}
                            onChange={handleSubcategoryChange}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder='Select all that apply...'
                        />
                    </div>
                )}
                <div className="form-group">
                    <label>Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
                </div>
                
                <div className="form-group geo-group">
                    <div className='geo-group'>
                        <div className='lat-long'>
                            <label>Latitude</label>
                            <input type="text" value={geoLocation.lat} readOnly placeholder="Latitude" />
                        </div>
                        <div className='lat-long'>
                            <label>Longitude</label>
                            <input type="text" value={geoLocation.lng} readOnly placeholder="Longitude" />
                        </div>
                    </div>
                    <button type="button" onClick={handleLocation}>Pin Location</button>
                </div>
                {geoError && <p className="error-message">{geoError}</p>}
                <button type="submit">Create Shop</button>
            </form>
        </div>
    );
}

export default CreateShop;
