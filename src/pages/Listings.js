import React from 'react';
import { useNavigate } from 'react-router-dom';

function Listings() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8d5f5 0%, #d4b8e0 30%, #c9a8d4 60%, #e8d5f5 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background blobs */}
      <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(180,120,220,0.2)', top: '-150px', left: '-150px', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(200,160,230,0.2)', bottom: '-100px', right: '-100px', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(150,100,200,0.15)', top: '40%', left: '60%', filter: 'blur(60px)' }} />

      <div style={{ textAlign: 'center', zIndex: 1, padding: '20px', maxWidth: '650px' }}>
        <span style={{ fontSize: '70px', display: 'block', marginBottom: '10px', filter: 'drop-shadow(0 0 20px rgba(150,80,200,0.4))' }}>🚀</span>

        <h1 style={{
          fontSize: '90px',
          fontWeight: '900',
          margin: '0 0 10px 0',
          background: 'linear-gradient(135deg, #7b2d8b, #9b59b6, #6c3483, #45b7d1, #8e44ad)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-3px',
          lineHeight: 1,
          filter: 'drop-shadow(0 2px 8px rgba(120,60,180,0.2))'
        }}>
          BabbaFly
        </h1>

        <p style={{ color: '#6c3483', fontSize: '20px', marginBottom: '8px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '600' }}>
          Your Travel, Your Way
        </p>
        <p style={{ color: '#7d3c98', fontSize: '15px', marginBottom: '15px', lineHeight: '1.7' }}>
          Discover the best deals on Cars 🚗, Bikes 🏍️, Flights ✈️ and Trains 🚂 — all across India, all in one place.
        </p>
        <p style={{ color: '#9b59b6', fontSize: '14px', marginBottom: '45px', fontStyle: 'italic' }}>
          "Travel is the only thing you buy that makes you richer." ✨
        </p>

        <div style={{ display: 'flex', gap: '18px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/all-listings')}
            style={{
              padding: '16px 50px',
              background: 'linear-gradient(135deg, #8e44ad, #9b59b6)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '700',
              boxShadow: '0 8px 25px rgba(142,68,173,0.4)',
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
              background: 'rgba(142,68,173,0.1)',
              color: '#6c3483',
              border: '2px solid rgba(142,68,173,0.4)',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '700',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(142,68,173,0.2)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(142,68,173,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            📋 My Bookings
          </button>
        </div>

        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginTop: '60px', flexWrap: 'wrap' }}>
          {[
            { num: '50+', label: 'Cities', color: '#8e44ad' },
            { num: '1000+', label: 'Listings', color: '#6c3483' },
            { num: '4', label: 'Categories', color: '#9b59b6' },
            { num: '24/7', label: 'Support', color: '#7d3c98' }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ color: stat.color, fontSize: '32px', fontWeight: '900', margin: 0 }}>{stat.num}</p>
              <p style={{ color: '#9b59b6', fontSize: '12px', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #8e44ad, #45b7d1, #9b59b6, #6c3483, #8e44ad)' }} />
    </div>
  );
}

export default Listings;