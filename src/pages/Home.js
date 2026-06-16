import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const sceneRef = useRef(null);

  // Letter hue wave
  useEffect(() => {
    const letters = 'BabbaFly'.split('');
    let wave = 0;
    let rafId;

    function setTitle() {
      if (!titleRef.current) return;
      titleRef.current.innerHTML = letters.map((l, i) => {
        const hue = (wave + i * 45) % 360;
        const c = `hsl(${hue},100%,65%)`;
        return `<span style="color:${c};text-shadow:0 0 25px ${c},0 0 55px ${c}55;display:inline-block">${l}</span>`;
      }).join('');
    }

    function tick() {
      wave = (wave + 3) % 360;
      setTitle();
      rafId = requestAnimationFrame(tick);
    }
    setTitle();
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Galaxy orbit + burst canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    if (!canvas || !scene) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = scene.offsetWidth;
      canvas.height = scene.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const PALETTE = ['#ff1493','#FFD600','#00cfff','#00FF94','#FF6D00','#bf5fff','#ff4dab','#ffffff'];

    function getTitleRect() {
      if (!titleRef.current || !scene) return { cx: canvas.width/2, cy: canvas.height/2, w: 400, h: 100 };
      const r = scene.getBoundingClientRect();
      const t = titleRef.current.getBoundingClientRect();
      return {
        cx: t.left - r.left + t.width / 2,
        cy: t.top - r.top + t.height / 2,
        w: t.width, h: t.height
      };
    }

    // Orbiting particles
    const orbiters = [];
    for (let i = 0; i < 55; i++) {
      const orbitR = 80 + Math.random() * 140;
      const speed = (0.008 + Math.random() * 0.018) * (Math.random() > 0.5 ? 1 : -1);
      const phase = Math.random() * Math.PI * 2;
      const tilt = (Math.random() - 0.5) * 0.8;
      orbiters.push({
        orbitR, speed, phase, tilt,
        size: 1.5 + Math.random() * 3.5,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        trailLen: 8 + Math.floor(Math.random() * 18),
        history: [],
        alpha: 0.6 + Math.random() * 0.4
      });
    }

    // Burst particles
    let bursters = [];
    function spawnBurst(x, y) {
      for (let i = 0; i < 22; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 3 + Math.random() * 7;
        bursters.push({
          x, y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 1,
          decay: 0.018 + Math.random() * 0.012,
          size: 2 + Math.random() * 5,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)]
        });
      }
    }

    // Auto burst
    const autoInterval = setInterval(() => {
      const { cx, cy, w, h } = getTitleRect();
      const ox = (Math.random() - 0.5) * w * 0.7;
      const oy = (Math.random() - 0.5) * h * 0.5;
      spawnBurst(cx + ox, cy + oy);
    }, 900);

    // Initial burst
    setTimeout(() => {
      const { cx, cy } = getTitleRect();
      spawnBurst(cx, cy);
      for (let i = 0; i < 3; i++) {
        setTimeout(() => spawnBurst(cx + (Math.random() - 0.5) * 120, cy + (Math.random() - 0.5) * 40), i * 150);
      }
    }, 200);

    // Click burst
    const handleClick = (e) => {
      const r = scene.getBoundingClientRect();
      spawnBurst(e.clientX - r.left, e.clientY - r.top);
    };
    scene.addEventListener('click', handleClick);

    let animId;
    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { cx, cy } = getTitleRect();

      // Orbiters
      orbiters.forEach(o => {
        o.phase += o.speed;
        const x = cx + Math.cos(o.phase) * o.orbitR;
        const y = cy + Math.sin(o.phase) * o.orbitR * (0.28 + Math.abs(o.tilt) * 0.3);
        o.history.push({ x, y });
        if (o.history.length > o.trailLen) o.history.shift();

        for (let j = 0; j < o.history.length - 1; j++) {
          const t = j / o.history.length;
          ctx.save();
          ctx.globalAlpha = t * o.alpha * 0.55;
          ctx.strokeStyle = o.color;
          ctx.lineWidth = o.size * t * 0.8;
          ctx.shadowBlur = 8;
          ctx.shadowColor = o.color;
          ctx.beginPath();
          ctx.moveTo(o.history[j].x, o.history[j].y);
          ctx.lineTo(o.history[j + 1].x, o.history[j + 1].y);
          ctx.stroke();
          ctx.restore();
        }

        ctx.save();
        ctx.globalAlpha = o.alpha;
        ctx.fillStyle = o.color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = o.color;
        ctx.beginPath();
        ctx.arc(x, y, o.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Bursters
      for (let i = bursters.length - 1; i >= 0; i--) {
        const b = bursters[i];
        b.x += b.vx; b.y += b.vy;
        b.vy += 0.08;
        b.vx *= 0.97; b.vy *= 0.97;
        b.life -= b.decay;
        if (b.life <= 0) { bursters.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = b.life * 0.9;
        ctx.fillStyle = b.color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size * b.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(autoInterval);
      window.removeEventListener('resize', resize);
      scene.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #0d1b4b 40%, #1a0533 70%, #0a0e27 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'
      }}
    >
      {/* Galaxy canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}
      />

      {/* Background blobs */}
      <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,20,147,0.12)', top: '-150px', left: '-100px', filter: 'blur(90px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', width: '450px', height: '450px', borderRadius: '50%', background: 'rgba(255,0,128,0.1)', bottom: '-100px', right: '-100px', filter: 'blur(90px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(0,100,255,0.12)', top: '30%', right: '10%', filter: 'blur(70px)', zIndex: 0 }} />

      <div style={{ textAlign: 'center', zIndex: 1, padding: '20px', maxWidth: '700px', position: 'relative' }}>
        <span style={{ fontSize: '70px', display: 'block', marginBottom: '10px', filter: 'drop-shadow(0 0 30px rgba(255,20,147,0.6))' }}>🚀</span>

        {/* BabbaFly title */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
          <h1
            ref={titleRef}
            style={{
              fontSize: '96px',
              fontWeight: '900',
              margin: '0 0 10px 0',
              letterSpacing: '-3px',
              lineHeight: 1.1,
              padding: '10px 20px',
              cursor: 'default',
              userSelect: 'none',
              fontFamily: 'Arial Black, Impact, sans-serif'
            }}
          >
            BabbaFly
          </h1>
        </div>

        <p style={{ color: '#f8b4d9', fontSize: '20px', marginBottom: '8px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '300' }}>
          Your Travel, Your Way
        </p>
        <p style={{ color: '#a0b4cc', fontSize: '15px', marginBottom: '45px', lineHeight: '1.7' }}>
          Book Cars 🚗 · Bikes 🏍️ · Flights ✈️ · Trains 🚂 across India — all in one place
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={e => { e.stopPropagation(); navigate('/register'); }}
            style={{ padding: '16px 48px', background: 'linear-gradient(135deg, #ff1493, #ff69b4)', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', boxShadow: '0 8px 30px rgba(255,20,147,0.5)', transition: 'all 0.3s', position: 'relative', zIndex: 10 }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,20,147,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,20,147,0.5)'; }}>
            🎉 Register Now
          </button>
          <button
            onClick={e => { e.stopPropagation(); navigate('/login'); }}
            style={{ padding: '16px 48px', background: 'transparent', color: '#f8b4d9', border: '2px solid rgba(255,105,180,0.5)', borderRadius: '50px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', backdropFilter: 'blur(10px)', transition: 'all 0.3s', position: 'relative', zIndex: 10 }}
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