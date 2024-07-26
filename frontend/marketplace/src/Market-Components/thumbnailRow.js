import React from 'react';
import '../CSS/thumbnailRow.css'

const ThumbnailRow = ({ images }) => {
  const renderThumbnails = () => {
    const visibleThumbnails = images.slice(0, 4); // Display up to 6 thumbnails

    return visibleThumbnails.map((image, index) => (
      <img
        key={index}
        src={'http://localhost:8000/' + image}
        alt={`Thumbnail ${index}`}
        className="thumbnail-item"
      />
    ));
  };

  const remainingThumbnailsCount = images.length - 4; // Exclude the main image and the first 6 thumbnails

  return (
    <div className="thumbnail-row">
      {renderThumbnails()}
      {remainingThumbnailsCount > 0 && (
        <div className="thumbnail-item remaining-thumbnails">
          +{remainingThumbnailsCount}
        </div>
      )}
    </div>
  );
};

export default ThumbnailRow;
