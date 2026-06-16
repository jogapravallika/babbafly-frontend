import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const splashCanvasRef = useRef(null);
  const titleRef = useRef(null);
  const [strokesDrawn, setStrokesDrawn] = useState(false);

  // Paint brushstrokes on the BabbaFly title
  useEffect(() => {
    const splashCanvas = splashCanvasRef.current;
    if (!splashCanvas) return;
    const ctx = splashCanvas.getContext('2d');
    splashCanvas.width = 700;
    splashCanvas.height = 180;

    // Brushstroke colors like in the 2nd image: bold, varied colors
    const strokes = [
      // Yellow wide stroke going diagonally behind the text
      { color: '#FFD600', x1: -20, y1: 110, x2: 720, y2: 55, width: 38, alpha: 0.92 },
      // Red stroke overlapping
      { color: '#FF1744', x1: 30, y1: 145, x2: 680, y2: 120, width: 28, alpha: 0.85 },
      // Blue stroke going the other way
      { color: '#2979FF', x1: -10, y1: 30, x2: 710, y2: 80, width: 22, alpha: 0.80 },
      // Green accent stroke
      { color: '#00E676', x1: 60, y1: 155, x2: 640, y2: 135, width: 16, alpha: 0.75 },
      // Pink stroke
      { color: '#FF4081', x1: 0, y1: 65, x2: 700, y2: 95, width: 14, alpha: 0.70 },
      // Orange small accent
      { color: '#FF6D00', x1: 150, y1: 10, x2: 580, y2: 40, width: 12, alpha: 0.65 },
    ];

    let strokeIndex = 0;
    let progress = 0;
    const speed = 0.045;

    function drawBrushStroke(ctx, x1, y1, x2, y2, width, color, alpha, progress) {
      const px = x1 + (x2 - x1) * progress;
      const py = y1 + (y2 - y1) * progress;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Bristle effect: draw multiple slightly offset lines
      for (let b = 0; b < 5; b++) {
        const offsetY = (b - 2) * (width / 10);
        const offsetAlpha = alpha * (1 - Math.abs(b - 2) * 0.18);
        ctx.globalAlpha = offsetAlpha;
        ctx.lineWidth = width * (1 - Math.abs(b - 2) * 0.12);
        ctx.beginPath();
        ctx.moveTo(x1 + (Math.random() - 0.5) * 3, y1 + offsetY);
        ctx.lineTo(px + (Math.random() - 0.5) * 3, py + offsetY);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Animate strokes one by one
    function animateStrokes() {
      if (strokeIndex >= strokes.length) {
        setStrokesDrawn(true);
        return;
      }

      progress += speed;
      if (progress > 1) {
        progress = 1;
      }

      // Redraw all completed strokes + current in progress
      ctx.clearRect(0, 0, splashCanvas.width, splashCanvas.height);

      // Draw completed strokes fully
      for (let i = 0; i < strokeIndex; i++) {
        const s = strokes[i];
        drawBrushStroke(ctx, s.x1, s.y1, s.x2, s.y2, s.width, s.color, s.alpha, 1);
      }

      // Draw current stroke in progress
      const current = strokes[strokeIndex];
      drawBrushStroke(ctx, current.x1, current.y1, current.x2, current.y2, current.width, current.color, current.alpha, progress);

      if (progress >= 1) {
        strokeIndex++;
        progress = 0;
        setTimeout(() => requestAnimationFrame(animateStrokes), 80);
      } else {
        requestAnimationFrame(animateStrokes);
      }
    }

    // Start after a short delay
    const timer = setTimeout(() => animateStrokes(), 300);
    return () => clearTimeout(timer);
  }, []);

  // Click splash particles on main canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    function createSplash(x, y) {
      for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 / 20) * i;
        const speed = Math.random() * 5 + 2;
        const colors = ['#FFD600', '#FF1744', '#2979FF', '#00E676', '#FF4081', '#ffffff', '#FF6D00'];
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: Math.random() * 0.02 + 0.015,
          size: Math.random() * 7 + 3,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }

    let autoInterval = setInterval(() => {
      const cx = canvas.width / 2;
      const cy = canvas.height * 0.35;
      const offsetX = (Math.random() - 0.5) * 350;
      createSplash(cx + offsetX, cy + (Math.random() - 0.5) * 60);
    }, 2500);

    canvas.addEventListener('click', (e) => {
      createSplash(e.clientX, e.clientY);
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life -= p.decay;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
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
      {/* Click-splash particle canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }} />

      {/* Background blobs */}
      <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,20,147,0.12)', top: '-150px', left: '-100px', filter: 'blur(90px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', width: '450px', height: '450px', borderRadius: '50%', background: 'rgba(255,0,128,0.1)', bottom: '-100px', right: '-100px', filter: 'blur(90px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(0,100,255,0.12)', top: '30%', right: '10%', filter: 'blur(70px)', zIndex: 0 }} />

      <div style={{ textAlign: 'center', zIndex: 1, padding: '20px', maxWidth: '700px', position: 'relative' }}>
        <span style={{ fontSize: '70px', display: 'block', marginBottom: '10px', filter: 'drop-shadow(0 0 30px rgba(255,20,147,0.6))' }}>🚀</span>

        {/* BabbaFly with paint brushstroke effect */}
        <div ref={titleRef} style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>

          {/* Brushstroke canvas — sits behind the text */}
          <canvas
            ref={splashCanvasRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '700px',
              maxWidth: '130vw',
              height: '180px',
              zIndex: 0,
              pointerEvents: 'none',
              mixBlendMode: 'screen',   // blends the paint strokes with the dark bg beautifully
            }}
          />

          <h1 style={{
            position: 'relative',
            zIndex: 2,
            fontSize: '96px',
            fontWeight: '900',
            margin: '0 0 10px 0',
            background: 'linear-gradient(135deg, #ff1493, #ff69b4, #ffffff, #4fc3f7, #ff1493)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-3px',
            lineHeight: 1.1,
            filter: 'drop-shadow(0 0 40px rgba(255,20,147,0.5))',
            animation: 'pulse 3s ease-in-out infinite',
            cursor: 'default',
            userSelect: 'none',
            padding: '10px 20px',
          }}>
            BabbaFly
          </h1>
        </div>

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