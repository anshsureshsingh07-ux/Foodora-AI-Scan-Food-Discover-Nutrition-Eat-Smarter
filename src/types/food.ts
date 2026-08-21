export type FoodCategory =
  | "Dishes & Meals"
  | "Fruits"
  | "Vegetables"
  | "Grains & Staples"
  | "Pulses & Legumes"
  | "Nuts & Seeds"
  | "Dairy & Alternatives"
  | "Meat & Poultry"
  | "Seafood"
  | "Herbs & Spices"
  | "Snacks"
  | "Desserts"
  | "Beverages"
  | "Bakery & Breads";

export type FoodTypeClassification =
  | "Fresh Foods"
  | "Home-Cooked"
  | "Restaurant Foods"
  | "Street Foods"
  | "Packaged Foods"
  | "Fast Food"
  | "Bakery"
  | "Desserts & Sweets"
  | "Beverages";

export type Continent =
  | "Asia"
  | "Europe"
  | "North America"
  | "South America"
  | "Africa"
  | "Middle East"
  | "Oceania"
  | "Global";

export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snacks" | "Desserts" | "Beverages";

export type CuisineRegion =
  | "Indian"
  | "Italian"
  | "Japanese"
  | "Chinese"
  | "Korean"
  | "Mexican"
  | "Mediterranean & Middle Eastern"
  | "American"
  | "European"
  | "South-East Asian"
  | "African"
  | "Latin American"
  | "Global";

export interface Micronutrient {
  name: string;
  amount: string;
  dailyValuePercent?: number;
}

export interface IngredientItem {
  name: string;
  percentageOrAmount?: string;
  description?: string;
  isAllergen?: boolean;
  allergenType?: string;
  flag?: "Beneficial" | "Neutral" | "High Glycemic" | "Additive" | "Common Allergen";
}

export interface AdditiveInfo {
  code?: string;
  name: string;
  purpose: string;
  safetyScore: string;
}

export interface HealthScoreFactors {
  positives: string[];
  negatives: string[];
}

export interface DietaryFlags {
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isNutFree: boolean;
  isKetoFriendly?: boolean;
  isPaleoFriendly?: boolean;
  isHighProtein?: boolean;
  isHighFiber?: boolean;
  isLowSugar?: boolean;
  isLowSodium?: boolean;
  isHalal?: boolean;
  isKosher?: boolean;
  isJain?: boolean;
}

export interface FoodVariationOption {
  id: string;
  variationName: string;
  variationType: "Home-Cooked" | "Restaurant" | "Street-Food" | "Packaged" | "Regional Specialty";
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  sodiumMg: number;
  healthScore: number;
  keyDifference: string;
  primaryIngredients: string[];
  description: string;
}

export interface FoodItemNutritionPer100g {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sugarG: number;
  saturatedFatG: number;
  sodiumMg: number;
}

export interface FoodItem {
  id: string;
  name: string;
  alternateNames?: string[];
  localName?: string;
  localScript?: string;
  transliteration?: string;
  englishName?: string;
  
  // Hierarchical Geography: Continent -> Country -> Region/State -> City
  continent?: Continent;
  country?: string;
  regionOrState?: string;
  cityOrLocality?: string;
  
  category: FoodCategory;
  foodType?: FoodTypeClassification;
  cuisine?: CuisineRegion | string;
  mealTypes?: MealType[];
  imageUrl: string;
  
  servingSize: string;
  servingWeightGrams: number;
  
  // Per serving values:
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  totalSugarG: number;
  addedSugarG?: number;
  saturatedFatG?: number;
  transFatG?: number;
  sodiumMg: number;
  cholesterolMg?: number;
  potassiumMg?: number;
  
  // Per 100g standardized nutrition
  per100g?: FoodItemNutritionPer100g;
  
  // Health score (0-100) & factors
  healthScore: number;
  healthScoreFactors: HealthScoreFactors;
  
  // Ingredients & allergens
  primaryIngredients?: string[];
  optionalIngredients?: string[];
  ingredients?: IngredientItem[];
  allergens?: string[];
  additivesAndPreservatives?: AdditiveInfo[];
  
  // Recipe variations & Disambiguation ("Which version did you eat?")
  recipeVariations?: FoodVariationOption[];
  preparationMethod?: string;
  recipeWarning?: string;
  
  // Dietary classification
  dietaryFlags: DietaryFlags;
  vitaminsAndMinerals?: Micronutrient[];
  
  description: string;
  confidenceScore?: number;
  isVerified: boolean;
  isAIEstimate?: boolean;
  barcode?: string;
  brand?: string;
  packageSize?: string;
  dataSource?: string;
  lastVerifiedDate?: string;
  originCountry?: string;
  preparationAdvice?: string;
  versionHistory?: { version: string; date: string; changeNote: string }[];
  userCorrectionReportsCount?: number;
}

export interface DetectedMealItem {
  id: string;
  name: string;
  estimatedPortion: string;
  portionGrams: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sodiumMg: number;
  confidence: number;
  suggestedAdjustments?: string[];
}

export type MealComponent = DetectedMealItem;

export interface AnimeFoodStory {
  id: string;
  title: string;
  animeUniverse: string;
  dishName: string;
  coverImage: string;
  loreSnippet: string;
  healthScore: number;
  nutritionalProfile: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  };
  comfortIngredients: string[];
}

export interface MealAnalysisResult {
  mealTitle: string;
  cuisine?: string;
  overallConfidence: number;
  items: DetectedMealItem[];
  totalMeal: {
    totalCalories: number;
    totalProteinG: number;
    totalCarbsG: number;
    totalFatG: number;
    totalFiberG: number;
    totalSodiumMg: number;
    totalSugarG?: number;
  };
  overallHealthScore: number;
  healthAssessment: string;
  micronutrientHighlights?: string[];
  macronutrientSplitPercent?: {
    protein: number;
    carbs: number;
    fat: number;
  };
  isAIEstimate: boolean;
  userCorrectionPrompt?: string;
}

