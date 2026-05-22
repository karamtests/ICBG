import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Compass, Calendar, Coffee } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy() {
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
      className="relative w-full py-24 md:py-36 bg-obsidian overflow-hidden border-b border-ivory/5"
    >
      {/* Decorative vector assets to emulate Atelier vibe */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-champagne/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-champagne/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* The Manifesto Header */}
        <div className="philosophy-header flex flex-col items-center text-center mb-20 md:mb-28">
          <Quote className="text-champagne mb-6 opacity-80" size={40} />
          <h2 className="font-serif italic text-3xl md:text-5xl text-ivory max-w-3xl leading-relaxed">
            "We are not merely playing board games. We are preserving the tactile magic of strategic camaraderie in a digital world."
          </h2>
          <div className="w-16 h-[1px] bg-champagne mt-8" />
        </div>

        {/* Contrast Philosophy Section */}
        <div className="philosophy-contrast grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
          
          {/* Contrast Left Column: Common Focus */}
          <div className="contrast-left flex flex-col items-start text-left bg-[#13131A] p-8 md:p-12 rounded-[2.5rem] border border-ivory/5">
            <div className="w-10 h-10 rounded-full bg-ivory/5 flex items-center justify-center mb-6">
              <Compass className="text-ivory/40" size={20} />
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-ivory/40 mb-3">The Common Path</p>
            <h3 className="font-sans font-black text-2xl md:text-3xl tracking-tight text-ivory/70 mb-4">
              Most communities focus on:
            </h3>
            <p className="font-sans font-light text-base text-ivory/60 leading-relaxed">
              Passing the time with casual play, standard digital distraction, and unstructured, routine card meetups. Many groups treat gaming as an isolated activity rather than a social incubator.
            </p>
            <div className="w-full h-[1px] bg-ivory/10 my-6" />
            <div className="flex items-center gap-2 text-xs font-mono text-ivory/40">
              <span>Standard Gaming Groups</span>
            </div>
          </div>

          {/* Contrast Right Column: Private Atelier Focus */}
          <div className="contrast-right flex flex-col items-start text-left bg-gradient-to-br from-[#1A1A24] to-[#13131A] p-8 md:p-12 rounded-[2.5rem] border border-champagne/20 shadow-xl shadow-champagne/5 relative overflow-hidden group">
            {/* Corner Gold Foil Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-champagne/10 to-transparent pointer-events-none" />
            
            <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center mb-6 border border-champagne/20">
              <Coffee className="text-champagne" size={20} />
            </div>
            
            <p className="font-mono text-xs uppercase tracking-widest text-champagne mb-3">Our Atelier Way</p>
            <h3 className="font-sans font-black text-3xl md:text-4xl tracking-tight text-ivory mb-4">
              We focus on:
            </h3>
            
            <p className="font-serif italic font-light text-2xl md:text-3xl text-champagne leading-relaxed mb-6">
              "Forging unbreakable bonds, mastering strategic depths, and sharing unforgettable nights."
            </p>
            
            <p className="font-sans font-light text-base text-ivory/80 leading-relaxed mb-6">
              We curate a sanctuary for thinkers. Here, board games are catalysts for dialogue, intellectual sparring, and laughter. Our collection is curated, our atmosphere is upscale, and every table is hosted with intentionality.
            </p>

            <div className="w-full h-[1px] bg-champagne/20 my-2" />
            
            {/* Live Cortina Event Badge */}
            <div className="mt-4 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-obsidian border border-champagne/20">
                <Calendar size={12} className="text-champagne" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-ivory/80">Every Thu & Fri @ 7:30 PM</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-obsidian border border-champagne/20">
                <Coffee size={12} className="text-champagne" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-ivory/80">Cortina.D Cafe</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
