import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, RefreshCw } from 'lucide-react';

const CHANCE_CARDS = [
  {
    title: "THE RULE LAWYER",
    subtitle: "Strategic Infraction Detector",
    description: "You spent 45 minutes reading BoardGameGeek forums during an active turn to prove a minor technical point.",
    quote: "IBGC Community Rule #12: Diagonal movement is technically undefined on hexagonal grids unless you bribe the banker.",
    badge: "0 Respect, +1 Argument"
  },
  {
    title: "ANALYSIS PARALYSIS",
    subtitle: "The Infinite Thinker",
    description: "You have been calculating optimal moves since 2024. The stars have aligned, empires have fallen, and the coffee is ice-cold.",
    quote: "IBGC Rule #72: Players experiencing AP will be gently synchronized with a ticking egg-timer of ultimate doom.",
    badge: "Cold Coffee, 0 Moves"
  },
  {
    title: "THE MERCILESS TRADER",
    subtitle: "City Architect Monopoly",
    description: "You traded a single wood for 4 ores, a brick, and your opponent's second-born child.",
    quote: "You have zero friends left at the strategic table, but your settlement is now a magnificent metropolis.",
    badge: "No Friends, +1 Victory"
  },
  {
    title: "THE KINGMAKER",
    subtitle: "Snack-Driven Strategy",
    description: "You realize you cannot win, so you deliberately pivot your entire turn to hand victory to the player who brought the snacks.",
    quote: "IBGC Rule #5: The person who brought the gourmet pistachios is legally immune to target-focused attacks.",
    badge: "+10 Snack Champion"
  },
  {
    title: "THE SLEEPY MERLIN",
    subtitle: "Accidental Subversive",
    description: "You spent the entire game of Avalon claiming to be Merlin, only to accidentally fail your own secret quest.",
    quote: "The table enters a state of collective existential confusion. Minions of Mordred thank you for your service.",
    badge: "Minions Rejoice"
  },
  {
    title: "THE DICE GOD'S BLESSING",
    subtitle: "Quantum Victory Roll",
    description: "You rolled a double-six to win the game, but the die bounced off the table and landed deep under the couch.",
    quote: "Schrodinger's victory: it is both a 6 and a 1 until you find a broom to sweep the dust.",
    badge: "Pending Under Couch"
  }
];

