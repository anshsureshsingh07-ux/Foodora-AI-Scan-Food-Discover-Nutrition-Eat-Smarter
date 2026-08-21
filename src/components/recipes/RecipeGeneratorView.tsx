import React, { useState } from "react";
import { GeneratedRecipe, RecipeGenerationParams } from "../../types/food";
import { useFood } from "../../context/FoodContext";
import { RecipeCard } from "./RecipeCard";
import { RecipeDetailModal } from "./RecipeDetailModal";
import {
  Sparkles,
  Plus,
  X,
  ChefHat,
  Clock,
  Flame,
  ShieldCheck,
  Bookmark,
  RefreshCw,
  Utensils,
  Search,
  Filter,
  Check,
  ArrowRight,
  Lightbulb,
  AlertCircle,
  HelpCircle,
  Wand2,
  Layers,
  Heart,
  Sliders,
} from "lucide-react";
import confetti from "canvas-confetti";

// Quick Ingredient Suggestions
const POPULAR_INGREDIENTS = [
  "Avocado",
  "Eggs",
  "Chickpeas",
  "Garlic",
  "Spinach",
  "Olive Oil",
  "Salmon",
  "Tomato",
  "Quinoa",
  "Tofu",
  "Lemon",
  "Mushrooms",
  "Greek Yogurt",
  "Sweet Potato",
  "Broccoli",
  "Bell Peppers",
  "Black Beans",
  "Onion",
  "Oats",
  "Chia Seeds",
];

// Dietary Restriction Options
const DIETARY_OPTIONS = [
  { id: "vegan", label: "Vegan", icon: "🌱" },
  { id: "vegetarian", label: "Vegetarian", icon: "🥬" },
  { id: "gluten-free", label: "Gluten-Free", icon: "🌾" },
  { id: "dairy-free", label: "Dairy-Free", icon: "🥛" },
  { id: "keto", label: "Keto / Low-Carb", icon: "🥑" },
  { id: "nut-free", label: "Nut-Free", icon: "🥜" },
  { id: "high-protein", label: "High-Protein", icon: "💪" },
  { id: "paleo", label: "Paleo", icon: "🥩" },
  { id: "pescatarian", label: "Pescatarian", icon: "🐟" },
  { id: "low-sodium", label: "Low-Sodium", icon: "🧂" },
  { id: "low-fodmap", label: "Low-FODMAP", icon: "🩺" },
];

// Cuisine Options
const CUISINE_OPTIONS = [
  "Mediterranean",
  "Italian",
  "Japanese",
  "Mexican",
  "Indian",
  "Thai",
  "Middle Eastern",
  "Korean",
  "French",
  "American",
  "Vietnamese",
  "Spanish",
];

// Inspiration Preset Recipes
const INSPIRATION_PRESETS = [
  {
    title: "15-Min Mediterranean Power Bowl",
    ingredients: ["Chickpeas", "Avocado", "Spinach", "Tomato", "Lemon", "Olive Oil"],
    dietary: ["Vegan", "Gluten-Free", "High-Protein"],
    cuisine: "Mediterranean",
    cookTime: 15,
  },
  {
    title: "Keto Garlic Butter Salmon & Greens",
    ingredients: ["Salmon", "Spinach", "Garlic", "Lemon", "Olive Oil"],
    dietary: ["Keto / Low-Carb", "Dairy-Free", "Gluten-Free"],
    cuisine: "French",
    cookTime: 20,
  },
  {
    title: "Cozy Turmeric Spiced Lentil & Quinoa Skillet",
    ingredients: ["Quinoa", "Chickpeas", "Garlic", "Onion", "Tomato", "Spinach"],
    dietary: ["Vegetarian", "Gluten-Free", "High-Protein"],
    cuisine: "Indian",
    cookTime: 25,
  },
  {
    title: "Japanese Sesame Glazed Tofu & Mushrooms",
    ingredients: ["Tofu", "Mushrooms", "Broccoli", "Garlic", "Quinoa"],
    dietary: ["Vegan", "Gluten-Free"],
    cuisine: "Japanese",
    cookTime: 20,
  },
];

