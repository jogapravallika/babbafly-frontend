import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

      {/* Background blobs */}
      <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(233,69,96,0.12)', top: '-150px', left: '-150px', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(69,183,209,0.1)', bottom: '-100px', right: '-100px', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(150,206,180,0.08)', top: '40%', left: '60%', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(245,86,108,0.08)', top: '20%', right: '10%', filter: 'blur(50px)' }} />

      {/* Main Content */}
      <div style={{ textAlign: 'center', zIndex: 1, padding: '20px' }}>

        {/* Logo */}
        <div style={{ marginBottom: '15px' }}>
          <span style={{ fontSize: '80px', filter: 'drop-shadow(0 0 30px rgba(233,69,96,0.5))' }}>🚀</span>
        </div>

        {/* Brand Name - Big & Colorful */}
        <h1 style={{
          fontSize: '96px',
          fontWeight: '900',
          margin: '0 0 5px 0',
          background: 'linear-gradient(135deg, #ff6b6b, #e94560, #f5576c, #45b7d1, #96ceb4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-3px',
          lineHeight: 1,
          textShadow: 'none',
          filter: 'drop-shadow(0 0 40px rgba(233,69,96,0.3))'
        }}>
          BabbaFly
        </h1>

        {/* Tagline */}
        <p style={{ color: '#cbd5e0', fontSize: '22px', marginBottom: '8px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '300' }}>
          Your Travel, Your Way
        </p>

        {/* Sub tagline */}
        <p style={{ color: '#718096', fontSize: '16px', marginBottom: '45px', maxWidth: '500px', lineHeight: '1.6' }}>
          Book Cars 🚗 · Bikes 🏍️ · Flights ✈️ · Trains 🚂 across India — all in one place
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/listings')}
            style={{
              padding: '16px 48px',
              background: 'linear-gradient(135deg, #45b7d1, #96ceb4)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '700',
              boxShadow: '0 8px 30px rgba(69,183,209,0.4)',
              transition: 'all 0.3s',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(69,183,209,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(69,183,209,0.4)'; }}
          >
            🗂️ View Listings
          </button>

          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '16px 48px',
              background: 'linear-gradient(135deg, #e94560, #f5576c)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '700',
              boxShadow: '0 8px 30px rgba(233,69,96,0.4)',
              transition: 'all 0.3s',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(233,69,96,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(233,69,96,0.4)'; }}
          >
            🎉 Register Now
          </button>

          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '16px 48px',
              background: 'transparent',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '700',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'white'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            🔐 Login
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '50px', justifyContent: 'center', marginTop: '60px', flexWrap: 'wrap' }}>
          {[
            { num: '50+', label: 'Cities', color: '#e94560' },
            { num: '1000+', label: 'Listings', color: '#45b7d1' },
            { num: '4', label: 'Categories', color: '#96ceb4' },
            { num: '24/7', label: 'Support', color: '#f5576c' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ color: stat.color, fontSize: '36px', fontWeight: '900', margin: 0 }}>{stat.num}</p>
              <p style={{ color: '#718096', fontSize: '13px', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #e94560, #45b7d1, #96ceb4, #f5576c, #e94560)' }} />
    </div>
  );
}

export default Home;
