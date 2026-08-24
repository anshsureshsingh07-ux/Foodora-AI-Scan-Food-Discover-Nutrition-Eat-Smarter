import React, { useState, useEffect } from "react";
import { useFood } from "../../context/FoodContext";
import { soundFx } from "../../utils/soundEffects";
import { CommandPaletteModal } from "./CommandPaletteModal";
import { CreatorsDeskModal } from "./CreatorsDeskModal";
import { RobotConfirmationModal, CompactRamenCountdown } from "../home/RamenWeekBanner";
import {
  Camera,
  Search,
  Barcode,
  FileText,
  Sparkles,
  Heart,
  Calendar,
  Layers,
  Globe,
  Users,
  Building2,
  BookOpen,
  Menu,
  X,
  Sun,
  Moon,
  TrendingUp,
  Image as ImageIcon,
  Flame,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  ChefHat,
  Volume2,
  VolumeX,
  Command,
  Headphones,
  Music,
  User,
  Skull,
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setIsScanModalOpen,
    setIsBarcodeModalOpen,
    setIsLabelModalOpen,
    setIsAskDrawerOpen,
    comparisonItems,
    isDarkMode,
    toggleDarkMode,
    isBrainrotMode,
    toggleBrainrotMode,
    todayLogs,
  } = useFood();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDevNoticeDismissed, setIsDevNoticeDismissed] = useState(false);
  const [isDevNoticeExpanded, setIsDevNoticeExpanded] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCreatorsDeskOpen, setIsCreatorsDeskOpen] = useState(false);
  const [isRobotModalOpen, setIsRobotModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => soundFx.getIsMuted());
  const [isLoFiPlaying, setIsLoFiPlaying] = useState(() => soundFx.getIsLoFiPlaying());

  const handleToggleBrainrot = () => {
    soundFx.playAuraChime();
    toggleBrainrotMode();
  };

  // Listen for Cmd+K or Ctrl+K globally
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const handleToggleSound = () => {
    const newMuted = soundFx.toggleMute();
    setIsMuted(newMuted);
  };

  const handleToggleLoFi = () => {
    soundFx.playPop();
    const isNowPlaying = soundFx.toggleLoFiAmbience();
    setIsLoFiPlaying(isNowPlaying);
  };

  const handleNavClick = (view: string) => {
    soundFx.playPop();
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      soundFx.playPop();
      setCurrentView("database");
    }
  };

  const totalCaloriesToday = todayLogs.reduce((sum, log) => sum + log.calories, 0);

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full flex flex-col shadow-sm">
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      <CreatorsDeskModal
        isOpen={isCreatorsDeskOpen}
        onClose={() => setIsCreatorsDeskOpen(false)}
      />

      <RobotConfirmationModal
        isOpen={isRobotModalOpen}
        onClose={() => setIsRobotModalOpen(false)}
      />

      {/* 0. Special Global Ramen Week (24 to 31 August 2026) Celebration Banner */}
      <div
        id="ramen-week-top-bar"
        className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-950 dark:via-orange-950 dark:to-rose-950 text-white text-xs px-3 sm:px-6 py-2 border-b border-amber-500/30 flex items-center justify-between gap-2 shadow-xs select-none"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white font-bold text-xs">
              🍜
            </span>
            <div className="flex items-center gap-2 truncate">
              <strong className="font-black uppercase tracking-wider bg-white/25 dark:bg-amber-900/80 px-2 py-0.5 rounded text-[10px] shadow-xs">
                Ramen Week: 24 to 31 August
              </strong>
              <span className="hidden md:inline text-[11px] sm:text-xs font-medium text-amber-100 truncate">
                Explore 3D Artisanal Broths & verify you're human!
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Real-time Countdown Timer Badge in Header */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/25 border border-white/15 text-[11px]">
              <span className="text-amber-300 font-bold">Ends in:</span>
              <CompactRamenCountdown />
            </div>

            <button
              type="button"
              onClick={() => {
                soundFx.playPop();
                setIsRobotModalOpen(true);
              }}
              className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-amber-950 font-black text-[11px] flex items-center gap-1 shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Cpu className="w-3 h-3 text-amber-600" />
              <span>Robot Check & Survey</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Real-time Under Active Development Notice Bar */}
      {!isDevNoticeDismissed && (
        <div
          id="dev-status-banner"
          className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 dark:from-amber-950/90 dark:via-orange-950/90 dark:to-amber-900/90 text-white dark:text-amber-200 text-xs px-3 sm:px-6 py-2 border-b border-amber-600/30 dark:border-amber-700/40 transition-all duration-300"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white/20 dark:bg-amber-500/20 text-white dark:text-amber-300">
                <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
              </span>
              <p className="text-[11px] sm:text-xs font-medium truncate">
                <strong className="font-extrabold uppercase tracking-wider bg-white/20 dark:bg-amber-900/60 px-1.5 py-0.5 rounded text-[10px] mr-1.5">
                  Live Preview
                </strong>
                Nutrimania is actively under development — UI, features & database changes may occur continuously.
              </p>
              <button
                type="button"
                onClick={() => setIsDevNoticeExpanded(!isDevNoticeExpanded)}
                className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold underline underline-offset-2 hover:opacity-80 cursor-pointer ml-2 text-white dark:text-amber-300"
              >
                <span>{isDevNoticeExpanded ? "Hide Details" : "Learn More"}</span>
                {isDevNoticeExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/20 dark:bg-black/40 text-[10px] font-mono font-bold">
                <Cpu className="w-3 h-3 text-amber-300" />
                Nutrimania AI
              </span>
              <button
                type="button"
                onClick={() => setIsDevNoticeDismissed(true)}
                className="p-1 hover:bg-black/20 rounded-md transition-colors cursor-pointer text-white/90 hover:text-white"
                title="Dismiss banner"
                aria-label="Dismiss development notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {isDevNoticeExpanded && (
            <div className="max-w-7xl mx-auto pt-2 pb-1 text-[11px] text-amber-100 dark:text-amber-300/90 border-t border-white/20 dark:border-amber-800/40 mt-1.5 leading-relaxed">
              <p>
                🚧 You are exploring <strong>Nutrimania</strong>, created and developed by <strong>Ansh Singh</strong>. Multimodal computer vision models, nutrient estimation algorithms, OCR parsers, recipe generation pipelines, and database records are receiving frequent updates.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. Main Navigation Bar with Frosted Glassmorphism */}
      <div className="w-full bg-white/75 dark:bg-slate-950/75 backdrop-blur-xl border-b border-white/40 dark:border-white/10 shadow-xs transition-colors">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo & Brand with NUTRIMANIA */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none flex-shrink-0"
            onClick={() => handleNavClick("home")}
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  Nutri<span className="text-emerald-600 dark:text-emerald-400">mania</span>
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                Discover Food. Understand Nutrition.
              </p>
            </div>
          </div>

          {/* Quick Spotlight Search Trigger (Cmd+K) */}
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden md:flex lg:flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 hover:border-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 text-xs font-medium transition-all max-w-[160px] lg:max-w-xs flex-1 cursor-pointer"
          >
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="truncate">Search foods...</span>
            <span className="ml-auto hidden xl:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
              ⌘K
            </span>
          </button>

          {/* Sleek Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <button
              onClick={() => handleNavClick("home")}
              className={`transition-all py-1 cursor-pointer ${
                currentView === "home"
                  ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-extrabold"
                  : "hover:text-emerald-600 dark:hover:text-emerald-400"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("recipes")}
              className={`transition-all py-1 cursor-pointer flex items-center gap-1.5 ${
                currentView === "recipes"
                  ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-extrabold"
                  : "hover:text-emerald-600 dark:hover:text-emerald-400"
              }`}
            >
              <ChefHat className="w-3.5 h-3.5 text-emerald-500" />
              <span>AI Recipes</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full font-extrabold">
                NEW
              </span>
            </button>
            <button
              onClick={() => handleNavClick("database")}
              className={`transition-all py-1 cursor-pointer ${
                currentView === "database"
                  ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-extrabold"
                  : "hover:text-emerald-600 dark:hover:text-emerald-400"
              }`}
            >
              Database
            </button>
            <button
              onClick={() => handleNavClick("meal-analyzer")}
              className={`transition-all py-1 cursor-pointer ${
                currentView === "meal-analyzer"
                  ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-extrabold"
                  : "hover:text-emerald-600 dark:hover:text-emerald-400"
              }`}
            >
              Analyzer
            </button>
            <button
              onClick={() => handleNavClick("partners")}
              className={`transition-all py-1 cursor-pointer ${
                currentView === "partners"
                  ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-extrabold"
                  : "hover:text-emerald-600 dark:hover:text-emerald-400"
              }`}
            >
              Partners
            </button>
            <button
              onClick={() => handleNavClick("dashboard")}
              className={`transition-all py-1 flex items-center gap-1.5 cursor-pointer ${
                currentView === "dashboard"
                  ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-extrabold"
                  : "hover:text-emerald-600 dark:hover:text-emerald-400"
              }`}
            >
              <span>Dashboard</span>
              {totalCaloriesToday > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5 text-amber-500" />
                  {totalCaloriesToday}
                </span>
              )}
            </button>
          </nav>

          {/* Action Triggers & Responsive Toggles */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Camera Scan Trigger */}
            <button
              id="header-scan-food-btn"
              onClick={() => {
                soundFx.playScanRadar();
                setIsScanModalOpen(true);
              }}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold shadow-sm shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
              title="Scan Food with Camera (Nutrimania AI)"
            >
              <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0" />
              <span className="hidden xs:inline sm:inline">Scan</span>
            </button>

            {/* Ask Nutrimania AI button (shown on sm+) */}
            <button
              id="header-ask-ai-btn"
              onClick={() => {
                soundFx.playPop();
                setIsAskDrawerOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 active:scale-95 rounded-full border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
              title="Ask Nutrimania AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Ask AI</span>
            </button>

            {/* Creator's Desk Trigger (wide desktop only) */}
            <button
              id="header-creator-desk-btn"
              onClick={() => {
                soundFx.playPop();
                setIsCreatorsDeskOpen(true);
              }}
              className="hidden 2xl:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100 dark:hover:bg-amber-900 active:scale-95 rounded-full border border-amber-200 dark:border-amber-800/80 transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
              title="Creator's Desk • Ansh Singh"
            >
              <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span>Creator's Desk</span>
            </button>

            {/* Brainrot Mode Quick Toggle (large desktop only) */}
            <button
              type="button"
              onClick={handleToggleBrainrot}
              className={`hidden xl:flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer whitespace-nowrap active:scale-95 flex-shrink-0 ${
                isBrainrotMode
                  ? "bg-purple-950/90 text-purple-200 border-purple-500/80 shadow-xs shadow-purple-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
              }`}
              title={isBrainrotMode ? "Switch to Corporate Nutritionist Mode" : "Switch to Brainrot Edition 🥦💀"}
            >
              <Skull className={`w-3.5 h-3.5 ${isBrainrotMode ? "text-purple-400 animate-pulse" : "text-slate-400"}`} />
              <span>{isBrainrotMode ? "Brainrot Active" : "Brainrot"}</span>
            </button>

            {/* Ambient Lo-Fi Audio Toggle (desktop only) */}
            <button
              type="button"
              onClick={handleToggleLoFi}
              className={`hidden lg:flex p-2 rounded-full transition-all border cursor-pointer items-center justify-center flex-shrink-0 relative ${
                isLoFiPlaying
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30 scale-105"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
              title={isLoFiPlaying ? "Pause Lo-Fi Kitchen Rain Ambience" : "Play Cozy Lo-Fi Kitchen & Cafe Ambience"}
              aria-label={isLoFiPlaying ? "Stop Lo-Fi Ambience" : "Start Lo-Fi Ambience"}
            >
              {isLoFiPlaying ? (
                <>
                  <Headphones className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                </>
              ) : (
                <Headphones className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Sound FX Mute/Unmute Toggle (desktop only) */}
            <button
              type="button"
              onClick={handleToggleSound}
              className={`hidden lg:flex p-2 rounded-full transition-colors border cursor-pointer items-center justify-center flex-shrink-0 ${
                !isMuted
                  ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
              title={isMuted ? "Unmute Audio FX (Pop & Success chimes)" : "Mute Audio FX"}
              aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
            </button>

            {/* Day / Night Theme Toggle */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={() => {
                soundFx.playPop();
                toggleDarkMode();
              }}
              className="p-2 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-center flex-shrink-0"
              aria-label={isDarkMode ? "Switch to Day / Light Mode" : "Switch to Night / Dark Mode"}
              title={isDarkMode ? "Switch to Day (Light Mode)" : "Switch to Night (Dark Mode)"}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform rotate-0 hover:-rotate-12" />
              )}
            </button>

            {/* Profile Avatar (hidden on tiny screens < 380px) */}
            <div
              onClick={() => handleNavClick("dashboard")}
              className="hidden sm:block w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-emerald-500 p-0.5 cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
              title="My Health Dashboard"
            >
              <div className="w-full h-full bg-emerald-600 text-white rounded-full flex items-center justify-center font-extrabold text-[11px]">
                NM
              </div>
            </div>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => {
                soundFx.playPop();
                setIsMobileMenuOpen((prev) => !prev);
              }}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 flex-shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 shadow-xl max-h-[85vh] overflow-y-auto">
          {/* Quick Spotlight button on Mobile */}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsCommandPaletteOpen(true);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold"
          >
            <Search className="w-4 h-4 text-emerald-500" />
            <span>Search foods, recipes, actions...</span>
            <span className="ml-auto px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
              ⌘K
            </span>
          </button>

          {/* Quick Audio & Environment Controls Strip for Mobile / Tablet */}
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
            {/* LoFi Audio Mobile Tile */}
            <button
              type="button"
              onClick={handleToggleLoFi}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                isLoFiPlaying
                  ? "bg-amber-500/15 border-amber-400/60 text-amber-600 dark:text-amber-400 font-bold"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <Headphones className={`w-4 h-4 ${isLoFiPlaying ? "animate-bounce text-amber-500" : ""}`} />
              <span className="text-[10px] font-bold">{isLoFiPlaying ? "Lo-Fi ON" : "Lo-Fi Music"}</span>
            </button>

            {/* Sound FX Mobile Tile */}
            <button
              type="button"
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                !isMuted
                  ? "bg-emerald-500/15 border-emerald-400/60 text-emerald-600 dark:text-emerald-400 font-bold"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
              }`}
            >
              {!isMuted ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
              <span className="text-[10px] font-bold">{!isMuted ? "Sound ON" : "Muted"}</span>
            </button>

            {/* Brainrot Mode Mobile Tile */}
            <button
              type="button"
              onClick={() => {
                handleToggleBrainrot();
              }}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                isBrainrotMode
                  ? "bg-purple-500/20 border-purple-500/60 text-purple-400 font-bold"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <Skull className={`w-4 h-4 ${isBrainrotMode ? "text-purple-400 animate-pulse" : ""}`} />
              <span className="text-[10px] font-bold">{isBrainrotMode ? "Brainrot ON" : "Brainrot"}</span>
            </button>
          </div>

          {/* Quick Scan Modes Grid */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            <button
              onClick={() => {
                soundFx.playScanRadar();
                setIsScanModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold cursor-pointer"
            >
              <Camera className="w-5 h-5 mb-1 text-emerald-600 dark:text-emerald-400" />
              <span>Camera</span>
            </button>
            <button
              onClick={() => {
                soundFx.playPop();
                setIsBarcodeModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold cursor-pointer"
            >
              <Barcode className="w-5 h-5 mb-1 text-teal-600 dark:text-teal-400" />
              <span>Barcode</span>
            </button>
            <button
              onClick={() => {
                soundFx.playPop();
                setIsLabelModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold cursor-pointer"
            >
              <FileText className="w-5 h-5 mb-1 text-indigo-600 dark:text-indigo-400" />
              <span>OCR Label</span>
            </button>
            <button
              onClick={() => {
                handleNavClick("upload-image");
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold cursor-pointer"
            >
              <ImageIcon className="w-5 h-5 mb-1 text-amber-600 dark:text-amber-400" />
              <span>Upload</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <button
              onClick={() => handleNavClick("recipes")}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-left text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-800 cursor-pointer"
            >
              <ChefHat className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>AI Recipes</span>
            </button>
            <button
              onClick={() => {
                soundFx.playPop();
                setIsAskDrawerOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-left text-slate-900 dark:text-white font-bold cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Ask AI</span>
            </button>
            <button
              onClick={() => handleNavClick("database")}
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <Search className="w-4 h-4 text-emerald-500" />
              <span>Food Database</span>
            </button>
            <button
              onClick={() => handleNavClick("meal-analyzer")}
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-teal-500" />
              <span>Meal Analyzer</span>
            </button>
            <button
              onClick={() => handleNavClick("compare")}
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <span>Compare ({comparisonItems.length})</span>
            </button>
            <button
              onClick={() => handleNavClick("dashboard")}
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => handleNavClick("cuisines")}
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-sky-500" />
              <span>Global Cuisines</span>
            </button>
            <button
              onClick={() => handleNavClick("categories")}
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-rose-500" />
              <span>Categories</span>
            </button>
            <button
              onClick={() => handleNavClick("partners")}
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-emerald-500" />
              <span>Partners</span>
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCreatorsDeskOpen(true);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-left text-amber-900 dark:text-amber-200 font-bold border border-amber-200 dark:border-amber-800/80 cursor-pointer"
            >
              <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Creator's Desk (Ansh Singh)</span>
            </button>
            <button
              onClick={() => {
                handleToggleBrainrot();
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-left font-bold border transition-colors cursor-pointer ${
                isBrainrotMode
                  ? "bg-purple-950/80 text-purple-300 border-purple-500/60"
                  : "bg-slate-900 text-emerald-400 hover:bg-slate-800 border-emerald-500/40"
              }`}
            >
              <Skull className={`w-4 h-4 ${isBrainrotMode ? "text-purple-400" : "text-emerald-400"}`} />
              <span>{isBrainrotMode ? "🥦💀 Brainrot Active (Tap to Disable)" : "🥦💀 Brainrot Edition"}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

