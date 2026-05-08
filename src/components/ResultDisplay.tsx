"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, Info, Brain, Activity, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnalysisResult {
  product_name: string;
  grade: string;
  grade_reason: string;
  vitality_summary: string;
  clean_count: number;
  processed_count: number;
  flagged_count: number;
  advice: string;
  ingredients: Array<{
    name: string;
    classification: "clean" | "processed" | "flagged";
    body: string;
    health: string;
    mind: string;
  }>;
}

interface ResultDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultDisplay({ result, onReset }: ResultDisplayProps) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-emerald-500";
      case "B": return "bg-lime-500";
      case "C": return "bg-yellow-500";
      case "D": return "bg-orange-500";
      case "F": return "bg-red-500";
      default: return "bg-zinc-500";
    }
  };

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case "clean": return <CheckCircle2 className="text-emerald-500" size={18} />;
      case "processed": return <Info className="text-blue-500" size={18} />;
      case "flagged": return <AlertTriangle className="text-orange-500" size={18} />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        {/* Header with Grade */}
        <div className="p-8 flex flex-col md:flex-row items-center gap-8 border-b border-zinc-100 dark:border-zinc-800">
          <div className={cn(
            "w-24 h-24 shrink-0 rounded-2xl flex items-center justify-center text-5xl font-black text-white shadow-lg",
            getGradeColor(result.grade)
          )}>
            {result.grade}
          </div>
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{result.product_name}</h2>
            <p className="text-zinc-700 dark:text-zinc-300 font-medium italic">&quot;{result.grade_reason}&quot;</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{result.vitality_summary}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="p-4 text-center border-r border-zinc-100 dark:border-zinc-800">
            <div className="text-2xl font-bold text-emerald-600">{result.clean_count}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-tighter">Clean</div>
          </div>
          <div className="p-4 text-center border-r border-zinc-100 dark:border-zinc-800">
            <div className="text-2xl font-bold text-blue-600">{result.processed_count}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-tighter">Processed</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{result.flagged_count}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-tighter">Flagged</div>
          </div>
        </div>

        {/* Ingredients List */}
        <div className="p-8 space-y-8">
          <h3 className="font-bold text-zinc-900 dark:text-white uppercase tracking-widest text-xs">Detailed Analysis</h3>
          <div className="space-y-6">
            {result.ingredients.map((ing, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getClassificationIcon(ing.classification)}
                    <span className="font-bold text-zinc-900 dark:text-white text-lg">{ing.name}</span>
                  </div>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                    ing.classification === "clean" ? "bg-emerald-100 text-emerald-700" :
                    ing.classification === "processed" ? "bg-blue-100 text-blue-700" :
                    "bg-orange-100 text-orange-700"
                  )}>
                    {ing.classification}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase">
                      <Activity size={12} /> Body
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">&quot;{ing.body}&quot;</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase">
                      <Heart size={12} /> Health
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">&quot;{ing.health}&quot;</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase">
                      <Brain size={12} /> Mind
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">&quot;{ing.mind}&quot;</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advice Footer */}
        <div className="p-8 bg-emerald-50/50 dark:bg-emerald-950/10 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex gap-3">
            <Info className="text-emerald-600 shrink-0" size={20} />
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
              {result.advice}
            </p>
          </div>
          <button
            onClick={onReset}
            className="mt-8 w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Check Another Label
          </button>
        </div>
      </div>
    </div>
  );
}
