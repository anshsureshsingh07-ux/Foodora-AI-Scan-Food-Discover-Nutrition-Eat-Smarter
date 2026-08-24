import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot,
  UserCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Send,
  HelpCircle,
  Award,
  Globe2,
  Heart,
  ShieldCheck,
  ChevronRight,
  Flame,
  Clock,
  Timer,
  Hourglass,
  Calendar,
} from "lucide-react";
import { soundFx } from "../../utils/soundEffects";

// Event Timeline Configuration (August 24 to August 31, 2026, 23:59:59)
export const RAMEN_WEEK_START = new Date("2026-08-24T00:00:00").getTime();
export const RAMEN_WEEK_END = new Date("2026-08-31T23:59:59").getTime();

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isEnded: boolean;
  progressPercent: number;
}

export function useRamenWeekCountdown(): TimeLeft {
  const calculateTime = (): TimeLeft => {
    const now = Date.now();
    const diff = RAMEN_WEEK_END - now;

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        isEnded: true,
        progressPercent: 100,
      };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const totalDuration = RAMEN_WEEK_END - RAMEN_WEEK_START;
    const elapsed = Math.max(0, now - RAMEN_WEEK_START);
    const progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

    return {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds,
      isEnded: false,
      progressPercent,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}

// Compact Real-Time Countdown Badge
export const CompactRamenCountdown: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { days, hours, minutes, seconds, isEnded } = useRamenWeekCountdown();

  if (isEnded) {
    return (
      <span className={`inline-flex items-center gap-1 font-mono font-bold text-amber-200 ${className}`}>
        <Hourglass className="w-3 h-3 text-amber-400" />
        <span>Event Concluded</span>
      </span>
    );
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-bold ${className}`}>
      <Timer className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
      <span className="text-amber-200">
        <span className="text-white font-black">{days}</span>d{" "}
        <span className="text-white font-black">{pad(hours)}</span>h{" "}
        <span className="text-white font-black">{pad(minutes)}</span>m{" "}
        <span className="text-amber-300 font-black">{pad(seconds)}</span>s
      </span>
    </span>
  );
};

interface RobotConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DISCOVERY_SOURCES = [
  { id: "search", label: "Google / Search Engine", icon: "🔍" },
  { id: "reddit", label: "Reddit (r/webdev, r/ramen, r/nutrition)", icon: "💬" },
  { id: "social", label: "Instagram, X (Twitter) or TikTok", icon: "📱" },
  { id: "friend", label: "Friend, Colleague or Chef", icon: "👥" },
  { id: "anime", label: "Anime & Japanese Pop Culture Community", icon: "🍱" },
  { id: "github", label: "GitHub / Developer Showcase / Portfolio", icon: "💻" },
  { id: "other", label: "Other Source / Discovery", icon: "✨" },
];

const RAMEN_STYLES = [
  { id: "tonkotsu", name: "Hakata Tonkotsu", desc: "Creamy 18-hr pork broth", icon: "🥣" },
  { id: "shoyu", name: "Tokyo Shoyu", desc: "Clear dashi & barrel-aged soy", icon: "🍜" },
  { id: "spicy_miso", name: "Sapporo Spicy Miso", desc: "Fermented miso & chili oil", icon: "🔥" },
  { id: "kyoto_matcha", name: "Kyoto Veggie Matcha", desc: "Velvety oat dashi & green tea", icon: "🍵" },
  { id: "tsukemen", name: "Tokyo Tsukemen", desc: "Rich dipping broth & thick noodles", icon: "🥢" },
];

const TOPPING_OPTIONS = [
  { id: "chashu", name: "Chashu Pork Belly", isRamenTopping: true, icon: "🥩" },
  { id: "pizza", name: "Pepperoni Pizza Slice", isRamenTopping: false, icon: "🍕" },
  { id: "tamago", name: "Ajitsuke Jammy Egg", isRamenTopping: true, icon: "🥚" },
  { id: "donut", name: "Glazed Donut", isRamenTopping: false, icon: "🍩" },
  { id: "nori", name: "Crispy Nori Sheet", isRamenTopping: true, icon: "🌿" },
  { id: "burger", name: "Cheeseburger Patty", isRamenTopping: false, icon: "🍔" },
];

export const RobotConfirmationModal: React.FC<RobotConfirmationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<"challenge" | "survey" | "reward">("challenge");

  // Step 1: Robot vs Human Challenge state
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [isBotCheckboxChecked, setIsBotCheckboxChecked] = useState(false);
  const [challengeError, setChallengeError] = useState<string | null>(null);

  // Step 2: Discovery Survey state
  const [discoverySource, setDiscoverySource] = useState<string>("");
  const [favoriteRamen, setFavoriteRamen] = useState<string>("tonkotsu");
  const [userMessage, setUserMessage] = useState<string>("");
  const [isSurveySubmitting, setIsSurveySubmitting] = useState(false);

  // Verification stored status
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  useEffect(() => {
    try {
      const verified = localStorage.getItem("nutrimania_human_verified") === "true";
      setAlreadyVerified(verified);
      if (verified) {
        setStep("reward");
      }
    } catch {}
  }, [isOpen]);

  const toggleTopping = (id: string) => {
    soundFx.playPop();
    setChallengeError(null);
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleVerifyHuman = () => {
    if (!isBotCheckboxChecked) {
      setChallengeError("Please check the box to confirm you are not a robot.");
      return;
    }

    // Check if user correctly selected authentic ramen toppings and no non-ramen items
    const selectedAreValid =
      selectedToppings.length >= 2 &&
      selectedToppings.every(
        (id) => TOPPING_OPTIONS.find((t) => t.id === id)?.isRamenTopping === true
      );

    if (!selectedAreValid) {
      setChallengeError(
        "Verification failed: Please select at least 2 authentic Ramen toppings (and no junk items!)"
      );
      return;
    }

    soundFx.playSuccess();
    setStep("survey");
  };

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discoverySource) {
      alert("Please select how you discovered Nutrimania!");
      return;
    }

    setIsSurveySubmitting(true);
    soundFx.playSuccess();

    try {
      localStorage.setItem("nutrimania_human_verified", "true");
      localStorage.setItem(
        "nutrimania_survey_data",
        JSON.stringify({
          discoverySource,
          favoriteRamen,
          userMessage,
          verifiedAt: new Date().toISOString(),
        })
      );
    } catch {}

    setTimeout(() => {
      setIsSurveySubmitting(false);
      setStep("reward");
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div
      id="robot-confirmation-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        id="robot-confirmation-modal-card"
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[32px] border border-white/40 dark:border-white/10 shadow-2xl overflow-hidden my-6 text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow & Decorative Header */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-7">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold tracking-wider uppercase flex items-center gap-1.5">
              <span>🍜</span>
              <span>Ramen Week Special Event • Aug 24 - 31, 2026</span>
            </span>
            <div className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-black/20 text-[11px]">
              <CompactRamenCountdown />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
            <span>Human or Ramen Bot?</span>
            <Bot className="w-6 h-6 text-emerald-200" />
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-md">
            Verify your organic palate, tell us how you found Nutrimania, and unlock your official Ramen Week 2026 Explorer Pass!
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2 mt-4">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === "challenge" ? "w-8 bg-white" : "w-3 bg-white/40"
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === "survey" ? "w-8 bg-white" : "w-3 bg-white/40"
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === "reward" ? "w-8 bg-white" : "w-3 bg-white/40"
              }`}
            />
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-7">
          <AnimatePresence mode="wait">
            {/* STEP 1: ROBOT CHALLENGE */}
            {step === "challenge" && (
              <motion.div
                key="step-challenge"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 dark:text-emerald-200">
                    <strong className="block font-bold mb-0.5">Automated Bot Defense Verification:</strong>
                    Select the <strong>authentic Japanese Ramen toppings</strong> below to confirm you possess human culinary discernment.
                  </div>
                </div>

                {/* Topping Grid Selection */}
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                    Click all legitimate Ramen items:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {TOPPING_OPTIONS.map((item) => {
                      const isSelected = selectedToppings.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleTopping(item.id)}
                          className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20 scale-102"
                              : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span className="text-xs font-bold leading-tight line-clamp-1">
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Human Confirmation Checkbox */}
                <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isBotCheckboxChecked}
                    onChange={(e) => setIsBotCheckboxChecked(e.target.checked)}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      I confirm I am an organic human foodie (Not an automated crawler / bot).
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Celebrated for Global Ramen Week 2026.
                    </span>
                  </div>
                </label>

                {/* Error Banner */}
                {challengeError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 font-medium">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{challengeError}</span>
                  </div>
                )}

                {/* Verify Button */}
                <button
                  type="button"
                  onClick={handleVerifyHuman}
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Verify Human Identity & Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: DISCOVERY & COMMUNITY SURVEY */}
            {step === "survey" && (
              <motion.form
                key="step-survey"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSubmitSurvey}
                className="space-y-5"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      From where did you get to know about our existence? *
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DISCOVERY_SOURCES.map((src) => {
                      const isSelected = discoverySource === src.id;
                      return (
                        <button
                          key={src.id}
                          type="button"
                          onClick={() => {
                            soundFx.playPop();
                            setDiscoverySource(src.id);
                          }}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 text-xs transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-600 text-white border-emerald-600 font-extrabold shadow-sm"
                              : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                          }`}
                        >
                          <span>{src.icon}</span>
                          <span className="truncate">{src.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Favorite Broth Choice */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      What is your holy-grail Ramen Broth?
                    </label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {RAMEN_STYLES.map((r) => {
                      const isSelected = favoriteRamen === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => {
                            soundFx.playPop();
                            setFavoriteRamen(r.id);
                          }}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                              : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className="text-base">{r.icon}</div>
                          <div className="text-xs font-extrabold leading-tight mt-1">{r.name}</div>
                          <div
                            className={`text-[10px] truncate ${
                              isSelected ? "text-amber-100" : "text-slate-400"
                            }`}
                          >
                            {r.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Optional User Message */}
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Any note for Chef Ansh & the Nutrimania team? (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="E.g. Love the 3D ramen physics, would love to see more regional recipes..."
                    className="w-full p-3 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSurveySubmitting || !discoverySource}
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSurveySubmitting ? "Generating Official Pass..." : "Submit Discovery Survey & Claim Pass"}</span>
                </button>
              </motion.form>
            )}

            {/* STEP 3: CERTIFIED RAMEN PASSPORT REWARD */}
            {step === "reward" && (
              <motion.div
                key="step-reward"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <Award className="w-8 h-8 animate-bounce" />
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs border border-emerald-300 dark:border-emerald-800 inline-block mb-2">
                    Humanity Verified • Ramen Week 2026
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Official Ramen Explorer Pass
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    Thank you for letting us know where you found us! Your verified status has been recorded in your local profile.
                  </p>
                </div>

                {/* Digital Ticket / Pass Badge */}
                <div className="relative p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white text-left border border-amber-500/30 shadow-xl overflow-hidden">
                  <div className="pointer-events-none absolute -right-10 -bottom-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl" />
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                        VIP FESTIVAL PASS #NW-82431
                      </span>
                      <h4 className="text-base font-black text-white">Certified Human Gourmet</h4>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-sm font-bold">
                      🍜
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-white/10 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">EVENT DATE</span>
                      <span className="font-bold text-slate-200">24 - 31 AUG 2026</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">VERIFICATION STATUS</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Organic Human
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      setStep("survey");
                    }}
                    className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Edit Survey Answers
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    Back to Ramen Week 🍜
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export const RamenWeekBanner: React.FC<{
  onOpenRobotVerification: () => void;
}> = ({ onOpenRobotVerification }) => {
  const [isVerified, setIsVerified] = useState(false);
  const { days, hours, minutes, seconds, isEnded, progressPercent } = useRamenWeekCountdown();

  useEffect(() => {
    try {
      const verified = localStorage.getItem("nutrimania_human_verified") === "true";
      setIsVerified(verified);
    } catch {}
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      id="ramen-week-2026-banner"
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-950/90 dark:via-orange-950/80 dark:to-rose-950/90 text-white p-6 sm:p-8 shadow-2xl border border-amber-400/40 dark:border-amber-500/20"
    >
      {/* Background Decorative Blur Orbs */}
      <div className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          {/* Top Event Date Pill */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 dark:bg-amber-900/60 backdrop-blur-md text-white dark:text-amber-200 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
              <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Special Festival • 24 to 31 August 2026</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-black/20 text-[11px] font-mono font-bold tracking-wide text-amber-200">
              DAY 1 OF 8
            </span>
            {isVerified && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-[11px] font-bold tracking-wide text-white flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Humanity Verified ✓</span>
              </span>
            )}
          </div>

          {/* Banner Main Headline */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            🍜 Global Ramen Week: <br className="hidden sm:inline" />
            <span className="text-amber-200 underline decoration-amber-300/40 decoration-wavy underline-offset-4">
              24 to 31 August 2026
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-amber-100/90 dark:text-amber-200/80 leading-relaxed">
            Immerse yourself in authentic Japanese broth chemistry, 3D interactive physics, and nutritional science. Complete the anti-bot check and tell us how you discovered Nutrimania to claim your official explorer pass!
          </p>

          {/* REALTIME EVENT END COUNTDOWN BOXES */}
          <div className="p-4 rounded-2xl bg-black/25 backdrop-blur-md border border-white/15">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-200">
                <Timer className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>Event Closes In (Real-time):</span>
              </div>
              <div className="text-[11px] font-mono font-bold text-amber-300/90 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>Live Countdown</span>
              </div>
            </div>

            {isEnded ? (
              <div className="py-2 text-center text-sm font-bold text-amber-200 font-mono">
                🎉 Global Ramen Week 2026 has concluded! Thank you for participating.
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                {/* Days */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-white/10 dark:bg-black/40 border border-white/20 backdrop-blur-sm shadow-inner">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black text-white tracking-tight leading-none">
                    {pad(days)}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-amber-200 uppercase tracking-widest mt-1">
                    Days
                  </div>
                </div>

                {/* Hours */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-white/10 dark:bg-black/40 border border-white/20 backdrop-blur-sm shadow-inner">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black text-white tracking-tight leading-none">
                    {pad(hours)}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-amber-200 uppercase tracking-widest mt-1">
                    Hours
                  </div>
                </div>

                {/* Minutes */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-white/10 dark:bg-black/40 border border-white/20 backdrop-blur-sm shadow-inner">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black text-white tracking-tight leading-none">
                    {pad(minutes)}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-amber-200 uppercase tracking-widest mt-1">
                    Mins
                  </div>
                </div>

                {/* Seconds */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-amber-500/30 dark:bg-amber-600/30 border border-amber-400/50 backdrop-blur-sm shadow-inner relative overflow-hidden">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-black text-amber-200 tracking-tight leading-none">
                    {pad(seconds)}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-amber-200 uppercase tracking-widest mt-1">
                    Secs
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-300 animate-pulse" />
                </div>
              </div>
            )}

            {/* Timeline Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] font-mono text-amber-200/90 mb-1">
                <span>Aug 24 (Start)</span>
                <span>{progressPercent.toFixed(1)}% Completed</span>
                <span>Aug 31, 23:59 (End)</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.max(2, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Features Highlight Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {["🥣 4 Artisanal Broths", "✨ 3D Steam & Water FX", "📊 Macro Nutrition Breakdown", "🎁 Community Discovery Pass"].map(
              (tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-black/20 text-white/90 text-xs font-bold border border-white/10"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
          <button
            id="open-robot-confirmation-btn"
            onClick={() => {
              soundFx.playPop();
              onOpenRobotVerification();
            }}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 active:scale-98 text-amber-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-black/20 transition-all cursor-pointer"
          >
            <Bot className="w-5 h-5 text-amber-600" />
            <span>
              {isVerified ? "View Robot Verification & Pass" : "Robot Confirmation & Survey"}
            </span>
            <ChevronRight className="w-4 h-4 text-amber-700" />
          </button>

          <button
            onClick={() => {
              soundFx.playPop();
              const el = document.getElementById("3d-interactive-ramen-hero");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
            className="px-5 py-3 rounded-2xl bg-black/30 hover:bg-black/40 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
          >
            <span>Interact with 3D Ramen Bowl 🍜</span>
          </button>
        </div>
      </div>
    </div>
  );
};

