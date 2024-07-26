import React, { useState } from 'react';
import axios from 'axios';
import '../Shop-CSS/ShopPostForm.css';

const ShopPostForm = ({ shopId }) => {
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('shop_id', shopId);
    formData.append('description', description);
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      await axios.post(`https://192.168.0.194:8000/shops/${shopId}/posts/create/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setDescription('');
      setFiles([]);
      setError('');
    } catch (error) {
      console.error('Error submitting post:', error);
      setError('Failed to submit post. Please try again later.');
    }
  };

  return (
    <div className="shop-post-form">
      <h2>Create a Post</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter post description"
          required
        />
        <input type="file" multiple onChange={handleFileChange} />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default ShopPostForm;
