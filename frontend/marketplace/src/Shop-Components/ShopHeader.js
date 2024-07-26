import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import profileIcon from '../Image/profile-icon.png';
import adIcon from '../Image/my-ad-icon.jpg';
import notificationIcon from '../Image/notification-icon3.png';
import messagesIcon from '../Image/messages-icon.jpg';
import bookmarksIcon from '../Image/bookmarks-icon.png';
import myLogo from '../Image/icon.png';
import '../CSS/Header.css';
import axios from 'axios';

function ShopHeader({ isAuthenticated, handleLogout }) {
    const [showProfile, setShowProfile] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const user_id = localStorage.getItem('user_id');
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            const fetchUnreadCount = async () => {
                try {
                    const formData = new FormData();
                    formData.append('user_id', user_id);

                    const response = await axios.post('https://192.168.0.194:8000/unread-messages/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    setUnreadCount(response.data.unread_count);
                } catch (error) {
                    console.error('Error fetching unread message count:', error);
                }
            };
            fetchUnreadCount();
        }
    }, [isAuthenticated, user_id]);

    const toggleMenu = () => {
        setMenuOpen((prevValue) => !prevValue);
    };

    const toggleProfile = () => {
        setShowProfile((prevValue) => !prevValue);
    };

    const handleShopNavigation = () => {
        navigate('/shop-homepage/shop-list');
    }

    return (
        <>
            <Helmet>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Helmet>
            <header className='s-header-container'>
                <Link to="/" title='home'>
                    <div className='logo-container'></div>
                    <div className='gogo'>Gogo</div>
                </Link>
                {isAuthenticated ? (
                    <>
                        <div className='s-header-link-radius'>
                            <Link to="/shop-homepage/message-list" className="s-header-link" title='messages'>
                                <div className="icon-container">
                                    <img src={messagesIcon} alt='messages' className="s-header-img" />
                                </div>
                            </Link>
                        </div>
                        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                        <div className='s-header-link-radius'>
                            <Link to="/" className="s-header-link" title='notifications'>
                                <img src={notificationIcon} alt='notification' className="s-header-img" />
                            </Link>
                        </div>
                        <div className='s-profile-link-radius'>
                            <img src={profileIcon} alt='s-profile' className="s-profile-link" onClick={toggleProfile} onMouseEnter={toggleProfile} onMouseLeave={toggleProfile} title='s-profile' />
                        </div>
                        <div className='s-sell-container'>
                            <Link to="/shop-homepage/create-shop" className='button-link'>
                                <button className="create-shop-button">Create shop</button>
                            </Link>
                        </div>
                        <div className='s-hamburger-menu' onClick={toggleMenu}>
                            <img src={profileIcon} alt='s-profile' className="s-profile-link" title='s-profile' />
                        </div>
                    </>
                ) : (
                    <div className='sign-in-container'>
                        <Link to='/signin' className='sign-in'>SIGN IN</Link>
                    </div>
                )}
            </header>

            {showProfile && (
                <nav className="s-profile">
                    <div className='s-profile-details' onClick={handleShopNavigation}>My Shop</div>
                    <div className='s-profile-details'>Feedback</div>
                    <div className='s-profile-details'>Settings</div>
                    <div className='s-profile-details' onClick={handleLogout}>Log out</div>
                </nav>
            )}

            <nav className={`s-menu ${menuOpen ? 'open' : ''}`} style={{ right: menuOpen ? '30px' : '-300px' }}>
                <div className='s-menu-content' onClick={handleShopNavigation}>My shop</div>
                <div className='s-menu-content'>Feedback</div>
                <div className='s-menu-content'>Settings</div>
                <div className='s-menu-content' onClick={handleLogout}>Log out</div>
            </nav>
        </>
    );
};

export default ShopHeader;
