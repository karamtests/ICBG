import React from 'react';
import { Calendar, Heart, Shield, Sparkles, MapPin, Sheet, TableProperties } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#060609] border-t border-champagne/10 rounded-t-[4rem] pt-20 pb-12 relative overflow-hidden">
      {/* Decorative radial lighting */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-champagne/5 rounded-full filter blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-ivory/5">
          
          {/* Column 1: Brand Pitch */}
          <div className="flex flex-col items-start text-left lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-6 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-champagne to-[#DFCA85] flex items-center justify-center">
                <span className="font-mono text-obsidian font-extrabold text-[10px] tracking-wider">IC</span>
              </div>
              <span className="font-sans font-black text-lg tracking-widest text-ivory">
                ICBG<span className="text-champagne">.</span>
              </span>
            </div>
            <p className="font-sans font-light text-sm text-ivory/60 max-w-sm leading-relaxed mb-6">
              The Irbid Community for Board Games (ICBG) is a private members' strategic gaming club. We blend high-end strategic board gaming with genuine community encounters.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-ivory/40">
              <MapPin size={12} className="text-champagne/60" />
              <span>Cortina.D Cafe, Irbid, Jordan</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col items-start text-left">
            <h4 className="font-mono text-xs uppercase tracking-widest text-champagne mb-6 font-bold">
              Navigation
            </h4>
            <div className="flex flex-col gap-3">
              {['About', 'Collection', 'Gallery'].map((link) => (
                <button
                  key={link}
                  onClick={() => scrollToSection(link.toLowerCase())}
                  className="font-sans text-sm text-ivory/60 hover:text-champagne hover:translate-x-1 transition-all duration-300 text-left"
                >
                  {link}
                </button>
              ))}
              <a
                href="https://maps.app.goo.gl/R6WFBay7Piyfoe1w9?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-ivory/60 hover:text-champagne hover:translate-x-1 transition-all duration-300 flex items-center gap-1.5"
              >
                Cortina.D Cafe <MapPin size={12} className="text-champagne/60" />
              </a>
            </div>
          </div>

          {/* Column 3: Google Drive Databases */}
          <div className="flex flex-col items-start text-left">
            <h4 className="font-mono text-xs uppercase tracking-widest text-champagne mb-6 font-bold">
              Google Spreadsheets
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4D5FwGOLhR8LK-Faico2UVg7huBAtBuWJI5gWs42KjYZtNizHmlnyT-kCEkTkyZu3v8izBqpZAIgk/pubhtml?gid=1064455337&single=true"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs text-ivory/60 hover:text-champagne hover:translate-x-1 transition-all duration-300 flex items-center gap-1.5"
              >
                <Sheet size={13} className="text-champagne/60" /> Games of the Week
              </a>
              <a
                href="https://docs.google.com/spreadsheets/d/e/2PACX-1vTyqIdlbTwipCvbG0N5PUttfHcdCHefgpKDQdo0y9rXCxK7tR33n3XWqDlxUV9krB9ew8coWdZpjbGR/pubhtml"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs text-ivory/60 hover:text-champagne hover:translate-x-1 transition-all duration-300 flex items-center gap-1.5"
              >
                <TableProperties size={13} className="text-champagne/60" /> Member Collections
              </a>
              <div className="mt-4 py-2 px-3.5 bg-obsidian border border-ivory/5 rounded-2xl flex flex-col items-start">
                <span className="font-mono text-[9px] uppercase tracking-wider text-ivory/40">Gathering times</span>
                <span className="font-sans text-[11px] font-semibold text-ivory mt-0.5">Thu & Fri @ 7:30 PM</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Panel */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Operational Indicator */}
          <div className="flex items-center gap-3 py-2 px-4 rounded-full bg-obsidian border border-ivory/5 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ivory/60">
              SYSTEM OPERATIONAL // ICBG V1.0.0
            </span>
          </div>

          {/* Copyrights */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs font-mono text-ivory/40">
            <span>© {currentYear} ICBG Atelier. All rights reserved.</span>
            <span className="hidden md:inline text-ivory/10">|</span>
            <span className="flex items-center gap-1">
              Crafted for Tabletop Strategists <Sparkles size={11} className="text-champagne/50" />
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}
