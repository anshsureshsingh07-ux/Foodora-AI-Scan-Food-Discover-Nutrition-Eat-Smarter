import React, { useState, useEffect, useRef } from "react";
import { useFood } from "../../context/FoodContext";
import { soundFx } from "../../utils/soundEffects";
import {
  Search,
  Camera,
  Barcode,
  FileText,
  Sparkles,
  Utensils,
  ChefHat,
  Heart,
  Scale,
  Globe,
  BookOpen,
  X,
  ArrowRight,
  Flame,
  Zap,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const {
    foodDatabase,
    setActiveFoodDetail,
    setCurrentView,
    setIsScanModalOpen,
    setIsBarcodeModalOpen,
    setIsLabelModalOpen,
    setIsAskDrawerOpen,
  } = useFood();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      soundFx.playPop();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global key listener for Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const quickActions = [
    {
      id: "action-scan-camera",
      title: "Scan Meal with AI Camera",
      subtitle: "Instant multimodal visual food identification & calories",
      icon: Camera,
      badge: "AI Vision",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      action: () => {
        setIsScanModalOpen(true);
        onClose();
      },
    },
    {
      id: "action-barcode",
      title: "Barcode Intelligence",
      subtitle: "Look up packaged food nutrition by scanning barcode",
      icon: Barcode,
      badge: "Lookup",
      color: "text-sky-500",
      bg: "bg-sky-500/10",
      action: () => {
        setIsBarcodeModalOpen(true);
        onClose();
      },
    },
    {
      id: "action-ocr-label",
      title: "OCR Nutrition Label Reader",
      subtitle: "Extract sodium, sugars, and hidden additives from package photos",
      icon: FileText,
      badge: "OCR",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      action: () => {
        setIsLabelModalOpen(true);
        onClose();
      },
    },
    {
      id: "action-ai-recipe",
      title: "AI Recipe Engine",
      subtitle: "Generate tailored high-protein or keto recipes from your pantry",
      icon: ChefHat,
      badge: "Generator",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      action: () => {
        setCurrentView("recipe-generator");
        onClose();
      },
    },
    {
      id: "action-ask-assistant",
      title: "Ask Nutrimania AI Assistant",
      subtitle: "Get answers to your personal nutrition & health questions",
      icon: Sparkles,
      badge: "Assistant",
      color: "text-teal-500",
      bg: "bg-teal-500/10",
      action: () => {
        setIsAskDrawerOpen(true);
        onClose();
      },
    },
    {
      id: "action-compare",
      title: "Compare Foods Side-by-Side",
      subtitle: "Macro matrix, glycemic index, and ingredient analysis",
      icon: Scale,
      badge: "Matrix",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      action: () => {
        setCurrentView("compare");
        onClose();
      },
    },
    {
      id: "action-cuisines",
      title: "Global Cuisines & Regional Dishes",
      subtitle: "Explore 40+ countries and traditional superfoods",
      icon: Globe,
      badge: "World",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      action: () => {
        setCurrentView("cuisines");
        onClose();
      },
    },
    {
      id: "action-legal-brainrot",
      title: "Privacy Policy & Terms (Brainrot Edition 🥦💀)",
      subtitle: "Official humorous & legally sound terms crafted by Ansh Singh",
      icon: BookOpen,
      badge: "Humor + Legal",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      action: () => {
        setCurrentView("about");
        onClose();
      },
    },
  ];

  // Filtered food items based on query
  const trimmed = query.trim().toLowerCase();
  const matchedFoods = trimmed
    ? foodDatabase
        .filter(
          (f) =>
            f.name.toLowerCase().includes(trimmed) ||
            f.category.toLowerCase().includes(trimmed) ||
            (f.cuisine && f.cuisine.toLowerCase().includes(trimmed)) ||
            (f.country && f.country.toLowerCase().includes(trimmed)) ||
            (f.localName && f.localName.toLowerCase().includes(trimmed))
        )
        .slice(0, 8)
    : [];

  const matchedActions = trimmed
    ? quickActions.filter(
        (a) =>
          a.title.toLowerCase().includes(trimmed) ||
          a.subtitle.toLowerCase().includes(trimmed)
      )
    : quickActions;

  const totalItems = matchedActions.length + matchedFoods.length;

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      soundFx.playPop();
      setSelectedIndex((prev) => (prev + 1) % (totalItems || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      soundFx.playPop();
      setSelectedIndex((prev) => (prev - 1 + totalItems) % (totalItems || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex < matchedActions.length) {
        matchedActions[selectedIndex]?.action();
      } else {
        const foodIdx = selectedIndex - matchedActions.length;
        const food = matchedFoods[foodIdx];
        if (food) {
          soundFx.playPop();
          setActiveFoodDetail(food);
          onClose();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDownList}
      >
        {/* Top Search Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search 2.5M+ foods (e.g. Avocado, Salmon, Scan Meal)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-base sm:text-lg font-medium focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4 max-h-[60vh]">
          {/* Matched Foods section */}
          {matchedFoods.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                <span>Foods & Dishes ({matchedFoods.length})</span>
                <span>Press Enter to View</span>
              </div>
              <div className="space-y-1">
                {matchedFoods.map((food, idx) => {
                  const globalIdx = matchedActions.length + idx;
                  const isSelected = selectedIndex === globalIdx;

                  return (
                    <div
                      key={food.id}
                      onClick={() => {
                        soundFx.playPop();
                        setActiveFoodDetail(food);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-slate-900 dark:text-white"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={food.imageUrl}
                          alt={food.name}
                          className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm truncate">{food.name}</span>
                            {food.cuisine && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                                {food.cuisine}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {food.calories} kcal • {food.proteinG}g Protein • {food.carbsG}g Carbs • {food.fatG}g Fat
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className="px-2 py-1 rounded-lg text-xs font-extrabold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                          {food.healthScore}/100
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions section */}
          {matchedActions.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span>Actions & Intelligence</span>
              </div>
              <div className="space-y-1">
                {matchedActions.map((action, idx) => {
                  const Icon = action.icon;
                  const isSelected = selectedIndex === idx;

                  return (
                    <div
                      key={action.id}
                      onClick={() => {
                        soundFx.playPop();
                        action.action();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-slate-900 dark:text-white"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${action.bg} ${action.color} flex-shrink-0`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-sm block truncate">{action.title}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 truncate block">
                            {action.subtitle}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {action.badge}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {totalItems === 0 && (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500">
              <Utensils className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold">No foods or actions matching "{query}"</p>
              <p className="text-xs mt-1">Try searching "Avocado", "Scan", "Recipe", or "Protein"</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold">
                ↓
              </kbd>{" "}
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold">
                ↵
              </kbd>{" "}
              Select
            </span>
          </div>

          <span className="font-medium text-[11px] text-emerald-600 dark:text-emerald-400">
            Nutrimania Spotlight Search
          </span>
        </div>
      </div>
    </div>
  );
};
