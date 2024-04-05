import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CategoryList from './Homepage';
import ProductList from './ProductList';
import SignInPage from './SingInPage';
import SearchResultsPage from './SearchResult';
import SearchComponent from './SearchComponent';
import ProductForm from './CreateAd';
import ProductDetails from './productDetails';
import { Helmet } from 'react-helmet';
import './CSS/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    // Check if the session token exists in local storage
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

  return (
    <Router>
      <div className="App">
        <Helmet>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        </Helmet>
        <header className='header-container'>
          {/* Conditionally render the sign-in link or other links */}
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="header-link">Profile</Link>
              <Link to="/logout" className="header-link">Logout</Link>
            </>
          ) : (
            <Link to='/signin'>Sign in</Link>
          )}
        </header>
        <div>
        </div>
        <Routes>
          <Route path="/" element={<Homepage isAuthenticated={isAuthenticated} />} />
          {/* Use a route for the sign-in page */}
          <Route path="/signin" element={<SignInPage onSignIn={handleSignIn} />} />
          {/* Use a route for the homepage */}
          <Route path="/Homepage" element={<Homepage isAuthenticated={isAuthenticated} />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route path="/create-ad" element={<ProductForm isAuthenticated={isAuthenticated} />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
        
      </div>
    </Router>
  );
}

function Homepage({ isAuthenticated }) {
  return (
    <div className='homepage-container'>
      <div >
        <div>
          <SearchComponent />
          </div>
      </div>
      <div className='cat'>
        <div style={{ flex: 1 }}>
          <CategoryList />
        </div>
        <div className='headings'>
          <h3>Trending ads</h3>
        </div>
        <div style={{ flex: 3 }}> 
          <ProductList />
        </div>
      </div>
    </div>
  );
}

export default App;
