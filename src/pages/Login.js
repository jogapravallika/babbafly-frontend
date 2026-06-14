import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://babbafly-backend-ae30.onrender.com';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/users/login`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMessage('✅ Login Successful!');
      setTimeout(() => navigate('/listings'), 1500); // ✅ listings కి navigate
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Background glows */}
      <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(233,69,96,0.1)', top: '-80px', right: '-80px', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(69,183,209,0.08)', bottom: '-60px', left: '-60px', filter: 'blur(60px)' }} />

      {/* Floating icons */}
      <div style={{ position: 'absolute', fontSize: '40px', top: '10%', right: '5%', opacity: 0.15 }}>✈️</div>
      <div style={{ position: 'absolute', fontSize: '35px', bottom: '20%', right: '8%', opacity: 0.12 }}>🚗</div>
      <div style={{ position: 'absolute', fontSize: '38px', top: '25%', left: '6%', opacity: 0.13 }}>🏍️</div>
      <div style={{ position: 'absolute', fontSize: '36px', bottom: '10%', left: '5%', opacity: 0.12 }}>🚂</div>
      <div style={{ position: 'absolute', fontSize: '30px', top: '55%', right: '4%', opacity: 0.1 }}>🚀</div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
        zIndex: 1
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <span style={{ fontSize: '45px' }}>🚀</span>
          <h1 style={{
            background: 'linear-gradient(135deg, #ffffff, #e94560)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '28px',
            fontWeight: '800',
            margin: '5px 0 0'
          }}>BabbaFly</h1>
        </div>

        <h2 style={{ color: '#e94560', textAlign: 'center', marginBottom: '25px', fontSize: '22px', fontWeight: '700' }}>Welcome Back!</h2>

        {message && (
          <div style={{
            textAlign: 'center',
            padding: '10px',
            borderRadius: '10px',
            marginBottom: '15px',
            background: message.includes('✅') ? 'rgba(104,211,145,0.15)' : 'rgba(252,129,129,0.15)',
            border: `1px solid ${message.includes('✅') ? '#68d391' : '#fc8181'}`,
            color: message.includes('✅') ? '#68d391' : '#fc8181',
            fontWeight: '600'
          }}>{message}</div>
        )}

        <div>
          {[
            { name: 'email', placeholder: '📧 Email Address', type: 'email' },
            { name: 'password', placeholder: '🔒 Password', type: 'password' },
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '14px 16px',
                margin: '8px 0',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.08)',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          ))}

          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #e94560, #f5576c)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              marginTop: '15px',
              fontSize: '16px',
              fontWeight: '700',
              boxShadow: '0 6px 20px rgba(233,69,96,0.4)',
              letterSpacing: '0.5px'
            }}
          >
            🔐 Login
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#a0aec0', fontSize: '14px' }}>
          No account?{' '}
          <span
            onClick={() => navigate('/register')}
            style={{ color: '#e94560', cursor: 'pointer', fontWeight: '600' }}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;