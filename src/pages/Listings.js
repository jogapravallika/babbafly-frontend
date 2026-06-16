import React from 'react';
import { useNavigate } from 'react-router-dom';

function Listings() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #0d1b4b 40%, #1a0533 70%, #0a0e27 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Pink glow blobs */}
      <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,20,147,0.12)', top: '-150px', left: '-100px', filter: 'blur(90px)' }} />
      <div style={{ position: 'absolute', width: '450px', height: '450px', borderRadius: '50%', background: 'rgba(255,0,128,0.1)', bottom: '-100px', right: '-100px', filter: 'blur(90px)' }} />
      <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(0,100,255,0.12)', top: '30%', right: '10%', filter: 'blur(70px)' }} />
      <div style={{ position: 'absolute', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,20,147,0.08)', bottom: '20%', left: '5%', filter: 'blur(60px)' }} />

      <div style={{ textAlign: 'center', zIndex: 1, padding: '20px', maxWidth: '650px' }}>
        <span style={{ fontSize: '70px', display: 'block', marginBottom: '10px', filter: 'drop-shadow(0 0 30px rgba(255,20,147,0.6))' }}>🚀</span>

        <h1 style={{
          fontSize: '90px',
          fontWeight: '900',
          margin: '0 0 10px 0',
          background: 'linear-gradient(135deg, #ff1493, #ff69b4, #ffffff, #4fc3f7, #ff1493)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-3px',
          lineHeight: 1,
          filter: 'drop-shadow(0 0 40px rgba(255,20,147,0.4))'
        }}>
          BabbaFly
        </h1>

        <p style={{ color: '#f8b4d9', fontSize: '20px', marginBottom: '8px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '300' }}>
          Your Travel, Your Way
        </p>
        <p style={{ color: '#a0b4cc', fontSize: '15px', marginBottom: '15px', lineHeight: '1.7' }}>
          Discover the best deals on Cars 🚗, Bikes 🏍️, Flights ✈️ and Trains 🚂 — all across India, all in one place.
        </p>
        <p style={{ color: '#7090b0', fontSize: '14px', marginBottom: '45px', fontStyle: 'italic' }}>
          "Travel is the only thing you buy that makes you richer." ✨
        </p>

        <div style={{ display: 'flex', gap: '18px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/all-listings')}
            style={{
              padding: '16px 50px',
              background: 'linear-gradient(135deg, #ff1493, #ff69b4)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '700',
              boxShadow: '0 8px 30px rgba(255,20,147,0.5)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(255,20,147,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,20,147,0.5)'; }}
          >
            🗂️ View Listings
          </button>

          <button
            onClick={() => navigate('/my-bookings')}
            style={{
              padding: '16px 50px',
              background: 'transparent',
              color: '#f8b4d9',
              border: '2px solid rgba(255,105,180,0.5)',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '700',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,20,147,0.15)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(255,105,180,0.9)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,105,180,0.5)'; }}
          >
            📋 My Bookings
          </button>
        </div>

        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginTop: '60px', flexWrap: 'wrap' }}>
          {[
            { num: '50+', label: 'Cities', color: '#ff1493' },
            { num: '1000+', label: 'Listings', color: '#4fc3f7' },
            { num: '4', label: 'Categories', color: '#ff69b4' },
            { num: '24/7', label: 'Support', color: '#81d4fa' }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ color: stat.color, fontSize: '32px', fontWeight: '900', margin: 0, textShadow: `0 0 20px ${stat.color}88` }}>{stat.num}</p>
              <p style={{ color: '#7090b0', fontSize: '12px', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient line */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #ff1493, #4fc3f7, #ff69b4, #0064ff, #ff1493)' }} />
    </div>
  );
}

export default Listings;