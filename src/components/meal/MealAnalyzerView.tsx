import React, { useState } from "react";
import { useFood } from "../../context/FoodContext";
import { MealAnalysisResult, DetectedMealItem, MealType } from "../../types/food";
import {
  Layers,
  Upload,
  Sparkles,
  Plus,
  Trash2,
  AlertTriangle,
  Flame,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export const MealAnalyzerView: React.FC = () => {
  const { logFood } = useFood();

  const [mealImage, setMealImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mealType, setMealType] = useState<MealType>("Lunch");
  const [loggedSuccess, setLoggedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<MealAnalysisResult | null>(null);

  // Preset multi-item meal plates for easy instant testing
  const mealPresets = [
    {
      title: "Mediterranean Quinoa & Salmon Bowl",
      url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "South Indian Thali Platter",
      url: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Japanese Salmon Bento Box",
      url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Gourmet Garden Salad Bowl",
      url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setMealImage(base64);
        analyzeMeal(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeMeal = async (imageUrl: string, titleHint?: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/gemini/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: !imageUrl.startsWith("data:") ? imageUrl : undefined,
          imageData: imageUrl.startsWith("data:") ? imageUrl : undefined,
          mealDescription: titleHint,
        }),
      });

      if (response.ok) {
        const data: MealAnalysisResult = await response.json();
        if (data && data.items && data.items.length > 0) {
          setAnalysisResult(data);
        } else {
          setErrorMessage("We couldn't detect distinct meal components in this image. Please ensure the plate is clearly visible.");
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        setErrorMessage(errJson.error || "Meal analysis is temporarily unavailable. Please try another image.");
      }
    } catch (err: any) {
      console.error("Meal analysis error:", err);
      setErrorMessage("Could not connect to the meal analysis service. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Allow user to dynamically tweak grams of individual items
  const updateComponentGrams = (id: string, newGrams: number) => {
    if (!analysisResult) return;
    setAnalysisResult((prev) => {
      if (!prev) return null;
      const updatedItems = prev.items.map((item) => {
        if (item.id === id) {
          const ratio = Math.max(0.1, newGrams / (item.portionGrams || 1));
          return {
            ...item,
            portionGrams: newGrams,
            calories: Math.round(item.calories * ratio),
            proteinG: Number((item.proteinG * ratio).toFixed(1)),
            carbsG: Number((item.carbsG * ratio).toFixed(1)),
            fatG: Number((item.fatG * ratio).toFixed(1)),
          };
        }
        return item;
      });

      const totalCalories = updatedItems.reduce((s, c) => s + c.calories, 0);
      const totalProteinG = Number(updatedItems.reduce((s, c) => s + c.proteinG, 0).toFixed(1));
      const totalCarbsG = Number(updatedItems.reduce((s, c) => s + c.carbsG, 0).toFixed(1));
      const totalFatG = Number(updatedItems.reduce((s, c) => s + c.fatG, 0).toFixed(1));
      const totalFiberG = Number(updatedItems.reduce((s, c) => s + (c.fiberG || 0), 0).toFixed(1));
      const totalSodiumMg = Math.round(updatedItems.reduce((s, c) => s + (c.sodiumMg || 0), 0));

      return {
        ...prev,
        items: updatedItems,
        totalMeal: {
          ...prev.totalMeal,
          totalCalories,
          totalProteinG,
          totalCarbsG,
          totalFatG,
          totalFiberG,
          totalSodiumMg,
        },
      };
    });
  };

  const removeComponent = (id: string) => {
    if (!analysisResult) return;
    setAnalysisResult((prev) => {
      if (!prev) return null;
      const filtered = prev.items.filter((c) => c.id !== id);
      const totalCalories = filtered.reduce((s, c) => s + c.calories, 0);
      const totalProteinG = Number(filtered.reduce((s, c) => s + c.proteinG, 0).toFixed(1));
      const totalCarbsG = Number(filtered.reduce((s, c) => s + c.carbsG, 0).toFixed(1));
      const totalFatG = Number(filtered.reduce((s, c) => s + c.fatG, 0).toFixed(1));
      const totalFiberG = Number(filtered.reduce((s, c) => s + (c.fiberG || 0), 0).toFixed(1));
      const totalSodiumMg = Math.round(filtered.reduce((s, c) => s + (c.sodiumMg || 0), 0));

      return {
        ...prev,
        items: filtered,
        totalMeal: {
          ...prev.totalMeal,
          totalCalories,
          totalProteinG,
          totalCarbsG,
          totalFatG,
          totalFiberG,
          totalSodiumMg,
        },
      };
    });
  };

  const handleLogWholeMeal = () => {
    if (!analysisResult) return;
    logFood({
      foodId: `meal-${Date.now()}`,
      foodName: analysisResult.mealTitle || "Multi-Item Meal",
      category: "Dishes & Meals",
      mealType,
      imageUrl: mealImage || undefined,
      servings: 1,
      grams: analysisResult.items.reduce((sum, c) => sum + c.portionGrams, 0),
      calories: analysisResult.totalMeal?.totalCalories || 0,
      proteinG: analysisResult.totalMeal?.totalProteinG || 0,
      carbsG: analysisResult.totalMeal?.totalCarbsG || 0,
      fatG: analysisResult.totalMeal?.totalFatG || 0,
      fiberG: analysisResult.totalMeal?.totalFiberG || 5,
      healthScore: analysisResult.overallHealthScore || 80,
    });
    setLoggedSuccess(true);
    setTimeout(() => setLoggedSuccess(false), 2500);
  };

  const pCal = (analysisResult?.totalMeal?.totalProteinG || 0) * 4;
  const cCal = (analysisResult?.totalMeal?.totalCarbsG || 0) * 4;
  const fCal = (analysisResult?.totalMeal?.totalFatG || 0) * 9;
  const totalMacroCal = Math.max(1, pCal + cCal + fCal);
  const pPct = Math.round((pCal / totalMacroCal) * 100);
  const cPct = Math.round((cCal / totalMacroCal) * 100);
  const fPct = Math.round((fCal / totalMacroCal) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Layers className="w-4 h-4" />
            <span>AI Plate Vision Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Multi-Dish Meal Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Segment complex plates into individual components, edit portion sizes, and calculate combined macros.
          </p>
        </div>

        {/* Upload Button */}
        <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95">
          <Upload className="w-4 h-4" />
          <span>Upload Custom Plate</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Preset Plates Strip */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
          Or Select a Sample Plate for Multi-Item Analysis:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {mealPresets.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => {
                setMealImage(preset.url);
                analyzeMeal(preset.url, preset.title);
              }}
              className={`group relative h-24 rounded-xl overflow-hidden border cursor-pointer transition-all ${
                mealImage === preset.url
                  ? "border-emerald-500 ring-2 ring-emerald-500/40"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
              }`}
            >
              <img
                src={preset.url}
                alt={preset.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
                <span className="text-[11px] font-bold text-white leading-tight line-clamp-2">
                  {preset.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error notification */}
      {errorMessage && !isAnalyzing && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Meal Segmentation Notice</h4>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Empty State when no plate is selected yet */}
      {!analysisResult && !isAnalyzing && !errorMessage && (
        <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl p-12 text-center space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
              Select or Upload a Meal Photo
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Foodora Gemini Multimodal will automatically detect individual ingredients, estimate volume in grams, and compute individual and aggregate macro breakdown.
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isAnalyzing && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto animate-spin">
            <RefreshCw className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-zinc-900 dark:text-white">
            Segmenting Multi-Item Plate with Gemini Vision...
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Extracting ingredient boundaries, depth profiles, and macronutrient distributions for each item on the plate.
          </p>
        </div>
      )}

      {/* Main Analysis Display Grid */}
      {analysisResult && !isAnalyzing && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image & Aggregate Summary */}
          <div className="lg:col-span-5 space-y-5">
            {mealImage && (
              <div className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-black shadow-lg">
                <img src={mealImage} alt="Meal" className="w-full h-64 sm:h-80 object-cover" />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Multi-Item Segmented</span>
                </div>
              </div>
            )}

            {/* Aggregate Nutrition Summary Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Aggregate Total
                  </span>
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                    {analysisResult.mealTitle}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-zinc-900 dark:text-white flex items-baseline gap-1">
                    <Flame className="w-5 h-5 text-amber-500" />
                    {analysisResult.totalMeal?.totalCalories || 0}
                    <span className="text-xs font-bold text-zinc-400 uppercase">kcal</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Score: {analysisResult.overallHealthScore}/100
                  </span>
                </div>
              </div>

              {/* Macro Bar */}
              <div className="space-y-2">
                <div className="h-3 w-full rounded-full overflow-hidden flex bg-zinc-100 dark:bg-zinc-800">
                  <div style={{ width: `${pPct}%` }} className="bg-emerald-500 h-full" />
                  <div style={{ width: `${cPct}%` }} className="bg-amber-500 h-full" />
                  <div style={{ width: `${fPct}%` }} className="bg-rose-500 h-full" />
                </div>
                <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {analysisResult.totalMeal?.totalProteinG || 0}g Protein ({pPct}%)
                  </span>
                  <span className="text-amber-600 dark:text-amber-400">
                    {analysisResult.totalMeal?.totalCarbsG || 0}g Carbs ({cPct}%)
                  </span>
                  <span className="text-rose-600 dark:text-rose-400">
                    {analysisResult.totalMeal?.totalFatG || 0}g Fat ({fPct}%)
                  </span>
                </div>
              </div>

              {/* Log to Diary Box */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Log As Meal:</span>
                  <div className="flex gap-1">
                    {(["Breakfast", "Lunch", "Dinner", "Snacks"] as MealType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setMealType(t)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          mealType === t
                            ? "bg-emerald-600 text-white font-bold"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleLogWholeMeal}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Entire Meal ({analysisResult.totalMeal?.totalCalories || 0} kcal)</span>
                </button>

                {loggedSuccess && (
                  <div className="text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    ✓ Successfully saved to Today's {mealType}!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Segmented Components */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                Identified Plate Components ({analysisResult.items.length})
              </h3>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Adjust gram sliders to calibrate portion accuracy
              </span>
            </div>

            <div className="space-y-3">
              {analysisResult.items.map((comp) => (
                <div
                  key={comp.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs space-y-3 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                          {comp.name}
                        </h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          {comp.confidence}% Match
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-zinc-900 dark:text-white">
                        {comp.calories} <span className="text-[10px] text-zinc-400 font-normal">kcal</span>
                      </span>
                      <button
                        onClick={() => removeComponent(comp.id)}
                        className="text-zinc-400 hover:text-rose-500 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Gram slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                      <span>Estimated Portion:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {comp.portionGrams}g
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="5"
                      value={comp.portionGrams}
                      onChange={(e) => updateComponentGrams(comp.id, Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Macro summary pill for component */}
                  <div className="flex items-center justify-between text-xs bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-300">
                    <span>Protein: <strong className="text-emerald-600">{comp.proteinG}g</strong></span>
                    <span>Carbs: <strong className="text-amber-600">{comp.carbsG}g</strong></span>
                    <span>Fat: <strong className="text-rose-600">{comp.fatG}g</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Health Assessment / notes */}
            {analysisResult.healthAssessment && (
              <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-zinc-800 dark:text-zinc-200">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>AI Nutritional Assessment:</span>
                </div>
                <p className="leading-relaxed">{analysisResult.healthAssessment}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
