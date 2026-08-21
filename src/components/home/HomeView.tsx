import React, { useState } from "react";
import { useFood } from "../../context/FoodContext";
import { FoodCard } from "../food/FoodCard";
import { SAMPLE_ANIME_STORIES } from "../../data/foodDatabase";
import {
  Camera,
  Search,
  Barcode,
  Tag,
  Layers,
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Award,
  Globe,
  Upload,
  Heart,
  TrendingUp,
  Tv,
  ChefHat,
  Utensils,
  BookOpen,
} from "lucide-react";

export const HomeView: React.FC = () => {
  const {
    setIsScanModalOpen,
    setIsBarcodeModalOpen,
    setIsLabelModalOpen,
    setIsAskDrawerOpen,
    setCurrentView,
    foodDatabase,
    logFood,
  } = useFood();

  const [searchQuery, setSearchQuery] = useState("");
  const [loggedDemo, setLoggedDemo] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView("database");
    }
  };

  const handleDemoLogMeal = () => {
    logFood({
      foodId: "demo-avocado-bowl",
      foodName: "Avocado Smash Bowl",
      category: "Prepared Meals",
      mealType: "Breakfast",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      servings: 1,
      grams: 320,
      calories: 380,
      proteinG: 12,
      carbsG: 34,
      fatG: 21,
      fiberG: 9,
      healthScore: 82,
    });
    setLoggedDemo(true);
    setTimeout(() => setLoggedDemo(false), 2500);
  };

  const featuredSuperfoods = foodDatabase.slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. SLEEK HERO SECTION WITH SPLIT INTELLIGENCE CARD */}
      <section className="pt-6 sm:pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch">
            
            {/* Left Side: Headline & 4 Feature Action Cards */}
            <div className="w-full lg:w-3/5 flex flex-col justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Fura AI 1.2 Flash • Multimodal Food Intelligence</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                  Know What's <br />
                  <span className="text-emerald-600 dark:text-emerald-400">On Your Plate.</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                  Scan any meal, generate bespoke recipes from your pantry, and understand nutritional labels in seconds with lab-grounded precision.
                </p>
              </div>

              {/* Quick Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center shadow-sm rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 transition-all"
              >
                <Search className="w-5 h-5 text-slate-400 ml-3.5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search 2.5M+ foods, regional dishes (e.g. Avocado, Salmon, Matcha)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  Search
                </button>
              </form>

              {/* 4 Primary Action Cards Grid (Sleek Theme Matrix) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Scan Food */}
                <button
                  id="action-card-scan-food"
                  onClick={() => setIsScanModalOpen(true)}
                  className="group flex flex-col items-start p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-100/60 dark:hover:shadow-none transition-all text-left cursor-pointer"
                >
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">Scan Food</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Identify visible dishes instantly</span>
                </button>

                {/* 2. Scan Barcode */}
                <button
                  id="action-card-scan-barcode"
                  onClick={() => setIsBarcodeModalOpen(true)}
                  className="group flex flex-col items-start p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-100/60 dark:hover:shadow-none transition-all text-left cursor-pointer"
                >
                  <div className="w-12 h-12 bg-sky-50 dark:bg-sky-950/60 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 mb-4 group-hover:bg-sky-600 group-hover:text-white transition-all">
                    <Barcode className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">Scan Barcode</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Analyze packaged food intelligence</span>
                </button>

                {/* 3. Scan Label */}
                <button
                  id="action-card-scan-label"
                  onClick={() => setIsLabelModalOpen(true)}
                  className="group flex flex-col items-start p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-100/60 dark:hover:shadow-none transition-all text-left cursor-pointer"
                >
                  <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/60 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all">
                    <Tag className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">Scan Label</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">OCR for ingredient breakdown</span>
                </button>

                {/* 4. Search Database / Meal Decomposition */}
                <button
                  id="action-card-database"
                  onClick={() => setCurrentView("database")}
                  className="group flex flex-col items-start p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-100/60 dark:hover:shadow-none transition-all text-left cursor-pointer"
                >
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Search className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">Search Database</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Browse 2.5M+ global food items</span>
                </button>
              </div>
            </div>

            {/* Right Side: Sleek Dark Intelligence Card + Database Coverage Card */}
            <div className="w-full lg:w-2/5 flex flex-col gap-6">
              {/* Dark Intelligence Analysis Card */}
              <div className="bg-slate-900 rounded-[32px] p-6 sm:p-7 text-white shadow-2xl flex flex-col justify-between border border-slate-800">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                        Latest Analysis
                      </span>
                      <h3 className="text-xl font-bold text-white">Avocado Smash Bowl</h3>
                    </div>
                    <div className="bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      94% Confidence
                    </div>
                  </div>

                  {/* Circular Health Score Ring & Macro Bars */}
                  <div className="flex items-center gap-6 mb-7">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center flex-shrink-0">
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-slate-800"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-emerald-500"
                          fill="transparent"
                          strokeDasharray="264"
                          strokeDashoffset="48"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="flex flex-col items-center leading-none text-center">
                        <span className="text-3xl font-black text-white">82</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Health Score</span>
                      </div>
                    </div>

                    <div className="flex-grow space-y-3">
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-xs text-slate-400 font-medium">Protein</span>
                          <span className="text-xs font-bold text-white">12g</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[65%] rounded-full"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-xs text-slate-400 font-medium">Carbs</span>
                          <span className="text-xs font-bold text-white">34g</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 w-[45%] rounded-full"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-xs text-slate-400 font-medium">Healthy Fats</span>
                          <span className="text-xs font-bold text-white">21g</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-sky-400 w-[80%] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ask Fura AI Assistant Box */}
                  <div
                    onClick={() => setIsAskDrawerOpen(true)}
                    className="bg-slate-800/90 hover:bg-slate-800 rounded-2xl p-4 border border-slate-700/80 cursor-pointer transition-all mb-6"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                      <span className="text-xs font-bold uppercase text-slate-300">Ask Fura AI (1.2 Flash)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 italic">
                      "This dish provides 35% of your daily recommended fiber and heart-healthy oleic acid. Would you like a breakdown of the seed variety detected?"
                    </p>
                  </div>
                </div>

                {/* Log Meal & Action Buttons */}
                <div className="flex gap-2.5">
                  <button
                    onClick={handleDemoLogMeal}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 active:scale-98 rounded-xl flex items-center justify-center font-bold text-sm text-white transition-all shadow-md cursor-pointer"
                  >
                    {loggedDemo ? "Logged to Diary! ✓" : "Log Meal"}
                  </button>
                  <button
                    onClick={() => setCurrentView("meal-analyzer")}
                    className="w-12 h-12 bg-slate-800 hover:bg-slate-700 active:scale-98 rounded-xl flex items-center justify-center text-slate-300 transition-all border border-slate-700 cursor-pointer"
                    title="Open Meal Analyzer"
                  >
                    <Layers className="w-5 h-5 text-emerald-400" />
                  </button>
                </div>
              </div>

              {/* Sleek Global Coverage Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Database Coverage</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">184 Global Regions Supported</p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300">US</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-400 dark:bg-slate-600 flex items-center justify-center text-[10px] font-bold text-white">EU</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-500 dark:bg-slate-500 flex items-center justify-center text-[10px] font-bold text-white">JP</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold">+</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VERIFIED WHOLE FOODS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Verified Whole Foods
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              Featured High-Scoring Foods
            </h2>
          </div>

          <button
            onClick={() => setCurrentView("database")}
            className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All ({foodDatabase.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSuperfoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* 2.5 AI RECIPE GENERATOR FEATURE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>New AI Feature • Personalized Culinary Engine</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Turn Your Pantry Into <br className="hidden sm:inline" />
                <span className="text-emerald-400">Nutritionally Calculated Recipes</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Got leftover avocado, chickpeas, spinach, or tofu? Tell Foodora AI your dietary restrictions (vegan, gluten-free, keto) and preferred cuisines. We'll generate step-by-step gourmet recipes with estimated calories, macros, and cooking timers.
              </p>
              <div className="flex flex-wrap gap-2 pt-2 text-xs">
                <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300">
                  🌱 Vegan & Keto Ready
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300">
                  ⏱️ Live Step Timers
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300">
                  📊 USDA Nutritional Estimation
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300">
                  🏷️ Labeled AI-Generated
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
              <button
                type="button"
                onClick={() => setCurrentView("recipes")}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-extrabold text-sm sm:text-base rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <ChefHat className="w-5 h-5" />
                <span>Launch Recipe Generator</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentView("recipes");
                }}
                className="px-6 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl transition-colors border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Explore Inspiration Presets</span>
              </button>
            </div>
          </div>

          {/* Decorative Subtle Background Glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* 3. HEALTH SCORE ALGORITHM EXPLAINER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                Transparent Nutrition Methodology
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                How Foodora Calculates Health Scores (0 - 100)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Rather than penalizing foods with arbitrary points, Foodora evaluates nutrient density ratios, unrefined plant fibers, whole ingredient processing, and healthy fats.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-2xl border border-emerald-500/40">
                98
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-slate-400">Gold Standard</span>
                <h4 className="font-bold text-sm text-white">Whole Ingredient Density</h4>
                <span className="text-[11px] text-emerald-400">Omega-3s • Bioavailable Minerals</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-1">
              <span className="font-bold text-emerald-400 block">+ Positive Factors</span>
              <p className="text-slate-300">
                High dietary fiber, essential micronutrients (Vitamins A, C, D, K, Iron), monounsaturated fats, and lean bioavailable protein.
              </p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-1">
              <span className="font-bold text-amber-400 block">- Penalty Factors</span>
              <p className="text-slate-300">
                Added refined sugars, industrial trans fats, excess sodium exceeding daily thresholds, and ultra-processed additives.
              </p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-1">
              <span className="font-bold text-teal-400 block">🌿 Culinary Integrity</span>
              <p className="text-slate-300">
                Recognizing traditional fermentation (miso, sourdough leaven, dosa batter) that enhance bioavailability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ANIME & STORY DINER HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Culinary Storytelling
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              Every Meal Has a Story • Anime Editions
            </h2>
          </div>

          <button
            onClick={() => setCurrentView("collaborations")}
            className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore Stories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_ANIME_STORIES.slice(0, 2).map((story) => (
            <div
              key={story.id}
              onClick={() => setCurrentView("collaborations")}
              className="group relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 text-white cursor-pointer shadow-sm hover:shadow-xl transition-all"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-sm">
                  {story.animeUniverse}
                </span>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-xs font-bold text-amber-300 block mb-0.5">{story.dishName}</span>
                  <h4 className="text-lg font-black">{story.title}</h4>
                </div>
              </div>

              <div className="p-4 text-xs text-slate-300 flex items-center justify-between border-t border-slate-800">
                <span>{story.loreSnippet.slice(0, 80)}...</span>
                <span className="text-amber-400 font-bold whitespace-nowrap ml-2">Read Lore →</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
