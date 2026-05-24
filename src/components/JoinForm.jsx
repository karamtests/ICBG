import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { User, Mail, Phone, Dices, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Check } from 'lucide-react';

const GAME_CATEGORIES = [
  "Social",
  "Easy",
  "Light",
  "Medium",
  "Heavy",
  "Cooperative",
  "Competitive",
  "Social Deduction",
  "Strategy",
  "Party"
];

export default function JoinForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gameTypes: []
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Client-side validations
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 3) {
          error = 'Name must be at least 3 characters long';
        } else if (!/^[\u0600-\u06FFA-Za-z\s'-]+$/.test(value)) {
          error = 'Name must contain only letters and spaces (supports English & Arabic)';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else {
          // Flexible regex for Jordanian and international numbers (7-15 digits, allows +, -, spaces, parentheses)
          const cleanPhone = value.replace(/[\s\-()]/g, '');
          if (!/^\+?[0-9]{7,15}$/.test(cleanPhone)) {
            error = 'Please enter a valid phone number (7-15 digits)';
          }
        }
        break;
      case 'gameTypes':
        if (value.length === 0) {
          error = 'Please select at least one preferred board game type';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Perform live validation on change if field has already been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const toggleGameType = (category) => {
    setFormData(prev => {
      const currentTypes = [...prev.gameTypes];
      const index = currentTypes.indexOf(category);
      if (index > -1) {
        currentTypes.splice(index, 1);
      } else {
        currentTypes.push(category);
      }

      // Live validate categories if touched or interacted with
      const error = validateField('gameTypes', currentTypes);
      setErrors(prevErrors => ({ ...prevErrors, gameTypes: error }));
      
      return { ...prev, gameTypes: currentTypes };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = { fullName: true, email: true, phone: true };
    setTouched(allTouched);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    // Check if form is valid
    const hasErrors = Object.values(newErrors).some(err => err !== '');
    if (hasErrors) {
      // Find the first error and shake or scroll into view safely
      const firstErrorField = Object.keys(newErrors).find(field => newErrors[field] !== '');
      const element = firstErrorField === 'gameTypes'
        ? document.getElementById('game-categories-grid')
        : document.getElementById(firstErrorField);
      if (element) {
        element.focus?.();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Submit state animation trigger
    setIsSubmitting(true);

    // Save submission and simulate API latency
    setTimeout(async () => {
      // Local fallback persistent write
      try {
        const stored = localStorage.getItem('ibgc_applications');
        const list = stored ? JSON.parse(stored) : [];
        const newApplication = {
          id: Date.now(),
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          gameTypes: formData.gameTypes,
          date: new Date().toISOString()
        };
        list.push(newApplication);
        localStorage.setItem('ibgc_applications', JSON.stringify(list));
      } catch (error) {
        console.warn("Failed to save application to localStorage:", error);
      }

      // Supabase Write
      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase.from('applications').insert([{
            full_name: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            game_types: formData.gameTypes
          }]);
          if (error) throw error;
        } catch (e) {
          console.error("Failed to save application to Supabase:", e);
        }
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1800);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      gameTypes: []
    });
    setErrors({});
    setTouched({});
    setIsSuccess(false);
  };

  return (
    <section 
      id="join" 
      className="relative w-full py-24 md:py-36 bg-transparent overflow-hidden border-b border-white/5"
    >
      {/* Decorative backdrop light glows suited for the Luxurious Sunset Plum theme */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#f8b146]/5 to-[#f28a75]/10 rounded-full filter blur-[120px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-10 right-10 w-80 h-80 bg-[#f8b146]/5 rounded-full filter blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#f8b146]/5 rounded-full filter blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3a1d42]/65 border border-white/10 shadow-sm mb-4">
            <Sparkles size={12} className="text-[#f8b146] animate-spin" style={{ animationDuration: '3s' }} />
            <span className="font-mono text-[9px] uppercase tracking-widest text-white font-bold">Atelier Onboarding</span>
          </div>
          <h2 className="font-serif italic text-4xl md:text-5xl text-white leading-tight max-w-xl mb-4">
            Join Our Club
          </h2>
          <div className="w-12 h-[1.5px] bg-gradient-to-r from-[#f8b146] to-[#f28a75] mb-4" />
          <p className="font-sans font-light text-[#C8B1CC] text-sm md:text-base max-w-md leading-relaxed">
            Apply to become a vetted member of Irbid's premier board gaming enclave. Master tactics, enjoy hand-roasted coffee, and share extraordinary gatherings.
          </p>
        </div>

        {/* High-Fidelity Form Card */}
        <div className="bg-[#3a1d42]/35 border border-white/8 backdrop-blur-xl shadow-2xl rounded-[2.5rem] p-8 md:p-10 max-w-2xl mx-auto relative overflow-hidden transition-all duration-500">
          
          {/* Subtle Golden Top Accent Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f8b146] via-[#f28a75] to-[#f8b146]" />

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Full Name Input */}
              <div className="flex flex-col group">
                <label htmlFor="fullName" className="font-mono text-[10px] uppercase tracking-widest text-white/70 mb-2 font-bold flex items-center gap-1.5 transition-colors group-focus-within:text-[#f8b146]">
                  <User size={12} />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('fullName')}
                    placeholder="e.g. Karam Al-Qudah"
                    className={`w-full pl-5 pr-4 py-3.5 rounded-2xl bg-[#25102a]/45 border text-white placeholder:text-white/30 focus:outline-none focus:bg-[#25102a]/80 focus:ring-1 transition-all duration-300 font-sans text-sm ${
                      errors.fullName && touched.fullName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                        : 'border-white/10 focus:border-[#f8b146] focus:ring-[#f8b146]/20'
                    }`}
                  />
                </div>
                {errors.fullName && touched.fullName && (
                  <span className="flex items-center gap-1 mt-2 text-xs text-red-400 font-sans font-medium transition-all animate-fadeIn">
                    <AlertCircle size={12} />
                    {errors.fullName}
                  </span>
                )}
              </div>

              {/* Email & Phone Twin Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Email Input */}
                <div className="flex flex-col group">
                  <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest text-white/70 mb-2 font-bold flex items-center gap-1.5 transition-colors group-focus-within:text-[#f8b146]">
                    <Mail size={12} />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      placeholder="e.g. name@domain.com"
                      className={`w-full pl-5 pr-4 py-3.5 rounded-2xl bg-[#25102a]/45 border text-white placeholder:text-white/30 focus:outline-none focus:bg-[#25102a]/80 focus:ring-1 transition-all duration-300 font-sans text-sm ${
                        errors.email && touched.email
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                          : 'border-white/10 focus:border-[#f8b146] focus:ring-[#f8b146]/20'
                      }`}
                    />
                  </div>
                  {errors.email && touched.email && (
                    <span className="flex items-center gap-1 mt-2 text-xs text-red-400 font-sans font-medium transition-all animate-fadeIn">
                      <AlertCircle size={12} />
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Phone Input */}
                <div className="flex flex-col group">
                  <label htmlFor="phone" className="font-mono text-[10px] uppercase tracking-widest text-white/70 mb-2 font-bold flex items-center gap-1.5 transition-colors group-focus-within:text-[#f8b146]">
                    <Phone size={12} />
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur('phone')}
                      placeholder="e.g. +962 7 9123 4567"
                      className={`w-full pl-5 pr-4 py-3.5 rounded-2xl bg-[#25102a]/45 border text-white placeholder:text-white/30 focus:outline-none focus:bg-[#25102a]/80 focus:ring-1 transition-all duration-300 font-sans text-sm ${
                        errors.phone && touched.phone
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                          : 'border-white/10 focus:border-[#f8b146] focus:ring-[#f8b146]/20'
                      }`}
                    />
                  </div>
                  {errors.phone && touched.phone && (
                    <span className="flex items-center gap-1 mt-2 text-xs text-red-400 font-sans font-medium transition-all animate-fadeIn">
                      <AlertCircle size={12} />
                      {errors.phone}
                    </span>
                  )}
                </div>

              </div>

              {/* Preferred Board Game Types */}
              <div className="flex flex-col">
                <label className="font-mono text-[10px] uppercase tracking-widest text-white/70 mb-3 font-bold flex items-center gap-1.5">
                  <Dices size={12} className="text-[#f8b146]" />
                  Preferred Board Game Categories
                </label>
                
                <div id="game-categories-grid" className="grid grid-cols-2 sm:grid-cols-5 gap-3" tabIndex={-1}>
                  {GAME_CATEGORIES.map((category) => {
                    const isSelected = formData.gameTypes.includes(category);
                    return (
                      <button
                        type="button"
                        key={category}
                        onClick={() => toggleGameType(category)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-[11px] font-sans font-bold transition-all duration-300 cursor-pointer select-none active:scale-95 ${
                          isSelected
                            ? 'border-[#f8b146] bg-[#f8b146]/10 text-white shadow-sm shadow-[#f8b146]/5 scale-[1.02]'
                            : 'border-white/10 bg-white/5 text-[#C8B1CC] hover:border-[#f8b146]/35 hover:bg-[#f8b146]/5 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{category}</span>
                        {isSelected && (
                          <Check size={11} className="text-[#f8b146] shrink-0 ml-1 animate-scaleIn" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.gameTypes && (
                  <span className="flex items-center gap-1 mt-3 text-xs text-red-400 font-sans font-medium transition-all animate-fadeIn">
                    <AlertCircle size={12} />
                    {errors.gameTypes}
                  </span>
                )}
              </div>

              {/* Submit CTA Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative py-4 px-6 rounded-2xl bg-gradient-to-r from-[#f8b146] to-[#f28a75] text-[#3a1d42] font-sans font-black text-xs uppercase tracking-widest hover:scale-[1.03] active:scale-97 transition-all duration-300 ease-out shadow-lg shadow-[#f8b146]/20 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed overflow-hidden group flex items-center justify-center gap-2"
                >
                  {/* Glowing shimmer overlay effect */}
                  <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" />
                  
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-[#3a1d42]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Processing Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <ArrowRight size={13} className="text-[#3a1d42] transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            /* Premium Success Ticket Overlay Card takeover */
            <div className="py-8 px-4 text-center animate-fadeIn relative">
              {/* Decorative light rays inside success */}
              <div className="absolute inset-0 bg-radial-gradient from-[#f8b146]/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#f8b146] to-[#f28a75] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#f8b146]/25 border border-white/40">
                  <CheckCircle2 size={32} className="text-[#3a1d42] animate-pulse" />
                </div>
                
                <h3 className="font-serif italic text-2xl md:text-3xl text-white mb-3">
                  Welcome to the Atelier
                </h3>
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#f8b146] mb-6 font-black">
                  Application Logged Successfully
                </p>

                <p className="font-sans font-light text-[#C8B1CC] text-sm max-w-md mx-auto leading-relaxed mb-8">
                  Excellent choice, <span className="font-semibold text-white">{formData.fullName}</span>. Your application has been logged and queued. Our curators will review your details, and a club invitation is winging its way to <span className="font-semibold text-white">{formData.email}</span>.
                </p>

                {/* Styled Membership Admission Ticket Stub */}
                <div className="max-w-sm mx-auto bg-[#25102a]/60 border-t-2 border-b-2 border-dashed border-white/10 rounded-xl p-5 mb-8 relative overflow-hidden">
                  
                  {/* Left punch card circle */}
                  <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-[#3a1d42] border border-white/10 rounded-full z-10" />
                  {/* Right punch card circle */}
                  <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-[#3a1d42] border border-white/10 rounded-full z-10" />

                  <div className="flex flex-col gap-3 font-sans text-xs text-left">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-mono uppercase tracking-wider text-[9px] text-[#C8B1CC] font-bold">Lobby Access</span>
                      <span className="font-mono text-[#f8b146] font-bold">STATUS: PENDING REVIEW</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-[#C8B1CC] font-mono text-[9px] uppercase tracking-wider block">Applicant</span>
                        <span className="font-bold text-white truncate block">{formData.fullName}</span>
                      </div>
                      <div>
                        <span className="text-[#C8B1CC] font-mono text-[9px] uppercase tracking-wider block">Phone Contact</span>
                        <span className="font-bold text-white block">{formData.phone}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[#C8B1CC] font-mono text-[9px] uppercase tracking-wider block">Curated Matches</span>
                      <span className="font-bold text-white line-clamp-1">
                        {formData.gameTypes.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Back to Home Button */}
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full border border-white/10 text-[#C8B1CC] hover:text-white hover:border-[#f8b146]/50 hover:bg-[#f8b146]/5 transition-all duration-300 font-mono text-[9px] uppercase tracking-widest font-bold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Sparkles size={11} className="text-[#f8b146]" />
                  Submit Another Form
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
