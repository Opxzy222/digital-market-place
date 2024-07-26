import React, { useState } from 'react';
import axios from 'axios';
import '../CSS/signin.css';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate hook


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
          const { user_id, session_id } = responseData
          // Save the session token to local storage
          localStorage.setItem('sessionToken', {session_id})
          localStorage.setItem('user_id', user_id);
          // Call the onSignIn function passed from App.js
          onSignIn();
          //Navigate to the homepage after successful sign-in
          navigate('/', { state: { user_id } });
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
          <button type='submit' className='signin-button'>Sign In</button>
        </form>
        <div className='change-password'>
          <Link to='signup' className='change-pass-Link'>forgot password?</Link>
        </div>
        <div className='signup-contain'>
          <p>don't have an account yet?</p>
          <Link to='/signup' className='signup-Link'>Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
