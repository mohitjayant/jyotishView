import React, { useState } from "react";
import { 
  Sparkles, 
  Moon, 
  Sun, 
  MapPin, 
  Calendar, 
  Clock, 
  Heart, 
  Award, 
  Tv, 
  Flame, 
  Droplet, 
  Wind, 
  Mountain, 
  ChevronRight, 
  Wand2, 
  RefreshCw,
  User
} from "lucide-react";
import { KundliChart, Placement } from "../types";

const ZODIAC_SIGNS = [
  { name: "Aries", sanskrit: "Mesha", english: "The Ram", element: "Fire", symbol: "♈", dates: "Mar 21 - Apr 19" },
  { name: "Taurus", sanskrit: "Vrishabha", english: "The Bull", element: "Earth", symbol: "♉", dates: "Apr 20 - May 20" },
  { name: "Gemini", sanskrit: "Mithuna", english: "The Twins", element: "Air", symbol: "♊", dates: "May 21 - Jun 20" },
  { name: "Cancer", sanskrit: "Karka", english: "The Crab", element: "Water", symbol: "♋", dates: "Jun 21 - Jul 22" },
  { name: "Leo", sanskrit: "Simha", english: "The Lion", element: "Fire", symbol: "♌", dates: "Jul 23 - Aug 22" },
  { name: "Virgo", sanskrit: "Kanya", english: "The Maiden", element: "Earth", symbol: "♍", dates: "Aug 23 - Sep 22" },
  { name: "Libra", sanskrit: "Tula", english: "The Scales", element: "Air", symbol: "♎", dates: "Sep 23 - Oct 22" },
  { name: "Scorpio", sanskrit: "Vrishchika", english: "The Scorpion", element: "Water", symbol: "♏", dates: "Oct 23 - Nov 21" },
  { name: "Sagittarius", sanskrit: "Dhanu", english: "The Archer", element: "Fire", symbol: "♐", dates: "Nov 22 - Dec 21" },
  { name: "Capricorn", sanskrit: "Makara", english: "The Sea-Goat", element: "Earth", symbol: "♑", dates: "Dec 22 - Jan 19" },
  { name: "Aquarius", sanskrit: "Kumbha", english: "The Water Bearer", element: "Air", symbol: "♒", dates: "Jan 20 - Feb 18" },
  { name: "Pisces", sanskrit: "Meena", english: "The Fishes", element: "Water", symbol: "♓", dates: "Feb 19 - Mar 20" },
];

const CATEGORIES = [
  { id: "General", label: "General Alignment", color: "from-gold-400 to-amber-500" },
  { id: "Career", label: "Career & Wealth", color: "from-blue-400 to-indigo-500" },
  { id: "Love", label: "Love & Harmony", color: "from-pink-400 to-rose-500" },
  { id: "Health", label: "Vitality & Prana", color: "from-emerald-400 to-teal-500" },
];

