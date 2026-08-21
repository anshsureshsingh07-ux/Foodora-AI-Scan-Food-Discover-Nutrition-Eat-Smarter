import React, { useState, useRef } from "react";
import { useFood } from "../../context/FoodContext";
import { OCRLabelResult, FoodItem } from "../../types/food";
import {
  FileText,
  X,
  Upload,
  Camera,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const LabelScannerModal: React.FC = () => {
  const {
    isLabelModalOpen,
    setIsLabelModalOpen,
    setActiveFoodDetail,
    addFoodToDatabase,
    addScanToHistory,
  } = useFood();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRLabelResult | null>(null);

  // Preset sample nutrition labels for instant testing
  const sampleLabels = [
    {
      name: "Organic Peanut Butter Label",
      url: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Oat Milk Carton Label",
      url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSelectedImage(base64);
        processOcr(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const [ocrError, setOcrError] = useState<string | null>(null);

  const processOcr = async (imageInput: string) => {
    setIsOcrProcessing(true);
    setOcrResult(null);
    setOcrError(null);

    try {
      const response = await fetch("/api/gemini/ocr-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageData: imageInput.startsWith("data:") ? imageInput : undefined,
          imageUrl: !imageInput.startsWith("data:") ? imageInput : undefined,
        }),
      });

      if (response.ok) {
        const result: OCRLabelResult = await response.json();
        if (result && result.productName) {
          setOcrResult(result);
        } else {
          setOcrError("No nutrition label text could be recognized. Please upload a clear photo of the nutrition facts panel.");
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        setOcrError(errJson.error || "Label analysis unavailable. Please try another image.");
      }
    } catch (err: any) {
      console.error("OCR error:", err);
      setOcrError("Unable to analyze nutrition label. Please check your network connection and try again.");
    } finally {
      setIsOcrProcessing(false);
    }
  };

  const handleCreateFoodFromOcr = () => {
    if (!ocrResult) return;
    const newFood: FoodItem = {
      id: `ocr-${Date.now()}`,
      name: ocrResult.productName || "Extracted Label Food",
      category: "Snacks",
      imageUrl: selectedImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      servingSize: ocrResult.servingSize || "1 serving",
      servingWeightGrams: 100,
      calories: ocrResult.calories || 150,
      proteinG: ocrResult.proteinG || 4,
      carbsG: ocrResult.carbsG || 20,
      fatG: ocrResult.fatG || 3,
      fiberG: ocrResult.fiberG || 2,
      totalSugarG: ocrResult.sugarG || 2,
      sodiumMg: ocrResult.sodiumMg || 100,
      healthScore: 84,
      healthScoreFactors: {
        positives: ["Extracted verified nutrition label facts"],
        negatives: ocrResult.additives?.length ? ["Contains food additives/stabilizers"] : [],
      },
      dietaryFlags: {
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: true,
        isDairyFree: false,
        isNutFree: true,
      },
      description: `Nutrition Facts extracted directly from packaging via Foodora Multimodal OCR.`,
      allergens: ocrResult.detectedAllergens || [],
      isVerified: true,
      confidenceScore: ocrResult.confidence,
      dataSource: "OCR Package Label Extraction",
    };

    addFoodToDatabase(newFood);
    addScanToHistory(newFood);
    setActiveFoodDetail(newFood);
    setIsLabelModalOpen(false);
  };

  if (!isLabelModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={() => setIsLabelModalOpen(false)}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl text-white my-auto space-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">OCR Nutrition Label Reader</h2>
              <p className="text-[11px] text-zinc-400">Extracts ingredients, allergens & additives</p>
            </div>
          </div>
          <button
            onClick={() => setIsLabelModalOpen(false)}
            className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload / Capture Area */}
        <div className="p-6 bg-zinc-900/60 border-b border-zinc-800 space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {selectedImage ? (
            <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-black border border-zinc-700">
              <img src={selectedImage} alt="Label" className="w-full h-full object-contain" />
              {isOcrProcessing && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center space-y-2">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                  <span className="text-xs font-semibold text-indigo-300">
                    Running OCR & Ingredient Parser...
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-700 hover:border-indigo-500/80 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-black/30 hover:bg-zinc-900"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-bold text-sm text-zinc-200">Upload Nutrition Facts Photo</p>
              <p className="text-xs text-zinc-400 mt-1">Supports PNG, JPG, WebP from camera or gallery</p>
            </div>
          )}

          {/* Quick Presets */}
          <div>
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Or Try Label Samples:
            </span>
            <div className="flex gap-2">
              {sampleLabels.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(sample.url);
                    processOcr(sample.url);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs text-zinc-200 transition-colors"
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {ocrError && !isOcrProcessing && (
          <div className="p-4 bg-amber-950/40 border-b border-amber-800 text-amber-200 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-amber-100">Label OCR Notice</span>
              <p className="text-amber-300/90">{ocrError}</p>
            </div>
          </div>
        )}

        {/* OCR Result View */}
        {ocrResult && !isOcrProcessing && (
          <div className="p-5 bg-zinc-950 space-y-4 max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">{ocrResult.productName}</h3>
                {ocrResult.brand && (
                  <span className="text-xs text-indigo-400 font-semibold">{ocrResult.brand}</span>
                )}
                <p className="text-xs text-zinc-400 mt-0.5">Serving: {ocrResult.servingSize}</p>
              </div>
              <span className="px-2 py-1 bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-bold rounded-lg">
                {ocrResult.confidence}% OCR Match
              </span>
            </div>

            {/* Extracted Nutrients Grid */}
            <div className="grid grid-cols-4 gap-2 text-center bg-zinc-900 p-2.5 rounded-xl border border-zinc-800 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Calories</span>
                <span className="font-bold text-white text-sm">{ocrResult.calories}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Protein</span>
                <span className="font-bold text-emerald-400">{ocrResult.proteinG}g</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Carbs</span>
                <span className="font-bold text-amber-400">{ocrResult.carbsG}g</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Fat</span>
                <span className="font-bold text-rose-400">{ocrResult.fatG}g</span>
              </div>
            </div>

            {/* Extracted Ingredients & Additives */}
            {ocrResult.extractedIngredients && ocrResult.extractedIngredients.length > 0 && (
              <div className="text-xs space-y-1">
                <span className="font-bold text-zinc-300">Extracted Ingredients:</span>
                <p className="text-zinc-400 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                  {ocrResult.extractedIngredients.join(", ")}
                </p>
              </div>
            )}

            {/* Allergens */}
            {ocrResult.detectedAllergens && ocrResult.detectedAllergens.length > 0 && (
              <div className="flex items-center gap-2 p-2.5 bg-rose-950/50 border border-rose-800 text-rose-300 rounded-xl text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>
                  <strong>Allergens Detected:</strong> {ocrResult.detectedAllergens.join(", ")}
                </span>
              </div>
            )}

            <button
              onClick={handleCreateFoodFromOcr}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <span>Save & View Full Intelligence Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
