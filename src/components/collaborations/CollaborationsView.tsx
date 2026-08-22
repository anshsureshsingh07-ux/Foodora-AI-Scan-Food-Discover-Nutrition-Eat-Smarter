import React, { useState } from "react";
import { useFood } from "../../context/FoodContext";
import { SAMPLE_ANIME_STORIES } from "../../data/foodDatabase";
import { AnimeFoodStory } from "../../types/food";
import {
  Sparkles,
  Heart,
  BookOpen,
  UtensilsCrossed,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tv,
} from "lucide-react";

export const CollaborationsView: React.FC = () => {
  const { setActiveFoodDetail, foodDatabase } = useFood();
  const [selectedStory, setSelectedStory] = useState<AnimeFoodStory>(SAMPLE_ANIME_STORIES[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Every Meal Has a Story • Slice-of-Life Edition</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Story Diners & Anime Collaborations
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Explore the emotional comfort, cultural folklore, and real nutritional science behind iconic dishes from beloved stories.
        </p>
      </div>

      {/* Featured Anime Story Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
          {/* Visual Left/Top */}
          <div className="lg:col-span-6 relative h-64 lg:h-auto overflow-hidden">
            <img
              src={selectedStory.coverImage}
              alt={selectedStory.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-zinc-950 shadow-md flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5" />
                {selectedStory.animeUniverse}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-white">
                {selectedStory.dishName}
              </span>
            </div>
          </div>

          {/* Narrative Right */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Episode Culinary Spotlight
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                {selectedStory.title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic border-l-2 border-amber-500 pl-3">
                "{selectedStory.loreSnippet}"
              </p>
            </div>

            {/* Nutrimania Nutritional breakdown */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Nutrimania Real-World Nutrition Analysis:
                </span>
                <span className="font-extrabold text-amber-400">
                  Health Index: {selectedStory.healthScore}/100
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Energy</span>
                  <span className="font-bold text-white">{selectedStory.nutritionalProfile.calories} kcal</span>
                </div>
                <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Protein</span>
                  <span className="font-bold text-emerald-400">{selectedStory.nutritionalProfile.proteinG}g</span>
                </div>
                <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Carbs</span>
                  <span className="font-bold text-amber-400">{selectedStory.nutritionalProfile.carbsG}g</span>
                </div>
                <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Fat</span>
                  <span className="font-bold text-rose-400">{selectedStory.nutritionalProfile.fatG}g</span>
                </div>
              </div>
            </div>

            {/* Key comfort ingredients */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-zinc-400 uppercase tracking-wider block">
                Comfort Ingredients in this Dish:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedStory.comfortIngredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 font-medium"
                  >
                    ✨ {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Selector Carousel / Cards */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">
          All Anime & Slice-of-Life Stories ({SAMPLE_ANIME_STORIES.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_ANIME_STORIES.map((story) => (
            <div
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className={`group bg-white dark:bg-zinc-900 border rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between ${
                selectedStory.id === story.id
                  ? "border-amber-500 ring-2 ring-amber-500/40"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
              }`}
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-zinc-950 shadow-md">
                    {story.animeUniverse}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] text-amber-300 font-bold block">{story.dishName}</span>
                    <h4 className="font-extrabold text-sm">{story.title}</h4>
                  </div>
                </div>

                <div className="p-4 text-xs text-zinc-600 dark:text-zinc-400 space-y-2">
                  <p className="line-clamp-2">{story.loreSnippet}</p>
                  <div className="flex items-center justify-between text-zinc-500 font-semibold pt-1 border-t border-zinc-100 dark:border-zinc-800">
                    <span>{story.nutritionalProfile.calories} kcal</span>
                    <span className="text-emerald-600 dark:text-emerald-400">Score {story.healthScore}/100</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button className="w-full py-2 bg-zinc-50 dark:bg-zinc-800 group-hover:bg-amber-500 group-hover:text-zinc-950 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">
                  <span>Read Culinary Lore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
