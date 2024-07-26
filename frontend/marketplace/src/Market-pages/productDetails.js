import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../CSS/productDetails.css';
import whatsappLogo from '../Image/whatsapp-logo.png';
import contactIcon from '../Image/contact-icon.png';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import ThumbnailRow from '../Market-Components/thumbnailRow';
import Header from '../Market-Components/Header'; 

function ProductDetails({ isAuthenticated, handleLogout }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showContact, setShowContact] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = new FormData();
        formData.append('id', id);

        const response = await axios.post('https://192.168.0.194:8000//product/', formData);
        setProduct(response.data.product);
        
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchData();
  }, [id]);

  // Function to toggle the showContact state
  const toggleContact = () => {
    if (showContact && product && product.phone) {
      copyContact();
    } else {
      setShowContact(prevState => !prevState);
    }
  };

  // Function to copy the contact information to clipboard
  const copyContact = () => {
    if (product && product.phone) {
      navigator.clipboard.writeText(product.phone)
        .then(() => {
          alert('Contact copied to clipboard');
        })
        .catch((error) => {
          console.error('Error copying contact:', error);
        });
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const gallerySettings = {
    showPlayButton: false,
    showFullscreenButton: true,
    showBullets: true,
  };

  const photos = [
    { original: 'https://192.168.0.194:8000//' + product.image },
    ...(product.images ? product.images.map(imageUrl => ({ original: 'https://192.168.0.194:8000//' + imageUrl })) : [])
  ];

  return (
    <div className='product-container'>
      <Header
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          />
      <div className='product-sub-container'>
        <div className='img-thumbnail-container'>
          <div className='product-img-container'>
            <ImageGallery items={photos} className="product-img" {...gallerySettings} />
          </div>
          <ThumbnailRow images={product.images} className='thumbnail' />
          <div className='attributes'>
            <h2>Additional Details</h2>
            <div className='attribute-grid'>
              {product.attributes && Object.entries(product.attributes).map(([category, values], index) => (
                <div className='attribute-item' key={index}>
                  <strong>{category}:</strong>
                  <ul>
                    {values.map((value, idx) => (
                      <li key={idx}>{value}</li>
                    ))}
                  </ul>
                </div>
                ))}
              </div>
          </div>
        </div>
        <div className='product-details'>
          <div className='details-container'>
            <div className='title'>{product.title}</div>
          </div>
          <div className='details-container'>
            <div className='product-price'>₦{product.price}</div>
          </div>
          <div className='details-container'>
            <div className='description'>
              <span className='content'>{product.description}</span>
            </div>
          </div>
          <div className='details-container'>
            <div className='contact-name'>
              <p>Seller's name:</p><span>{product.seller}</span>
            </div>
          </div>
          <div className='attribute'>
            <h2>Additional Details</h2>
            <div className='attribute-grid'>
              {product.attributes && Object.entries(product.attributes).map(([category, values], index) => (
                <div className='attribute-item' key={index}>
                  <strong>{category}:</strong>
                  <ul>
                    {values.map((value, idx) => (
                      <li key={idx}>{value}</li>
                    ))}
                  </ul>
                </div>
                ))}
              </div>
          </div>
          <div className='contact-details'>
          <div className='message-link'>
              <div className='message-details'>
                <a href='i'>
                  <img src={whatsappLogo} alt='logo' style={{ width: '20px', height: '20px' }} />
                </a>
              </div>
              <p>Message</p>
            </div>
            <div className='contact-link' onClick={toggleContact}>
              <div className='contact-link-details'>
                <a href='i'>
                  <img src={contactIcon} alt='logo' style={{ width: '20px', height: '20px' }} />
                </a>
                <p>{showContact ? product.phone : 'Contact'}</p>
              </div>
            </div>
            <div className='whatsapp-link'>
              <div className='whatsapp-details'>
                <a href='i'>
                  <img src={whatsappLogo} alt='logo' style={{ width: '20px', height: '20px' }} />
                </a>
              </div>
              <p>WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
  
export default ProductDetails;
  