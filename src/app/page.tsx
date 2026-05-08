"use client";

import { useState } from "react";
import IngredientInput from "@/components/IngredientInput";
import ResultDisplay, { AnalysisResult } from "@/components/ResultDisplay";
import { Sparkles, ShieldCheck, Zap, AlertCircle } from "lucide-react";

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
    <main className="min-h-screen bg-white dark:bg-black selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header / Disclaimer Banner */}
      <div className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900 px-6 py-2">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 text-center font-bold">
          Educational Nutritional Awareness Tool • Not Medical Advice
        </p>
      </div>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        {!result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase border border-emerald-100 dark:border-emerald-900/50">
              <Sparkles size={14} />
              BetterBite AI
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-zinc-900 dark:text-white leading-[0.9]">
              Decode your <span className="text-emerald-600">food.</span>
            </h1>
            <p className="max-w-xl mx-auto text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Scan labels to get educational insights on ingredients and how they may associate with your body, health, and mind.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-2 text-zinc-500">
                <ShieldCheck size={18} className="text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Research-based</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <Zap size={18} className="text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Instant Analysis</span>
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

      {/* Legal Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-16 border-t border-zinc-100 dark:border-zinc-900">
        <div className="bg-zinc-50 dark:bg-zinc-950 p-8 rounded-3xl space-y-4 border border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-sm uppercase tracking-wider">
            <AlertCircle size={18} className="text-orange-500" />
            Legal Disclaimer
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed space-y-2">
              <p>BetterBite (Vitality Logic) is an educational nutritional awareness tool for informational purposes only. We are not a medical device, doctor, dietitian, or regulatory authority.</p>
              <p>This tool does not make definitive medical claims or state that ingredients &quot;cause&quot; diseases. All research-referencing language is hedged and based on general nutritional literature.</p>
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed space-y-2">
              <p>We do not diagnose, treat, or prescribe. Our analysis does not constitute medical or dietary advice. We do not reference or defame specific brands or manufacturers.</p>
              <p className="font-bold text-zinc-700 dark:text-zinc-300">Always consult with a qualified healthcare professional before making changes to your diet or if you have concerns about specific ingredients.</p>
            </div>
          </div>
        </div>
        <p className="text-center mt-12 text-[10px] text-zinc-400 uppercase font-bold tracking-[0.2em]">
          &copy; 2024 BetterBite • Vitality Logic Engine v1.0
        </p>
      </footer>
    </main>
  );
}
