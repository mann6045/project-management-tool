import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; // Import the dashboard
import './App.css';

// A simple component to check for auth and protect routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // If no token, redirect to login
    return <LoginPage />;
  }
  return children;
};

// A helper component for the main layout to access navigate
const AppLayout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="App">
            <header className="App-header">
                <nav>
                    {!token ? (
                        <>
                            <Link to="/register" style={{ margin: '10px' }}>Register</Link>
                            <Link to="/login" style={{ margin: '10px' }}>Login</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" style={{ margin: '10px' }}>Dashboard</Link>
                            <button onClick={handleLogout} style={{ margin: '10px' }}>Logout</button>
                        </>
                    )}
                </nav>
                <h1>Project Management Tool</h1>
                <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="/" element={<h2>Welcome! Please register or login.</h2>} />
                </Routes>
            </header>
        </div>
    );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;