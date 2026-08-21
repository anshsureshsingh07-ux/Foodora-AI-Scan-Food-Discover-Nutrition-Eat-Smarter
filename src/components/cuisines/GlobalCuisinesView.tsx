import React, { useState } from "react";
import { useFood } from "../../context/FoodContext";
import { FoodCard } from "../food/FoodCard";
import { Globe, Sparkles, UtensilsCrossed, ChevronRight } from "lucide-react";

export const GlobalCuisinesView: React.FC = () => {
  const { foodDatabase } = useFood();
  const [selectedCuisine, setSelectedCuisine] = useState<string>("All");

  const cuisinesList = [
    {
      name: "Indian",
      flag: "🇮🇳",
      tagline: "Rich in aromatic spices, lentils, fermented grains, and antioxidant turmeric.",
      signature: "Masala Dosa, Dal Makhani, Palak Paneer, Biryani",
      bgImage: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Japanese",
      flag: "🇯🇵",
      tagline: "Centered around fresh umami, omega-rich seafood, miso fermentation, and green tea.",
      signature: "Matcha Latte, Salmon Sashimi, Ramen, Dashi, Edamame",
      bgImage: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Italian",
      flag: "🇮🇹",
      tagline: "Mediterranean mastery featuring extra virgin olive oil, cold-fermented doughs, and vine tomatoes.",
      signature: "Sourdough Pizza, Risotto, Caprese, Pasta al Pomodoro",
      bgImage: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Korean",
      flag: "🇰🇷",
      tagline: "Probiotic-rich fermented kimchi, grilled proteins, gochujang heat, and fresh banchan.",
      signature: "Dolsot Bibimbap, Kimchi Jjigae, Bulgogi, Tteokbokki",
      bgImage: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Mexican",
      flag: "🇲🇽",
      tagline: "Avocados, heirloom corn nixtamalization, black beans, chiles, and fresh cilantro.",
      signature: "Guacamole, Black Bean Tacos, Pozole, Ceviche",
      bgImage: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Mediterranean",
      flag: "🇬🇷",
      tagline: "Wild greens, cold-pressed olive oil, fresh feta, grilled fish, and whole grains.",
      signature: "Greek Salad, Hummus, Falafel, Grilled Seabass",
      bgImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const filteredFoods =
    selectedCuisine === "All"
      ? foodDatabase
      : foodDatabase.filter(
          (f) => f.cuisine && f.cuisine.toLowerCase() === selectedCuisine.toLowerCase()
        );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
          <Globe className="w-4 h-4" />
          <span>Culinary Heritage & Regional Nutrition</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Global Food Cuisines
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Explore regional preparations, cultural traditions, and nutritional balance across international cuisines.
        </p>
      </div>

      {/* Cuisines Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cuisinesList.map((cuisine) => {
          const isSelected = selectedCuisine === cuisine.name;
          return (
            <div
              key={cuisine.name}
              onClick={() => setSelectedCuisine(isSelected ? "All" : cuisine.name)}
              className={`group relative rounded-3xl overflow-hidden border cursor-pointer transition-all duration-300 shadow-xs hover:shadow-xl ${
                isSelected
                  ? "border-emerald-500 ring-2 ring-emerald-500/40"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
              }`}
            >
              <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
                <img
                  src={cuisine.bgImage}
                  alt={cuisine.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                <div className="absolute top-3 left-3 text-2xl">{cuisine.flag}</div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-xl font-black">{cuisine.name} Cuisine</h3>
                  <p className="text-[11px] text-emerald-300 font-medium">
                    Signature: {cuisine.signature}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-zinc-900 text-xs text-zinc-600 dark:text-zinc-400 space-y-2">
                <p>{cuisine.tagline}</p>
                <div className="flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                  <span>
                    {isSelected ? "Showing Dishes ↓" : "Filter Dishes"}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dishes for Selected Cuisine */}
      <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
            {selectedCuisine === "All" ? "All Global Dishes" : `${selectedCuisine} Dishes & Ingredients`}
          </h2>
          {selectedCuisine !== "All" && (
            <button
              onClick={() => setSelectedCuisine("All")}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-bold underline"
            >
              Show All Cuisines
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </div>
    </div>
  );
};
