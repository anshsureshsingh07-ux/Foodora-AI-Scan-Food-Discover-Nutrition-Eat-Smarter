import React, { useState } from "react";
import { useFood } from "../../context/FoodContext";
import { MealType, FoodLogEntry } from "../../types/food";
import {
  Flame,
  Droplet,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  TrendingUp,
  Camera,
  Heart,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const PersonalDashboardView: React.FC = () => {
  const {
    todayLogs,
    removeFoodLog,
    nutritionGoals,
    loggedWaterMl,
    addWater,
    setIsScanModalOpen,
    setCurrentView,
    setActiveFoodDetail,
    foodDatabase,
  } = useFood();

  const [activeTab, setActiveTab] = useState<"diary" | "insights" | "memories">("diary");

  // Sum today's logs
  const totalCalories = todayLogs.reduce((sum, log) => sum + log.calories, 0);
  const totalProtein = todayLogs.reduce((sum, log) => sum + log.proteinG, 0);
  const totalCarbs = todayLogs.reduce((sum, log) => sum + log.carbsG, 0);
  const totalFat = todayLogs.reduce((sum, log) => sum + log.fatG, 0);
  const totalFiber = todayLogs.reduce((sum, log) => sum + log.fiberG, 0);

  // Goal percentages
  const calPct = Math.min(100, Math.round((totalCalories / nutritionGoals.calories) * 100));
  const proteinPct = Math.min(100, Math.round((totalProtein / nutritionGoals.proteinG) * 100));
  const carbsPct = Math.min(100, Math.round((totalCarbs / nutritionGoals.carbsG) * 100));
  const fatPct = Math.min(100, Math.round((totalFat / nutritionGoals.fatG) * 100));
  const waterPct = Math.min(100, Math.round((loggedWaterMl / nutritionGoals.waterMl) * 100));

  // Average health score of logged foods
  const avgHealthScore =
    todayLogs.length > 0
      ? Math.round(
          todayLogs.reduce((sum, log) => sum + (log.healthScore || 80), 0) / todayLogs.length
        )
      : 88;

  // Group logs by meal
  const mealSections: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Date & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Today • {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Personal Nutrition Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Track daily macro balance, micronutrient targets, and mindful food logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsScanModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>Scan New Food</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-1 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("diary")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === "diary"
              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Daily Food Diary
        </button>
        <button
          onClick={() => setCurrentView("insights")}
          className="px-4 py-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all flex items-center gap-1.5"
        >
          <TrendingUp className="w-4 h-4 text-teal-500" />
          <span>Weekly Insights</span>
        </button>
        <button
          onClick={() => setCurrentView("memories")}
          className="px-4 py-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all flex items-center gap-1.5"
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span>Food Memories</span>
        </button>
      </div>

      {/* Top Cards: Energy Calorie Ring & Macro Progress & Hydration */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Calorie Goal Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-zinc-400 dark:text-zinc-500">
              Calorie Target
            </span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Flame className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-zinc-900 dark:text-white flex items-baseline gap-1.5">
              {totalCalories}
              <span className="text-sm font-normal text-zinc-400">/ {nutritionGoals.calories} kcal</span>
            </div>
            <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${calPct}%` }}
                className={`h-full rounded-full transition-all ${
                  calPct > 100 ? "bg-rose-500" : "bg-amber-500"
                }`}
              />
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 flex justify-between font-medium">
            <span>{Math.max(0, nutritionGoals.calories - totalCalories)} kcal remaining</span>
            <span className="font-bold text-zinc-700 dark:text-zinc-300">{calPct}%</span>
          </div>
        </div>

        {/* Macros Breakdown Card */}
        <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-zinc-400 dark:text-zinc-500">
              Macronutrient Progress
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              Health Index: {avgHealthScore}/100
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Protein */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">Protein</span>
                <span className="text-zinc-400">{Math.round(totalProtein)}/{nutritionGoals.proteinG}g</span>
              </div>
              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div style={{ width: `${proteinPct}%` }} className="h-full bg-emerald-500 rounded-full" />
              </div>
              <span className="text-[10px] text-emerald-600 font-bold block">{proteinPct}%</span>
            </div>

            {/* Carbs */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">Carbs</span>
                <span className="text-zinc-400">{Math.round(totalCarbs)}/{nutritionGoals.carbsG}g</span>
              </div>
              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div style={{ width: `${carbsPct}%` }} className="h-full bg-amber-500 rounded-full" />
              </div>
              <span className="text-[10px] text-amber-600 font-bold block">{carbsPct}%</span>
            </div>

            {/* Fat */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">Fat</span>
                <span className="text-zinc-400">{Math.round(totalFat)}/{nutritionGoals.fatG}g</span>
              </div>
              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div style={{ width: `${fatPct}%` }} className="h-full bg-rose-500 rounded-full" />
              </div>
              <span className="text-[10px] text-rose-600 font-bold block">{fatPct}%</span>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Fiber logged today: <strong>{totalFiber.toFixed(1)}g</strong> of 30g daily baseline.</span>
          </div>
        </div>

        {/* Water Hydration Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-zinc-400 dark:text-zinc-500">
              Hydration
            </span>
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <Droplet className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-black text-zinc-900 dark:text-white flex items-baseline gap-1">
              {loggedWaterMl}
              <span className="text-xs font-bold text-zinc-400">/ {nutritionGoals.waterMl} ml</span>
            </div>
            <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div style={{ width: `${waterPct}%` }} className="h-full bg-sky-500 rounded-full transition-all" />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => addWater(250)}
              className="flex-1 py-1.5 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-700 dark:text-sky-300 font-bold text-xs rounded-xl border border-sky-200 dark:border-sky-800 transition-colors"
            >
              +250 ml
            </button>
            <button
              onClick={() => addWater(500)}
              className="flex-1 py-1.5 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-700 dark:text-sky-300 font-bold text-xs rounded-xl border border-sky-200 dark:border-sky-800 transition-colors"
            >
              +500 ml
            </button>
          </div>
        </div>
      </div>

      {/* Meals Journal Timeline */}
      <div className="space-y-6">
        <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Today's Meal Diary
        </h2>

        <div className="space-y-4">
          {mealSections.map((mealType) => {
            const logsForMeal = todayLogs.filter((log) => log.mealType === mealType);
            const mealCalories = logsForMeal.reduce((s, l) => s + l.calories, 0);

            return (
              <div
                key={mealType}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-extrabold text-zinc-900 dark:text-white text-base">
                      {mealType}
                    </h3>
                    <span className="text-xs text-zinc-400">
                      ({logsForMeal.length} {logsForMeal.length === 1 ? "item" : "items"})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">
                      {mealCalories} kcal
                    </span>
                    <button
                      onClick={() => setCurrentView("database")}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {logsForMeal.length === 0 ? (
                  <div className="py-6 text-center text-xs text-zinc-400">
                    No foods logged for {mealType} yet.
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {logsForMeal.map((log) => (
                      <div
                        key={log.id}
                        className="py-3 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={log.imageUrl}
                            alt={log.foodName}
                            className="w-11 h-11 rounded-xl object-cover"
                          />
                          <div>
                            <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
                              {log.foodName}
                            </h4>
                            <p className="text-zinc-500">
                              {log.servings}x portion ({log.grams}g) • P: {log.proteinG}g | C: {log.carbsG}g | F: {log.fatG}g
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-zinc-900 dark:text-white">
                            {log.calories} <span className="text-[10px] text-zinc-400 font-normal">kcal</span>
                          </span>
                          <button
                            onClick={() => removeFoodLog(log.id)}
                            className="p-1 text-zinc-400 hover:text-rose-500 transition-colors"
                            title="Remove log entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
