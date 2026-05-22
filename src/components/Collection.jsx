import React, { useState, useMemo } from 'react';
import gamesData from '../data/board_games.json';
import { Search, Users, Clock, Calendar, ExternalLink, Play, Film, Award, Hash } from 'lucide-react';

export default function Collection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [activeComp, setActiveComp] = useState('All');

  // Available game types derived from data
  const gameTypes = ['All', 'Social', 'Easy', 'Light', 'Medium', 'Heavy'];
  const compTypes = ['All', 'Competitive', 'Cooperative'];

  // Handle broken images gracefully with a beautiful text placeholder
  const handleImageError = (e, title) => {
    e.target.style.display = 'none';
    const parent = e.target.parentNode;
    if (parent && !parent.querySelector('.img-fallback')) {
      const fallback = document.createElement('div');
      fallback.className = 'img-fallback w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1E1E26] to-obsidian border border-champagne/20 text-champagne font-mono text-center p-4 rounded-[1.5rem]';
      
      const initials = title
        .split(' ')
        .slice(0, 2)
        .map(w => w[0])
        .join('')
        .toUpperCase();
        
      fallback.innerHTML = `
        <span class="text-3xl font-black tracking-widest mb-1">${initials}</span>
        <span class="text-[9px] uppercase tracking-wider opacity-60">No Box Shot</span>
      `;
      parent.appendChild(fallback);
    }
  };

  // Filter logic
  const filteredGames = useMemo(() => {
    return gamesData.filter((game) => {
      const matchesSearch =
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.theme.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        activeType === 'All' ||
        game.type.toLowerCase() === activeType.toLowerCase();

      const matchesComp =
        activeComp === 'All' ||
        game.competition.toLowerCase() === activeComp.toLowerCase();

      return matchesSearch && matchesType && matchesComp;
    });
  }, [searchTerm, activeType, activeComp]);

  // Decode Google redirects inside our links cleanly if possible
  const getCleanLink = (link) => {
    if (!link) return '#';
    if (link.includes('url?q=')) {
      const parts = link.split('url?q=');
      if (parts.length > 1) {
        return decodeURIComponent(parts[1].split('&')[0]);
      }
    }
    return link;
  };

  return (
    <section
      id="collection"
      className="relative w-full py-24 md:py-36 bg-[#0D0D12] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col items-start text-left mb-16 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-champagne mb-3">
            The Atelier Vault
          </p>
          <h2 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-ivory">
            THE ARCHIVE
          </h2>
          <p className="font-serif italic text-lg text-ivory/60 mt-4 leading-relaxed">
            Browse our meticulously curated collection of 80 strategic masterpieces, social deduction frameworks, and tactical puzzles.
          </p>
        </div>

        {/* Dynamic Controls Panel */}
        <div className="w-full bg-[#13131A] border border-ivory/5 p-6 md:p-8 rounded-[2.5rem] mb-12 flex flex-col gap-6 md:gap-8 shadow-xl">
          
          {/* Search Box */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-ivory/30">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by title, theme, mechanics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 pl-14 pr-6 bg-obsidian border border-ivory/10 focus:border-champagne/50 text-ivory placeholder-ivory/30 rounded-full font-mono text-sm tracking-wide focus:outline-none transition-all duration-300 shadow-inner"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute inset-y-0 right-5 flex items-center text-xs font-mono text-ivory/40 hover:text-champagne"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
            
            {/* Game Type Filter */}
            <div className="flex flex-col items-start gap-2.5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-ivory/40">Complexity Classification</span>
              <div className="flex flex-wrap gap-2">
                {gameTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`px-4 py-2 rounded-full font-mono text-xs transition-all duration-300 border ${
                      activeType === type
                        ? 'bg-champagne border-champagne text-obsidian font-bold shadow-lg shadow-champagne/10'
                        : 'bg-obsidian border-ivory/10 text-ivory/60 hover:border-champagne/30 hover:text-ivory'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Competition Mode Filter */}
            <div className="flex flex-col items-start gap-2.5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-ivory/40">Format Strategy</span>
              <div className="flex flex-wrap gap-2">
                {compTypes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveComp(mode)}
                    className={`px-4 py-2 rounded-full font-mono text-xs transition-all duration-300 border ${
                      activeComp === mode
                        ? 'bg-champagne border-champagne text-obsidian font-bold shadow-lg shadow-champagne/10'
                        : 'bg-obsidian border-ivory/10 text-ivory/60 hover:border-champagne/30 hover:text-ivory'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Total Results Stats */}
        <div className="flex justify-between items-center mb-8 px-2">
          <span className="font-mono text-xs text-ivory/40">
            SHOWING <span className="text-champagne font-bold">{filteredGames.length}</span> OF <span className="text-ivory/60">80 CURATED GAMES</span>
          </span>
        </div>

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredGames.map((game, index) => (
              <div
                key={game.num || index}
                className="premium-card flex flex-col justify-between h-full bg-[#13131A] border border-ivory/5 p-5 relative overflow-hidden group"
              >
                {/* Gold micro numbering */}
                <div className="absolute top-4 right-5 font-mono text-[10px] text-champagne/30 group-hover:text-champagne/60 transition-colors duration-300 flex items-center gap-0.5">
                  <Hash size={9} /> {game.num}
                </div>

                <div>
                  {/* Aspect Ratio Box Image Container */}
                  <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-obsidian flex items-center justify-center p-3 border border-ivory/5 group-hover:border-champagne/20 transition-colors duration-300">
                    <img
                      src={game.box_img || game.play_img}
                      alt={game.title}
                      onError={(e) => handleImageError(e, game.title)}
                      className="max-w-full max-h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Card Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[9px] font-bold uppercase tracking-wider bg-champagne/10 border border-champagne/20 text-champagne">
                      {game.type}
                    </span>
                    <span className="px-2 py-0.5 rounded-md font-mono text-[9px] uppercase tracking-wider bg-ivory/5 border border-ivory/10 text-ivory/60">
                      {game.competition}
                    </span>
                  </div>

                  {/* Game Title */}
                  <h3 className="font-sans font-bold text-lg text-ivory text-left mt-3 tracking-tight group-hover:text-champagne transition-colors duration-300">
                    {game.title}
                  </h3>

                  {/* Themes List as split tag strings */}
                  <p className="font-sans text-[11px] text-ivory/40 text-left mt-1 font-light leading-relaxed line-clamp-1">
                    {game.theme}
                  </p>
                </div>

                {/* Game Info Details Bar */}
                <div className="mt-5 pt-4 border-t border-ivory/5">
                  <div className="grid grid-cols-3 gap-2 py-2 text-left mb-4">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-wider text-ivory/30">
                        <Users size={10} className="text-champagne/60" /> Players
                      </span>
                      <span className="font-sans text-xs font-semibold text-ivory/80 mt-0.5">
                        {game.players || 'N/A'}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-wider text-ivory/30">
                        <Clock size={10} className="text-champagne/60" /> Duration
                      </span>
                      <span className="font-sans text-xs font-semibold text-ivory/80 mt-0.5 line-clamp-1">
                        {game.time || 'N/A'}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-wider text-ivory/30">
                        <Calendar size={10} className="text-champagne/60" /> Year
                      </span>
                      <span className="font-sans text-xs font-semibold text-ivory/80 mt-0.5">
                        {game.year || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Action CTA Buttons */}
                  <div className="flex gap-2">
                    {game.how_to_play ? (
                      <a
                        href={getCleanLink(game.how_to_play)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 rounded-xl bg-champagne hover:bg-champagne/90 text-obsidian font-sans font-bold text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1 hover:shadow-lg hover:shadow-champagne/10"
                      >
                        <Play size={10} fill="currentColor" /> How to Play
                      </a>
                    ) : (
                      <div className="flex-1 py-2 px-3 rounded-xl bg-ivory/5 text-ivory/30 font-sans font-medium text-[10px] uppercase tracking-widest text-center cursor-not-allowed border border-ivory/5">
                        No Tutorial
                      </div>
                    )}

                    {game.quick_summary ? (
                      <a
                        href={getCleanLink(game.quick_summary)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-2.5 rounded-xl border border-ivory/10 hover:border-champagne/30 text-ivory/70 hover:text-champagne transition-all duration-300 flex items-center justify-center"
                        title="Quick Summary Video"
                      >
                        <Film size={12} />
                      </a>
                    ) : null}
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="w-full bg-[#13131A] border border-ivory/5 py-16 px-6 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
            <Award className="text-champagne/30 mb-4 animate-bounce" size={48} />
            <h3 className="font-sans font-bold text-xl text-ivory">No Matches in Archive</h3>
            <p className="font-sans font-light text-sm text-ivory/50 mt-2 max-w-sm">
              We couldn't find any games matching <span className="text-champagne font-mono">"{searchTerm}"</span> within this classification. Try adjusting your filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveType('All');
                setActiveComp('All');
              }}
              className="mt-6 font-mono text-xs text-champagne hover:underline uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
