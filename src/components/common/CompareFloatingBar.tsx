import React from "react";
import { useFood } from "../../context/FoodContext";
import { Scale, X, ArrowRight } from "lucide-react";

export const CompareFloatingBar: React.FC = () => {
  const { comparisonItems, removeFromCompare, clearCompare, setCurrentView } = useFood();

  if (comparisonItems.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-zinc-900/95 text-white dark:bg-zinc-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-zinc-700/80 p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-x-auto py-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {comparisonItems.map((food) => (
              <div
                key={food.id}
                className="flex items-center gap-1.5 bg-zinc-800 dark:bg-zinc-700/80 border border-zinc-700 rounded-full pl-1.5 pr-2 py-1 text-xs whitespace-nowrap"
              >
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="font-medium max-w-[90px] truncate">{food.name}</span>
                <button
                  onClick={() => removeFromCompare(food.id)}
                  className="text-zinc-400 hover:text-white ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs text-zinc-400 hover:text-white underline px-1"
          >
            Clear
          </button>
          <button
            onClick={() => setCurrentView("compare")}
            disabled={comparisonItems.length < 2}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              comparisonItems.length >= 2
                ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 active:scale-95"
                : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
            }`}
          >
            <span>Compare ({comparisonItems.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
