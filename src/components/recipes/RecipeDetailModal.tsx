import React, { useState } from "react";
import { GeneratedRecipe } from "../../types/food";
import { useFood } from "../../context/FoodContext";
import { CookingTimer } from "./CookingTimer";
import {
  X,
  Sparkles,
  Clock,
  ChefHat,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  PlusCircle,
  MessageSquare,
  Printer,
  Share2,
  AlertCircle,
  HelpCircle,
  Scale,
  Check,
  Utensils,
  Lightbulb,
  Heart,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import confetti from "canvas-confetti";

interface RecipeDetailModalProps {
  recipe: GeneratedRecipe | null;
  onClose: () => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
}) => {
  const {
    isRecipeSaved,
    saveRecipe,
    deleteSavedRecipe,
    logFood,
    setIsAskDrawerOpen,
    addChatMessage,
  } = useFood();

  const [activeTab, setActiveTab] = useState<"instructions" | "nutrition" | "flavor">("instructions");
  const [servingsScale, setServingsScale] = useState<number>(recipe?.servings || 2);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [isLogged, setIsLogged] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!recipe) return null;

  const baseServings = recipe.servings || 2;
  const multiplier = servingsScale / baseServings;
  const isSaved = isRecipeSaved(recipe.id);

  const toggleIngredientCheck = (index: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleStepComplete = (stepNum: number) => {
    setCompletedSteps((prev) => {
      const next = { ...prev, [stepNum]: !prev[stepNum] };
      // Check if all steps are completed
      if (Object.keys(next).length === recipe.instructions.length && Object.values(next).every(Boolean)) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10b981", "#6366f1", "#f59e0b"],
        });
      }
      return next;
    });
  };

  const handleToggleSave = () => {
    if (isSaved) {
      deleteSavedRecipe(recipe.id);
    } else {
      saveRecipe(recipe);
    }
  };

  const handleLogToDiary = () => {
    logFood({
      foodId: recipe.id,
      foodName: recipe.title,
      category: "Dishes & Meals",
      mealType: (recipe.mealType as any) || "Dinner",
      imageUrl: recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      servings: 1,
      grams: 300,
      calories: Math.round(recipe.calories),
      proteinG: Math.round(recipe.proteinG * 10) / 10,
      carbsG: Math.round(recipe.carbsG * 10) / 10,
      fatG: Math.round(recipe.fatG * 10) / 10,
      fiberG: Math.round(recipe.fiberG * 10) / 10,
      healthScore: recipe.healthScore,
      notes: `AI-Generated Recipe: ${recipe.subtitle}`,
    });

    setIsLogged(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#10b981", "#3b82f6", "#f59e0b"],
    });

    setTimeout(() => setIsLogged(false), 2500);
  };

  const handleAskAIAboutRecipe = () => {
    addChatMessage({
      role: "user",
      content: `I'm cooking the recipe "${recipe.title}". Can you suggest how to customize it or swap any ingredients?`,
    });
    setIsAskDrawerOpen(true);
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-850 dark:to-slate-900">
          <div className="space-y-2 max-w-2xl">
            {/* Badges & Provenance Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>AI-Generated Recipe</span>
              </div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Health Score {recipe.healthScore}/100</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {recipe.cuisine} • {recipe.difficulty} Level
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {recipe.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {recipe.subtitle}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Disclaimer Bar */}
        <div className="px-6 py-2.5 bg-amber-50/80 dark:bg-amber-950/40 border-b border-amber-200/60 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>AI Formulation Notice:</strong> Nutritional metrics and ingredient steps are dynamically estimated by Nutrimania AI based on USDA references and standard culinary physics.
            </span>
          </div>
          <span className="text-[10px] font-mono text-amber-600/80 dark:text-amber-400/80 hidden sm:inline whitespace-nowrap">
            {new Date(recipe.generationTimestamp).toLocaleDateString()}
          </span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Quick Metrics & Servings Adjuster Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-bold uppercase mb-1">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Total Time</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                {recipe.totalTimeMinutes || (recipe.prepTimeMinutes + recipe.cookTimeMinutes)}m
              </div>
              <div className="text-[11px] text-slate-500">
                Prep: {recipe.prepTimeMinutes}m | Cook: {recipe.cookTimeMinutes}m
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-bold uppercase mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Calories / Serv</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                {recipe.calories} <span className="text-xs font-normal text-slate-500">kcal</span>
              </div>
              <div className="text-[11px] text-slate-500">
                P: {recipe.proteinG}g | C: {recipe.carbsG}g | F: {recipe.fatG}g
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-bold uppercase mb-1">
                <ChefHat className="w-3.5 h-3.5 text-sky-500" />
                <span>Servings</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setServingsScale((prev) => Math.max(1, prev - 1))}
                  className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-300 flex items-center justify-center cursor-pointer text-xs"
                >
                  -
                </button>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                  {servingsScale}
                </span>
                <button
                  type="button"
                  onClick={() => setServingsScale((prev) => Math.min(12, prev + 1))}
                  className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-300 flex items-center justify-center cursor-pointer text-xs"
                >
                  +
                </button>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Scales ingredients</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-bold uppercase mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Health Score</span>
              </div>
              <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                {recipe.healthScore} <span className="text-xs text-slate-400">/100</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Fiber: {recipe.fiberG}g | Sodium: {recipe.sodiumMg}mg
              </div>
            </div>
          </div>

          {/* Dietary Tags & Highlights */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dietary:</span>
            {recipe.dietaryTags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Tab Navigation: Instructions & Cooking / Detailed Nutrition / Flavor Profile */}
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab("instructions")}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "instructions"
                  ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Ingredients & Steps
            </button>
            <button
              onClick={() => setActiveTab("nutrition")}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "nutrition"
                  ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Nutritional Breakdown
            </button>
            <button
              onClick={() => setActiveTab("flavor")}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "flavor"
                  ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Flavor & Chef Tips
            </button>
          </div>

          {/* TAB 1: INGREDIENTS & STEP-BY-STEP COOKING */}
          {activeTab === "instructions" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Interactive Ingredient Checklist */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Ingredients Checklist</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    {Object.values(checkedIngredients).filter(Boolean).length} / {recipe.ingredients.length} ready
                  </span>
                </div>

                <div className="space-y-2">
                  {recipe.ingredients.map((ing, idx) => {
                    const isChecked = Boolean(checkedIngredients[idx]);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleIngredientCheck(idx)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          isChecked
                            ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 opacity-80"
                            : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-emerald-400"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                            isChecked
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>

                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`font-bold ${
                                isChecked
                                  ? "line-through text-slate-400 dark:text-slate-500"
                                  : "text-slate-900 dark:text-white"
                              }`}
                            >
                              {ing.name}
                            </span>
                            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 whitespace-nowrap bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                              {multiplier !== 1 ? `(${multiplier}x) ` : ""}
                              {ing.amount}
                            </span>
                          </div>

                          {ing.isUserProvided && (
                            <span className="inline-block mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              ✓ Matches your input pantry
                            </span>
                          )}

                          {ing.substitutions && (
                            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 italic">
                              Sub: {ing.substitutions}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {recipe.missingOrOptionalIngredients && recipe.missingOrOptionalIngredients.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Optional Garnish / Additions:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
                      {recipe.missingOrOptionalIngredients.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column: Step-by-Step Cooking Walkthrough with Live Timers */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Preparation & Cooking Steps</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    {Object.values(completedSteps).filter(Boolean).length} / {recipe.instructions.length} steps completed
                  </span>
                </div>

                <div className="space-y-4">
                  {recipe.instructions.map((step, idx) => {
                    const isDone = Boolean(completedSteps[step.stepNumber]);
                    return (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl border transition-all ${
                          isDone
                            ? "bg-slate-50 dark:bg-slate-850/40 border-slate-200 dark:border-slate-800 opacity-75"
                            : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 shadow-xs"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                                isDone
                                  ? "bg-emerald-600 text-white"
                                  : "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                              }`}
                            >
                              {isDone ? <Check className="w-4 h-4" /> : step.stepNumber}
                            </span>
                            <h4
                              className={`text-sm font-bold ${
                                isDone ? "text-slate-500 line-through" : "text-slate-900 dark:text-white"
                              }`}
                            >
                              {step.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Step Timer if duration present */}
                            {step.durationMinutes && step.durationMinutes > 0 && (
                              <CookingTimer
                                initialMinutes={step.durationMinutes}
                                stepTitle={step.title}
                                onComplete={() => toggleStepComplete(step.stepNumber)}
                              />
                            )}

                            <button
                              type="button"
                              onClick={() => toggleStepComplete(step.stepNumber)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                                isDone
                                  ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                  : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                              }`}
                            >
                              {isDone ? "Done" : "Mark Done"}
                            </button>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-9">
                          {step.instruction}
                        </p>

                        {step.tip && (
                          <div className="mt-3 ml-9 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong>Chef Tip:</strong> {step.tip}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED NUTRITIONAL BREAKDOWN */}
          {activeTab === "nutrition" && (
            <div className="space-y-6">
              {/* Macro Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-emerald-500" />
                    <span>Estimated Per-Serving Macronutrients</span>
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-emerald-700 dark:text-emerald-400">Protein</span>
                        <span className="text-slate-900 dark:text-white">{recipe.proteinG}g</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (recipe.proteinG / 50) * 100)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-amber-700 dark:text-amber-400">Total Carbohydrates</span>
                        <span className="text-slate-900 dark:text-white">{recipe.carbsG}g</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (recipe.carbsG / 100) * 100)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-sky-700 dark:text-sky-400">Healthy Fats</span>
                        <span className="text-slate-900 dark:text-white">{recipe.fatG}g</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500" style={{ width: `${Math.min(100, (recipe.fatG / 40) * 100)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-purple-700 dark:text-purple-400">Dietary Fiber</span>
                        <span className="text-slate-900 dark:text-white">{recipe.fiberG}g</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${Math.min(100, (recipe.fiberG / 15) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Score Positives & Negatives */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Health Score Breakdown ({recipe.healthScore}/100)</span>
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1.5">
                        Key Health Positives:
                      </span>
                      <ul className="space-y-1">
                        {recipe.healthScoreFactors?.positives?.map((pos, i) => (
                          <li key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <span>{pos}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {recipe.healthScoreFactors?.negatives?.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1.5">
                          Things to Watch:
                        </span>
                        <ul className="space-y-1">
                          {recipe.healthScoreFactors.negatives.map((neg, i) => (
                            <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                              <span>{neg}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Nutrition Highlights Bullet points */}
              {recipe.nutritionHighlights && recipe.nutritionHighlights.length > 0 && (
                <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-2">
                    Nutritional & Micronutrient Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900 dark:text-emerald-200">
                    {recipe.nutritionHighlights.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FLAVOR PROFILE & CHEF TIPS */}
          {activeTab === "flavor" && (
            <div className="space-y-6">
              {/* Flavor Profile Bars */}
              {recipe.flavorProfile && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4">
                    Flavor Profile Matrix
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    {Object.entries(recipe.flavorProfile).map(([flavor, val]) => (
                      <div key={flavor} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="text-xs uppercase font-bold text-slate-400 capitalize">{flavor}</div>
                        <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                          {val}%
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ghibli Lore & Aesthetic Story Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-emerald-50/40 dark:from-slate-850 dark:via-amber-950/20 dark:to-slate-900 border border-amber-200 dark:border-amber-900/60 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Ghibli &amp; Midnight Diner Culinary Lore</span>
                </div>
                <p className="text-xs sm:text-sm font-serif italic text-slate-800 dark:text-slate-200 leading-relaxed">
                  {recipe.ghibliLore ||
                    `“As steam gently rises from the pan, the aroma of simmering ingredients fills the warm midnight kitchen. Each component unites into a dish crafted to restore your spirit and fuel your adventure through another vibrant day.”`}
                </p>
                <div className="flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-400/90 pt-1 font-semibold">
                  <span>🍃 Handcrafted AI Story Formulation</span>
                  <span>Nutrimania Culinary Studio</span>
                </div>
              </div>

              {/* Chef Tips */}
              {recipe.chefTips && recipe.chefTips.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Culinary Secrets & Storage Guidance</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {recipe.chefTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Ask AI Trigger */}
            <button
              type="button"
              onClick={handleAskAIAboutRecipe}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Ask AI to Customize</span>
              <span className="sm:hidden">Modify</span>
            </button>

            {/* Print Recipe */}
            <button
              type="button"
              onClick={handlePrint}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
              title="Print recipe"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Save Recipe */}
            <button
              type="button"
              onClick={handleToggleSave}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-xs transition-colors cursor-pointer ${
                isSaved
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
              <span>{isSaved ? "Saved" : "Save Recipe"}</span>
            </button>

            {/* Log to Daily Diary */}
            <button
              type="button"
              onClick={handleLogToDiary}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-all cursor-pointer shadow-md shadow-emerald-500/20 ${
                isLogged
                  ? "bg-emerald-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isLogged ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Logged to Diary!</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Log to Daily Diary</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
