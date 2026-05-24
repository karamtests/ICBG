import React from 'react';
import { Calendar, MapPin, Sparkles, Play, BookOpen, MessageSquare } from 'lucide-react';

export default function WeeklySpotlight({ schedule, games, onScrollToCollection }) {
  // Find featured game objects from the games vault safely
  const featuredGames = (schedule.featuredGameTitles || [])
    .filter(title => typeof title === 'string' && title.trim())
    .map(title => {
      const game = games.find(g => 
        g && 
        typeof g.title === 'string' && 
        g.title.toLowerCase() === title.toLowerCase()
      );
      if (game) return game;
      // Fallback if the game was newly added/custom in schedule
      return {
        title,
        type: 'Spotlight',
        players: '2-6 Players',
        theme: 'Strategic Board Game',
        box_img: '',
        isFallback: true
      };
    });

  return (
    <section id="weekly" className="py-24 relative overflow-hidden w-full bg-transparent border-t border-b border-white/5">
      {/* Decorative radial aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#f8b146]/5 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center md:text-left mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f8b146]/10 border border-[#f8b146]/25 mb-4">
              <Sparkles size={12} className="text-[#f8b146] animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#f8b146] font-bold">This Week's Campaign</span>
            </div>
            <h2 className="font-sans font-black text-4xl md:text-5xl tracking-tight text-white">
              Weekly <span className="font-serif italic font-normal bg-gradient-to-r from-[#f8b146] to-[#f28a75] bg-clip-text text-transparent">Spotlight</span>
            </h2>
            <p className="font-sans font-light text-sm text-[#C8B1CC] max-w-xl mt-3 leading-relaxed">
              Every week, we gather at Cortina.D Cafe to test our wits, forge connections, and master new strategies. Here is what's hitting the table next.
            </p>
          </div>
          
          <button
            onClick={onScrollToCollection}
            className="group relative px-6 py-3 bg-transparent border border-white/10 hover:border-[#f8b146] rounded-full font-mono text-[10px] uppercase tracking-widest text-[#C8B1CC] hover:text-[#f8b146] transition-all duration-300 shadow-sm flex items-center gap-2 self-start md:self-end"
          >
            View Full Vault
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Next Gathering Card */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex-1 bg-[#3a1d42]/40 border border-[#f8b146]/30 shadow-[0_0_25px_rgba(248,177,70,0.15)] rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-between group hover:scale-[1.02] hover:-translate-y-1 hover:border-[#f8b146]/50 hover:shadow-[0_20px_40px_rgba(248,177,70,0.25)] transition-all duration-500 neon-pulse-gold">
              {/* Highlight bar */}
              <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-[#f8b146]/60 to-transparent" />
              
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#f8b146] font-semibold block mb-2 text-left">Next Gathering</span>
                <h3 className="font-sans font-black text-3xl text-white leading-tight mb-6 text-left">
                  {schedule.nextHangout || 'Friday, 7:30 PM'}
                </h3>
                
                <div className="space-y-6">
                  {/* Location Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#f8b146]/10 flex items-center justify-center border border-[#f8b146]/25 shrink-0 mt-0.5 shadow-sm">
                      <MapPin size={18} className="text-[#f8b146]" />
                    </div>
                    <div className="text-left">
                      <span className="font-sans font-semibold text-sm text-white block">Cortina.D Cafe</span>
                      <span className="font-sans text-xs text-[#C8B1CC]">University Street, Irbid, Jordan</span>
                    </div>
                  </div>

                  {/* Thursday Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0 mt-0.5">
                      <Calendar size={18} className="text-white/70" />
                    </div>
                    <div className="text-left">
                      <span className="font-sans font-semibold text-sm text-white block">Thursday Session</span>
                      <span className="font-mono text-xs text-[#f8b146] font-semibold">{schedule.thursdayDate || 'Thu @ 7:00 PM'}</span>
                    </div>
                  </div>

                  {/* Friday Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0 mt-0.5">
                      <Calendar size={18} className="text-white/70" />
                    </div>
                    <div className="text-left">
                      <span className="font-sans font-semibold text-sm text-white block">Friday Session</span>
                      <span className="font-mono text-xs text-[#f8b146] font-semibold">{schedule.fridayDate || 'Fri @ 7:00 PM'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 space-y-3">
                <a
                  href="https://chat.whatsapp.com/IBGC" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 group/btn px-6 py-4 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#3a1d42] rounded-full font-sans font-bold text-xs uppercase tracking-widest shadow-md shadow-[#f8b146]/15 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(248,177,70,0.3)] transition-all duration-300"
                >
                  <MessageSquare size={14} /> Join Whatsapp Chat
                </a>
                
                <a
                  href="https://maps.app.goo.gl/R6WFBay7Piyfoe1w9?g_st=ic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25102a]/45 border border-white/10 text-white hover:border-[#f8b146] hover:text-[#f8b146] rounded-full font-sans font-semibold text-xs tracking-wider transition-all duration-300 shadow-sm"
                >
                  Google Maps Location
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Games Slider */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredGames.map((game, idx) => {
                const initials = game && typeof game.title === 'string'
                  ? game.title.split(' ').filter(Boolean).map(n => n[0]).slice(0, 3).join('').toUpperCase()
                  : 'GP';
                return (
                  <div
                    key={(game?.title || 'game') + idx}
                    className="group bg-[#3a1d42]/30 border border-white/8 rounded-[2rem] shadow-sm p-6 flex flex-col justify-between hover:scale-[1.02] hover:-translate-y-1.5 hover:border-[#f8b146]/40 hover:shadow-[0_20px_40px_rgba(248,177,70,0.12)] transition-all duration-500 relative overflow-hidden text-left"
                  >
                    {/* Background gold gradient indicator */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#f8b146]/5 rounded-full filter blur-[35px] pointer-events-none group-hover:bg-[#f8b146]/15 transition-all duration-500" />

                    <div>
                      {/* Game Header */}
                      <div className="flex items-center gap-4 mb-4">
                        {game.box_img ? (
                          <img
                            src={game.box_img}
                            alt={game.title}
                            className="w-14 h-14 rounded-2xl object-cover border border-white/10 shadow-md"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f8b146]/20 to-[#f28a75]/10 flex items-center justify-center border border-[#f8b146]/30 shadow-lg shadow-[#f8b146]/5">
                            <span className="font-mono text-xs font-bold text-[#f8b146] tracking-wider">{initials}</span>
                          </div>
                        )}
                        <div className="text-left">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-[#f8b146] font-bold block bg-[#f8b146]/10 px-2 py-0.5 rounded-full w-max border border-[#f8b146]/25 mb-1">
                            {game.type}
                          </span>
                          <h4 className="font-sans font-black text-lg text-white group-hover:text-[#f8b146] transition-colors duration-300 truncate max-w-[200px]">
                            {game.title}
                          </h4>
                        </div>
                      </div>

                      {/* Game Stats */}
                      <p className="font-sans text-xs text-[#C8B1CC] text-left line-clamp-2 leading-relaxed mb-4">
                        {game.theme || 'Bring your sharpest tactical minds to face off in this strategic tabletop masterpiece.'}
                      </p>
                    </div>

                    {/* Game Metadata Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="font-mono text-[10px] text-[#C8B1CC]/70 font-semibold">
                        {game.players}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {game.how_to_play && (
                          <a
                            href={game.how_to_play}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#f8b146]/10 border border-white/10 hover:border-[#f8b146]/30 flex items-center justify-center text-white/60 hover:text-[#f8b146] transition-all duration-300"
                            title="Learn How To Play"
                          >
                            <Play size={12} fill="currentColor" />
                          </a>
                        )}
                        {game.quick_summary && (
                          <a
                            href={game.quick_summary}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#f8b146]/10 border border-white/10 hover:border-[#f8b146]/30 flex items-center justify-center text-white/60 hover:text-[#f8b146] transition-all duration-300"
                            title="Quick Summary Video"
                          >
                            <BookOpen size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
