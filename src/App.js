import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Listings from './pages/Listings';
import Home from './pages/Home';
import './App.css';

function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Home page lo navbar show cheyyadhu
  if (isHome) return null;

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 50%, #f3e5f5 100%)',
      padding: '15px 25px',
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2 style={{ color: '#e94560', margin: 0 }}>🚀 BabbaFly</h2>
      </Link>
      <Link to="/listings" style={{ color: '#333', textDecoration: 'none', fontWeight: '600' }}>Home</Link>
      <Link to="/register" style={{ color: '#333', textDecoration: 'none', fontWeight: '600' }}>Register</Link>
      <Link to="/login" style={{ color: '#333', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;