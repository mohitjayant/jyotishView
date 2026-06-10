import React, { useState, useEffect } from "react";
import CosmicCanvas from "./components/CosmicCanvas";
import Logo from "./components/Logo";
import CelestialDivider from "./components/CelestialDivider";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Tv, 
  Sun, 
  Clock, 
  ShieldCheck, 
  ArrowUp, 
  Zap, 
  Monitor,
  Compass,
  Calendar,
  Disc,
  Heart,
  GitCommit,
  Phone
} from "lucide-react";

export default function App() {
  const [email, setEmail] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<{
    success: boolean;
    message: string;
    position?: number;
    totalCount?: number;
  } | null>(null);
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setWaitlistLoading(true);
    setWaitlistStatus(null);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setWaitlistStatus(data);
      if (data.success) {
        setEmail("");
      }
    } catch {
      setWaitlistStatus({
        success: false,
        message: "Stellar drift detected. Please check network connection and try again.",
      });
    } finally {
      setWaitlistLoading(false);
    }
  };

  return (
    <div className="antialiased min-h-screen text-white overflow-x-hidden bg-surface relative selection:bg-gold-400/30 selection:text-white font-body">
      
      {/* Fixed Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-surface">
        {/* Dynamic Canvas Stars Layer */}
        <CosmicCanvas />
        
        {/* Background Atmosphere Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-[position:center_25%] bg-no-repeat opacity-[0.38] mix-blend-screen transition-all duration-700"
          style={{ 
            backgroundImage: `url('https://lh3.googleusercontent.com/aida/AP1WRLsyOHph5_KKGunsoVar7BfKJK2O3eHY_HU49D_MNDWVacaSxHfd9JFgpXfINDEyxUJNl0wN0RQU8O4f74nQHL4j0Z5PLYQY-pvr2p2mislp2b1JXm-_jmR1mMaKAIAbIhTZQg1IutOfxPyakSUN_3jhkQw5w4uox2y7r9b37ZjG68sltz6xU0i3KFmk9ELKlSLx6pdQeAnyhGYsjK27rdJhX-YhOHGRCPTYvqdhY4098ERiVZQIkT5AIQc')` 
          }}
        />
        
        {/* Ambient Gradients \& Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface/30 via-surface/70 to-surface/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,13,28,0.85)_100%)]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        
        {/* Header Section */}
        <header 
          className={`fixed z-50 transition-all duration-500 ease-out ${
            isScrolled 
              ? "top-1 sm:top-1.5 left-1/2 -translate-x-1/2 w-[92%] sm:w-[94%] max-w-7xl rounded-full border border-white/15 bg-[#050714] shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(255,215,0,0.06)]" 
              : "top-0 left-0 w-full border-b border-white/5 bg-surface/20 backdrop-blur-2xl"
          }`}
        >
          <div className={`transition-all duration-500 ${isScrolled ? "px-6 sm:px-10 lg:px-12" : "max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12"}`}>
            <div className={`flex items-center gap-8 justify-between transition-all duration-500 ${
              isScrolled 
                ? "h-[56px] sm:h-[64px] lg:h-[70px]" 
                : "h-[68px] sm:h-[80px] lg:h-[90px]"
            }`}>
              
              {/* Logo */}
              <div 
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex-shrink-0 cursor-pointer group"
                id="header-logo"
              >
                <Logo variant="header" scrolled={isScrolled} className="group-hover:opacity-90 transition-all duration-300 transform group-hover:scale-[1.01]" />
              </div>

              {/* Action Buttons & Status Indicator */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="hidden md:flex items-center hover:scale-105 transition-transform duration-500 cursor-pointer">
                  <div className="flex items-center gap-3 px-6 py-2.5 rounded-full border border-gold-400/20 bg-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(255,215,0,0.05)] hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] hover:border-gold-400/40 transition-all duration-500">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-400" />
                    </span>
                    <span className="text-xs font-body font-semibold tracking-[0.25em] uppercase text-white/60">Status:</span>
                    <span className="text-sm font-serif-sub italic text-gold-300 tracking-wider font-light">Upcoming Soon</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="relative min-h-[80vh] flex items-center overflow-hidden z-10 pt-20 sm:pt-24 lg:pt-28 pb-4 sm:pb-6 lg:pb-8" id="hero-section">
          <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              
              {/* Left Content Column */}
              <div className="lg:col-span-7 xl:col-span-6 text-center lg:text-left relative z-20 flex flex-col justify-center">
                
                {/* Coming Soon Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-400/30 bg-gold-400/5 text-gold-300 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-4 sm:mb-6 shadow-[0_0_20px_rgba(255,215,0,0.1)] backdrop-blur-md mx-auto lg:mx-0 w-fit">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-400" />
                  Coming Soon
                </div>

                {/* Big Heading */}
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.25] tracking-wider mb-5 drop-shadow-2xl text-white uppercase">
                  The Future of <br />
                  <span className="font-heading text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-200 to-gold-400 relative inline-block pb-1 font-bold tracking-widest">
                    Astrology
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-gold-400/50 via-gold-400/80 to-transparent" />
                  </span> <br className="hidden sm:block" />
                  &amp; Spiritual <br /> Wisdom
                  <span className="font-serif-sub font-light italic text-white/80 text-xl sm:text-2xl lg:text-3xl block mt-3 normal-case tracking-wider">
                    is manifesting...
                  </span>
                </h1>

                {/* Paragraph */}
                <p className="text-sm sm:text-base lg:text-lg font-body font-light mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed text-white/70 drop-shadow-lg">
                  Experience India's most advanced platform for cosmic wisdom, natal diagram projections and custom Vedic charts. Join our exclusive waitlist today to secure early access and special founding member benefits.
                </p>

                {/* Waitlist Form */}
                <div className="w-full max-w-lg mx-auto lg:mx-0 mb-6">
                  <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full sm:flex-grow px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-gold-400/50 focus:border-gold-400/50 transition-all font-body text-sm backdrop-blur-2xl shadow-inner"
                      placeholder="Enter email address"
                    />
                    <button
                      type="submit"
                      disabled={waitlistLoading}
                      className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 text-indigo-950 font-bold text-sm flex items-center justify-center gap-2 btn-glow whitespace-nowrap uppercase tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-50"
                    >
                      {waitlistLoading ? "Joining..." : "Join Waitlist"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Submission Status Alert */}
                  {waitlistStatus && (
                    <div className={`mt-4 p-4 rounded-2xl border text-sm flex items-start gap-3 backdrop-blur-xl ${
                      waitlistStatus.success 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                    }`}>
                      {waitlistStatus.success ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /> : null}
                      <div>
                        <p className="font-semibold">{waitlistStatus.message}</p>
                        {waitlistStatus.position && (
                          <p className="text-xs text-white/60 mt-1 font-mono">
                            Stellar Queue Position: <span className="text-gold-300 font-bold">#{waitlistStatus.position}</span> out of {waitlistStatus.totalCount} members
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>



              </div>

              {/* Right Graphical Column (Celestial Orbits Mock) */}
              <div className="lg:col-span-5 xl:col-span-6 relative flex justify-center items-center h-[260px] sm:h-[320px] lg:h-full z-10 pointer-events-none mb-4 lg:mb-0">
                <div className="relative w-full aspect-square max-w-[220px] sm:max-w-[280px] lg:max-w-[360px]">
                  
                  {/* Center glowing sun core */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-gold-400 via-amber-500 to-orange-600 shadow-[0_0_60px_rgba(255,215,0,0.35)] sm:shadow-[0_0_90px_rgba(255,215,0,0.45)] animate-pulse relative">
                      <div className="absolute inset-0 rounded-full border border-white/20 scale-110" />
                    </div>
                  </div>

                  {/* Orbital ring 1 */}
                  <div className="absolute inset-0 border-[0.5px] border-gold-400/20 rounded-full animate-spin-slow">
                    <div className="absolute top-0 left-1/2 w-2.5 h-2.5 bg-blue-300 rounded-full shadow-[0_0_20px_rgba(147,197,253,0.9)] -translate-x-1/2 -translate-y-1/2" />
                  </div>

                  {/* Orbital ring 2 */}
                  <div className="absolute inset-6 sm:inset-9 border-[0.5px] border-dashed border-amethyst-600/30 rounded-full animate-spin-reverse-slow">
                    <div className="absolute bottom-1/4 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-purple-300 rounded-full shadow-[0_0_25px_rgba(216,180,254,0.9)] translate-x-1/2" />
                  </div>

                  {/* Orbital ring 3 */}
                  <div className="absolute inset-12 sm:inset-18 border-[0.5px] border-white/10 rounded-full animate-spin-slow" style={{ animationDuration: "55s" }}>
                    <div className="absolute top-1/3 left-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gold-300 rounded-full shadow-[0_0_15px_rgba(253,224,71,0.9)] -translate-x-1/2" />
                  </div>

                  {/* Floating element glows overlays */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 sm:w-60 sm:h-60 bg-indigo-600/10 rounded-full blur-[80px] animate-float" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 sm:w-60 sm:h-60 bg-amethyst-600/10 rounded-full blur-[80px] animate-float-delayed" />
                </div>
              </div>

            </div>
          </div>
        </main>

        <CelestialDivider />
        
        {/* Six Ways to Get Life Answers Section - Coming Soon Services */}
        <section className="py-3 sm:py-4 lg:py-6 relative z-10 w-full" id="services-soon-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-9 border-gradient shadow-[0_16px_60px_rgba(0,0,0,0.4)]">
              
              <div className="text-center mb-6 sm:mb-8">
                <span className="text-white/45 font-body tracking-[0.25em] text-[10px] sm:text-xs font-semibold uppercase block mb-2">
                  Ancient Wisdom • Modern Precision
                </span>
                <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold tracking-wider text-white max-w-2xl mx-auto leading-normal uppercase">
                  Six gateways to decode your destiny
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mx-auto">
                {/* Card 1: Daily Horoscope */}
                <div className="relative group overflow-hidden rounded-xl border border-white/5 bg-slate-950/40 p-5 sm:p-6 transition-all duration-500 hover:border-gold-400/30 hover:bg-slate-950/60 hover:-translate-y-1 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
                  {/* Subtle background colored glow matching the brand design */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none group-hover:bg-indigo-500/15 transition-all duration-500" />
                  
                  {/* Icon Container */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 mb-4 group-hover:scale-105 transition-transform duration-500 shadow-lg">
                    <Compass className="w-5 h-5" />
                  </div>
                  
                  <h3 className="font-serif-sub text-lg sm:text-xl font-bold text-white tracking-wide mb-1.5 group-hover:text-gold-300 transition-colors">
                    Daily Horoscope
                  </h3>
                  <p className="text-xs sm:text-sm text-white/50 font-body font-light leading-relaxed">
                    Your personalised daily star forecast.
                  </p>
                </div>

                {/* Card 2: Today Panchang */}
                <div className="relative group overflow-hidden rounded-xl border border-white/5 bg-slate-950/40 p-5 sm:p-6 transition-all duration-500 hover:border-gold-400/30 hover:bg-slate-950/60 hover:-translate-y-1 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
                  {/* Green/Emerald glow */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-500" />
                  
                  {/* Icon Container */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 mb-4 group-hover:scale-105 transition-transform duration-500 shadow-lg">
                    <Calendar className="w-5 h-5" />
                  </div>
                  
                  <h3 className="font-serif-sub text-lg sm:text-xl font-bold text-white tracking-wide mb-1.5 group-hover:text-gold-300 transition-colors">
                    Today Panchang
                  </h3>
                  <p className="text-xs sm:text-sm text-white/50 font-body font-light leading-relaxed">
                    Auspicious timings, tithi & nakshatra.
                  </p>
                </div>

                {/* Card 3: Free Kundli */}
                <div className="relative group overflow-hidden rounded-xl border border-white/5 bg-slate-950/40 p-5 sm:p-6 transition-all duration-500 hover:border-gold-400/30 hover:bg-slate-950/60 hover:-translate-y-1 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
                  {/* Pink/Rose glow */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-pink-500/5 blur-3xl pointer-events-none group-hover:bg-pink-500/15 transition-all duration-500" />
                  
                  {/* Icon Container */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-pink-500/10 border border-pink-400/20 text-pink-400 mb-4 group-hover:scale-105 transition-transform duration-500 shadow-lg">
                    <Disc className="w-5 h-5" />
                  </div>
                  
                  <h3 className="font-serif-sub text-lg sm:text-xl font-bold text-white tracking-wide mb-1.5 group-hover:text-gold-300 transition-colors">
                    Free Kundli
                  </h3>
                  <p className="text-xs sm:text-sm text-white/50 font-body font-light leading-relaxed">
                    Generate your birth chart in 30s.
                  </p>
                </div>

                {/* Card 4: Kundli Match */}
                <div className="relative group overflow-hidden rounded-xl border border-white/5 bg-slate-950/40 p-5 sm:p-6 transition-all duration-500 hover:border-gold-400/30 hover:bg-slate-950/60 hover:-translate-y-1 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
                  {/* Orange/Red glow */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-orange-500/5 blur-3xl pointer-events-none group-hover:bg-orange-500/15 transition-all duration-500" />
                  
                  {/* Icon Container */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-500/10 border border-orange-400/20 text-orange-400 mb-4 group-hover:scale-105 transition-transform duration-500 shadow-lg">
                    <Heart className="w-5 h-5" />
                  </div>
                  
                  <h3 className="font-serif-sub text-lg sm:text-xl font-bold text-white tracking-wide mb-1.5 group-hover:text-gold-300 transition-colors">
                    Kundli Match
                  </h3>
                  <p className="text-xs sm:text-sm text-white/50 font-body font-light leading-relaxed">
                    Compatibility scan, 36 gunas.
                  </p>
                </div>

                {/* Card 5: Compatibility */}
                <div className="relative group overflow-hidden rounded-xl border border-white/5 bg-slate-950/40 p-5 sm:p-6 transition-all duration-500 hover:border-gold-400/30 hover:bg-slate-950/60 hover:-translate-y-1 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
                  {/* Gold/Yellow glow */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-amber-500/5 blur-3xl pointer-events-none group-hover:bg-amber-500/15 transition-all duration-500" />
                  
                  {/* Icon Container */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 border border-amber-400/20 text-amber-400 mb-4 group-hover:scale-105 transition-transform duration-500 shadow-lg">
                    <GitCommit className="w-5 h-5" />
                  </div>
                  
                  <h3 className="font-serif-sub text-lg sm:text-xl font-bold text-white tracking-wide mb-1.5 group-hover:text-gold-300 transition-colors">
                    Compatibility
                  </h3>
                  <p className="text-xs sm:text-sm text-white/50 font-body font-light leading-relaxed">
                    Check your zodiac compatibility.
                  </p>
                </div>

                {/* Card 6: Talk to astrologer */}
                <div className="relative group overflow-hidden rounded-xl border border-white/5 bg-slate-950/40 p-5 sm:p-6 transition-all duration-500 hover:border-gold-400/30 hover:bg-slate-950/60 hover:-translate-y-1 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
                  {/* Cyan / Blue glow */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none group-hover:bg-cyan-500/15 transition-all duration-500" />
                  
                  {/* Icon Container */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 mb-4 group-hover:scale-105 transition-transform duration-500 shadow-lg">
                    <Phone className="w-5 h-5" />
                  </div>
                  
                  <h3 className="font-serif-sub text-lg sm:text-xl font-bold text-white tracking-wide mb-1.5 group-hover:text-gold-300 transition-colors">
                    Talk to astrologer
                  </h3>
                  <p className="text-xs sm:text-sm text-white/50 font-body font-light leading-relaxed">
                    Instant live call & chat consultation.
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        <CelestialDivider />

        {/* Value Prop Features Section */}
        <section className="py-3 sm:py-4 lg:py-6 relative z-10" id="value-prop-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-9 border-gradient shadow-[0_16px_60px_rgba(0,0,0,0.4)]">
              
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold mb-3 text-white tracking-widest uppercase">Why Jyotish9</h2>
                <p className="text-xs sm:text-sm lg:text-base text-white/60 max-w-2xl mx-auto font-body font-light leading-relaxed">
                  A revolutionary approach to cosmic guidance, blending millennia of Vedic astronomy with cutting-edge artificial intelligence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                
                {/* Pillar 1 */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 text-center hover-glow group border border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-surface-container to-surface-container-high rounded-lg flex items-center justify-center mb-5 border border-gold-400/20 group-hover:border-gold-400/50 transition-all duration-500 shadow-md group-hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                    <Zap className="w-6 h-6 text-gold-400 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="font-serif-sub text-base sm:text-lg lg:text-xl font-bold mb-2 text-white group-hover:text-gold-400 transition-colors">Precision Meets Intuition</h3>
                  <p className="text-white/60 leading-relaxed font-body text-xs sm:text-sm font-light">
                    Hyper-accurate astrological calculations combined with deep, intuitive interpretations for insights that truly resonate.
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 text-center hover-glow group border border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-surface-container to-surface-container-high rounded-lg flex items-center justify-center mb-5 border border-gold-400/20 group-hover:border-gold-400/50 transition-all duration-500 shadow-md group-hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                    <Monitor className="w-6 h-6 text-gold-400 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="font-serif-sub text-base sm:text-lg lg:text-xl font-bold mb-2 text-white group-hover:text-gold-400 transition-colors">Ancient Wisdom, Modern Tech</h3>
                  <p className="text-white/60 leading-relaxed font-body text-xs sm:text-sm font-light">
                    Vedic traditions empowered by state-of-the-art AI and modern interface design for a seamless spiritual journey.
                  </p>
                </div>

                {/* Pillar 3 */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 text-center hover-glow group border border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-surface-container to-surface-container-high rounded-lg flex items-center justify-center mb-5 border border-gold-400/20 group-hover:border-gold-400/50 transition-all duration-500 shadow-md group-hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                    <ShieldCheck className="w-6 h-6 text-gold-400 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="font-serif-sub text-base sm:text-lg lg:text-xl font-bold mb-2 text-white group-hover:text-gold-400 transition-colors">Verified Global Experts</h3>
                  <p className="text-white/60 leading-relaxed font-body text-xs sm:text-sm font-light">
                    Access an elite network of rigorously vetted astrologers, numerologists, and spiritual guides from around the world.
                  </p>
                </div>

              </div>

            </div>
          </div>
        </section>

        <CelestialDivider />

        {/* Benefits Section */}
        <section className="py-3 sm:py-4 lg:py-6 relative z-10" id="benefits-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-9 border-gradient shadow-[0_16px_60px_rgba(48,63,159,0.2)]">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                
                <div className="text-center md:text-left">
                  <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-medium mb-4 tracking-wider leading-tight uppercase text-white/95">
                    Secure Your <br />
                    <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-gold-400 tracking-widest">
                      Celestial Advantage
                    </span>
                  </h2>
                  <p className="text-white/70 font-body text-xs sm:text-sm lg:text-base font-light leading-relaxed mb-6">
                    Join the founding waitlist today and unlock exclusive celestial privileges reserved only for early cosmic pioneers.
                  </p>
                  <div className="inline-flex items-center gap-2.5 text-gold-400 font-body font-medium text-xs bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-gold-400/20 shadow-inner">
                    <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
                    Limited Founding Member Spots Remaining
                  </div>
                </div>

                <div className="space-y-3">
                  
                  {/* Benefit 1 */}
                  <div className="flex items-center gap-4 bg-white/5 backdrop-blur-2xl p-4 rounded-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:border-gold-400/40 hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-500 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-gold-400/10 to-amber-600/10 flex items-center justify-center border border-gold-400/20 group-hover:border-gold-400/50 transition-all duration-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gold-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Sparkles className="w-5.5 h-5.5 text-gold-400 relative z-10" />
                    </div>
                    <div>
                      <h4 className="font-serif-sub text-base sm:text-lg font-bold text-white group-hover:text-gold-400 transition-colors">Founding Member Badge</h4>
                      <p className="text-xs text-white/50 font-body mt-0.5 font-light">Exclusive profile recognition</p>
                    </div>
                  </div>

                  {/* Benefit 2 */}
                  <div className="flex items-center gap-4 bg-white/5 backdrop-blur-2xl p-4 rounded-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:border-gold-400/40 hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-500 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-gold-400/10 to-amber-600/10 flex items-center justify-center border border-gold-400/20 group-hover:border-gold-400/50 transition-all duration-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gold-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Clock className="w-5.5 h-5.5 text-gold-400 relative z-10" />
                    </div>
                    <div>
                      <h4 className="font-serif-sub text-base sm:text-lg font-bold text-white group-hover:text-gold-400 transition-colors">First Session Free</h4>
                      <p className="text-xs text-white/50 font-body mt-0.5 font-light">Complimentary 15-min consultation</p>
                    </div>
                  </div>

                  {/* Benefit 3 */}
                  <div className="flex items-center gap-4 bg-white/5 backdrop-blur-2xl p-4 rounded-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:border-gold-400/40 hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-500 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-gold-400/10 to-amber-600/10 flex items-center justify-center border border-gold-400/20 group-hover:border-gold-400/50 transition-all duration-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gold-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <ArrowUp className="w-5.5 h-5.5 text-gold-400 relative z-10" />
                    </div>
                    <div>
                      <h4 className="font-serif-sub text-base sm:text-lg font-bold text-white group-hover:text-gold-400 transition-colors">Priority Access</h4>
                      <p className="text-xs text-white/50 font-body mt-0.5 font-light">Immediate connection with elite experts</p>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>

        <CelestialDivider />

        {/* Footer */}
        <footer className="bg-surface-lowest/80 backdrop-blur-xl py-8 border-t border-white/5 text-center relative z-10" id="footer-section">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-5">
            <div className="opacity-85 hover:opacity-100 transition-all duration-500 transform hover:scale-[1.01] cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Logo variant="footer" className="mx-auto" />
            </div>
            <p className="font-body text-[10px] text-white/40 tracking-[0.2em] uppercase font-light">
              &copy; {new Date().getFullYear()} Jyotish9. All rights reserved. Precision Vedic Alignments &amp; AI spiritual guidance.
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
