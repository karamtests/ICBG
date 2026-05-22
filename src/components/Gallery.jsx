import React from 'react';
import { Camera, Image as ImageIcon, MapPin } from 'lucide-react';

export default function Gallery() {
  const images = [
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

  return (
    <section
      id="gallery"
      className="relative w-full py-24 md:py-36 bg-[#0D0D12] overflow-hidden border-t border-ivory/5"
    >
      {/* Background radial glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-champagne/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center mb-4 border border-champagne/20">
            <Camera className="text-champagne" size={18} />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-champagne mb-3">
            Captured Moments
          </p>
          <h2 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-ivory">
            ATELIER CHRONICLES
          </h2>
          <p className="font-serif italic text-lg text-ivory/60 mt-4 max-w-2xl leading-relaxed">
            A visual retrospective of our gatherings. Real people, tangible encounters, and deep strategic connections.
          </p>
        </div>

        {/* Masonry Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`premium-card relative overflow-hidden group bg-[#13131A] border border-ivory/5 p-4 rounded-[2.5rem] ${img.aspect} flex flex-col justify-between`}
            >
              {/* Inner Image Container */}
              <div className="relative w-full h-[70%] rounded-[1.8rem] overflow-hidden bg-obsidian border border-ivory/5">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${img.src}')` }}
                />
                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Category Tag overlay on image */}
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-wider bg-obsidian/85 text-champagne border border-champagne/30 backdrop-blur-md">
                  {img.category}
                </span>
              </div>

              {/* Text Meta Container */}
              <div className="mt-4 text-left px-2">
                <h3 className="font-sans font-bold text-xl text-ivory tracking-tight group-hover:text-champagne transition-colors duration-300">
                  {img.title}
                </h3>
                <p className="font-sans font-light text-xs text-ivory/50 mt-2 leading-relaxed line-clamp-3">
                  {img.desc}
                </p>
                <div className="flex items-center gap-1.5 mt-4 text-[10px] font-mono text-champagne/60">
                  <MapPin size={10} /> Cortina.D Cafe, Irbid
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
