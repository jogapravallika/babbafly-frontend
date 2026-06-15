import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Listings from './pages/Listings';
import Home from './pages/Home';
import Admin from './pages/Admin';
import MyBookings from './pages/MyBookings';
import './App.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [error, setError] = useState('');

  const isHome = location.pathname === '/';
  if (isHome) return null;

  const user = JSON.parse(localStorage.getItem('user'));

  const handleAdminClick = () => {
    setShowPasswordBox(true);
    setError('');
  };

  const handleAdminSubmit = () => {
    if (adminPass === 'babbafly@123') {
      setShowPasswordBox(false);
      navigate('/admin');
    } else {
      setError('❌ Wrong password!');
    }
  };

  return (
    <>
      <nav style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '15px 25px',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 style={{ color: '#e94560', margin: 0, fontSize: '20px' }}>🚀 BabbaFly</h2>
        </Link>
        <Link to="/listings" style={{ color: '#a0aec0', textDecoration: 'none', fontWeight: '600' }}>Home</Link>
        <Link to="/register" style={{ color: '#a0aec0', textDecoration: 'none', fontWeight: '600' }}>Register</Link>
        <Link to="/login" style={{ color: '#a0aec0', textDecoration: 'none', fontWeight: '600' }}>Login</Link>

        {user && (
          <>
            <Link to="/my-bookings" style={{ color: '#a0aec0', textDecoration: 'none', fontWeight: '600' }}>📋 My Bookings</Link>
            <button onClick={handleAdminClick} style={{
              marginLeft: 'auto',
              background: '#e94560',
              color: 'white',
              border: 'none',
              fontWeight: '700',
              padding: '8px 18px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              ➕ Add Listing
            </button>
          </>
        )}
      </nav>

      {showPasswordBox && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '30px', maxWidth: '350px', width: '90%', textAlign: 'center' }}>
            <h3 style={{ color: '#1a1a2e', marginBottom: '15px' }}>🔐 Admin Access</h3>
            <input
              type="password"
              placeholder="Enter admin password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminSubmit()}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box', outline: 'none' }}
            />
            {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}
            <button onClick={handleAdminSubmit}
              style={{ width: '100%', padding: '12px', background: '#e94560', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', marginBottom: '10px' }}>
              Enter
            </button>
            <button onClick={() => { setShowPasswordBox(false); setAdminPass(''); setError(''); }}
              style={{ width: '100%', padding: '10px', background: 'white', color: '#666', border: '2px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
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
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </Router>
  );
}

export default App;