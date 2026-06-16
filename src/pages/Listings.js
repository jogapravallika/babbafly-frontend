import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Listings() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef({ letters: [], flames: [], t: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const WORD = 'BabbaFly';
    const COLS = ['#ff1493','#c2185b','#1565c0','#4fc3f7','#0d47a1','#ff69b4','#1976d2','#e91e8c'];

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); init(); });

    function init() {
      const s = stateRef.current;
      s.letters = []; s.flames = []; s.t = 0;
      ctx.font = 'bold 68px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const totalW = ctx.measureText(WORD).width;
      let dx = canvas.width / 2 - totalW / 2;
      const targetY = canvas.height / 2 - 20;
      WORD.split('').forEach((ch, i) => {
        const w = ctx.measureText(ch).width;
        s.letters.push({
          ch, i, x: dx + w / 2,
          y: -60 - i * 20,
          targetY,
          col: COLS[i % COLS.length],
          settled: false, settleT: 0, glow: 0
        });
        dx += w;
      });
    }

    function spawnFlame(x, y, col, count, big) {
      const s = stateRef.current;
      for (let i = 0; i < count; i++) {
        s.flames.push({
          x: x + (Math.random() - 0.5) * (big ? 18 : 10),
          y: y + 5,
          vx: (Math.random() - 0.5) * (big ? 1.2 : 0.7),
          vy: -(big ? 0.6 + Math.random() * 1.2 : 0.3 + Math.random() * 0.7),
          life: 1,
          r: big ? 4 + Math.random() * 6 : 2 + Math.random() * 4,
          col
        });
      }
    }

    function update() {
      const s = stateRef.current;
      s.t++;

      s.letters.forEach((l, i) => {
        if (s.t < i * 10) return;
        if (!l.settled) {
          l.y += (l.targetY - l.y) * 0.13;
          if (s.t % 3 === 0) spawnFlame(l.x, l.y, l.col, 1, false);
          if (Math.abs(l.y - l.targetY) < 1) {
            l.y = l.targetY; l.settled = true;
            spawnFlame(l.x, l.y, l.col, 8, true);
          }
        } else {
          l.settleT++;
          l.glow = Math.min(l.glow + 0.05, 1);
          if (l.settleT < 40 && s.t % 6 === 0) spawnFlame(l.x, l.y + 14, l.col, 1, false);
        }
      });

      s.flames = s.flames.filter(f => f.life > 0);
      s.flames.forEach(f => {
        f.x += f.vx; f.y += f.vy;
        f.vy -= 0.02; f.vx *= 0.97;
        f.life -= 0.055; f.r *= 0.97;
      });

      const allSettled = s.letters.every(l => l.settled);
      const lastT = s.letters[s.letters.length - 1]?.settleT || 0;
      if (allSettled && lastT > 110) init();
    }

    function draw() {
      const s = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // glow blobs
      [{x:.2,y:.3,c:'rgba(255,20,147,0.07)'},{x:.8,y:.65,c:'rgba(21,101,192,0.09)'}].forEach(b => {
        const g = ctx.createRadialGradient(canvas.width*b.x, canvas.height*b.y, 0, canvas.width*b.x, canvas.height*b.y, 160);
        g.addColorStop(0, b.c); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // flames
      s.flames.forEach(f => {
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
        g.addColorStop(0, 'rgba(255,255,255,0.75)');
        g.addColorStop(0.3, f.col + 'cc');
        g.addColorStop(0.75, f.col + '44');
        g.addColorStop(1, f.col + '00');
        ctx.save(); ctx.globalAlpha = f.life * 0.7;
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      // letters
      ctx.font = 'bold 68px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      s.letters.forEach(l => {
        if (l.y < -100) return;
        ctx.save();
        ctx.shadowColor = l.col;
        ctx.shadowBlur = l.settled ? 26 * l.glow : 8;
        ctx.fillStyle = l.settled ? l.col : `hsl(${15 + l.i * 9},100%,62%)`;
        ctx.globalAlpha = l.settled ? 1 : 0.88;
        ctx.fillText(l.ch, l.x, l.y);
        ctx.shadowBlur = 0;
        ctx.restore();
      });
    }

    function loop() {
      update(); draw();
      animRef.current = requestAnimationFrame(loop);
    }

    init();
    loop();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020818 0%, #060d2e 40%, #0d0520 70%, #020818 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glow blobs */}
      <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,20,147,0.1)', top: '-150px', left: '-100px', filter: 'blur(90px)' }} />
      <div style={{ position: 'absolute', width: '450px', height: '450px', borderRadius: '50%', background: 'rgba(21,101,192,0.12)', bottom: '-100px', right: '-100px', filter: 'blur(90px)' }} />
      <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(79,195,247,0.1)', top: '30%', right: '10%', filter: 'blur(70px)' }} />
      <div style={{ position: 'absolute', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,20,147,0.07)', bottom: '20%', left: '5%', filter: 'blur(60px)' }} />

      {/* Flame canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          zIndex: 2
        }}
      />

      <div style={{ textAlign: 'center', zIndex: 3, padding: '20px', maxWidth: '650px' }}>
        <span style={{ fontSize: '70px', display: 'block', marginBottom: '10px', filter: 'drop-shadow(0 0 30px rgba(255,20,147,0.6))' }}>🚀</span>

        {/* Spacer for BabbaFly canvas */}
        <div style={{ height: '100px' }} />

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
              color: 'white', border: 'none', borderRadius: '50px',
              cursor: 'pointer', fontSize: '18px', fontWeight: '700',
              boxShadow: '0 8px 30px rgba(255,20,147,0.5)', transition: 'all 0.3s'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(255,20,147,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,20,147,0.5)'; }}
          >
            🗂️ View Listings
          </button>

          <button
            onClick={() => navigate('/my-bookings')}
            style={{
              padding: '16px 50px', background: 'transparent',
              color: '#f8b4d9', border: '2px solid rgba(255,105,180,0.5)',
              borderRadius: '50px', cursor: 'pointer', fontSize: '18px',
              fontWeight: '700', backdropFilter: 'blur(10px)', transition: 'all 0.3s'
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