import React, { useState } from "react";
import { useFood } from "../../context/FoodContext";
import { FoodoraPartner } from "../../types/food";
import {
  Building2,
  ShieldCheck,
  Plus,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Award,
} from "lucide-react";

export const PartnersView: React.FC = () => {
  const { partners, addPartnerApplication } = useFood();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FoodoraPartner["category"]>("Organic Farm");
  const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80");
  const [website, setWebsite] = useState("https://example.com");
  const [location, setLocation] = useState("California, USA");
  const [description, setDescription] = useState("");
  const [successToast, setSuccessToast] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addPartnerApplication({
      name,
      category,
      logoUrl,
      website,
      location,
      description,
      verifiedProductsCount: 1,
    });

    setShowApplyModal(false);
    setName("");
    setDescription("");
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Building2 className="w-4 h-4" />
            <span>Verified Agriculture & Nutrition Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Foodora Partner Ecosystem
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Collaborating directly with organic farms, heirloom millers, tea masters, and university nutrition laboratories.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Become a Partner</span>
        </button>
      </div>

      {/* Partner Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Direct Lab Provenance</h3>
          <p className="text-zinc-500 leading-relaxed">
            Partners provide calibrated spectrometry and lab nutrition certificates, replacing guesswork with verified benchmarks.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Verified Green Shield</h3>
          <p className="text-zinc-500 leading-relaxed">
            Partner items receive the Foodora Verified badge, ensuring consumers instantly recognize authenticated ingredient purity.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Traceable Farm-to-Scan</h3>
          <p className="text-zinc-500 leading-relaxed">
            Users scanning partner packaging can trace soil origins, harvest dates, and regional sustainability metrics.
          </p>
        </div>
      </div>

      {/* Partners Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-800 group-hover:scale-105 transition-transform"
                />
                {partner.isVerified ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Pending Audit
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {partner.category}
                </span>
                <h3 className="font-bold text-base text-zinc-900 dark:text-white mt-0.5">
                  {partner.name}
                </h3>
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                {partner.description}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  {partner.location}
                </span>
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {partner.verifiedProductsCount} items
                </span>
              </div>

              {partner.website && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 w-full bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold rounded-xl transition-colors"
                >
                  <span>Visit Partner Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setShowApplyModal(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                Apply for Foodora Partner Verification
              </h3>
              <button onClick={() => setShowApplyModal(false)} className="text-zinc-400 hover:text-zinc-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                  Organization / Farm / Brand Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kyoto Uji Tea Collective"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  >
                    <option value="Organic Farm">Organic Farm</option>
                    <option value="Artisan Producer">Artisan Producer</option>
                    <option value="Restaurant / Kitchen">Restaurant / Kitchen</option>
                    <option value="Nutrition Laboratory">Nutrition Laboratory</option>
                    <option value="Clean Packaged Brand">Clean Packaged Brand</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                    Headquarters / Region:
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                  Official Website / Catalog URL:
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                  Logo or Facility Photo URL:
                </label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300">
                  Mission, Certifications & Quality Standards:
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your harvest techniques, lab nutrition certificates, organic credentials..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
              >
                Submit Partner Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>Partner application received! Our nutrition audit team will review your credentials.</span>
        </div>
      )}
    </div>
  );
};
