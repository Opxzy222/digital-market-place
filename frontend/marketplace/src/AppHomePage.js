import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './CSS/AppHomepage.css'; // Custom styles
import myLogo from './Image/icon.png';

function Homepage() {
  return (
    <div className='ahp-homepage-container'>
      {/* Welcome Message */}
      <div className='ahp-welcome-message'>
        <div className='ahp-logo-and-heading'>
          <img src={myLogo} alt="Logo" className='ahp-logo' />
          <div className='ahp-welcome-heading'>Gogo Digital Marketplace</div>
        </div>
        <p className='ahp-welcome-description'>
          Discover, connect, and grow. Set up your digital shop or explore our peer-to-peer market now.
        </p>
      </div>

      {/* Billboard Carousel */}
      <div className='ahp-carousel-container'>
        <Carousel 
          showArrows={true} 
          autoPlay={true} 
          infiniteLoop={true} 
          interval={3000}
          showThumbs={false} 
          showStatus={false}
        >
          <div>
            <img src='slide1.jpg' alt='Product 1' />
          </div>
          <div>
            <img src='slide2.jpg' alt='Product 2' />
          </div>
          <div>
            <img src='slide3.jpg' alt='Product 3' />
          </div>
          <div>
            <img src='slide4.jpg' alt='Product 4' />
          </div>
          <div>
            <img src='slide5.jpg' alt='Product 5' />
          </div>
        </Carousel>
        <div className='ahp-advertise-link'>
          <Link to={'/advertise'}>
            <span>Advertise with Us</span>
            <span className='ahp-shaking-arrow'>>>>></span>
          </Link>
        </div>
      </div>

      {/* Market and Shop Links */}
      <div className='ahp-links-container'>
        <Link className='ahp-link ahp-market-link' to={'/market-homepage'}>
          <div className='ahp-market-container'>
            <h3 className='ahp-link-heading'>Go to Market</h3>
          </div>
        </Link>
        <Link className='ahp-link ahp-shop-link' to={'/shop-homepage'}>
          <div className='ahp-shop-container'>
            <h3 className='ahp-link-heading'>Go to Shop</h3>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Homepage;
