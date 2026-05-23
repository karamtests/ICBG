import React, { useState } from 'react';
import { Gavel, X, Scale } from 'lucide-react';

const COURT_RULINGS = [
  {
    caseName: "Case #104: Retroactive Move Appeal",
    ruling: "RETROACTIVE MOVES ARE STRICTLY FORBIDDEN.",
    details: "Attempting to take back a move after drawing a card, rolling dice, or seeing subsequent outcomes is classified as high strategic treason. Player must immediately discard one card of their choice and apologize to the table with direct eye contact.",
    precedent: "Precedent: The BGG Accord of 2004, Article 9: 'A hand released is a move sealed.'"
  },
  {
    caseName: "Case #892: Analysis Paralysis Compensation Injunction",
    ruling: "UNLAWFUL TIME HOARDING PENALTY.",
    details: "When a player's strategic calculation exceeds 12 minutes on a single turn and their coffee becomes ice-cold, adjacent players are legally entitled to consume up to 65% of the offending player's snack reserves as emotional distress compensation.",
    precedent: "Precedent: The Pistachio & Hummus Treaty of Cortina Cafe, Clause 4."
  },
  {
    caseName: "Case #411: Card Peeking Accusations",
    ruling: "THE STARE OF COMPLIANCE MANDATE.",
    details: "Glancing at cards that fall flat on the table is permissible, but ONLY if you maintain intense, uncomfortable, unwavering eye contact with the card's owner while doing so to assert strategic dominance. Sneaking peeks is a Class-B infraction.",
    precedent: "Precedent: Common Tabletop Law, Section 14: 'Gravity is public information.'"
  },
  {
    caseName: "Case #303: The Backseat General (Unsolicited Advice)",
    ruling: "HABITUAL CO-PILOT DETENTION.",
    details: "Any spectator or 'Dead Player' who aggressively dictates what cards you should play on your active turn is hereby designated as the official 'Snack Retriever' and 'Rulebook Reader' for the next three consecutive club hangouts.",
    precedent: "Precedent: The Irbid strategic sovereignty declaration of 2023."
  },
  {
    caseName: "Case #617: The 'Just Business' Robber Apology",
    ruling: "ACTIVE DECLARATION OF TABLE WAR.",
    details: "Placing the Robber on a 6-tile and saying 'It's just business, I have to, sorry' is an act of war. Strategic, immediate, and coordinate retaliation by all other players is not only allowed, but constitutionally encouraged.",
    precedent: "Precedent: Klaus Teuber's unofficial basement rules of engagement."
  }
];