export const RecipeGeneratorView: React.FC = () => {
  const {
    savedRecipes,
    lastGeneratedRecipes,
    setLastGeneratedRecipes,
    isRecipeSaved,
    saveRecipe,
    deleteSavedRecipe,
  } = useFood();

  // Form State
  const [ingredients, setIngredients] = useState<string[]>([
    "Avocado",
    "Chickpeas",
    "Spinach",
    "Garlic",
    "Olive Oil",
  ]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([
    "Gluten-Free",
    "Vegetarian",
  ]);
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([
    "Mediterranean",
  ]);
  const [mealType, setMealType] = useState("Dinner");
  const [maxCookTime, setMaxCookTime] = useState<number | undefined>(30);
  const [skillLevel, setSkillLevel] = useState<"Easy" | "Medium" | "Advanced">("Easy");
  const [servings, setServings] = useState<number>(2);
  const [additionalNotes, setAdditionalNotes] = useState("");

  // UI State
  const [activeTab, setActiveTab] = useState<"generator" | "saved">("generator");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [selectedRecipe, setSelectedRecipe] = useState<GeneratedRecipe | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedSearchQuery, setSavedSearchQuery] = useState("");

  // Add ingredient tag
  const handleAddIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (trimmed && !ingredients.some((ing) => ing.toLowerCase() === trimmed.toLowerCase())) {
      setIngredients((prev) => [...prev, trimmed]);
      setIngredientInput("");
    }
  };

  const handleRemoveIngredient = (ingToRemove: string) => {
    setIngredients((prev) => prev.filter((i) => i !== ingToRemove));
  };

  const togglePopularIngredient = (ing: string) => {
    if (ingredients.includes(ing)) {
      handleRemoveIngredient(ing);
    } else {
      setIngredients((prev) => [...prev, ing]);
    }
  };

  const toggleDietary = (label: string) => {
    setDietaryRestrictions((prev) =>
      prev.includes(label) ? prev.filter((d) => d !== label) : [...prev, label]
    );
  };

  const toggleCuisine = (cuisine: string) => {
    setCuisinePreferences((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };

  const applyPreset = (preset: typeof INSPIRATION_PRESETS[0]) => {
    setIngredients(preset.ingredients);
    setDietaryRestrictions(preset.dietary);
    setCuisinePreferences([preset.cuisine]);
    setMaxCookTime(preset.cookTime);
    setAdditionalNotes(`Inspired by ${preset.title}`);
  };

  // Primary Recipe Generation Call
  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) {
      setErrorMessage("Please enter or select at least 1 ingredient to formulate recipes.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep("Analyzing ingredient pairings and flavor synergies...");

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev.includes("flavor synergies")) return "Applying dietary constraints & macro balancing...";
        if (prev.includes("dietary constraints")) return "Formulating step-by-step cooking procedures & timings...";
        if (prev.includes("cooking procedures")) return "Calculating USDA nutritional estimates & Health Scores...";
        return "Finalizing AI recipe formulation...";
      });
    }, 1200);

    try {
      const response = await fetch("/api/gemini/generate-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          dietaryRestrictions,
          cuisinePreferences,
          mealType,
          maxCookTimeMinutes: maxCookTime,
          skillLevel,
          servings,
          additionalNotes,
          recipeCount: 2,
        }),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error(`Recipe generation failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.recipes && Array.isArray(data.recipes) && data.recipes.length > 0) {
        setLastGeneratedRecipes(data.recipes);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#10b981", "#3b82f6", "#f59e0b"],
        });
      } else {
        throw new Error("No recipes returned from AI formulation engine.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to generate recipes. Please try again.");
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const filteredSavedRecipes = savedRecipes.filter((r) =>
    savedSearchQuery.trim() === ""
      ? true
      : r.title.toLowerCase().includes(savedSearchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(savedSearchQuery.toLowerCase()) ||
        r.dietaryTags.some((t) => t.toLowerCase().includes(savedSearchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-10">
      
      {/* 1. View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold shadow-xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Fura AI 1.2 Flash • Culinary & Nutritional Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Recipe <span className="text-emerald-600 dark:text-emerald-400">Generator</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
            Input your available ingredients, dietary restrictions, and cuisine preferences. Our AI formulates complete recipes with step-by-step instructions, live timers, and estimated nutritional metrics.
          </p>
        </div>

        {/* View Tabs Toggle (Generator vs Saved) */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("generator")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "generator"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Generate Recipes</span>
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "saved"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Recipes</span>
            {savedRecipes.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-extrabold">
                {savedRecipes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: GENERATOR INTERFACE */}
      {activeTab === "generator" && (
        <div className="space-y-12">
          
          {/* Main Formulation Grid (Split Left Controls / Right Inspiration & Actions) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT 7 COLS: INGREDIENT & PREFERENCE BUILDER */}
            <div className="lg:col-span-7 space-y-8 p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
              
              {/* 1. Available Ingredients Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Available Ingredients ({ingredients.length})</span>
                  </label>
                  {ingredients.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIngredients([])}
                      className="text-xs text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Input with Add button */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Type an ingredient (e.g. Salmon, Spinach, Chickpeas)..."
                      value={ingredientInput}
                      onChange={(e) => setIngredientInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddIngredient();
                        }
                      }}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-colors flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Active Ingredients Tags */}
                {ingredients.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold shadow-2xs"
                      >
                        <span>{ing}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(ing)}
                          className="text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 p-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No ingredients added yet. Pick from below or type above.</p>
                )}

                {/* Popular Ingredient Quick Pickers */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Quick Pick Popular Pantry & Produce:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_INGREDIENTS.map((item) => {
                      const isSelected = ingredients.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => togglePopularIngredient(item)}
                          className={`text-xs px-2.5 py-1 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                            isSelected
                              ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                              : "bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. Dietary Restrictions */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Dietary Restrictions (Strictly Respected)</span>
                </label>

                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((opt) => {
                    const isSelected = dietaryRestrictions.includes(opt.label);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleDietary(opt.label)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400"
                        }`}
                      >
                        <span>{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Cuisine Preferences */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Cuisine Preferences</span>
                </label>

                <div className="flex flex-wrap gap-2">
                  {CUISINE_OPTIONS.map((c) => {
                    const isSelected = cuisinePreferences.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCuisine(c)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Fine-Tuning Filters (Meal Type, Max Cook Time, Servings, Skill Level) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                {/* Meal Type */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Meal Type</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="High-Protein Snack">Snack</option>
                    <option value="Healthy Dessert">Dessert</option>
                  </select>
                </div>

                {/* Max Cooking Time */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Max Time</label>
                  <select
                    value={maxCookTime || ""}
                    onChange={(e) => setMaxCookTime(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="15">Under 15 min</option>
                    <option value="30">Under 30 min</option>
                    <option value="45">Under 45 min</option>
                    <option value="60">Under 60 min</option>
                    <option value="">Any time</option>
                  </select>
                </div>

                {/* Skill Level */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Skill Level</label>
                  <select
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Easy">Easy (1-Pot / Quick)</option>
                    <option value="Medium">Medium</option>
                    <option value="Advanced">Gourmet Chef</option>
                  </select>
                </div>

                {/* Servings */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Servings</label>
                  <select
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="4">4 People</option>
                    <option value="6">6 People</option>
                  </select>
                </div>
              </div>

              {/* 5. Custom Flavor / Mood Prompt (Optional) */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Additional Notes or Flavor Mood (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cozy warming soup, crispy texture, high iron focus, meal prep friendly..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Primary Generate Button */}
              <button
                type="button"
                onClick={handleGenerateRecipes}
                disabled={isLoading || ingredients.length === 0}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold text-sm sm:text-base rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{loadingStep || "Formulating Recipes with AI..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Complete Recipes with AI</span>
                  </>
                )}
              </button>
            </div>

            {/* RIGHT 5 COLS: INSPIRATION PRESETS & HOW IT WORKS */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Inspiration Presets Card */}
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>1-Click Inspiration Presets</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Quick Start</span>
                </div>

                <div className="space-y-2.5">
                  {INSPIRATION_PRESETS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => applyPreset(preset)}
                      className="group p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 text-left">
                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {preset.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {preset.ingredients.slice(0, 3).join(", ")} • {preset.cookTime}m
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Verification & Nutritional Science Explainer */}
              <div className="p-6 bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>How Foodora AI Recipes Work</span>
                </h4>
                <ul className="space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span>
                      <strong>Dynamic Inventory Matching:</strong> Maximizes ingredients you already have at home to minimize grocery waste.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span>
                      <strong>Precision Nutrition Profiling:</strong> Calculates estimated calories, macros (protein, carbs, fats, fiber), and Health Score (0-100).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span>
                      <strong>Interactive Cooking Mode:</strong> Follow step-by-step instructions with integrated countdown timers and ingredient checklists.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span>
                      <strong>1-Click Diary Logging:</strong> Log completed recipes directly to your Foodora AI daily nutrition goals.
                    </span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* 2. GENERATED RECIPES OUTPUT DISPLAY */}
          {lastGeneratedRecipes.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              
              {/* Section Header with Provenance Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Generated AI Recipes
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                      {lastGeneratedRecipes.length} Formulated
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Click any recipe card to open interactive cooking mode, view timers, check off ingredients, and scale servings.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateRecipes}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  <span>Regenerate Variations</span>
                </button>
              </div>

              {/* Recipe Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lastGeneratedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onSelect={(rec) => setSelectedRecipe(rec)}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: SAVED RECIPES VAULT */}
      {activeTab === "saved" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Saved Recipe Vault ({savedRecipes.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Your bookmarked AI-generated recipes stored locally for quick access anytime.
              </p>
            </div>

            {/* Search filter for saved recipes */}
            {savedRecipes.length > 0 && (
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter saved recipes..."
                  value={savedSearchQuery}
                  onChange={(e) => setSavedSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          {savedRecipes.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  No Saved Recipes Yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Generate recipes using the AI generator tab and tap the bookmark icon to save your favorite culinary creations here.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("generator")}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Generate First Recipe
              </button>
            </div>
          ) : filteredSavedRecipes.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-500 text-xs">
              No saved recipes match "{savedSearchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSavedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={(rec) => setSelectedRecipe(rec)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. ACTIVE RECIPE DETAIL MODAL */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />

    </div>
  );
};
