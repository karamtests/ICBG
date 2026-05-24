import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Lock, Unlock, X, Plus, Calendar, Save, Search, Check, Sparkles, Film, Play, Eye, Image as ImageIcon, Trash2, Pencil, Dices, Upload, Loader2 } from 'lucide-react';

export default function AdminPanel({ isOpen, onClose, games, onAddGame, onUpdateGame, schedule, onUpdateSchedule, galleryImages, onAddGalleryImage, onRemoveGalleryImage, onUpdateGalleryImage }) {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule', 'addGame', 'gallery', or 'applicants'
  const [applicantsList, setApplicantsList] = useState([]);

  // Schedule form state
  const [nextHangout, setNextHangout] = useState('');
  const [thursdayDate, setThursdayDate] = useState('');
  const [fridayDate, setFridayDate] = useState('');
  const [featuredTitles, setFeaturedTitles] = useState([]);
  const [gameSearch, setGameSearch] = useState('');

  // Add Game form state
  const [newGameTitle, setNewGameTitle] = useState('');
  const [newGameType, setNewGameType] = useState('Light');
  const [newGameComp, setNewGameComp] = useState('Competitive');
  const [newGameTheme, setNewGameTheme] = useState('');
  const [newGamePlayers, setNewGamePlayers] = useState('');
  const [newGameTime, setNewGameTime] = useState('');
  const [newGameYear, setNewGameYear] = useState('');
  const [newGameExpansion, setNewGameExpansion] = useState('None');
  const [newGameHowToPlay, setNewGameHowToPlay] = useState('');
  const [newGameQuickSummary, setNewGameQuickSummary] = useState('');
  const [newGameBoxImg, setNewGameBoxImg] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Media upload states
  const [isUploadingGame, setIsUploadingGame] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [gameUploadError, setGameUploadError] = useState('');
  const [galleryUploadError, setGalleryUploadError] = useState('');

  // Gallery form state
  const [galleryUrl, setGalleryUrl] = useState('');
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('Play Session');
  const [galleryDesc, setGalleryDesc] = useState('');
  const [galleryAspect, setGalleryAspect] = useState('aspect-square');

  // Gallery Editing states & helpers
  const [editingImageIndex, setEditingImageIndex] = useState(null);

  // Game Management / Editing State
  const [editingGame, setEditingGame] = useState(null);
  const [manageGameSearch, setManageGameSearch] = useState('');
  const [editGameTitle, setEditGameTitle] = useState('');
  const [editGameType, setEditGameType] = useState('Light');
  const [editGameComp, setEditGameComp] = useState('Competitive');
  const [editGameTheme, setEditGameTheme] = useState('');
  const [editGamePlayers, setEditGamePlayers] = useState('');
  const [editGameTime, setEditGameTime] = useState('');
  const [editGameYear, setEditGameYear] = useState('');
  const [editGameExpansion, setEditGameExpansion] = useState('None');
  const [editGameHowToPlay, setEditGameHowToPlay] = useState('');
  const [editGameQuickSummary, setEditGameQuickSummary] = useState('');
  const [editGameBoxImg, setEditGameBoxImg] = useState('');
  const [isUploadingEditGame, setIsUploadingEditGame] = useState(false);
  const [editGameUploadError, setEditGameUploadError] = useState('');

  const handleStartEditGame = (game) => {
    setEditingGame(game);
    setEditGameTitle(game.title || '');
    setEditGameType(game.type || 'Light');
    setEditGameComp(game.competition || 'Competitive');
    setEditGameTheme(game.theme || '');
    setEditGamePlayers(game.players || '');
    setEditGameTime(game.time || '');
    setEditGameYear(game.year || '');
    setEditGameExpansion(game.expansion || 'None');
    setEditGameHowToPlay(game.how_to_play || '');
    setEditGameQuickSummary(game.quick_summary || '');
    setEditGameBoxImg(game.box_img || '');
    setEditGameUploadError('');
  };

  const handleCancelEditGame = () => {
    setEditingGame(null);
  };

  const handleEditGameImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingEditGame(true);
    setEditGameUploadError('');

    try {
      const publicUrl = await uploadMedia(file, 'games');
      setEditGameBoxImg(publicUrl);
    } catch (err) {
      console.error("Edit game image upload error:", err);
      setEditGameUploadError(err.message || 'Failed to upload image file.');
    } finally {
      setIsUploadingEditGame(false);
    }
  };

  const handleEditGameSubmit = (e) => {
    e.preventDefault();
    if (!editGameTitle || !editingGame) return;

    // Validate How-to-play URL
    if (editGameHowToPlay && !isValidUrl(editGameHowToPlay)) {
      alert('Please enter a valid YouTube tutorial URL (starting with http:// or https://)');
      return;
    }

    // Validate Quick Summary URL
    if (editGameQuickSummary && !isValidUrl(editGameQuickSummary)) {
      alert('Please enter a valid Quick Summary URL (starting with http:// or https://)');
      return;
    }

    const updatedGameObj = {
      ...editingGame,
      title: editGameTitle,
      type: editGameType,
      competition: editGameComp,
      theme: editGameTheme,
      players: editGamePlayers,
      time: editGameTime,
      year: editGameYear,
      expansion: editGameExpansion,
      box_img: editGameBoxImg,
      how_to_play: editGameHowToPlay,
      quick_summary: editGameQuickSummary
    };

    onUpdateGame(updatedGameObj);
    setFormSuccess(`Successfully updated "${editGameTitle}" in the Atelier vault!`);
    setEditingGame(null);
    setTimeout(() => setFormSuccess(''), 3000);
  };

  const clearGalleryForm = () => {
    setGalleryUrl('');
    setGalleryTitle('');
    setGalleryDesc('');
    setGalleryCategory('Play Session');
    setGalleryAspect('aspect-square');
    setEditingImageIndex(null);
  };

  const handleStartEditGalleryImage = (index) => {
    const img = galleryImages[index];
    setGalleryUrl(img.src);
    setGalleryTitle(img.title);
    setGalleryCategory(img.category || 'Play Session');
    setGalleryAspect(img.aspect || 'aspect-square');
    setGalleryDesc(img.desc || '');
    setEditingImageIndex(index);
  };

  // Sync state with props when open, reset auth when closed
  useEffect(() => {
    if (isOpen) {
      setNextHangout(schedule.nextHangout || '');
      setThursdayDate(schedule.thursdayDate || '');
      setFridayDate(schedule.fridayDate || '');
      setFeaturedTitles(schedule.featuredGameTitles || []);
      setFormSuccess('');
    } else {
      // Reset auth when panel closes so passcode is required again
      setIsAuthenticated(false);
      setPasscode('');
      setAuthError('');
      clearGalleryForm();
      setEditingGame(null);
    }
  }, [isOpen, schedule]);

  // Fetch applications when panel is open or tab changes
  useEffect(() => {
    const fetchApplicants = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
          if (error) throw error;
          if (data) {
            // Map keys back
            const mapped = data.map(item => ({
              id: item.id,
              fullName: item.full_name,
              email: item.email,
              phone: item.phone,
              gameTypes: item.game_types,
              date: item.created_at
            }));
            setApplicantsList(mapped);
            return;
          }
        } catch (e) {
          console.warn("Failed to fetch applications from Supabase, falling back to local storage:", e);
        }
      }

      // Fallback
      try {
        const stored = localStorage.getItem('ibgc_applications');
        setApplicantsList(stored ? JSON.parse(stored) : []);
      } catch (e) {
        console.warn("Failed to parse applications from localStorage:", e);
      }
    };

    if (isOpen) {
      fetchApplicants();
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const isValidUrl = (str) => {
    if (!str) return true;
    try {
      const url = new URL(str);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Supabase Storage Generic File Upload Helper
  const uploadMedia = async (file, pathPrefix) => {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase connection is not configured in .env file.");
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${pathPrefix}/${fileName}`;

    // Upload to 'icbg-media' bucket
    const { data, error } = await supabase.storage
      .from('icbg-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public loading URL
    const { data: { publicUrl } } = supabase.storage
      .from('icbg-media')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleGameImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingGame(true);
    setGameUploadError('');

    try {
      const publicUrl = await uploadMedia(file, 'games');
      setNewGameBoxImg(publicUrl);
    } catch (err) {
      console.error("Game image upload error:", err);
      setGameUploadError(err.message || 'Failed to upload image file.');
    } finally {
      setIsUploadingGame(false);
    }
  };

  const handleGalleryImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingGallery(true);
    setGalleryUploadError('');

    try {
      const publicUrl = await uploadMedia(file, 'gallery');
      setGalleryUrl(publicUrl);
    } catch (err) {
      console.error("Gallery image upload error:", err);
      setGalleryUploadError(err.message || 'Failed to upload image file.');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    // Base64 obfuscated passcode check matching '1983'
    if (btoa(passcode) === 'MTk4Mw==') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Please try again.');
      setPasscode('');
    }
  };

  const handleScheduleSave = (e) => {
    e.preventDefault();
    onUpdateSchedule({
      nextHangout,
      thursdayDate,
      fridayDate,
      featuredGameTitles: featuredTitles
    });
    setFormSuccess('Weekly campaign schedule updated successfully!');
    setTimeout(() => setFormSuccess(''), 3000);
  };

  const handleAddGameSubmit = (e) => {
    e.preventDefault();
    if (!newGameTitle) return;

    // Validate How-to-play URL
    if (newGameHowToPlay && !isValidUrl(newGameHowToPlay)) {
      alert('Please enter a valid YouTube tutorial URL (starting with http:// or https://)');
      return;
    }

    // Validate Quick Summary URL
    if (newGameQuickSummary && !isValidUrl(newGameQuickSummary)) {
      alert('Please enter a valid Quick Summary URL (starting with http:// or https://)');
      return;
    }

    const gameObj = {
      num: String(games.length + 1),
      title: newGameTitle,
      type: newGameType,
      competition: newGameComp,
      theme: newGameTheme || 'Strategic Board Game',
      players: newGamePlayers || '2-4 Players',
      time: newGameTime || '30-45 Min',
      year: newGameYear || new Date().getFullYear().toString(),
      expansion: newGameExpansion || 'None',
      box_img: newGameBoxImg || '', // uploads fallback
      box_link: '',
      play_img: '',
      play_link: '',
      how_to_play: newGameHowToPlay,
      quick_summary: newGameQuickSummary,
      rating: ''
    };

    onAddGame(gameObj);
    setFormSuccess(`Successfully added "${newGameTitle}" to the Atelier vault!`);
    
    // Reset form
    setNewGameTitle('');
    setNewGameTheme('');
    setNewGamePlayers('');
    setNewGameTime('');
    setNewGameYear('');
    setNewGameExpansion('None');
    setNewGameHowToPlay('');
    setNewGameQuickSummary('');
    setNewGameBoxImg('');

    setTimeout(() => setFormSuccess(''), 3000);
  };

  const toggleFeaturedGame = (title) => {
    if (featuredTitles.includes(title)) {
      setFeaturedTitles(featuredTitles.filter(t => t !== title));
    } else {
      setFeaturedTitles([...featuredTitles, title]);
    }
  };

  // Filter games based on search text in the scheduler
  const filteredGamesForSelect = games.filter(game =>
    game.title.toLowerCase().includes(gameSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Dark backdrop overlay with elegant sunset plum glassmorphism blur */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[#25102a]/60 backdrop-blur-md transition-all duration-300"
      />

      {/* Main Admin Card */}
      <div className="relative w-full max-w-3xl bg-[#3a1d42]/95 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(248,177,70,0.12)] z-10 flex flex-col max-h-[90vh] backdrop-blur-md text-white">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f8b146]/10 border border-[#f8b146]/30 flex items-center justify-center text-[#f8b146] shadow-[0_0_15px_rgba(248,177,70,0.15)]">
              {isAuthenticated ? <Unlock size={18} /> : <Lock size={18} />}
            </div>
            <div className="text-left">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#f8b146] font-bold block">IBGC CLUB ATELIER</span>
              <h3 className="font-sans font-black text-xl text-white">Admin Control Center</h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-white/10 hover:border-[#f8b146]/40 text-white/75 hover:text-[#f8b146] transition-all duration-300 flex items-center justify-center cursor-pointer bg-white/5"
          >
            <X size={16} />
          </button>
        </div>

        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="p-8 md:p-12 flex flex-col items-center justify-center flex-1">
            <div className="w-16 h-16 rounded-full bg-[#f8b146]/5 border border-[#f8b146]/20 flex items-center justify-center text-[#f8b146] mb-6 animate-pulse">
              <Lock size={28} />
            </div>
            <h4 className="font-sans font-bold text-lg text-white mb-2 text-center">Private Administration Portal</h4>
            <p className="font-sans font-light text-xs text-[#C8B1CC] text-center max-w-sm mb-8 leading-relaxed">
              Please enter the secret passcode of Irbid Board Games Community (IBGC) to unlock administrative controls.
            </p>

            <form onSubmit={handleAuthSubmit} className="w-full max-w-xs flex flex-col items-center">
              <input
                type="password"
                placeholder="Secret Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full py-4 px-6 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] text-white placeholder-white/30 rounded-full font-mono text-center text-lg tracking-[0.3em] focus:outline-none focus:ring-1 focus:ring-[#f8b146]/20 transition-all duration-300"
                autoFocus
              />
              {authError && (
                <span className="text-[11px] font-sans text-red-400 mt-3 text-center">{authError}</span>
              )}

              <button
                type="submit"
                className="mt-6 w-full py-4 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#3a1d42] rounded-full font-sans font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#f8b146]/15 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                Enter Portal
              </button>
            </form>
            <span className="font-mono text-[9px] text-[#C8B1CC]/40 mt-10">HINT: YEAR OF JENGA RELEASE</span>
          </div>
        ) : (
          /* Authenticated Dashboard Panel */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-[#25102a]/30 px-4 overflow-x-auto whitespace-nowrap scrollbar-none">
              <button
                onClick={() => { setActiveTab('schedule'); setFormSuccess(''); }}
                className={`px-6 py-4 font-mono text-xs uppercase tracking-widest relative transition-all duration-300 cursor-pointer ${
                  activeTab === 'schedule' ? 'text-[#f8b146] font-bold' : 'text-[#C8B1CC] hover:text-white'
                }`}
              >
                Weekly Campaign Schedule
                {activeTab === 'schedule' && (
                  <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#f8b146]" />
                )}
              </button>
              
              <button
                onClick={() => { setActiveTab('addGame'); setFormSuccess(''); }}
                className={`px-6 py-4 font-mono text-xs uppercase tracking-widest relative transition-all duration-300 cursor-pointer ${
                  activeTab === 'addGame' ? 'text-[#f8b146] font-bold' : 'text-[#C8B1CC] hover:text-white'
                }`}
              >
                Archive New Game
                {activeTab === 'addGame' && (
                  <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#f8b146]" />
                )}
              </button>

              <button
                onClick={() => { setActiveTab('manageGames'); setFormSuccess(''); }}
                className={`px-6 py-4 font-mono text-xs uppercase tracking-widest relative transition-all duration-300 cursor-pointer ${
                  activeTab === 'manageGames' ? 'text-[#f8b146] font-bold' : 'text-[#C8B1CC] hover:text-white'
                }`}
              >
                Manage Games
                {activeTab === 'manageGames' && (
                  <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#f8b146]" />
                )}
              </button>
              
              <button
                onClick={() => { setActiveTab('gallery'); setFormSuccess(''); }}
                className={`px-6 py-4 font-mono text-xs uppercase tracking-widest relative transition-all duration-300 cursor-pointer ${
                  activeTab === 'gallery' ? 'text-[#f8b146] font-bold' : 'text-[#C8B1CC] hover:text-white'
                }`}
              >
                Gallery Manager
                {activeTab === 'gallery' && (
                  <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#f8b146]" />
                )}
              </button>

              <button
                onClick={() => { setActiveTab('applicants'); setFormSuccess(''); }}
                className={`px-6 py-4 font-mono text-xs uppercase tracking-widest relative transition-all duration-300 cursor-pointer ${
                  activeTab === 'applicants' ? 'text-[#f8b146] font-bold' : 'text-[#C8B1CC] hover:text-white'
                }`}
              >
                Applicants List
                {activeTab === 'applicants' && (
                  <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#f8b146]" />
                )}
              </button>
            </div>

            {/* Content Container (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-transparent">
              
              {/* Success Notification Bar */}
              {formSuccess && (
                <div className="bg-emerald-950/40 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3 text-emerald-300 font-sans text-xs font-semibold">
                  <Sparkles size={16} className="text-emerald-400 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {activeTab === 'schedule' ? (
                /* TAB 1: SCHEDULE MANAGER FORM */
                <form onSubmit={handleScheduleSave} className="space-y-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Next Gathering Input */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Main Gathering Title</label>
                      <input
                        type="text"
                        value={nextHangout}
                        onChange={(e) => setNextHangout(e.target.value)}
                        placeholder="e.g. Friday, 22/5/2026 7:30 PM"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>

                    {/* Thursday Date/Time Input */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Thursday Session Time</label>
                      <input
                        type="text"
                        value={thursdayDate}
                        onChange={(e) => setThursdayDate(e.target.value)}
                        placeholder="e.g. 28/5/26 7:00 PM"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>

                    {/* Friday Date/Time Input */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Friday Session Time</label>
                      <input
                        type="text"
                        value={fridayDate}
                        onChange={(e) => setFridayDate(e.target.value)}
                        placeholder="e.g. 22/5/26 7:00 PM"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  {/* Featured Games Selection (Checklist) */}
                  <div className="border-t border-white/10 pt-6 flex flex-col gap-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-sans font-bold text-sm text-white">Weekly Featured Games</h4>
                        <p className="font-sans text-[10px] text-[#C8B1CC]">Select games to highlight on the landing page spotlight</p>
                      </div>
                      <div className="font-mono text-[10px] bg-[#f8b146]/10 border border-[#f8b146]/25 text-[#f8b146] px-3 py-1 rounded-full w-max">
                        Selected {featuredTitles.length} games
                      </div>
                    </div>

                    {/* Selector search */}
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/30">
                        <Search size={14} />
                      </div>
                      <input
                        type="text"
                        placeholder="Search for a game to feature..."
                        value={gameSearch}
                        onChange={(e) => setGameSearch(e.target.value)}
                        className="w-full py-2.5 pl-11 pr-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] text-white placeholder-white/30 rounded-xl font-sans text-xs focus:outline-none transition-all duration-300"
                      />
                    </div>

                    {/* Selectable grid list */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto border border-white/10 rounded-2xl p-4 bg-[#25102a]/30">
                      {filteredGamesForSelect.map((game) => {
                        const isFeatured = featuredTitles.includes(game.title);
                        return (
                          <button
                            type="button"
                            key={game.title}
                            onClick={() => toggleFeaturedGame(game.title)}
                            className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 text-left cursor-pointer ${
                              isFeatured 
                                ? 'bg-[#f8b146]/10 border-[#f8b146]/45 text-white shadow-sm' 
                                : 'bg-[#25102a]/40 border-white/8 text-[#C8B1CC] hover:border-white/20 hover:text-white'
                            }`}
                          >
                            <span className="font-sans font-bold text-xs truncate max-w-[170px]">{game.title}</span>
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                              isFeatured ? 'bg-[#f8b146] border-[#f8b146] text-[#3a1d42]' : 'border-white/20'
                            }`}>
                              {isFeatured && <Check size={10} strokeWidth={4} />}
                            </div>
                          </button>
                        );
                      })}
                      {filteredGamesForSelect.length === 0 && (
                        <div className="col-span-full py-6 text-center text-[#C8B1CC]/40 font-sans text-xs">
                          No matching games found
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="border-t border-white/10 pt-6 flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#3a1d42] rounded-full font-sans font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#f8b146]/15 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                    >
                      <Save size={14} /> Save Weekly Campaign
                    </button>
                  </div>
                </form>
              ) : activeTab === 'addGame' ? (
                /* TAB 2: ADD NEW BOARD GAME FORM */
                <form onSubmit={handleAddGameSubmit} className="space-y-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Game Title */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Game Title *</label>
                      <input
                        type="text"
                        value={newGameTitle}
                        onChange={(e) => setNewGameTitle(e.target.value)}
                        placeholder="e.g. Scythe"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>

                    {/* Complexity Type Dropdown */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Complexity Classification</label>
                      <select
                        value={newGameType}
                        onChange={(e) => setNewGameType(e.target.value)}
                        className="py-3 px-4 bg-[#25102a]/90 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white focus:outline-none transition-all duration-300 cursor-pointer"
                      >
                        <option value="Social" className="bg-[#25102a] text-white">Social</option>
                        <option value="Easy" className="bg-[#25102a] text-white">Easy</option>
                        <option value="Light" className="bg-[#25102a] text-white">Light</option>
                        <option value="Medium" className="bg-[#25102a] text-white">Medium</option>
                        <option value="Heavy" className="bg-[#25102a] text-white">Heavy</option>
                      </select>
                    </div>

                    {/* Format Strategy (Competition) */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Competition Format</label>
                      <select
                        value={newGameComp}
                        onChange={(e) => setNewGameComp(e.target.value)}
                        className="py-3 px-4 bg-[#25102a]/90 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white focus:outline-none transition-all duration-300 cursor-pointer"
                      >
                        <option value="Competitive" className="bg-[#25102a] text-white">Competitive</option>
                        <option value="Cooperative" className="bg-[#25102a] text-white">Cooperative</option>
                      </select>
                    </div>

                    {/* Themes */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Theme / Mechanics</label>
                      <input
                        type="text"
                        value={newGameTheme}
                        onChange={(e) => setNewGameTheme(e.target.value)}
                        placeholder="e.g. Strategy, Resource Management"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    {/* Players count */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Players Count</label>
                      <input
                        type="text"
                        value={newGamePlayers}
                        onChange={(e) => setNewGamePlayers(e.target.value)}
                        placeholder="e.g. 1 - 5"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    {/* Playtime */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Playtime</label>
                      <input
                        type="text"
                        value={newGameTime}
                        onChange={(e) => setNewGameTime(e.target.value)}
                        placeholder="e.g. 90 - 115 Min"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    {/* Year */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Release Year</label>
                      <input
                        type="text"
                        value={newGameYear}
                        onChange={(e) => setNewGameYear(e.target.value)}
                        placeholder="e.g. 2016"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    {/* Expansion */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Expansion</label>
                      <input
                        type="text"
                        value={newGameExpansion}
                        onChange={(e) => setNewGameExpansion(e.target.value)}
                        placeholder="e.g. None or Invaders from Afar"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    {/* How to play video link */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] flex items-center gap-1 uppercase tracking-wider text-[#C8B1CC]/80">
                        <Play size={10} className="text-[#f8b146]" /> How-To-Play YouTube Link
                      </label>
                      <input
                        type="url"
                        value={newGameHowToPlay}
                        onChange={(e) => setNewGameHowToPlay(e.target.value)}
                        placeholder="YouTube tutorial URL"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    {/* Quick Summary video link */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] flex items-center gap-1 uppercase tracking-wider text-[#C8B1CC]/80">
                        <Film size={10} className="text-[#f8b146]" /> Quick Summary YouTube Link
                      </label>
                      <input
                        type="url"
                        value={newGameQuickSummary}
                        onChange={(e) => setNewGameQuickSummary(e.target.value)}
                        placeholder="YouTube summary URL"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    {/* Game Box Image Upload */}
                    <div className="flex flex-col gap-2 col-span-1 md:col-span-2 border-t border-white/10 pt-4 mt-2">
                      <label className="font-mono text-[9px] flex items-center gap-1 uppercase tracking-wider text-[#C8B1CC]/80">
                        <ImageIcon size={10} className="text-[#f8b146]" /> Game Cover Image (Direct Upload to Supabase Bucket)
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4 items-center bg-[#25102a]/40 border border-white/10 p-4 rounded-2xl">
                        <div className="flex-1 w-full text-left">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleGameImageFileChange}
                            disabled={isUploadingGame}
                            className="hidden"
                            id="game-image-upload"
                          />
                          <label
                            htmlFor="game-image-upload"
                            className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-dashed transition-all duration-300 cursor-pointer font-sans text-xs font-semibold text-center ${
                              isUploadingGame
                                ? 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
                                : 'bg-[#f8b146]/5 border-[#f8b146]/30 text-[#f8b146] hover:bg-[#f8b146]/10 hover:border-[#f8b146]/50 shadow-sm shadow-[#f8b146]/5'
                            }`}
                          >
                            {isUploadingGame ? (
                              <>
                                <Loader2 size={14} className="animate-spin text-[#f8b146]" />
                                Uploading to Public Bucket...
                              </>
                            ) : (
                              <>
                                <Upload size={14} />
                                Choose Image File
                              </>
                            )}
                          </label>
                          {gameUploadError && (
                            <p className="text-[10px] text-red-400 mt-2 font-sans">{gameUploadError}</p>
                          )}
                          <p className="text-[10px] text-[#C8B1CC]/60 mt-2 font-sans leading-normal">
                            Directly uploads high-res assets to your secure Supabase public bucket. Supports JPG, PNG, WEBP.
                          </p>
                        </div>
                        {newGameBoxImg ? (
                          <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/15 bg-cover bg-center shrink-0 shadow-inner relative group" style={{ backgroundImage: `url(${newGameBoxImg})` }}>
                            <div className="absolute inset-0 bg-[#25102a]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => setNewGameBoxImg('')}
                                className="p-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer"
                                title="Remove Image"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-white/20 shrink-0 bg-[#25102a]/30">
                            <ImageIcon size={20} />
                            <span className="text-[9px] mt-1 font-mono uppercase tracking-wider">No Image</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form Submission Button */}
                  <div className="border-t border-white/10 pt-6 flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#3a1d42] rounded-full font-sans font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#f8b146]/15 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                    >
                      <Plus size={14} /> Archive Board Game
                    </button>
                  </div>
                </form>
              ) : activeTab === 'manageGames' ? (
                /* TAB: MANAGE GAMES & COVER IMAGES */
                <div className="space-y-6 text-left">
                  {editingGame ? (
                    /* Edit Sub-View */
                    <form onSubmit={handleEditGameSubmit} className="space-y-6 bg-[#25102a]/30 border border-white/10 rounded-3xl p-6 md:p-8">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#f8b146] font-bold block">
                            Atelier Vault Editor
                          </span>
                          <h4 className="font-sans font-black text-lg text-white">
                            Editing Cover & Details: {editingGame.title}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={handleCancelEditGame}
                          className="py-1.5 px-4 rounded-full border border-white/10 hover:border-[#f8b146]/40 text-[#C8B1CC] hover:text-white transition-all text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Game Title */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Game Title *</label>
                          <input
                            type="text"
                            value={editGameTitle}
                            onChange={(e) => setEditGameTitle(e.target.value)}
                            placeholder="e.g. Scythe"
                            className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                            required
                          />
                        </div>

                        {/* Complexity Type Dropdown */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Complexity Classification</label>
                          <select
                            value={editGameType}
                            onChange={(e) => setEditGameType(e.target.value)}
                            className="py-3 px-4 bg-[#25102a]/90 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white focus:outline-none transition-all duration-300 cursor-pointer"
                          >
                            <option value="Social" className="bg-[#25102a] text-white">Social</option>
                            <option value="Easy" className="bg-[#25102a] text-white">Easy</option>
                            <option value="Light" className="bg-[#25102a] text-white">Light</option>
                            <option value="Medium" className="bg-[#25102a] text-white">Medium</option>
                            <option value="Heavy" className="bg-[#25102a] text-white">Heavy</option>
                          </select>
                        </div>

                        {/* Format Strategy (Competition) */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Competition Format</label>
                          <select
                            value={editGameComp}
                            onChange={(e) => setEditGameComp(e.target.value)}
                            className="py-3 px-4 bg-[#25102a]/90 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white focus:outline-none transition-all duration-300 cursor-pointer"
                          >
                            <option value="Competitive" className="bg-[#25102a] text-white">Competitive</option>
                            <option value="Cooperative" className="bg-[#25102a] text-white">Cooperative</option>
                          </select>
                        </div>

                        {/* Themes */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Theme / Mechanics</label>
                          <input
                            type="text"
                            value={editGameTheme}
                            onChange={(e) => setEditGameTheme(e.target.value)}
                            placeholder="e.g. Strategy, Resource Management"
                            className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                          />
                        </div>

                        {/* Players count */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Players Count</label>
                          <input
                            type="text"
                            value={editGamePlayers}
                            onChange={(e) => setEditGamePlayers(e.target.value)}
                            placeholder="e.g. 1 - 5"
                            className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                          />
                        </div>

                        {/* Playtime */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Playtime</label>
                          <input
                            type="text"
                            value={editGameTime}
                            onChange={(e) => setEditGameTime(e.target.value)}
                            placeholder="e.g. 90 - 115 Min"
                            className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                          />
                        </div>

                        {/* Year */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Release Year</label>
                          <input
                            type="text"
                            value={editGameYear}
                            onChange={(e) => setEditGameYear(e.target.value)}
                            placeholder="e.g. 2016"
                            className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                          />
                        </div>

                        {/* Expansion */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Expansion</label>
                          <input
                            type="text"
                            value={editGameExpansion}
                            onChange={(e) => setEditGameExpansion(e.target.value)}
                            placeholder="e.g. None"
                            className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                          />
                        </div>

                        {/* How to play video link */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] flex items-center gap-1 uppercase tracking-wider text-[#C8B1CC]/80">
                            <Play size={10} className="text-[#f8b146]" /> How-To-Play YouTube Link
                          </label>
                          <input
                            type="url"
                            value={editGameHowToPlay}
                            onChange={(e) => setEditGameHowToPlay(e.target.value)}
                            placeholder="YouTube tutorial URL"
                            className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                          />
                        </div>

                        {/* Quick Summary video link */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] flex items-center gap-1 uppercase tracking-wider text-[#C8B1CC]/80">
                            <Film size={10} className="text-[#f8b146]" /> Quick Summary YouTube Link
                          </label>
                          <input
                            type="url"
                            value={editGameQuickSummary}
                            onChange={(e) => setEditGameQuickSummary(e.target.value)}
                            placeholder="YouTube summary URL"
                            className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                          />
                        </div>

                        {/* Box Image Upload / Direct Link Input */}
                        <div className="flex flex-col gap-2 col-span-1 md:col-span-2 border-t border-white/10 pt-4 mt-2">
                          <label className="font-mono text-[9px] flex items-center gap-1 uppercase tracking-wider text-[#C8B1CC]/80">
                            <ImageIcon size={10} className="text-[#f8b146]" /> Cover image file upload (Supabase Bucket) or Image URL
                          </label>
                          <div className="flex flex-col sm:flex-row gap-4 items-center bg-[#25102a]/45 border border-white/10 p-4 rounded-2xl">
                            <div className="flex-1 w-full text-left">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleEditGameImageFileChange}
                                disabled={isUploadingEditGame}
                                className="hidden"
                                id="edit-game-image-upload"
                              />
                              <label
                                htmlFor="edit-game-image-upload"
                                className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-dashed transition-all duration-300 cursor-pointer font-sans text-xs font-semibold text-center ${
                                  isUploadingEditGame
                                    ? 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
                                    : 'bg-[#f8b146]/5 border-[#f8b146]/30 text-[#f8b146] hover:bg-[#f8b146]/10 hover:border-[#f8b146]/50 shadow-sm shadow-[#f8b146]/5'
                                }`}
                              >
                                {isUploadingEditGame ? (
                                  <>
                                    <Loader2 size={14} className="animate-spin text-[#f8b146]" />
                                    Uploading cover...
                                  </>
                                ) : (
                                  <>
                                    <Upload size={14} />
                                    Upload New Cover Photo
                                  </>
                                )}
                              </label>
                              {editGameUploadError && (
                                <p className="text-[10px] text-red-400 mt-2 font-sans">{editGameUploadError}</p>
                              )}
                              <div className="mt-3">
                                <input
                                  type="url"
                                  placeholder="Or paste an external Image URL instead..."
                                  value={editGameBoxImg}
                                  onChange={(e) => setEditGameBoxImg(e.target.value)}
                                  className="w-full py-2.5 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all"
                                />
                              </div>
                            </div>
                            
                            {editGameBoxImg ? (
                              <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/15 bg-cover bg-center shrink-0 shadow-inner relative group" style={{ backgroundImage: `url(${editGameBoxImg})` }}>
                                <div className="absolute inset-0 bg-[#25102a]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => setEditGameBoxImg('')}
                                    className="p-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer"
                                    title="Remove Image"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="w-24 h-24 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-white/20 shrink-0 bg-[#25102a]/30">
                                <ImageIcon size={20} />
                                <span className="text-[9px] mt-1 font-mono uppercase tracking-wider">No Image</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="border-t border-white/10 pt-6 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={handleCancelEditGame}
                          className="px-6 py-3 rounded-full border border-white/10 hover:border-white/25 text-[#C8B1CC] hover:text-white transition-all text-xs font-sans font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-8 py-3 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#3a1d42] rounded-full font-sans font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#f8b146]/15 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                        >
                          <Save size={14} /> Save Game Cover & Details
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Directory List View */
                    <div className="space-y-4">
                      {/* Search Bar */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                        <div>
                          <h4 className="font-sans font-bold text-sm text-white">Board Games Vault Directory</h4>
                          <p className="font-sans text-[10px] text-[#C8B1CC]">Select any game to upload a new cover image or update its characteristics</p>
                        </div>
                        
                        <div className="relative w-full md:max-w-xs">
                          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/30">
                            <Search size={14} />
                          </div>
                          <input
                            type="text"
                            placeholder="Search board games..."
                            value={manageGameSearch}
                            onChange={(e) => setManageGameSearch(e.target.value)}
                            className="w-full py-2.5 pl-11 pr-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] text-white placeholder-white/30 rounded-xl font-sans text-xs focus:outline-none transition-all duration-300"
                          />
                        </div>
                      </div>

                      {/* Scrollable list */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[480px] overflow-y-auto pr-1">
                        {games
                          .filter(game => game.title.toLowerCase().includes(manageGameSearch.toLowerCase()) || game.theme.toLowerCase().includes(manageGameSearch.toLowerCase()))
                          .map((game, idx) => {
                            const initials = game.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
                            return (
                              <div 
                                key={game.num || idx} 
                                className="bg-[#25102a]/45 border border-white/8 rounded-[1.8rem] p-4 flex gap-4 items-center justify-between transition-all duration-300 hover:border-[#f8b146]/35"
                              >
                                <div className="flex items-center gap-3 overflow-hidden">
                                  {game.box_img || game.play_img ? (
                                    <div 
                                      className="w-12 h-12 rounded-xl bg-cover bg-center bg-[#25102a]/50 border border-white/10 shrink-0" 
                                      style={{ backgroundImage: `url(${game.box_img || game.play_img})` }} 
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3a1d42]/40 to-[#25102a]/20 border border-[#f8b146]/20 text-[#f8b146] flex items-center justify-center shrink-0 font-mono text-xs font-black">
                                      {initials}
                                    </div>
                                  )}
                                  <div className="text-left overflow-hidden">
                                    <h5 className="font-sans font-bold text-xs text-white truncate max-w-[150px]" title={game.title}>
                                      {game.title}
                                    </h5>
                                    <div className="flex gap-2 items-center mt-1">
                                      <span className="font-mono text-[8px] uppercase px-1.5 py-0.2 bg-[#f8b146]/10 text-[#f8b146] rounded border border-[#f8b146]/15">
                                        {game.type}
                                      </span>
                                      <span className="font-mono text-[8px] text-[#C8B1CC] font-bold">
                                        {game.year}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleStartEditGame(game)}
                                  className="p-2.5 rounded-xl border border-white/10 hover:border-[#f8b146]/45 text-[#C8B1CC] hover:text-[#f8b146] bg-white/5 hover:bg-[#f8b146]/5 transition-all duration-300 cursor-pointer shrink-0"
                                  title="Edit Cover & Details"
                                >
                                  <Pencil size={12} />
                                </button>
                              </div>
                            );
                          })}
                        
                        {games.filter(game => game.title.toLowerCase().includes(manageGameSearch.toLowerCase()) || game.theme.toLowerCase().includes(manageGameSearch.toLowerCase())).length === 0 && (
                          <div className="col-span-full py-12 text-center text-[#C8B1CC]/40 border border-dashed border-white/10 rounded-2xl">
                            <Dices size={24} className="mx-auto mb-3 opacity-30 animate-bounce" />
                            <p className="font-sans text-xs">No matching games found in repository.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : activeTab === 'gallery' ? (
                /* TAB 3: GALLERY MANAGEMENT */
                <div className="space-y-6 text-left">
                  {/* Add new image form */}
                  <div className="bg-[#25102a]/30 border border-white/10 rounded-2xl p-6 space-y-4">
                    <h4 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                      <ImageIcon size={14} className="text-[#f8b146]" /> {editingImageIndex !== null ? 'Edit Gallery Image' : 'Add New Gallery Image'}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2 col-span-1 md:col-span-2 bg-[#25102a]/40 border border-white/10 p-4 rounded-2xl">
                        <label className="font-mono text-[9px] flex items-center gap-1 uppercase tracking-wider text-[#C8B1CC]/80">
                          <Upload size={10} className="text-[#f8b146]" /> Gallery Photo File Upload
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
                          <div className="flex-1 w-full text-left">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleGalleryImageFileChange}
                              disabled={isUploadingGallery}
                              className="hidden"
                              id="gallery-image-upload"
                            />
                            <label
                              htmlFor="gallery-image-upload"
                              className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-dashed transition-all duration-300 cursor-pointer font-sans text-xs font-semibold text-center ${
                                isUploadingGallery
                                  ? 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
                                  : 'bg-[#f8b146]/5 border-[#f8b146]/30 text-[#f8b146] hover:bg-[#f8b146]/10 hover:border-[#f8b146]/50 shadow-sm shadow-[#f8b146]/5'
                              }`}
                            >
                              {isUploadingGallery ? (
                                <>
                                  <Loader2 size={14} className="animate-spin text-[#f8b146]" />
                                  Uploading to Bucket...
                                </>
                              ) : (
                                <>
                                  <Upload size={14} />
                                  Select Photo File
                                </>
                              )}
                            </label>
                            {galleryUploadError && (
                              <p className="text-[10px] text-red-400 mt-2 font-sans">{galleryUploadError}</p>
                            )}
                          </div>
                          <div className="w-full sm:w-auto flex-1">
                            <input
                              type="url"
                              value={galleryUrl}
                              onChange={(e) => setGalleryUrl(e.target.value)}
                              placeholder="Or paste an external Image URL instead..."
                              className="w-full py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Image Title *</label>
                        <input
                          type="text"
                          value={galleryTitle}
                          onChange={(e) => setGalleryTitle(e.target.value)}
                          placeholder="e.g. Game Night Legends"
                          className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Category</label>
                        <select
                          value={galleryCategory}
                          onChange={(e) => setGalleryCategory(e.target.value)}
                          className="py-3 px-4 bg-[#25102a]/90 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white focus:outline-none transition-all duration-300 cursor-pointer"
                        >
                          <option value="Play Session" className="bg-[#25102a] text-white">Play Session</option>
                          <option value="Atelier Vibe" className="bg-[#25102a] text-white">Atelier Vibe</option>
                          <option value="Social Deduction" className="bg-[#25102a] text-white">Social Deduction</option>
                          <option value="Game Night" className="bg-[#25102a] text-white">Game Night</option>
                          <option value="Community" className="bg-[#25102a] text-white">Community</option>
                          <option value="Tournament" className="bg-[#25102a] text-white">Tournament</option>
                        </select>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Aspect Ratio</label>
                        <select
                          value={galleryAspect}
                          onChange={(e) => setGalleryAspect(e.target.value)}
                          className="py-3 px-4 bg-[#25102a]/90 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white focus:outline-none transition-all duration-300 cursor-pointer"
                        >
                          <option value="aspect-[3/4]" className="bg-[#25102a] text-white">Vertical (Portrait 3:4)</option>
                          <option value="aspect-square" className="bg-[#25102a] text-white">Square</option>
                          <option value="aspect-[4/3]" className="bg-[#25102a] text-white">Horizontal (Landscape 4:3)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">Description</label>
                      <textarea
                        value={galleryDesc}
                        onChange={(e) => setGalleryDesc(e.target.value)}
                        placeholder="Short description of the photo..."
                        rows={2}
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 resize-none"
                      />
                    </div>
                    
                    {/* Preview */}
                    {galleryUrl && (
                      <div className="border border-white/10 rounded-2xl p-3 bg-[#25102a]/30">
                        <p className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/40 mb-2">Image Preview</p>
                        <img
                          src={galleryUrl}
                          alt="Preview"
                          className="w-full max-h-40 object-cover rounded-xl border border-white/10"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-3">
                      {editingImageIndex !== null ? (
                        <>
                          <button
                            type="button"
                            onClick={clearGalleryForm}
                            className="px-6 py-3.5 bg-[#25102a]/60 border border-white/10 hover:border-white/20 text-white rounded-full font-sans font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!galleryUrl || !galleryTitle) {
                                alert('Please enter both the image URL and the title.');
                                return;
                              }
                              onUpdateGalleryImage(editingImageIndex, {
                                src: galleryUrl,
                                title: galleryTitle,
                                category: galleryCategory,
                                aspect: galleryAspect,
                                desc: galleryDesc || 'A captured moment from our community gatherings.'
                              });
                              clearGalleryForm();
                              setFormSuccess('Image updated successfully!');
                              setTimeout(() => setFormSuccess(''), 3000);
                            }}
                            className="px-8 py-3.5 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#3a1d42] rounded-full font-sans font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#f8b146]/15 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                          >
                            <Save size={14} /> Save Changes
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (!galleryUrl || !galleryTitle) {
                              alert('Please enter both the image URL and the title.');
                              return;
                            }
                            onAddGalleryImage({
                              src: galleryUrl,
                              title: galleryTitle,
                              category: galleryCategory,
                              aspect: galleryAspect,
                              desc: galleryDesc || 'A captured moment from our community gatherings.'
                            });
                            clearGalleryForm();
                            setFormSuccess('Image added to gallery successfully!');
                            setTimeout(() => setFormSuccess(''), 3000);
                          }}
                          className="px-8 py-3.5 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#3a1d42] rounded-full font-sans font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#f8b146]/15 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                        >
                          <Plus size={14} /> Add Photo
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Existing gallery images list */}
                  {galleryImages && galleryImages.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-sans font-bold text-sm text-white">Current Gallery Photos ({galleryImages.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {galleryImages.map((img, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-[#25102a]/30 border border-white/10 rounded-2xl p-3 group hover:border-[#f8b146]/35 hover:shadow-sm transition-all duration-300">
                            <img
                              src={img.src}
                              alt={img.title}
                              className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                              onError={(e) => { e.target.src = ''; e.target.className = 'w-16 h-16 rounded-xl bg-[#f8b146]/10 border border-[#f8b146]/25 shrink-0'; }}
                            />
                            <div className="flex-1 min-w-0 text-left">
                              <p className="font-sans font-bold text-xs text-white truncate">{img.title}</p>
                              <p className="font-mono text-[9px] text-[#C8B1CC]">{img.category}</p>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartEditGalleryImage(idx)}
                                className={`w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
                                  editingImageIndex === idx
                                    ? 'bg-[#f8b146]/20 border-[#f8b146] text-[#f8b146]'
                                    : 'border-white/10 text-white/30 hover:text-[#f8b146] hover:border-[#f8b146]/40 hover:bg-[#f8b146]/10'
                                }`}
                                title="Edit Photo"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onRemoveGalleryImage(idx);
                                  if (editingImageIndex === idx) {
                                    clearGalleryForm();
                                  } else if (editingImageIndex !== null && editingImageIndex > idx) {
                                    setEditingImageIndex(editingImageIndex - 1);
                                  }
                                  setFormSuccess('Photo removed from gallery successfully.');
                                  setTimeout(() => setFormSuccess(''), 3000);
                                }}
                                className="w-8 h-8 rounded-full border border-white/10 hover:border-red-500/40 text-white/30 hover:text-red-400 hover:bg-red-950/30 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                                title="Delete Photo"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : activeTab === 'applicants' ? (
                /* TAB 4: APPLICANTS LIST */
                <div className="space-y-6 text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div>
                      <h4 className="font-sans font-bold text-sm text-white">Submitted Club Applications</h4>
                      <p className="font-sans text-[10px] text-[#C8B1CC]">Review and manage onboarding requests from potential club members</p>
                    </div>
                    {applicantsList && applicantsList.length > 0 && (
                      <button
                        onClick={async () => {
                          if (confirm("Are you sure you want to clear all applications?")) {
                            localStorage.removeItem('ibgc_applications');
                            setApplicantsList([]);
                            setFormSuccess('All applications cleared successfully.');
                            setTimeout(() => setFormSuccess(''), 3000);

                            if (isSupabaseConfigured) {
                              try {
                                const { error } = await supabase.from('applications').delete().gt('id', 0);
                                if (error) throw error;
                              } catch (e) {
                                console.error("Failed to clear applications in Supabase:", e);
                              }
                            }
                          }
                        }}
                        className="py-2 px-4 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Trash2 size={10} /> Clear All
                      </button>
                    )}
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                    {applicantsList && applicantsList.length > 0 ? (
                      applicantsList.map((app) => (
                        <div 
                          key={app.id}
                          className="bg-[#25102a]/65 border border-white/8 rounded-[1.8rem] p-5 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 hover:border-[#f8b146]/35"
                        >
                          <div className="space-y-2 max-w-md">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-white text-sm">{app.fullName}</span>
                              <span className="font-mono text-[8px] uppercase px-2.5 py-0.5 rounded-full bg-[#f8b146]/10 border border-[#f8b146]/20 text-[#f8b146]">
                                Applicant
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-[#C8B1CC]">
                              <div><span className="opacity-50 font-mono">Email:</span> {app.email}</div>
                              <div><span className="opacity-50 font-mono">Phone:</span> {app.phone}</div>
                            </div>
                            <div className="text-[11px] text-[#C8B1CC]">
                              <span className="opacity-50 font-mono">Preferred Categories:</span>{' '}
                              <span className="text-[#f8b146] font-medium">
                                {app.gameTypes && app.gameTypes.join(', ')}
                              </span>
                            </div>
                            <div className="text-[9px] font-mono text-white/30">
                              Submitted on: {new Date(app.date).toLocaleString()}
                            </div>
                          </div>
                          
                          <button
                            onClick={async () => {
                              const updated = applicantsList.filter(item => item.id !== app.id);
                              localStorage.setItem('ibgc_applications', JSON.stringify(updated));
                              setApplicantsList(updated);
                              setFormSuccess(`Removed application from "${app.fullName}"`);
                              setTimeout(() => setFormSuccess(''), 3000);

                              if (isSupabaseConfigured) {
                                try {
                                  const { error } = await supabase.from('applications').delete().eq('id', app.id);
                                  if (error) throw error;
                                } catch (e) {
                                  console.error("Failed to delete application in Supabase:", e);
                                }
                              }
                            }}
                            className="p-3.5 rounded-2xl border border-white/10 hover:border-red-500/40 text-white/60 hover:text-red-400 bg-white/5 hover:bg-red-500/5 transition-all duration-300 flex items-center justify-center cursor-pointer shrink-0 md:self-center"
                            title="Dismiss Application"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center text-[#C8B1CC]/40 border border-dashed border-white/10 rounded-2xl">
                        <Dices size={24} className="mx-auto mb-3 opacity-30 animate-bounce" />
                        <p className="font-sans text-xs">No pending onboarding applications found.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
