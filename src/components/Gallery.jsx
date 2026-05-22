import React from 'react';
import { Camera, Image as ImageIcon, MapPin, Trash2 } from 'lucide-react';

// Default hardcoded gallery images
const DEFAULT_IMAGES = [
  {
    src: '/assets/images/gallery/community-1.jpeg',
    title: 'Deep Focus & Tactical Clashes',
    category: 'Play Session',
    aspect: 'aspect-[3/4]',
    desc: 'Late night strategy showdowns where every move is calculated and every card represents a battle of minds.'
  },
  {
    src: '/assets/images/gallery/community-3.jpeg',
    title: 'A Sanctuary for Thinkers',
    category: 'Atelier Vibe',
    aspect: 'aspect-square',
    desc: 'The cozy, strategic atmosphere at Cortina.D Cafe. A haven of coffee, community, and tactical joy.'
  },
  {
    src: '/assets/images/gallery/community-2.jpeg',
    title: 'Laughter, Alliances & Betrayals',
    category: 'Social Deduction',
    aspect: 'aspect-[4/3]',
    desc: 'Moments of pure social bonding, high-stakes bluffing, and absolute social chess.'
  }
];

const ASPECT_OPTIONS = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/3]'];

export default function Gallery({ extraImages = [] }) {
  // Merge default images with admin-added ones
  const allImages = [...DEFAULT_IMAGES, ...extraImages];

  return (
    <section
      id="gallery"
      className="relative w-full py-24 md:py-36 bg-transparent overflow-hidden border-t border-white/5"
    >
      {/* Background radial glows */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gold-logo/10 rounded-full filter blur-[130px] opacity-60 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-[#f8b146]/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="w-12 h-12 rounded-full bg-[#f8b146]/10 flex items-center justify-center mb-4 border border-[#f8b146]/30 shadow-[0_0_15px_rgba(248,177,70,0.2)]">
            <Camera className="text-[#f8b146]" size={20} />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#f8b146] mb-3">
            Captured Moments
          </p>
          <h2 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white">
            ATELIER CHRONICLES
          </h2>
          <p className="font-serif italic text-lg text-[#C8B1CC] mt-4 max-w-2xl leading-relaxed">
            A visual retrospective of our gatherings. Real people, tangible encounters, and deep strategic connections.
          </p>
        </div>

        {/* Masonry Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {allImages.map((img, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden group bg-[#3a1d42]/30 border border-white/8 shadow-md p-5 rounded-[2rem] ${img.aspect || 'aspect-square'} flex flex-col justify-between transition-all duration-500 ease-out hover:scale-[1.02] hover:-translate-y-1.5 hover:border-[#f8b146]/40 hover:shadow-[0_20px_40px_rgba(248,177,70,0.12)]`}
            >
              {/* Inner Image Container */}
              <div className="relative w-full h-[72%] rounded-[1.8rem] overflow-hidden bg-[#25102a]/45 border border-white/10">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  style={{ backgroundImage: `url('${img.src}')` }}
                />
                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#25102a]/80 via-[#25102a]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Category Tag overlay on image */}
                <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-wider bg-[#3a1d42]/90 text-[#f8b146] border border-[#f8b146]/30 shadow-md backdrop-blur-sm">
                  {img.category}
                </span>
              </div>

              {/* Text Meta Container */}
              <div className="mt-4 text-left px-2">
                <h3 className="font-sans font-bold text-xl text-white tracking-tight group-hover:text-[#f8b146] transition-colors duration-300">
                  {img.title}
                </h3>
                <p className="font-sans font-light text-xs text-[#C8B1CC] mt-2 leading-relaxed line-clamp-3">
                  {img.desc}
                </p>
                <div className="flex items-center gap-1.5 mt-4 text-[10px] font-mono text-[#f8b146]/70">
                  <MapPin size={10} className="text-[#f8b146]" /> Cortina.D Cafe, Irbid
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
