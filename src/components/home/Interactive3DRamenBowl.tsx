import React, { useState, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Flame,
  Sparkles,
  Utensils,
  Check,
  RefreshCw,
  Eye,
  Info,
  ShieldCheck,
  Sliders,
  Layers,
  Activity,
  Award,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useFood } from "../../context/FoodContext";
import { soundFx } from "../../utils/soundEffects";
import {
  ThreeDWebGLCanvas,
  BrothKey,
  ToppingConfig,
} from "./ThreeDWebGLCanvas";

interface BrothData {
  id: BrothKey;
  name: string;
  badge: string;
  tagline: string;
  desc: string;
  baseCalories: number;
  baseProtein: number;
  baseCarbs: number;
  baseFat: number;
  fiber: number;
  sodium: number;
  healthScore: number;
  bioactives: string[];
}

const BROTHS: Record<BrothKey, BrothData> = {
  shoyu: {
    id: "shoyu",
    name: "Tokyo Shoyu",
    badge: "Artisanal Classic",
    tagline: "Clear Dashi & Aged Soy",
    desc: "Aromatic clear free-range chicken & dashi broth infused with 2-year cedar barrel aged soy sauce, kombu, and bonito oil.",
    baseCalories: 510,
    baseProtein: 24,
    baseCarbs: 65,
    baseFat: 16,
    fiber: 4.2,
    sodium: 1420,
    healthScore: 86,
    bioactives: ["Kombu Glutamates", "Soy Peptide Aminos", "Heart-healthy Umami"],
  },
  tonkotsu: {
    id: "tonkotsu",
    name: "Hakata Tonkotsu",
    badge: "Collagen Rich",
    tagline: "18-Hour Slow Emulsion",
    desc: "Rich, creamy 18-hour collagen-infused Berkshire pork marrow broth with charred scallion aroma oil and micro-fats.",
    baseCalories: 660,
    baseProtein: 34,
    baseCarbs: 62,
    baseFat: 32,
    fiber: 3.5,
    sodium: 1680,
    healthScore: 82,
    bioactives: ["Type I & III Collagen", "Chondroitin", "Marrow Glycine"],
  },
  "spicy-miso": {
    id: "spicy-miso",
    name: "Sapporo Spicy Miso",
    badge: "Metabolic Boost",
    tagline: "Fermented Red Miso & Chili",
    desc: "Triple-fermented red miso roasted in sesame paste with charred garlic chili oil, Sichuan red pepper, and ginger.",
    baseCalories: 590,
    baseProtein: 28,
    baseCarbs: 68,
    baseFat: 22,
    fiber: 6.8,
    sodium: 1540,
    healthScore: 88,
    bioactives: ["Capsaicin Bio-activators", "Probiotic Miso Peptides", "Gingerols"],
  },
  "matcha-pesto": {
    id: "matcha-pesto",
    name: "Kyoto Veggie Matcha",
    badge: "Plant-Powered",
    tagline: "Ceremonial Matcha & Oat Dashi",
    desc: "Velvety oat-shiitake dashi emulsion whisked with ceremonial Uji matcha, roasted sesame, and cold-pressed yuzu oil.",
    baseCalories: 460,
    baseProtein: 20,
    baseCarbs: 72,
    baseFat: 12,
    fiber: 8.5,
    sodium: 1120,
    healthScore: 95,
    bioactives: ["EGCG Catechins", "L-Theanine", "Shiitake Beta-Glucans"],
  },
  "black-garlic": {
    id: "black-garlic",
    name: "Black Garlic Truffle",
    badge: "Chef's Reserve",
    tagline: "Aged Mayu & Black Truffle",
    desc: "Smoky 40-day aged black garlic reduction (Mayu) married with shaved winter truffle dashi and roasted sesame paste.",
    baseCalories: 620,
    baseProtein: 29,
    baseCarbs: 64,
    baseFat: 26,
    fiber: 5.1,
    sodium: 1480,
    healthScore: 89,
    bioactives: ["S-Allyl-Cysteine (SAC)", "Polyphenols", "Truffle Terpenoids"],
  },
};

