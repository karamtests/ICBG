import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { 
  Lock, Unlock, X, Plus, Calendar, Save, Search, Check, Sparkles, Film, 
  Play, Eye, Image as ImageIcon, Trash2, Pencil, Dices, Upload, Loader2,
  MapPin, Link as LinkIcon, Mail, Phone, Users, Clock, Tag, Globe, Award, 
  ShieldAlert, Layers, CheckCircle2, History
} from 'lucide-react';

export default function AdminPanel({ 
  isOpen, 
  onClose, 
  games, 
  onAddGame, 
  onUpdateGame, 
  schedule, 
  onUpdateSchedule, 
  galleryImages, 
  onAddGalleryImage, 
  onRemoveGalleryImage, 
  onUpdateGalleryImage 
}) {
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
  const [locationName, setLocationName] = useState('');
  const [locationLink, setLocationLink] = useState('');

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
  const [galleryShowOnHomepage, setGalleryShowOnHomepage] = useState(true);

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
    setGalleryShowOnHomepage(true);
    setEditingImageIndex(null);
  };

  const handleStartEditGalleryImage = (index) => {
    const img = galleryImages[index];
    setGalleryUrl(img.src);
    setGalleryTitle(img.title);
    setGalleryCategory(img.category || 'Play Session');
    setGalleryAspect(img.aspect || 'aspect-square');
    setGalleryDesc(img.desc || '');
    setGalleryShowOnHomepage(img.show_on_homepage !== false);
    setEditingImageIndex(index);
  };

  // Helper to extract time from string (e.g. "28/5/26 7:45 PM" -> "7:45 PM")
  const extractTime = (str) => {
    if (!str) return '';
    const match = str.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
    return match ? match[1] : str;
  };

  // Sync state with props when open, reset auth when closed
  useEffect(() => {
    if (isOpen) {
      setNextHangout(extractTime(schedule.nextHangout) || '');
      setThursdayDate(extractTime(schedule.thursdayDate) || '');
      setFridayDate(extractTime(schedule.fridayDate) || '');
      setFeaturedTitles(schedule.featuredGameTitles || []);
      setLocationName(schedule.locationName || 'Cortina.D Cafe');
      setLocationLink(schedule.locationLink || 'https://maps.app.goo.gl/R6WFBay7Piyfoe1w9?g_st=ic');
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
      featuredGameTitles: featuredTitles,
      locationName,
      locationLink
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
      box_img: newGameBoxImg || '', 
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* Luxury dark-plum sunset glassmorphism backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-gradient-to-br from-[#25102a]/85 to-[#120515]/95 backdrop-blur-xl transition-all duration-500"
      />

      {/* Main Admin Dashboard Container */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#3a1d42]/95 to-[#25102a]/98 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_-15px_rgba(248,177,70,0.18)] z-10 flex flex-col max-h-[92vh] backdrop-blur-xl text-white">
        
        {/* Top Gradient Accents */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#f8b146]/50 to-transparent" />
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-[#f8b146]/5 rounded-full filter blur-[40px] pointer-events-none" />

        {/* Premium Header */}
        <div className="px-6 md:px-8 py-5 md:py-6 border-b border-white/10 flex items-center justify-between relative bg-black/10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#f8b146]/20 to-[#f28a75]/10 border border-[#f8b146]/30 flex items-center justify-center text-[#f8b146] shadow-[0_0_20px_rgba(248,177,70,0.2)]">
              {isAuthenticated ? <Unlock size={20} className="animate-pulse" /> : <Lock size={20} />}
            </div>
            <div className="text-left">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#f8b146] font-extrabold block">
                IBGC CLUB ATELIER
              </span>
              <h3 className="font-sans font-black text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#C8B1CC]">
                Admin Control Center
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-white/10 hover:border-[#f8b146]/45 text-white/70 hover:text-[#f8b146] bg-white/5 hover:bg-[#f8b146]/10 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-inner"
          >
            <X size={18} />
          </button>
        </div>

        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="p-8 md:p-16 flex flex-col items-center justify-center flex-1 relative overflow-y-auto">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(248,177,70,0.05)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#f8b146]/10 to-[#f28a75]/5 border border-[#f8b146]/30 flex items-center justify-center text-[#f8b146] mb-6 shadow-[0_10px_30px_rgba(248,177,70,0.1)] relative group">
              <div className="absolute inset-0 rounded-3xl bg-[#f8b146]/20 blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
              <Lock size={32} className="relative z-10" />
            </div>

            <h4 className="font-sans font-black text-xl md:text-2xl text-white mb-2 text-center tracking-tight">
              Private Administration Portal
            </h4>
            <p className="font-sans font-light text-xs md:text-sm text-[#C8B1CC] text-center max-w-md mb-8 leading-relaxed">
              Please input the Irbid Board Games Community secret passcode to release restricted club configuration tools.
            </p>

            <form onSubmit={handleAuthSubmit} className="w-full max-w-xs flex flex-col items-center z-10">
              <div className="w-full relative group">
                <input
                  type="password"
                  placeholder="••••"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full py-4 px-6 bg-[#120515]/65 border border-white/15 focus:border-[#f8b146] text-white placeholder-white/20 rounded-2xl font-mono text-center text-2xl tracking-[0.4em] focus:outline-none focus:ring-4 focus:ring-[#f8b146]/10 transition-all duration-300 shadow-inner"
                  autoFocus
                />
                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-white/10 pointer-events-none transition-all" />
              </div>

              {authError && (
                <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-[11px] font-sans">
                  <ShieldAlert size={12} className="shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="mt-6 w-full py-4 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#25102a] rounded-2xl font-sans font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-[#f8b146]/20 hover:shadow-[#f8b146]/35 hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.99] active:translate-y-0 transition-all duration-300 cursor-pointer"
              >
                Release Atelier Dashboard
              </button>
            </form>

            <div className="mt-12 p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
              <span className="font-mono text-[9px] text-[#f8b146] font-bold tracking-widest uppercase shrink-0">
                SECRET INSCRIPTION:
              </span>
              <span className="font-sans text-[10px] text-[#C8B1CC]">
                The revelation year of classic Jenga
              </span>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Panel */
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Elegant Tab Navigator Bar */}
            <div className="flex border-b border-white/10 bg-[#120515]/40 px-4 md:px-6 overflow-x-auto whitespace-nowrap scrollbar-none gap-2 py-3">
              <button
                onClick={() => { setActiveTab('schedule'); setFormSuccess(''); }}
                className={`px-4 py-2.5 rounded-xl font-mono text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2 border ${
                  activeTab === 'schedule' 
                    ? 'bg-gradient-to-r from-[#f8b146]/15 to-[#f28a75]/10 border-[#f8b146]/45 text-[#f8b146] font-bold shadow-[0_0_15px_rgba(248,177,70,0.1)]' 
                    : 'bg-transparent border-transparent text-[#C8B1CC] hover:text-white hover:bg-white/5'
                }`}
              >
                <Calendar size={13} />
                Campaign Schedule
              </button>
              
              <button
                onClick={() => { setActiveTab('addGame'); setFormSuccess(''); }}
                className={`px-4 py-2.5 rounded-xl font-mono text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2 border ${
                  activeTab === 'addGame' 
                    ? 'bg-gradient-to-r from-[#f8b146]/15 to-[#f28a75]/10 border-[#f8b146]/45 text-[#f8b146] font-bold shadow-[0_0_15px_rgba(248,177,70,0.1)]' 
                    : 'bg-transparent border-transparent text-[#C8B1CC] hover:text-white hover:bg-white/5'
                }`}
              >
                <Plus size={13} />
                Archive Game
              </button>

              <button
                onClick={() => { setActiveTab('manageGames'); setFormSuccess(''); }}
                className={`px-4 py-2.5 rounded-xl font-mono text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2 border ${
                  activeTab === 'manageGames' 
                    ? 'bg-gradient-to-r from-[#f8b146]/15 to-[#f28a75]/10 border-[#f8b146]/45 text-[#f8b146] font-bold shadow-[0_0_15px_rgba(248,177,70,0.1)]' 
                    : 'bg-transparent border-transparent text-[#C8B1CC] hover:text-white hover:bg-white/5'
                }`}
              >
                <Dices size={13} />
                Manage Directory
              </button>
              
              <button
                onClick={() => { setActiveTab('gallery'); setFormSuccess(''); }}
                className={`px-4 py-2.5 rounded-xl font-mono text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2 border ${
                  activeTab === 'gallery' 
                    ? 'bg-gradient-to-r from-[#f8b146]/15 to-[#f28a75]/10 border-[#f8b146]/45 text-[#f8b146] font-bold shadow-[0_0_15px_rgba(248,177,70,0.1)]' 
                    : 'bg-transparent border-transparent text-[#C8B1CC] hover:text-white hover:bg-white/5'
                }`}
              >
                <ImageIcon size={13} />
                Gallery Manager
              </button>

              <button
                onClick={() => { setActiveTab('applicants'); setFormSuccess(''); }}
                className={`px-4 py-2.5 rounded-xl font-mono text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2 border relative ${
                  activeTab === 'applicants' 
                    ? 'bg-gradient-to-r from-[#f8b146]/15 to-[#f28a75]/10 border-[#f8b146]/45 text-[#f8b146] font-bold shadow-[0_0_15px_rgba(248,177,70,0.1)]' 
                    : 'bg-transparent border-transparent text-[#C8B1CC] hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles size={13} />
                Applicants
                {applicantsList.length > 0 && (
                  <span className="absolute -top-1.5 -right-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#25102a] font-mono text-[7px] font-black scale-90 animate-bounce">
                    {applicantsList.length}
                  </span>
                )}
              </button>
            </div>

            {/* Content Container (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 bg-transparent custom-scrollbar">
              
              {/* Success Notification Bar */}
              {formSuccess && (
                <div className="bg-emerald-950/40 border border-emerald-500/25 p-4 rounded-2xl flex items-center gap-3 text-emerald-300 font-sans text-xs font-semibold shadow-inner animate-fadeIn">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  </div>
                  <span>{formSuccess}</span>
                </div>
              )}

              {activeTab === 'schedule' ? (
                /* TAB 1: SCHEDULE MANAGER FORM */
                <form onSubmit={handleScheduleSave} className="space-y-6 text-left">
                  
                  {/* Visual Section Card 1: Time Details */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 space-y-5 backdrop-blur-md">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                      <Calendar size={15} className="text-[#f8b146]" />
                      <h4 className="font-sans font-bold text-sm text-white">Gathering Campaign Schedule</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {/* Next Gathering Input */}
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Main Gathering Time (Date Auto-Calculated)</label>
                        <input
                          type="text"
                          value={nextHangout}
                          onChange={(e) => setNextHangout(e.target.value)}
                          placeholder="e.g. 7:00 PM"
                          className="py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                          required
                        />
                      </div>

                      {/* Thursday Date/Time Input */}
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Thursday Session Time (Date Auto-Calculated)</label>
                        <input
                          type="text"
                          value={thursdayDate}
                          onChange={(e) => setThursdayDate(e.target.value)}
                          placeholder="e.g. 7:45 PM"
                          className="py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                          required
                        />
                      </div>

                      {/* Friday Date/Time Input */}
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Friday Session Time (Date Auto-Calculated)</label>
                        <input
                          type="text"
                          value={fridayDate}
                          onChange={(e) => setFridayDate(e.target.value)}
                          placeholder="e.g. 7:45 PM"
                          className="py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Visual Section Card 2: Location Configuration */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 space-y-5 backdrop-blur-md">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                      <MapPin size={15} className="text-[#f8b146]" />
                      <h4 className="font-sans font-bold text-sm text-white">Gathering Location Configuration</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Location Name Input */}
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Gathering Location Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            placeholder="e.g. Cortina.D Cafe"
                            className="w-full py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                            required
                          />
                        </div>
                      </div>

                      {/* Location Google Maps Link Input */}
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Google Maps Location Link</label>
                        <div className="relative">
                          <input
                            type="url"
                            value={locationLink}
                            onChange={(e) => setLocationLink(e.target.value)}
                            placeholder="e.g. https://maps.app.goo.gl/..."
                            className="w-full py-3 px-4 pl-9 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                            required
                          />
                          <LinkIcon size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Section Card 3: Featured Games Selection */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 space-y-4 backdrop-blur-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                      <div className="flex items-center gap-2">
                        <Award size={15} className="text-[#f8b146]" />
                        <div className="text-left">
                          <h4 className="font-sans font-bold text-sm text-white">Weekly Featured Spotlight</h4>
                          <p className="font-sans text-[10px] text-[#C8B1CC]/80">Select games to spotlight on the club campaign main page</p>
                        </div>
                      </div>
                      <span className="font-mono text-[9px] bg-[#f8b146]/10 border border-[#f8b146]/30 text-[#f8b146] px-3.5 py-1 rounded-full w-max font-bold tracking-wider">
                        SELECTED: {featuredTitles.length}
                      </span>
                    </div>

                    {/* Selector search */}
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/30">
                        <Search size={14} />
                      </div>
                      <input
                        type="text"
                        placeholder="Type board game title to filter..."
                        value={gameSearch}
                        onChange={(e) => setGameSearch(e.target.value)}
                        className="w-full py-3 pl-11 pr-4 bg-[#120515]/40 border border-white/10 focus:border-[#f8b146] text-white placeholder-white/30 rounded-xl font-sans text-xs focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                      />
                    </div>

                    {/* Selectable grid list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[220px] overflow-y-auto border border-white/10 rounded-2xl p-4 bg-[#120515]/20 custom-scrollbar">
                      {filteredGamesForSelect.map((game) => {
                        const isFeatured = featuredTitles.includes(game.title);
                        return (
                          <button
                            type="button"
                            key={game.title}
                            onClick={() => toggleFeaturedGame(game.title)}
                            className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 text-left cursor-pointer ${
                              isFeatured 
                                ? 'bg-gradient-to-r from-[#f8b146]/15 to-[#f28a75]/5 border-[#f8b146]/60 text-white shadow-sm' 
                                : 'bg-[#120515]/40 border-white/5 text-[#C8B1CC] hover:border-white/15 hover:text-white hover:bg-[#120515]/60'
                            }`}
                          >
                            <span className="font-sans font-bold text-xs truncate max-w-[170px]">{game.title}</span>
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                              isFeatured ? 'bg-gradient-to-r from-[#f8b146] to-[#f28a75] border-transparent text-[#25102a]' : 'border-white/20'
                            }`}>
                              {isFeatured && <Check size={12} strokeWidth={3} />}
                            </div>
                          </button>
                        );
                      })}
                      {filteredGamesForSelect.length === 0 && (
                        <div className="col-span-full py-8 text-center text-[#C8B1CC]/40 font-sans text-xs flex flex-col items-center gap-2">
                          <Dices size={20} className="opacity-20 animate-spin" />
                          <span>No matches found in your archived vault.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-4 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#25102a] rounded-2xl font-sans font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-[#f8b146]/20 hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.99] active:translate-y-0 transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Save size={14} /> Update Campaign schedule
                    </button>
                  </div>
                </form>
              ) : activeTab === 'addGame' ? (
                /* TAB 2: ADD NEW BOARD GAME FORM */
                <form onSubmit={handleAddGameSubmit} className="space-y-6 text-left">
                  
                  {/* Grid section cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Identity Glass Card */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 space-y-5 backdrop-blur-md">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                        <Tag size={15} className="text-[#f8b146]" />
                        <h4 className="font-sans font-bold text-sm text-white">Identity & Theme</h4>
                      </div>

                      {/* Game Title */}
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Game Title *</label>
                        <input
                          type="text"
                          value={newGameTitle}
                          onChange={(e) => setNewGameTitle(e.target.value)}
                          placeholder="e.g. Scythe"
                          className="py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                          required
                        />
                      </div>

                      {/* Themes */}
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Theme & Core Mechanics</label>
                        <input
                          type="text"
                          value={newGameTheme}
                          onChange={(e) => setNewGameTheme(e.target.value)}
                          placeholder="e.g. Dieselpunk, Strategy, Resource Grid"
                          className="py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Year */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Release Year</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={newGameYear}
                              onChange={(e) => setNewGameYear(e.target.value)}
                              placeholder="e.g. 2016"
                              className="w-full py-3 px-4 pl-9 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                            />
                            <History size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                          </div>
                        </div>

                        {/* Expansion */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Expansion Version</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={newGameExpansion}
                              onChange={(e) => setNewGameExpansion(e.target.value)}
                              placeholder="e.g. Invaders from Afar"
                              className="w-full py-3 px-4 pl-9 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                            />
                            <Layers size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gameplay Settings Glass Card */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 space-y-5 backdrop-blur-md">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                        <Dices size={15} className="text-[#f8b146]" />
                        <h4 className="font-sans font-bold text-sm text-white">Gameplay Specs</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Complexity Type Dropdown */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Complexity</label>
                          <select
                            value={newGameType}
                            onChange={(e) => setNewGameType(e.target.value)}
                            className="py-3 px-4 bg-[#120515]/80 border border-white/10 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white focus:outline-none transition-all cursor-pointer"
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
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Interaction Format</label>
                          <select
                            value={newGameComp}
                            onChange={(e) => setNewGameComp(e.target.value)}
                            className="py-3 px-4 bg-[#120515]/80 border border-white/10 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white focus:outline-none transition-all cursor-pointer"
                          >
                            <option value="Competitive" className="bg-[#25102a] text-white">Competitive</option>
                            <option value="Cooperative" className="bg-[#25102a] text-white">Cooperative</option>
                          </select>
                        </div>
                      </div>

                      {/* Players count */}
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Players Capacity</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={newGamePlayers}
                            onChange={(e) => setNewGamePlayers(e.target.value)}
                            placeholder="e.g. 1 - 5 Players"
                            className="w-full py-3 px-4 pl-9 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                          />
                          <Users size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        </div>
                      </div>

                      {/* Playtime */}
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Estimated Playtime</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={newGameTime}
                            onChange={(e) => setNewGameTime(e.target.value)}
                            placeholder="e.g. 90 - 115 Min"
                            className="w-full py-3 px-4 pl-9 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                          />
                          <Clock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resources Links Card */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 space-y-4 backdrop-blur-md">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                      <LinkIcon size={15} className="text-[#f8b146]" />
                      <h4 className="font-sans font-bold text-sm text-white">Tutorial Media Links</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* How to play video link */}
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] flex items-center gap-1.5 uppercase tracking-wider text-[#C8B1CC]/80 font-bold">
                          <Play size={10} className="text-red-400 shrink-0" /> How-To-Play Tutorial Link
                        </label>
                        <input
                          type="url"
                          value={newGameHowToPlay}
                          onChange={(e) => setNewGameHowToPlay(e.target.value)}
                          placeholder="Paste YouTube tutorial URL"
                          className="py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                        />
                      </div>

                      {/* Quick Summary video link */}
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] flex items-center gap-1.5 uppercase tracking-wider text-[#C8B1CC]/80 font-bold">
                          <Film size={10} className="text-[#f8b146] shrink-0" /> Quick Summary Review Link
                        </label>
                        <input
                          type="url"
                          value={newGameQuickSummary}
                          onChange={(e) => setNewGameQuickSummary(e.target.value)}
                          placeholder="Paste YouTube summary URL"
                          className="py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Game Box Image Upload */}
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 space-y-4 backdrop-blur-md">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                      <ImageIcon size={15} className="text-[#f8b146]" />
                      <h4 className="font-sans font-bold text-sm text-white">Cover Media & Uploads</h4>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 items-center bg-[#120515]/40 border border-white/10 p-5 rounded-2xl">
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
                          className={`flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer font-sans text-xs font-black text-center ${
                            isUploadingGame
                              ? 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
                              : 'bg-[#f8b146]/5 border-[#f8b146]/20 text-[#f8b146] hover:bg-[#f8b146]/10 hover:border-[#f8b146]/50 shadow-md shadow-[#f8b146]/5'
                          }`}
                        >
                          {isUploadingGame ? (
                            <>
                              <Loader2 size={16} className="animate-spin text-[#f8b146]" />
                              Transferring assets to Supabase storage...
                            </>
                          ) : (
                            <>
                              <Upload size={16} />
                              Select High-Res Cover Graphic File
                            </>
                          )}
                        </label>
                        {gameUploadError && (
                          <p className="text-[10px] text-red-400 mt-2.5 font-sans font-medium">{gameUploadError}</p>
                        )}
                        <p className="text-[10px] text-[#C8B1CC]/60 mt-3 font-sans leading-relaxed">
                          Files are safely uploaded to the secured `icbg-media` Supabase bucket. Optimized image formats (JPG, PNG, WEBP) recommended.
                        </p>
                      </div>

                      {newGameBoxImg ? (
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/15 bg-cover bg-center shrink-0 shadow-lg relative group" style={{ backgroundImage: `url(${newGameBoxImg})` }}>
                          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => setNewGameBoxImg('')}
                              className="p-2 rounded-full bg-red-500/20 border border-red-500/35 text-red-400 hover:bg-red-500/35 hover:text-white transition-all cursor-pointer"
                              title="Discard Graphic"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/20 shrink-0 bg-[#120515]/30">
                          <ImageIcon size={22} className="opacity-40" />
                          <span className="text-[8px] mt-1.5 font-mono uppercase tracking-wider opacity-60">Cover Placeholder</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Submission Button */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-4 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#25102a] rounded-2xl font-sans font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-[#f8b146]/20 hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.99] active:translate-y-0 transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Plus size={14} /> Archive Game into Vault
                    </button>
                  </div>
                </form>
              ) : activeTab === 'manageGames' ? (
                /* TAB: MANAGE GAMES & COVER IMAGES */
                <div className="space-y-6 text-left">
                  {editingGame ? (
                    /* Edit Sub-View */
                    <form onSubmit={handleEditGameSubmit} className="space-y-6 bg-white/5 border border-white/10 rounded-3xl p-5 md:p-8 backdrop-blur-md">
                      
                      {/* Editor Sub-Header */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                        <div className="text-left">
                          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#f8b146] font-bold block">
                            Atelier Vault Editor
                          </span>
                          <h4 className="font-sans font-black text-base md:text-lg text-white">
                            Modifying Cover & Specifications: {editingGame.title}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={handleCancelEditGame}
                          className="py-1.5 px-4 rounded-xl border border-white/10 hover:border-white/20 text-[#C8B1CC] hover:text-white bg-white/5 transition-all text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Edit Fields Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Game Title */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Game Title *</label>
                          <input
                            type="text"
                            value={editGameTitle}
                            onChange={(e) => setEditGameTitle(e.target.value)}
                            placeholder="e.g. Scythe"
                            className="py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                            required
                          />
                        </div>

                        {/* Complexity Type Dropdown */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Complexity Classification</label>
                          <select
                            value={editGameType}
                            onChange={(e) => setEditGameType(e.target.value)}
                            className="py-3 px-4 bg-[#120515]/80 border border-white/10 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white focus:outline-none transition-all cursor-pointer"
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
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Competition Format</label>
                          <select
                            value={editGameComp}
                            onChange={(e) => setEditGameComp(e.target.value)}
                            className="py-3 px-4 bg-[#120515]/80 border border-white/10 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white focus:outline-none transition-all cursor-pointer"
                          >
                            <option value="Competitive" className="bg-[#25102a] text-white">Competitive</option>
                            <option value="Cooperative" className="bg-[#25102a] text-white">Cooperative</option>
                          </select>
                        </div>

                        {/* Themes */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Theme / Mechanics</label>
                          <input
                            type="text"
                            value={editGameTheme}
                            onChange={(e) => setEditGameTheme(e.target.value)}
                            placeholder="e.g. Strategy, Resource Management"
                            className="py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                          />
                        </div>

                        {/* Players count */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Players Count</label>
                          <input
                            type="text"
                            value={editGamePlayers}
                            onChange={(e) => setEditGamePlayers(e.target.value)}
                            placeholder="e.g. 1 - 5"
                            className="py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                          />
                        </div>

                        {/* Playtime */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Playtime</label>
                          <input
                            type="text"
                            value={editGameTime}
                            onChange={(e) => setEditGameTime(e.target.value)}
                            placeholder="e.g. 90 - 115 Min"
                            className="py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                          />
                        </div>

                        {/* Year */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Release Year</label>
                          <input
                            type="text"
                            value={editGameYear}
                            onChange={(e) => setEditGameYear(e.target.value)}
                            placeholder="e.g. 2016"
                            className="py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                          />
                        </div>

                        {/* Expansion */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Expansion</label>
                          <input
                            type="text"
                            value={editGameExpansion}
                            onChange={(e) => setEditGameExpansion(e.target.value)}
                            placeholder="e.g. None"
                            className="py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                          />
                        </div>

                        {/* How to play video link */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] flex items-center gap-1.5 uppercase tracking-wider text-[#C8B1CC]/80 font-bold">
                            <Play size={10} className="text-red-400 shrink-0" /> How-To-Play YouTube Link
                          </label>
                          <input
                            type="url"
                            value={editGameHowToPlay}
                            onChange={(e) => setEditGameHowToPlay(e.target.value)}
                            placeholder="YouTube tutorial URL"
                            className="py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                          />
                        </div>

                        {/* Quick Summary video link */}
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] flex items-center gap-1.5 uppercase tracking-wider text-[#C8B1CC]/80 font-bold">
                            <Film size={10} className="text-[#f8b146] shrink-0" /> Quick Summary YouTube Link
                          </label>
                          <input
                            type="url"
                            value={editGameQuickSummary}
                            onChange={(e) => setEditGameQuickSummary(e.target.value)}
                            placeholder="YouTube summary URL"
                            className="py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                          />
                        </div>

                        {/* Box Image Upload / Direct Link Input */}
                        <div className="flex flex-col gap-2 col-span-1 md:col-span-2 border-t border-white/5 pt-4 mt-2">
                          <label className="font-mono text-[9px] flex items-center gap-1 uppercase tracking-wider text-[#C8B1CC]/80 font-bold">
                            <ImageIcon size={10} className="text-[#f8b146] shrink-0" /> Cover image file upload (Supabase Bucket) or Image URL
                          </label>
                          <div className="flex flex-col sm:flex-row gap-4 items-center bg-[#120515]/45 border border-white/10 p-4 rounded-xl">
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
                                  className="w-full py-2.5 px-4 bg-[#120515]/50 border border-white/10 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all"
                                />
                              </div>
                            </div>
                            
                            {editGameBoxImg ? (
                              <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/15 bg-cover bg-center shrink-0 shadow-inner relative group" style={{ backgroundImage: `url(${editGameBoxImg})` }}>
                                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
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
                              <div className="w-24 h-24 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-white/20 shrink-0 bg-[#120515]/30">
                                <ImageIcon size={20} />
                                <span className="text-[9px] mt-1 font-mono uppercase tracking-wider">No Image</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Submit / Cancel Actions */}
                      <div className="border-t border-white/5 pt-6 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={handleCancelEditGame}
                          className="px-6 py-3.5 bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 text-[#C8B1CC] hover:text-white rounded-xl transition-all text-xs font-sans font-bold cursor-pointer"
                        >
                          Discard
                        </button>
                        <button
                          type="submit"
                          className="px-8 py-3.5 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#25102a] rounded-xl font-sans font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-[#f8b146]/20 hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.99] active:translate-y-0 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                        >
                          <Save size={14} /> Update specs
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Directory List View */
                    <div className="space-y-4">
                      {/* Search Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                        <div className="text-left">
                          <h4 className="font-sans font-bold text-sm text-white">Board Games Directory</h4>
                          <p className="font-sans text-[10px] text-[#C8B1CC]/80">Manage physical game details, tutorial links, and graphics</p>
                        </div>
                        
                        <div className="relative w-full sm:max-w-xs">
                          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/30">
                            <Search size={14} />
                          </div>
                          <input
                            type="text"
                            placeholder="Quick lookup by title..."
                            value={manageGameSearch}
                            onChange={(e) => setManageGameSearch(e.target.value)}
                            className="w-full py-2.5 pl-11 pr-4 bg-[#120515]/40 border border-white/10 focus:border-[#f8b146] text-white placeholder-white/30 rounded-xl font-sans text-xs focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                          />
                        </div>
                      </div>

                      {/* Directory cards grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
                        {games
                          .filter(game => game.title.toLowerCase().includes(manageGameSearch.toLowerCase()) || game.theme.toLowerCase().includes(manageGameSearch.toLowerCase()))
                          .map((game, idx) => {
                            const initials = game.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
                            
                            // Map complexity to aesthetic badge colors
                            let typeBadgeStyle = 'bg-white/5 border-white/10 text-white/70';
                            if (game.type === 'Heavy') typeBadgeStyle = 'bg-red-500/10 border-red-500/20 text-red-300';
                            else if (game.type === 'Medium') typeBadgeStyle = 'bg-amber-500/10 border-amber-500/20 text-amber-300';
                            else if (game.type === 'Light') typeBadgeStyle = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300';
                            else if (game.type === 'Social') typeBadgeStyle = 'bg-[#f8b146]/10 border-[#f8b146]/20 text-[#f8b146]';

                            return (
                              <div 
                                key={game.num || idx} 
                                className="bg-[#120515]/45 border border-white/5 hover:border-[#f8b146]/35 rounded-[1.8rem] p-4 flex gap-4 items-center justify-between transition-all duration-300 hover:shadow-[0_8px_20px_-8px_rgba(248,177,70,0.15)] group relative"
                              >
                                <div className="flex items-center gap-3 overflow-hidden text-left">
                                  {game.box_img || game.play_img ? (
                                    <div 
                                      className="w-12 h-12 rounded-xl bg-cover bg-center bg-[#120515]/50 border border-white/10 shrink-0 group-hover:scale-105 transition-transform duration-300" 
                                      style={{ backgroundImage: `url(${game.box_img || game.play_img})` }} 
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3a1d42]/30 to-[#120515]/40 border border-[#f8b146]/20 text-[#f8b146] flex items-center justify-center shrink-0 font-mono text-xs font-black shadow-inner">
                                      {initials}
                                    </div>
                                  )}
                                  <div className="overflow-hidden">
                                    <h5 className="font-sans font-bold text-xs text-white truncate max-w-[140px] group-hover:text-[#f8b146] transition-colors" title={game.title}>
                                      {game.title}
                                    </h5>
                                    <div className="flex gap-1.5 items-center mt-1.5 flex-wrap">
                                      <span className={`font-mono text-[7px] uppercase px-2 py-0.5 rounded-full border ${typeBadgeStyle}`}>
                                        {game.type}
                                      </span>
                                      <span className="font-mono text-[8px] text-[#C8B1CC]/60 font-bold">
                                        {game.year}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleStartEditGame(game)}
                                  className="p-2.5 rounded-xl border border-white/10 hover:border-[#f8b146]/45 text-[#C8B1CC] hover:text-[#f8b146] bg-white/5 hover:bg-[#f8b146]/10 transition-all duration-300 cursor-pointer shrink-0"
                                  title="Edit Specs & Cover"
                                >
                                  <Pencil size={12} />
                                </button>
                              </div>
                            );
                          })}
                        
                        {games.filter(game => game.title.toLowerCase().includes(manageGameSearch.toLowerCase()) || game.theme.toLowerCase().includes(manageGameSearch.toLowerCase())).length === 0 && (
                          <div className="col-span-full py-12 text-center text-[#C8B1CC]/40 border border-dashed border-white/10 rounded-2xl">
                            <Dices size={24} className="mx-auto mb-3 opacity-30 animate-bounce text-[#f8b146]" />
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
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 space-y-5 backdrop-blur-md">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                      <ImageIcon size={15} className="text-[#f8b146]" />
                      <h4 className="font-sans font-bold text-sm text-white">
                        {editingImageIndex !== null ? 'Modify Gallery Item' : 'Ingest New Photo to Gallery'}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Photo file upload dropzone */}
                      <div className="flex flex-col gap-2 col-span-1 md:col-span-2 bg-[#120515]/40 border border-white/10 p-4 rounded-2xl">
                        <label className="font-mono text-[9px] flex items-center gap-1.5 uppercase tracking-wider text-[#C8B1CC]/80 font-bold">
                          <Upload size={10} className="text-[#f8b146]" /> File Uploader
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
                                  : 'bg-[#f8b146]/5 border-[#f8b146]/20 text-[#f8b146] hover:bg-[#f8b146]/10 hover:border-[#f8b146]/45 shadow-sm shadow-[#f8b146]/5'
                              }`}
                            >
                              {isUploadingGallery ? (
                                <>
                                  <Loader2 size={14} className="animate-spin text-[#f8b146]" />
                                  Uploading file to bucket...
                                </>
                              ) : (
                                <>
                                  <Upload size={14} />
                                  Upload Photo File
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
                              placeholder="Or paste external photo link URL..."
                              className="w-full py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Image title */}
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Image Title *</label>
                        <input
                          type="text"
                          value={galleryTitle}
                          onChange={(e) => setGalleryTitle(e.target.value)}
                          placeholder="e.g. Social Deduction Clashes"
                          className="py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-[#f8b146]/20"
                        />
                      </div>
                      
                      {/* Category Selector */}
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Category</label>
                        <select
                          value={galleryCategory}
                          onChange={(e) => setGalleryCategory(e.target.value)}
                          className="py-3 px-4 bg-[#120515]/80 border border-white/10 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="Play Session" className="bg-[#25102a] text-white">Play Session</option>
                          <option value="Atelier Vibe" className="bg-[#25102a] text-white">Atelier Vibe</option>
                          <option value="Social Deduction" className="bg-[#25102a] text-white">Social Deduction</option>
                          <option value="Game Night" className="bg-[#25102a] text-white">Game Night</option>
                          <option value="Community" className="bg-[#25102a] text-white">Community</option>
                          <option value="Tournament" className="bg-[#25102a] text-white">Tournament</option>
                        </select>
                      </div>
                      
                      {/* Aspect Ratio */}
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Frame Aspect Ratio</label>
                        <select
                          value={galleryAspect}
                          onChange={(e) => setGalleryAspect(e.target.value)}
                          className="py-3 px-4 bg-[#120515]/80 border border-white/10 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="aspect-[3/4]" className="bg-[#25102a] text-white">Vertical (Portrait 3:4)</option>
                          <option value="aspect-square" className="bg-[#25102a] text-white">Square (1:1)</option>
                          <option value="aspect-[4/3]" className="bg-[#25102a] text-white">Horizontal (Landscape 4:3)</option>
                        </select>
                      </div>

                      {/* Visibility Toggle */}
                      <div className="flex flex-col gap-2 justify-center bg-[#120515]/30 border border-white/5 p-4 rounded-xl">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/85 font-bold">Homepage Visibility</label>
                        <label className="flex items-center gap-3 cursor-pointer py-1 select-none">
                          <input
                            type="checkbox"
                            checked={galleryShowOnHomepage}
                            onChange={(e) => setGalleryShowOnHomepage(e.target.checked)}
                            className="w-4 h-4 rounded border-white/20 text-[#f8b146] focus:ring-[#f8b146]/20 bg-[#120515]/60 cursor-pointer"
                          />
                          <span className="font-sans text-xs text-white font-medium">Show in Landing Carousel Slider</span>
                        </label>
                      </div>
                    </div>
                    
                    {/* Desc */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80 font-bold">Caption Description</label>
                      <textarea
                        value={galleryDesc}
                        onChange={(e) => setGalleryDesc(e.target.value)}
                        placeholder="Provide details about the gathering or activity captured..."
                        rows={2}
                        className="py-3 px-4 bg-[#120515]/50 border border-white/10 hover:border-white/20 focus:border-[#f8b146] rounded-xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 resize-none focus:ring-1 focus:ring-[#f8b146]/20"
                      />
                    </div>
                    
                    {/* Live Preview panel */}
                    {galleryUrl && (
                      <div className="border border-white/10 rounded-2xl p-4 bg-[#120515]/30 flex flex-col items-center">
                        <p className="font-mono text-[8px] uppercase tracking-wider text-[#C8B1CC]/50 mb-2 self-start font-bold">Ingested Media Preview</p>
                        <img
                          src={galleryUrl}
                          alt="Preview"
                          className="max-h-40 rounded-xl object-contain border border-white/10 shadow-lg"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}
                    
                    {/* Save actions */}
                    <div className="flex justify-end gap-3">
                      {editingImageIndex !== null ? (
                        <>
                          <button
                            type="button"
                            onClick={clearGalleryForm}
                            className="px-6 py-3.5 bg-transparent border border-white/10 hover:border-white/20 text-white rounded-xl font-sans font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
                          >
                            Discard
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
                                desc: galleryDesc || 'A captured moment from our community gatherings.',
                                show_on_homepage: galleryShowOnHomepage
                              });
                              clearGalleryForm();
                              setFormSuccess('Image updated successfully!');
                              setTimeout(() => setFormSuccess(''), 3000);
                            }}
                            className="px-8 py-3.5 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#25102a] rounded-xl font-sans font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-[#f8b146]/20 hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.99] active:translate-y-0 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                          >
                            <Save size={14} /> Commit Changes
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
                              desc: galleryDesc || 'A captured moment from our community gatherings.',
                              show_on_homepage: galleryShowOnHomepage
                            });
                            clearGalleryForm();
                            setFormSuccess('Image added to gallery successfully!');
                            setTimeout(() => setFormSuccess(''), 3000);
                          }}
                          className="px-8 py-3.5 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#25102a] rounded-xl font-sans font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-[#f8b146]/20 hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.99] active:translate-y-0 transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
                        >
                          <Plus size={14} /> Append to gallery
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Gallery items list */}
                  {galleryImages && galleryImages.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-sans font-bold text-sm text-white">Current Gallery Reel ({galleryImages.length})</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                        {galleryImages.map((img, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-[#120515]/30 border border-white/5 rounded-2xl p-3 hover:border-[#f8b146]/35 transition-all duration-300 relative group">
                            <img
                              src={img.src}
                              alt={img.title}
                              className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0 shadow"
                              onError={(e) => { e.target.src = ''; e.target.className = 'w-16 h-16 rounded-xl bg-[#f8b146]/10 border border-[#f8b146]/25 shrink-0 flex items-center justify-center'; }}
                            />
                            <div className="flex-1 min-w-0 text-left">
                              <p className="font-sans font-bold text-xs text-white truncate">{img.title}</p>
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span className="font-mono text-[8px] bg-white/5 border border-white/10 text-[#C8B1CC]/80 px-2 py-0.5 rounded-full">{img.category}</span>
                                {img.show_on_homepage !== false && (
                                  <span className="font-mono text-[8px] bg-gradient-to-r from-[#f8b146]/10 to-[#f28a75]/10 border border-[#f8b146]/35 text-[#f8b146] px-2 py-0.5 rounded-full uppercase shrink-0 font-bold tracking-wider">
                                    Homepage
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartEditGalleryImage(idx)}
                                className={`w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
                                  editingImageIndex === idx
                                    ? 'bg-[#f8b146]/20 border-[#f8b146] text-[#f8b146]'
                                    : 'border-white/10 text-white/40 hover:text-[#f8b146] hover:border-[#f8b146]/45 hover:bg-[#f8b146]/10'
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
                                className="w-8 h-8 rounded-lg border border-white/10 hover:border-red-500/40 text-white/40 hover:text-red-400 hover:bg-red-950/25 transition-all flex items-center justify-center shrink-0 cursor-pointer"
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
                <div className="space-y-6 text-left animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                    <div className="text-left">
                      <h4 className="font-sans font-bold text-sm text-white">Club Onboarding Applicants</h4>
                      <p className="font-sans text-[10px] text-[#C8B1CC]/80">Review boarding passports and category preferences for active club applicants</p>
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
                        className="py-2.5 px-4 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-mono text-[9px] uppercase tracking-wider font-extrabold transition-all cursor-pointer inline-flex items-center gap-2"
                      >
                        <Trash2 size={12} /> Clear Database
                      </button>
                    )}
                  </div>

                  <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1 custom-scrollbar">
                    {applicantsList && applicantsList.length > 0 ? (
                      applicantsList.map((app) => (
                        <div 
                          key={app.id}
                          className="bg-[#120515]/60 border border-white/5 hover:border-[#f8b146]/35 rounded-[1.8rem] p-5 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 hover:shadow-[0_10px_25px_-10px_rgba(248,177,70,0.1)] group"
                        >
                          <div className="space-y-3 max-w-lg text-left">
                            <div className="flex items-center gap-3">
                              <span className="font-sans font-black text-sm text-white group-hover:text-[#f8b146] transition-colors">{app.fullName}</span>
                              <span className="font-mono text-[7px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f8b146]/10 border border-[#f8b146]/20 text-[#f8b146] font-bold">
                                Member Applicant
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-[#C8B1CC] font-medium">
                              <div className="flex items-center gap-2">
                                <Mail size={12} className="text-[#f8b146]/60 shrink-0" />
                                <span>{app.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone size={12} className="text-[#f8b146]/60 shrink-0" />
                                <span>{app.phone}</span>
                              </div>
                            </div>

                            <div className="text-xs text-[#C8B1CC] bg-[#120515]/40 border border-white/5 p-3 rounded-xl">
                              <span className="opacity-50 font-mono text-[9px] uppercase tracking-wider block mb-1">Preferred Game Categories</span>
                              <span className="text-[#f8b146] font-bold">
                                {app.gameTypes && app.gameTypes.join(', ')}
                              </span>
                            </div>

                            <div className="text-[9px] font-mono text-white/30 flex items-center gap-1.5">
                              <Calendar size={10} />
                              <span>Submitted: {new Date(app.date).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={async () => {
                              const updated = applicantsList.filter(item => item.id !== app.id);
                              localStorage.setItem('ibgc_applications', JSON.stringify(updated));
                              setApplicantsList(updated);
                              setFormSuccess(`Dismissed club onboarding request from: "${app.fullName}"`);
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
                            className="p-3 rounded-2xl border border-white/10 hover:border-red-500/40 text-white/50 hover:text-red-400 bg-white/5 hover:bg-red-500/10 transition-all duration-300 flex items-center justify-center cursor-pointer shrink-0 md:self-center"
                            title="Dismiss Onboarding Request"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="py-16 text-center text-[#C8B1CC]/40 border border-dashed border-white/10 rounded-[2.5rem]">
                        <Dices size={32} className="mx-auto mb-3 opacity-30 animate-bounce text-[#f8b146]" />
                        <p className="font-sans text-xs">No pending member onboarding requests in storage.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

            </div>
          </div>
        )}
      </div>
      
      {/* Global CSS Inject to customize styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(18, 5, 21, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(248, 177, 70, 0.2);
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(248, 177, 70, 0.4);
        }
      `}} />
    </div>
  );
}
