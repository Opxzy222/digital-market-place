import React from 'react';
import '../Shop-CSS/ShopFollowers.css';

const Followers = ({ followers = [] }) => {
  const getColorForAlphabet = (alphabet) => {
    const colors = {
      A: '#FFD700', B: '#FF6347', C: '#4682B4', D: '#32CD32', E: '#FF69B4',
      F: '#8A2BE2', G: '#FF4500', H: '#DA70D6', I: '#20B2AA', J: '#B22222',
      K: '#4B0082', L: '#FF8C00', M: '#808000', N: '#FF1493', O: '#8B4513',
      P: '#B8860B', Q: '#8B0000', R: '#2E8B57', S: '#A0522D', T: '#5F9EA0',
      U: '#D2691E', V: '#9932CC', W: '#FF7F50', X: '#6495ED', Y: '#DC143C',
      Z: '#00CED1'
    };
    return colors[alphabet.toUpperCase()] || '#FFD700';
  };

  return (
    <div className="followers-container">
      {followers.length > 0 ? (
        followers.map(follower => (
          <div key={follower.username} className="follower-item">
            <div 
              className="follower-avatar" 
              style={{ backgroundColor: getColorForAlphabet(follower.username.charAt(0)) }}
            >
              {follower.username.charAt(0).toUpperCase()}
            </div>
            <span className="follower-username">{follower.username}</span>
          </div>
        ))
      ) : (
        <p className="no-followers">No followers yet.</p>
      )}
    </div>
  );
};

export default Followers;
