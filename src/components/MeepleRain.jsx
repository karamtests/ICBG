import React, { useState, useEffect, useRef } from 'react';

// Exact SVG path of a classic Carcassonne Meeple, scaled to fit in a 100x100 square
const MEEPLE_PATH_DATA = 
  "M 50 15 C 57 15 62 20 62 27 C 62 34 57 39 50 39 C 43 39 38 34 38 27 C 38 20 43 15 50 15 Z M 50 42 C 40 42 31 46 22 51 C 18 53 14 57 15 62 C 16 67 22 66 27 64 C 33 62 38 59 40 60 C 40 63 38 73 37 81 C 36 86 35 91 38 93 C 41 95 46 95 48 93 C 50 91 50 83 50 83 C 50 83 50 91 52 93 C 54 95 59 95 62 93 C 65 91 64 86 63 81 C 62 73 60 63 60 60 C 62 59 67 62 73 64 C 78 66 84 67 85 62 C 86 57 82 53 78 51 C 69 46 60 42 50 42 Z";

const SCORE_PHRASES = [
  "+4 Victory Points! 🏆",
  "Farmer Placed! 🌾",
  "Knight Scored! 🛡️",
  "Monastery Completed! ⛪",
  "Road Claimed! 🛣️",
  "Plonk! 🎲",
  "Strategic Placement! 💡",
  "Meeples Reunited! 💖",
  "Carcassonne Legend! 🌟",
  "Meeple Power! ⚡"
];

export default function MeepleRain({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  const meeplesRef = useRef([]);
  const popsRef = useRef([]); // Confetti particles from popped meeples
  const floatersRef = useRef([]); // Floating text indicators
  const timersRef = useRef([]);

  const addTimer = (id) => {
    timersRef.current.push(id);
    return id;
  };

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Classic meeple colors in modern vibrant variants
    const colors = [
      '#f8b146', // Sunset Gold
      '#f28a75', // Sunset Coral
      '#3b82f6', // Tabletop Royal Blue
      '#10b981', // Forest Green
      '#8b5cf6', // Imperial Purple
      '#ef4444', // Cardinal Red
    ];

    // Build meeple path object
    const meeplePath = new Path2D(MEEPLE_PATH_DATA);

    // Populate 55 falling meeples
    const meeples = [];
    for (let i = 0; i < 55; i++) {
      meeples.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -Math.random() * window.innerHeight - 80, // Staggered entry above screen
        vy: Math.random() * 4 + 2.5, // Gravity fall speed
        vx: (Math.random() - 0.5) * 1.5, // Small side-to-side drift
        size: Math.random() * 12 + 28, // Sizing in px (28px to 40px)
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
      });
    }
    meeplesRef.current = meeples;
    popsRef.current = [];
    floatersRef.current = [];

    // Trigger click/tap popping detector
    const handleMouseInteraction = (clientX, clientY) => {
      const remainingMeeples = [];
      let poppedAny = false;

      meeplesRef.current.forEach(m => {
        const dist = Math.hypot(m.x - clientX, m.y - clientY);
        // Hitbox threshold based on size
        if (dist < m.size / 1.3) {
          poppedAny = true;
          
          // 1. Spawn a gold/coral splash burst
          for (let p = 0; p < 12; p++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 5 + 2;
            popsRef.current.push({
              x: m.x,
              y: m.y,
              vx: Math.cos(angle) * velocity,
              vy: Math.sin(angle) * velocity - 1.5,
              color: m.color,
              size: Math.random() * 5 + 3,
              alpha: 1,
              decay: Math.random() * 0.02 + 0.015,
            });
          }

          // 2. Spawn a floating text banner
          floatersRef.current.push({
            x: m.x,
            y: m.y - 15,
            text: SCORE_PHRASES[Math.floor(Math.random() * SCORE_PHRASES.length)],
            vy: -1.2,
            alpha: 1,
            decay: 0.015,
          });
        } else {
          remainingMeeples.push(m);
        }
      });

      if (poppedAny) {
        meeplesRef.current = remainingMeeples;
      }
    };

    const handleMouseDown = (e) => {
      handleMouseInteraction(e.clientX, e.clientY);
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        handleMouseInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchstart', handleTouchStart);

    // Setup active animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // A. DRAW AND ANIMATE POP CONFETTI PARTICLES
      const activePops = [];
      popsRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // Gravity pull
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          activePops.push(p);
        }
      });
      popsRef.current = activePops;

      // B. DRAW AND ANIMATE FLOATING SCORE TEXT
      const activeFloaters = [];
      floatersRef.current.forEach(f => {
        f.y += f.vy;
        f.alpha -= f.decay;

        if (f.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = f.alpha;
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#f8b146';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(f.text, f.x, f.y);
          ctx.restore();
          activeFloaters.push(f);
        }
      });
      floatersRef.current = activeFloaters;

      // C. DRAW AND FALL MEEPLES
      meeplesRef.current.forEach(m => {
        m.y += m.vy;
        m.x += m.vx;
        m.rotation += m.rotationSpeed;

        // Wrap around bottom boundary gracefully
        if (m.y > window.innerHeight + 80) {
          m.y = -80;
          m.x = Math.random() * window.innerWidth;
        }

        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.rotation);
        ctx.scale(m.size / 100, m.size / 100);
        ctx.translate(-50, -50); // Offset to path center of mass

        // Shaded wooden gradient look on Meeples
        ctx.fillStyle = m.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0,0,0,0.35)';
        ctx.fill(meeplePath);

        // Soft internal highlights to give Meeple simulated thickness/3D texture
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 2.5;
        ctx.stroke(meeplePath);

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Auto-timeout after exactly 8 seconds of meeple drops
    const endTimer = addTimer(setTimeout(() => {
      setFadeClass('opacity-0');
      addTimer(setTimeout(() => {
        if (onClose) onClose();
      }, 500));
    }, 8000));

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [isOpen]);

  const [fadeClass, setFadeClass] = useState('opacity-0');

  useEffect(() => {
    if (isOpen) {
      setFadeClass('opacity-100');
    } else {
      setFadeClass('opacity-0');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-500 ease-in-out pointer-events-auto select-none ${fadeClass}`}>
      {/* Underlying backing drop color */}
      <div className="absolute inset-0 bg-[#1d0a21]/50 backdrop-blur-[3px] pointer-events-none" />

      {/* Dynamic interactive canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair z-10"
      />

      {/* Float overlay instructions */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center bg-[#3a1d42]/70 border border-white/10 backdrop-blur-md px-6 py-2.5 rounded-full shadow-lg">
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#f8b146] font-bold">
          🌾 CARCASSONNE MEEPLE STORM! 🌾
        </span>
        <p className="font-sans text-[10px] text-[#C8B1CC] mt-0.5 font-light">
          Click or hover falling meeples to pop them for strategic points!
        </p>
      </div>
    </div>
  );
}
