import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Listings() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef({
    bubbleLetters: [],
    particles: [],
    phase: 'inflate',
    phaseT: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const WORD = 'BabbaFly';
    const COLORS = [
      '#ff1493', '#c2185b', '#1565c0', '#4fc3f7',
      '#0d47a1', '#ff69b4', '#1976d2', '#e91e8c'
    ];

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function makeShards(bl) {
      bl.shards = [];
      const count = 14 + Math.floor(Math.random() * 8);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
        const speed = 2.5 + Math.random() * 4;
        bl.shards.push({
          x: bl.targetX, y: bl.targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 4 + Math.random() * 10,
          life: 1,
          color: bl.color,
          type: Math.random() > 0.5 ? 'bubble' : 'dot',
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: (Math.random() - 0.5) * 0.15,
        });
      }
    }

    function initLetters() {
      const s = stateRef.current;
      s.bubbleLetters = [];
      s.particles = [];
      s.phase = 'inflate';
      s.phaseT = 0;

      ctx.font = '900 72px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const totalWidth = ctx.measureText(WORD).width;
      let curX = canvas.width / 2 - totalWidth / 2;
      const cy = canvas.height / 2;

      WORD.split('').forEach((ch, i) => {
        const w = ctx.measureText(ch).width;
        const tx = curX + w / 2;
        s.bubbleLetters.push({
          ch, idx: i,
          targetX: tx,
          targetY: cy,
          y: -80 - i * 18,
          scale: 0,
          opacity: 0,
          bubbleR: 0,
          targetBubbleR: 36 + i * 1.5,
          color: COLORS[i % COLORS.length],
          shattered: false,
          shards: [],
          rebuildProgress: 0,
        });
        curX += w + 2;
      });
    }

    function spawnFloatParticle() {
      const s = stateRef.current;
      if (Math.random() < 0.25) {
        s.particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 10,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(0.5 + Math.random() * 1.2),
          r: 2 + Math.random() * 5,
          life: 1,
          color: Math.random() > 0.5 ? '#ff1493' : '#4fc3f7',
        });
      }
    }

    function drawBubbleLetter(bl) {
      const x = bl.targetX;
      const y = bl.targetY;

      if (bl.shattered && bl.rebuildProgress < 1) {
        bl.shards.forEach(s => {
          if (s.life <= 0) return;
          ctx.save();
          ctx.globalAlpha = s.life * 0.85;
          if (s.type === 'bubble') {
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = s.color + '33';
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.beginPath();
            ctx.arc(s.x - s.r * 0.3, s.y - s.r * 0.3, s.r * 0.22, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });
        return;
      }

      if (bl.shattered && bl.rebuildProgress >= 1) {
        ctx.save();
        ctx.globalAlpha = bl.opacity;
        ctx.font = '900 72px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = bl.color;
        ctx.shadowBlur = 28;
        ctx.fillStyle = bl.color;
        ctx.fillText(bl.ch, x, y);
        ctx.shadowBlur = 0;
        ctx.restore();
        return;
      }

      const r = bl.bubbleR * bl.scale;
      if (r <= 0) return;

      ctx.save();
      ctx.globalAlpha = bl.opacity;

      // outer glow
      const glow = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 1.35);
      glow.addColorStop(0, bl.color + '00');
      glow.addColorStop(0.7, bl.color + '22');
      glow.addColorStop(1, bl.color + '44');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(x, y, r * 1.35, 0, Math.PI * 2); ctx.fill();

      // bubble body
      const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.05, x, y, r);
      grad.addColorStop(0, 'rgba(255,255,255,0.18)');
      grad.addColorStop(0.4, bl.color + '55');
      grad.addColorStop(0.85, bl.color + 'aa');
      grad.addColorStop(1, bl.color + 'dd');
      ctx.strokeStyle = bl.color;
      ctx.lineWidth = 2.5;
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      // shine
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath(); ctx.arc(x - r * 0.32, y - r * 0.32, r * 0.18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath(); ctx.arc(x + r * 0.25, y + r * 0.28, r * 0.09, 0, Math.PI * 2); ctx.fill();

      // letter inside
      ctx.font = `900 ${Math.max(10, r * 1.1)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.shadowColor = bl.color;
      ctx.shadowBlur = 12;
      ctx.fillText(bl.ch, x, y);
      ctx.shadowBlur = 0;

      ctx.restore();
    }

    function update() {
      const s = stateRef.current;
      s.phaseT++;
      spawnFloatParticle();

      s.particles = s.particles.filter(p => p.life > 0);
      s.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.007; });

      if (s.phase === 'inflate') {
        s.bubbleLetters.forEach((bl, i) => {
          if (s.phaseT > i * 8) {
            bl.y += (bl.targetY - bl.y) * 0.12;
            bl.scale = Math.min(bl.scale + 0.045, 1);
            bl.bubbleR += (bl.targetBubbleR - bl.bubbleR) * 0.1;
            bl.opacity = Math.min(bl.opacity + 0.06, 1);
          }
        });
        const last = s.bubbleLetters[s.bubbleLetters.length - 1];
        if (last.scale > 0.95 && s.phaseT > (WORD.length - 1) * 8 + 30) {
          s.phase = 'hold'; s.phaseT = 0;
        }
      }

      if (s.phase === 'hold') {
        s.bubbleLetters.forEach((bl, i) => {
          bl.bubbleR = bl.targetBubbleR + Math.sin(Date.now() * 0.003 + i) * 2;
        });
        if (s.phaseT > 80) { s.phase = 'shatter'; s.phaseT = 0; }
      }

      if (s.phase === 'shatter') {
        s.bubbleLetters.forEach((bl, i) => {
          if (s.phaseT > i * 5 && !bl.shattered) {
            bl.shattered = true;
            makeShards(bl);
          }
        });
        s.bubbleLetters.forEach(bl => {
          if (!bl.shattered) return;
          bl.shards.forEach(sh => {
            sh.x += sh.vx; sh.y += sh.vy;
            sh.vy += 0.12; sh.vx *= 0.97;
            sh.life -= 0.022;
            sh.wobble += sh.wobbleSpeed;
            sh.r += Math.sin(sh.wobble) * 0.3;
          });
        });
        const allDone = s.bubbleLetters.every(bl => bl.shattered && bl.shards.every(sh => sh.life <= 0));
        if (allDone || s.phaseT > 130) { s.phase = 'rebuild'; s.phaseT = 0; }
      }

      if (s.phase === 'rebuild') {
        s.bubbleLetters.forEach((bl, i) => {
          if (s.phaseT > i * 10) {
            bl.rebuildProgress = Math.min(bl.rebuildProgress + 0.05, 1);
            bl.opacity = Math.min(bl.opacity + 0.04, 1);
          }
        });
        const last = s.bubbleLetters[s.bubbleLetters.length - 1];
        if (last.rebuildProgress >= 1 && s.phaseT > (WORD.length - 1) * 10 + 50) {
          s.phase = 'hold2'; s.phaseT = 0;
        }
      }

      if (s.phase === 'hold2') {
        if (s.phaseT > 100) initLetters();
      }
    }

    function draw() {
      const s = stateRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // float bubbles
      s.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.life * 0.4;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = p.color + '22'; ctx.fill();
        ctx.restore();
      });

      s.bubbleLetters.forEach(drawBubbleLetter);
    }

    function loop() {
      update();
      draw();
      animRef.current = requestAnimationFrame(loop);
    }

    initLetters();
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

      {/* BabbaFly bubble shatter canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      <div style={{ textAlign: 'center', zIndex: 3, padding: '20px', maxWidth: '650px' }}>
        <span style={{ fontSize: '70px', display: 'block', marginBottom: '10px', filter: 'drop-shadow(0 0 30px rgba(255,20,147,0.6))' }}>🚀</span>

        {/* Spacer where BabbaFly canvas renders */}
        <div style={{ height: '110px' }} />

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