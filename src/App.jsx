import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import WeeklySpotlight from './components/WeeklySpotlight';
import Collection from './components/Collection';
import CollectionTeaser from './components/CollectionTeaser';
import Gallery, { DEFAULT_IMAGES } from './components/Gallery';
import JoinForm from './components/JoinForm';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import JengaTopple from './components/JengaTopple';
import DeckOfDestiny from './components/DeckOfDestiny';
import MeepleRain from './components/MeepleRain';
import DisputesCourt from './components/DisputesCourt';

// Import original games list (used by WeeklySpotlight to resolve featured titles)
import gamesData from './data/board_games.json';

// Default schedule
const DEFAULT_SCHEDULE = {
  nextHangout: "Friday, 22/5/2026 7:30 PM",
  thursdayDate: "28/5/26 7:00 PM",
  fridayDate: "22/5/26 7:00 PM",
  featuredGameTitles: ["Hellapagos", "Outsmarted!", "7 Wonders", "Cascadia"]
};

export default function App() {
  // Easter Egg & Admin States
  const [isGamingMode, setIsGamingMode] = useState(false);
  const [isJengaActive, setIsJengaActive] = useState(false);
  const [isMeepleRainActive, setIsMeepleRainActive] = useState(false);
  const [isDisputesOpen, setIsDisputesOpen] = useState(false);
  const [isTableFlipped, setIsTableFlipped] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Admin-added games (stored in localStorage, separate from base JSON)
  const [extraGames, setExtraGames] = useState(() => {
    try {
      const stored = localStorage.getItem('icbg_extra_games');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  // Schedule state
  const [schedule, setSchedule] = useState(() => {
    try {
      const stored = localStorage.getItem('icbg_weekly_schedule');
      return stored ? JSON.parse(stored) : DEFAULT_SCHEDULE;
    } catch { return DEFAULT_SCHEDULE; }
  });

  // SPA Custom Routing State
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash;
    return hash === '#/collection' || hash === '#collection' ? 'collection' : 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/collection' || hash === '#collection') {
        setCurrentView('collection');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setCurrentView('home');
        if (hash && hash !== '#/' && hash !== '#') {
          const id = hash.replace('#', '').replace('/', '');
          setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check for deep links on mount
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global Konami Code Event Listener (bulletproof physically layout-independent using e.code)
  useEffect(() => {
    const konamiCodeCodes = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];
    let inputSequence = [];

    const handleKeyDown = (e) => {
      // Avoid firing when user is typing in forms/inputs
      if (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        document.activeElement.isContentEditable
      ) {
        return;
      }

      const code = e.code;
      inputSequence.push(code);
      
      // Keep only the last N keystrokes
      inputSequence = inputSequence.slice(-konamiCodeCodes.length);
      
      if (JSON.stringify(inputSequence) === JSON.stringify(konamiCodeCodes)) {
        setIsGamingMode(true);
        inputSequence = [];
        
        // Trigger a premium lounge entry toast notification
        const alertToast = document.createElement('div');
        alertToast.className = 'fixed bottom-10 left-1/2 -translate-x-1/2 z-50 py-4 px-8 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#3a1d42] font-mono text-[10px] uppercase tracking-widest font-black rounded-full shadow-[0_0_35px_rgba(248,177,70,0.55)] border border-white/20 select-none animate-bounce';
        alertToast.innerHTML = 'Midnight Neon Lounge Mode Activated 🌌';
        document.body.appendChild(alertToast);
        
        setTimeout(() => {
          alertToast.style.opacity = '0';
          alertToast.style.transition = 'opacity 1s ease-out';
          setTimeout(() => alertToast.remove(), 1000);
        }, 4000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Global F-L-I-P Keyboard Listener for 3D Table Flip Easter Egg (physically layout-independent using e.code)
  useEffect(() => {
    const targetSequenceCodes = ['KeyF', 'KeyL', 'KeyI', 'KeyP'];
    let inputSeq = [];

    const handleKeyDown = (e) => {
      // Avoid firing when user is typing in forms/inputs
      if (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        document.activeElement.isContentEditable
      ) {
        return;
      }

      const code = e.code;
      inputSeq.push(code);
      inputSeq = inputSeq.slice(-targetSequenceCodes.length);

      if (JSON.stringify(inputSeq) === JSON.stringify(targetSequenceCodes)) {
        setIsTableFlipped(true);
        inputSeq = [];

        // Auto restore the table after 3.5s
        setTimeout(() => {
          setIsTableFlipped(false);
        }, 3500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto reset gaming lounge after 10s
  useEffect(() => {
    if (isGamingMode) {
      const timer = setTimeout(() => {
        setIsGamingMode(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isGamingMode]);

  // Gallery images (stored in localStorage, initialized with defaults)
  const [galleryImages, setGalleryImages] = useState(() => {
    try {
      const stored = localStorage.getItem('icbg_gallery_images');
      return stored ? JSON.parse(stored) : DEFAULT_IMAGES;
    } catch { return DEFAULT_IMAGES; }
  });

  // Fetch routines for Supabase
  const fetchGames = async () => {
    try {
      const { data, error } = await supabase.from('extra_games').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        // Map database naming back to React keys
        const mapped = data.map(item => ({
          id: item.id,
          num: item.num,
          title: item.title,
          type: item.type,
          competition: item.competition,
          theme: item.theme,
          players: item.players,
          time: item.time,
          year: item.year,
          expansion: item.expansion,
          box_img: item.box_img,
          play_img: item.play_img,
          how_to_play: item.how_to_play,
          quick_summary: item.quick_summary,
          rating: item.rating
        }));
        setExtraGames(mapped);
      }
    } catch (e) {
      console.warn("Failed to fetch games from Supabase, falling back to local storage:", e);
    }
  };

  const fetchSchedule = async () => {
    try {
      const { data, error } = await supabase.from('weekly_schedule').select('*').eq('id', 1).single();
      if (error) throw error;
      if (data) {
        setSchedule({
          nextHangout: data.next_hangout,
          thursdayDate: data.thursday_date,
          fridayDate: data.friday_date,
          featuredGameTitles: data.featured_game_titles
        });
      }
    } catch (e) {
      console.warn("Failed to fetch schedule from Supabase, falling back to local storage:", e);
    }
  };

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        // Map database naming back to React keys
        const mapped = data.map(item => ({
          id: item.id,
          src: item.src,
          title: item.title,
          category: item.category,
          aspect: item.aspect,
          desc: item.description
        }));
        setGalleryImages(mapped);
      }
    } catch (e) {
      console.warn("Failed to fetch gallery from Supabase, falling back to local storage:", e);
    }
  };

  // Sync with Supabase on mount if keys are configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchGames();
      fetchSchedule();
      fetchGallery();
    }
  }, []);

  // Safe helper to write to localStorage to prevent quota and incognito crashes
  const safeSetItem = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Failed to write to localStorage:", e);
    }
  };

  // All games = base JSON + admin-added
  const allGames = [...extraGames, ...gamesData];

  // Handler to add a new board game (admin only)
  const handleAddGame = async (newGame) => {
    const updated = [newGame, ...extraGames];
    setExtraGames(updated);
    safeSetItem('icbg_extra_games', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('extra_games').insert([{
          num: newGame.num,
          title: newGame.title,
          type: newGame.type,
          competition: newGame.competition,
          theme: newGame.theme,
          players: newGame.players,
          time: newGame.time,
          year: newGame.year,
          expansion: newGame.expansion,
          box_img: newGame.box_img || '',
          play_img: newGame.play_img || '',
          how_to_play: newGame.how_to_play || '',
          quick_summary: newGame.quick_summary || '',
          rating: newGame.rating || ''
        }]);
        if (error) throw error;
        fetchGames(); // Refresh to obtain actual database IDs
      } catch (e) {
        console.error("Supabase handleAddGame error:", e);
      }
    }
  };

  // Handler to update the weekly campaign schedule
  const handleUpdateSchedule = async (newSchedule) => {
    setSchedule(newSchedule);
    safeSetItem('icbg_weekly_schedule', JSON.stringify(newSchedule));

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('weekly_schedule').upsert({
          id: 1,
          next_hangout: newSchedule.nextHangout,
          thursday_date: newSchedule.thursdayDate,
          friday_date: newSchedule.fridayDate,
          featured_game_titles: newSchedule.featuredGameTitles,
          updated_at: new Date().toISOString()
        });
        if (error) throw error;
      } catch (e) {
        console.error("Supabase handleUpdateSchedule error:", e);
      }
    }
  };

  // Handler to add a gallery image
  const handleAddGalleryImage = async (newImage) => {
    const updated = [...galleryImages, newImage];
    setGalleryImages(updated);
    safeSetItem('icbg_gallery_images', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('gallery_images').insert([{
          src: newImage.src,
          title: newImage.title,
          category: newImage.category,
          aspect: newImage.aspect,
          description: newImage.desc
        }]);
        if (error) throw error;
        fetchGallery();
      } catch (e) {
        console.error("Supabase handleAddGalleryImage error:", e);
      }
    }
  };

  // Handler to remove a gallery image by index
  const handleRemoveGalleryImage = async (index) => {
    const imgToRemove = galleryImages[index];
    const updated = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updated);
    safeSetItem('icbg_gallery_images', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      try {
        if (imgToRemove.id) {
          const { error } = await supabase.from('gallery_images').delete().eq('id', imgToRemove.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('gallery_images').delete().eq('src', imgToRemove.src).eq('title', imgToRemove.title);
          if (error) throw error;
        }
      } catch (e) {
        console.error("Supabase handleRemoveGalleryImage error:", e);
      }
    }
  };

  // Handler to update a gallery image by index
  const handleUpdateGalleryImage = async (index, updatedImage) => {
    const updated = galleryImages.map((img, i) => i === index ? updatedImage : img);
    setGalleryImages(updated);
    safeSetItem('icbg_gallery_images', JSON.stringify(updated));

    if (isSupabaseConfigured) {
      try {
        if (updatedImage.id) {
          const { error } = await supabase.from('gallery_images').update({
            src: updatedImage.src,
            title: updatedImage.title,
            category: updatedImage.category,
            aspect: updatedImage.aspect,
            description: updatedImage.desc
          }).eq('id', updatedImage.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('gallery_images').update({
            src: updatedImage.src,
            title: updatedImage.title,
            category: updatedImage.category,
            aspect: updatedImage.aspect,
            description: updatedImage.desc
          }).eq('src', updatedImage.src);
          if (error) throw error;
        }
      } catch (e) {
        console.error("Supabase handleUpdateGalleryImage error:", e);
      }
    }
  };

  // Smooth scroll helper
  const handleScrollToCollection = () => {
    window.location.hash = '#/collection';
  };

  return (
    <div className={`relative min-h-screen bg-[#4a2b53] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#643b6e] via-[#4a2b53] to-[#1d0a21] text-[#FDFBFF] selection:bg-[#f8b146]/20 selection:text-white select-none overflow-x-hidden ${isGamingMode ? 'gaming-mode' : ''} ${isTableFlipped ? 'table-flip-active' : ''}`}>
      {/* Dynamic Ambient Spotlight Glows */}
      <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full filter blur-[150px] pointer-events-none z-0 transition-all duration-[1.2s] ${
        isGamingMode ? 'bg-indigo-500/15' : 'bg-[#f8b146]/8'
      }`} />
      <div className={`absolute top-[25%] left-[-10%] w-[700px] h-[700px] rounded-full filter blur-[160px] pointer-events-none z-0 transition-all duration-[1.2s] ${
        isGamingMode ? 'bg-[#f8b146]/10' : 'bg-[#f28a75]/8'
      }`} />
      <div className={`absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full filter blur-[140px] pointer-events-none z-0 transition-all duration-[1.2s] ${
        isGamingMode ? 'bg-purple-600/10' : 'bg-[#f8b146]/5'
      }`} />

      {/* Floating Island Navigation */}
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} currentView={currentView} />

      {/* Main Experience sections */}
      <main>
        {currentView === 'collection' ? (
          /* Dedicated subpage (Collection Archive) */
          <div className="pt-24">
            <Collection extraGames={extraGames} />
          </div>
        ) : (
          /* Main Landing Page View */
          <>
            {/* The Opening Shot (Hero) */}
            <Hero />

            {/* The Manifesto (Philosophy) */}
            <Philosophy onTriggerMeepleRain={() => setIsMeepleRainActive(true)} />

            {/* Weekly Spotlight (Featured Campaign & Gathering Info) */}
            <WeeklySpotlight 
              schedule={schedule} 
              games={allGames} 
              onScrollToCollection={handleScrollToCollection} 
            />

            {/* Curated Collection Preview (Teaser Showcase) */}
            <CollectionTeaser onNavigateToFullCollection={handleScrollToCollection} />

            {/* Captured Moments (Gallery) */}
            <Gallery images={galleryImages} />

            {/* Membership Admission & Vetted Onboarding Form */}
            <JoinForm />
          </>
        )}
      </main>

      {/* The Rounded Obsidian Footer */}
      <Footer onTriggerJenga={() => setIsJengaActive(true)} onOpenDisputes={() => setIsDisputesOpen(true)} />

      {/* Jenga Easter Egg Component */}
      <JengaTopple isOpen={isJengaActive} onClose={() => setIsJengaActive(false)} />

      {/* Meeple Rain Easter Egg Component */}
      <MeepleRain isOpen={isMeepleRainActive} onClose={() => setIsMeepleRainActive(false)} />

      {/* Deck of Destiny Chance Cards Dealer */}
      <DeckOfDestiny />

      {/* Tabletop Supreme Disputes Court Modal */}
      <DisputesCourt isOpen={isDisputesOpen} onClose={() => setIsDisputesOpen(false)} />

      {/* Floating 3D Table Flipped Alert Banner */}
      {isTableFlipped && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] py-4 px-8 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#3a1d42] font-mono text-[11px] uppercase tracking-widest font-black rounded-full shadow-[0_15px_40px_rgba(248,177,70,0.55)] border border-white/20 select-none animate-bounce flex flex-col items-center">
          <span>⚠️ TABLE FLIPPED! ⚠️</span>
          <span className="text-[8px] font-sans font-light opacity-80 mt-1 text-center">
            Retrieving board pieces and 12 sheep from under the couch...
          </span>
        </div>
      )}

      {/* Admin Control Panel (hidden, opened via secret logo clicks) */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        games={allGames} 
        onAddGame={handleAddGame}
        schedule={schedule}
        onUpdateSchedule={handleUpdateSchedule}
        galleryImages={galleryImages}
        onAddGalleryImage={handleAddGalleryImage}
        onRemoveGalleryImage={handleRemoveGalleryImage}
        onUpdateGalleryImage={handleUpdateGalleryImage}
      />
    </div>
  );
}
