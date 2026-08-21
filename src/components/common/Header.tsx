import React, { useState } from "react";
import { useFood } from "../../context/FoodContext";
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
    todayLogs,
  } = useFood();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDevNoticeDismissed, setIsDevNoticeDismissed] = useState(false);
  const [isDevNoticeExpanded, setIsDevNoticeExpanded] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView("database");
    }
  };

  const totalCaloriesToday = todayLogs.reduce((sum, log) => sum + log.calories, 0);

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full flex flex-col shadow-sm">
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
                  Early Preview
                </strong>
                Fura AI is actively under development — UI, features & database changes may occur continuously.
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
                Fura AI 1.2 Flash
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
                🚧 You are using the continuous preview build of <strong>Fura AI 1.2 Flash</strong>. Multimodal computer vision models, nutrient estimation algorithms, OCR parsers, recipe generation pipelines, and database records are receiving frequent updates. If you spot inconsistencies, feel free to use the community dish feedback or the AI Assistant to report observations.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand with Fura AI 1.2 Flash */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none flex-shrink-0"
            onClick={() => setCurrentView("home")}
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Fura<span className="text-emerald-600 dark:text-emerald-400">.AI</span>
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  1.2 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Scan. Formulate. Eat Smarter.
              </p>
            </div>
          </div>

          {/* Search bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden xl:flex flex-1 max-w-xs items-center relative"
          >
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search 2.5M+ foods, recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </form>

          {/* Sleek Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <button
              onClick={() => setCurrentView("home")}
              className={`transition-all py-1 cursor-pointer ${
                currentView === "home"
                  ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-extrabold"
                  : "hover:text-emerald-600 dark:hover:text-emerald-400"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView("recipes")}
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
              onClick={() => setCurrentView("database")}
              className={`transition-all py-1 cursor-pointer ${
                currentView === "database"
                  ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-extrabold"
                  : "hover:text-emerald-600 dark:hover:text-emerald-400"
              }`}
            >
              Database
            </button>
            <button
              onClick={() => setCurrentView("meal-analyzer")}
              className={`transition-all py-1 cursor-pointer ${
                currentView === "meal-analyzer"
                  ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-extrabold"
                  : "hover:text-emerald-600 dark:hover:text-emerald-400"
              }`}
            >
              Analyzer
            </button>
            <button
              onClick={() => setCurrentView("partners")}
              className={`transition-all py-1 cursor-pointer ${
                currentView === "partners"
                  ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-extrabold"
                  : "hover:text-emerald-600 dark:hover:text-emerald-400"
              }`}
            >
              Partners
            </button>
            <button
              onClick={() => setCurrentView("dashboard")}
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

          {/* Action Triggers & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Camera Scan Trigger */}
            <button
              id="header-scan-food-btn"
              onClick={() => setIsScanModalOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              title="Scan Food with Camera (Fura AI 1.2 Flash)"
            >
              <Camera className="w-4 h-4 text-white flex-shrink-0" />
              <span>Scan Food</span>
            </button>

            {/* Ask Fura AI button */}
            <button
              id="header-ask-ai-btn"
              onClick={() => setIsAskDrawerOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 active:scale-95 rounded-full border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer whitespace-nowrap"
              title="Ask Fura AI 1.2 Flash"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Ask AI</span>
            </button>

            {/* Day / Night Theme Toggle */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={toggleDarkMode}
              className="p-2 sm:p-2.5 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-center flex-shrink-0"
              aria-label={isDarkMode ? "Switch to Day / Light Mode" : "Switch to Night / Dark Mode"}
              title={isDarkMode ? "Switch to Day (Light Mode)" : "Switch to Night (Dark Mode)"}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform rotate-0 hover:-rotate-12" />
              )}
            </button>

            {/* Profile Avatar */}
            <div
              onClick={() => setCurrentView("dashboard")}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-emerald-500 p-0.5 cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
              title="My Health Dashboard"
            >
              <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 font-extrabold text-xs">
                FA
              </div>
            </div>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700"
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
          {/* Quick Search on Mobile */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search dishes, ingredients, recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </form>

          {/* Quick Scan Modes Grid */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            <button
              onClick={() => {
                setIsScanModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold"
            >
              <Camera className="w-5 h-5 mb-1 text-emerald-600 dark:text-emerald-400" />
              <span>Camera</span>
            </button>
            <button
              onClick={() => {
                setIsBarcodeModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold"
            >
              <Barcode className="w-5 h-5 mb-1 text-teal-600 dark:text-teal-400" />
              <span>Barcode</span>
            </button>
            <button
              onClick={() => {
                setIsLabelModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold"
            >
              <FileText className="w-5 h-5 mb-1 text-indigo-600 dark:text-indigo-400" />
              <span>OCR Label</span>
            </button>
            <button
              onClick={() => {
                setCurrentView("upload-image");
                setIsMobileMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold"
            >
              <ImageIcon className="w-5 h-5 mb-1 text-amber-600 dark:text-amber-400" />
              <span>Upload</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <button
              onClick={() => {
                setCurrentView("recipes");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-left text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-800"
            >
              <ChefHat className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>AI Recipes</span>
            </button>
            <button
              onClick={() => {
                setIsAskDrawerOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-left text-slate-900 dark:text-white font-bold"
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Ask Fura AI</span>
            </button>
            <button
              onClick={() => {
                setCurrentView("database");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-800 dark:text-slate-200"
            >
              <Search className="w-4 h-4 text-emerald-500" />
              <span>Food Database</span>
            </button>
            <button
              onClick={() => {
                setCurrentView("meal-analyzer");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-800 dark:text-slate-200"
            >
              <Layers className="w-4 h-4 text-teal-500" />
              <span>Meal Analyzer</span>
            </button>
            <button
              onClick={() => {
                setCurrentView("compare");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-800 dark:text-slate-200"
            >
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <span>Compare ({comparisonItems.length})</span>
            </button>
            <button
              onClick={() => {
                setCurrentView("dashboard");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-800 dark:text-slate-200"
            >
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => {
                setCurrentView("cuisines");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-800 dark:text-slate-200"
            >
              <Globe className="w-4 h-4 text-sky-500" />
              <span>Global Cuisines</span>
            </button>
            <button
              onClick={() => {
                setCurrentView("categories");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-800 dark:text-slate-200"
            >
              <BookOpen className="w-4 h-4 text-rose-500" />
              <span>Categories</span>
            </button>
            <button
              onClick={() => {
                setCurrentView("partners");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-800 dark:text-slate-200"
            >
              <Building2 className="w-4 h-4 text-emerald-500" />
              <span>Partners</span>
            </button>
            <button
              onClick={() => {
                setCurrentView("about");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-800 dark:text-slate-200"
            >
              <Users className="w-4 h-4 text-indigo-500" />
              <span>About Fura AI</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
