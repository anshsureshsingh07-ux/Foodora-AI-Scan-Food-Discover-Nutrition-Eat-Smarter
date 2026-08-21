import React, { useState } from "react";
import { FoodItem } from "../../types/food";
import { Scale, Zap, Shield, ChevronDown, ChevronUp } from "lucide-react";

interface NutritionTableProps {
  food: FoodItem;
  servingMultiplier?: number;
  onMultiplierChange?: (m: number) => void;
}

export const NutritionTable: React.FC<NutritionTableProps> = ({
  food,
  servingMultiplier = 1,
  onMultiplierChange,
}) => {
  const [viewMode, setViewMode] = useState<"serving" | "100g">("serving");
  const [showMicros, setShowMicros] = useState(true);

  // Ratio for 100g vs serving
  const servingGrams = food.servingWeightGrams || 100;
  const ratio = viewMode === "100g" ? 100 / servingGrams : servingMultiplier;

  const cal = Math.round(food.calories * ratio);
  const protein = ((food.proteinG || 0) * ratio).toFixed(1);
  const carbs = ((food.carbsG || 0) * ratio).toFixed(1);
  const fat = ((food.fatG || 0) * ratio).toFixed(1);
  const fiber = ((food.fiberG || 0) * ratio).toFixed(1);
  const sugar = ((food.totalSugarG || 0) * ratio).toFixed(1);
  const addedSugar = food.addedSugarG !== undefined ? (food.addedSugarG * ratio).toFixed(1) : undefined;
  const satFat = food.saturatedFatG !== undefined ? (food.saturatedFatG * ratio).toFixed(1) : undefined;
  const transFat = food.transFatG !== undefined ? (food.transFatG * ratio).toFixed(1) : "0.0";
  const sodium = Math.round((food.sodiumMg || 0) * ratio);
  const potassium = food.potassiumMg ? Math.round(food.potassiumMg * ratio) : undefined;
  const cholesterol = food.cholesterolMg !== undefined ? Math.round(food.cholesterolMg * ratio) : undefined;

  // Macro calorie breakdown percentages
  const proteinCal = Number(protein) * 4;
  const carbsCal = Number(carbs) * 4;
  const fatCal = Number(fat) * 9;
  const totalMacroCal = Math.max(1, proteinCal + carbsCal + fatCal);

  const proteinPct = Math.round((proteinCal / totalMacroCal) * 100);
  const carbsPct = Math.round((carbsCal / totalMacroCal) * 100);
  const fatPct = Math.round((fatCal / totalMacroCal) * 100);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header & Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            Nutrition Facts
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {viewMode === "serving"
              ? `Serving: ${food.servingSize} (${Math.round(servingGrams * servingMultiplier)}g)`
              : "Standard reference per 100 grams"}
          </p>
        </div>

        <div className="flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-800 p-0.5 text-xs font-semibold">
          <button
            onClick={() => setViewMode("serving")}
            className={`px-3 py-1 rounded-md transition-all ${
              viewMode === "serving"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800"
            }`}
          >
            Per Serving
          </button>
          <button
            onClick={() => setViewMode("100g")}
            className={`px-3 py-1 rounded-md transition-all ${
              viewMode === "100g"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800"
            }`}
          >
            Per 100g
          </button>
        </div>
      </div>

      {/* Serving Multiplier Selector (if in Per Serving mode) */}
      {viewMode === "serving" && onMultiplierChange && (
        <div className="flex items-center justify-between text-xs bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Portion Size:</span>
          <div className="flex items-center gap-1.5">
            {[0.5, 1, 1.5, 2].map((m) => (
              <button
                key={m}
                onClick={() => onMultiplierChange(m)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  servingMultiplier === m
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {m}x
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Calories & Macro Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
        <div className="sm:border-r border-zinc-200 dark:border-zinc-700 pr-3">
          <span className="text-xs uppercase font-bold text-zinc-400 dark:text-zinc-500">Energy</span>
          <div className="text-3xl font-black text-zinc-900 dark:text-white flex items-baseline gap-1">
            {cal}
            <span className="text-xs font-bold text-zinc-500 uppercase">kcal</span>
          </div>
        </div>

        <div className="sm:col-span-3 space-y-2">
          {/* Macro Split visual bar */}
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-zinc-200 dark:bg-zinc-700">
            <div
              style={{ width: `${proteinPct}%` }}
              className="bg-emerald-500 h-full transition-all"
              title={`Protein ${proteinPct}%`}
            />
            <div
              style={{ width: `${carbsPct}%` }}
              className="bg-amber-500 h-full transition-all"
              title={`Carbs ${carbsPct}%`}
            />
            <div
              style={{ width: `${fatPct}%` }}
              className="bg-rose-500 h-full transition-all"
              title={`Fat ${fatPct}%`}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <strong>{protein}g</strong> Protein ({proteinPct}%)
            </span>
            <span className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <strong>{carbs}g</strong> Carbs ({carbsPct}%)
            </span>
            <span className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <strong>{fat}g</strong> Fat ({fatPct}%)
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Nutrient Rows */}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
        <div className="py-2 flex justify-between items-center font-semibold text-zinc-800 dark:text-zinc-200">
          <span>Total Carbohydrates</span>
          <span>{carbs}g</span>
        </div>
        <div className="py-1.5 pl-4 flex justify-between items-center text-zinc-600 dark:text-zinc-400">
          <span>Dietary Fiber</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{fiber}g</span>
        </div>
        <div className="py-1.5 pl-4 flex justify-between items-center text-zinc-600 dark:text-zinc-400">
          <span>Total Sugars</span>
          <span>{sugar}g</span>
        </div>
        {addedSugar !== undefined && (
          <div className="py-1 pl-8 flex justify-between items-center text-zinc-500 dark:text-zinc-500 italic">
            <span>Includes Added Sugars</span>
            <span>{addedSugar}g</span>
          </div>
        )}

        <div className="py-2 flex justify-between items-center font-semibold text-zinc-800 dark:text-zinc-200">
          <span>Total Fat</span>
          <span>{fat}g</span>
        </div>
        {satFat !== undefined && (
          <div className="py-1.5 pl-4 flex justify-between items-center text-zinc-600 dark:text-zinc-400">
            <span>Saturated Fat</span>
            <span>{satFat}g</span>
          </div>
        )}
        <div className="py-1 pl-4 flex justify-between items-center text-zinc-500 dark:text-zinc-400">
          <span>Trans Fat</span>
          <span>{transFat}g</span>
        </div>

        <div className="py-2 flex justify-between items-center font-semibold text-zinc-800 dark:text-zinc-200">
          <span>Sodium</span>
          <span className={sodium > 600 ? "text-amber-600 font-bold" : ""}>{sodium}mg</span>
        </div>

        {potassium !== undefined && (
          <div className="py-2 flex justify-between items-center text-zinc-700 dark:text-zinc-300">
            <span>Potassium</span>
            <span>{potassium}mg</span>
          </div>
        )}

        {cholesterol !== undefined && (
          <div className="py-2 flex justify-between items-center text-zinc-700 dark:text-zinc-300">
            <span>Cholesterol</span>
            <span>{cholesterol}mg</span>
          </div>
        )}
      </div>

      {/* Micronutrients Accordion */}
      {food.vitaminsAndMinerals && food.vitaminsAndMinerals.length > 0 && (
        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
          <button
            onClick={() => setShowMicros((prev) => !prev)}
            className="w-full flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 py-1"
          >
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              Vitamins & Minerals ({food.vitaminsAndMinerals.length})
            </span>
            {showMicros ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMicros && (
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2">
              {food.vitaminsAndMinerals.map((micro, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-50 dark:bg-zinc-800/60 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs"
                >
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">{micro.name}</span>
                  <div className="text-right">
                    <span className="font-bold text-zinc-900 dark:text-white">{micro.amount}</span>
                    {micro.dailyValuePercent && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                        {Math.round(micro.dailyValuePercent * ratio)}% DV
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
