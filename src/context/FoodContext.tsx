import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  FoodItem,
  FoodLogEntry,
  FoodMemory,
  CommunitySubmission,
  FoodoraPartner,
  MealAnalysisResult,
  OCRLabelResult,
  MealType,
  ChatMessage,
  GeneratedRecipe,
} from "../types/food";
import { SAMPLE_FOOD_DATABASE, SAMPLE_PARTNERS, SAMPLE_COMMUNITY_SUBMISSIONS } from "../data/foodDatabase";
import { GLOBAL_EXPANDED_FOOD_DATABASE } from "../data/globalFoodsData";

interface NutritionGoals {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  waterMl: number;
}

interface FoodContextType {
  // Navigation & Modals
  currentView: string;
  setCurrentView: (view: string) => void;
  isScanModalOpen: boolean;
  setIsScanModalOpen: (open: boolean) => void;
  isBarcodeModalOpen: boolean;
  setIsBarcodeModalOpen: (open: boolean) => void;
  isLabelModalOpen: boolean;
  setIsLabelModalOpen: (open: boolean) => void;
  isAskDrawerOpen: boolean;
  setIsAskDrawerOpen: (open: boolean) => void;
  activeFoodDetail: FoodItem | null;
  setActiveFoodDetail: (food: FoodItem | null) => void;

  // Comparison
  comparisonItems: FoodItem[];
  addToCompare: (food: FoodItem) => void;
  removeFromCompare: (foodId: string) => void;
  clearCompare: () => void;

  // Food Database
  foodDatabase: FoodItem[];
  addFoodToDatabase: (food: FoodItem) => void;
  getFoodById: (id: string) => FoodItem | undefined;

  // Logging & Dashboard
  todayLogs: FoodLogEntry[];
  logFood: (entry: Omit<FoodLogEntry, "id" | "timestamp">) => void;
  removeFoodLog: (id: string) => void;
  nutritionGoals: NutritionGoals;
  updateNutritionGoals: (goals: Partial<NutritionGoals>) => void;
  loggedWaterMl: number;
  addWater: (ml: number) => void;

  // Scan History
  scanHistory: FoodItem[];
  addScanToHistory: (food: FoodItem) => void;
  clearScanHistory: () => void;

  // Favorites
  favoriteFoodIds: string[];
  toggleFavorite: (foodId: string) => void;
  isFavorite: (foodId: string) => boolean;

  // Food Memories (Visual Diary)
  foodMemories: FoodMemory[];
  addFoodMemory: (memory: Omit<FoodMemory, "id">) => void;
  deleteFoodMemory: (id: string) => void;

  // AI Recipes
  savedRecipes: GeneratedRecipe[];
  saveRecipe: (recipe: GeneratedRecipe) => void;
  deleteSavedRecipe: (id: string) => void;
  isRecipeSaved: (id: string) => boolean;
  lastGeneratedRecipes: GeneratedRecipe[];
  setLastGeneratedRecipes: (recipes: GeneratedRecipe[]) => void;

  // Community & Partners
  communitySubmissions: CommunitySubmission[];
  addCommunitySubmission: (submission: Omit<CommunitySubmission, "id" | "submittedAt" | "votes" | "status">) => void;
  voteSubmission: (id: string) => void;
  partners: FoodoraPartner[];
  addPartnerApplication: (partner: Omit<FoodoraPartner, "id" | "verifiedSince" | "isVerified">) => void;

  // AI Active Results
  lastMealAnalysis: MealAnalysisResult | null;
  setLastMealAnalysis: (result: MealAnalysisResult | null) => void;
  lastOcrResult: OCRLabelResult | null;
  setLastOcrResult: (result: OCRLabelResult | null) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearChat: () => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LOGS: "foodora_today_logs",
  FAVORITES: "foodora_favorites",
  MEMORIES: "foodora_memories",
  RECIPES: "foodora_saved_recipes",
  HISTORY: "foodora_history",
  COMMUNITY: "foodora_community",
  THEME: "foodora_theme",
  GOALS: "foodora_goals",
  WATER: "foodora_water",
};

