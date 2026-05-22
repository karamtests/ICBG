import React, { useState, useEffect } from 'react';
import { Lock, Unlock, X, Plus, Calendar, Save, Search, Check, Sparkles, Film, Play, Eye, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function AdminPanel({ isOpen, onClose, games, onAddGame, schedule, onUpdateSchedule, galleryImages, onAddGalleryImage, onRemoveGalleryImage }) {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule', 'addGame', or 'gallery'

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
  const [formSuccess, setFormSuccess] = useState('');

  // Gallery form state
  const [galleryUrl, setGalleryUrl] = useState('');
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('Play Session');
  const [galleryDesc, setGalleryDesc] = useState('');
  const [galleryAspect, setGalleryAspect] = useState('aspect-square');

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
    }
  }, [isOpen, schedule]);

  if (!isOpen) return null;

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (passcode === '1983') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('كلمة المرور غير صحيحة. يرجى المحاولة مجدداً.');
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
    setFormSuccess('تم تحديث جدول وفعاليات الأسبوع بنجاح!');
    setTimeout(() => setFormSuccess(''), 3000);
  };

  const handleAddGameSubmit = (e) => {
    e.preventDefault();
    if (!newGameTitle) return;

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
      box_img: '', // monogram fallback
      box_link: '',
      play_img: '',
      play_link: '',
      how_to_play: newGameHowToPlay,
      quick_summary: newGameQuickSummary,
      rating: ''
    };

    onAddGame(gameObj);
    setFormSuccess(`تمت إضافة لعبة "${newGameTitle}" إلى الأرشيف بنجاح!`);
    
    // Reset form
    setNewGameTitle('');
    setNewGameTheme('');
    setNewGamePlayers('');
    setNewGameTime('');
    setNewGameYear('');
    setNewGameExpansion('None');
    setNewGameHowToPlay('');
    setNewGameQuickSummary('');

    setTimeout(() => setFormSuccess(''), 3000);
  };

  const toggleFeaturedGame = (title) => {
    if (featuredTitles.includes(title)) {
      setFeaturedTitles(featuredTitles.filter(t => t !== title));
    } else {
      if (featuredTitles.length >= 4) {
        alert('يمكنك تحديد 4 ألعاب كحد أقصى للجدول الأسبوعي.');
        return;
      }
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
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#f8b146] font-bold block">ICBG CLUB ATELIER</span>
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
            <h4 className="font-sans font-bold text-lg text-white mb-2 text-center">بوابة الإدارة الخاصة</h4>
            <p className="font-sans font-light text-xs text-[#C8B1CC] text-center max-w-sm mb-8 leading-relaxed">
              يرجى إدخال رمز المرور السري الخاص بنادي إربد لألعاب الطاولة (ICBG) لفتح لوحة التحكم والتعديل.
            </p>

            <form onSubmit={handleAuthSubmit} className="w-full max-w-xs flex flex-col items-center">
              <input
                type="password"
                placeholder="رمز المرور (Passcode)"
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
                دخول البوابة
              </button>
            </form>
            <span className="font-mono text-[9px] text-[#C8B1CC]/40 mt-10">HINT: YEAR OF JENGA RELEASE</span>
          </div>
        ) : (
          /* Authenticated Dashboard Panel */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-[#25102a]/30 px-6">
              <button
                onClick={() => { setActiveTab('schedule'); setFormSuccess(''); }}
                className={`px-6 py-4 font-mono text-xs uppercase tracking-widest relative transition-all duration-300 cursor-pointer ${
                  activeTab === 'schedule' ? 'text-[#f8b146] font-bold' : 'text-[#C8B1CC] hover:text-white'
                }`}
              >
                جدول الفعاليات الأسبوعية
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
                إضافة لعبة للأرشيف
                {activeTab === 'addGame' && (
                  <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#f8b146]" />
                )}
              </button>
              
              <button
                onClick={() => { setActiveTab('gallery'); setFormSuccess(''); }}
                className={`px-6 py-4 font-mono text-xs uppercase tracking-widest relative transition-all duration-300 cursor-pointer ${
                  activeTab === 'gallery' ? 'text-[#f8b146] font-bold' : 'text-[#C8B1CC] hover:text-white'
                }`}
              >
                معرض الصور
                {activeTab === 'gallery' && (
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
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">اللقاء الرئيسي (العنوان)</label>
                      <input
                        type="text"
                        value={nextHangout}
                        onChange={(e) => setNextHangout(e.target.value)}
                        placeholder="مثال: Friday, 22/5/2026 7:30 PM"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>

                    {/* Thursday Date/Time Input */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">جلسة يوم الخميس (Thursday)</label>
                      <input
                        type="text"
                        value={thursdayDate}
                        onChange={(e) => setThursdayDate(e.target.value)}
                        placeholder="مثال: 28/5/26 7:00 PM"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>

                    {/* Friday Date/Time Input */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">جلسة يوم الجمعة (Friday)</label>
                      <input
                        type="text"
                        value={fridayDate}
                        onChange={(e) => setFridayDate(e.target.value)}
                        placeholder="مثال: 22/5/26 7:00 PM"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  {/* Featured Games Selection (Checklist) */}
                  <div className="border-t border-white/10 pt-6 flex flex-col gap-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-sans font-bold text-sm text-white">ألعاب الأسبوع البارزة (Featured Games)</h4>
                        <p className="font-sans text-[10px] text-[#C8B1CC]">اختر حتى 4 ألعاب ليتم عرضها في الصفحة الرئيسية</p>
                      </div>
                      <div className="font-mono text-[10px] bg-[#f8b146]/10 border border-[#f8b146]/25 text-[#f8b146] px-3 py-1 rounded-full w-max">
                        تم اختيار {featuredTitles.length} من 4 ألعاب
                      </div>
                    </div>

                    {/* Selector search */}
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/30">
                        <Search size={14} />
                      </div>
                      <input
                        type="text"
                        placeholder="ابحث عن لعبة لإضافتها للجدول..."
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
                          لا يوجد ألعاب مطابقة للبحث
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
                      <Save size={14} /> حفظ التغييرات والجدول
                    </button>
                  </div>
                </form>
              ) : activeTab === 'addGame' ? (
                /* TAB 2: ADD NEW BOARD GAME FORM */
                <form onSubmit={handleAddGameSubmit} className="space-y-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Game Title */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">اسم اللعبة (Game Title) *</label>
                      <input
                        type="text"
                        value={newGameTitle}
                        onChange={(e) => setNewGameTitle(e.target.value)}
                        placeholder="مثال: Scythe"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>

                    {/* Complexity Type Dropdown */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">مستوى الصعوبة (Complexity Classification)</label>
                      <select
                        value={newGameType}
                        onChange={(e) => setNewGameType(e.target.value)}
                        className="py-3 px-4 bg-[#25102a]/90 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white focus:outline-none transition-all duration-300 cursor-pointer"
                      >
                        <option value="Social" className="bg-[#25102a] text-white">Social (اجتماعية)</option>
                        <option value="Easy" className="bg-[#25102a] text-white">Easy (سهلة)</option>
                        <option value="Light" className="bg-[#25102a] text-white">Light (خفيفة)</option>
                        <option value="Medium" className="bg-[#25102a] text-white">Medium (متوسطة)</option>
                        <option value="Heavy" className="bg-[#25102a] text-white">Heavy (ثقيلة)</option>
                      </select>
                    </div>

                    {/* Format Strategy (Competition) */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">نمط اللعب (Competition Format)</label>
                      <select
                        value={newGameComp}
                        onChange={(e) => setNewGameComp(e.target.value)}
                        className="py-3 px-4 bg-[#25102a]/90 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white focus:outline-none transition-all duration-300 cursor-pointer"
                      >
                        <option value="Competitive" className="bg-[#25102a] text-white">Competitive (تنافسي)</option>
                        <option value="Cooperative" className="bg-[#25102a] text-white">Cooperative (تعاوني)</option>
                      </select>
                    </div>

                    {/* Themes */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">موضوع أو تصنيف اللعبة (Theme / Mechanics)</label>
                      <input
                        type="text"
                        value={newGameTheme}
                        onChange={(e) => setNewGameTheme(e.target.value)}
                        placeholder="مثال: Strategy, Resource Management"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    {/* Players count */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">عدد اللاعبين (Players count)</label>
                      <input
                        type="text"
                        value={newGamePlayers}
                        onChange={(e) => setNewGamePlayers(e.target.value)}
                        placeholder="مثال: 1 - 5"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    {/* Playtime */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">مدة اللعب (Playtime)</label>
                      <input
                        type="text"
                        value={newGameTime}
                        onChange={(e) => setNewGameTime(e.target.value)}
                        placeholder="مثال: 90 - 115 Min"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    {/* Year */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">سنة الإصدار (Release Year)</label>
                      <input
                        type="text"
                        value={newGameYear}
                        onChange={(e) => setNewGameYear(e.target.value)}
                        placeholder="مثال: 2016"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    {/* Expansion */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">إصدار التوسعة (Expansion)</label>
                      <input
                        type="text"
                        value={newGameExpansion}
                        onChange={(e) => setNewGameExpansion(e.target.value)}
                        placeholder="مثال: None أو Invaders from Afar"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    {/* How to play video link */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] flex items-center gap-1 uppercase tracking-wider text-[#C8B1CC]/80">
                        <Play size={10} className="text-[#f8b146]" /> فيديو كيفية اللعب (How-to-play Youtube Link)
                      </label>
                      <input
                        type="url"
                        value={newGameHowToPlay}
                        onChange={(e) => setNewGameHowToPlay(e.target.value)}
                        placeholder="رابط فيديو اليوتيوب"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    {/* Quick Summary video link */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] flex items-center gap-1 uppercase tracking-wider text-[#C8B1CC]/80">
                        <Film size={10} className="text-[#f8b146]" /> فيديو ملخص سريع (Quick Summary Youtube Link)
                      </label>
                      <input
                        type="url"
                        value={newGameQuickSummary}
                        onChange={(e) => setNewGameQuickSummary(e.target.value)}
                        placeholder="رابط فيديو ملخص اليوتيوب"
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Form Submission Button */}
                  <div className="border-t border-white/10 pt-6 flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#3a1d42] rounded-full font-sans font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#f8b146]/15 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                    >
                      <Plus size={14} /> إضافة اللعبة للأرشيف
                    </button>
                  </div>
                </form>
              ) : activeTab === 'gallery' ? (
                /* TAB 3: GALLERY MANAGEMENT */
                <div className="space-y-6 text-left">
                  {/* Add new image form */}
                  <div className="bg-[#25102a]/30 border border-white/10 rounded-2xl p-6 space-y-4">
                    <h4 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                      <ImageIcon size={14} className="text-[#f8b146]" /> إضافة صورة جديدة للمعرض
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">رابط الصورة (Image URL) *</label>
                        <input
                          type="url"
                          value={galleryUrl}
                          onChange={(e) => setGalleryUrl(e.target.value)}
                          placeholder="https://example.com/photo.jpg"
                          className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">عنوان الصورة (Title) *</label>
                        <input
                          type="text"
                          value={galleryTitle}
                          onChange={(e) => setGalleryTitle(e.target.value)}
                          placeholder="مثال: Game Night Legends"
                          className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">التصنيف (Category)</label>
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
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">شكل الصورة (Aspect Ratio)</label>
                        <select
                          value={galleryAspect}
                          onChange={(e) => setGalleryAspect(e.target.value)}
                          className="py-3 px-4 bg-[#25102a]/90 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white focus:outline-none transition-all duration-300 cursor-pointer"
                        >
                          <option value="aspect-[3/4]" className="bg-[#25102a] text-white">عمودي (Portrait 3:4)</option>
                          <option value="aspect-square" className="bg-[#25102a] text-white">مربع (Square)</option>
                          <option value="aspect-[4/3]" className="bg-[#25102a] text-white">أفقي (Landscape 4:3)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/80">الوصف (Description)</label>
                      <textarea
                        value={galleryDesc}
                        onChange={(e) => setGalleryDesc(e.target.value)}
                        placeholder="وصف مختصر للصورة..."
                        rows={2}
                        className="py-3 px-4 bg-[#25102a]/60 border border-white/15 focus:border-[#f8b146] rounded-2xl font-sans text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-300 resize-none"
                      />
                    </div>
                    
                    {/* Preview */}
                    {galleryUrl && (
                      <div className="border border-white/10 rounded-2xl p-3 bg-[#25102a]/30">
                        <p className="font-mono text-[9px] uppercase tracking-wider text-[#C8B1CC]/40 mb-2">معاينة الصورة</p>
                        <img
                          src={galleryUrl}
                          alt="Preview"
                          className="w-full max-h-40 object-cover rounded-xl border border-white/10"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          if (!galleryUrl || !galleryTitle) {
                            alert('يرجى إدخال رابط الصورة والعنوان.');
                            return;
                          }
                          onAddGalleryImage({
                            src: galleryUrl,
                            title: galleryTitle,
                            category: galleryCategory,
                            aspect: galleryAspect,
                            desc: galleryDesc || 'A captured moment from our community gatherings.'
                          });
                          setGalleryUrl('');
                          setGalleryTitle('');
                          setGalleryDesc('');
                          setGalleryCategory('Play Session');
                          setGalleryAspect('aspect-square');
                          setFormSuccess('تمت إضافة الصورة للمعرض بنجاح!');
                          setTimeout(() => setFormSuccess(''), 3000);
                        }}
                        className="px-8 py-3.5 bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#3a1d42] rounded-full font-sans font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#f8b146]/15 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                      >
                        <Plus size={14} /> إضافة الصورة
                      </button>
                    </div>
                  </div>
                  
                  {/* Existing admin-added images */}
                  {galleryImages && galleryImages.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-sans font-bold text-sm text-white">الصور المضافة ({galleryImages.length})</h4>
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
                            <button
                              onClick={() => {
                                onRemoveGalleryImage(idx);
                                setFormSuccess('تم حذف الصورة من المعرض.');
                                setTimeout(() => setFormSuccess(''), 3000);
                              }}
                              className="w-8 h-8 rounded-full border border-white/10 hover:border-red-500/40 text-white/30 hover:text-red-400 hover:bg-red-950/30 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                              title="حذف الصورة"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