export default function HoroscopeDashboard() {
  const [activeTab, setActiveTab] = useState<"horoscope" | "kundli" | "matching">("horoscope");

  // Daily Horoscope state
  const [selectedSign, setSelectedSign] = useState("Aries");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [prediction, setPrediction] = useState("");
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionSource, setPredictionSource] = useState("");

  // Kundli Birth Chart state
  const [birthName, setBirthName] = useState("");
  const [birthDate, setBirthDate] = useState("1998-06-15");
  const [birthTime, setBirthTime] = useState("08:30");
  const [birthLocation, setBirthLocation] = useState("New Delhi, India");
  const [kundliChart, setKundliChart] = useState<KundliChart | null>(null);
  const [kundliInterpretation, setKundliInterpretation] = useState("");
  const [kundliLoading, setKundliLoading] = useState(false);

  // Love Matching state
  const [partner1Sign, setPartner1Sign] = useState("Aries");
  const [partner2Sign, setPartner2Sign] = useState("Leo");
  const [matchingResult, setMatchingResult] = useState<{
    kootaPoints: number;
    maxPoints: number;
    percentage: number;
    guidance: string;
    elements: { partner1Element: string; partner2Element: string };
  } | null>(null);
  const [matchingLoading, setMatchingLoading] = useState(false);

  // Quick Action: Fetch Daily Horoscope
  const fetchHoroscope = async (signName = selectedSign, catName = selectedCategory) => {
    setPredictionLoading(true);
    setPrediction("");
    try {
      const response = await fetch("/api/horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sign: signName, category: catName }),
      });
      const data = await response.json();
      if (data.error) {
        setPrediction("The heavy astral clouds are blocking telemetry. Please try again later.");
      } else {
        setPrediction(data.prediction);
        setPredictionSource(data.source);
      }
    } catch {
      setPrediction("Unstable alignment. Please check connection to the cosmic servers.");
    } finally {
      setPredictionLoading(false);
    }
  };

  // Quick Action: Calculate Birth Chart
  const calculateBirthChart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthName.trim()) return;
    setKundliLoading(true);
    setKundliChart(null);
    setKundliInterpretation("");

    try {
      const response = await fetch("/api/kundli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: birthName,
          date: birthDate,
          time: birthTime,
          location: birthLocation,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setKundliChart(data.chart);
        setKundliInterpretation(data.interpretation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setKundliLoading(false);
    }
  };

  // Quick Action: Matchmake
  const triggerMatchmaking = async () => {
    setMatchingLoading(true);
    try {
      const response = await fetch("/api/matchmake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partner1: partner1Sign, partner2: partner2Sign }),
      });
      const data = await response.json();
      setMatchingResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setMatchingLoading(false);
    }
  };

  // Element Tag Color Helper
  const getElementIcon = (elem: string) => {
    switch (elem) {
      case "Fire": return <Flame className="w-4 h-4 text-orange-400" />;
      case "Water": return <Droplet className="w-4 h-4 text-blue-400" />;
      case "Air": return <Wind className="w-4 h-4 text-sky-300" />;
      case "Earth": return <Mountain className="w-4 h-4 text-amber-600" />;
      default: return <Sparkles className="w-4 h-4 text-gold-400" />;
    }
  };

  // Render North Indian Style Vedic Chart Diamond Layout (Dynamic SVG)
  // There are 12 houses. We will group placements by their calculated house (1 to 12).
  const renderVedicSVG = (chart: KundliChart) => {
    const housePlanets: Record<number, string[]> = {};
    for (let i = 1; i <= 12; i++) housePlanets[i] = [];

    chart.placements.forEach((p) => {
      housePlanets[p.house].push(p.key);
    });

    // Helper coordinates for placing planet labels nicely in triangles
    const planetPositionsInHouse: Record<number, { x: number; y: number }> = {
      1: { x: 150, y: 100 },
      2: { x: 75, y: 50 },
      3: { x: 50, y: 75 },
      4: { x: 100, y: 150 },
      5: { x: 50, y: 225 },
      6: { x: 75, y: 250 },
      7: { x: 150, y: 200 },
      8: { x: 225, y: 250 },
      9: { x: 250, y: 225 },
      10: { x: 200, y: 150 },
      11: { x: 250, y: 75 },
      12: { x: 225, y: 50 },
    };

    return (
      <div className="relative w-full max-w-[340px] aspect-square mx-auto bg-slate-950/60 p-4 rounded-2xl border border-gold-400/20 shadow-[0_0_50px_rgba(255,215,0,0.05)]">
        <svg viewBox="0 0 300 300" className="w-full h-full text-gold-400/80">
          {/* Border Square */}
          <rect x="10" y="10" width="280" height="280" fill="none" stroke="currentColor" strokeWidth="2.5" />
          
          {/* Diagonal Lines */}
          <line x1="10" y1="10" x2="290" y2="290" stroke="currentColor" strokeWidth="1.5" />
          <line x1="290" y1="10" x2="10" y2="290" stroke="currentColor" strokeWidth="1.5" />
          
          {/* Inner Diamond */}
          <polygon points="150,10 290,150 150,290 10,150" fill="none" stroke="currentColor" strokeWidth="2" />
          
          {/* House Labels & Planets */}
          {Object.keys(planetPositionsInHouse).map((houseStr) => {
            const h = parseInt(houseStr);
            const pos = planetPositionsInHouse[h];
            const planets = housePlanets[h];
            
            return (
              <g key={h}>
                {/* House numeric label */}
                <text 
                  x={pos.x} 
                  y={pos.y - 12} 
                  fontSize="9px" 
                  className="fill-gold-300/40 text-center font-mono select-none" 
                  textAnchor="middle"
                >
                  H{h}
                </text>
                
                {/* Planet names grouped inside triangle */}
                {planets.length > 0 ? (
                  <text 
                    x={pos.x} 
                    y={pos.y + 6} 
                    fontSize="11px" 
                    fontWeight="bold" 
                    className="fill-white font-mono select-none"
                    textAnchor="middle"
                  >
                    {planets.join(", ")}
                  </text>
                ) : (
                  <circle cx={pos.x} cy={pos.y + 2} r="1.5" className="fill-gold-400/30" />
                )}
              </g>
            );
          })}
        </svg>
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <span className="text-[10px] uppercase tracking-widest text-gold-400/60 font-mono">Vedic D-1 Rasi Chart</span>
        </div>
      </div>
    );
  };

  return (
    <div id="astro-dashboard" className="glass-panel rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-8 lg:p-10 border-gradient shadow-[0_20px_80px_rgba(0,0,0,0.6)] text-white w-full">
      {/* Dashboard Subheader Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-6">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight flex flex-wrap items-center gap-3">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-gold-400 animate-pulse" />
            Celestial Engine <span className="text-xs sm:text-sm font-body font-normal text-gold-300 bg-gold-400/10 px-3 py-1 rounded-full border border-gold-400/20 uppercase tracking-[0.14em] whitespace-nowrap">Beta Access</span>
          </h2>
          <p className="text-white/50 text-sm font-body font-light mt-2">
            Access Vedic chart visualizers, daily planetary alignments, and love synergy indexes.
          </p>
        </div>
        
        {/* Tab Selection */}
        <div className="flex bg-slate-950/60 rounded-full p-1 border border-white/10 w-full lg:w-auto overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setActiveTab("horoscope")}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === "horoscope"
                ? "bg-gradient-to-r from-gold-400 to-amber-500 text-indigo-950 shadow-[0_0_15px_rgba(255,215,0,0.35)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Sun className="w-4 h-4" />
            Zodiac Forecasts
          </button>
          
          <button
            onClick={() => setActiveTab("kundli")}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === "kundli"
                ? "bg-gradient-to-r from-gold-400 to-amber-500 text-indigo-950 shadow-[0_0_15px_rgba(255,215,0,0.35)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Moon className="w-4 h-4" />
            AI Kundli Birth Chart
          </button>
          
          <button
            onClick={() => setActiveTab("matching")}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === "matching"
                ? "bg-gradient-to-r from-gold-400 to-amber-500 text-indigo-950 shadow-[0_0_15px_rgba(255,215,0,0.35)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Heart className="w-4 h-4" />
            Love Matchmaking
          </button>
        </div>
      </div>

      {/* TAB CONTENTS */}

      {/* 1. Daily Zodiac tab */}
      {activeTab === "horoscope" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sign Grid selection */}
          <div className="lg:col-span-5 bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="font-heading text-lg font-medium text-gold-400 mb-4 flex items-center gap-2">
              <Sun className="w-5 h-5 text-gold-400" />
              Identify Your Astrological Sign
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {ZODIAC_SIGNS.map((sign) => (
                <button
                  key={sign.name}
                  onClick={() => {
                    setSelectedSign(sign.name);
                    fetchHoroscope(sign.name, selectedCategory);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-300 group relative overflow-hidden ${
                    selectedSign === sign.name
                      ? "bg-gold-400/10 border-gold-400 shadow-[0_0_15px_rgba(255,215,0,0.1)] text-gold-300"
                      : "bg-transparent border-white/10 text-white/70 hover:border-gold-400/40 hover:text-white"
                  }`}
                >
                  <span className="text-2xl mb-1 group-hover:scale-125 transition-transform duration-300">{sign.symbol}</span>
                  <span className="text-xs font-bold leading-tight tracking-wide">{sign.name}</span>
                  <span className="text-[9px] text-white/40 block mt-0.5">{sign.sanskrit}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Horoscope category and details display */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    fetchHoroscope(selectedSign, cat.id);
                  }}
                  className={`px-4 py-2 rounded-full border text-xs sm:text-sm font-semibold transition-all duration-350 ${
                    selectedCategory === cat.id
                      ? "bg-slate-900 border-gold-400 text-gold-300 shadow-[inset_0_1px_10px_rgba(255,215,0,0.1)]"
                      : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Display screen */}
            <div className="relative bg-slate-950/80 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-inner overflow-hidden min-h-[240px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold-400/5 rounded-full blur-[40px] pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">
                      {ZODIAC_SIGNS.find((s) => s.name === selectedSign)?.symbol}
                    </span>
                    <div>
                      <h4 className="font-heading text-xl font-medium text-white flex items-center gap-2">
                        {selectedSign} <span className="text-sm font-normal text-white/50">({ZODIAC_SIGNS.find((s) => s.name === selectedSign)?.sanskrit})</span>
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-white/40 font-mono tracking-wider">
                          {ZODIAC_SIGNS.find((s) => s.name === selectedSign)?.dates}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <span className="text-[10px] font-semibold text-gold-400 tracking-wider uppercase flex items-center gap-1 font-mono">
                          {getElementIcon(ZODIAC_SIGNS.find((s) => s.name === selectedSign)?.element || "")}
                          {ZODIAC_SIGNS.find((s) => s.name === selectedSign)?.element}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs bg-gold-400/10 text-gold-300 font-mono py-1 px-3 rounded-full border border-gold-400/20">
                    Category: {selectedCategory}
                  </span>
                </div>

                {predictionLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                    <RefreshCw className="w-8 h-8 text-gold-400 animate-spin" />
                    <p className="text-sm font-body font-light text-white/50 animate-pulse">Channels aligned. Consulting the oracle...</p>
                  </div>
                ) : prediction ? (
                  <p className="text-white/80 font-body text-base font-light leading-relaxed whitespace-pre-wrap">
                    {prediction}
                  </p>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                    <Sparkles className="w-10 h-10 text-gold-400/40" />
                    <div>
                      <p className="text-white/60 font-body font-light text-sm">
                        Select a Zodiac Sign and choose target forecasting elements to reveal your customized cosmic trajectory.
                      </p>
                      <button 
                        onClick={() => fetchHoroscope()}
                        className="mt-4 px-6 py-2 rounded-full border border-gold-400/30 bg-gold-400/5 hover:bg-gold-400/10 text-gold-300 text-xs font-semibold uppercase tracking-widest transition-all"
                      >
                        Generate Divine Report
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {prediction && (
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40 font-mono">
                  <span>Forecast Generated successfully</span>
                  <span className="text-gold-400/70">Source: {predictionSource}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Kundli & Birth Chart tab */}
      {activeTab === "kundli" && (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form Column */}
            <div className="lg:col-span-5 bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
              <form onSubmit={calculateBirthChart} className="space-y-4">
                <h3 className="font-heading text-xl font-medium text-gold-400 mb-2 flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Kundli Vital Parameters
                </h3>
                
                <div>
                  <label className="block text-xs font-body font-semibold tracking-wider text-white/60 uppercase mb-2">Subject Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      required
                      value={birthName}
                      onChange={(e) => setBirthName(e.target.value)}
                      placeholder="e.g. Mohit Sharma"
                      className="w-full pl-11 pr-4 py-3 rounded-full bg-slate-950/40 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-gold-400/40 focus:border-gold-400/40 transition-all font-body text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body font-semibold tracking-wider text-white/60 uppercase mb-2">Birth Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-white/30 cursor-pointer" />
                      <input
                        type="date"
                        required
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-full bg-slate-950/40 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-gold-400/40 focus:border-gold-400/40 transition-all font-body text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-body font-semibold tracking-wider text-white/60 uppercase mb-2">Exact Time</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-3.5 w-4 h-4 text-white/30 cursor-pointer" />
                      <input
                        type="time"
                        required
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-full bg-slate-950/40 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-gold-400/40 focus:border-gold-400/40 transition-all font-body text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-body font-semibold tracking-wider text-white/60 uppercase mb-2">Place of Birth (City)</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      value={birthLocation}
                      onChange={(e) => setBirthLocation(e.target.value)}
                      placeholder="e.g. Chennai, Tamil Nadu"
                      className="w-full pl-11 pr-4 py-3 rounded-full bg-slate-950/40 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-gold-400/40 focus:border-gold-400/40 transition-all font-body text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={kundliLoading}
                  className="w-full mt-4 py-3 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 hover:opacity-90 text-indigo-950 font-bold text-xs uppercase tracking-widest transition-all btn-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {kundliLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Plotting Stellar Nodes...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Plot & Analyze Kundli
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 border-t border-white/10 pt-4 text-xs text-white/40 leading-relaxed font-body font-light">
                * Note: Vedic Astrological calculation employs Lahiri Ayanamsa to align zodiac parameters accurately with dynamic precession values.
              </div>
            </div>

            {/* Visualizer and AI interpretation column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {kundliLoading ? (
                <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center bg-slate-950/40 border border-white/10 rounded-2xl p-8 gap-4 text-center">
                  <RefreshCw className="w-12 h-12 text-gold-400 animate-spin" />
                  <div>
                    <h4 className="font-heading text-lg font-medium text-white animate-pulse">Calculating Rasi Houses</h4>
                    <p className="text-sm font-body font-light text-white/50 mt-1 max-w-sm">
                      Our system is drawing the natal diamond lattices, calculating planet degrees, and aligning our Gemini AI model...
                    </p>
                  </div>
                </div>
              ) : kundliChart ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950/30 p-6 rounded-2xl border border-white/10">
                  {/* Left SVG Chart Column */}
                  <div className="md:col-span-5 flex flex-col justify-center">
                    {renderVedicSVG(kundliChart)}
                  </div>

                  {/* Right Alignments Panel */}
                  <div className="md:col-span-7 space-y-4">
                    <h4 className="font-heading text-lg font-medium text-gold-400">Nativity Placements</h4>
                    <div className="max-h-[280px] overflow-y-auto space-y-2 pr-2 font-mono scrollbar-thin scrollbar-thumb-white/10">
                      {kundliChart.placements.map((p: Placement) => (
                        <div key={p.name} className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg text-xs hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="text-gold-300 font-bold">{p.symbol}</span>
                            <span className="text-white/90 font-semibold">{p.name}</span>
                          </div>
                          <div className="text-right text-white/60">
                            <span className="text-gold-400/90">{p.sign}</span> 
                            <span className="text-[10px] text-white/30 block">H{p.house} · {p.nakshatra} (P{p.pada})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 min-h-[340px] flex flex-col items-center justify-center bg-slate-950/40 border border-white/10 rounded-2xl p-8 text-center gap-4">
                  <Moon className="w-12 h-12 text-gold-400/20" />
                  <div>
                    <h4 className="font-heading text-lg font-semibold text-white/80">No Natal Chart Active</h4>
                    <p className="text-sm text-white/50 max-w-md font-body font-light mt-1">
                      Enter your precise birth variables to render a beautiful D1 Kundli planetary vector representation and fetch custom AI interpretations based on your spiritual blueprint.
                    </p>
                  </div>
                </div>
              )}

              {/* Interpretation Block */}
              {kundliChart && kundliInterpretation && (
                <div className="bg-gradient-to-br from-indigo-950/30 to-slate-950/60 p-6 rounded-2xl border border-gold-400/10 shadow-lg space-y-4">
                  <h4 className="font-heading text-xl font-medium text-gold-400 flex items-center gap-2 border-b border-gold-400/10 pb-2">
                    <Sparkles className="w-5 h-5 text-gold-300 animate-pulse" />
                    Jyotish AI Soul Insights
                  </h4>
                  <div className="text-white/80 font-body text-sm font-light leading-relaxed whitespace-pre-wrap space-y-3">
                    {kundliInterpretation}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Kundli Mashmaking tab */}
      {activeTab === "matching" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Selections Panel */}
          <div className="lg:col-span-5 bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6">
            <h3 className="font-heading text-lg font-medium text-gold-400 border-b border-white/5 pb-2">
              Ashta Koota Matching Parameters
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-body font-semibold tracking-wider text-white/60 uppercase mb-2">Partner A Zodiac Sign</label>
                <select
                  value={partner1Sign}
                  onChange={(e) => setPartner1Sign(e.target.value)}
                  className="w-full px-4 py-3 rounded-full bg-slate-950 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-gold-400/40 font-body text-sm select-auto"
                >
                  {ZODIAC_SIGNS.map((s) => (
                    <option key={s.name} value={s.name} className="bg-slate-900 text-white">{s.symbol} {s.name} ({s.sanskrit})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-body font-semibold tracking-wider text-white/60 uppercase mb-2">Partner B Zodiac Sign</label>
                <select
                  value={partner2Sign}
                  onChange={(e) => setPartner2Sign(e.target.value)}
                  className="w-full px-4 py-3 rounded-full bg-slate-950 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-gold-400/40 font-body text-sm select-auto"
                >
                  {ZODIAC_SIGNS.map((s) => (
                    <option key={s.name} value={s.name} className="bg-slate-900 text-white">{s.symbol} {s.name} ({s.sanskrit})</option>
                  ))}
                </select>
              </div>

              <button
                onClick={triggerMatchmaking}
                disabled={matchingLoading}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 text-indigo-950 font-bold text-xs uppercase tracking-widest transition-all btn-glow cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {matchingLoading ? "Aligning Synastry Nodes..." : "Calculate Cosmic Compatibility"}
              </button>
            </div>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {matchingLoading ? (
              <div className="bg-slate-950/80 p-12 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]">
                <RefreshCw className="w-10 h-10 text-gold-400 animate-spin" />
                <p className="text-sm font-body font-light text-white/60">Interlocking Lunar houses and calculating Koota points...</p>
              </div>
            ) : matchingResult ? (
              <div className="bg-slate-950/80 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-lg space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/5 pb-4 mb-4 gap-4">
                  <div>
                    <h4 className="font-heading text-2xl font-semibold text-white">Synergy Matrix Result</h4>
                    <p className="text-xs font-body text-white/40 mt-1 font-light">Calculated out of 36 vital astrological points</p>
                  </div>
                  
                  {/* Circular visual score */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 flex items-center justify-center bg-gold-400/10 rounded-full border border-gold-400/30 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                      <span className="text-lg font-heading font-bold text-gold-400">{matchingResult.kootaPoints}</span>
                      <span className="text-[8px] text-white/40 absolute bottom-1.5 font-mono">/ 36 pts</span>
                    </div>
                  </div>
                </div>

                {/* Score percentage progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-white/50">Overall Harmony Metric</span>
                    <span className="text-gold-400 font-bold">{matchingResult.percentage}% Compatible</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
                    <div 
                      className="bg-gradient-to-r from-gold-400 via-amber-500 to-rose-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${matchingResult.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Element Match badges */}
                <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-950/50 flex items-center justify-center border border-white/10 text-xs">A</div>
                    <div>
                      <span className="text-xs text-white/40 block font-light">Element A</span>
                      <span className="text-xs font-semibold text-white flex items-center gap-1 font-mono">
                        {getElementIcon(matchingResult.elements.partner1Element)}
                        {matchingResult.elements.partner1Element}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-950/50 flex items-center justify-center border border-white/10 text-xs">B</div>
                    <div>
                      <span className="text-xs text-white/40 block font-light">Element B</span>
                      <span className="text-xs font-semibold text-white flex items-center gap-1 font-mono">
                        {getElementIcon(matchingResult.elements.partner2Element)}
                        {matchingResult.elements.partner2Element}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Matchmaking guidance description */}
                <div className="bg-white/5 p-5 rounded-xl border border-gold-400/10 flex items-start gap-4">
                  <Heart className="w-5 h-5 text-rose-400 flex-shrink-0 mt-1" />
                  <div className="space-y-1">
                    <h5 className="font-heading text-lg text-white font-medium">Celestial Dynamics</h5>
                    <p className="text-sm text-white/70 font-body font-light leading-relaxed">
                      {matchingResult.guidance}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center bg-slate-950/40 border border-white/10 rounded-2xl p-8 text-center gap-4">
                <Heart className="w-12 h-12 text-gold-400/10" />
                <div>
                  <h4 className="font-heading text-lg font-semibold text-white/80">Measure Celestial Affinity</h4>
                  <p className="text-sm text-white/50 max-w-sm font-body font-light mt-1">
                    Select your and your companion's Zodiac signs to evaluate Moon compatibility nodes and forecast interpersonal harmony paths.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
