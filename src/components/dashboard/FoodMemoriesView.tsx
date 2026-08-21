import React, { useState } from "react";
import { useFood } from "../../context/FoodContext";
import { FoodMemory } from "../../types/food";
import {
  Heart,
  Plus,
  Calendar,
  MapPin,
  Tag,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Flame,
  CheckCircle2,
} from "lucide-react";

export const FoodMemoriesView: React.FC = () => {
  const { foodMemories, addFoodMemory, deleteFoodMemory } = useFood();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [foodName, setFoodName] = useState("");
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
  );
  const [occasion, setOccasion] = useState("Weekend Dinner with Friends");
  const [personalNote, setPersonalNote] = useState("");
  const [locationOrPlace, setLocationOrPlace] = useState("Trattoria Bella");
  const [calories, setCalories] = useState(450);
  const [tagsInput, setTagsInput] = useState("Celebration, Homemade, Comfort Food");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !foodName.trim()) return;

    addFoodMemory({
      title,
      foodName,
      photoUrl,
      date: new Date().toISOString().split("T")[0],
      occasion,
      personalNote,
      locationOrPlace,
      calories: Number(calories),
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    });

    setShowAddModal(false);
    setTitle("");
    setFoodName("");
    setPersonalNote("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>Visual Culinary Journal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Food Memories & Stories
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Capture the moments, occasions, recipes, and emotions tied to your favorite culinary experiences.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Food Memory</span>
        </button>
      </div>

      {/* Grid of Memories */}
      {foodMemories.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center space-y-3">
          <Heart className="w-12 h-12 text-rose-300 mx-auto" />
          <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-200">No Food Memories Yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Log your special dinners, handmade sourdough bakes, or memorable vacation dishes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodMemories.map((mem) => (
            <div
              key={mem.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={mem.photoUrl}
                    alt={mem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5 text-xs text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{mem.date}</span>
                  </div>

                  <button
                    onClick={() => deleteFoodMemory(mem.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-rose-600 text-white transition-colors"
                    title="Delete memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    {mem.occasion && (
                      <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block">
                        {mem.occasion}
                      </span>
                    )}
                    <h3 className="font-extrabold text-base leading-tight">{mem.title}</h3>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-900 dark:text-white">{mem.foodName}</span>
                    {mem.calories && (
                      <span className="flex items-center gap-1 text-zinc-500 font-semibold">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        {mem.calories} kcal
                      </span>
                    )}
                  </div>

                  {mem.personalNote && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 italic bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 leading-relaxed">
                      "{mem.personalNote}"
                    </p>
                  )}

                  {mem.locationOrPlace && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{mem.locationOrPlace}</span>
                    </div>
                  )}

                  {mem.tags && mem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {mem.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Memory Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                Record a Food Memory
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-zinc-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                  Memory Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sourdough baking morning with family"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                  Dish / Food Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Country Sourdough Loaf"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                  Photo URL:
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                    Occasion / Gathering:
                  </label>
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                    Location / Place:
                  </label>
                  <input
                    type="text"
                    value={locationOrPlace}
                    onChange={(e) => setLocationOrPlace(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                  Personal Story / Tasting Note:
                </label>
                <textarea
                  rows={3}
                  placeholder="What made this dish special? Flavors, techniques, company..."
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                  Tags (comma separated):
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
              >
                Save Food Memory
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
