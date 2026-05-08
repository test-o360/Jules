"use client";

import React, { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
import { Upload, Type, Camera, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface IngredientInputProps {
  onAnalyze: (ingredients: string) => void;
  isLoading: boolean;
}

export default function IngredientInput({ onAnalyze, isLoading }: IngredientInputProps) {
  const [inputMode, setInputMode] = useState<"text" | "upload">("text");
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

      // Clean up extracted text
      const cleanedText = extractedText
        .replace(/\n/g, " ") // Replace newlines with spaces
        .replace(/[^a-zA-Z0-9,.:;()[\]\s-]/g, "") // Remove weird symbols
        .replace(/\s+/g, " ") // Collapse multiple spaces
        .replace(/^(ingredients|agredients|contains|may contain)[:\s]+/i, "") // Strip leading headers
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
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
        <button
          onClick={() => setInputMode("text")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
            inputMode === "text"
              ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          <Type size={16} />
          Manual Type
        </button>
        <button
          onClick={() => setInputMode("upload")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
            inputMode === "upload"
              ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          <Upload size={16} />
          Upload Image
        </button>
      </div>

      {inputMode === "text" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter ingredients separated by commas..."
            className="w-full h-48 p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none text-zinc-900 dark:text-zinc-100"
          />
          <button
            type="submit"
            disabled={isLoading || !text.trim()}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Analyze Health Impact"}
          </button>
        </form>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-64 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
        >
          {isProcessingImage ? (
            <>
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">Extracting text from image...</p>
            </>
          ) : (
            <>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-full">
                <Camera className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="text-zinc-900 dark:text-white font-semibold">Click to upload photo of ingredients</p>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Supports JPG, PNG</p>
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
      )}
    </div>
  );
}
