import React from 'react';
import Chat from '../Shop-Components/Chat';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Conversation = () => {
  const location = useLocation();
  const { name, conversation_id } = location.state || {};
  const navigate = useNavigate(); 

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
        fetchMessagesUrl={`https://192.168.0.194:8000/conversation/?conversation_id=${conversation_id}`}
        sendMessageUrl={`https://192.168.0.194:8000/conversation/`}
        conversationId={conversation_id}
      />
    </div>
  );
};

export default Conversation;
