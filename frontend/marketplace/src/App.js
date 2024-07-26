import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignInPage from './Market-pages/SingInPage';
import SearchResultsPage from './Market-pages/SearchResult';
import ProductForm from './Market-pages/CreateAd';
import ProductDetails from './Market-pages/productDetails';
import MyAdverts from './Market-pages/MyAds';
import { Helmet } from 'react-helmet';
import './CSS/App.css';
import SignUpPage from './Market-pages/signupPage';
import MarketHomePage from './Market-pages/MarketHomePage';
import ShopHomePage from './Shop-pages/ShopHompage';
import CreateShop from './Shop-pages/CreateShop';
import ShopManager from './Shop-pages/ShopManager';
import ShopProduct from './Shop-pages/ShopProduct';
import ShopsList from './Shop-pages/ShopList';
import UpdateShopProducts from './Shop-pages/UpdateShopProduct';
import SearchResults from './Shop-pages/SearchResults';
import MessageList from './Shop-pages/MessageList';
import SendMessage from './Shop-pages/SendMessage';
import Conversation from './Shop-pages/Conversation';
import SubCategoryList from './Shop-pages/ShopSubCategoryList';
import ShopPage from './Shop-pages/ShopPage';
import AdminShopPage from './Shop-pages/AdminShopPage';
import AllRecentlyVisitedShops from './Shop-pages/AllRecentlyVisitedShops';
import AllFollowedShops from './Shop-pages/AllFollowedShops';
import AllCategories from './Shop-pages/AllCategories';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      setIsAuthenticated(true);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('user_id');
    window.location.href = '/';
    console.log('logout successful');
  };


  const handleScroll = () => {
    const distanceToBottom = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
    if (distanceToBottom < 50) {
      setShowFooter(true);
    } else {
      setShowFooter(false);
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signin" element={<SignInPage onSignIn={handleSignIn} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/market-homepage" element={<MarketHomePage isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          <Route path="/market-homepage/create-ad" element={<ProductForm isAuthenticated={isAuthenticated} />} />
          <Route path="/market-homepage/search-results" element={<SearchResultsPage />} />
          <Route path="/market-homepage/my-ads" element={<MyAdverts isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          <Route path="/market-homepage/product/:id" element={<ProductDetails isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />

          <Route path="/shop-homepage" element={<ShopHomePage isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          <Route path="/shop-homepage/create-shop" element={<CreateShop isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          <Route path="/shop-homepage/shop-manager" element={<ShopManager isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          <Route path="/shop-homepage/shop-product" element={<ShopProduct isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          <Route path="/shop-homepage/shop-list" element={<ShopsList isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          <Route path="/shop-homepage/update-shop-product" element={<UpdateShopProducts isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          <Route path="/shop-homepage/search-result" element={<SearchResults isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          <Route path="/shop-homepage/message-list" element={<MessageList isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          <Route path="/shop-homepage/send-messages/:shopId" element={<SendMessage isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          <Route path="/shop-homepage/conversation/:shop_id" element={<Conversation isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          <Route path="/shop-homepage/subcategories/:category_id" element={<SubCategoryList isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          <Route path="/shop-homepage/shop-page/:shopId" element={<ShopPage isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          <Route path="/shop-homepage/admin-shop-page/:shopId" element={<AdminShopPage isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          <Route path="/recently-visited-shops" element={<AllRecentlyVisitedShops isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          <Route path="/followed-shops" element={<AllFollowedShops isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          <Route path="/all-categories" element={<AllCategories isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
          
        </Routes>
      </div>
    </Router>
  );
}

function Homepage() {
  return (
    <div className='homepage-container'>
      <Link  className='link' to={'/market-homepage'}>
        <div className='market-container'>
          <h3>Go to market</h3>
        </div>
      </Link>
      <Link  className='link' to={'/shop-homepage'}>
        <div className='shop-container'>
          <h3>go to shop</h3>
        </div>
      </Link>
    </div>
  )
}

export default App;
