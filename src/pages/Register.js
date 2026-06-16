import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://babbafly-backend-ae30.onrender.com';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Warm up the backend the moment this page loads. Render's free tier
  // spins down idle services, so the FIRST request after inactivity can
  // take 20-50s. Firing a lightweight ping now (while the user is still
  // typing) means the server is usually already awake by the time they
  // click Register, instead of making them wait through the cold start.
  useEffect(() => {
    axios.get(`${API}/`).catch(() => {}); // fire-and-forget, ignore errors/timeouts
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent double-submits firing duplicate requests

    // Quick client-side check so obviously-incomplete forms fail instantly
    // instead of waiting on a round trip to the server.
    if (!form.name || !form.email || !form.phone || !form.password) {
      setMessage('❌ Please fill in all fields');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post(`${API}/api/users/register`, form, { timeout: 60000 });
      setMessage('✅ ' + res.data.message);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setMessage('❌ Server is taking too long to respond. Please try again.');
      } else {
        setMessage('❌ ' + (err.response?.data?.message || 'Something went wrong'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #0d1b4b 40%, #1a0533 70%, #0a0e27 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Pink glow blobs */}
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,20,147,0.12)', top: '-100px', left: '-80px', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(0,100,255,0.1)', bottom: '-80px', right: '-80px', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,105,180,0.08)', top: '50%', right: '5%', filter: 'blur(50px)' }} />

      {/* Floating icons */}
      <div style={{ position: 'absolute', fontSize: '40px', top: '10%', left: '5%', opacity: 0.15 }}>✈️</div>
      <div style={{ position: 'absolute', fontSize: '35px', top: '70%', left: '8%', opacity: 0.12 }}>🚗</div>
      <div style={{ position: 'absolute', fontSize: '38px', top: '20%', right: '6%', opacity: 0.13 }}>🏍️</div>
      <div style={{ position: 'absolute', fontSize: '36px', bottom: '15%', right: '5%', opacity: 0.12 }}>🚂</div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(255,105,180,0.2)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,20,147,0.1)',
        zIndex: 1
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <span style={{ fontSize: '45px', filter: 'drop-shadow(0 0 15px rgba(255,20,147,0.6))' }}>🚀</span>
          <h1 style={{
            background: 'linear-gradient(135deg, #ff1493, #ff69b4, #ffffff, #4fc3f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '28px',
            fontWeight: '800',
            margin: '5px 0 0'
          }}>BabbaFly</h1>
        </div>

        <h2 style={{ color: '#ff69b4', textAlign: 'center', marginBottom: '25px', fontSize: '22px', fontWeight: '700' }}>Create Account</h2>

        {message && (
          <div style={{
            textAlign: 'center', padding: '10px', borderRadius: '10px', marginBottom: '15px',
            background: message.includes('✅') ? 'rgba(104,211,145,0.15)' : 'rgba(252,129,129,0.15)',
            border: `1px solid ${message.includes('✅') ? '#68d391' : '#fc8181'}`,
            color: message.includes('✅') ? '#68d391' : '#fc8181', fontWeight: '600'
          }}>{message}</div>
        )}

        {[
          { name: 'name', placeholder: '👤 Full Name', type: 'text' },
          { name: 'email', placeholder: '📧 Email Address', type: 'email' },
          { name: 'phone', placeholder: '📱 Phone Number', type: 'tel' },
          { name: 'password', placeholder: '🔒 Password', type: 'password' },
        ].map((field) => (
          <input key={field.name} name={field.name} type={field.type} placeholder={field.placeholder}
            onChange={handleChange} disabled={loading}
            style={{
              width: '100%', padding: '14px 16px', margin: '8px 0', borderRadius: '12px',
              border: '1px solid rgba(255,105,180,0.25)', background: 'rgba(255,255,255,0.06)',
              color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              opacity: loading ? 0.6 : 1
            }}
          />
        ))}

        <button onClick={handleSubmit} disabled={loading}
          style={{
            width: '100%', padding: '14px',
            background: loading ? 'rgba(255,20,147,0.4)' : 'linear-gradient(135deg, #ff1493, #ff69b4)',
            color: 'white', border: 'none', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '15px', fontSize: '16px', fontWeight: '700',
            boxShadow: loading ? 'none' : '0 6px 25px rgba(255,20,147,0.5)', letterSpacing: '0.5px'
          }}>
          {loading ? '⏳ Creating account...' : '🎉 Register Now'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#a0b4cc', fontSize: '14px' }}>
          Already have account?{' '}
          <span onClick={() => navigate('/login')}
            style={{ color: '#ff69b4', cursor: 'pointer', fontWeight: '600' }}>
            Login here
          </span>
        </p>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #ff1493, #4fc3f7, #ff69b4, #0064ff, #ff1493)' }} />
    </div>
  );
}

export default Register;