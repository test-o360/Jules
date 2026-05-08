"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnalysisResult {
  score: string;
  summary: string;
  findings: Array<{
    name: string;
    impact: "Harmful" | "Moderate" | "Safe";
    score: string;
    effect: string;
    category: string;
  }>;
}

interface ResultDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultDisplay({ result, onReset }: ResultDisplayProps) {
  const getScoreColor = (score: string) => {
    switch (score) {
      case "A": return "bg-emerald-500";
      case "B": return "bg-lime-500";
      case "C": return "bg-yellow-500";
      case "D": return "bg-orange-500";
      case "E": return "bg-red-500";
      default: return "bg-zinc-500";
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "Safe": return <CheckCircle2 className="text-emerald-500" size={20} />;
      case "Moderate": return <Info className="text-yellow-500" size={20} />;
      case "Harmful": return <AlertTriangle className="text-red-500" size={20} />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-8 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Health Score</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">{result.summary}</p>
          </div>
          <div className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-lg",
            getScoreColor(result.score)
          )}>
            {result.score}
          </div>
        </div>

        <div className="p-8 space-y-6">
          <h3 className="font-semibold text-zinc-900 dark:text-white uppercase tracking-wider text-sm">Ingredient Analysis</h3>
          <div className="space-y-4">
            {result.findings.map((finding, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 flex gap-4"
              >
                <div className="mt-1">{getImpactIcon(finding.impact)}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 dark:text-white">{finding.name}</span>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                      finding.impact === "Safe" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      finding.impact === "Moderate" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {finding.category}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {finding.effect}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={onReset}
            className="w-full py-3 text-zinc-600 dark:text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Scan another item
          </button>
        </div>
      </div>
    </div>
  );
}
