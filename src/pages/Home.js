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

        {/* BabbaFly with paint-splash backdrop */}
        <div style={{ position: 'relative', display: 'inline-block' }}>

          {/* Comic paint splash sitting behind the word */}
          <svg
            viewBox="155 0 380 430"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '600px',
              maxWidth: '130vw',
              height: 'auto',
              zIndex: 0,
              pointerEvents: 'none',
              animation: 'splashWobble 6s ease-in-out infinite'
            }}
          >
            <defs>
              <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff1493" />
                <stop offset="40%" stopColor="#ff69b4" />
                <stop offset="70%" stopColor="#b06bff" />
                <stop offset="100%" stopColor="#4fc3f7" />
              </linearGradient>
            </defs>

            <path
              d="M 487.58,190.00 C 486.62,201.78 492.85,213.83 490.48,224.63 C 488.12,235.42 479.63,245.31 473.40,254.77 C 467.17,264.22 459.58,271.72 453.10,281.34 C 446.63,290.96 442.65,303.76 434.55,312.49 C 426.45,321.21 415.26,326.71 404.50,333.71 C 393.74,340.71 382.50,350.12 369.97,354.50 C 357.45,358.87 340.36,367.15 329.36,359.97 C 318.36,352.79 312.37,322.56 303.96,311.41 C 295.54,300.26 288.78,297.72 278.85,293.08 C 268.92,288.44 255.46,288.71 244.37,283.58 C 233.29,278.44 220.80,271.42 212.34,262.25 C 203.89,253.07 195.22,240.58 193.64,228.54 C 192.06,216.50 197.58,201.54 202.86,190.00 C 208.14,178.46 221.06,169.90 225.33,159.27 C 229.60,148.64 225.70,137.04 228.48,126.22 C 231.26,115.40 234.67,102.40 242.03,94.35 C 249.39,86.29 263.62,85.67 272.62,77.89 C 281.62,70.12 286.20,54.22 296.03,47.70 C 305.87,41.18 319.91,37.50 331.64,38.76 C 343.36,40.02 354.76,52.56 366.36,55.24 C 377.97,57.92 391.08,51.09 401.25,54.86 C 411.43,58.63 420.11,69.36 427.42,77.84 C 434.72,86.32 435.14,99.06 445.08,105.76 C 455.02,112.47 478.52,110.04 487.06,118.07 C 495.59,126.10 496.20,141.96 496.28,153.94 C 496.37,165.93 488.55,178.22 487.58,190.00 Z"
              fill="url(#splashGrad)"
              stroke="#05030f"
              strokeWidth="7"
              strokeLinejoin="round"
            />

            {/* drips oozing down from the splash */}
            <circle cx="300" cy="375" r="17" fill="#ff69b4" stroke="#05030f" strokeWidth="5" />
            <circle cx="349" cy="393" r="12" fill="#b06bff" stroke="#05030f" strokeWidth="5" />
            <circle cx="324" cy="416" r="7" fill="#4fc3f7" stroke="#05030f" strokeWidth="4" />

            {/* small accent splatter dots */}
            <circle cx="520" cy="78" r="9" fill="#ff1493" stroke="#05030f" strokeWidth="4" />
            <circle cx="183" cy="140" r="6" fill="#4fc3f7" stroke="#05030f" strokeWidth="4" />
          </svg>

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
            WebkitTextStroke: '2px rgba(4,3,12,0.55)',
            textShadow: '0 4px 10px rgba(0,0,0,0.45)',
            letterSpacing: '-3px',
            lineHeight: 1,
            filter: 'drop-shadow(0 0 40px rgba(255,20,147,0.5))',
            animation: 'pulse 3s ease-in-out infinite',
            cursor: 'default',
            userSelect: 'none'
          }}>
            BabbaFly
          </h1>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { filter: drop-shadow(0 0 30px rgba(255,20,147,0.4)); }
            50% { filter: drop-shadow(0 0 60px rgba(255,20,147,0.8)) drop-shadow(0 0 100px rgba(79,195,247,0.4)); }
          }
          @keyframes splashWobble {
            0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
            50% { transform: translate(-50%, -50%) scale(1.025) rotate(0.6deg); }
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