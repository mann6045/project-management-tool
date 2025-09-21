import React, { useState } from 'react';
import axios from 'axios';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            // Send a POST request to your backend's register endpoint
            const response = await axios.post('http://127.0.0.1:5000/api/register', {
                username: username,
                email: email,
                password: password
            });
            setMessage(response.data.message); // Set success message
        } catch (error) {
            // If there's an error, display the error message from the backend
            if (error.response && error.response.data.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default RegisterPage;