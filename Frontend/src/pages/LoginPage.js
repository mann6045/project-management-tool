import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../api'; // Use the new api helper

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize the navigate function

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post('/login', {
                email: email,
                password: password
            });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard'); // Redirect to dashboard on success
        } catch (error) {
            setMessage(error.response?.data?.error || 'Login failed.');
        }
    };

    // ... (the return part of the component is the same) ...
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default LoginPage;