const TOPPING_ITEMS: Array<{
  id: keyof ToppingConfig;
  name: string;
  icon: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  desc: string;
}> = [
  {
    id: "chashu",
    name: "Chashu Pork Belly",
    icon: "🥩",
    calories: 140,
    protein: 12,
    carbs: 1,
    fat: 10,
    desc: "Slow-braised caramelized Berkshire pork belly",
  },
  {
    id: "tamago",
    name: "Ajitsuke Jammy Egg",
    icon: "🥚",
    calories: 78,
    protein: 6.5,
    carbs: 1.2,
    fat: 5.2,
    desc: "Soy-marinated 6-minute soft-boiled egg with runny yolk",
  },
  {
    id: "nori",
    name: "Crispy Nori Sheet",
    icon: "🌿",
    calories: 8,
    protein: 1.0,
    carbs: 0.8,
    fat: 0.1,
    desc: "Toasted Ariake sea nori with organic marine iodine",
  },
  {
    id: "naruto",
    name: "Narutomaki Swirl",
    icon: "🍥",
    calories: 25,
    protein: 3.2,
    carbs: 2.5,
    fat: 0.3,
    desc: "Artisanal steamed fish cake with natural beet swirl",
  },
  {
    id: "scallions",
    name: "Fresh Scallions",
    icon: "🌱",
    calories: 6,
    protein: 0.4,
    carbs: 1.1,
    fat: 0.0,
    desc: "Thinly sliced Tokyo scallions with allicin antioxidants",
  },
  {
    id: "menma",
    name: "Bamboo Menma",
    icon: "🥢",
    calories: 22,
    protein: 1.5,
    carbs: 3.5,
    fat: 0.4,
    desc: "Lactic-fermented tender bamboo shoots",
  },
  {
    id: "mushrooms",
    name: "Shiitake Caps",
    icon: "🍄",
    calories: 32,
    protein: 2.1,
    carbs: 5.8,
    fat: 0.2,
    desc: "Wood-roasted wild shiitake mushroom caps",
  },
  {
    id: "chiliOil",
    name: "Rayu Chili Oil",
    icon: "🔥",
    calories: 45,
    protein: 0.0,
    carbs: 0.2,
    fat: 5.0,
    desc: "House-infused crispy garlic chili crunch oil",
  },
];

