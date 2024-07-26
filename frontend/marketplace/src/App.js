import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CategoryList from './Components/categoryList';
import ProductList from './Components/ProductList';
import SignInPage from './Pages/SingInPage';
import SearchResultsPage from './Pages/SearchResult';
import SearchComponent from './Components/SearchComponent';
import ProductForm from './Pages/CreateAd';
import ProductDetails from './Pages/productDetails';
import MyAdverts from './Pages/MyAds';
import { Helmet } from 'react-helmet';
import profileIcon from './Image/profile-icon.png'
import adIcon from './Image/my-ad-icon.png'
import notificationIcon from './Image/notification-icon.png'
import messagesIcon from './Image/messages-icon.png';
import bookmarksIcon from './Image/bookmarks-icon.png'
import './CSS/App.css';
import SignUpPage from './Pages/signupPage';
import myLogo from './Image/marketplace-logo.png'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    // Check if the session token exists in local storage.
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      setIsAuthenticated(true);
    }

    // Add event listener to track scroll position
    window.addEventListener('scroll', handleScroll);

    // Remove event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Clear the session token from local storage
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('user_id');
    // Redirect the user to the login page
    window.location.href = '/'; // Redirect using window.location
    console.log('logout successful')
  };

  const handleScroll = () => {
    // Calculate the distance between the bottom of the page and the bottom of the viewport
    const distanceToBottom = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;

    // Show the footer when the distance to the bottom is less than a threshold (e.g., 50 pixels)
    if (distanceToBottom < 50) {
      setShowFooter(true);
    } else {
      setShowFooter(false);
    }
  };

  const toggleProfile = () => {
    setShowProfile((prevValue) => !prevValue)
  }

  return (
    <Router>
      <div className="App">
        <Helmet>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        </Helmet>
        <header className='header-container'>
          <Link to="/"  title='home'>
                <img src={myLogo} alt='bookmarks' className="marketplace-logo" />
          </Link>
          {/* Conditionally render the sign-in link or other links */}
          {isAuthenticated ? (
            <>

          <Link to="/" className="header-link" title='bookmarks'>
            <img src={bookmarksIcon} alt='bookmarks' className="header-link" />
          </Link>

              <Link to="/" className="header-link" title='messages'>
                <img src={messagesIcon} alt='messages' className="header-link" />
              </Link>

              <Link to="/" className="header-link" title='notifications'>
                <img src={notificationIcon} alt='notification' className="header-link" />
              </Link>
              
              <Link to="/my-ads" className="header-link" title='my ads'>
                <img src={adIcon} alt='my ads' className="header-link" />
              </Link>
              <img src={profileIcon} alt='profile' className="profile-link" onClick={toggleProfile} onMouseEnter={toggleProfile} onMouseLeave={toggleProfile} title='profile' />
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

        <Routes>
          <Route path="/" element={<Homepage isAuthenticated={isAuthenticated} />} />
          <Route path="/signin" element={<SignInPage onSignIn={handleSignIn} />} />
          <Route path="/Homepage" element={<Homepage isAuthenticated={isAuthenticated} />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route path="/create-ad" element={<ProductForm isAuthenticated={isAuthenticated} />} />
          <Route path="my-ads" element={<MyAdverts isAuthenticated={isAuthenticated} />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
        
      </div>
    </Router>
  );
}

function Homepage({ isAuthenticated }) {
  return (
    <div className='homepage-container'>
      <Helmet>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      </Helmet>
      
      <div>
        <SearchComponent isAuthenticated={isAuthenticated} />
      </div>
      <div className='cat-advert'>
        <div className='cat'>
        <div div style={{ flex: 1 }}>
          <CategoryList />
        </div>
          <div className='headings'>
            <h3>Trending ad</h3>
          </div>
          <div style={{ flex: 3 }}> 
            <ProductList isAuthenticated={isAuthenticated} />
          </div>
        
      </div>
      </div>
    </div>
  );
}

export default App;
