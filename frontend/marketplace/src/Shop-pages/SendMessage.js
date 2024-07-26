import React from 'react';
import Chat from '../Shop-Components/Chat'; // Adjust the import path as necessary
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SendMessage = () => {
  const { shopId } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const name = query.get('name');
  const navigate = useNavigate(); 

  // Log the shop ID and name for debugging
  console.log('Shop ID:', shopId);
  console.log('Shop Name:', name);

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div>
      <div className="message-header">
        <button onClick={handleBackClick} className="back-button">← Back</button>
        <div className="message-head">{name}</div>
      </div>
      <Chat
        fetchMessagesUrl={`https://192.168.0.194:8000/messages/?user_id=${localStorage.getItem('user_id')}&shop_id=${shopId}`}
        sendMessageUrl={`https://192.168.0.194:8000/messages/`}
        conversationId={shopId}
      />
    </div>
  );
};

export default SendMessage;
