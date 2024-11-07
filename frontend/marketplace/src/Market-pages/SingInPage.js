import React, { useState } from 'react';
import axios from 'axios';
import '../CSS/signin.css';
import { useNavigate, Link } from 'react-router-dom';

function SignInPage({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    try {
      const response = await axios.post('https://172.24.210.76:8000/login/', formData);
      const responseData = response.data;

      if (responseData.message === 'login successful') {
        const { user_id, session_id } = responseData;
        localStorage.setItem('sessionToken', session_id);
        localStorage.setItem('user_id', user_id);
        onSignIn();
        navigate('/', { state: { user_id } });
      } else {
        console.error('Login failed:', responseData.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className='is-container'>
      <div className='is-signin-container'>
        <h2 className='is-title'>Sign In</h2>
        <form onSubmit={handleSubmit} className='is-form'>
          <div className='is-form-group'>
            <label htmlFor='email' className='is-label'>Email</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='is-input'
            />
          </div>
          <div className='is-form-group'>
            <label htmlFor='password' className='is-label'>Password</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='is-input'
            />
          </div>
          <button type='submit' className='is-signin-button'>Sign In</button>
        </form>
        <div className='is-change-password'>
          <Link to='/forgot-password' className='is-change-pass-link'>Forgot password?</Link>
        </div>
        <div className='is-signup-contain'>
          <p className='is-signup-text'>Don't have an account yet?</p>
          <Link to='/signup' className='is-signup-link'>Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
