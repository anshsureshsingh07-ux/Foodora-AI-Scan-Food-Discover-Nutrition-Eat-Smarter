import React, { useState } from "react";
import { soundFx } from "../../utils/soundEffects";
import {
  Sparkles,
  BookOpen,
  User,
  Feather,
  Code2,
  Rocket,
  Heart,
  Crown,
  BookMarked,
  CheckCircle2,
  ExternalLink,
  Flame,
  X,
  Copy,
  Check,
  ShieldCheck,
  Compass,
  Star,
  Quote,
} from "lucide-react";
import confetti from "canvas-confetti";

interface CreatorsDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorsDeskModal: React.FC<CreatorsDeskModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"author" | "books" | "tech" | "quotes">("author");
  const [copiedBook, setCopiedBook] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyTitle = (title: string) => {
    soundFx.playPop();
    navigator.clipboard.writeText(title);
    setCopiedBook(title);
    setTimeout(() => setCopiedBook(null), 2000);
  };

  const triggerCelebration = () => {
    soundFx.playSuccess();
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10b981", "#f59e0b", "#6366f1"],
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero Banner */}
        <div className="relative bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white border-b border-emerald-900/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <button
            onClick={() => {
              soundFx.playPop();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            {/* Monogram Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 p-1 shadow-lg shadow-emerald-500/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center text-white">
                  <span className="text-3xl sm:text-4xl font-black font-serif tracking-tight bg-gradient-to-b from-white to-emerald-200 bg-clip-text text-transparent">
                    AS
                  </span>
                  <span className="text-[8px] uppercase tracking-widest font-mono text-emerald-400 font-bold">
                    Founder
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-lg shadow-md border-2 border-slate-900">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Creator's Desk &amp; Portfolio
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-slate-300 bg-slate-800/80 border border-slate-700">
                  Ansh Singh
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Ansh Singh
              </h2>
              <p className="text-xs sm:text-sm font-bold text-emerald-400">
                Author • Developer • Creator of Nutrimania
              </p>
              <p className="text-xs text-slate-300/90 leading-relaxed max-w-xl">
                Blending the discipline of full-stack digital architectures with the art of immersive world-building and narrative fiction.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-3 px-6 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
          {[
            { id: "author", label: "Creator Profile", icon: User },
            { id: "books", label: "Fiction Books (2)", icon: BookMarked },
            { id: "tech", label: "Nutrimania Philosophy", icon: Code2 },
            { id: "quotes", label: "Vision & Lore", icon: Quote },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playPop();
                  setActiveTab(tab.id as any);
                }}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          {/* Tab 1: Author Profile */}
          {activeTab === "author" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Feather className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-sm text-amber-950 dark:text-amber-200">Fiction Author</h4>
                  <p className="text-xs text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
                    Author of <em>The Lost Soul of Throne</em> and <em>Until Death Found Us Again</em>, crafting epic high fantasy and deeply touching character journeys.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-sm text-indigo-950 dark:text-indigo-200">Software Developer</h4>
                  <p className="text-xs text-indigo-900/80 dark:text-indigo-300/80 leading-relaxed">
                    Digital architect behind Nutrimania's multimodal vision engine, sub-second nutrition indexers, and accessible UI interactions.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-sm text-emerald-950 dark:text-emerald-200">Product Creator</h4>
                  <p className="text-xs text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
                    Championing user empowerment, transparent health science, and playful Gen-Z interfaces that make wellness joyful.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>The Story Behind Nutrimania</span>
                </h3>
                <p>
                  Created and crafted by <strong>Ansh Singh</strong>, Nutrimania was born out of a desire to make nutrition science human, engaging, and grounded in real clinical tables (USDA, ICMR, EFSA, MEXT) while giving people an enjoyable, gamified companion on their daily health quest.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Books */}
          {activeTab === "books" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Book 1 */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/30 border border-amber-200 dark:border-amber-800/80 space-y-4 shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 font-mono">
                        Fantasy Fiction
                      </span>
                      <Crown className="w-4 h-4 text-amber-500" />
                    </div>

                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      The Lost Soul of Throne
                    </h3>
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                      By Ansh Singh
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      A sweeping fantasy narrative exploring kingdoms, sovereignty, arcane politics, and the relentless quest of a lost soul navigating duty, destiny, and redemption.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-amber-200/60 dark:border-amber-900/60 flex items-center justify-between">
                    <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                      Featured Work
                    </span>
                    <button
                      onClick={() => handleCopyTitle("The Lost Soul of Throne by Ansh Singh")}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                    >
                      {copiedBook === "The Lost Soul of Throne by Ansh Singh" ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Title</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Book 2 */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50/80 via-white to-pink-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/30 border border-rose-200 dark:border-rose-800/80 space-y-4 shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500 text-white font-mono">
                        Romance &amp; Tragedy
                      </span>
                      <Heart className="w-4 h-4 text-rose-500" />
                    </div>

                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      Until Death Found Us Again
                    </h3>
                    <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
                      By Ansh Singh
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      A poignant, emotionally resonant romance that examines the threads of timeless affection, separation, fate, and whether love can transcend the boundaries of mortality.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-rose-200/60 dark:border-rose-900/60 flex items-center justify-between">
                    <span className="text-[11px] text-rose-700 dark:text-rose-400 font-semibold">
                      Featured Work
                    </span>
                    <button
                      onClick={() => handleCopyTitle("Until Death Found Us Again by Ansh Singh")}
                      className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                    >
                      {copiedBook === "Until Death Found Us Again by Ansh Singh" ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Title</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Tech & Philosophy */}
          {activeTab === "tech" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                  <Code2 className="w-4 h-4" />
                  <span>Engineering Pillars</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Transparent Food Science:</strong> Every macro calculation links directly to verified government food spectroscopy datasets.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>100% Client-Synthesized Sound:</strong> Audio feedback and Lo-Fi ambience generated live via the Web Audio API without heavy external assets.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Multimodal Vision Resilience:</strong> Intelligent multi-model fallbacks for uninterrupted meal analysis worldwide.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 4: Quotes */}
          {activeTab === "quotes" && (
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 space-y-3">
                <Quote className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <blockquote className="text-sm font-serif italic text-slate-800 dark:text-slate-200 leading-relaxed">
                  “Every dish carries a story of culture, patience, and memory. When we understand the science of what nourishes us, we honor both our health and the craft of food.”
                </blockquote>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  — Ansh Singh, Creator of Nutrimania
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400">
            Created, Designed &amp; Developed by Ansh Singh
          </span>
          <button
            onClick={triggerCelebration}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Send Creator Aura ✨</span>
          </button>
        </div>
      </div>
    </div>
  );
};