export default function DisputesCourt({ isOpen, onClose }) {
  const [currentRuling, setCurrentRuling] = useState(null);
  const [isStriking, setIsStriking] = useState(false);
  const [rippleActive, setRippleActive] = useState(false);

  const handleStrike = () => {
    if (isStriking) return;
    setIsStriking(true);
    setRippleActive(true);

    // Strike down gavel timing
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * COURT_RULINGS.length);
      setCurrentRuling(COURT_RULINGS[randomIndex]);
    }, 180);

    // Reset strike state
    setTimeout(() => {
      setIsStriking(false);
    }, 450);

    // Fade out ripple shockwave
    setTimeout(() => {
      setRippleActive(false);
    }, 850);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d0a21]/80 backdrop-blur-md transition-opacity duration-300 ease-in-out select-none">
      <div className="relative bg-[#3a1d42]/90 border-2 border-[#f8b146]/50 shadow-[0_20px_50px_rgba(248,177,70,0.25)] rounded-[2.5rem] p-8 max-w-lg w-full mx-4 overflow-hidden text-center">
        
        {/* Decorative corner decals */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#f8b146]/10 to-transparent pointer-events-none rounded-tr-[2.5rem]" />
        <div className="absolute top-4 left-6 font-mono text-[9px] text-[#f8b146]/45 flex items-center gap-1.5">
          <Scale size={11} /> ICBG SUPREME COURT
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header Title */}
        <div className="mt-4 mb-8">
          <h2 className="font-sans font-black text-2xl md:text-3xl tracking-tight text-white uppercase">
            Strategic Disputes Court
          </h2>
          <p className="font-serif italic text-xs text-[#C8B1CC] mt-1 max-w-sm mx-auto">
            "Resolving tableside friction with absolute, unquestionable strategic authority."
          </p>
        </div>

        {/* 3D GAVEL AND SOUND BLOCK WORK AREA */}
        <div className="relative w-full h-44 flex flex-col items-center justify-center mb-6 bg-[#25102a]/45 rounded-2xl border border-white/5 p-4 overflow-hidden">
          
          {/* Striking ripple shockwave */}
          {rippleActive && (
            <div className="absolute bottom-[28px] w-28 h-28 rounded-full border-2 border-[#f8b146]/60 animate-ping opacity-60 pointer-events-none" />
          )}

          {/* Pure-CSS Gavel Assembly */}
          <div 
            onClick={handleStrike}
            className="relative w-44 h-32 cursor-pointer transition-transform ease-out flex items-center justify-center"
            style={{
              transformStyle: 'preserve-3d',
              transform: isStriking 
                ? 'rotateX(-20deg) rotateY(-10deg) rotateZ(35deg) translate3d(0px, 20px, 0)' // Hammer strike
                : 'rotateX(-12deg) rotateY(-5deg) rotateZ(-12deg)', // Standing position
              transition: isStriking ? 'transform 0.15s cubic-bezier(0.6, -0.28, 0.735, 0.04)' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            title="Click to Strike the Gavel!"
          >
            {/* Gavel Head and Handle container */}
            <div className="relative w-32 h-20 transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
              
              {/* Wooden Gavel Handle */}
              <div 
                className="absolute w-24 h-3.5 bg-gradient-to-r from-amber-900 to-amber-700 rounded-full border border-amber-950/40"
                style={{
                  top: '28px',
                  left: '12px',
                  transform: 'rotate(-25deg) translateZ(10px)',
                  boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2), 0 2px 5px rgba(0,0,0,0.3)'
                }}
              />

              {/* Wooden Gavel Head (cylinder block) */}
              <div 
                className="absolute w-10 h-16 bg-gradient-to-b from-amber-950 via-amber-800 to-amber-950 rounded-lg border-2 border-amber-900 shadow-md flex flex-col justify-between p-1"
                style={{
                  top: '0px',
                  left: '82px',
                  transform: 'rotate(20deg) translateZ(15px)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.45)'
                }}
              >
                {/* Gold brass rings at gavel edges */}
                <div className="w-full h-1 bg-[#f8b146]/50 rounded-[1px] border-b border-black/25" />
                <div className="w-full h-1 bg-[#f8b146]/50 rounded-[1px] border-t border-black/25" />
              </div>

            </div>
          </div>

          {/* Wooden Sound Block underneath */}
          <div 
            className="absolute bottom-4 w-28 h-6 bg-gradient-to-b from-amber-950 to-amber-900 rounded-full border border-amber-950 flex items-center justify-center shadow-lg"
            style={{
              boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.15), 0 4px 8px rgba(0,0,0,0.45)'
            }}
          >
            {/* Wood ring detail */}
            <div className="w-[88%] h-[68%] rounded-full border border-amber-900/40 bg-radial-gradient from-amber-900/10 to-transparent" />
          </div>

          {!currentRuling && (
            <div className="absolute top-2.5 font-mono text-[8px] uppercase tracking-widest text-[#f8b146]/60 font-bold animate-pulse">
              Click the Gavel to Issue a Tableside Decree
            </div>
          )}
        </div>

        {/* DECISION BOARD / OUTPUT */}
        <div className="relative w-full h-[180px] flex items-center justify-center">
          {currentRuling ? (
            <div className="w-full h-full bg-[#25102a]/60 border border-[#f8b146]/25 rounded-2xl p-5 text-left flex flex-col justify-between shadow-inner animate-toast-slide-up">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-widest text-[#f8b146] font-black">
                  {currentRuling.caseName}
                </span>
                <h4 className="font-sans font-black text-[12px] tracking-tight text-white uppercase mt-1 leading-snug">
                  {currentRuling.ruling}
                </h4>
                <p className="font-sans font-light text-[11px] text-[#C8B1CC] mt-2 leading-relaxed">
                  {currentRuling.details}
                </p>
              </div>
              
              <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                <span className="font-serif italic text-[9px] text-[#f28a75]">
                  {currentRuling.precedent}
                </span>
                <span className="font-mono text-[7px] text-[#C8B1CC]/40 font-bold">ICBG SUPREME COURT</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 text-white/30">
              <Gavel className="opacity-20 mb-3 animate-bounce" size={32} />
              <span className="font-mono text-[9px] uppercase tracking-widest font-black">
                Awaiting Strategic Arbitration
              </span>
              <p className="font-sans text-[10px] text-[#C8B1CC]/40 mt-1 max-w-xs text-center font-light leading-relaxed">
                Click the gavel. The disputes court rules on analysis paralysis, card peeking, or illegal move rollbacks.
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-8 flex gap-3 justify-center">
          {currentRuling && (
            <button
              onClick={handleStrike}
              className="py-2 px-4 rounded-xl border border-[#f8b146]/45 text-[#f8b146] hover:bg-[#f8b146]/10 transition-all duration-300 font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:scale-102"
            >
              Strike Again
            </button>
          )}
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#3a1d42] transition-all duration-300 font-sans font-bold text-[9px] uppercase tracking-widest cursor-pointer hover:scale-102 hover:shadow-[0_4px_12px_rgba(248,177,70,0.3)]"
          >
            Close Courtroom
          </button>
        </div>

      </div>
    </div>
  );
}
