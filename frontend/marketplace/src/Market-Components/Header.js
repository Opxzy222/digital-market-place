// src/Market-Components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import profileIcon from '../Image/profile-icon.png';
import adIcon from '../Image/my-ad-icon.jpg';
import notificationIcon from '../Image/notification-icon3.png';
import messagesIcon from '../Image/messages-icon.jpg';
import bookmarksIcon from '../Image/bookmarks-icon.png';
import myLogo from '../Image/icon.png';
import '../CSS/Header.css';

function Header({ isAuthenticated, handleLogout }) {
    const [showProfile, setShowProfile] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((prevValue) => !prevValue);
    };

    const toggleProfile = () => {
        setShowProfile((prevValue) => !prevValue);
    };

    return (
        <>
            <Helmet>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Helmet>
            <header className='header-container'>
                <Link to="/" title='home'>
                  <div className='logo-container'></div>
                    <img src={myLogo} alt='bookmarks' className="marketplace-logo" style={{ width: '25px', height: '25px' }} />
                  <div className='gogo'>Gogo</div>
                </Link>
                {isAuthenticated ? (
                    <>
                        <div className='header-link-radius'>
                            <Link to="/" className="header-link" title='bookmarks'>
                                <img src={bookmarksIcon} alt='bookmarks' className="header-img" />
                            </Link>
                        </div>
                        <div className='header-link-radius'>
                            <Link to="/" className="header-link" title='messages'>
                                <img src={messagesIcon} alt='messages' className="header-img" />
                            </Link>
                        </div>
                        <div className='header-link-radius'>
                            <Link to="/" className="header-link" title='notifications'>
                                <img src={notificationIcon} alt='notification' className="header-img" />
                            </Link>
                        </div>
                        <div className='header-link-radius'>
                            <Link to="/market-homepage/my-ads" className="header-link" title='my ads'>
                                <img src={adIcon} alt='my ads' className="header-img" />
                            </Link>
                        </div>
                        <div className='profile-link-radius'>
                            <img src={profileIcon} alt='profile' className="profile-link" onClick={toggleProfile} onMouseEnter={toggleProfile} onMouseLeave={toggleProfile} title='profile' />
                        </div>
                        <div className='sell-container'>
                            <Link to="/market-homepage/create-ad" className='button-link'>
                                <button className="sell-button">SELL</button>
                            </Link>
                        </div>
                        <div className='hamburger-menu' onTouchStart={toggleMenu}>
                            <div className='hamburger-bar'></div>
                            <div className='hamburger-bar'></div>
                            <div className='hamburger-bar'></div>
                        </div>
                    </>
                ) : (
                    <div className='sign-in-container'>
                        <Link to='/signin' className='sign-in'>SIGN IN</Link>
                    </div>
                )}
            </header>

            {showProfile && (
                <nav className="profile">
                    <div className='profile-details'>My shop</div>
                    <div className='profile-details'>Feedback</div>
                    <div className='profile-details'>Settings</div>
                    <div className='profile-details' onClick={handleLogout}>Log out</div>
                </nav>
            )}

            <nav className={`menu ${menuOpen ? 'open' : ''}`} style={{ right: menuOpen ? '30px' : '-300px' }}>
                <div className='menu-content'>My shop</div>
                <div className='menu-content'>Feedback</div>
                <div className='menu-content'>Settings</div>
                <div className='menu-content' onClick={handleLogout}>Log out</div>
            </nav>
        </>
    );
};

export default Header;
