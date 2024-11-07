import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Shop-CSS/MessageList.css';

const MessageList = () => {
  const userId = localStorage.getItem('user_id');
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://172.24.210.76:8000/message-list/?user_id=${userId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages', error);
      }
    };

    fetchMessages();
  }, [userId]);

  const handleMessageClick = (message) => {
    navigate(`/shop-homepage/conversation/${message.conversation_id}`, { state: { name: message.name, conversation_id: message.conversation_id } });
  };

  return (
    <div className="message-list-container">
      <h1>Messages</h1>
      {messages.length === 0 ? (
        <p className="no-messages">No messages found</p>
      ) : (
        messages.map((message, index) => (
          <div key={`${message.id}-${index}`} className="message-item" onClick={() => handleMessageClick(message)}>
            <h2 className="name">{message.name}</h2>
            <p className="last-message">{message.last_message}</p>
            <p className="date">{new Date(message.date).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
