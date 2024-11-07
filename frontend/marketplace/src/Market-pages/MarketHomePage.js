import CategoryList from '../Market-Components/categoryList';
import ProductList from '../Market-Components/ProductList';
import Header from '../Market-Components/Header'; 
import SearchComponent from '../Market-Components/SearchComponent';
import '../CSS/MarketHomepage.css';

function MarketHomePage({ isAuthenticated, handleLogout }) {
    return (
      <div className='homepage-container'>
        <Header
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          />
        <div>
          <SearchComponent isAuthenticated={isAuthenticated} />
        </div>
        <div className='cat-advert'>
          <div className='cat'>
            <div div style={{ flex: 1 }}>
              <CategoryList />
            </div>
            <div className='headings'>
              <h3>Hot & Trending ads</h3>
            </div>
            <div style={{ flex: 3 }}> 
              <ProductList isAuthenticated={isAuthenticated} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
export default MarketHomePage;