export default function DeckOfDestiny() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Track active timeout identifiers using refs to prevent memory leaks and race conditions
  const flipTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  // Safely clear all active timers
  const clearAllTimers = () => {
    if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current);
      flipTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // Draw card handler with proper timeout cleanup and transition management
  const drawCard = () => {
    clearAllTimers();
    setIsFlipped(false);
    
    const randomIndex = Math.floor(Math.random() * CHANCE_CARDS.length);
    setCurrentCard(CHANCE_CARDS[randomIndex]);
    setIsOpen(true);
    
    // Smooth 3D flip timing with ref tracking
    flipTimeoutRef.current = setTimeout(() => {
      setIsFlipped(true);
      flipTimeoutRef.current = null;
    }, 400);
  };

  // Close deck handler with proper timeout cleanup
  const closeDeck = () => {
    clearAllTimers();
    setIsFlipped(false);
    
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setCurrentCard(null);
      closeTimeoutRef.current = null;
    }, 300);
  };

  // Manual click flip handler that clears pending auto-flip timeouts to keep state synced
  const handleCardClick = () => {
    if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current);
      flipTimeoutRef.current = null;
    }
    setIsFlipped((prev) => !prev);
  };

  // Clean up all outstanding timers on unmount to prevent lifecycle memory leaks
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  return (
    <>
      {/* Floating Card Deck Button in Bottom Right */}
      <div className="fixed bottom-28 right-6 z-40 group select-none">
        <button
          onClick={drawCard}
          className="relative flex items-center justify-center w-14 h-14 bg-[#3a1d42]/70 border border-white/10 hover:border-[#f8b146]/50 rounded-2xl backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group-hover:shadow-[0_0_20px_rgba(248,177,70,0.25)] cursor-pointer"
          title="Draw a Destiny Chance Card"
        >
          {/* Gilded Card Deck graphics inside button */}
          <div className="relative w-7 h-9 transform group-hover:rotate-6 transition-transform duration-300">
            {/* Background card */}
            <div className="absolute inset-0 bg-[#f28a75]/40 rounded-[4px] transform -rotate-12 translate-x-[-2px] border border-white/5" />
            {/* Middle card */}
            <div className="absolute inset-0 bg-[#4a2b53] rounded-[4px] transform rotate-6 border border-white/10" />
            {/* Front card */}
            <div className="absolute inset-0 bg-[#f8b146] rounded-[4px] flex items-center justify-center border border-[#3a1d42]/20 shadow-sm">
              <span className="font-mono text-[9px] font-black text-[#3a1d42]">★</span>
            </div>
          </div>

          {/* Micro-sparkle notification */}
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#f8b146] rounded-full border border-[#3a1d42] flex items-center justify-center text-[7px] text-[#3a1d42] font-black animate-pulse">
            !
          </div>
        </button>
      </div>

      {/* 3D Destiny Card Drawing Overlay Modal */}
      {isOpen && currentCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d0a21]/80 backdrop-blur-md transition-opacity duration-300 ease-in-out select-none">
          <div className="relative flex flex-col items-center justify-center p-6 max-w-sm w-full mx-4">
            
            {/* Close handler clicking background */}
            <div className="absolute inset-0 -z-10" onClick={closeDeck} />

            {/* 3D Card Layout Wrapper */}
            <div 
              className="w-72 h-[410px] cursor-pointer"
              style={{
                perspective: '1200px',
              }}
              onClick={handleCardClick}
            >
              <div 
                className="relative w-full h-full transition-transform duration-700 ease-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* CARD FRONT FACE (The Gilded Back of Card) */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-[#4a2b53] to-[#1d0a21] border-2 border-[#f8b146] shadow-[0_15px_45px_rgba(248,177,70,0.18)] rounded-[2.2rem] p-6 flex flex-col items-center justify-between overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  {/* Decorative Frame */}
                  <div className="absolute inset-2 border border-[#f8b146]/30 rounded-[1.8rem] pointer-events-none" />
                  
                  {/* Card Corner Embellishments */}
                  <div className="absolute top-4 left-4 font-mono text-[9px] text-[#f8b146]/40">★</div>
                  <div className="absolute top-4 right-4 font-mono text-[9px] text-[#f8b146]/40">★</div>
                  <div className="absolute bottom-4 left-4 font-mono text-[9px] text-[#f8b146]/40">★</div>
                  <div className="absolute bottom-4 right-4 font-mono text-[9px] text-[#f8b146]/40">★</div>

                  <div className="flex flex-col items-center justify-center flex-1">
                    <div className="w-14 h-14 rounded-full bg-[#f8b146]/10 border border-[#f8b146]/40 flex items-center justify-center text-[#f8b146] mb-4 animate-pulse">
                      <Sparkles size={24} />
                    </div>
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#f8b146] font-bold">
                      DECK OF DESTINY
                    </span>
                    <span className="font-serif italic text-[11px] text-[#C8B1CC]/50 mt-2 text-center">
                      "Strategic chance cards for vetted boardgamers"
                    </span>
                  </div>

                  <div className="font-mono text-[8px] tracking-widest text-[#f8b146]/60 font-bold uppercase select-none">
                    TAP TO REVEAL CARD
                  </div>
                </div>

                {/* CARD BACK FACE (The Revealed Card Details) */}
                <div 
                  className="absolute inset-0 bg-[#3a1d42] border-2 border-[#f8b146] shadow-[0_20px_50px_rgba(248,177,70,0.25)] rounded-[2.2rem] p-6 flex flex-col justify-between overflow-hidden text-left"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  {/* Decorative Frame */}
                  <div className="absolute inset-2 border border-[#f8b146]/25 rounded-[1.8rem] pointer-events-none" />
                  
                  <div>
                    {/* Card Header */}
                    <div className="pb-3 border-b border-white/10 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-mono text-[8px] uppercase tracking-widest text-[#f8b146] font-black">
                          DESTINY CHANCE CARD
                        </span>
                        <h3 className="font-sans font-black text-lg text-white mt-0.5 tracking-tight uppercase">
                          {currentCard.title}
                        </h3>
                        <span className="font-mono text-[8px] text-[#f28a75] mt-0.5 font-bold uppercase">
                          {currentCard.subtitle}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-[#f8b146]/10 border border-[#f8b146]/40 flex items-center justify-center text-[#f8b146] font-black text-[10px]">
                        ★
                      </div>
                    </div>

                    {/* Card Content Description */}
                    <div className="mt-5 flex flex-col gap-4">
                      <div>
                        <span className="font-mono text-[8px] uppercase tracking-wider text-[#f8b146] font-bold">
                          The Scenario
                        </span>
                        <p className="font-sans text-[11px] text-[#C8B1CC] font-light leading-relaxed mt-1">
                          {currentCard.description}
                        </p>
                      </div>

                      <div>
                        <span className="font-mono text-[8px] uppercase tracking-wider text-[#f28a75] font-bold">
                          Tableside Inside Joke
                        </span>
                        <p className="font-serif italic text-[11px] text-white leading-relaxed mt-1">
                          "{currentCard.quote}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Details */}
                  <div className="pt-3.5 border-t border-white/10 flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="font-mono text-[7px] text-[#C8B1CC]/40 font-bold uppercase">Strategic Outcome</span>
                      <span className="font-mono text-[9px] font-black text-[#f8b146] uppercase mt-0.5">
                        {currentCard.badge}
                      </span>
                    </div>
                    <span className="font-mono text-[8px] text-[#C8B1CC]/30 font-bold">IBGC ATELIER</span>
                  </div>

                </div>

              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex gap-3.5 mt-8 z-30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  drawCard();
                }}
                className="py-2.5 px-4 rounded-xl border border-[#f8b146]/35 text-[#f8b146] hover:bg-[#f8b146]/10 transition-all duration-300 font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:scale-102"
              >
                <RefreshCw size={10} /> Draw Another
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeDeck();
                }}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#3a1d42] hover:shadow-[0_4px_15px_rgba(248,177,70,0.35)] transition-all duration-300 font-sans font-bold text-[9px] uppercase tracking-widest flex items-center gap-1 cursor-pointer hover:scale-102"
              >
                <X size={10} /> Return
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
