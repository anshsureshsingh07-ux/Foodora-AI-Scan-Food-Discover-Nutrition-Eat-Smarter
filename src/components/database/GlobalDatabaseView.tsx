import React, { useState, useMemo } from "react";
import { useFood } from "../../context/FoodContext";
import { FoodCard } from "../food/FoodCard";
import { Continent, FoodTypeClassification } from "../../types/food";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Sparkles,
  ArrowUpDown,
  Check,
  X,
  Globe2,
  MapPin,
  Utensils,
  Layers,
  Loader2,
  AlertCircle,
  PlusCircle,
  Languages,
} from "lucide-react";

export const GlobalDatabaseView: React.FC = () => {
  const { foodDatabase, addFoodToDatabase, setActiveFoodDetail } = useFood();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContinent, setSelectedContinent] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedFoodType, setSelectedFoodType] = useState<string>("All");
  const [dietFilter, setDietFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"health" | "calories-asc" | "calories-desc" | "protein" | "name">("health");

  // AI Dynamic Food Resolution State
  const [isResolvingWithAI, setIsResolvingWithAI] = useState(false);
  const [aiResolveError, setAiResolveError] = useState<string | null>(null);

  const continents = ["All", "Asia", "Europe", "North America", "South America", "Africa", "Middle East", "Oceania"];

  const foodTypes: (string | "All")[] = [
    "All",
    "Home-Cooked",
    "Street Foods",
    "Restaurant Foods",
    "Fresh Foods",
    "Packaged Foods",
    "Fast Food",
    "Bakery",
    "Desserts & Sweets",
    "Beverages",
  ];

  const categories: (string | "All")[] = [
    "All",
    "Dishes & Meals",
    "Fruits",
    "Vegetables",
    "Grains & Staples",
    "Pulses & Legumes",
    "Dairy & Alternatives",
    "Meat & Poultry",
    "Seafood",
    "Snacks",
    "Desserts",
    "Beverages",
    "Bakery & Breads",
  ];

  const filteredFoods = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return foodDatabase
      .filter((food) => {
        // Multi-identity & Multilingual Search
        const matchesSearch =
          q === "" ||
          food.name.toLowerCase().includes(q) ||
          food.description.toLowerCase().includes(q) ||
          (food.localName && food.localName.toLowerCase().includes(q)) ||
          (food.englishName && food.englishName.toLowerCase().includes(q)) ||
          (food.transliteration && food.transliteration.toLowerCase().includes(q)) ||
          (food.country && food.country.toLowerCase().includes(q)) ||
          (food.regionOrState && food.regionOrState.toLowerCase().includes(q)) ||
          (food.cityOrLocality && food.cityOrLocality.toLowerCase().includes(q)) ||
          (food.cuisine && food.cuisine.toLowerCase().includes(q)) ||
          (food.alternateNames && food.alternateNames.some((alt) => alt.toLowerCase().includes(q))) ||
          food.category.toLowerCase().includes(q);

        // Continent Filter
        const matchesContinent =
          selectedContinent === "All" ||
          (food.continent && food.continent.toLowerCase() === selectedContinent.toLowerCase()) ||
          (selectedContinent === "Asia" && (food.country === "India" || food.country === "Japan" || food.country === "Korea" || food.country === "Thailand" || food.country === "China")) ||
          (selectedContinent === "Europe" && (food.country === "Italy" || food.country === "France" || food.country === "Spain" || food.country === "Greece" || food.country === "UK")) ||
          (selectedContinent === "North America" && (food.country === "USA" || food.country === "Mexico" || food.country === "Canada")) ||
          (selectedContinent === "Africa" && (food.country === "Nigeria" || food.country === "Ethiopia" || food.country === "Egypt" || food.country === "Morocco")) ||
          (selectedContinent === "Middle East" && (food.country === "Lebanon" || food.country === "Turkey" || food.country === "UAE" || food.country === "Iran" || food.country === "Israel"));

        // Category Filter
        const matchesCategory =
          selectedCategory === "All" ||
          food.category === selectedCategory ||
          (selectedCategory === "Grains & Staples" && (food.category === "Grains & Cereals" || food.category === "Grains & Staples")) ||
          (selectedCategory === "Pulses & Legumes" && (food.category === "Legumes & Pulses" || food.category === "Pulses & Legumes")) ||
          (selectedCategory === "Meat & Poultry" && (food.category === "Meat, Poultry & Seafood" || food.category === "Meat & Poultry"));

        // Food Type Classification Filter
        const matchesFoodType =
          selectedFoodType === "All" ||
          (food.foodType && food.foodType.toLowerCase() === selectedFoodType.toLowerCase());

        // Dietary
        let matchesDiet = true;
        if (dietFilter === "vegetarian") matchesDiet = !!food.dietaryFlags?.isVegetarian;
        if (dietFilter === "vegan") matchesDiet = !!food.dietaryFlags?.isVegan;
        if (dietFilter === "gluten-free") matchesDiet = !!food.dietaryFlags?.isGlutenFree;
        if (dietFilter === "high-protein") matchesDiet = (food.proteinG || 0) >= 15 || !!food.dietaryFlags?.isHighProtein;
        if (dietFilter === "jain") matchesDiet = !!food.dietaryFlags?.isJain;
        if (dietFilter === "halal") matchesDiet = !!food.dietaryFlags?.isHalal;

        return matchesSearch && matchesContinent && matchesCategory && matchesFoodType && matchesDiet;
      })
      .sort((a, b) => {
        if (sortBy === "health") return b.healthScore - a.healthScore;
        if (sortBy === "protein") return b.proteinG - a.proteinG;
        if (sortBy === "calories-asc") return a.calories - b.calories;
        if (sortBy === "calories-desc") return b.calories - a.calories;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [foodDatabase, searchQuery, selectedContinent, selectedCategory, selectedFoodType, dietFilter, sortBy]);

  // Handle AI dynamic resolution when search query has no or few results
  const handleResolveWithAI = async () => {
    if (!searchQuery.trim()) return;
    setIsResolvingWithAI(true);
    setAiResolveError(null);

    try {
      const response = await fetch("/api/food/global-resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();
      if (data && data.success && data.food) {
        addFoodToDatabase(data.food);
        setActiveFoodDetail(data.food);
        // Reset restrictive filters so the newly created item is visible in the grid
        if (selectedContinent !== "All" && data.food.continent && selectedContinent.toLowerCase() !== data.food.continent.toLowerCase()) {
          setSelectedContinent("All");
        }
        if (selectedCategory !== "All" && selectedCategory !== data.food.category) {
          setSelectedCategory("All");
        }
        if (selectedFoodType !== "All" && selectedFoodType !== data.food.foodType) {
          setSelectedFoodType("All");
        }
      } else {
        throw new Error(data?.error || "Failed to resolve food item");
      }
    } catch (err: any) {
      console.error("AI Resolution Error:", err);
      setAiResolveError(err.message || "Failed to resolve dish with AI. Please try again.");
    } finally {
      setIsResolvingWithAI(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-xs">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">
              Fura AI 1.2 Flash Global Food Knowledge System
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Continuous knowledge expansion covering regional specialties, local languages, and recipe variations.
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 whitespace-nowrap">
          Website in active development • Real-time AI additions enabled
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
          <Languages className="w-4 h-4" />
          <span>Multilingual • Regional • Continuous Global Expansion</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Global Food Knowledge System
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Explore authentic cuisines, regional variations (Home-Cooked, Restaurant, Street-Food), and comprehensive nutritional compositions from every corner of the world.
        </p>
      </div>

      {/* Filter Bar & Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
        {/* Search input with live AI resolver trigger */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search in English, native script, or regional names (e.g., Surti Locho, Tonkotsu Ramen, Misal Pav, Tacos al Pastor, Appam)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 1. Continents Navigation Strip */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-emerald-500" />
            Continent & Global Region:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {continents.map((cont) => (
              <button
                key={cont}
                onClick={() => setSelectedContinent(cont)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedContinent === cont
                    ? "bg-slate-950 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cont}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Food Type Classification Strip (Home vs Street vs Restaurant) */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            Preparation & Food Type:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {foodTypes.map((ft) => (
              <button
                key={ft}
                onClick={() => setSelectedFoodType(ft)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedFoodType === ft
                    ? "bg-indigo-600 text-white font-bold shadow-xs"
                    : "bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40 hover:bg-indigo-100/60"
                }`}
              >
                {ft}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Category Pills */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Utensils className="w-3.5 h-3.5 text-emerald-500" />
            Food Category:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white font-bold shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Sub-Filters: Dietary, Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Dietary Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-500 mr-1">Diet:</span>
            {[
              { id: "All", label: "All Diets" },
              { id: "vegetarian", label: "🌱 Vegetarian" },
              { id: "vegan", label: "🌿 Vegan" },
              { id: "gluten-free", label: "🌾 Gluten-Free" },
              { id: "high-protein", label: "💪 High Protein" },
              { id: "jain", label: "✨ Jain" },
              { id: "halal", label: "🌙 Halal" },
            ].map((diet) => (
              <button
                key={diet.id}
                onClick={() => setDietFilter(diet.id)}
                className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  dietFilter === diet.id
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {diet.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="health">Highest Health Score</option>
              <option value="protein">Highest Protein</option>
              <option value="calories-asc">Lowest Calories</option>
              <option value="calories-desc">Highest Calories</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Dynamic Resolution Prompt Banner if user is searching */}
      {searchQuery.trim().length > 1 && (
        <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/70 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 dark:text-white block">
                Can't find an obscure dish or specific regional recipe?
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Ask Fura AI 1.2 Flash to formulate <strong>"{searchQuery}"</strong> with complete hierarchy, local translations, and multiple recipe versions.
              </p>
            </div>
          </div>

          <button
            onClick={handleResolveWithAI}
            disabled={isResolvingWithAI}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isResolvingWithAI ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Formulating Knowledge...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Resolve "{searchQuery}" with AI</span>
              </>
            )}
          </button>
        </div>
      )}

      {aiResolveError && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>{aiResolveError}</span>
        </div>
      )}

      {/* Food Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong>{filteredFoods.length}</strong> items in knowledge base
          </span>
          {searchQuery && <span>Search results for "{searchQuery}"</span>}
        </div>

        {filteredFoods.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <Search className="w-10 h-10 text-slate-400 mx-auto" />
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                No matching foods found in current view
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                You can instantly formulate and add "{searchQuery}" using the Fura AI Global Food Resolver.
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={handleResolveWithAI}
                disabled={isResolvingWithAI}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                {isResolvingWithAI ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Resolve "{searchQuery}" with Fura AI</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

