import React, { useState } from 'react';
import axios from 'axios';
import './CSS/signin.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function SignInPage({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    try {
      const response = await axios.post('http://localhost:8000/login/', formData);
      const responseData = response.data;

      // Check if the login was successful
      if (responseData.message === 'login successful') {
          // Retrieve the session_id from the response data
          const sessionToken = responseData.session_id;
          console.log(sessionToken);
          // Save the session token to local storage
          localStorage.setItem('sessionToken', sessionToken);
          // Call the onSignIn function passed from App.js
          onSignIn();
          // Navigate to the homepage after successful sign-in
          navigate('/Homepage');
      } else {
          // Handle login failure
          console.error('Login failed:', responseData.message);
      }
  } catch (error) {
      // Handle network errors
      console.error('Error during login:', error);
  }
  };

  return (
    <div className='container'>
      <div className='signin-container'>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type='submit'>Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default SignInPage;
