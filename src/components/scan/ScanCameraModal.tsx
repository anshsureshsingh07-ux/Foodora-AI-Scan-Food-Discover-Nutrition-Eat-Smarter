import React, { useState, useRef, useEffect } from "react";
import { useFood } from "../../context/FoodContext";
import { FoodItem, FoodScanCandidate, FoodScanAIResponse } from "../../types/food";
import {
  Camera,
  X,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  Flame,
  Search,
  Check,
  HelpCircle,
} from "lucide-react";

export const ScanCameraModal: React.FC = () => {
  const {
    isScanModalOpen,
    setIsScanModalOpen,
    setActiveFoodDetail,
    addScanToHistory,
    addFoodToDatabase,
    foodDatabase,
    setCurrentView,
    logFood,
  } = useFood();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Active scan tracking to prevent stale/delayed API responses from replacing new scans
  const activeScanIdRef = useRef<string | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  // Detection states
  const [scanResponse, setScanResponse] = useState<FoodScanAIResponse | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<FoodScanCandidate | null>(null);
  const [resolvedFood, setResolvedFood] = useState<FoodItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLowConfidence, setIsLowConfidence] = useState(false);
  const [isMediumConfidence, setIsMediumConfidence] = useState(false);

  // Diverse test presets with real distinct images
  const testPresets = [
    {
      name: "Gala Apple",
      category: "Fruit",
      url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Fresh Mango Slices",
      category: "Fruit",
      url: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Crispy Masala Dosa",
      category: "Indian",
      url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Neapolitan Pizza",
      category: "Italian",
      url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Grilled Salmon",
      category: "Seafood",
      url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Non-Food (Desk & Laptop)",
      category: "Test Non-Food Rejection",
      url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    },
  ];

  // Start camera stream when modal opens
  useEffect(() => {
    if (!isScanModalOpen) {
      stopCamera();
      resetScanState();
      return;
    }

    startCamera();
    return () => {
      stopCamera();
    };
  }, [isScanModalOpen, facingMode]);

  const resetScanState = () => {
    setCapturedImage(null);
    setScanResponse(null);
    setSelectedCandidate(null);
    setResolvedFood(null);
    setErrorMessage(null);
    setIsLowConfidence(false);
    setIsMediumConfidence(false);
    setIsAnalyzing(false);
    setAnalysisStep(0);
    activeScanIdRef.current = null;
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn("[Scanner] Camera access unavailable:", err);
      setCameraError(
        "Camera stream not accessible in this environment. You can upload an image from your device or select one of our instant food test presets below."
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    if (!dataUrl || dataUrl.length < 200) {
      setErrorMessage("This image could not be processed. Please use a clear food image.");
      return;
    }

    console.log(`[Scanner] Photo captured successfully. Size: ${Math.round(dataUrl.length / 1024)} KB, MIME: image/jpeg`);
    setCapturedImage(dataUrl);
    processScan(dataUrl, "image/jpeg");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file (JPEG, PNG, WEBP).");
        return;
      }
      console.log(`[Scanner] File selected: ${file.name}, size: ${Math.round(file.size / 1024)} KB, type: ${file.type}`);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setCapturedImage(base64);
        processScan(base64, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (presetUrl: string, presetName: string) => {
    console.log(`[Scanner] Test preset selected: ${presetName} (${presetUrl})`);
    setCapturedImage(presetUrl);
    processScan(presetUrl, "image/jpeg", presetName);
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

  const processScan = async (imageInput: string, mimeType: string, hintName?: string) => {
    // 1. Generate unique scanId for this specific scan lifecycle
    const scanId = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    activeScanIdRef.current = scanId;

    // 2. Clear all prior results & set loading state
    setScanResponse(null);
    setSelectedCandidate(null);
    setResolvedFood(null);
    setErrorMessage(null);
    setIsLowConfidence(false);
    setIsMediumConfidence(false);
    setIsAnalyzing(true);
    setAnalysisStep(1); // Step 1: Image captured & validated

    console.log(`[Scanner] Scan started (ID: ${scanId}) - sending to AI vision engine...`);

    try {
      // Advance to Step 2: Multimodal AI Vision
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

      // Stale scan guard: if a newer scan was started, ignore this response
      if (activeScanIdRef.current !== scanId) {
        console.warn(`[Scanner] Stale scan response ignored for ${scanId}`);
        return;
      }

      console.log(`[Scanner] AI response received for ${scanId}, HTTP status: ${response.status}`);

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "Food identification unavailable. Please try another image.");
      }

      const data: FoodScanAIResponse = await response.json();
      console.log(`[Scanner] AI scan payload:`, data);

      // Advance to Step 3: Checking food database
      setAnalysisStep(3);

      // Validate AI Response integrity
      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format from AI vision engine.");
      }

      // Check if the image contains food or is non-food
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
      const topCand = data.topCandidates?.[0] || { name: detectedName, confidence: data.confidenceScore || 75 };
      setSelectedCandidate(topCand);

      const confidence = data.confidenceScore ?? topCand.confidence ?? 0;
      console.log(`[Scanner] Food identified: "${detectedName}" with ${confidence}% confidence`);

      // Evaluate confidence rules
      if (confidence < 50) {
        setIsLowConfidence(true);
        setErrorMessage("We couldn't identify this food with enough confidence.");
      } else if (confidence < 80) {
        setIsMediumConfidence(true);
      }

      // Advance to Step 4: Building full food item & database match
      setAnalysisStep(4);

      // Database Matching & Synchronization
      const dbMatch = findMatchingDatabaseFood(detectedName);
      const fullFood: FoodItem = {
        id: dbMatch?.id || `scanned-${Date.now()}`,
        name: dbMatch?.name || detectedName,
        alternateNames: data.alternateNames || dbMatch?.alternateNames || [],
        category: data.category || dbMatch?.category || "Dishes & Meals",
        cuisine: data.cuisine || dbMatch?.cuisine || "Global",
        imageUrl: imageInput,
        servingSize: data.servingSize || dbMatch?.servingSize || "1 serving (approx 200g)",
        servingWeightGrams: data.servingWeightGrams || dbMatch?.servingWeightGrams || 200,
        calories: data.calories ?? dbMatch?.calories ?? 250,
        proteinG: data.proteinG ?? dbMatch?.proteinG ?? 12,
        carbsG: data.carbsG ?? dbMatch?.carbsG ?? 28,
        fatG: data.fatG ?? dbMatch?.fatG ?? 8,
        fiberG: data.fiberG ?? dbMatch?.fiberG ?? 3,
        totalSugarG: data.totalSugarG ?? dbMatch?.totalSugarG ?? 4,
        sodiumMg: data.sodiumMg ?? dbMatch?.sodiumMg ?? 350,
        healthScore: data.healthScore ?? dbMatch?.healthScore ?? 82,
        healthScoreFactors: data.healthScoreFactors || dbMatch?.healthScoreFactors || {
          positives: ["Fresh ingredients", "Balanced macronutrients"],
          negatives: ["Estimated seasoning balance"],
        },
        dietaryFlags: data.dietaryFlags || dbMatch?.dietaryFlags || {
          isVegetarian: true,
          isVegan: false,
          isGlutenFree: true,
          isDairyFree: true,
          isNutFree: true,
        },
        description: data.plainLanguageSummary || dbMatch?.description || "Food item identified via Foodora AI Multimodal Vision.",
        ingredients: data.ingredients || dbMatch?.ingredients || [],
        allergens: data.allergens || dbMatch?.allergens || [],
        isVerified: Boolean(dbMatch),
        confidenceScore: confidence,
        dataSource: dbMatch ? `Foodora Verified DB (${dbMatch.dataSource || "Curated"})` : "Foodora Gemini Multimodal Analysis",
        lastVerifiedDate: new Date().toISOString().split("T")[0],
        preparationAdvice: data.portionAdvice,
      };

      setResolvedFood(fullFood);

      // Only add to history if confidence is sufficient
      if (confidence >= 50) {
        addScanToHistory(fullFood);
        if (!dbMatch) {
          addFoodToDatabase(fullFood);
        }
      }
    } catch (err: any) {
      if (activeScanIdRef.current === scanId) {
        console.error("[Scanner] Scan error:", err);
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

    // Update resolved food with the candidate's name
    const dbMatch = findMatchingDatabaseFood(candidate.name);
    if (resolvedFood) {
      const updatedFood: FoodItem = {
        ...resolvedFood,
        id: dbMatch?.id || `cand-${Date.now()}`,
        name: dbMatch?.name || candidate.name,
        category: candidate.category || dbMatch?.category || resolvedFood.category,
        cuisine: candidate.cuisine || dbMatch?.cuisine || resolvedFood.cuisine,
        confidenceScore: candidate.confidence,
        isVerified: Boolean(dbMatch),
      };
      setResolvedFood(updatedFood);
      addScanToHistory(updatedFood);
    }
  };

  if (!isScanModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={() => setIsScanModalOpen(false)}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative space-y-0 text-white my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>Foodora AI Real-Time Vision</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Multimodal
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400">Accurately identifies fresh ingredients, meals & dishes</p>
            </div>
          </div>
          <button
            onClick={() => setIsScanModalOpen(false)}
            className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative aspect-4/3 w-full bg-black flex items-center justify-center overflow-hidden shrink-0">
          {capturedImage ? (
            <img src={capturedImage} alt="Captured food" className="w-full h-full object-cover" />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning Target Box Reticle */}
              <div className="absolute inset-8 sm:inset-12 border-2 border-emerald-400/80 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                </div>
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10b981] animate-pulse" />
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                </div>
              </div>

              {/* Camera access warning banner */}
              {cameraError && (
                <div className="absolute inset-0 bg-zinc-950/92 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-zinc-100">Camera Access Notice</h4>
                  <p className="text-xs text-zinc-400 max-w-xs">{cameraError}</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Upload Food Photo</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* AI Analyzing Progressive Loading Experience */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-4 z-20">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-spin">
                <RefreshCw className="w-7 h-7" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-bold text-base text-white flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Analyzing your food...</span>
                </h3>
                <p className="text-xs text-zinc-400">Processing live visual features with Foodora Gemini Vision</p>
              </div>

              {/* Progressive Steps */}
              <div className="w-full max-w-xs space-y-2 pt-2 text-xs">
                <div className={`flex items-center gap-2.5 transition-colors ${analysisStep >= 1 ? "text-emerald-400 font-medium" : "text-zinc-500"}`}>
                  {analysisStep >= 1 ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />}
                  <span>Image captured & validated</span>
                </div>
                <div className={`flex items-center gap-2.5 transition-colors ${analysisStep >= 2 ? "text-emerald-400 font-medium" : "text-zinc-500"}`}>
                  {analysisStep >= 2 ? (
                    analysisStep === 2 ? <RefreshCw className="w-4 h-4 shrink-0 animate-spin text-emerald-400" /> : <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />}
                  <span>Identifying food with AI Vision</span>
                </div>
                <div className={`flex items-center gap-2.5 transition-colors ${analysisStep >= 3 ? "text-emerald-400 font-medium" : "text-zinc-500"}`}>
                  {analysisStep >= 3 ? (
                    analysisStep === 3 ? <RefreshCw className="w-4 h-4 shrink-0 animate-spin text-emerald-400" /> : <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />}
                  <span>Checking verified food database</span>
                </div>
                <div className={`flex items-center gap-2.5 transition-colors ${analysisStep >= 4 ? "text-emerald-400 font-medium" : "text-zinc-500"}`}>
                  {analysisStep >= 4 ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />}
                  <span>Preparing nutrition report</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 space-y-3">
          {/* Error / Low Confidence State */}
          {errorMessage && !isAnalyzing && (
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 text-amber-200 space-y-3 animate-in fade-in">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-amber-200">
                    {isLowConfidence ? "We couldn't confidently identify this food" : "Scanning Notice"}
                  </h4>
                  <p className="text-xs text-amber-300/90 leading-relaxed">{errorMessage}</p>
                </div>
              </div>

              {/* Suggestions / Candidates if available */}
              {scanResponse?.topCandidates && scanResponse.topCandidates.length > 0 && (
                <div className="pt-2 border-t border-amber-800/50 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/80 block">
                    Did you mean one of these?
                  </span>
                  <div className="space-y-1.5">
                    {scanResponse.topCandidates.map((cand, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectAlternativeCandidate(cand)}
                        className="w-full p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-left text-xs flex items-center justify-between text-zinc-200 transition-colors"
                      >
                        <div>
                          <span className="font-bold text-white block">{cand.name}</span>
                          {cand.reason && <span className="text-[11px] text-zinc-400 line-clamp-1">{cand.reason}</span>}
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-400 px-2 py-0.5 bg-emerald-950/60 rounded border border-emerald-800/60">
                          {cand.confidence}% Match
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recovery Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    resetScanState();
                    startCamera();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Scan Again</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors flex items-center gap-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Upload Another Photo</span>
                </button>
                <button
                  onClick={() => {
                    setIsScanModalOpen(false);
                    setCurrentView("database");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Database Manually</span>
                </button>
              </div>
            </div>
          )}

          {/* Medium Confidence Disambiguation Prompt */}
          {isMediumConfidence && resolvedFood && !isAnalyzing && (
            <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-800/80 text-sky-200 space-y-2.5 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-sky-200">Confirmation Needed</h4>
                  <p className="text-[11px] text-sky-300/90">
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
                          ? "bg-emerald-950 border border-emerald-500 text-white font-bold"
                          : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {selectedCandidate?.name === cand.name ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-zinc-600" />
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

          {/* High or Confirmed Result Card */}
          {resolvedFood && !errorMessage && !isAnalyzing && (
            <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-3 animate-in fade-in">
              {/* Header Info */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <h3 className="font-bold text-base text-white">{resolvedFood.name}</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {resolvedFood.confidenceScore || 90}% AI Match
                    </span>
                    {resolvedFood.isVerified && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified DB
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400">
                    {resolvedFood.servingSize} • {resolvedFood.category} • {resolvedFood.cuisine}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xl font-black text-white flex items-center justify-end gap-1">
                    <Flame className="w-4 h-4 text-amber-400" />
                    {resolvedFood.calories}
                    <span className="text-[10px] text-zinc-400 uppercase">kcal</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold block">
                    Health Score: {resolvedFood.healthScore}/100
                  </span>
                </div>
              </div>

              {/* Macro Pills */}
              <div className="grid grid-cols-4 gap-2 text-center bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Protein</span>
                  <span className="font-bold text-emerald-400">{resolvedFood.proteinG}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Carbs</span>
                  <span className="font-bold text-amber-400">{resolvedFood.carbsG}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Fat</span>
                  <span className="font-bold text-rose-400">{resolvedFood.fatG}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Fiber</span>
                  <span className="font-bold text-teal-400">{resolvedFood.fiberG}g</span>
                </div>
              </div>

              {/* Multi-candidate Alternatives Chips (if AI generated top candidates) */}
              {scanResponse?.topCandidates && scanResponse.topCandidates.length > 1 && (
                <div className="pt-1">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-1.5">
                    Alternative AI Candidates (Tap to switch):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {scanResponse.topCandidates.map((cand, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectAlternativeCandidate(cand)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                          selectedCandidate?.name === cand.name
                            ? "bg-emerald-950 border-emerald-500 text-emerald-300 font-bold"
                            : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
                        }`}
                      >
                        {cand.name} ({cand.confidence}%)
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    resetScanState();
                    startCamera();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors text-center"
                >
                  Scan Another Food
                </button>
                <button
                  onClick={() => {
                    logFood({
                      foodId: resolvedFood.id,
                      foodName: resolvedFood.name,
                      category: resolvedFood.category,
                      mealType: "Lunch",
                      imageUrl: resolvedFood.imageUrl,
                      servings: 1,
                      grams: resolvedFood.servingWeightGrams || 200,
                      calories: resolvedFood.calories,
                      proteinG: resolvedFood.proteinG,
                      carbsG: resolvedFood.carbsG,
                      fatG: resolvedFood.fatG,
                      fiberG: resolvedFood.fiberG,
                      healthScore: resolvedFood.healthScore,
                    });
                    setActiveFoodDetail(resolvedFood);
                    setIsScanModalOpen(false);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 flex-1"
                >
                  <span>Log & View Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Test Presets (When idle before scan or after error) */}
          {!isAnalyzing && !resolvedFood && !errorMessage && (
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Quick Test Food Images (Real AI Analysis):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {testPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectPreset(preset.url, preset.name)}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-xs transition-colors flex items-center gap-2 group"
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-9 h-9 rounded-lg object-cover shrink-0 border border-zinc-700"
                    />
                    <div className="overflow-hidden">
                      <span className="font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors truncate block">
                        {preset.name}
                      </span>
                      <span className="text-[10px] text-zinc-500 block truncate">{preset.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Shutter & Controls (When Not Viewing a Success Result) */}
        {!resolvedFood && !isAnalyzing && (
          <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Upload image from device"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Image</span>
            </button>

            {/* Shutter Button */}
            <button
              onClick={capturePhoto}
              className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 p-1 flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              title="Capture & Scan Food"
            >
              <div className="w-12 h-12 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
            </button>

            {/* Switch camera button */}
            <button
              onClick={() =>
                setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
              }
              className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Flip Camera"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Flip</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
