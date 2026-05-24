import React from 'react';
import { Calendar, Heart, Shield, Sparkles, MapPin, Sheet, TableProperties } from 'lucide-react';

export default function Footer({ onTriggerJenga, onOpenDisputes }) {
  const currentYear = new Date().getFullYear();
  
  // Secret triple click on the year "1983" triggers the cascading Jenga Easter Egg
  const clickTimes = React.useRef([]);

  const handleJengaClick = () => {
    const now = Date.now();
    // Keep clicks within the last 1200ms
    clickTimes.current = clickTimes.current.filter(t => now - t < 1200);
    clickTimes.current.push(now);
    
    if (clickTimes.current.length >= 3) {
      clickTimes.current = [];
      if (onTriggerJenga) onTriggerJenga();
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#3a1d42]/65 backdrop-blur-2xl border-t border-white/10 rounded-t-[4rem] pt-20 pb-12 relative overflow-hidden">
      {/* Decorative radial lighting */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f8b146]/5 rounded-full filter blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          
          {/* Column 1: Brand Pitch */}
          <div className="flex flex-col items-start text-left lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-6 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img 
                src="/assets/images/IBGC logos.svg" 
                alt="IBGC Logo" 
                className="w-12 h-12 object-contain filter drop-shadow-[0_0_12px_rgba(248,177,70,0.15)] group-hover:scale-105 transition-transform duration-300"
              />
              <span className="font-sans font-black text-lg tracking-widest text-white">
                IBGC<span className="text-[#f8b146]">.</span>
              </span>
            </div>
            <p className="font-sans font-light text-sm text-[#C8B1CC] max-w-sm leading-relaxed mb-6">
              The Irbid Board Games Community (IBGC) is a private members' strategic gaming club. We blend high-end strategic board gaming with genuine community encounters.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#C8B1CC]/70">
              <MapPin size={12} className="text-[#f8b146]" />
              <span>Cortina.D Cafe, Irbid, Jordan</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col items-start text-left">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#f8b146] mb-6 font-bold">
              Navigation
            </h4>
            <div className="flex flex-col gap-3">
              {['About', 'Collection', 'Gallery'].map((link) => (
                <button
                  key={link}
                  onClick={() => scrollToSection(link.toLowerCase())}
                  className="font-sans text-sm text-[#C8B1CC] hover:text-[#f8b146] hover:translate-x-1 transition-all duration-300 text-left cursor-pointer"
                >
                  {link}
                </button>
              ))}
              <a
                href="https://maps.app.goo.gl/R6WFBay7Piyfoe1w9?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-[#C8B1CC] hover:text-[#f8b146] hover:translate-x-1 transition-all duration-300 flex items-center gap-1.5"
              >
                Cortina.D Cafe <MapPin size={12} className="text-[#f8b146]" />
              </a>
            </div>
          </div>

          {/* Column 3: Google Drive Databases */}
          <div className="flex flex-col items-start text-left">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#f8b146] mb-6 font-bold">
              Google Spreadsheets
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4D5FwGOLhR8LK-Faico2UVg7huBAtBuWJI5gWs42KjYZtNizHmlnyT-kCEkTkyZu3v8izBqpZAIgk/pubhtml?gid=1064455337&single=true"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs text-[#C8B1CC] hover:text-[#f8b146] hover:translate-x-1 transition-all duration-300 flex items-center gap-1.5"
              >
                <Sheet size={13} className="text-[#f8b146]" /> Games of the Week
              </a>
              <a
                href="https://docs.google.com/spreadsheets/d/e/2PACX-1vTyqIdlbTwipCvbG0N5PUttfHcdCHefgpKDQdo0y9rXCxK7tR33n3XWqDlxUV9krB9ew8coWdZpjbGR/pubhtml"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs text-[#C8B1CC] hover:text-[#f8b146] hover:translate-x-1 transition-all duration-300 flex items-center gap-1.5"
              >
                <TableProperties size={13} className="text-[#f8b146]" /> Member Collections
              </a>
              <div className="mt-4 py-2 px-3.5 bg-[#25102a]/60 border border-white/10 rounded-2xl flex flex-col items-start">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/60">Gathering times</span>
                <span className="font-sans text-[11px] font-semibold text-white mt-0.5">Thu & Fri @ 7:30 PM</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Panel */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Copyrights */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs font-mono text-[#C8B1CC]/50">
            <span>
              © {currentYear} <span onClick={onOpenDisputes} className="cursor-pointer hover:text-[#f8b146] hover:underline transition-colors duration-300" title="Appeal to the Supreme Disputes Court! ⚖️">IBGC Atelier</span>. Est. <span onClick={handleJengaClick} className="cursor-pointer hover:text-[#f8b146] border-b border-dotted border-[#f8b146]/45 hover:border-[#f8b146] font-semibold transition-all duration-300 select-none">1983</span>. All rights reserved.
            </span>
            <span className="hidden md:inline text-white/10">|</span>
            <span className="flex items-center gap-1 text-white">
              Crafted for Tabletop Strategists <Sparkles size={11} className="text-[#f8b146] animate-pulse" />
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}
