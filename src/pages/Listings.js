import React from 'react';
import { useNavigate } from 'react-router-dom';

function Listings() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background blobs */}
      <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(233,69,96,0.08)', top: '-150px', left: '-150px', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(69,183,209,0.08)', bottom: '-100px', right: '-100px', filter: 'blur(80px)' }} />

      <div style={{ textAlign: 'center', zIndex: 1, padding: '20px', maxWidth: '650px' }}>
        <span style={{ fontSize: '70px', display: 'block', marginBottom: '10px', filter: 'drop-shadow(0 0 30px rgba(233,69,96,0.5))' }}>🚀</span>

        <h1 style={{
          fontSize: '90px',
          fontWeight: '900',
          margin: '0 0 10px 0',
          background: 'linear-gradient(135deg, #ff6b6b, #e94560, #f5576c, #45b7d1, #96ceb4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-3px',
          lineHeight: 1,
          filter: 'drop-shadow(0 0 40px rgba(233,69,96,0.3))'
        }}>
          BabbaFly
        </h1>

        <p style={{ color: '#cbd5e0', fontSize: '20px', marginBottom: '8px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '300' }}>
          Your Travel, Your Way
        </p>
        <p style={{ color: '#718096', fontSize: '15px', marginBottom: '15px', lineHeight: '1.7' }}>
          Discover the best deals on Cars 🚗, Bikes 🏍️, Flights ✈️ and Trains 🚂 — all across India, all in one place.
        </p>
        <p style={{ color: '#4a5568', fontSize: '14px', marginBottom: '45px', fontStyle: 'italic' }}>
          "Travel is the only thing you buy that makes you richer." ✨
        </p>

        <div style={{ display: 'flex', gap: '18px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/all-listings')}
            style={{
              padding: '16px 50px',
              background: 'linear-gradient(135deg, #e94560, #f5576c)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '700',
              boxShadow: '0 8px 30px rgba(233,69,96,0.4)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            🗂️ View Listings
          </button>

          <button
            onClick={() => navigate('/my-bookings')}
            style={{
              padding: '16px 50px',
              background: 'transparent',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '700',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(233,69,96,0.2)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            📋 My Bookings
          </button>
        </div>

        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginTop: '60px', flexWrap: 'wrap' }}>
          {[
            { num: '50+', label: 'Cities', color: '#e94560' },
            { num: '1000+', label: 'Listings', color: '#45b7d1' },
            { num: '4', label: 'Categories', color: '#96ceb4' },
            { num: '24/7', label: 'Support', color: '#f5576c' }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ color: stat.color, fontSize: '32px', fontWeight: '900', margin: 0 }}>{stat.num}</p>
              <p style={{ color: '#718096', fontSize: '12px', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #e94560, #45b7d1, #96ceb4, #f5576c, #e94560)' }} />
    </div>
  );
}

export default Listings;