import React, { useState, useRef } from "react";
import { useFood } from "../../context/FoodContext";
import { FoodItem, FoodScanCandidate, FoodScanAIResponse } from "../../types/food";
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Flame,
  Search,
  Check,
  HelpCircle,
} from "lucide-react";

export const ImageUploadDropzone: React.FC = () => {
  const { setActiveFoodDetail, addScanToHistory, addFoodToDatabase, setCurrentView, foodDatabase, logFood } = useFood();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeScanIdRef = useRef<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  // Result & confidence states
  const [scanResponse, setScanResponse] = useState<FoodScanAIResponse | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<FoodScanCandidate | null>(null);
  const [analyzedFood, setAnalyzedFood] = useState<FoodItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLowConfidence, setIsLowConfidence] = useState(false);
  const [isMediumConfidence, setIsMediumConfidence] = useState(false);

  const samplePresets = [
    {
      name: "Wild Salmon & Asparagus",
      category: "Seafood",
      url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Crispy Masala Dosa",
      category: "Indian",
      url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Ceremonial Uji Matcha",
      category: "Beverage",
      url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Crisp Gala Apple",
      category: "Fruit",
      url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Non-Food (Desk Workspace)",
      category: "Non-Food Rejection Test",
      url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPEG, PNG, WEBP, HEIC).");
      return;
    }
    console.log(`[Dropzone] File selected: ${file.name}, size: ${Math.round(file.size / 1024)} KB, type: ${file.type}`);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage(base64);
      analyzePhoto(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const findMatchingDatabaseFood = (foodName: string): FoodItem | undefined => {
    const query = foodName.toLowerCase().trim();
    return foodDatabase.find((item) => {
      const matchName = item.name.toLowerCase();
      const matchEng = item.englishName?.toLowerCase();
      const matchLocal = item.localName?.toLowerCase();
      const matchAlt = item.alternateNames?.some((alt) => alt.toLowerCase().includes(query) || query.includes(alt.toLowerCase()));
      return matchName === query || matchName.includes(query) || query.includes(matchName) || matchEng === query || matchLocal === query || matchAlt;
    });
  };

  const analyzePhoto = async (imageInput: string, mimeType: string = "image/jpeg", hintName?: string) => {
    const scanId = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    activeScanIdRef.current = scanId;

    setIsAnalyzing(true);
    setAnalysisStep(1);
    setAnalyzedFood(null);
    setScanResponse(null);
    setSelectedCandidate(null);
    setErrorMessage(null);
    setIsLowConfidence(false);
    setIsMediumConfidence(false);

    console.log(`[Dropzone] Scan started (ID: ${scanId}) - uploading and invoking AI vision model...`);

    try {
      setTimeout(() => {
        if (activeScanIdRef.current === scanId) setAnalysisStep(2);
      }, 400);

      const response = await fetch("/api/gemini/scan-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageData: imageInput.startsWith("data:") ? imageInput : undefined,
          imageUrl: !imageInput.startsWith("data:") ? imageInput : undefined,
          mimeType,
          hintName,
        }),
      });

      if (activeScanIdRef.current !== scanId) {
        console.warn(`[Dropzone] Stale upload response ignored for ${scanId}`);
        return;
      }

      console.log(`[Dropzone] AI response received for ${scanId}, HTTP status: ${response.status}`);

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "Food identification unavailable. Please try another image.");
      }

      const data: FoodScanAIResponse = await response.json();
      console.log(`[Dropzone] AI scan payload:`, data);

      setAnalysisStep(3);

      if (!data || typeof data !== "object") {
        throw new Error("Invalid response from food analysis engine.");
      }

      if (data.isFoodDetected === false) {
        setErrorMessage(data.unclearReason || "We couldn't confidently identify a food in this image. Please take a clearer photo.");
        setIsLowConfidence(true);
        setScanResponse(data);
        return;
      }

      const detectedName = data.foodName || data.topCandidates?.[0]?.name;
      if (!detectedName || detectedName.trim() === "" || detectedName.toLowerCase().includes("unidentified")) {
        setErrorMessage("We couldn't confidently identify a food in this image. Please take a clearer photo.");
        setIsLowConfidence(true);
        setScanResponse(data);
        return;
      }

      setScanResponse(data);
      const topCand = data.topCandidates?.[0] || { name: detectedName, confidence: data.confidenceScore || 80 };
      setSelectedCandidate(topCand);

      const confidence = data.confidenceScore ?? topCand.confidence ?? 0;
      console.log(`[Dropzone] Food identified: "${detectedName}" with ${confidence}% confidence`);

      if (confidence < 50) {
        setIsLowConfidence(true);
        setErrorMessage("We couldn't identify this food with high enough confidence.");
      } else if (confidence < 80) {
        setIsMediumConfidence(true);
      }

      setAnalysisStep(4);

      const dbMatch = findMatchingDatabaseFood(detectedName);
      const fullFood: FoodItem = {
        id: dbMatch?.id || `upload-${Date.now()}`,
        name: dbMatch?.name || detectedName,
        alternateNames: data.alternateNames || dbMatch?.alternateNames || [],
        category: data.category || dbMatch?.category || "Dishes & Meals",
        cuisine: data.cuisine || dbMatch?.cuisine || "Global",
        imageUrl: imageInput,
        servingSize: data.servingSize || dbMatch?.servingSize || "1 plate",
        servingWeightGrams: data.servingWeightGrams || dbMatch?.servingWeightGrams || 250,
        calories: data.calories ?? dbMatch?.calories ?? 320,
        proteinG: data.proteinG ?? dbMatch?.proteinG ?? 16,
        carbsG: data.carbsG ?? dbMatch?.carbsG ?? 34,
        fatG: data.fatG ?? dbMatch?.fatG ?? 12,
        fiberG: data.fiberG ?? dbMatch?.fiberG ?? 4,
        totalSugarG: data.totalSugarG ?? dbMatch?.totalSugarG ?? 2.5,
        sodiumMg: data.sodiumMg ?? dbMatch?.sodiumMg ?? 400,
        healthScore: data.healthScore ?? dbMatch?.healthScore ?? 85,
        healthScoreFactors: data.healthScoreFactors || dbMatch?.healthScoreFactors || {
          positives: ["Fresh ingredients", "Balanced nutrient density"],
          negatives: ["Standard seasoning"],
        },
        dietaryFlags: data.dietaryFlags || dbMatch?.dietaryFlags || {
          isVegetarian: true,
          isVegan: false,
          isGlutenFree: true,
          isDairyFree: false,
          isNutFree: true,
        },
        description: data.plainLanguageSummary || dbMatch?.description || "Identified via Foodora Multimodal Image Engine.",
        ingredients: data.ingredients || dbMatch?.ingredients || [],
        allergens: data.allergens || dbMatch?.allergens || [],
        isVerified: Boolean(dbMatch),
        confidenceScore: confidence,
        dataSource: dbMatch ? `Foodora Verified DB (${dbMatch.dataSource || "Curated"})` : "Foodora Gemini Multimodal Analysis",
        lastVerifiedDate: new Date().toISOString().split("T")[0],
        preparationAdvice: data.portionAdvice,
      };

      setAnalyzedFood(fullFood);

      if (confidence >= 50) {
        addFoodToDatabase(fullFood);
        addScanToHistory(fullFood);
      }
    } catch (err: any) {
      if (activeScanIdRef.current === scanId) {
        console.error("[Dropzone] Upload analysis error:", err);
        setErrorMessage(err.message || "Food analysis is temporarily unavailable. Please try again.");
      }
    } finally {
      if (activeScanIdRef.current === scanId) {
        setIsAnalyzing(false);
      }
    }
  };

  const handleSelectAlternativeCandidate = (candidate: FoodScanCandidate) => {
    setSelectedCandidate(candidate);
    setIsMediumConfidence(false);
    setIsLowConfidence(false);
    setErrorMessage(null);

    const dbMatch = findMatchingDatabaseFood(candidate.name);
    if (analyzedFood) {
      const updatedFood: FoodItem = {
        ...analyzedFood,
        id: dbMatch?.id || `cand-${Date.now()}`,
        name: dbMatch?.name || candidate.name,
        category: candidate.category || dbMatch?.category || analyzedFood.category,
        cuisine: candidate.cuisine || dbMatch?.cuisine || analyzedFood.cuisine,
        confidenceScore: candidate.confidence,
        isVerified: Boolean(dbMatch),
      };
      setAnalyzedFood(updatedFood);
      addScanToHistory(updatedFood);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
          <ImageIcon className="w-4 h-4" />
          <span>Multimodal Photo Vision</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Upload Food Photograph
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Drag and drop any photograph of food, ingredients, or home-cooked meals for instant AI nutrition extraction.
        </p>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
            : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-emerald-500/80 shadow-xs"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <Upload className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-zinc-900 dark:text-white">
              Choose a photo or drag & drop here
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Supports JPG, PNG, HEIC, WEBP up to 25MB
            </p>
          </div>

          <button
            type="button"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 inline-flex items-center gap-1.5"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Select Image from Device</span>
          </button>
        </div>
      </div>

      {/* Presets Strip */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
          Or Test with Real Image Presets:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {samplePresets.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedImage(preset.url);
                analyzePhoto(preset.url, "image/jpeg", preset.name);
              }}
              className="group relative h-24 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 cursor-pointer shadow-xs hover:border-emerald-500 transition-all"
            >
              <img
                src={preset.url}
                alt={preset.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                <span className="text-[11px] font-bold text-white leading-tight">
                  {preset.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progressive Processing State */}
      {isAnalyzing && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto animate-spin">
            <RefreshCw className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Analyzing Food Photograph...</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              Extracting ingredient boundaries, calculating macronutrient densities, and cross-verifying verified food databases.
            </p>
          </div>

          <div className="w-full max-w-xs mx-auto space-y-2 text-xs text-left pt-2">
            <div className={`flex items-center gap-2.5 transition-colors ${analysisStep >= 1 ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-zinc-400"}`}>
              {analysisStep >= 1 ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-700 shrink-0" />}
              <span>Photo uploaded & validated</span>
            </div>
            <div className={`flex items-center gap-2.5 transition-colors ${analysisStep >= 2 ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-zinc-400"}`}>
              {analysisStep >= 2 ? (
                analysisStep === 2 ? <RefreshCw className="w-4 h-4 shrink-0 animate-spin text-emerald-500" /> : <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              ) : <div className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-700 shrink-0" />}
              <span>AI Multimodal Vision Identification</span>
            </div>
            <div className={`flex items-center gap-2.5 transition-colors ${analysisStep >= 3 ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-zinc-400"}`}>
              {analysisStep >= 3 ? (
                analysisStep === 3 ? <RefreshCw className="w-4 h-4 shrink-0 animate-spin text-emerald-500" /> : <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              ) : <div className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-700 shrink-0" />}
              <span>Cross-referencing verified databases</span>
            </div>
            <div className={`flex items-center gap-2.5 transition-colors ${analysisStep >= 4 ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-zinc-400"}`}>
              {analysisStep >= 4 ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-700 shrink-0" />}
              <span>Compiling nutrition report</span>
            </div>
          </div>
        </div>
      )}

      {/* Error & Low Confidence Notification */}
      {errorMessage && !isAnalyzing && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 space-y-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">
                {isLowConfidence ? "We couldn't confidently identify this food" : "Image Processing Notice"}
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300/90 mt-0.5">{errorMessage}</p>
            </div>
          </div>

          {/* Alternative Candidates */}
          {scanResponse?.topCandidates && scanResponse.topCandidates.length > 0 && (
            <div className="pt-2 border-t border-amber-200 dark:border-amber-800/50 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                Did you mean one of these?
              </span>
              <div className="space-y-1.5">
                {scanResponse.topCandidates.map((cand, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAlternativeCandidate(cand)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-left text-xs flex items-center justify-between transition-colors text-zinc-900 dark:text-zinc-100"
                  >
                    <div>
                      <span className="font-bold block">{cand.name}</span>
                      {cand.reason && <span className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">{cand.reason}</span>}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 rounded border border-emerald-200 dark:border-emerald-800/60">
                      {cand.confidence}% Match
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recovery Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Another Photo</span>
            </button>
            <button
              onClick={() => setCurrentView("database")}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Database Manually</span>
            </button>
          </div>
        </div>
      )}

      {/* Medium Confidence Disambiguation */}
      {isMediumConfidence && analyzedFood && !isAnalyzing && (
        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 text-sky-900 dark:text-sky-200 space-y-2.5 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs">Confirmation Needed</h4>
              <p className="text-[11px] text-sky-700 dark:text-sky-300/90">
                We're not fully sure what this food is. Please select the correct option or search manually:
              </p>
            </div>
          </div>

          {scanResponse?.topCandidates && scanResponse.topCandidates.length > 0 && (
            <div className="grid grid-cols-1 gap-1.5 pt-1">
              {scanResponse.topCandidates.map((cand, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAlternativeCandidate(cand)}
                  className={`p-2 rounded-xl text-left text-xs flex items-center justify-between transition-all ${
                    selectedCandidate?.name === cand.name
                      ? "bg-emerald-50 dark:bg-emerald-950 border border-emerald-500 text-emerald-950 dark:text-white font-bold"
                      : "bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {selectedCandidate?.name === cand.name ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-zinc-300 dark:border-zinc-600" />
                    )}
                    <span>{cand.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400">{cand.confidence}% certainty</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analyzed Food Result Card */}
      {analyzedFood && !errorMessage && !isAnalyzing && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={analyzedFood.imageUrl}
                alt={analyzedFood.name}
                className="w-20 h-20 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-800"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-black text-xl text-zinc-900 dark:text-white">
                    {analyzedFood.name}
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {analyzedFood.confidenceScore || 92}% Confidence
                  </span>
                  {analyzedFood.isVerified && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {analyzedFood.category} • {analyzedFood.servingSize} ({analyzedFood.servingWeightGrams}g) • {analyzedFood.cuisine}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-zinc-900 dark:text-white flex items-baseline justify-end gap-1">
                <Flame className="w-5 h-5 text-amber-500" />
                {analyzedFood.calories}
                <span className="text-xs font-bold text-zinc-400">kcal</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Health Score: {analyzedFood.healthScore}/100
              </span>
            </div>
          </div>

          {/* Macros Bar */}
          <div className="grid grid-cols-4 gap-2 text-center bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-400 font-semibold block text-[10px] uppercase">Protein</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {analyzedFood.proteinG}g
              </span>
            </div>
            <div>
              <span className="text-zinc-400 font-semibold block text-[10px] uppercase">Carbs</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                {analyzedFood.carbsG}g
              </span>
            </div>
            <div>
              <span className="text-zinc-400 font-semibold block text-[10px] uppercase">Fat</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                {analyzedFood.fatG}g
              </span>
            </div>
            <div>
              <span className="text-zinc-400 font-semibold block text-[10px] uppercase">Fiber</span>
              <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">
                {analyzedFood.fiberG}g
              </span>
            </div>
          </div>

          {/* Multi-candidate Alternative Chips */}
          {scanResponse?.topCandidates && scanResponse.topCandidates.length > 1 && (
            <div className="pt-1">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 uppercase font-semibold block mb-1.5">
                Other Detected Possibilities (Tap to switch):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {scanResponse.topCandidates.map((cand, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAlternativeCandidate(cand)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                      selectedCandidate?.name === cand.name
                        ? "bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold"
                        : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {cand.name} ({cand.confidence}%)
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedImage(null);
                setAnalyzedFood(null);
                setScanResponse(null);
              }}
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-semibold underline text-center"
            >
              Upload Another Photo
            </button>

            <button
              onClick={() => {
                logFood({
                  foodId: analyzedFood.id,
                  foodName: analyzedFood.name,
                  category: analyzedFood.category,
                  mealType: "Lunch",
                  imageUrl: analyzedFood.imageUrl,
                  servings: 1,
                  grams: analyzedFood.servingWeightGrams || 250,
                  calories: analyzedFood.calories,
                  proteinG: analyzedFood.proteinG,
                  carbsG: analyzedFood.carbsG,
                  fatG: analyzedFood.fatG,
                  fiberG: analyzedFood.fiberG,
                  healthScore: analyzedFood.healthScore,
                });
                setActiveFoodDetail(analyzedFood);
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>View Full Nutrition Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
