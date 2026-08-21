import React, { useState } from "react";
import { GeneratedRecipe } from "../../types/food";
import { useFood } from "../../context/FoodContext";
import {
  Clock,
  Flame,
  ChefHat,
  Bookmark,
  PlusCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Info,
} from "lucide-react";
import confetti from "canvas-confetti";

interface RecipeCardProps {
  recipe: GeneratedRecipe;
  onSelect: (recipe: GeneratedRecipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  const { isRecipeSaved, saveRecipe, deleteSavedRecipe, logFood } = useFood();
  const [isLogged, setIsLogged] = useState(false);

  const saved = isRecipeSaved(recipe.id);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      deleteSavedRecipe(recipe.id);
    } else {
      saveRecipe(recipe);
    }
  };

  const handleQuickLog = (e: React.MouseEvent) => {
    e.stopPropagation();
    logFood({
      foodId: recipe.id,
      foodName: recipe.title,
      category: "Dishes & Meals",
      mealType: (recipe.mealType as any) || "Dinner",
      imageUrl: recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      servings: 1,
      grams: 300,
      calories: recipe.calories,
      proteinG: recipe.proteinG,
      carbsG: recipe.carbsG,
      fatG: recipe.fatG,
      fiberG: recipe.fiberG,
      healthScore: recipe.healthScore,
      notes: `AI-Generated Recipe: ${recipe.subtitle}`,
    });

    setIsLogged(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
      colors: ["#10b981", "#3b82f6", "#f59e0b"],
    });

    setTimeout(() => setIsLogged(false), 2500);
  };

  // Health Score Color
  const getHealthScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800";
    if (score >= 70) return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800";
    return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800";
  };

  return (
    <div
      id={`recipe-card-${recipe.id}`}
      onClick={() => onSelect(recipe)}
      className="group relative flex flex-col justify-between p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Top Tag Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          {/* AI-Generated Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-extrabold tracking-wide uppercase">
            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>AI Recipe</span>
          </div>

          {/* Health Score Pill */}
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-extrabold ${getHealthScoreColor(
              recipe.healthScore
            )}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Score {recipe.healthScore}/100</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{recipe.cuisine}</span>
            <span>•</span>
            <span>{recipe.mealType || "Main Dish"}</span>
            <span>•</span>
            <span>{recipe.difficulty}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
            {recipe.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {recipe.subtitle}
          </p>
        </div>

        {/* Dietary & Ingredient Match Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {recipe.matchedIngredientsCount !== undefined && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
              {recipe.matchedIngredientsCount} / {recipe.totalIngredientsCount || recipe.ingredients.length} Ingredients Matched
            </span>
          )}
          {recipe.dietaryTags?.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Nutrition Macro Matrix */}
        <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Calories</div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
              {recipe.calories}
              <span className="text-[9px] font-normal text-slate-400 block">kcal</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Protein</div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
              {recipe.proteinG}
              <span className="text-[9px] font-normal text-slate-400 block">g</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Carbs</div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
              {recipe.carbsG}
              <span className="text-[9px] font-normal text-slate-400 block">g</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400">Fat</div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
              {recipe.fatG}
              <span className="text-[9px] font-normal text-slate-400 block">g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Timing & Actions */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{recipe.totalTimeMinutes || (recipe.prepTimeMinutes + recipe.cookTimeMinutes)}m total</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <ChefHat className="w-3.5 h-3.5 text-slate-400" />
            <span>{recipe.servings} {recipe.servings === 1 ? "serv" : "servings"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Log to Diary Button */}
          <button
            type="button"
            onClick={handleQuickLog}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isLogged
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600"
            }`}
            title="Quick log 1 serving to today's food diary"
          >
            {isLogged ? <Check className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          </button>

          {/* Bookmark / Save Recipe */}
          <button
            type="button"
            onClick={handleToggleSave}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              saved
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600"
            }`}
            title={saved ? "Remove from saved recipes" : "Save recipe to favorites"}
          >
            <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
          </button>

          {/* View Recipe Action */}
          <button
            type="button"
            className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <span>Cook</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
