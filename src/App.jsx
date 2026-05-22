import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import Collection from './components/Collection';
import Gallery from './components/Gallery';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="relative min-h-screen bg-obsidian text-ivory select-none overflow-hidden">
      {/* Global CSS noise overlay using feTurbulence */}
      <div 
        className="noise-overlay" 
        style={{ filter: 'url(#noise)' }}
      />
      
      {/* SVG noise texture definition */}
      <svg className="absolute w-0 h-0 pointer-events-none opacity-0 select-none">
        <filter id="noise">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.75" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
          <feColorMatrix 
            type="matrix" 
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.05 0" 
          />
        </filter>
      </svg>

      {/* Floating Island Navigation */}
      <Navbar />

      {/* Main Experience sections */}
      <main>
        {/* The Opening Shot (Hero) */}
        <Hero />

        {/* The Manifesto (Philosophy) */}
        <Philosophy />

        {/* The Atelier Vault (Collection Archive) */}
        <Collection />

        {/* Captured Moments (Gallery) */}
        <Gallery />
      </main>

      {/* The Rounded Obsidian Footer */}
      <Footer />
    </div>
  );
}
