import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MapPin } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl py-4 px-6 md:px-8 rounded-full transition-all duration-500 flex items-center justify-between ${
        scrolled
          ? 'bg-obsidian/75 backdrop-blur-xl border border-champagne/30 shadow-2xl py-3 top-4'
          : 'bg-transparent border border-transparent'
      }`}
    >
      {/* Brand Logo */}
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-champagne to-[#DFCA85] flex items-center justify-center shadow-lg shadow-champagne/10 group-hover:scale-105 transition-transform duration-300">
          <span className="font-mono text-obsidian font-extrabold text-xs tracking-wider">IC</span>
        </div>
        <span className="font-sans font-black text-lg tracking-widest text-ivory group-hover:text-champagne transition-colors duration-300">
          ICBG<span className="text-champagne">.</span>
        </span>
      </div>

      {/* Navigation Anchors */}
      <div className="hidden md:flex items-center gap-8">
        {['About', 'Collection', 'Gallery'].map((item) => (
          <button
            key={item}
            onClick={() => scrollToSection(item.toLowerCase())}
            className="font-sans font-medium text-sm tracking-wider text-ivory/80 hover:text-champagne transition-colors duration-300 relative py-1 group"
          >
            {item}
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-champagne transition-all duration-300 group-hover:w-full"></span>
          </button>
        ))}
      </div>

      {/* Action CTA Buttons */}
      <div className="flex items-center gap-3">
        <a
          href="https://maps.app.goo.gl/R6WFBay7Piyfoe1w9?g_st=ic"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ivory/60 hover:text-champagne transition-colors duration-300"
        >
          <MapPin size={12} className="text-champagne" />
          Cortina.D Cafe
        </a>
        <button
          onClick={() => window.open('https://maps.app.goo.gl/R6WFBay7Piyfoe1w9?g_st=ic', '_blank')}
          className="magnetic-btn px-5 py-2.5 bg-gradient-to-r from-champagne to-[#E5CE8B] text-obsidian font-sans font-bold text-xs uppercase tracking-widest shadow-lg shadow-champagne/20 border border-champagne/10 hover:shadow-champagne/30"
        >
          <span className="slide-bg"></span>
          <span className="relative z-10 flex items-center gap-1">
            Join Club <Sparkles size={12} />
          </span>
        </button>
      </div>
    </nav>
  );
}
