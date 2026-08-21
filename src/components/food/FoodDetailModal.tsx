import React, { useState } from "react";
import { FoodItem, FoodVariationOption, MealType } from "../../types/food";
import { useFood } from "../../context/FoodContext";
import { NutritionTable } from "../common/NutritionTable";
import { HealthScoreBadge } from "../common/HealthScoreBadge";
import {
  X,
  ShieldCheck,
  Sparkles,
  Heart,
  Scale,
  Plus,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Share2,
  Calendar,
  Globe,
  Tag,
  Building,
  Barcode,
  Flame,
  Layers,
  HelpCircle,
  ChefHat,
  Compass,
  Languages,
} from "lucide-react";

interface FoodDetailModalProps {
  food: FoodItem | null;
  onClose: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ food, onClose }) => {
  const {
    toggleFavorite,
    isFavorite,
    addToCompare,
    removeFromCompare,
    comparisonItems,
    logFood,
    setIsAskDrawerOpen,
    addChatMessage,
  } = useFood();

  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [selectedMealType, setSelectedMealType] = useState<MealType>("Lunch");
  const [isLoggedSuccess, setIsLoggedSuccess] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<FoodVariationOption | null>(null);
  const [nutritionTab, setNutritionTab] = useState<"serving" | "100g">("serving");

  if (!food) return null;

  const isFav = isFavorite(food.id);
  const isCompared = comparisonItems.some((f) => f.id === food.id);

  // Compute active nutritional numbers based on selected recipe variation if chosen
  const activeCalories = selectedVariation ? selectedVariation.calories : food.calories;
  const activeProtein = selectedVariation ? selectedVariation.proteinG : food.proteinG;
  const activeCarbs = selectedVariation ? selectedVariation.carbsG : food.carbsG;
  const activeFat = selectedVariation ? selectedVariation.fatG : food.fatG;
  const activeHealthScore = selectedVariation ? selectedVariation.healthScore : food.healthScore;
  const activeServingTitle = selectedVariation ? `${food.servingSize} (${selectedVariation.variationName})` : food.servingSize;

  const handleLogToDiary = () => {
    logFood({
      foodId: food.id,
      foodName: selectedVariation ? `${food.name} [${selectedVariation.variationName}]` : food.name,
      category: food.category,
      mealType: selectedMealType,
      imageUrl: food.imageUrl,
      servings: servingMultiplier,
      grams: Math.round(food.servingWeightGrams * servingMultiplier),
      calories: Math.round(activeCalories * servingMultiplier),
      proteinG: Number((activeProtein * servingMultiplier).toFixed(1)),
      carbsG: Number((activeCarbs * servingMultiplier).toFixed(1)),
      fatG: Number((activeFat * servingMultiplier).toFixed(1)),
      fiberG: Number((food.fiberG * servingMultiplier).toFixed(1)),
      healthScore: activeHealthScore,
    });
    setIsLoggedSuccess(true);
    setTimeout(() => setIsLoggedSuccess(false), 2500);
  };

  const handleAskAboutThisFood = () => {
    addChatMessage({
      role: "user",
      content: `Can you explain the nutritional benefits, regional authentic variations, and ingredient quality of ${food.name}?`,
      foodContext: food,
    });
    setIsAskDrawerOpen(true);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative my-auto transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          {/* Top Geographic & Classification Tags */}
          <div className="absolute top-4 left-4 right-16 flex flex-wrap items-center gap-2">
            {food.isVerified ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Standard
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                AI Inference ({food.confidenceScore || 95}%)
              </span>
            )}

            {food.foodType && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-md">
                {food.foodType}
              </span>
            )}

            {food.cuisine && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/25 text-white backdrop-blur-md">
                {food.cuisine}
              </span>
            )}
          </div>

          {/* Geographic Breadcrumbs Overlay */}
          {(food.continent || food.country || food.regionOrState || food.cityOrLocality) && (
            <div className="absolute bottom-16 left-4 right-4 flex items-center gap-1.5 text-[11px] font-medium text-emerald-300 backdrop-blur-xs flex-wrap">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {[food.continent, food.country, food.regionOrState, food.cityOrLocality].filter(Boolean).join(" → ")}
              </span>
            </div>
          )}

          {/* Bottom Title & Multilingual Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                {food.category}
              </span>
              {food.localScript && (
                <span className="text-[11px] text-slate-300 font-medium">
                  ({food.localScript})
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{food.name}</h1>
              {food.localName && (
                <span className="text-xl sm:text-2xl font-bold text-emerald-300">
                  {food.localName}
                </span>
              )}
            </div>

            {(food.transliteration || food.englishName || (food.alternateNames && food.alternateNames.length > 0)) && (
              <p className="text-xs text-slate-300">
                {food.englishName && <span className="font-semibold text-white">{food.englishName}</span>}
                {food.transliteration && <span> • Rom: {food.transliteration}</span>}
                {food.alternateNames && food.alternateNames.length > 0 && (
                  <span> • Aliases: {food.alternateNames.join(", ")}</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8 space-y-6">
          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <HealthScoreBadge
                score={activeHealthScore}
                factors={food.healthScoreFactors}
                size="lg"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Health Index: {activeHealthScore}/100
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedVariation ? `Calculated for ${selectedVariation.variationName}` : "Holistic macro balance & micronutrients"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (isCompared) removeFromCompare(food.id);
                  else addToCompare(food);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isCompared
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>{isCompared ? "In Compare" : "Compare"}</span>
              </button>

              <button
                onClick={() => toggleFavorite(food.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isFav
                    ? "bg-rose-50 dark:bg-rose-950 border-rose-300 text-rose-600"
                    : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                title="Save to favorites"
              >
                <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>

              <button
                onClick={handleAskAboutThisFood}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Ask Fura AI</span>
              </button>
            </div>
          </div>

          {/* DISAMBIGUATION SECTION: "We found multiple versions of this dish. Which one did you eat?" */}
          {food.recipeVariations && food.recipeVariations.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-50/70 to-purple-50/50 dark:from-indigo-950/40 dark:to-purple-950/30 p-5 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    We found multiple versions of this dish. Which one did you eat?
                  </h3>
                </div>
                {selectedVariation && (
                  <button
                    onClick={() => setSelectedVariation(null)}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Reset to Default
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Nutritional values (especially oil, sodium, and fat) swing significantly between home-cooked, authentic restaurant, and street vendor preparations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                {food.recipeVariations.map((variation) => {
                  const isSelected = selectedVariation?.id === variation.id;
                  return (
                    <div
                      key={variation.id}
                      onClick={() => setSelectedVariation(isSelected ? null : variation)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? "bg-white dark:bg-slate-900 border-indigo-500 shadow-md ring-2 ring-indigo-500/20"
                          : "bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                          {variation.variationName}
                        </span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300">
                          {variation.calories} kcal
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                        {variation.keyDifference || variation.description}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 font-semibold border-t border-slate-100 dark:border-slate-800 pt-1.5">
                        <span>P: {variation.proteinG}g | C: {variation.carbsG}g | F: {variation.fatG}g</span>
                        <span className={`px-1.5 py-0.2 rounded font-bold ${
                          variation.healthScore >= 80 ? "text-emerald-600" : "text-amber-600"
                        }`}>
                          HS {variation.healthScore}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recipe Warning Banner */}
          {food.recipeWarning && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">{food.recipeWarning}</p>
            </div>
          )}

          {/* Description & Overview */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
            <p>{food.description}</p>
            {food.preparationMethod && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Preparation & Culinary Method: </span>
                <span className="text-slate-600 dark:text-slate-400">{food.preparationMethod}</span>
              </div>
            )}
          </div>

          {/* Dietary Badges */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Dietary Profiles & Classifications
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {food.dietaryFlags.isVegetarian && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  🌱 Vegetarian
                </span>
              )}
              {food.dietaryFlags.isVegan && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  🌿 100% Vegan
                </span>
              )}
              {food.dietaryFlags.isGlutenFree && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  🌾 Gluten-Free
                </span>
              )}
              {food.dietaryFlags.isDairyFree && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  🥛 Dairy-Free
                </span>
              )}
              {food.dietaryFlags.isNutFree && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  🥜 Nut-Free
                </span>
              )}
              {food.dietaryFlags.isHighProtein && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  💪 High Protein
                </span>
              )}
              {food.dietaryFlags.isHighFiber && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-lime-50 dark:bg-lime-950/60 text-lime-700 dark:text-lime-300 border border-lime-200 dark:border-lime-800">
                  🌾 High Fiber
                </span>
              )}
              {food.dietaryFlags.isJain && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                  ✨ Jain Friendly
                </span>
              )}
              {food.dietaryFlags.isHalal && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  🌙 Halal
                </span>
              )}
            </div>
          </div>

          {/* Nutrition Table with Per 100g vs Per Serving Switcher */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Nutritional Breakdown
              </h3>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setNutritionTab("serving")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    nutritionTab === "serving"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Per Serving ({food.servingWeightGrams || 100}g)
                </button>
                <button
                  onClick={() => setNutritionTab("100g")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    nutritionTab === "100g"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Per 100g
                </button>
              </div>
            </div>

            {nutritionTab === "serving" ? (
              <NutritionTable
                food={{
                  ...food,
                  calories: activeCalories,
                  proteinG: activeProtein,
                  carbsG: activeCarbs,
                  fatG: activeFat,
                }}
                servingMultiplier={servingMultiplier}
                onMultiplierChange={setServingMultiplier}
              />
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Energy</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {food.per100g ? food.per100g.calories : Math.round((food.calories / (food.servingWeightGrams || 100)) * 100)} kcal
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-emerald-500 block">Protein</span>
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                      {food.per100g ? food.per100g.proteinG : ((food.proteinG / (food.servingWeightGrams || 100)) * 100).toFixed(1)}g
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-amber-500 block">Carbs</span>
                    <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                      {food.per100g ? food.per100g.carbsG : ((food.carbsG / (food.servingWeightGrams || 100)) * 100).toFixed(1)}g
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-rose-500 block">Fat</span>
                    <span className="text-base font-extrabold text-rose-600 dark:text-rose-400">
                      {food.per100g ? food.per100g.fatG : ((food.fatG / (food.servingWeightGrams || 100)) * 100).toFixed(1)}g
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 text-center">
                  Standard 100g reference baseline conforming to USDA / ICMR-NIN food composition tables.
                </p>
              </div>
            )}
          </div>

          {/* Primary & Optional Ingredients */}
          {(food.primaryIngredients || food.optionalIngredients || (food.ingredients && food.ingredients.length > 0)) && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Recipe Formulation & Ingredients
              </h3>

              {/* Primary Ingredients */}
              {food.primaryIngredients && food.primaryIngredients.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1.5">
                    Primary Core Ingredients:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {food.primaryIngredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-700"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Ingredients */}
              {food.optionalIngredients && food.optionalIngredients.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block mb-1.5">
                    Optional / Regional Variations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {food.optionalIngredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-medium border border-purple-200 dark:border-purple-800"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlighted Allergens */}
              {food.allergens && food.allergens.length > 0 ? (
                <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl p-3 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-rose-900 dark:text-rose-200 block">
                      Contains Allergens:
                    </span>
                    <span className="text-rose-700 dark:text-rose-300 font-medium">
                      {food.allergens.join(", ")}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  No common major allergens detected in authentic primary formulation.
                </div>
              )}
            </div>
          )}

          {/* Verification & Data Provenance */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-500" />
                Data Source & Verification:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {food.dataSource || "Fura AI Global Food Knowledge Benchmark"}
              </span>
            </div>
            {food.lastVerifiedDate && (
              <p className="text-[11px] text-slate-500">
                Last verified audit: {food.lastVerifiedDate}
              </p>
            )}
            {food.barcode && (
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Barcode className="w-3.5 h-3.5" />
                Barcode UPC: <span className="font-mono">{food.barcode}</span>
              </p>
            )}
          </div>

          {/* Sticky Log to Diary CTA */}
          <div className="bg-slate-950 text-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div>
                <span className="text-xs text-slate-400 block">
                  Log to Daily Food Diary {selectedVariation && `(${selectedVariation.variationName})`}:
                </span>
                <span className="font-bold text-base">
                  {Math.round(activeCalories * servingMultiplier)} kcal ({servingMultiplier}x portion)
                </span>
              </div>

              {/* Meal type selector */}
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value as MealType)}
                className="bg-slate-800 dark:bg-slate-700 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>

            <button
              onClick={handleLogToDiary}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Food</span>
            </button>
          </div>

          {isLoggedSuccess && (
            <div className="bg-emerald-600 text-white p-3 rounded-xl text-center text-xs font-bold animate-in fade-in">
              ✓ Successfully logged to Today's {selectedMealType}!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

