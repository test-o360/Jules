"use client";

import React, { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
import { Upload, Type, Camera, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface IngredientInputProps {
  onAnalyze: (ingredients: string) => void;
  isLoading: boolean;
}

export default function IngredientInput({ onAnalyze, isLoading }: IngredientInputProps) {
  const [inputMode, setInputMode] = useState<"text" | "upload">("upload");
  const [text, setText] = useState("");
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    try {
      const worker = await createWorker('eng');
      const { data: { text: extractedText } } = await worker.recognize(file);
      await worker.terminate();

      const cleanedText = extractedText
        .replace(/\n/g, " ")
        .replace(/[^a-zA-Z0-9,.:;()[\]\s-]/g, " ")
        .replace(/\s+/g, " ")
        .replace(/^(ingredients|agredients|contains|may contain|label|nutrition|facts)[:\s]+/i, "")
        .trim();

      setText(cleanedText);
      setInputMode("text");
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Failed to read text from image. Please try typing or another image.");
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-10 py-10">
      <div className="flex p-1.5 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-2xl w-fit mx-auto border border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setInputMode("upload")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all",
            inputMode === "upload"
              ? "bg-white dark:bg-zinc-800 shadow-xl shadow-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          <Camera size={18} />
          Scan Label
        </button>
        <button
          onClick={() => setInputMode("text")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all",
            inputMode === "text"
              ? "bg-white dark:bg-zinc-800 shadow-xl shadow-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          <Type size={18} />
          Type Ingredients
        </button>
      </div>

      <div className="relative group">
        {inputMode === "upload" ? (
          <div
            onClick={() => !isProcessingImage && fileInputRef.current?.click()}
            className={cn(
              "w-full h-80 bg-white dark:bg-zinc-950 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 cursor-pointer transition-all overflow-hidden relative",
              !isProcessingImage && "hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:bg-emerald-50/10"
            )}
          >
            {isProcessingImage ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-emerald-500 animate-spin stroke-[1.5]" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-emerald-400 animate-pulse" />
                </div>
                <div className="text-center animate-pulse">
                  <p className="text-zinc-900 dark:text-white font-bold text-lg">Vitality Engine Active</p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">Decoding ingredients...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 rounded-3xl flex items-center justify-center text-emerald-600 dark:text-emerald-500 group-hover:scale-110 transition-transform duration-500">
                  <Camera size={40} strokeWidth={1.5} />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-zinc-900 dark:text-white font-bold text-xl">Capture Ingredient Label</p>
                  <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                    Take a photo or upload an image to begin your nutritional analysis
                  </p>
                </div>
                <div className="absolute bottom-6 px-6 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-full border border-zinc-100 dark:border-zinc-800 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Supports JPG, PNG
                </div>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type ingredients here, separated by commas..."
                className="w-full h-64 p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none text-zinc-900 dark:text-zinc-100 text-lg leading-relaxed placeholder:text-zinc-300"
              />
              <div className="absolute bottom-6 right-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                {text.length} Characters
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/20 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent animate-shimmer" />
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Run Vitality Scan
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 p-6 rounded-2xl flex items-start gap-4 max-w-xl mx-auto">
        <div className="p-2 bg-emerald-500 rounded-lg text-white">
          <Info size={18} />
        </div>
        <div>
          <h4 className="font-bold text-emerald-900 dark:text-emerald-100 text-sm">Pro Tip</h4>
          <p className="text-emerald-800/70 dark:text-emerald-400/70 text-sm leading-relaxed">
            For best results, ensure the ingredient list is clear, well-lit, and captured without glare. Our Vitality Engine works best with high-contrast text.
          </p>
        </div>
      </div>
    </div>
  );
}

function Info(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
