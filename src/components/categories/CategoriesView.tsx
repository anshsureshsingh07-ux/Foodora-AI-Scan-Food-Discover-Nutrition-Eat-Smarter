import React from "react";
import { useFood } from "../../context/FoodContext";
import { FoodCard } from "../food/FoodCard";
import {
  Apple,
  Salad,
  Wheat,
  Milk,
  Fish,
  Coffee,
  Nut,
  Croissant,
  Soup,
  BookOpen,
  Sparkles,
} from "lucide-react";

export const CategoriesView: React.FC = () => {
  const { foodDatabase, setCurrentView } = useFood();

  const categoryCards = [
    {
      name: "Dishes & Meals",
      count: foodDatabase.filter((f) => f.category === "Dishes & Meals").length,
      icon: Soup,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      description: "Complete prepared plates, thalis, bowls, bibimbap, and entrees.",
    },
    {
      name: "Fruits",
      count: foodDatabase.filter((f) => f.category === "Fruits").length,
      icon: Apple,
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      description: "Whole fresh fruits, berries, citrus, avocados, and natural sugars.",
    },
    {
      name: "Vegetables",
      count: foodDatabase.filter((f) => f.category === "Vegetables").length,
      icon: Salad,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      description: "Cruciferous greens, tubers, roots, and antioxidant vegetables.",
    },
    {
      name: "Grains & Cereals",
      count: foodDatabase.filter((f) => f.category === "Grains & Cereals").length,
      icon: Wheat,
      color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
      description: "Oats, quinoa, basmati rice, ancient grains, and millets.",
    },
    {
      name: "Dairy & Alternatives",
      count: foodDatabase.filter((f) => f.category === "Dairy & Alternatives").length,
      icon: Milk,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      description: "Greek yogurts, plant milks, cheeses, and calcium sources.",
    },
    {
      name: "Meat, Poultry & Seafood",
      count: foodDatabase.filter((f) => f.category === "Meat, Poultry & Seafood").length,
      icon: Fish,
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      description: "Wild salmon, lean poultry, pasture-raised eggs, and proteins.",
    },
    {
      name: "Beverages",
      count: foodDatabase.filter((f) => f.category === "Beverages").length,
      icon: Coffee,
      color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
      description: "Ceremonial matcha, herbal infusions, kombuchas, and hydration.",
    },
    {
      name: "Bakery & Breads",
      count: foodDatabase.filter((f) => f.category === "Bakery & Breads").length,
      icon: Croissant,
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      description: "Naturally leavened sourdough, flatbreads, dosas, and whole wheat loaves.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Nutritional Taxonomy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Food Categories
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Browse food items grouped by nutritional function, agricultural kingdom, and culinary role.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryCards.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              onClick={() => setCurrentView("database")}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${cat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-400">{cat.count} items recorded</span>
                <span className="text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  Explore →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