export const FoodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<string>("home");
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [isAskDrawerOpen, setIsAskDrawerOpen] = useState(false);
  const [activeFoodDetail, setActiveFoodDetail] = useState<FoodItem | null>(null);

  const [foodDatabase, setFoodDatabase] = useState<FoodItem[]>(() => {
    const combinedBase = [...GLOBAL_EXPANDED_FOOD_DATABASE, ...SAMPLE_FOOD_DATABASE];
    try {
      const customSaved = localStorage.getItem("foodora_custom_foods");
      if (customSaved) {
        const parsed = JSON.parse(customSaved);
        if (Array.isArray(parsed)) {
          // Merge avoiding duplicate IDs
          const existingIds = new Set(combinedBase.map((f) => f.id));
          const additions = parsed.filter((f) => !existingIds.has(f.id));
          return [...additions, ...combinedBase];
        }
      }
    } catch (e) {
      console.error(e);
    }
    return combinedBase;
  });
  const [comparisonItems, setComparisonItems] = useState<FoodItem[]>([]);
  const [partners, setPartners] = useState<FoodoraPartner[]>(SAMPLE_PARTNERS);

  const [lastMealAnalysis, setLastMealAnalysis] = useState<MealAnalysisResult | null>(null);
  const [lastOcrResult, setLastOcrResult] = useState<OCRLabelResult | null>(null);

  // Theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return saved ? saved === "dark" : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem(STORAGE_KEYS.THEME, "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem(STORAGE_KEYS.THEME, "light");
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Goals
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      return saved
        ? JSON.parse(saved)
        : {
            calories: 2000,
            proteinG: 120,
            carbsG: 220,
            fatG: 65,
            fiberG: 30,
            waterMl: 2500,
          };
    } catch {
      return {
        calories: 2000,
        proteinG: 120,
        carbsG: 220,
        fatG: 65,
        fiberG: 30,
        waterMl: 2500,
      };
    }
  });

  const updateNutritionGoals = (goals: Partial<NutritionGoals>) => {
    setNutritionGoals((prev) => {
      const updated = { ...prev, ...goals };
      try {
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const [loggedWaterMl, setLoggedWaterMl] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATER);
      return saved ? Number(saved) : 1250;
    } catch {
      return 1250;
    }
  });

  const addWater = (ml: number) => {
    setLoggedWaterMl((prev) => {
      const next = Math.max(0, prev + ml);
      try {
        localStorage.setItem(STORAGE_KEYS.WATER, String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Food Logs (Today)
  const [todayLogs, setTodayLogs] = useState<FoodLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Seed initial logs for instant rich dashboard
    return [
      {
        id: "log-1",
        foodId: "fruit-avocado",
        foodName: "Hass Avocado (1/2 fruit)",
        category: "Fruits",
        mealType: "Breakfast",
        imageUrl: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80",
        servings: 1,
        grams: 100,
        calories: 160,
        proteinG: 2.0,
        carbsG: 8.5,
        fatG: 14.7,
        fiberG: 6.7,
        healthScore: 94,
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        notes: "Served on sourdough toast with poached eggs",
      },
      {
        id: "log-2",
        foodId: "dairy-greek-yogurt",
        foodName: "Greek Yogurt with Blueberries",
        category: "Dairy & Alternatives",
        mealType: "Breakfast",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80",
        servings: 1,
        grams: 170,
        calories: 184,
        proteinG: 18.6,
        carbsG: 27.5,
        fatG: 1.2,
        fiberG: 3.6,
        healthScore: 95,
        timestamp: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
      },
      {
        id: "log-3",
        foodId: "dish-korean-bibimbap",
        foodName: "Classic Dolsot Bibimbap",
        category: "Dishes & Meals",
        mealType: "Lunch",
        imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=400&q=80",
        servings: 1,
        grams: 420,
        calories: 520,
        proteinG: 22.5,
        carbsG: 72.0,
        fatG: 15.0,
        fiberG: 6.5,
        healthScore: 87,
        timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(todayLogs));
    } catch (e) {
      console.error(e);
    }
  }, [todayLogs]);

  const logFood = (entry: Omit<FoodLogEntry, "id" | "timestamp">) => {
    const newEntry: FoodLogEntry = {
      ...entry,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setTodayLogs((prev) => [newEntry, ...prev]);
  };

  const removeFoodLog = (id: string) => {
    setTodayLogs((prev) => prev.filter((item) => item.id !== id));
  };

  // Favorites
  const [favoriteFoodIds, setFavoriteFoodIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : ["fruit-avocado", "meat-salmon", "bev-matcha-latte", "dish-masala-dosa"];
    } catch {
      return ["fruit-avocado", "meat-salmon", "bev-matcha-latte", "dish-masala-dosa"];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favoriteFoodIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteFoodIds]);

  const toggleFavorite = (foodId: string) => {
    setFavoriteFoodIds((prev) =>
      prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]
    );
  };

  const isFavorite = (foodId: string) => favoriteFoodIds.includes(foodId);

  // Scan History
  const [scanHistory, setScanHistory] = useState<FoodItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_FOOD_DATABASE.slice(0, 6);
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(scanHistory));
    } catch (e) {
      console.error(e);
    }
  }, [scanHistory]);

  const addScanToHistory = (food: FoodItem) => {
    setScanHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== food.id && item.name !== food.name);
      return [food, ...filtered.slice(0, 24)];
    });
  };

  const clearScanHistory = () => setScanHistory([]);

  // Food Memories
  const [foodMemories, setFoodMemories] = useState<FoodMemory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "mem-1",
        title: "Sunday Sourdough & Truffle Poached Eggs",
        foodName: "Artisan Sourdough with Poached Eggs & Truffle Oil",
        photoUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
        date: "2026-08-16",
        occasion: "Weekend Family Brunch",
        personalNote: "Baked the loaf using a 3-day cold starter. Perfect golden crust and creamy interior!",
        locationOrPlace: "Home Kitchen",
        calories: 410,
        proteinG: 18,
        carbsG: 38,
        fatG: 16,
        tags: ["Homemade", "Brunch", "Artisan", "High Protein"],
      },
      {
        id: "mem-2",
        title: "Authentic Kyoto Matcha Whisking",
        foodName: "Ceremonial Uji Matcha with Sweet Wagashi",
        photoUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
        date: "2026-08-12",
        occasion: "Afternoon Mindfulness Routine",
        personalNote: "Whisked with bamboo chasen until velvety foam formed. Soothing, jitter-free focus.",
        locationOrPlace: "Zen Garden Tea Room",
        calories: 110,
        proteinG: 3,
        carbsG: 14,
        fatG: 4,
        tags: ["Mindfulness", "Antioxidants", "Zen", "Tea Culture"],
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(foodMemories));
    } catch (e) {
      console.error(e);
    }
  }, [foodMemories]);

  const addFoodMemory = (memory: Omit<FoodMemory, "id">) => {
    const newMemory: FoodMemory = {
      ...memory,
      id: `mem-${Date.now()}`,
    };
    setFoodMemories((prev) => [newMemory, ...prev]);
  };

  const deleteFoodMemory = (id: string) => {
    setFoodMemories((prev) => prev.filter((m) => m.id !== id));
  };

  // AI Recipes
  const [savedRecipes, setSavedRecipes] = useState<GeneratedRecipe[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECIPES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [lastGeneratedRecipes, setLastGeneratedRecipes] = useState<GeneratedRecipe[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(savedRecipes));
    } catch (e) {
      console.error(e);
    }
  }, [savedRecipes]);

  const saveRecipe = (recipe: GeneratedRecipe) => {
    setSavedRecipes((prev) => {
      if (prev.some((r) => r.id === recipe.id)) return prev;
      return [recipe, ...prev];
    });
  };

  const deleteSavedRecipe = (id: string) => {
    setSavedRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  const isRecipeSaved = (id: string) => {
    return savedRecipes.some((r) => r.id === id);
  };

  // Community Submissions
  const [communitySubmissions, setCommunitySubmissions] = useState<CommunitySubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMUNITY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_COMMUNITY_SUBMISSIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify(communitySubmissions));
    } catch (e) {
      console.error(e);
    }
  }, [communitySubmissions]);

  const addCommunitySubmission = (
    submission: Omit<CommunitySubmission, "id" | "submittedAt" | "votes" | "status">
  ) => {
    const newSub: CommunitySubmission = {
      ...submission,
      id: `comm-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      votes: 1,
      status: "Submitted",
    };
    setCommunitySubmissions((prev) => [newSub, ...prev]);
  };

  const voteSubmission = (id: string) => {
    setCommunitySubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, votes: sub.votes + 1 } : sub))
    );
  };

  const addPartnerApplication = (partner: Omit<FoodoraPartner, "id" | "verifiedSince" | "isVerified">) => {
    const newPartner: FoodoraPartner = {
      ...partner,
      id: `partner-${Date.now()}`,
      verifiedSince: new Date().toISOString().split("T")[0],
      isVerified: false,
    };
    setPartners((prev) => [newPartner, ...prev]);
  };

  // Database additions
  const addFoodToDatabase = (food: FoodItem) => {
    setFoodDatabase((prev) => {
      const exists = prev.some((f) => f.id === food.id || f.name.toLowerCase() === food.name.toLowerCase());
      if (exists) return prev;
      const updated = [food, ...prev];
      try {
        const customOnly = updated.filter((item) => item.id.startsWith("global-") || item.id.startsWith("custom-") || item.id.startsWith("sub-"));
        localStorage.setItem("foodora_custom_foods", JSON.stringify(customOnly.slice(0, 100)));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const getFoodById = (id: string) => {
    return foodDatabase.find((f) => f.id === id);
  };

  // Compare Tray
  const addToCompare = (food: FoodItem) => {
    setComparisonItems((prev) => {
      if (prev.some((f) => f.id === food.id)) return prev;
      if (prev.length >= 4) {
        return [...prev.slice(1), food];
      }
      return [...prev, food];
    });
  };

  const removeFromCompare = (foodId: string) => {
    setComparisonItems((prev) => prev.filter((f) => f.id !== foodId));
  };

  const clearCompare = () => setComparisonItems([]);

  // Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init",
      role: "assistant",
      content:
        "Hello! I am **Ask Fura AI**, powered by the **Fura AI 1.2 Flash** multimodal engine.\n\nHow can I help you today? You can ask me to analyze any dish, formulate custom recipes, explain complicated nutrition labels and food additives, compare foods, or break down micronutrients and allergen safety.",
      timestamp: new Date().toISOString(),
    },
  ]);

  const addChatMessage = (msg: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: "msg-init-reset",
        role: "assistant",
        content: "Chat history cleared. How can I assist with your food questions today?",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <FoodContext.Provider
      value={{
        currentView,
        setCurrentView,
        isScanModalOpen,
        setIsScanModalOpen,
        isBarcodeModalOpen,
        setIsBarcodeModalOpen,
        isLabelModalOpen,
        setIsLabelModalOpen,
        isAskDrawerOpen,
        setIsAskDrawerOpen,
        activeFoodDetail,
        setActiveFoodDetail,
        comparisonItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        foodDatabase,
        addFoodToDatabase,
        getFoodById,
        todayLogs,
        logFood,
        removeFoodLog,
        nutritionGoals,
        updateNutritionGoals,
        loggedWaterMl,
        addWater,
        scanHistory,
        addScanToHistory,
        clearScanHistory,
        favoriteFoodIds,
        toggleFavorite,
        isFavorite,
        foodMemories,
        addFoodMemory,
        deleteFoodMemory,
        savedRecipes,
        saveRecipe,
        deleteSavedRecipe,
        isRecipeSaved,
        lastGeneratedRecipes,
        setLastGeneratedRecipes,
        communitySubmissions,
        addCommunitySubmission,
        voteSubmission,
        partners,
        addPartnerApplication,
        lastMealAnalysis,
        setLastMealAnalysis,
        lastOcrResult,
        setLastOcrResult,
        chatMessages,
        addChatMessage,
        clearChat,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error("useFood must be used within a FoodProvider");
  }
  return context;
};
