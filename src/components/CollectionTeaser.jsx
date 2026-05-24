import React from 'react';
import { Sparkles, ArrowRight, ShieldAlert, Heart, HelpCircle, Swords } from 'lucide-react';
import gamesData from '../data/board_games.json';

// Curated teaser games
const TEASER_GAMES = [
  {
    title: "Catan",
    type: "Social",
    players: "3-4 Players",
    time: "60-120 Min",
    theme: "Resource Management & Negotiation Strategy",
    box_img: "/assets/images/collection/unnamed(60).png",
    num: "1",
    tagline: "The modern classic of resource bargaining."
  },
  {
    title: "Secret Hitler",
    type: "Social",
    players: "5-10 Players",
    time: "45 Min",
    theme: "Social Deduction, Political Distrust & Fabrications",
    box_img: "/assets/images/collection/unnamed(16).png",
    num: "5",
    tagline: "A psychological masterclass in political theater."
  },
  {
    title: "Dixit",
    type: "Easy",
    players: "3-6 Players",
    time: "30 Min",
    theme: "Abstract Surrealism & Creative Storytelling",
    box_img: "/assets/images/collection/unnamed(4).png",
    num: "10",
    tagline: "Explore the surreal landscapes of shared imagination."
  },
  {
    title: "Sheriff of Nottingham",
    type: "Light",
    players: "3-5 Players",
    time: "60 Min",
    theme: "Medieval Smuggling, Bluffs & Bribes",
    box_img: "/assets/images/collection/unnamed(18).png",
    num: "6",
    tagline: "Can you bribe and lie your way to fortune?"
  }
];

