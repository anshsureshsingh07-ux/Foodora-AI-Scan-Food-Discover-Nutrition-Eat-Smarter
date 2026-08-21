import React, { useState } from "react";
import {
  ShieldCheck,
  BookOpen,
  Globe,
  Award,
  Sparkles,
  HelpCircle,
  Mail,
  CheckCircle2,
} from "lucide-react";

export const AboutViews: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"about" | "sources" | "privacy" | "terms">("about");

  const sources = [
    {
      name: "USDA FoodData Central (FDC)",
      region: "United States",
      scope: "Over 350,000 whole agricultural commodities and foundation food items with micronutrient spectroscopy.",
      badge: "Primary Reference",
    },
    {
      name: "ICMR - National Institute of Nutrition (IFCT)",
      region: "India & South Asia",
      scope: "Indian Food Composition Tables containing comprehensive bio-actives, regional spices, and lentils.",
      badge: "Regional Partner",
    },
    {
      name: "EFSA (European Food Safety Authority)",
      region: "European Union",
      scope: "Dietary Reference Values (DRV) and European food additive classifications.",
      badge: "Safety Standard",
    },
    {
      name: "MEXT Standard Tables of Food Composition",
      region: "Japan & East Asia",
      scope: "Calibrated nutritional data for fermented miso, sea vegetables, dashi broths, and green teas.",
      badge: "Regional Partner",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Transparency & Methodology</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          About Foodora AI
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Tagline: <em className="text-zinc-800 dark:text-zinc-200 font-semibold">Scan. Understand. Eat Smarter.</em>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-xs sm:text-sm font-bold">
        {[
          { id: "about", label: "Mission & Philosophy" },
          { id: "sources", label: "Scientific Data Sources" },
          { id: "privacy", label: "Privacy & Data Ethics" },
          { id: "terms", label: "Medical Disclaimer" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === tab.id
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mission Tab */}
      {activeTab === "about" && (
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">
              Democratizing Food Intelligence for Everyone
            </h2>
            <p>
              Food is one of the most fundamental drivers of human longevity, vitality, and daily joy. Yet, nutritional information on restaurant menus, packaging, and home cooking has historically been opaque, fragmented, or difficult to calculate.
            </p>
            <p>
              <strong>Foodora AI</strong> bridges this gap by marrying multimodal artificial intelligence with peer-reviewed food composition databases from leading global institutions.
            </p>
            <p>
              Whether you are scanning a photograph of a traditional South Indian Thali, reading an OCR nutrition label on a packaged granola bar, or analyzing a full dinner plate, Foodora translates visual inputs into actionable, evidence-based nutrition intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl space-y-2">
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block text-base">
                1. Clear Labeling
              </span>
              <p className="text-zinc-500 text-xs">
                We never pretend our system knows every food in existence. AI estimations are clearly badged with confidence scores.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl space-y-2">
              <span className="font-extrabold text-teal-600 dark:text-teal-400 block text-base">
                2. Cultural Breadth
              </span>
              <p className="text-zinc-500 text-xs">
                We actively expand beyond Western diets to include deep support for Asian, Middle Eastern, Latin American, and African culinary preparations.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl space-y-2">
              <span className="font-extrabold text-indigo-600 dark:text-indigo-400 block text-base">
                3. Privacy First
              </span>
              <p className="text-zinc-500 text-xs">
                Your food logs and dietary records remain stored locally on your device unless you explicitly choose to contribute to our open community index.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sources Tab */}
      {activeTab === "sources" && (
        <div className="space-y-6">
          <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-2">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">
              Grounded in Institutional Nutrition Science
            </h3>
            <p className="text-xs text-zinc-500">
              Foodora cross-references real laboratory spectra, gas chromatography assays, and institutional tables:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sources.map((src, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {src.region}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {src.badge}
                  </span>
                </div>
                <h4 className="font-black text-base text-zinc-900 dark:text-white">{src.name}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{src.scope}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === "privacy" && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Privacy Principles</h3>
          <p>
            1. <strong>Local Storage Preference:</strong> Your daily meal logs, water logs, and custom health goals are saved in your local browser state.
          </p>
          <p>
            2. <strong>No Selling of Health Data:</strong> Foodora does not sell, rent, or trade your food logs or dietary habits to third-party ad networks or insurance brokers.
          </p>
          <p>
            3. <strong>Camera & Image Ephemerality:</strong> Camera frames used in scanning are processed in-memory for nutrition extraction and are not stored permanently on server disks.
          </p>
        </div>
      )}

      {/* Medical Disclaimer Tab */}
      {activeTab === "terms" && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-base">
            <ShieldCheck className="w-5 h-5" />
            <span>Important Medical & Educational Disclaimer</span>
          </div>
          <p className="leading-relaxed">
            Foodora AI provides educational and informational food intelligence only. It is <strong>NOT</strong> a medical device, clinical diagnostic tool, or personalized treatment plan.
          </p>
          <p className="leading-relaxed">
            Nutritional estimates for complex restaurant meals and home-cooked preparations are calculated using visual heuristics and standardized ingredient benchmarks. Exact calorie counts, macro splits, and allergen traces may vary based on oil quantities, specific cultivars, and culinary techniques.
          </p>
          <p className="leading-relaxed">
            Always consult a licensed physician or registered dietitian before making significant changes to your diet or if you have acute medical conditions (such as severe food allergies, diabetes, or renal disease).
          </p>
        </div>
      )}
    </div>
  );
};