export interface FoodScanCandidate {
  name: string;
  confidence: number; // 0-100
  reason?: string;
  category?: FoodCategory;
  cuisine?: string;
  estimatedCalories?: number;
}

export interface FoodScanAIResponse {
  isFoodDetected: boolean;
  foodName?: string;
  alternateNames?: string[];
  confidenceScore: number;
  topCandidates: FoodScanCandidate[];
  category?: FoodCategory;
  cuisine?: string;
  servingSize?: string;
  servingWeightGrams?: number;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  fiberG?: number;
  totalSugarG?: number;
  addedSugarG?: number;
  saturatedFatG?: number;
  transFatG?: number;
  sodiumMg?: number;
  cholesterolMg?: number;
  potassiumMg?: number;
  vitaminsAndMinerals?: Micronutrient[];
  healthScore?: number;
  healthScoreFactors?: HealthScoreFactors;
  ingredients?: IngredientItem[];
  allergens?: string[];
  additivesAndPreservatives?: AdditiveInfo[];
  dietaryFlags?: DietaryFlags;
  plainLanguageSummary?: string;
  portionAdvice?: string;
  unclearReason?: string;
  isAIEstimate?: boolean;
}

export interface OCRLabelResult {
  productName: string;
  brand?: string;
  servingSize: string;
  servingsPerContainer?: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  saturatedFatG?: number;
  transFatG?: number;
  fiberG: number;
  totalSugarG: number;
  addedSugarG?: number;
  sodiumMg: number;
  cholesterolMg?: number;
  rawIngredientsText?: string;
  parsedIngredients?: IngredientItem[];
  allergensDetected?: string[];
  additivesAndEcodes?: AdditiveInfo[];
  healthScore: number;
  healthScoreFactors?: HealthScoreFactors;
  plainLanguageExplanation: string;
  isOcrConfidenceHigh: boolean;
}

export interface FoodLogEntry {
  id: string;
  foodId: string;
  foodName: string;
  category: FoodCategory;
  mealType: MealType;
  imageUrl: string;
  servings: number;
  grams: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  healthScore: number;
  timestamp: string; // ISO string
  notes?: string;
}

export interface FoodMemory {
  id: string;
  title: string;
  foodName: string;
  photoUrl: string;
  date: string;
  occasion: string;
  personalNote: string;
  locationOrPlace?: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  tags: string[];
}

export type SubmissionStatus = "Submitted" | "Under Review" | "Verified" | "Published";

export interface CommunitySubmission {
  id: string;
  foodName: string;
  type: "Missing Food" | "Regional Dish" | "New Recipe" | "Product Correction" | "Barcode Addition";
  category: FoodCategory;
  cuisine?: string;
  calories?: number;
  servingSize?: string;
  ingredientsDescription: string;
  submittedBy: string;
  status: SubmissionStatus;
  votes: number;
  submittedAt: string;
  moderatorNotes?: string;
}

export interface FoodoraPartner {
  id: string;
  name: string;
  category: "Food Brand" | "Restaurant / Café" | "Grocery Retailer" | "Nutrition & Research" | "Fitness Platform";
  logoUrl: string;
  verifiedSince: string;
  certifiedProductsCount: number;
  description: string;
  website: string;
  originCountry: string;
  featuredFoods: string[];
  isVerified: boolean;
  labTestedCertificates?: string[];
}

export interface AnimeCollaborationStory {
  id: string;
  title: string;
  themeName: string;
  tagline: string;
  quote: string;
  storyDescription: string;
  bannerImage: string;
  ambientColor: string;
  featuredDishes: {
    name: string;
    description: string;
    calories: number;
    comfortScore: number;
    imageUrl: string;
    storySnippet: string;
    recipeHint: string;
  }[];
  digitalBadges: {
    name: string;
    icon: string;
    requirement: string;
    earned: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  foodContext?: Partial<FoodItem>;
}

export interface CompareAnalysisResult {
  summary: string;
  winnerByCategory: {
    highestProtein: string;
    highestFiber: string;
    lowestSugar: string;
    highestMicronutrientDensity: string;
    bestForSatiety: string;
  };
  keyDifferences: string[];
  practicalTakeaways: string[];
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  isPantryItem?: boolean;
  isUserProvided?: boolean;
  substitutions?: string;
}

export interface RecipeInstructionStep {
  stepNumber: number;
  title: string;
  instruction: string;
  durationMinutes?: number;
  tip?: string;
}

export interface GeneratedRecipe {
  id: string;
  title: string;
  subtitle: string;
  cuisine: string;
  mealType: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  difficulty: "Easy" | "Medium" | "Advanced";
  servings: number;
  imageUrl?: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sodiumMg: number;
  sugarG?: number;
  healthScore: number;
  healthScoreFactors: HealthScoreFactors;
  dietaryTags: string[];
  matchedIngredientsCount?: number;
  totalIngredientsCount?: number;
  ingredients: RecipeIngredient[];
  missingOrOptionalIngredients?: string[];
  instructions: RecipeInstructionStep[];
  chefTips: string[];
  nutritionHighlights: string[];
  flavorProfile: {
    savory: number;
    sweet: number;
    spicy: number;
    tangy: number;
    umami: number;
  };
  isAIEstimate: boolean;
  generationTimestamp: string;
}

export interface RecipeGenerationParams {
  ingredients: string[];
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  mealType?: string;
  maxCookTimeMinutes?: number;
  skillLevel?: "Easy" | "Medium" | "Advanced";
  servings?: number;
  additionalNotes?: string;
}
