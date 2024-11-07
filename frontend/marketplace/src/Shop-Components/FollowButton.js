import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FollowButton = ({ shopId }) => {
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const response = await axios.get(`https://172.24.210.76:8000/shops/${shopId}/followers-status/`, {
          params: { user_id: localStorage.getItem('user_id') }
        });
        setFollowing(response.data.following);
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };

    checkFollowingStatus();
  }, [shopId]);

  const handleFollow = async () => {
    try {
      const formData = new FormData();
      formData.append('shop_id', shopId);
      formData.append('user_id', localStorage.getItem('user_id'));

      await axios.post('https://172.24.210.76:8000/shops/follow/', formData);
      setFollowing(!following);
      
    } catch (error) {
      console.error('Error following/unfollowing shop:', error);
    }
  };

  return (
    <div>
      <button
        className={`sp-follow-btn ${following ? 'following' : ''}`}
        onClick={handleFollow}
      >
        {following ? 'Following' : 'Follow'}
      </button>
    </div>
  );
};

export default FollowButton;
