import React, { useState } from "react";
import { FoodItem, MealType } from "../../types/food";
import { useFood } from "../../context/FoodContext";
import { HealthScoreBadge } from "../common/HealthScoreBadge";
import {
  Heart,
  Scale,
  Plus,
  Check,
  ShieldCheck,
  Sparkles,
  Flame,
  CheckCircle2,
  Info,
} from "lucide-react";

interface FoodCardProps {
  food: FoodItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const {
    setActiveFoodDetail,
    toggleFavorite,
    isFavorite,
    comparisonItems,
    addToCompare,
    removeFromCompare,
    logFood,
  } = useFood();

  const [isLoggedToast, setIsLoggedToast] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>("Lunch");
  const [servingCount, setServingCount] = useState(1);
  const [tiltStyle, setTiltStyle] = useState<string>("");
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const cardRef = React.useRef<HTMLDivElement | null>(null);

  const isFav = isFavorite(food.id);
  const isCompared = comparisonItems.some((f) => f.id === food.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTiltStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
        2
      )}deg) translateZ(6px)`
    );

    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.2,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)");
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleQuickLog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowLogModal(true);
  };

  const confirmLog = (e: React.MouseEvent) => {
    e.stopPropagation();
    logFood({
      foodId: food.id,
      foodName: food.name,
      category: food.category,
      mealType: selectedMealType,
      imageUrl: food.imageUrl,
      servings: servingCount,
      grams: Math.round(food.servingWeightGrams * servingCount),
      calories: Math.round(food.calories * servingCount),
      proteinG: Number((food.proteinG * servingCount).toFixed(1)),
      carbsG: Number((food.carbsG * servingCount).toFixed(1)),
      fatG: Number((food.fatG * servingCount).toFixed(1)),
      fiberG: Number((food.fiberG * servingCount).toFixed(1)),
      healthScore: food.healthScore,
    });
    setShowLogModal(false);
    setIsLoggedToast(true);
    setTimeout(() => setIsLoggedToast(false), 2200);
  };

  return (
    <>
      <div
        ref={cardRef}
        id={`food-card-${food.id}`}
        onClick={() => setActiveFoodDetail(food)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: tiltStyle,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="group relative backdrop-blur-xl bg-white/70 dark:bg-slate-900/65 border border-white/50 dark:border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-black/40 hover:border-emerald-500/50 dark:hover:border-emerald-400/40 transition-all duration-300 flex flex-col cursor-pointer"
      >
        {/* Specular glare overlay */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(circle 250px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.4), transparent 75%)`,
            opacity: glarePosition.opacity,
          }}
        />

        {/* Top inner white glass edge highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent z-10" />

        {/* Card Image with Badges */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />

          {/* Top Left: Verification Status */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {food.isVerified ? (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-emerald-600 dark:text-emerald-400 backdrop-blur-md shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white backdrop-blur-md shadow-xs">
                <Sparkles className="w-3 h-3" />
                AI Estimate
              </span>
            )}

            {food.cuisine && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-950/60 text-white backdrop-blur-md">
                {food.cuisine}
              </span>
            )}
          </div>

          {/* Top Right: Favorite & Compare buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isCompared) {
                  removeFromCompare(food.id);
                } else {
                  addToCompare(food);
                }
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isCompared
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-950/50 text-white hover:bg-slate-950/80"
              }`}
              title={isCompared ? "Remove from comparison" : "Add to comparison"}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(food.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isFav
                  ? "bg-rose-500 text-white shadow-xs"
                  : "bg-slate-950/50 text-white hover:bg-slate-950/80"
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-white" : ""}`} />
            </button>
          </div>

          {/* Bottom Overlay: Health Score & Calories */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <HealthScoreBadge score={food.healthScore} factors={food.healthScoreFactors} size="sm" />
            <span className="flex items-center gap-1 text-xs font-bold text-white bg-slate-950/60 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-white/10">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              {food.calories} kcal
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-start justify-between gap-1">
              <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {food.name}
              </h3>
            </div>

            {/* Local Script & Origin Details */}
            {(food.localName || food.regionOrState || food.country) && (
              <div className="flex items-center gap-1.5 flex-wrap mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                {food.localName && (
                  <span className="font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-md">
                    {food.localName}
                  </span>
                )}
                {(food.cityOrLocality || food.regionOrState || food.country) && (
                  <span className="truncate text-slate-600 dark:text-slate-400">
                    {[food.cityOrLocality, food.regionOrState, food.country].filter(Boolean).join(", ")}
                  </span>
                )}
              </div>
            )}

            {food.alternateNames && food.alternateNames.length > 0 && !food.localName && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                Also known as: {food.alternateNames.join(", ")}
              </p>
            )}

            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
              {food.description}
            </p>

            {/* Variations badge if available */}
            {food.recipeVariations && food.recipeVariations.length > 0 && (
              <div className="mt-2 flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-lg w-fit">
                <span>{food.recipeVariations.length} Versions (Home / Restaurant / Street)</span>
              </div>
            )}
          </div>

          {/* Macros Pill Strip */}
          <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-50 dark:bg-slate-800/60 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                Protein
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {food.proteinG}g
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                Carbs
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {food.carbsG}g
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                Fat
              </span>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                {food.fatG}g
              </span>
            </div>
          </div>

          {/* Footer Card Actions */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <span className="text-[11px] text-slate-500 truncate max-w-[140px]">
              {food.servingSize}
            </span>

            <button
              onClick={handleQuickLog}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 font-semibold border border-emerald-200 dark:border-emerald-800 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Log Modal */}
      {showLogModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setShowLogModal(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                Log to Daily Diary
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={food.imageUrl}
                alt={food.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{food.name}</h4>
                <p className="text-xs text-zinc-500">{food.servingSize}</p>
              </div>
            </div>

            {/* Meal Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Meal Category:
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {(["Breakfast", "Lunch", "Dinner", "Snacks"] as MealType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedMealType(type)}
                    className={`py-1.5 rounded-lg font-medium transition-all ${
                      selectedMealType === type
                        ? "bg-emerald-600 text-white font-bold"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Servings Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-zinc-700 dark:text-zinc-300">Servings:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{servingCount}x</span>
              </div>
              <div className="flex items-center gap-2">
                {[0.5, 1, 1.5, 2, 3].map((val) => (
                  <button
                    key={val}
                    onClick={() => setServingCount(val)}
                    className={`flex-1 py-1 rounded-lg text-xs font-semibold border ${
                      servingCount === val
                        ? "bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {val}x
                  </button>
                ))}
              </div>
            </div>

            {/* Total nutrients preview */}
            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-medium">
              <div>
                <span className="text-zinc-500 block">Total Energy</span>
                <span className="text-sm font-black text-zinc-900 dark:text-white">
                  {Math.round(food.calories * servingCount)} kcal
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">Protein</span>
                <span className="text-sm font-bold text-emerald-600">
                  {(food.proteinG * servingCount).toFixed(1)}g
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">Carbs</span>
                <span className="text-sm font-bold text-amber-600">
                  {(food.carbsG * servingCount).toFixed(1)}g
                </span>
              </div>
            </div>

            <button
              onClick={confirmLog}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-98"
            >
              Add to Daily Diary
            </button>
          </div>
        </div>
      )}

      {/* Logged Toast */}
      {isLoggedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/50 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Logged {food.name} to Daily Diary!</span>
        </div>
      )}
    </>
  );
};
