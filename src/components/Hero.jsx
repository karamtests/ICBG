import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronDown, Calendar, Users, Target } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const title3Ref = useRef(null);
  const descRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-bg-zoom',
        { scale: 1.15, filter: 'blur(8px) brightness(0.3)' },
        { scale: 1.0, filter: 'blur(0px) brightness(0.45)', duration: 2.2, ease: 'power2.out' }
      );

      tl.fromTo(
        [title1Ref.current, title2Ref.current, title3Ref.current],
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 },
        '-=1.4'
      );

      tl.fromTo(
        descRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0 },
        '-=0.8'
      );

      tl.fromTo(
        statsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0 },
        '-=0.6'
      );

      tl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.5'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToCollection = () => {
    const element = document.getElementById('collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden flex items-end justify-start bg-obsidian"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div 
          className="hero-bg-zoom absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('/assets/images/hero-bg.jpeg')` }}
        />
        {/* Cinematic Vignette & Bottom Obsidian Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/45 to-transparent z-10" />
        <div className="absolute inset-0 bg-radial-gradient z-10 opacity-60 pointer-events-none" />
      </div>

      {/* Hero Content - Occupies Bottom-Left Third */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-24 flex flex-col items-start">
        
        {/* Subtle Badge */}
        <div 
          ref={title1Ref} 
          className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-champagne/30 bg-obsidian/60 backdrop-blur-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-champagne animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.25em] text-champagne uppercase font-bold">
            Private Atelier
          </span>
        </div>

        {/* Cinematic Asymmetric Typography */}
        <h1 className="font-sans font-black text-4xl sm:text-6xl md:text-8xl tracking-tight leading-[0.95] text-ivory text-left max-w-4xl">
          <div ref={title2Ref} className="block overflow-hidden pb-1">
            THE PREMIER BOARD GAME
          </div>
          <div ref={title3Ref} className="font-serif italic font-light text-champagne block mt-2">
            Experience.
          </div>
        </h1>

        {/* Description Copy */}
        <p
          ref={descRef}
          className="mt-6 font-sans text-base md:text-lg text-ivory/70 max-w-xl text-left font-light leading-relaxed"
        >
          Every Thursday & Friday night at Cortina.D Cafe, Irbid. 
          A curated private members' gathering dedicated to deep strategic gameplay, 
          unrivaled camaraderie, and the art of tabletop mastery.
        </p>

        {/* Live Quick Info Panel */}
        <div 
          ref={statsRef}
          className="mt-8 flex flex-wrap gap-x-8 gap-y-4 py-6 border-t border-b border-ivory/10 w-full max-w-xl"
        >
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-champagne" />
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-ivory/40">Schedule</p>
              <p className="font-sans text-xs font-semibold text-ivory">Thu & Fri @ 7:30 PM</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users size={18} className="text-champagne" />
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-ivory/40">Gathering Size</p>
              <p className="font-sans text-xs font-semibold text-ivory">80+ Active Members</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Target size={18} className="text-champagne" />
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-ivory/40">Location</p>
              <p className="font-sans text-xs font-semibold text-ivory">Cortina.D Cafe</p>
            </div>
          </div>
        </div>

        {/* CTA scroll down */}
        <div ref={ctaRef} className="mt-10 flex items-center gap-4">
          <button
            onClick={scrollToCollection}
            className="magnetic-btn px-8 py-4 bg-gradient-to-r from-champagne to-[#E5CE8B] text-obsidian font-sans font-bold text-xs uppercase tracking-widest shadow-xl shadow-champagne/10 hover:shadow-champagne/30"
          >
            <span className="slide-bg"></span>
            <span className="relative z-10">Explore Collection</span>
          </button>
          
          <button
            onClick={() => {
              const el = document.getElementById('about');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="lift-link px-6 py-4 border border-ivory/20 hover:border-champagne/40 bg-transparent text-ivory font-sans font-medium text-xs uppercase tracking-widest rounded-full transition-colors duration-300"
          >
            Our Philosophy
          </button>
        </div>
      </div>

      {/* Down Chevron Indicator */}
      <div 
        onClick={scrollToCollection}
        className="absolute bottom-8 right-12 z-20 hidden md:flex flex-col items-center gap-2 cursor-pointer group"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-ivory/40 group-hover:text-champagne transition-colors duration-300">
          Scroll
        </span>
        <ChevronDown size={16} className="text-ivory/40 animate-bounce group-hover:text-champagne transition-colors duration-300" />
      </div>
    </section>
  );
}
