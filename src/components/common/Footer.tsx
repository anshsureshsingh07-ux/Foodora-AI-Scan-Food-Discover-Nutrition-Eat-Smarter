import React from "react";
import { useFood } from "../../context/FoodContext";
import { Sparkles, ShieldCheck, Heart, Globe, Building2, HelpCircle, FileText, Database, AlertCircle, Cpu, ChefHat, User } from "lucide-react";

export const Footer: React.FC = () => {
  const {
    setCurrentView,
    setIsScanModalOpen,
    setIsBarcodeModalOpen,
    setIsLabelModalOpen,
    isBrainrotMode,
    toggleBrainrotMode,
  } = useFood();

  return (
    <footer className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 text-sm mt-16 transition-colors">
      {/* Sleek Metrics & Engine Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 py-3.5 px-4 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          <div className="flex flex-wrap items-center gap-6">
            <span>Global Database: <strong className="text-slate-700 dark:text-slate-300">2.5M Foods</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400">Verified Partners: <strong>1.2k+</strong></span>
            <span>Multimodal Engine: <strong className="text-slate-700 dark:text-slate-300">Nutrimania AI</strong></span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              USDA & ICMR Grounded
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <User className="w-3.5 h-3.5" />
              Created by Ansh Singh
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView("home")}>
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-200 dark:shadow-none">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-900 dark:text-white font-extrabold text-xl tracking-tight uppercase">
                Nutri<span className="text-emerald-600 dark:text-emerald-400">mania</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                AI
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Discover Food. Understand Nutrition.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              The multimodal AI-powered global food intelligence platform created and developed by Ansh Singh. Scan, analyze, search, formulate recipes, and understand foods, meals, barcodes, and nutrition labels worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-3 max-w-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Evidence-based nutrition inference with transparent uncertainty labeling.</span>
            </div>
          </div>

          {/* Column 1: Core Scanners & Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-3">AI Food Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView("recipes")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer">
                  <span>AI Recipe Generator</span>
                  <span className="text-[9px] px-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded font-bold">NEW</span>
                </button>
              </li>
              <li>
                <button onClick={() => setIsScanModalOpen(true)} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  Live Food Scanner
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("upload")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  Photo Meal Analysis
                </button>
              </li>
              <li>
                <button onClick={() => setIsBarcodeModalOpen(true)} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  Barcode Intelligence
                </button>
              </li>
              <li>
                <button onClick={() => setIsLabelModalOpen(true)} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  OCR Nutrition Label Reader
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("meal-analyzer")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  Multi-Dish Meal Segmentation
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("compare")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  Comparative Food Engine
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Database & Cuisines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-3">Global Database</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView("database")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  Search 2.5M+ Foods
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("cuisines")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  International Cuisines
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("categories")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  Browse by Category
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("collaborations")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  Story Diners & Collabs
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("community")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  Community Submissions
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("partners")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  Verified Partner Ecosystem
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust, Founder & Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-3">About & Creator</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView("about")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 cursor-pointer">
                  <span>About the Founder</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded font-bold">Ansh Singh</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("about")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  About Nutrimania
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("dashboard")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  My Health Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("memories")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  Food Memories Journal
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("insights")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  Weekly Insights
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("about")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  Data Accuracy & Provenance
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p className="font-medium text-slate-600 dark:text-slate-300">
            © 2026 Nutrimania. Created &amp; Developed by Ansh Singh. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span onClick={() => setCurrentView("about")} className="text-slate-500 hover:text-emerald-600 cursor-pointer font-medium">
              Privacy Policy (We Are Not FBI Bro 🔐)
            </span>
            <span onClick={() => setCurrentView("about")} className="text-slate-500 hover:text-emerald-600 cursor-pointer font-medium">
              Terms &amp; Conditions (Fine Print 📜)
            </span>
            <button
              type="button"
              onClick={toggleBrainrotMode}
              className={`hover:underline cursor-pointer font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs transition-colors ${
                isBrainrotMode
                  ? "bg-purple-950/80 text-purple-300 border-purple-500/50"
                  : "bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-slate-200 dark:border-slate-700"
              }`}
            >
              <span>{isBrainrotMode ? "🥦💀 Brainrot Active (Switch to Corporate)" : "🥦💀 Switch to Brainrot Edition"}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

