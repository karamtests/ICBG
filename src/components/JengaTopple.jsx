import React, { useState, useEffect, useRef } from 'react';

const TOTAL_BLOCKS = 18;

// Individual 3D Block Component to keep rendering clean
function JengaBlock3D({ index, visibleBlocks, isToppled }) {
  const L = Math.floor(index / 3); // Layer number (0 to 5)
  const k = index % 3;             // Position inside layer (0, 1, 2)
  const isEvenLayer = L % 2 === 0;

  // Block dimensions in px
  const w = 96;
  const h = 18;
  const d = 32;

  const isVisible = index < visibleBlocks;

  // Stacking parameters
  const yOffset = L * 20; // Stack vertically along Y
  const sideOffset = (k - 1) * 34; // Side-by-side spacing

  // Rotation: Even layers along X (rotateY = 0), Odd layers along Z (rotateY = 90)
  const rotateYBase = isEvenLayer ? 0 : 90;
  const xBase = isEvenLayer ? 0 : sideOffset;
  const zBase = isEvenLayer ? sideOffset : 0;

  // Collapse / Toppling calculations
  // Top blocks fall first, creating a top-down collapsing domino effect
  const delay = (TOTAL_BLOCKS - 1 - index) * 50;

  let transformStyle = {};
  if (!isToppled) {
    // Staggered assembly phase: drop blocks with bouncy spring physics
    const currentY = isVisible ? yOffset : yOffset + 100;
    const currentScale = isVisible ? 1 : 1.3;
    const currentOpacity = isVisible ? 1 : 0;

    transformStyle = {
      position: 'absolute',
      width: `${w}px`,
      height: `${h}px`,
      transformStyle: 'preserve-3d',
      transform: `translate3d(${xBase}px, ${-currentY}px, ${zBase}px) rotateY(${rotateYBase}deg) scale(${currentScale})`,
      opacity: currentOpacity,
      transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    };
  } else {
    // Staggered Jenga physics-like collapse: fly out radially and drop down
    const seed = Math.sin(index * 73) * 110;
    const seedZ = Math.cos(index * 43) * 110;
    const seedY = Math.abs(Math.sin(index * 19)) * 280 + 150; // High downwards pull

    const rotX = Math.sin(index * 13) * 380;
    const rotY = Math.cos(index * 29) * 380;
    const rotZ = Math.sin(index * 47) * 380;

    const fallX = xBase + seed * 2.2;
    const fallZ = zBase + seedZ * 2.2;
    const fallY = yOffset - seedY; // negative goes downward in translated container

    transformStyle = {
      position: 'absolute',
      width: `${w}px`,
      height: `${h}px`,
      transformStyle: 'preserve-3d',
      transform: `translate3d(${fallX}px, ${-fallY}px, ${fallZ}px) rotateX(${rotX}deg) rotateY(${rotateYBase + rotY}deg) rotateZ(${rotZ}deg)`,
      opacity: 0,
      transition: `transform 2.0s cubic-bezier(0.25, 0.8, 0.25, 1) ${delay}ms, opacity 1.6s ease-out ${delay + 300}ms`,
    };
  }

  // Premium HSL-based Sunset Colors (shades of gold, coral, and deep violet)
  const isAltColor = (L + k) % 2 === 0;
  
  // Front face gradient class
  const woodColorFront = isAltColor 
    ? 'from-[#f8b146] to-[#f28a75]' // Sunset Gold to Coral
    : 'from-[#643b6e] to-[#4a2b53]'; // Elegant Plum Violet

  // Reusable 3D cuboid face style
  const faceStyle = (translateVal, rotateX = 0, rotateY = 0, widthVal = w, heightVal = h) => ({
    position: 'absolute',
    width: `${widthVal}px`,
    height: `${heightVal}px`,
    backfaceVisibility: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: 'inset 0 1px 3px rgba(255, 255, 255, 0.22), inset 0 -1.5px 3px rgba(0, 0, 0, 0.35)',
    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateVal}px)`,
    left: '0',
    top: '0',
  });

  return (
    <div style={transformStyle}>
      {/* Front Face */}
      <div 
        className={`bg-gradient-to-br ${woodColorFront}`}
        style={faceStyle(d / 2)}
      >
        {/* Fine wooden texture overlay lines */}
        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(90deg,_transparent,_transparent_4px,_rgba(0,0,0,0.15)_4px,_rgba(0,0,0,0.15)_8px)]" />
      </div>

      {/* Back Face */}
      <div 
        className={`bg-gradient-to-br ${woodColorFront}`}
        style={faceStyle(d / 2, 0, 180)}
      >
        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(90deg,_transparent,_transparent_4px,_rgba(0,0,0,0.15)_4px,_rgba(0,0,0,0.15)_8px)]" />
      </div>

      {/* Left End Face */}
      <div 
        className={isAltColor ? 'bg-[#d88927]' : 'bg-[#3b2142]'}
        style={{
          ...faceStyle(w / 2, 0, -90, d, h),
          left: `${(w - d) / 2}px`,
        }}
      >
        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,_transparent,_transparent_3px,_rgba(0,0,0,0.2)_3px,_rgba(0,0,0,0.2)_6px)]" />
      </div>

      {/* Right End Face */}
      <div 
        className={isAltColor ? 'bg-[#d88927]' : 'bg-[#3b2142]'}
        style={{
          ...faceStyle(w / 2, 0, 90, d, h),
          left: `${(w - d) / 2}px`,
        }}
      >
        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,_transparent,_transparent_3px,_rgba(0,0,0,0.2)_3px,_rgba(0,0,0,0.2)_6px)]" />
      </div>

      {/* Top Face */}
      <div 
        className={isAltColor ? 'bg-[#fed49b]' : 'bg-[#7e4f8d]'}
        style={{
          ...faceStyle(h / 2, 90, 0, w, d),
          top: `${(h - d) / 2}px`,
        }}
      >
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.25)_100%)]" />
        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(90deg,_transparent,_transparent_6px,_rgba(0,0,0,0.1)_6px,_rgba(0,0,0,0.1)_12px)]" />
      </div>

      {/* Bottom Face */}
      <div 
        className={isAltColor ? 'bg-[#b6731a]' : 'bg-[#29142d]'}
        style={{
          ...faceStyle(h / 2, -90, 0, w, d),
          top: `${(h - d) / 2}px`,
        }}
      >
        <div className="absolute inset-0 opacity-20 bg-black/40" />
      </div>
    </div>
  );
}

export default function JengaTopple({ isOpen, onClose }) {
  const [visibleBlocks, setVisibleBlocks] = useState(0);
  const [isToppled, setIsToppled] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [fadeClass, setFadeClass] = useState('opacity-0');
  
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const timersRef = useRef([]);

  const addTimer = (id) => {
    timersRef.current.push(id);
    return id;
  };

  // Staggered assembly triggered on open
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsToppled(false);
      setVisibleBlocks(0);
      addTimer(setTimeout(() => setFadeClass('opacity-100'), 50));

      // Staggered assembly: drop blocks every 100ms
      let blockTimer = setInterval(() => {
        setVisibleBlocks(prev => {
          if (prev >= TOTAL_BLOCKS) {
            clearInterval(blockTimer);
            return TOTAL_BLOCKS;
          }
          return prev + 1;
        });
      }, 100);

      return () => clearInterval(blockTimer);
    } else {
      setFadeClass('opacity-0');
      const closeTimer = addTimer(setTimeout(() => {
        setShouldRender(false);
      }, 500));
      return () => clearTimeout(closeTimer);
    }
  }, [isOpen]);

  // Wobble shake and automatic topple physics triggers
  useEffect(() => {
    if (visibleBlocks === TOTAL_BLOCKS && !isToppled) {
      // Hold and wobble shake for 1 second, then collapse Jenga!
      const toppleTimer = addTimer(setTimeout(() => {
        setIsToppled(true);
        triggerExplosion();
        
        // Stays open to show the complete scatter and fade, then closes smoothly
        addTimer(setTimeout(() => {
          setFadeClass('opacity-0');
          addTimer(setTimeout(() => {
            if (onClose) onClose();
          }, 500));
        }, 4200));
      }, 1000));

      return () => clearTimeout(toppleTimer);
    }
  }, [visibleBlocks, isToppled]);

  // Clean up animation frames and all queued timeouts on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Premium particle system burst with physics, gravity, and glows
  const triggerExplosion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const originX = window.innerWidth / 2;
    const originY = window.innerHeight / 2 + 30; // Matches physical epicenter

    const colors = [
      '#f8b146', // Sunset Gold
      '#f28a75', // Sunset Coral
      '#FFECE4', // Shimmering Ivory
      '#FFFFFF', // Pure White
      '#d88927', // Rich Gold
    ];

    const particles = [];
    // Generate 180 high-performance confetti particles
    for (let i = 0; i < 180; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 15 + 5; // Strong radial burst
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 6 - 3, // Initial upward lift
        size: Math.random() * 9 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.012 + 0.007,
        gravity: 0.24,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        shape: Math.random() > 0.45 ? 'circle' : 'rect',
      });
    }
    particlesRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particlesRef.current.forEach(p => {
        if (p.alpha <= 0) return;
        active = true;

        // Apply physics with subtle drag damping
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        // Shiny bloom overlay effect on bright confetti particles
        if (p.color !== '#4a2b53') {
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
        }

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }
        ctx.restore();
      });

      if (active) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animate();
  };

  // Keep canvas responsive
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!shouldRender) return null;

  const isShaking = visibleBlocks === TOTAL_BLOCKS && !isToppled;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#1d0a21]/85 backdrop-blur-lg transition-opacity duration-500 ease-in-out select-none pointer-events-auto ${fadeClass}`}>
      {/* Dynamic Background Confetti Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-10" 
      />

      {/* Secret Toast Banner */}
      <div className={`absolute top-16 md:top-24 font-sans font-black text-center transition-all duration-[800ms] z-20 select-none ${
        isToppled ? 'scale-110 opacity-100 translate-y-0' : 'scale-90 opacity-0 -translate-y-4'
      }`}>
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#f8b146] mb-1.5 font-bold">
          Copyright Collision
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
          JENGA TOPPLED!
        </h2>
        <p className="font-serif italic text-sm md:text-base text-[#C8B1CC] mt-3 max-w-sm mx-auto leading-relaxed">
          "We stacked the copyright high, but gravity claimed the blocks."
        </p>
      </div>

      {/* 3D Viewport wrapper */}
      <div 
        className="relative flex flex-col items-center justify-center z-20 mt-16 md:mt-24"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Beautiful polished dark circular pedestal/platform */}
        <div 
          className="absolute rounded-full bg-[#160619]/90 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.85)]"
          style={{
            width: '280px',
            height: '280px',
            transform: 'rotateX(75deg) translate3d(0px, 0px, -112px)', // Lies flat at the base
          }}
        >
          {/* Inner ring */}
          <div className="absolute inset-2.5 rounded-full border border-[#f8b146]/25 bg-radial-gradient from-[#3a1d42]/30 to-transparent pointer-events-none" />
        </div>

        {/* Stacking Isometric Container */}
        <div 
          className={`relative ${isShaking ? 'tower-shake' : ''}`}
          style={{
            width: '96px',
            height: '120px',
            transformStyle: 'preserve-3d',
            transform: 'rotateX(-22deg) rotateY(45deg)', // Elegant angle showing faces & depths
            transition: isShaking ? 'none' : 'transform 0.8s ease-out',
          }}
        >
          {Array.from({ length: TOTAL_BLOCKS }).map((_, i) => (
            <JengaBlock3D 
              key={i} 
              index={i} 
              visibleBlocks={visibleBlocks} 
              isToppled={isToppled} 
            />
          ))}
        </div>

        {/* Staggered progress loading indicator */}
        {!isToppled && (
          <div className="absolute -bottom-24 font-mono text-[9px] uppercase tracking-[0.2em] text-[#C8B1CC]/50">
            Constructing Copyright... {Math.round((visibleBlocks / TOTAL_BLOCKS) * 100)}%
          </div>
        )}
      </div>
    </div>
  );
}
