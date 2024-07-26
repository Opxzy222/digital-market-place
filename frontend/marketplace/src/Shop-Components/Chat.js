import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import '../Shop-CSS/SendMessage.css';

const Chat = ({ fetchMessagesUrl, sendMessageUrl, conversationId }) => {
  const userId = localStorage.getItem('user_id');
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(fetchMessagesUrl);
        setMessages(response.data);

        // Mark messages as read
        await axios.post('/mark-messages-read/', {
          conversation_id: conversationId,
          user_id: userId
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Error fetching messages', error);
      }
    };
    fetchMessages();
  }, [fetchMessagesUrl, conversationId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    try {
      const messageData = {
        sender_id: userId,
        shop_id: conversationId,
        content: content
      };

      const response = await axios.post(sendMessageUrl, messageData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Add new message to messages state
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setContent('');
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  return (
    <div className="send-message-container">
      <div className="messages-list">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.sender_id === Number(userId) ? 'sent' : 'received'}`}>
            <p>{message.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="message-input">
        <textarea
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
