"use client";

import React, { useState } from "react";
import { Sparkles, Scan, Search, ShieldCheck, Heart, Brain, Activity } from "lucide-react";
import IngredientInput from "@/components/IngredientInput";
import ResultDisplay from "@/components/ResultDisplay";

export default function BetterBiteApp() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showApp, setShowApp] = useState(false);

  const handleAnalyze = async (ingredients: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to analyze ingredients. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!showApp && !analysisResult) {
    return (
      <main className="min-h-screen bg-[#f4fbf4] text-zinc-900 selection:bg-emerald-200">
        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-emerald-800">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <Activity size={24} strokeWidth={3} />
            </div>
            BETTERBITE
          </div>
          <button
            onClick={() => setShowApp(true)}
            className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-xl shadow-zinc-900/10"
          >
            Start Scanning
          </button>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-bold tracking-wide uppercase">
              <Sparkles size={14} className="animate-pulse" />
              Powered by Vitality Logic AI
            </div>
            <h1 className="text-6xl lg:text-8xl font-black text-zinc-900 leading-[0.9] tracking-tighter">
              Decode Your Food. <br />
              <span className="text-emerald-600">Elevate Your Vitality.</span>
            </h1>
            <p className="text-xl text-zinc-600 leading-relaxed max-w-lg">
              Understand exactly what goes into your body. BetterBite uses advanced AI to analyze ingredients and provide educational health insights for your body, health, and mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowApp(true)}
                className="px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-bold text-lg hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/30 active:scale-[0.98]"
              >
                Scan My First Label
              </button>
              <div className="flex items-center gap-4 px-6 py-5">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-zinc-200 border-2 border-white" />
                  ))}
                </div>
                <div className="text-sm font-bold text-zinc-500">
                  Joined by <span className="text-zinc-900">10k+</span> health-conscious users
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-emerald-100 rounded-[4rem] flex items-center justify-center p-20 relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')] opacity-20" />
               <div className="w-full h-full bg-white rounded-[3rem] shadow-2xl flex flex-col items-center justify-center gap-8 border border-emerald-200 relative">
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 animate-bounce">
                    <Scan size={48} />
                  </div>
                  <div className="text-center space-y-2">
                    <div className="font-black text-2xl">Scanning Engine</div>
                    <div className="text-zinc-400 text-sm font-medium">Extracting data...</div>
                  </div>
               </div>
               {/* Decorative floating elements */}
               <div className="absolute top-10 right-10 w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center text-emerald-500 animate-float">
                 <Heart size={32} />
               </div>
               <div className="absolute bottom-20 left-10 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-emerald-500 animate-float-delayed">
                 <Brain size={28} />
               </div>
            </div>
          </div>
        </section>

        {/* Features / How it works */}
        <section className="bg-white border-y border-zinc-100 py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-4xl font-black tracking-tight">How It Works</h2>
              <p className="text-zinc-500 max-w-lg mx-auto">Three simple steps to transform your relationship with food labels.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { title: "Capture", desc: "Scan any food label or type ingredients manually.", icon: <Scan size={32} /> },
                { title: "Analyze", desc: "Our Vitality Logic AI decodes the complex scientific names.", icon: <Search size={32} /> },
                { title: "Discover", desc: "Get clear insights on how it affects your Body, Health, and Mind.", icon: <ShieldCheck size={32} /> },
              ].map((step, i) => (
                <div key={i} className="space-y-6 group">
                  <div className="w-16 h-16 bg-[#f4fbf4] rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-black">{step.title}</h3>
                  <p className="text-zinc-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-6 py-20 text-center space-y-10">
          <div className="text-xs text-zinc-400 max-w-2xl mx-auto leading-relaxed uppercase tracking-widest font-bold">
            EDUCATIONAL NUTRITIONAL AWARENESS TOOL • NOT MEDICAL ADVICE • 2024 BETTERBITE
          </div>
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4fbf4] text-zinc-900 pb-20 selection:bg-emerald-200">
      {/* App Header */}
      <nav className="max-w-5xl mx-auto px-6 py-10 flex justify-between items-center">
        <button
          onClick={() => {
            setAnalysisResult(null);
            setShowApp(false);
          }}
          className="flex items-center gap-2 font-black text-xl tracking-tighter text-emerald-800"
        >
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
            <Activity size={18} strokeWidth={3} />
          </div>
          BETTERBITE
        </button>
        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-zinc-100 shadow-sm">
             <ShieldCheck size={14} className="text-emerald-500" />
             Clinical Mode Active
           </div>
        </div>
      </nav>

      <div className="px-6">
        {!analysisResult ? (
          <div className="animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="text-center space-y-4 mb-12 max-w-2xl mx-auto">
              <h2 className="text-5xl font-black tracking-tight leading-none">New Vitality Scan</h2>
              <p className="text-zinc-500 text-lg">Position the ingredient label in frame or paste the text below.</p>
            </div>
            <IngredientInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        ) : (
          <ResultDisplay
            result={analysisResult}
            onReset={() => setAnalysisResult(null)}
          />
        )}
      </div>
    </main>
  );
}