export const Interactive3DRamenBowl: React.FC = () => {
  const { logFood } = useFood();

  // Core 3D State
  const [broth, setBroth] = useState<BrothKey>("tonkotsu");
  const [toppings, setToppings] = useState<ToppingConfig>({
    chashu: true,
    tamago: true,
    nori: true,
    naruto: true,
    scallions: true,
    menma: true,
    mushrooms: false,
    chiliOil: false,
  });

  const [isSteamActive, setIsSteamActive] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<"perspective" | "top" | "side" | "closeup">("perspective");
  const [isLogged, setIsLogged] = useState(false);
  const [activeHudTab, setActiveHudTab] = useState<"macros" | "toppings" | "bioactives">("macros");

  // Spring tilt physics for container frame
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 260, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 260, damping: 25 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-5deg", "5deg"]);

  // Calculate live cumulative nutrition
  const totalNutrition = useMemo(() => {
    const b = BROTHS[broth];
    let calories = b.baseCalories;
    let protein = b.baseProtein;
    let carbs = b.baseCarbs;
    let fat = b.baseFat;
    let fiber = b.fiber;
    let sodium = b.sodium;

    TOPPING_ITEMS.forEach((t) => {
      if (toppings[t.id]) {
        calories += t.calories;
        protein += t.protein;
        carbs += t.carbs;
        fat += t.fat;
      }
    });

    return {
      calories: Math.round(calories),
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      fiber: Math.round(fiber * 10) / 10,
      sodium: Math.round(sodium),
      healthScore: b.healthScore,
    };
  }, [broth, toppings]);

  const toggleTopping = (id: keyof ToppingConfig) => {
    soundFx.playPop();
    setToppings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogToDiary = () => {
    soundFx.playSuccess();
    const currentBroth = BROTHS[broth];
    logFood({
      foodId: `webgl-ramen-${broth}`,
      foodName: `Artisanal ${currentBroth.name} 3D Ramen Bowl`,
      mealType: "Lunch",
      servings: 1,
      grams: 520,
      calories: totalNutrition.calories,
      proteinG: totalNutrition.protein,
      carbsG: totalNutrition.carbs,
      fatG: totalNutrition.fat,
      imageUrl:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
    });
    setIsLogged(true);
    setTimeout(() => setIsLogged(false), 3200);
  };

  return (
    <motion.div
      id="3d-interactive-ramen-hero"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="relative w-full rounded-[36px] backdrop-blur-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/85 to-black/95 border border-white/15 shadow-2xl shadow-emerald-950/20 text-white overflow-hidden flex flex-col transition-all duration-300"
    >
      {/* Specular Top-Edge Highlight & Caustic Blur */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent z-30" />
      <div className="pointer-events-none absolute -right-24 -top-24 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl z-10" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl z-10" />

      {/* 1. TOP HEADER & INTERACTIVE CAMERA TOOLBAR */}
      <div className="relative z-20 px-5 sm:px-6 pt-5 pb-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-black text-base shadow-lg shadow-emerald-500/25">
            🍜
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-white text-base sm:text-lg leading-none tracking-tight">
                {BROTHS[broth].name}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
                WebGL 60 FPS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 hidden sm:block">
              {BROTHS[broth].tagline} • Drag to orbit 360°
            </p>
          </div>
        </div>

        {/* Camera Angles & Interactive Controls */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-xl p-1 rounded-2xl border border-white/10 shadow-inner">
          <button
            onClick={() => {
              soundFx.playPop();
              setIsAutoRotate(!isAutoRotate);
            }}
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isAutoRotate
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-slate-700/60"
            }`}
            title={isAutoRotate ? "Pause Orbit Rotation" : "Resume Orbit Rotation"}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAutoRotate ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => {
              soundFx.playPop();
              setIsSteamActive(!isSteamActive);
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              isSteamActive
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white hover:bg-slate-700/60"
            }`}
            title="Toggle Dynamic Steam Wisps"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Steam</span>
          </button>

          {/* Camera View Angle Switcher */}
          <div className="h-4 w-[1px] bg-white/10 mx-0.5" />
          <button
            onClick={() => {
              soundFx.playPop();
              setCameraPreset(cameraPreset === "perspective" ? "top" : cameraPreset === "top" ? "closeup" : "perspective");
            }}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all cursor-pointer"
            title="Cycle Camera Angle Preset"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="capitalize">{cameraPreset}</span>
          </button>
        </div>
      </div>

      {/* 2. THREE.JS WEBGL 3D VIEWPORT */}
      <div className="relative w-full h-[340px] sm:h-[380px] overflow-hidden flex items-center justify-center">
        <ThreeDWebGLCanvas
          broth={broth}
          toppings={toppings}
          isSteamActive={isSteamActive}
          isAutoRotate={isAutoRotate}
          cameraPreset={cameraPreset}
          className="w-full h-full"
        />

        {/* Ambient Holographic HUD Overlays */}
        <div className="pointer-events-none absolute top-4 left-4 z-20 flex flex-col gap-1.5">
          <div className="px-3 py-1 rounded-xl backdrop-blur-md bg-slate-900/70 border border-white/10 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>OPTICAL EMULSION ENGINE</span>
          </div>
          <div className="px-3 py-1 rounded-xl backdrop-blur-md bg-slate-900/70 border border-white/10 text-[10px] font-mono text-cyan-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" />
            <span>HEALTH SCORE: {totalNutrition.healthScore}/100</span>
          </div>
        </div>

        {/* Drag to Orbit Gesture Pill */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full backdrop-blur-md bg-slate-900/80 text-slate-300 text-[11px] font-extrabold border border-white/15 tracking-wide flex items-center gap-2 shadow-lg">
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Drag 360° • Pinch / Wheel to Zoom</span>
        </div>
      </div>

      {/* 3. BROTH & INGREDIENT SELECTOR RIBBON */}
      <div className="relative z-20 px-5 sm:px-6 py-2.5 bg-slate-900/60 border-t border-white/10">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Artisanal Broth Selection</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-400/90">5 Signature Recipes</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {(Object.keys(BROTHS) as BrothKey[]).map((key) => {
            const b = BROTHS[key];
            const isSelected = broth === key;
            return (
              <button
                key={key}
                onClick={() => {
                  soundFx.playPop();
                  setBroth(key);
                }}
                className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-600/25 scale-102"
                    : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-white/5 hover:border-white/15"
                }`}
              >
                <div className="text-xs font-black truncate">{b.name}</div>
                <div
                  className={`text-[10px] truncate ${
                    isSelected ? "text-emerald-100 font-medium" : "text-slate-400"
                  }`}
                >
                  {b.badge}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. TOPPING CUSTOMIZATION STRIP */}
      <div className="relative z-20 px-5 sm:px-6 py-2.5 bg-slate-950/70 border-t border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex-shrink-0">
          Toppings:
        </span>
        <div className="flex items-center gap-1.5 flex-nowrap">
          {TOPPING_ITEMS.map((item) => {
            const isActive = toppings[item.id];
            return (
              <button
                key={item.id}
                onClick={() => toggleTopping(item.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-xs"
                    : "bg-slate-800/40 border-white/5 text-slate-500 line-through opacity-60 hover:opacity-100"
                }`}
                title={item.desc}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
                <span className="text-[9px] opacity-70 font-mono">
                  {isActive ? `+${item.calories}` : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. LIVE NUTRITIONAL HUD & 1-CLICK MEAL LOGGING */}
      <div className="relative z-20 p-5 sm:p-6 bg-slate-900/90 backdrop-blur-2xl border-t border-white/10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        {/* Dynamic Macro Readouts */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 divide-x divide-white/10 w-full lg:w-auto">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Total Energy
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-white font-mono leading-none">
                {totalNutrition.calories}
              </span>
              <span className="text-[11px] text-slate-400 font-bold">kcal</span>
            </div>
          </div>

          <div className="pl-3 sm:pl-4">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
              Protein
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono leading-none">
                {totalNutrition.protein}
              </span>
              <span className="text-[11px] text-slate-400 font-bold">g</span>
            </div>
          </div>

          <div className="pl-3 sm:pl-4">
            <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
              Carbs
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg sm:text-xl font-black text-amber-400 font-mono leading-none">
                {totalNutrition.carbs}
              </span>
              <span className="text-[11px] text-slate-400 font-bold">g</span>
            </div>
          </div>

          <div className="pl-3 sm:pl-4">
            <span className="text-[10px] uppercase font-bold text-sky-400 block tracking-wider">
              Healthy Fats
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg sm:text-xl font-black text-sky-400 font-mono leading-none">
                {totalNutrition.fat}
              </span>
              <span className="text-[11px] text-slate-400 font-bold">g</span>
            </div>
          </div>
        </div>

        {/* 1-Click Log Action */}
        <div className="flex items-center gap-3">
          <button
            id="log-3d-webgl-ramen-btn"
            onClick={handleLogToDiary}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl active:scale-98 cursor-pointer ${
              isLogged
                ? "bg-emerald-500 text-white shadow-emerald-500/30 scale-102"
                : "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/30"
            }`}
          >
            {isLogged ? (
              <>
                <Check className="w-4 h-4" />
                <span>Logged to Meal Diary! ✓</span>
              </>
            ) : (
              <>
                <Utensils className="w-4 h-4" />
                <span>Log to Meal Diary (+{totalNutrition.calories} kcal)</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
