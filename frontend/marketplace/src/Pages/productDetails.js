import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../CSS/productDetails.css';
import whatsappLogo from '../Image/whatsapp-logo.png';
import contactIcon from '../Image/contact-icon.png';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import ThumbnailRow from '../Components/thumbnailRow';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showContact, setShowContact] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = new FormData();
        formData.append('id', id);

        const response = await axios.post('http://localhost:8000/product/', formData);
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
      // If showContact is true and there's contact information, copy the contact
      copyContact();
    } else {
      // If showContact is false or there's no contact information, toggle the showContact state
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
    showPlayButton: false, // Hide play button
  };

  const photos = [
    { original: 'http://localhost:8000/' + product.image }, // Original image from product.image
    // Map over product.image_urls if it's defined, otherwise use an empty array
    ...(product.images ? product.images.map(imageUrl => ({ original: 'http://localhost:8000/' + imageUrl })) : [])
  ];

  return (
    <div className='product-container'>
      <div className='product-sub-container'>
        <div className='img-thumbnail-container'> 
          <div className='product-img-container'>
            <ImageGallery items={photos} className="product-img" {...gallerySettings} />
            <ThumbnailRow images={product.images} />
          </div>
         
        </div>
        <div className='product-details'>
          <h2 className='title'>{product.title}</h2>
          <div className='product-price'>₦{product.price}</div>
          <div className='description'>
            <p>Description:</p>
            <span className='content'>{product.description}</span>
          </div>
          <div className='contact-name'>
            <p>Seller's name:</p><span>{product.seller}</span>
          </div>
          <div className='contact-details'>
            <div className='contact-link' onClick={toggleContact}>
              <a href='i'>
                <img src={contactIcon} alt='logo' style={{ width: '20px', height: '20px' }} />
              </a>
              <p>{showContact? product.phone : 'show contact'}</p>
            </div>
            <div className='whatsapp-link'>
              <a href='i'>
                <img src={whatsappLogo} alt='logo' style={{ width: '20px', height: '20px' }} />
              </a>
              <p>chat on whatsapp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
