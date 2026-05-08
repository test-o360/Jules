"use client";

import { useState } from "react";
import IngredientInput from "@/components/IngredientInput";
import ResultDisplay, { AnalysisResult } from "@/components/ResultDisplay";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (ingredients: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] dark:bg-black selection:bg-emerald-100 selection:text-emerald-900">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
        {!result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase border border-emerald-100 dark:border-emerald-900/50">
              <Sparkles size={14} />
              AI-Powered Health Analysis
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
              Know what you <span className="text-emerald-600">eat.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Upload a photo or type ingredients to instantly understand how they affect your body and overall health.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500">
                <ShieldCheck size={20} className="text-emerald-500" />
                <span className="text-sm font-medium">Science-based analysis</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500">
                <Zap size={20} className="text-emerald-500" />
                <span className="text-sm font-medium">Instant results</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        {result ? (
          <ResultDisplay result={result} onReset={() => setResult(null)} />
        ) : (
          <IngredientInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-zinc-100 dark:border-zinc-900 text-center">
        <p className="text-zinc-500 dark:text-zinc-600 text-sm">
          Powered by Open Food Facts and Health Science Data. Always consult a nutritionist for personalized advice.
        </p>
      </footer>
    </main>
  );
}
