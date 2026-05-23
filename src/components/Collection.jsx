import React, { useState, useMemo, useEffect, useCallback } from 'react';
import gamesData from '../data/board_games.json';
import { Search, Users, Clock, Calendar, ExternalLink, Play, Film, Award, Hash, RotateCw } from 'lucide-react';

const GameCard = React.memo(function GameCard({ game, index, getCleanLink, handleImageError }) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const flippableTitles = ['Catan', 'Chess', 'Dixit', 'Secret Hitler', 'Sheriff of Nottingham', 'The Mind'];
  const isFlippable = flippableTitles.includes(game.title);

  const handleDoubleClick = () => {
    if (isFlippable) {
      setIsFlipped(!isFlipped);
    }
  };

  const getSecretContent = () => {
    if (game.title === 'Catan') {
      return {
        subtitle: "Est. 1995 By Klaus Teuber",
        note: "In 1995, Klaus Teuber designed Catan on his basement table, introducing the world to modern Eurogaming. Today, over 40 million strategists still ask the timeless, desperate question: 'Does anyone have wood for sheep?'",
        joke: "ICBG Community lore dictates that trading 4 sheep, 2 wheat, and your dignity for a single brick road is perfectly acceptable—only to be targeted by the Robber on the very next turn."
      };
    }
    if (game.title === 'Chess') {
      return {
        subtitle: "Ancient Indian Chaturanga Refinement",
        note: "The legendary game of kings, refined over 1,500 years. Simple rules, infinite tactical complexity. As Grandmasters say: 'Every pawn is a potential queen, but even a king can fall from a single moment of lost focus.'",
        joke: "ICBG Rule #24: If you blunder your Queen in the first 5 moves, do not panic. Simply state with absolute confidence that it was a highly advanced 'grandmaster gambit' to psych out your opponent."
      };
    }
    if (game.title === 'Dixit') {
      return {
        subtitle: "2008 Jean-Louis Roubira masterpiece",
        note: "Dixit proved that strategic gameplay can be built on abstract dreaming and subjective visual metaphors rather than raw math. Beautiful, surreal cards prompt players to think like poets and psychologists.",
        joke: "ICBG Rule #12: If you describe your card as 'An existential feeling of quiet desperation' and everyone matches it instantly, you lose your mind and your points."
      };
    }
    if (game.title === 'Secret Hitler') {
      return {
        subtitle: "2016 Social Deduction Legend",
        note: "A masterclass in tension, distrust, and political theater, testing how easily democracies can dissolve under carefully coordinated tableside fabrications and secret policy slips.",
        joke: "If you claim 'I accidentally drew three Fascist cards' for the fourth time in a row, you are automatically nominated as the next Chancellor of table-flipping."
      };
    }
    if (game.title === 'Sheriff of Nottingham') {
      return {
        subtitle: "2014 Medieval Bribery Arena",
        note: "Designed by Robin de Cleur, this game turns honest smuggling into an extreme psychological game of maintaining unwavering eye contact while lying about cheese.",
        joke: "Declaring 'Nothing but 5 apples, my good Sheriff' while sweating profusely and hiding 4 contraband silks is the ultimate test of strategic poker face."
      };
    }
    if (game.title === 'The Mind') {
      return {
        subtitle: "2018 Wolfgang Warsch Telepathy Test",
        note: "An experimental card game where players must discard cards in ascending order without communicating. It asks: can a board game create a shared subconscious rhythm?",
        joke: "ICBG Rule #45: Staring into your partner's eyes for two minutes to sync your breathing is highly encouraged. Accidental telepathic screaming is, however, strictly prohibited."
      };
    }
    return null;
  };

  const secret = getSecretContent();

  return (
    <div 
      className={`flip-container ${isFlippable ? 'cursor-pointer' : ''}`} 
      onDoubleClick={handleDoubleClick}
      title={isFlippable ? "Double click to flip card" : undefined}
    >
      <div className={`flip-inner ${isFlipped ? 'flipped' : ''}`}>
        
        {/* Front Face */}
        <div className="flip-front flex flex-col justify-between h-full bg-[#3a1d42]/30 border border-white/8 shadow-md rounded-[2rem] overflow-hidden transition-all duration-500 ease-out hover:scale-[1.02] hover:-translate-y-1.5 hover:border-[#f8b146]/40 hover:shadow-[0_20px_40px_rgba(248,177,70,0.12)] p-5 relative group">
          {/* Gold micro numbering */}
          <div className="absolute top-4 right-5 font-mono text-[10px] text-[#f8b146]/60 group-hover:text-[#f8b146] transition-colors duration-300 flex items-center gap-0.5">
            <Hash size={9} /> {game.num}
          </div>

          <div>
            {/* Aspect Ratio Box Image Container */}
            <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-[#25102a]/45 flex items-center justify-center p-3 border border-white/10 group-hover:border-[#f8b146]/30 transition-colors duration-300">
              {(game.box_img || game.play_img) ? (
                <img
                  src={game.box_img || game.play_img}
                  alt={game.title}
                  onError={(e) => handleImageError(e, game.title)}
                  className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#3a1d42]/40 to-[#25102a]/20 border border-[#f8b146]/20 text-[#f8b146] font-mono rounded-[1.5rem]">
                  <span className="text-3xl font-black tracking-widest mb-1 text-white">
                    {game.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider opacity-60 text-[#C8B1CC]">No Box Shot</span>
                </div>
              )}
            </div>

            {/* Card Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-0.5 rounded-md font-mono text-[9px] font-bold uppercase tracking-wider bg-[#f8b146]/10 border border-[#f8b146]/20 text-[#f8b146]">
                {game.type}
              </span>
              <span className="px-2 py-0.5 rounded-md font-mono text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 text-[#C8B1CC]">
                {game.competition}
              </span>
              {isFlippable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(true);
                  }}
                  className="px-2 py-0.5 rounded-md font-mono text-[9px] font-bold uppercase tracking-wider bg-[#f8b146]/20 border border-[#f8b146]/45 text-[#f8b146] animate-pulse flex items-center gap-1 hover:bg-[#f8b146]/35 transition-colors cursor-pointer"
                  title="Click to reveal secret!"
                >
                  ★ Rare Secret <RotateCw size={8} />
                </button>
              )}
            </div>

            {/* Game Title */}
            <h3 className="font-sans font-bold text-lg text-white text-left mt-3 tracking-tight group-hover:text-[#f8b146] transition-colors duration-300">
              {game.title}
            </h3>

            {/* Themes List as split tag strings */}
            <p className="font-sans text-[11px] text-[#C8B1CC]/70 text-left mt-1 font-light leading-relaxed line-clamp-1">
              {game.theme}
            </p>
          </div>

          {/* Game Info Details Bar */}
          <div className="mt-5 pt-4 border-t border-white/5">
            <div className="grid grid-cols-3 gap-2 py-2 text-left mb-4">
              <div className="flex flex-col">
                <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-wider text-[#C8B1CC]/60">
                  <Users size={10} className="text-[#f8b146]" /> Players
                </span>
                <span className="font-sans text-xs font-semibold text-white/90 mt-0.5">
                  {game.players || 'N/A'}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-wider text-[#C8B1CC]/60">
                  <Clock size={10} className="text-[#f8b146]" /> Duration
                </span>
                <span className="font-sans text-xs font-semibold text-white/90 mt-0.5 line-clamp-1">
                  {game.time || 'N/A'}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-wider text-[#C8B1CC]/60">
                  <Calendar size={10} className="text-[#f8b146]" /> Year
                </span>
                <span className="font-sans text-xs font-semibold text-white/90 mt-0.5">
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
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#3a1d42] font-sans font-bold text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1 hover:scale-[1.02] hover:shadow-[0_4px_15px_rgba(248,177,70,0.35)]"
                >
                  <Play size={10} fill="currentColor" /> How to Play
                </a>
              ) : (
                <div className="flex-1 py-2 px-3 rounded-xl bg-white/5 text-white/30 font-sans font-medium text-[10px] uppercase tracking-widest text-center cursor-not-allowed border border-white/10">
                  No Tutorial
                </div>
              )}

              {game.quick_summary ? (
                <a
                  href={getCleanLink(game.quick_summary)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2.5 rounded-xl border border-white/10 hover:border-[#f8b146]/30 text-white hover:text-[#f8b146] transition-all duration-300 flex items-center justify-center bg-transparent"
                  title="Quick Summary Video"
                >
                  <Film size={12} />
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* Back Face (Secret Design Details) */}
        {isFlippable && secret && (
          <div className="flip-back flex flex-col justify-between h-full bg-[#3a1d42] border-2 border-[#f8b146] shadow-[0_15px_45px_rgba(248,177,70,0.25)] rounded-[2rem] p-6 relative select-none">
            {/* Elegant Corner Decoration */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#f8b146]/25 to-transparent pointer-events-none rounded-tr-[2rem]" />
            
            {/* Header info */}
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <div className="flex flex-col items-start text-left">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#f8b146] font-black">
                    LEGENDARY ARCHIVE
                  </span>
                  <h3 className="font-sans font-black text-xl text-white mt-0.5 tracking-tight">
                    {game.title}
                  </h3>
                  <span className="font-mono text-[8px] text-[#C8B1CC] mt-0.5 font-bold">
                    {secret.subtitle}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#f8b146]/10 border border-[#f8b146] flex items-center justify-center text-[#f8b146] font-bold text-xs">
                  ★
                </div>
              </div>

              {/* Secret Notes and Quotes */}
              <div className="mt-5 flex flex-col gap-4 text-left">
                <div>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-[#f8b146] font-bold">
                    Designer's Note
                  </span>
                  <p className="font-sans text-[11px] text-[#C8B1CC]/90 font-light leading-relaxed mt-1">
                    {secret.note}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-[#f8b146] font-bold">
                    Community Inside Joke
                  </span>
                  <p className="font-serif italic text-[11px] text-[#C8B1CC] leading-relaxed mt-1">
                    "{secret.joke}"
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="font-mono text-[8px] text-[#C8B1CC]/40 font-bold">
                DOUBLE CLICK TO FLIP BACK
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="py-1 px-3 rounded-lg border border-[#f8b146]/40 text-[#f8b146] hover:bg-[#f8b146]/10 transition-all duration-300 font-mono text-[9px] font-bold uppercase tracking-wider cursor-pointer"
              >
                Return
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
});

export default function Collection({ extraGames = [] }) {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 150);
    return () => clearTimeout(handler);
  }, [localSearchTerm]);

  const [activeType, setActiveType] = useState('All');
  const [activeComp, setActiveComp] = useState('All');

  // Merge the original JSON data with any admin-added games and deduplicate/normalize
  const allGames = useMemo(() => {
    // 1. Normalize and deduplicate extraGames (latest write/creation wins)
    const uniqueExtraGames = [];
    const seenTitles = new Set();
    const seenNums = new Set();

    extraGames.forEach(game => {
      const titleKey = game.title ? game.title.trim().toLowerCase() : '';
      const numKey = game.num ? String(game.num).trim() : '';
      
      // Since they are sorted descending by created_at, the first one seen is the most recent
      if (titleKey && !seenTitles.has(titleKey) && (!numKey || !seenNums.has(numKey))) {
        uniqueExtraGames.push(game);
        seenTitles.add(titleKey);
        if (numKey) seenNums.add(numKey);
      }
    });

    // 2. Start with a copy of static games and merge overrides
    const merged = gamesData.map(staticGame => {
      const staticTitleNormalized = staticGame.title ? staticGame.title.trim().toLowerCase() : '';
      const staticNum = staticGame.num ? String(staticGame.num).trim() : '';

      const override = uniqueExtraGames.find(g => {
        const gTitleNormalized = g.title ? g.title.trim().toLowerCase() : '';
        const gNum = g.num ? String(g.num).trim() : '';
        return (gNum && gNum === staticNum) || (gTitleNormalized && gTitleNormalized === staticTitleNormalized);
      });

      if (override) {
        return {
          ...staticGame,
          ...override, // override with database fields
          id: override.id // preserve the db id for updates
        };
      }
      return staticGame;
    });

    // 3. Add completely new extra games that do not match any static game
    const newGames = uniqueExtraGames.filter(g => {
      const gTitleNormalized = g.title ? g.title.trim().toLowerCase() : '';
      const gNum = g.num ? String(g.num).trim() : '';

      return !gamesData.some(staticGame => {
        const staticTitleNormalized = staticGame.title ? staticGame.title.trim().toLowerCase() : '';
        const staticNum = staticGame.num ? String(staticGame.num).trim() : '';
        return (gNum && gNum === staticNum) || (gTitleNormalized && gTitleNormalized === staticTitleNormalized);
      });
    });

    return [...newGames, ...merged];
  }, [extraGames]);

  // Available game types derived from data
  const gameTypes = ['All', 'Social', 'Easy', 'Light', 'Medium', 'Heavy'];
  const compTypes = ['All', 'Competitive', 'Cooperative'];

  // Handle broken images gracefully with a beautiful text placeholder
  const handleImageError = useCallback((e, title) => {
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
        <span class="text-3xl font-black tracking-widest mb-1 text-white">${initials}</span>
        <span class="text-[9px] uppercase tracking-wider opacity-60 text-[#C8B1CC]">No Box Shot</span>
      `;
      parent.appendChild(fallback);
    }
  }, []);

  // Filter logic
  const filteredGames = useMemo(() => {
    return allGames.filter((game) => {
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
  }, [allGames, searchTerm, activeType, activeComp]);

  // Decode Google redirects inside our links cleanly if possible & prevent Stored XSS
  const getCleanLink = useCallback((link) => {
    if (!link) return '#';
    let clean = link;
    if (link.includes('url?q=')) {
      const parts = link.split('url?q=');
      if (parts.length > 1) {
        clean = decodeURIComponent(parts[1].split('&')[0]);
      }
    }
    // Block dangerous javascript: protocols (P0 Stored XSS Fix)
    if (clean.trim().toLowerCase().startsWith('javascript:')) {
      return '#';
    }
    return clean;
  }, []);

  return (
    <section
      id="collection"
      className="relative w-full py-24 md:py-36 bg-transparent border-t border-white/5 overflow-hidden"
    >
      {/* Floating golden/champagne blur halo bubble behind the collection */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[#f8b146]/10 rounded-full filter blur-[150px] pointer-events-none z-0 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full filter blur-[140px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Standalone Page Navigation Breadcrumb */}
        <div className="mb-10 flex items-center">
          <button 
            onClick={() => window.location.hash = '#/'}
            className="group flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#f8b146] hover:text-[#f28a75] transition-all duration-300 cursor-pointer bg-[#3a1d42]/40 border border-[#f8b146]/20 py-2 px-4 rounded-full hover:bg-[#f8b146]/10"
          >
            <span className="group-hover:-translate-x-1.5 transition-transform duration-300">←</span> Return to Main Atelier
          </button>
        </div>

        {/* Section Header */}
        <div className="flex flex-col items-start text-left mb-16 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#f8b146] mb-3">
            The Atelier Vault
          </p>
          <h2 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white">
            THE ARCHIVE
          </h2>
          <p className="font-serif italic text-lg text-[#C8B1CC] mt-4 leading-relaxed">
            Browse our meticulously curated collection of {allGames.length} strategic masterpieces, social deduction frameworks, and tactical puzzles.
          </p>
        </div>

        {/* Dynamic Controls Panel */}
        <div className="w-full bg-[#3a1d42]/45 border border-white/10 p-6 md:p-8 rounded-[2rem] mb-12 flex flex-col gap-6 md:gap-8 shadow-xl">
          
          {/* Search Box */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/40">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by title, theme, mechanics..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="w-full py-4 pl-14 pr-6 bg-[#25102a]/45 border border-white/10 focus:border-[#f8b146] focus:ring-1 focus:ring-[#f8b146]/20 text-white placeholder-white/30 rounded-full font-mono text-sm tracking-wide focus:outline-none transition-all duration-300 shadow-sm"
            />
            {localSearchTerm && (
              <button 
                onClick={() => setLocalSearchTerm('')} 
                className="absolute inset-y-0 right-5 flex items-center text-xs font-mono text-white/60 hover:text-[#f8b146] cursor-pointer"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
            
            {/* Game Type Filter */}
            <div className="flex flex-col items-start gap-2.5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">Complexity Classification</span>
              <div className="flex flex-wrap gap-2">
                {gameTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`px-4 py-2 rounded-full font-mono text-xs transition-all duration-300 border ${
                      activeType === type
                        ? 'bg-[#f8b146] border-[#f8b146] text-[#3a1d42] font-bold shadow-lg shadow-[#f8b146]/20'
                        : 'bg-[#25102a]/45 border border-white/10 text-white/70 hover:border-[#f8b146]/40 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Competition Mode Filter */}
            <div className="flex flex-col items-start gap-2.5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">Format Strategy</span>
              <div className="flex flex-wrap gap-2">
                {compTypes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveComp(mode)}
                    className={`px-4 py-2 rounded-full font-mono text-xs transition-all duration-300 border ${
                      activeComp === mode
                        ? 'bg-[#f8b146] border-[#f8b146] text-[#3a1d42] font-bold shadow-lg shadow-[#f8b146]/20'
                        : 'bg-[#25102a]/45 border border-white/10 text-white/70 hover:border-[#f8b146]/40 hover:text-white'
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
          <span className="font-mono text-xs text-white/40">
            SHOWING <span className="text-[#f8b146] font-bold">{filteredGames.length}</span> OF <span className="text-[#C8B1CC]">{allGames.length} CURATED GAMES</span>
          </span>
        </div>

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredGames.map((game, index) => (
              <GameCard 
                key={game.num || index} 
                game={game} 
                index={index} 
                getCleanLink={getCleanLink} 
                handleImageError={handleImageError} 
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="w-full bg-[#3a1d42]/30 border border-white/8 py-16 px-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-md">
            <Award className="text-[#f8b146]/45 mb-4 animate-bounce" size={48} />
            <h3 className="font-sans font-bold text-xl text-white">No Matches in Archive</h3>
            <p className="font-sans font-light text-sm text-[#C8B1CC] mt-2 max-w-sm">
              We couldn't find any games matching <span className="text-[#f8b146] font-mono">"{searchTerm}"</span> within this classification. Try adjusting your filters.
            </p>
            <button
              onClick={() => {
                setLocalSearchTerm('');
                setSearchTerm('');
                setActiveType('All');
                setActiveComp('All');
              }}
              className="mt-6 font-mono text-xs text-[#f8b146] hover:underline uppercase tracking-wider font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
