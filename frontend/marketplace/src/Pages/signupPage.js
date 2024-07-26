import React, { useState } from 'react';
import axios from 'axios';
import '../CSS/signup.css';
import { useNavigate } from 'react-router-dom';



function SignUpPage() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const handleSignUp = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', email);
        formData.append('firstname', firstName);
        formData.append('lastname', lastName);
        formData.append('password', password)
        try {
            const response = axios.post('http://localhost:8000/create-user/', formData)
            const responseData = response.data;
            console.log(responseData)

            if (responseData.message === 'account created successfully') {
                navigate('/signin')
                alert('user created successfully')
            } else {
                console.error('Sign up failed', responseData.message)
                alert(responseData.message)

            }
        }

        catch(error) {
            console.error('error during signup', error)
        }
     }
    return (
        <div className='signup-page'>
          <h2>Sign Up</h2>
          <div className='signup-container'>
            <form onSubmit={handleSignUp}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div> 
                <div>
                    <label htmlFor='text'>Last name</label>
                    <input type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor='text'>Last name</label>
                    <input type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type='submit' className='signup-button'>Create account</button>
            </form>
          </div>
        </div>
    );
}

export default SignUpPage