import React, { useState } from "react";
import { useFood } from "../../context/FoodContext";
import { CommunitySubmission } from "../../types/food";
import {
  Users,
  Plus,
  ThumbsUp,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Upload,
  Sparkles,
} from "lucide-react";

export const CommunityView: React.FC = () => {
  const { communitySubmissions, addCommunitySubmission, voteSubmission } = useFood();

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [category, setCategory] = useState("Dishes & Meals");
  const [cuisine, setCuisine] = useState("Indian");
  const [submittedBy, setSubmittedBy] = useState("Foodie_Chef");
  const [estimatedCalories, setEstimatedCalories] = useState(380);
  const [proteinG, setProteinG] = useState(14);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80"
  );
  const [successToast, setSuccessToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    addCommunitySubmission({
      foodName,
      category,
      cuisine,
      submittedBy: submittedBy || "Anonymous Contributor",
      estimatedCalories: Number(estimatedCalories),
      proteinG: Number(proteinG),
      description,
      imageUrl,
    });

    setShowSubmitModal(false);
    setFoodName("");
    setDescription("");
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  const getStatusBadge = (status: CommunitySubmission["status"]) => {
    switch (status) {
      case "Published":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Published & Indexed
          </span>
        );
      case "Verified":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified by Nutritionist
          </span>
        );
      case "Under Review":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5" />
            Under Moderation Review
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">
            <Sparkles className="w-3.5 h-3.5" />
            Submitted
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Users className="w-4 h-4" />
            <span>Crowdsourced Food Science Collective</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Community Food Contributions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Help Foodora expand coverage of regional heirloom dishes, local farm ingredients, and street foods worldwide.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Regional Dish</span>
        </button>
      </div>

      {/* Verification Pipeline Explainer */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
          Our Transparent 4-Stage Verification Workflow
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-white dark:bg-zinc-800 p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-700 space-y-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block">1. Submitted</span>
            <p className="text-zinc-500">Community member uploads dish photo, recipe, and region.</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-700 space-y-1">
            <span className="font-bold text-amber-600 dark:text-amber-400 block">2. Under Review</span>
            <p className="text-zinc-500">AI cross-references USDA/ICMR nutrient benchmarks.</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-700 space-y-1">
            <span className="font-bold text-teal-600 dark:text-teal-400 block">3. Verified</span>
            <p className="text-zinc-500">Registered dietitians audit ingredients & allergen flags.</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-700 space-y-1">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block">4. Published</span>
            <p className="text-zinc-500">Indexed into global search and available to millions.</p>
          </div>
        </div>
      </div>

      {/* Grid of Community Submissions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communitySubmissions.map((sub) => (
          <div
            key={sub.id}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={sub.imageUrl}
                  alt={sub.foodName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                <div className="absolute top-3 left-3">{getStatusBadge(sub.status)}</div>

                {sub.cuisine && (
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full">
                    {sub.cuisine}
                  </span>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">
                    {sub.foodName}
                  </h3>
                  <span className="text-xs text-zinc-500 whitespace-nowrap">
                    by {sub.submittedBy}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                  {sub.description}
                </p>

                <div className="flex items-center justify-between text-xs bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <span>Est. Energy: <strong className="text-zinc-900 dark:text-white">{sub.estimatedCalories} kcal</strong></span>
                  <span>Protein: <strong className="text-emerald-600">{sub.proteinG}g</strong></span>
                </div>
              </div>
            </div>

            {/* Voting Action */}
            <div className="p-5 pt-0 flex items-center justify-between text-xs">
              <span className="text-zinc-400">
                Submitted {new Date(sub.submittedAt).toLocaleDateString()}
              </span>

              <button
                onClick={() => voteSubmission(sub.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 transition-all active:scale-95"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Upvote ({sub.votes})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Submission Modal */}
      {showSubmitModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setShowSubmitModal(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                Contribute a Regional Dish or Ingredient
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-zinc-400 hover:text-zinc-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                  Dish / Ingredient Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kashmiri Kahwa, Poha, Onigiri, Arepas..."
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                    Category:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  >
                    <option value="Dishes & Meals">Dishes & Meals</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Grains & Cereals">Grains & Cereals</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Bakery & Breads">Bakery & Breads</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                    Cuisine / Origin:
                  </label>
                  <input
                    type="text"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    placeholder="e.g. Indian, Japanese, Mexican..."
                    className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                  Image URL:
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                    Est. Calories (kcal):
                  </label>
                  <input
                    type="number"
                    value={estimatedCalories}
                    onChange={(e) => setEstimatedCalories(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                    Protein (g):
                  </label>
                  <input
                    type="number"
                    value={proteinG}
                    onChange={(e) => setProteinG(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                  Description & Key Ingredients:
                </label>
                <textarea
                  rows={3}
                  placeholder="Traditional ingredients, spices, fermentation method, cultural background..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                  Your Contributor Name / Handle:
                </label>
                <input
                  type="text"
                  value={submittedBy}
                  onChange={(e) => setSubmittedBy(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
              >
                Submit to Moderation Queue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>Thank you! Your dish was submitted to the Foodora review queue.</span>
        </div>
      )}
    </div>
  );
};
