import ShopSearchComponent from '../Shop-Components/ShopSearchComp';
import ShopCategoryList from '../Shop-Components/ShopCategoryList';
import ShopHeader from '../Shop-Components/ShopHeader';
import '../Shop-CSS/ShopHomePage.css'
import '../Shop-CSS/ShopHeader.css'
import RecentlyVisitedShops from '../Shop-Components/RecentlyVisitedShops';
import FollowedShopsPreview from '../Shop-Components/FollowedShopsPreview';



function ShopHomePage({ isAuthenticated, handleLogout }) {
    return (
        <div className='shop-homepage-container'>
          <ShopHeader 
           isAuthenticated={isAuthenticated}
           handleLogout={handleLogout}
           />
          <div>
            <ShopSearchComponent isAuthenticated={isAuthenticated} />
          </div>
          <div div style={{ flex: 1 }}>
              <ShopCategoryList />
          </div>
          <div>
            <FollowedShopsPreview />
          </div>
          <div>
            <RecentlyVisitedShops />
          </div>
        </div>
    )
}

export default ShopHomePage