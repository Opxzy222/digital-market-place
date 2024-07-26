import React, { useState } from 'react';
import axios from 'axios';
import '../CSS/signup.css';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('firstname', firstName);
    formData.append('lastname', lastName);
    formData.append('password', password);

    try {
      const response = await axios.post('https://192.168.0.194:8000/create-user/', formData);
      const responseData = response.data;
      console.log(responseData);

      if (responseData.message === 'account created successfully') {
        navigate('/signin');
        alert('User created successfully');
      } else {
        console.error('Sign up failed', responseData.message);
        alert(responseData.message);
      }
    } catch (error) {
      console.error('Error during signup', error);
    }
  };

  return (
    <div className='is-signup-page'>
      <div className='is-signup-container'>
        <h2 className='is-title'>Sign Up</h2>
        <form onSubmit={handleSignUp} className='is-form'>
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
            <label htmlFor='firstName' className='is-label'>First Name</label>
            <input
              type='text'
              id='firstName'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className='is-input'
            />
          </div>
          <div className='is-form-group'>
            <label htmlFor='lastName' className='is-label'>Last Name</label>
            <input
              type='text'
              id='lastName'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
          <button type='submit' className='is-signup-button'>Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
