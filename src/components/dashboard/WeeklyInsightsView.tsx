import React from "react";
import { useFood } from "../../context/FoodContext";
import {
  TrendingUp,
  Sparkles,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  Flame,
} from "lucide-react";

export const WeeklyInsightsView: React.FC = () => {
  const { todayLogs, setCurrentView } = useFood();

  const daysOfWeek = [
    { day: "Mon", calories: 1950, healthScore: 92, protein: 115, carbs: 210, fat: 62 },
    { day: "Tue", calories: 2050, healthScore: 89, protein: 122, carbs: 230, fat: 66 },
    { day: "Wed", calories: 1880, healthScore: 95, protein: 128, carbs: 195, fat: 58 },
    { day: "Thu", calories: 2120, healthScore: 86, protein: 110, carbs: 245, fat: 72 },
    { day: "Fri", calories: 2200, healthScore: 84, protein: 118, carbs: 250, fat: 75 },
    { day: "Sat", calories: 2010, healthScore: 91, protein: 125, carbs: 215, fat: 64 },
    { day: "Sun (Today)", calories: todayLogs.reduce((s, l) => s + l.calories, 0) || 1920, healthScore: 93, protein: 120, carbs: 210, fat: 60 },
  ];

  const avgCalories = Math.round(
    daysOfWeek.reduce((s, d) => s + d.calories, 0) / daysOfWeek.length
  );
  const avgHealthScore = Math.round(
    daysOfWeek.reduce((s, d) => s + d.healthScore, 0) / daysOfWeek.length
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>7-Day Nutritional Longitudinal Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Weekly Insights & Diet Trends
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Longitudinal analysis of nutrient density, micronutrient diversity, and whole food ratios.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-2">
          <span className="text-xs uppercase font-bold text-zinc-400">Weekly Daily Average</span>
          <div className="text-3xl font-black text-zinc-900 dark:text-white flex items-baseline gap-1">
            <Flame className="w-5 h-5 text-amber-500" />
            {avgCalories}
            <span className="text-xs font-bold text-zinc-400">kcal/day</span>
          </div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Within 4% of target caloric goal
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-2">
          <span className="text-xs uppercase font-bold text-zinc-400">Average Health Score</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 flex items-baseline gap-1">
            <Award className="w-5 h-5 text-emerald-500" />
            {avgHealthScore}
            <span className="text-xs font-bold text-zinc-400">/ 100</span>
          </div>
          <span className="text-xs text-zinc-500">
            Top tier whole-food ingredient density
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-2">
          <span className="text-xs uppercase font-bold text-zinc-400">Plant Diversity Index</span>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 flex items-baseline gap-1">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            28
            <span className="text-xs font-bold text-zinc-400">unique plants</span>
          </div>
          <span className="text-xs text-emerald-600 font-semibold">
            ✓ Exceeds 25+ target for gut microbiome
          </span>
        </div>
      </div>

      {/* 7-Day Calorie & Health Score Bar Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">
              Daily Energy & Health Quality
            </h3>
            <p className="text-xs text-zinc-500">Comparing calories vs health index over the past 7 days</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              Calories (kcal)
            </span>
            <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
              <span className="w-3 h-3 rounded bg-amber-500" />
              Health Score
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-64 pt-6 pb-2 border-b border-zinc-100 dark:border-zinc-800">
          {daysOfWeek.map((day, idx) => {
            const heightPct = Math.round((day.calories / 2500) * 100);
            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[11px] font-bold text-zinc-500 group-hover:text-emerald-600 transition-colors">
                  {day.calories}
                </div>
                <div className="w-full max-w-[40px] bg-zinc-100 dark:bg-zinc-800 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300 transition-all rounded-t-xl"
                  />
                </div>
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{day.day}</span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {day.healthScore} pts
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Personalized Recommendations Box */}
      <div className="bg-gradient-to-r from-teal-950/40 via-zinc-900 to-emerald-950/40 border border-teal-500/30 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
          <Sparkles className="w-5 h-5" />
          <span>Foodora AI Longitudinal Observations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Strength: Consistent High-Quality Protein & Fiber
            </h4>
            <p className="text-zinc-300 leading-relaxed">
              Your logged meals regularly feature wild salmon, avocado, lentils, and sourdough, yielding a stellar average of 32g dietary fiber daily.
            </p>
          </div>

          <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 space-y-2">
            <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Opportunity: Afternoon Sodium & Hydration Pacing
            </h4>
            <p className="text-zinc-300 leading-relaxed">
              Post-lunch meals show moderate sodium spikes (~680mg). Increasing afternoon potassium-rich snacks (like bananas or coconut water) helps balance fluid equilibrium.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
