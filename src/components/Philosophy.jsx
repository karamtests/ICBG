import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Compass, Calendar, Coffee } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy({ onTriggerMeepleRain }) {
  const containerRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade-up reveal for the header/quote
      gsap.fromTo(
        '.philosophy-header',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          scrollTrigger: {
            trigger: '.philosophy-header',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Scroll-scrub contrast section animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.philosophy-contrast',
          start: 'top 75%',
          end: 'bottom 40%',
          scrub: 1,
        },
      });

      tl.fromTo(
        '.contrast-left',
        { opacity: 0.15, y: 30 },
        { opacity: 1, y: 0, duration: 1.5 }
      );

      tl.fromTo(
        '.contrast-right',
        { opacity: 0.15, y: 50 },
        { opacity: 1, y: 0, duration: 2.0 },
        '-=0.8'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full py-24 md:py-36 bg-transparent overflow-hidden border-b border-white/5"
    >
      {/* Decorative vector assets to emulate Atelier vibe */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-gold-logo/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gold-logo/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* The Manifesto Header */}
        <div 
          onDoubleClick={onTriggerMeepleRain}
          title="Double click to summon the Meeple Storm! 🌾"
          className="philosophy-header flex flex-col items-center text-center mb-20 md:mb-28 cursor-pointer select-none group"
        >
          <Quote className="text-[#f8b146] mb-6 opacity-80 group-hover:scale-110 transition-transform duration-300" size={40} />
          <h2 className="font-serif italic text-3xl md:text-5xl text-white max-w-3xl leading-relaxed group-hover:text-[#f8b146]/95 transition-colors duration-300">
            "We are not merely playing board games. We are preserving the tactile magic of strategic camaraderie in a digital world."
          </h2>
          <div className="w-16 h-[1px] bg-[#f8b146] mt-8 group-hover:w-28 transition-all duration-300" />
        </div>

        {/* Contrast Philosophy Section */}
        <div className="philosophy-contrast grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
          
          {/* Contrast Left Column: Common Focus */}
          <div className="contrast-left flex flex-col items-start text-left bg-[#3a1d42]/30 border border-white/8 shadow-md rounded-[2rem] p-8 md:p-12">
            <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center mb-6">
              <Compass className="text-[#C8B1CC]" size={20} />
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#C8B1CC]/85 mb-3">The Common Path</p>
            <h3 className="font-sans font-black text-2xl md:text-3xl tracking-tight text-white/90 mb-4">
              Most communities focus on:
            </h3>
            <p className="font-sans font-light text-base text-[#C8B1CC] leading-relaxed">
              Passing the time with casual play, standard digital distraction, and unstructured, routine card meetups. Many groups treat gaming as an isolated activity rather than a social incubator.
            </p>
            <div className="w-full h-[1px] bg-white/[0.06] my-6" />
            <div className="flex items-center gap-2 text-xs font-mono text-[#C8B1CC]/70">
              <span>Standard Gaming Groups</span>
            </div>
          </div>

          {/* Contrast Right Column: Private Atelier Focus */}
          <div className="contrast-right flex flex-col items-start text-left bg-[#3a1d42]/45 border border-[#f8b146]/30 shadow-md shadow-[#f8b146]/5 rounded-[2rem] hover:border-[#f8b146]/50 hover:shadow-[0_20px_40px_rgba(248,177,70,0.14)] p-8 md:p-12 relative overflow-hidden group transition-all duration-500 ease-out">
            {/* Corner Gold Foil Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#f8b146]/25 to-transparent pointer-events-none" />
            
            <div className="w-10 h-10 rounded-full bg-[#f8b146]/10 flex items-center justify-center mb-6 border border-[#f8b146]/30 shadow-[0_0_15px_rgba(248,177,70,0.15)]">
              <Coffee className="text-[#f8b146]" size={20} />
            </div>
            
            <p className="font-mono text-xs uppercase tracking-widest text-[#f8b146] mb-3">Our Atelier Way</p>
            <h3 className="font-sans font-black text-3xl md:text-4xl tracking-tight text-white mb-4">
              We focus on:
            </h3>
            
            <p className="font-serif italic font-light text-2xl md:text-3xl text-transparent bg-gradient-to-r from-[#f8b146] to-[#f28a75] bg-clip-text leading-relaxed mb-6">
              "Forging unbreakable bonds, mastering strategic depths, and sharing unforgettable nights."
            </p>
            
            <p className="font-sans font-light text-base text-[#C8B1CC] leading-relaxed mb-6">
              We curate a sanctuary for thinkers. Here, board games are catalysts for dialogue, intellectual sparring, and laughter. Our collection is curated, our atmosphere is upscale, and every table is hosted with intentionality.
            </p>

            <div className="w-full h-[1px] bg-[#f8b146]/20 my-2" />
            
            {/* Live Cortina Event Badge */}
            <div className="mt-4 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#25102a]/60 border border-[#f8b146]/30 shadow-sm">
                <Calendar size={12} className="text-[#f8b146]" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-white font-semibold">Every Thu & Fri @ 7:30 PM</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#25102a]/60 border border-[#f8b146]/30 shadow-sm">
                <Coffee size={12} className="text-[#f8b146]" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-white font-semibold">Cortina.D Cafe</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
