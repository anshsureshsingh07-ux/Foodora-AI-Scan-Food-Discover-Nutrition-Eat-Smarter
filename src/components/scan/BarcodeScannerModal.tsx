import React, { useState } from "react";
import { useFood } from "../../context/FoodContext";
import { SAMPLE_FOOD_DATABASE } from "../../data/foodDatabase";
import { FoodItem } from "../../types/food";
import {
  Barcode,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Flame,
} from "lucide-react";

export const BarcodeScannerModal: React.FC = () => {
  const {
    isBarcodeModalOpen,
    setIsBarcodeModalOpen,
    setActiveFoodDetail,
    addScanToHistory,
    addFoodToDatabase,
    foodDatabase,
  } = useFood();

  const [barcodeInput, setBarcodeInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [matchedFood, setMatchedFood] = useState<FoodItem | null>(null);
  const [notFoundBarcode, setNotFoundBarcode] = useState<string | null>(null);

  // Quick preset test barcodes
  const sampleBarcodes = [
    { code: "011110038486", name: "Chobani Greek Yogurt" },
    { code: "052100018448", name: "Organic Rolled Oats" },
    { code: "049000000443", name: "Ceremonial Matcha" },
    { code: "084223400192", name: "Artisan Sourdough" },
    { code: "880104301485", name: "Jongga Kimchi" },
  ];

  const handleLookup = async (codeToSearch?: string) => {
    const targetCode = (codeToSearch || barcodeInput).trim();
    if (!targetCode) return;

    setIsSearching(true);
    setMatchedFood(null);
    setNotFoundBarcode(null);

    // Simulate realistic scanner search
    setTimeout(async () => {
      // 1. Search in local database
      const found = foodDatabase.find(
        (f) => f.barcode === targetCode || (f.name.toLowerCase().includes("yogurt") && targetCode.includes("01111"))
      );

      if (found) {
        setMatchedFood(found);
        addScanToHistory(found);
        setIsSearching(false);
        return;
      }

      // 2. Query Gemini endpoint for synthetic package intelligence
      try {
        const response = await fetch("/api/gemini/generate-food-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            foodName: `Packaged Grocery Item (UPC: ${targetCode})`,
            category: "Packaged Foods",
          }),
        });

        if (response.ok) {
          const generated = await response.json();
          const newFood: FoodItem = {
            ...generated,
            id: `upc-${targetCode}`,
            barcode: targetCode,
            isVerified: false,
            confidenceScore: 88,
            dataSource: "Foodora Global GTIN/UPC Resolver",
          };
          setMatchedFood(newFood);
          addFoodToDatabase(newFood);
          addScanToHistory(newFood);
        } else {
          setNotFoundBarcode(targetCode);
        }
      } catch (err) {
        setNotFoundBarcode(targetCode);
      } finally {
        setIsSearching(false);
      }
    }, 600);
  };

  if (!isBarcodeModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={() => setIsBarcodeModalOpen(false)}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl text-white my-auto space-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Barcode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">Barcode Intelligence</h2>
              <p className="text-[11px] text-zinc-400">Scan UPC/EAN packaged products</p>
            </div>
          </div>
          <button
            onClick={() => setIsBarcodeModalOpen(false)}
            className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport Animation with Laser */}
        <div className="p-6 bg-zinc-900/60 border-b border-zinc-800 flex flex-col items-center justify-center space-y-4">
          <div className="relative w-64 h-36 border-2 border-dashed border-teal-500/60 rounded-2xl flex items-center justify-center bg-black/40 overflow-hidden">
            {/* Barcode graphic lines */}
            <div className="flex items-center gap-1 opacity-20">
              <div className="w-1 h-20 bg-white" />
              <div className="w-2 h-20 bg-white" />
              <div className="w-0.5 h-20 bg-white" />
              <div className="w-3 h-20 bg-white" />
              <div className="w-1 h-20 bg-white" />
              <div className="w-2 h-20 bg-white" />
              <div className="w-4 h-20 bg-white" />
              <div className="w-1 h-20 bg-white" />
              <div className="w-2 h-20 bg-white" />
            </div>

            {/* Red scan laser beam */}
            <div className="absolute inset-x-0 h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse" />

            <span className="absolute bottom-2 text-[10px] text-zinc-400 font-mono tracking-widest">
              ALIGN BARCODE IN VIEWER
            </span>
          </div>

          {/* Quick presets */}
          <div className="w-full">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5 text-center">
              Or Test Preset Products:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {sampleBarcodes.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    setBarcodeInput(item.code);
                    handleLookup(item.code);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs text-zinc-300 transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Manual Barcode Search Form */}
        <div className="p-4 bg-zinc-950 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Barcode className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <input
                type="text"
                placeholder="Enter UPC/EAN code (e.g. 011110038486)"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !barcodeInput.trim()}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-zinc-950 font-bold text-xs rounded-xl transition-all"
            >
              {isSearching ? "Searching..." : "Lookup"}
            </button>
          </form>

          {/* Result Card */}
          {matchedFood && (
            <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={matchedFood.imageUrl}
                    alt={matchedFood.name}
                    className="w-12 h-12 rounded-xl object-cover border border-zinc-700"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-white">{matchedFood.name}</h3>
                    <p className="text-xs text-zinc-400">
                      UPC: {matchedFood.barcode || barcodeInput}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-white flex items-center justify-end gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    {matchedFood.calories} kcal
                  </span>
                  <span className="text-[11px] text-teal-400 font-bold">
                    Score: {matchedFood.healthScore}/100
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-zinc-400">
                  {matchedFood.servingSize}
                </span>
                <button
                  onClick={() => {
                    setActiveFoodDetail(matchedFood);
                    setIsBarcodeModalOpen(false);
                  }}
                  className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <span>Open Nutrition Facts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Not Found State */}
          {notFoundBarcode && (
            <div className="p-4 bg-zinc-900 rounded-2xl border border-amber-500/30 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Barcode {notFoundBarcode} not yet in index</span>
              </div>
              <p className="text-zinc-400">
                Help Foodora expand! You can submit this product photo or label to our community review queue.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
