import React, { useState } from "react";
import { HealthScoreFactors } from "../../types/food";
import { Info, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

interface HealthScoreBadgeProps {
  score: number;
  factors?: HealthScoreFactors;
  size?: "sm" | "md" | "lg";
  showDetailsModal?: boolean;
}

export const HealthScoreBadge: React.FC<HealthScoreBadgeProps> = ({
  score,
  factors,
  size = "md",
  showDetailsModal = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Color mapping based on 0-100 score
  let bgClass = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60";
  let ringClass = "border-emerald-500 text-emerald-600 dark:text-emerald-400";
  let grade = "Excellent Balance";

  if (score >= 88) {
    grade = "Nutrient Dense";
    bgClass = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    ringClass = "border-emerald-500 text-emerald-600 dark:text-emerald-400";
  } else if (score >= 75) {
    grade = "Good Balance";
    bgClass = "bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300 border-teal-200 dark:border-teal-800";
    ringClass = "border-teal-500 text-teal-600 dark:text-teal-400";
  } else if (score >= 60) {
    grade = "Moderate / Balanced";
    bgClass = "bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    ringClass = "border-amber-500 text-amber-600 dark:text-amber-400";
  } else {
    grade = "Mindful Portion";
    bgClass = "bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800";
    ringClass = "border-rose-500 text-rose-600 dark:text-rose-400";
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-2 text-sm",
  };

  return (
    <>
      <div
        onClick={(e) => {
          if (showDetailsModal && factors) {
            e.stopPropagation();
            setIsOpen(true);
          }
        }}
        className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-tight transition-all cursor-pointer ${bgClass} ${sizeClasses[size]}`}
        title="Foodora Explainable Health Score (0-100)"
      >
        <span className="font-extrabold">{score}</span>
        <span className="text-[10px] opacity-75">/100</span>
        <span className="font-normal text-[11px] hidden sm:inline">Score</span>
        {factors && <Info className="w-3 h-3 opacity-60 ml-0.5" />}
      </div>

      {/* Breakdown Explainer Modal */}
      {isOpen && factors && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${ringClass}`}>
                  <span className="text-lg font-black">{score}</span>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                    Health Score Breakdown
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{grade}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Positives */}
            {factors.positives && factors.positives.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Positive Nutritional Drivers (+Score)
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                  {factors.positives.map((pos, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-emerald-50/60 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{pos}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Negatives / Moderations */}
            {factors.negatives && factors.negatives.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Moderation Considerations (-Score)
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                  {factors.negatives.map((neg, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-amber-50/60 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-100 dark:border-amber-900/50">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{neg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
              <p>
                <strong>Educational Notice:</strong> The Foodora Health Score is an algorithmic index based on nutrient density, fiber, whole food ratio, and saturated fat/sodium balance. It is not medical advice or an absolute label of good or bad food.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
