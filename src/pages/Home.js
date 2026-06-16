import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    function createSplash(x, y) {
      for (let i = 0; i < 18; i++) {
        const angle = (Math.PI * 2 / 18) * i;
        const speed = Math.random() * 4 + 2;
        const colors = ['#ff1493', '#ff69b4', '#4fc3f7', '#ffffff', '#ff6b6b', '#45b7d1'];
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: Math.random() * 0.02 + 0.015,
          size: Math.random() * 5 + 2,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }

    // Auto splash on BabbaFly title area every 2 seconds
    let autoInterval = setInterval(() => {
      const cx = canvas.width / 2;
      const cy = canvas.height * 0.38;
      const offsetX = (Math.random() - 0.5) * 300;
      createSplash(cx + offsetX, cy);
    }, 1800);

    canvas.addEventListener('click', (e) => {
      createSplash(e.clientX, e.clientY);
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life -= p.decay;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(autoInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #0d1b4b 40%, #1a0533 70%, #0a0e27 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Canvas for splash particles */}
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }} />

      {/* Background blobs */}
      <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,20,147,0.12)', top: '-150px', left: '-100px', filter: 'blur(90px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', width: '450px', height: '450px', borderRadius: '50%', background: 'rgba(255,0,128,0.1)', bottom: '-100px', right: '-100px', filter: 'blur(90px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(0,100,255,0.12)', top: '30%', right: '10%', filter: 'blur(70px)', zIndex: 0 }} />

      <div style={{ textAlign: 'center', zIndex: 1, padding: '20px', maxWidth: '650px', position: 'relative' }}>
        <span style={{ fontSize: '70px', display: 'block', marginBottom: '10px', filter: 'drop-shadow(0 0 30px rgba(255,20,147,0.6))' }}>🚀</span>

        {/* BabbaFly with animated glow */}
        <h1 style={{
          fontSize: '96px',
          fontWeight: '900',
          margin: '0 0 10px 0',
          background: 'linear-gradient(135deg, #ff1493, #ff69b4, #ffffff, #4fc3f7, #ff1493)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-3px',
          lineHeight: 1,
          filter: 'drop-shadow(0 0 40px rgba(255,20,147,0.5))',
          animation: 'pulse 3s ease-in-out infinite',
          cursor: 'default',
          userSelect: 'none'
        }}>
          BabbaFly
        </h1>

        <style>{`
          @keyframes pulse {
            0%, 100% { filter: drop-shadow(0 0 30px rgba(255,20,147,0.4)); }
            50% { filter: drop-shadow(0 0 60px rgba(255,20,147,0.8)) drop-shadow(0 0 100px rgba(79,195,247,0.4)); }
          }
        `}</style>

        <p style={{ color: '#f8b4d9', fontSize: '20px', marginBottom: '8px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '300' }}>
          Your Travel, Your Way
        </p>
        <p style={{ color: '#a0b4cc', fontSize: '15px', marginBottom: '45px', lineHeight: '1.7' }}>
          Book Cars 🚗 · Bikes 🏍️ · Flights ✈️ · Trains 🚂 across India — all in one place
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/register')}
            style={{ padding: '16px 48px', background: 'linear-gradient(135deg, #ff1493, #ff69b4)', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', boxShadow: '0 8px 30px rgba(255,20,147,0.5)', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,20,147,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,20,147,0.5)'; }}>
            🎉 Register Now
          </button>
          <button onClick={() => navigate('/login')}
            style={{ padding: '16px 48px', background: 'transparent', color: '#f8b4d9', border: '2px solid rgba(255,105,180,0.5)', borderRadius: '50px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', backdropFilter: 'blur(10px)', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,20,147,0.15)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            🔐 Login
          </button>
        </div>

        <div style={{ display: 'flex', gap: '50px', justifyContent: 'center', marginTop: '60px', flexWrap: 'wrap' }}>
          {[
            { num: '50+', label: 'Cities', color: '#ff1493' },
            { num: '1000+', label: 'Listings', color: '#4fc3f7' },
            { num: '4', label: 'Categories', color: '#ff69b4' },
            { num: '24/7', label: 'Support', color: '#81d4fa' }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ color: stat.color, fontSize: '36px', fontWeight: '900', margin: 0, textShadow: `0 0 20px ${stat.color}88` }}>{stat.num}</p>
              <p style={{ color: '#7090b0', fontSize: '13px', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #ff1493, #4fc3f7, #ff69b4, #0064ff, #ff1493)', zIndex: 1 }} />
    </div>
  );
}

export default Home;