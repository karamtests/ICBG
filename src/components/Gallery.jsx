import React from 'react';
import { Camera, Image as ImageIcon, MapPin, Trash2 } from 'lucide-react';

// Default hardcoded gallery images
export const DEFAULT_IMAGES = [];

const ASPECT_OPTIONS = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/3]'];

// Stateful wrapper component for each gallery image to handle loading/error state gracefully
function GalleryImage({ src, title, category }) {
  const [hasError, setHasError] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <div className="relative w-full h-[72%] rounded-[1.8rem] overflow-hidden bg-[#25102a]/45 border border-white/10">
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#25102a] via-[#3a1d42] to-[#25102a] animate-pulse z-10">
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Pulsing glow ring */}
            <div className="absolute inset-0 rounded-full border border-[#f8b146]/20 animate-ping" />
            <ImageIcon className="text-[#f8b146]/40 animate-pulse" size={20} />
          </div>
          <span className="mt-2 font-mono text-[8px] uppercase tracking-widest text-[#f8b146]/40 select-none">
            LOADING ART...
          </span>
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#25102a] via-[#3a1d42] to-[#1a0b1e] select-none z-10 animate-fade-in">
          {/* Neon background glows inside the card */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#f8b146]/5 rounded-full filter blur-[150px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-[#f28a75]/5 rounded-full filter blur-[150px] pointer-events-none" />
          
          {/* Luxury Frame Border */}
          <div className="absolute inset-3 border border-dashed border-[#f8b146]/15 rounded-[1.2rem] pointer-events-none" />
          
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-[#f8b146]/40" />
          <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-[#f8b146]/40" />
          <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-[#f8b146]/40" />
          <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-[#f8b146]/40" />

          {/* Luxury Card Content */}
          <div className="relative flex flex-col items-center text-center z-10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#f8b146]/10 to-[#f28a75]/10 border border-[#f8b146]/20 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(248,177,70,0.1)]">
              <ImageIcon className="text-[#f8b146]/80 stroke-[1.5]" size={20} />
            </div>
            
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#f8b146] font-bold">
              ATELIER MEMORY
            </p>
            
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#f8b146]/30 to-transparent my-2" />
            
            <p className="font-serif italic text-[10px] text-[#C8B1CC] max-w-[85%] leading-relaxed">
              "The board is set, the pieces move."
            </p>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={title}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Subtle vignette gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#25102a]/80 via-[#25102a]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

      {/* Category Tag overlay on image */}
      <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-wider bg-[#3a1d42]/90 text-[#f8b146] border border-[#f8b146]/30 shadow-md backdrop-blur-sm z-20 pointer-events-none">
        {category}
      </span>
    </div>
  );
}

export default function Gallery({ images = DEFAULT_IMAGES }) {
  // Use passed images, fallback if empty
  const allImages = images && images.length > 0 ? images : DEFAULT_IMAGES;

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

        {/* Masonry Layout Grid or Beautiful Empty State */}
        {allImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {allImages.map((img, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden group bg-[#3a1d42]/30 border border-white/8 shadow-md p-5 rounded-[2rem] ${img.aspect || 'aspect-square'} flex flex-col justify-between transition-all duration-500 ease-out hover:scale-[1.02] hover:-translate-y-1.5 hover:border-[#f8b146]/40 hover:shadow-[0_20px_40px_rgba(248,177,70,0.12)]`}
              >
                {/* Inner Image Container with fallback state and semantic image tag */}
                <GalleryImage src={img.src} title={img.title} category={img.category} />

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
        ) : (
          <div className="relative max-w-2xl mx-auto rounded-[2.5rem] p-10 md:p-14 bg-[#3a1d42]/20 border border-dashed border-[#f8b146]/30 overflow-hidden text-center group select-none animate-fade-in shadow-[0_0_50px_rgba(58,29,66,0.15)] hover:border-[#f8b146]/50 transition-all duration-500">
            {/* Elegant Corner Ornaments */}
            <div className="absolute top-6 left-6 w-3 h-3 border-t-2 border-l-2 border-[#f8b146]/30 group-hover:border-[#f8b146]/60 transition-colors duration-500" />
            <div className="absolute top-6 right-6 w-3 h-3 border-t-2 border-r-2 border-[#f8b146]/30 group-hover:border-[#f8b146]/60 transition-colors duration-500" />
            <div className="absolute bottom-6 left-6 w-3 h-3 border-b-2 border-l-2 border-[#f8b146]/30 group-hover:border-[#f8b146]/60 transition-colors duration-500" />
            <div className="absolute bottom-6 right-6 w-3 h-3 border-b-2 border-r-2 border-[#f8b146]/30 group-hover:border-[#f8b146]/60 transition-colors duration-500" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#f8b146]/10 to-[#f28a75]/10 border border-[#f8b146]/25 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(248,177,70,0.08)] group-hover:scale-105 group-hover:border-[#f8b146]/40 transition-all duration-500">
                <ImageIcon className="text-[#f8b146] stroke-[1.5]" size={28} />
              </div>

              <h3 className="font-sans font-bold text-2xl text-white tracking-tight mb-3">
                No Captured Memories Yet
              </h3>
              
              <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#f8b146]/40 to-transparent my-3" />
              
              <p className="font-serif italic text-sm text-[#C8B1CC] max-w-md leading-relaxed mb-6">
                "Every grand strategy begins with an empty board." New gatherings and unforgettable gaming sessions will appear here as they are experienced and archived.
              </p>

              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#f8b146]/60 font-semibold">
                Club Administration can upload new memories from the secure control panel.
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
