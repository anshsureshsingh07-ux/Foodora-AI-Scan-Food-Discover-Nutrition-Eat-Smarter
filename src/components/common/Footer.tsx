import React from "react";
import { useFood } from "../../context/FoodContext";
import { Sparkles, ShieldCheck, Heart, Globe, Building2, HelpCircle, FileText, Database, AlertCircle, Cpu, ChefHat } from "lucide-react";

export const Footer: React.FC = () => {
  const { setCurrentView } = useFood();

  return (
    <footer className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 text-sm mt-16 transition-colors">
      {/* Sleek Metrics & Engine Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 py-3.5 px-4 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          <div className="flex flex-wrap items-center gap-6">
            <span>Global Database: <strong className="text-slate-700 dark:text-slate-300">2.5M Foods</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400">Verified Partners: <strong>1.2k+</strong></span>
            <span>Multimodal Engine: <strong className="text-slate-700 dark:text-slate-300">Fura AI 1.2 Flash</strong></span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              USDA & ICMR Grounded
            </span>
            <span className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400 font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              Active Development Preview
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        {/* Continuous Development Alert Box */}
        <div className="mb-10 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-amber-950 dark:text-amber-100">
                Notice: Fura AI 1.2 Flash is in Continuous Development
              </p>
              <p className="text-amber-800/80 dark:text-amber-300/80 text-[11px] leading-relaxed">
                We are actively adding new regional cuisines, refining nutritional calculations, improving AI recipe synthesis, and enhancing OCR models. Features and UI changes may update in real time.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-mono text-[10px] font-bold whitespace-nowrap self-start sm:self-center">
            v1.2-flash-preview
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView("home")}>
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-200 dark:shadow-none">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-900 dark:text-white font-extrabold text-xl tracking-tight">
                Fura<span className="text-emerald-600 dark:text-emerald-400">.AI</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                1.2 Flash
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              The multimodal AI-powered global food intelligence platform. Scan, analyze, search, formulate recipes, and understand foods, meals, barcodes, and nutrition labels worldwide.
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
                <button onClick={() => setCurrentView("recipes")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>AI Recipe Generator</span>
                  <span className="text-[9px] px-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded font-bold">NEW</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("scan-food")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Live Food Scanner
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("upload")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Photo Meal Analysis
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("barcode")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Barcode Intelligence
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("label-scanner")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  OCR Nutrition Label Reader
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("meal-analyzer")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Multi-Dish Meal Segmentation
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("compare")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
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
                <button onClick={() => setCurrentView("database")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Search 2.5M+ Foods
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("cuisines")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  International Cuisines
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("categories")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Browse by Category
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("collaborations")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Story Diners & Anime Collabs
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("community")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Community Submissions
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("partners")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Verified Partner Ecosystem
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-3">Trust & Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView("about")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  About Fura AI
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("dashboard")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  My Health Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("memories")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Food Memories Journal
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("insights")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Weekly Insights
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("about")} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Data Accuracy & Provenance
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Fura AI Inc. All rights reserved. Powered by Fura AI 1.2 Flash.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-500 hover:text-emerald-600 cursor-pointer">Privacy</span>
            <span className="text-slate-500 hover:text-emerald-600 cursor-pointer">Terms</span>
            <span className="text-slate-500 hover:text-emerald-600 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