export default function CollectionTeaser({ games = [], onNavigateToFullCollection }) {
  const handleCardClick = () => {
    if (onNavigateToFullCollection) onNavigateToFullCollection();
  };

  const handleImageError = (e, title) => {
    e.target.style.display = 'none';
    const parent = e.target.parentNode;
    if (parent && !parent.querySelector('.img-fallback')) {
      const fallback = document.createElement('div');
      fallback.className = 'img-fallback w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#3a1d42]/40 to-[#25102a]/20 border border-[#f8b146]/35 text-[#f8b146] font-mono text-center p-4 rounded-[1.5rem]';
      
      const initials = title
        .split(' ')
        .slice(0, 2)
        .map(w => w[0])
        .join('')
        .toUpperCase();
        
      fallback.innerHTML = `
        <span class="text-2xl font-black tracking-widest mb-1 text-white">${initials}</span>
        <span class="text-[8px] uppercase tracking-wider opacity-60 text-[#C8B1CC]">No Box Shot</span>
      `;
      parent.appendChild(fallback);
    }
  };

  // Resolve dynamic values from the active merged games list
  const activeTeaserGames = TEASER_GAMES.map(teaserGame => {
    const liveGame = games.find(g => 
      (g.title && g.title.toLowerCase() === teaserGame.title.toLowerCase()) ||
      (g.num && String(g.num) === String(teaserGame.num))
    );
    if (liveGame) {
      return {
        ...teaserGame,
        box_img: liveGame.box_img || liveGame.play_img || teaserGame.box_img,
        players: liveGame.players ? (String(liveGame.players).toLowerCase().includes('player') ? liveGame.players : `${liveGame.players} Players`) : teaserGame.players,
        time: liveGame.time ? liveGame.time : teaserGame.time,
        // If theme or tagline gets customized in the db, we can use them as fallback overrides
        tagline: liveGame.theme || teaserGame.tagline
      };
    }
    return teaserGame;
  });

  return (
    <section 
      id="collection-teaser"
      className="relative w-full py-24 md:py-32 bg-transparent border-t border-white/5 overflow-hidden"
    >
      {/* Dynamic Ambient Spotlight Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#f8b146]/10 rounded-full filter blur-[140px] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center md:text-left mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f8b146]/10 border border-[#f8b146]/25 mb-4">
              <Sparkles size={12} className="text-[#f8b146] animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#f8b146] font-bold">Curated Showcase</span>
            </div>
            <h2 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white">
              THE VAULT <span className="font-serif italic font-normal bg-gradient-to-r from-[#f8b146] to-[#f28a75] bg-clip-text text-transparent">PREVIEW</span>
            </h2>
            <p className="font-serif italic text-lg text-[#C8B1CC] mt-4 leading-relaxed">
              Explore a handpicked selection of our community's favorites. From medieval smuggling to telepathic card puzzles, we host games for every strategic appetite.
            </p>
          </div>

          <button
            onClick={onNavigateToFullCollection}
            className="group relative px-6 py-3 bg-[#3a1d42]/65 border border-white/10 hover:border-[#f8b146] rounded-full font-mono text-[10px] uppercase tracking-widest text-[#C8B1CC] hover:text-[#f8b146] transition-all duration-300 shadow-sm flex items-center gap-2 self-start md:self-end cursor-pointer"
          >
            Enter Full Archive
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>

        {/* Dynamic Teaser Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          {activeTeaserGames.map((game, index) => {
            return (
              <div
                key={game.title}
                onClick={handleCardClick}
                className="group flex flex-col justify-between h-full bg-[#3a1d42]/30 border border-white/8 shadow-md rounded-[2.2rem] overflow-hidden transition-all duration-500 ease-out hover:scale-[1.02] hover:-translate-y-1.5 hover:border-[#f8b146]/40 hover:shadow-[0_20px_45px_rgba(248,177,70,0.12)] p-5 relative cursor-pointer"
              >
                {/* Gold Numbering */}
                <div className="absolute top-4 right-5 font-mono text-[9px] text-[#f8b146]/60 group-hover:text-[#f8b146] transition-colors duration-300">
                  #{game.num}
                </div>

                <div>
                  {/* Game Image Container */}
                  <div className="relative w-full aspect-[4/3] rounded-[1.6rem] overflow-hidden bg-[#25102a]/45 flex items-center justify-center p-3 border border-white/10 group-hover:border-[#f8b146]/30 transition-colors duration-300">
                    <img
                      src={game.box_img}
                      alt={game.title}
                      onError={(e) => handleImageError(e, game.title)}
                      className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Card Tags */}
                  <div className="flex gap-2 mt-4">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[8px] font-bold uppercase tracking-wider bg-[#f8b146]/10 border border-[#f8b146]/25 text-[#f8b146]">
                      {game.type}
                    </span>
                    <span className="px-2 py-0.5 rounded-md font-mono text-[8px] uppercase tracking-wider bg-white/5 border border-white/10 text-[#C8B1CC]">
                      Showcase
                    </span>
                  </div>

                  {/* Game Title */}
                  <h3 className="font-sans font-bold text-lg text-white text-left mt-3 tracking-tight group-hover:text-[#f8b146] transition-colors duration-300">
                    {game.title}
                  </h3>

                  {/* Theme / Tagline */}
                  <p className="font-sans text-[11px] text-[#C8B1CC]/75 text-left mt-1.5 font-light leading-relaxed">
                    {game.tagline}
                  </p>
                </div>

                {/* Metadata & Quick Info */}
                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-left">
                  <div className="flex flex-col">
                    <span className="font-mono text-[8px] uppercase tracking-wider text-[#C8B1CC]/50">Players</span>
                    <span className="font-sans text-xs font-semibold text-white/90 mt-0.5">{game.players}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-mono text-[8px] uppercase tracking-wider text-[#C8B1CC]/50">Duration</span>
                    <span className="font-sans text-xs font-semibold text-white/90 mt-0.5">{game.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cinematic Gold Glassmorphic CTA Banner */}
        <div className="w-full relative overflow-hidden bg-gradient-to-br from-[#3a1d42]/65 to-[#25102a]/35 border border-[#f8b146]/30 shadow-[0_0_35px_rgba(248,177,70,0.1)] rounded-[2.5rem] p-8 md:p-12 text-center group hover:border-[#f8b146]/50 transition-all duration-500 neon-pulse-gold">
          {/* Spotlight aura */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#f8b146]/10 rounded-full filter blur-[50px] pointer-events-none group-hover:bg-[#f8b146]/20 transition-all duration-500" />
          
          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
            <h3 className="font-sans font-black text-2xl md:text-3xl tracking-tight text-white mb-3">
              Ready to Explore the Entire Vault?
            </h3>
            <p className="font-sans font-light text-sm text-[#C8B1CC] leading-relaxed mb-8">
              We house a constantly growing library of tactical puzzles, high-stakes cooperation frameworks, and strategic classics. Click below to enter the full interactive catalog, search specific titles, filter by complexity levels, and view tutorials.
            </p>
            
            <button
              onClick={onNavigateToFullCollection}
              className="flex items-center gap-2 group/btn px-8 py-4 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#3a1d42] rounded-full font-sans font-bold text-xs uppercase tracking-widest shadow-md shadow-[#f8b146]/15 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(248,177,70,0.35)] transition-all duration-300 cursor-pointer"
            >
              Open Full Archive Vault
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
