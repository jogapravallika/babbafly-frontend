import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Listings from './pages/Listings';
import Home from './pages/Home';
import Admin from './pages/Admin';
import './App.css';

function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  if (isHome) return null;

  const user = JSON.parse(localStorage.getItem('user'));

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

      {/* Login అయిన తర్వాత మాత్రమే Admin button కనిపిస్తుంది */}
      {user && (
        <Link to="/admin" style={{
          marginLeft: 'auto',
          background: '#e94560',
          color: 'white',
          textDecoration: 'none',
          fontWeight: '700',
          padding: '8px 18px',
          borderRadius: '10px'
        }}>
          ➕ Add Listing
        </Link>
      )}
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
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;