import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MapPin } from 'lucide-react';

export default function Navbar({ onOpenAdmin }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Secret admin access & Dice Roll Easter Egg states
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimeout = useRef(null);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, []);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 1. Trigger the 3D dice roll animation if not already spinning
    if (!isSpinning) {
      setIsSpinning(true);
      
      setTimeout(() => {
        setIsSpinning(false);
        
        // Pick a random D6 result
        const roll = Math.floor(Math.random() * 6) + 1;
        
        // Match rolled number to customized community tabletop lore
        let message = '';
        switch(roll) {
          case 6: message = "You rolled a 6! Initiative is yours."; break;
          case 5: message = "You rolled a 5! Excellent strategy. Play begins with power."; break;
          case 4: message = "You rolled a 4! Tactical positioning achieved. Secure the board."; break;
          case 3: message = "You rolled a 3! A solid roll. Play with meticulous care."; break;
          case 2: message = "You rolled a 2! Keep your defenses up. Tension rises."; break;
          case 1: message = "You rolled a 1! Critical failure! Karam steals your wood for sheep! 🐑"; break;
          default: message = `You rolled a ${roll}! Your strategy is set. Take your turn.`;
        }

        setToast({ number: roll, message });

        // Auto close toast after 4s
        if (toastTimeout.current) clearTimeout(toastTimeout.current);
        toastTimeout.current = setTimeout(() => {
          setToast(null);
        }, 4000);
      }, 1400);
    }
    
    // 2. Admin rapid-clicks handler (5 clicks)
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        if (onOpenAdmin) onOpenAdmin();
        if (clickTimer.current) clearTimeout(clickTimer.current);
        return 0;
      }
      if (clickTimer.current) clearTimeout(clickTimer.current);
      clickTimer.current = setTimeout(() => setClickCount(0), 1500);
      return next;
    });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-5xl px-6 md:px-8 rounded-full transition-all duration-500 ease-out flex items-center justify-between ${
        scrolled
          ? 'bg-[#3a1d42]/65 border border-white/10 backdrop-blur-2xl shadow-lg py-3 top-4'
          : 'bg-transparent border border-transparent backdrop-blur-none py-4 top-6'
      }`}
    >
      {/* Brand Logo */}
      <div 
        onClick={handleLogoClick}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <img 
          src="/assets/images/logo.png" 
          alt="ICBG Logo" 
          className={`w-10 h-10 object-contain filter drop-shadow-[0_0_8px_rgba(201,168,76,0.25)] transition-all duration-300 ${
            isSpinning ? 'logo-die-spin' : 'group-hover:scale-105'
          }`}
        />
        <span className="font-sans font-black text-lg tracking-widest text-white group-hover:text-[#f8b146] transition-colors duration-300">
          ICBG<span className="text-[#f8b146]">.</span>
        </span>
      </div>

      {/* Navigation Anchors */}
      <div className="hidden md:flex items-center gap-8">
        {['About', 'Collection', 'Gallery'].map((item) => (
          <button
            key={item}
            onClick={() => scrollToSection(item.toLowerCase())}
            className="font-sans font-semibold text-sm tracking-wider text-[#FDFBFF]/85 hover:text-[#f8b146] transition-colors duration-300 relative py-1 group"
          >
            {item}
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-[#f8b146] to-[#f28a75] transition-all duration-300 group-hover:w-full"></span>
          </button>
        ))}
      </div>

      {/* Action CTA Buttons */}
      <div className="flex items-center gap-3">
        <a
          href="https://maps.app.goo.gl/R6WFBay7Piyfoe1w9?g_st=ic"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#C8B1CC] hover:text-[#f8b146] transition-colors duration-300"
        >
          <MapPin size={12} className="text-[#f8b146]" />
          Cortina.D Cafe
        </a>
        <button
          onClick={() => scrollToSection('join')}
          className="group relative px-5 py-2.5 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#3a1d42] font-sans font-black text-xs uppercase tracking-widest rounded-full shadow-lg shadow-[#f8b146]/15 hover:scale-[1.05] hover:shadow-[0_0_25px_rgba(248,177,70,0.35)] transition-all duration-300 ease-out overflow-hidden flex items-center gap-1 cursor-pointer animate-float"
        >
          Join Club <Sparkles size={12} className="text-[#3a1d42] group-hover:animate-pulse" />
        </button>
      </div>

      {/* Monospace Initiative Toast notification at the bottom corner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#3a1d42] border border-[#f8b146]/35 py-3.5 px-5 rounded-2xl shadow-[0_10px_30px_rgba(248,177,70,0.22)] toast-slide-up select-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f8b146] animate-ping" />
          <div className="flex flex-col">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#f8b146] font-black">
              Dice Roll D6
            </span>
            <span className="font-mono text-[11px] text-white font-bold mt-0.5 leading-relaxed">
              {toast.message}
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}
