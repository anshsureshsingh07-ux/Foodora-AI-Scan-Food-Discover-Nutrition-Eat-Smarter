import React, { useState, useEffect } from "react";
import { useFood } from "../../context/FoodContext";
import { FoodItem } from "../../types/food";
import { HealthScoreBadge } from "../common/HealthScoreBadge";
import {
  Scale,
  Plus,
  Trash2,
  Sparkles,
  Award,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export const FoodCompareView: React.FC = () => {
  const {
    comparisonItems,
    removeFromCompare,
    clearCompare,
    foodDatabase,
    addToCompare,
    setActiveFoodDetail,
  } = useFood();

  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [showAddPicker, setShowAddPicker] = useState(false);

  // If user enters with fewer than 2 items, pre-populate with 2 classic benchmark items
  useEffect(() => {
    if (comparisonItems.length < 2 && foodDatabase.length >= 2) {
      if (comparisonItems.length === 0) {
        addToCompare(foodDatabase[0]); // Avocado
        addToCompare(foodDatabase[1]); // Salmon
      } else if (comparisonItems.length === 1) {
        const other = foodDatabase.find((f) => f.id !== comparisonItems[0].id) || foodDatabase[1];
        addToCompare(other);
      }
    }
  }, []);

  // Trigger comparative AI analysis when items change
  useEffect(() => {
    if (comparisonItems.length >= 2) {
      fetchAiComparison();
    } else {
      setAiSummary(null);
    }
  }, [comparisonItems.map((f) => f.id).join(",")]);

  const fetchAiComparison = async () => {
    setIsAiAnalyzing(true);
    try {
      const response = await fetch("/api/gemini/compare-foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foods: comparisonItems.map((f) => ({
            name: f.name,
            calories: f.calories,
            proteinG: f.proteinG,
            carbsG: f.carbsG,
            fatG: f.fatG,
            fiberG: f.fiberG,
            healthScore: f.healthScore,
            category: f.category,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSummary(data.summary);
      }
    } catch (err) {
      console.error("Compare AI error:", err);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // Metrics finder for highest/lowest
  const highestProtein = comparisonItems.reduce(
    (max, f) => (f.proteinG > max.proteinG ? f : max),
    comparisonItems[0] || {}
  );
  const lowestCalories = comparisonItems.reduce(
    (min, f) => (f.calories < min.calories ? f : min),
    comparisonItems[0] || {}
  );
  const highestFiber = comparisonItems.reduce(
    (max, f) => (f.fiberG > max.fiberG ? f : max),
    comparisonItems[0] || {}
  );
  const highestHealthScore = comparisonItems.reduce(
    (max, f) => (f.healthScore > max.healthScore ? f : max),
    comparisonItems[0] || {}
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Scale className="w-4 h-4" />
            <span>Comparative Food Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Multi-Food Side-by-Side Comparison
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Compare nutrients, macros, density, and health scores across up to 4 foods simultaneously.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {comparisonItems.length < 4 && (
            <button
              onClick={() => setShowAddPicker(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Food ({comparisonItems.length}/4)</span>
            </button>
          )}
          {comparisonItems.length > 0 && (
            <button
              onClick={clearCompare}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-rose-500 text-xs font-semibold rounded-xl transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Food Picker Modal */}
      {showAddPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setShowAddPicker(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                Select Food to Compare
              </h3>
              <button onClick={() => setShowAddPicker(false)} className="text-zinc-400 hover:text-zinc-600">
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {foodDatabase.map((food) => {
                const alreadySelected = comparisonItems.some((f) => f.id === food.id);
                return (
                  <div
                    key={food.id}
                    onClick={() => {
                      if (!alreadySelected) {
                        addToCompare(food);
                        setShowAddPicker(false);
                      }
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      alreadySelected
                        ? "opacity-40 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 cursor-not-allowed"
                        : "hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 border-zinc-200 dark:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-white">
                          {food.name}
                        </h4>
                        <span className="text-[11px] text-zinc-500">{food.category}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white">
                        {food.calories} kcal
                      </span>
                      <span className="text-[11px] text-emerald-600 block">
                        Score {food.healthScore}/100
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* AI Comparison Report Card */}
      {comparisonItems.length >= 2 && (
        <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-zinc-900 border border-emerald-500/30 rounded-3xl p-6 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Sparkles className="w-5 h-5" />
            <span>AI Comparative Verdict & Trade-Off Summary</span>
          </div>

          {isAiAnalyzing ? (
            <div className="flex items-center gap-2 text-xs text-zinc-400 animate-pulse py-2">
              <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
              <span>Analyzing comparative nutritional profiles with Gemini...</span>
            </div>
          ) : aiSummary ? (
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">{aiSummary}</p>
          ) : (
            <p className="text-xs text-zinc-400">
              Comparing {comparisonItems.map((f) => f.name).join(" vs ")}. Both provide distinctive nutritional advantages.
            </p>
          )}

          {/* Quick Winner Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
            <div className="bg-zinc-900/80 border border-zinc-700/80 p-2.5 rounded-xl">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">Highest Protein</span>
              <span className="font-bold text-emerald-400 truncate block">{highestProtein?.name}</span>
              <span className="text-[11px] text-zinc-300 font-semibold">{highestProtein?.proteinG}g / serving</span>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-700/80 p-2.5 rounded-xl">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">Lowest Calorie</span>
              <span className="font-bold text-amber-400 truncate block">{lowestCalories?.name}</span>
              <span className="text-[11px] text-zinc-300 font-semibold">{lowestCalories?.calories} kcal</span>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-700/80 p-2.5 rounded-xl">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">Highest Fiber</span>
              <span className="font-bold text-teal-400 truncate block">{highestFiber?.name}</span>
              <span className="text-[11px] text-zinc-300 font-semibold">{highestFiber?.fiberG}g fiber</span>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-700/80 p-2.5 rounded-xl">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">Top Health Score</span>
              <span className="font-bold text-indigo-400 truncate block">{highestHealthScore?.name}</span>
              <span className="text-[11px] text-zinc-300 font-semibold">{highestHealthScore?.healthScore} / 100</span>
            </div>
          </div>
        </div>
      )}

      {/* Side by Side Grid Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {comparisonItems.map((food) => (
          <div
            key={food.id}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between space-y-4 relative"
          >
            {/* Remove button */}
            <button
              onClick={() => removeFromCompare(food.id)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all"
              title="Remove from comparison"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Top Image & Header */}
            <div>
              <div className="relative h-44 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <HealthScoreBadge score={food.healthScore} factors={food.healthScoreFactors} size="sm" />
                  <span className="text-xs font-bold text-white bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">
                    {food.servingSize}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {food.category}
                  </span>
                  <h3 className="font-extrabold text-base text-zinc-900 dark:text-white line-clamp-1">
                    {food.name}
                  </h3>
                </div>

                {/* Calorie Spotlight */}
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Energy</span>
                  <div className="text-2xl font-black text-zinc-900 dark:text-white flex items-baseline justify-center gap-1">
                    <Flame className="w-4 h-4 text-amber-500" />
                    {food.calories}
                    <span className="text-xs font-bold text-zinc-400">kcal</span>
                  </div>
                </div>

                {/* Macro Specs Table */}
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                  <div className="py-2 flex justify-between">
                    <span className="text-zinc-500">Protein</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{food.proteinG}g</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-zinc-500">Total Carbs</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{food.carbsG}g</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-zinc-500">Dietary Fiber</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">{food.fiberG}g</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-zinc-500">Total Fat</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{food.fatG}g</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-zinc-500">Sodium</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{food.sodiumMg}mg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-4 pt-0">
              <button
                onClick={() => setActiveFoodDetail(food)}
                className="w-full py-2 bg-zinc-100 hover:bg-emerald-600 hover:text-white dark:bg-zinc-800 dark:hover:bg-emerald-600 text-zinc-800 dark:text-zinc-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span>Full Intelligence Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
