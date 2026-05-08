"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ingredient {
  name: string;
  classification: "clean" | "processed" | "flagged" | "pending";
  body: string;
  health: string;
  mind: string;
}

interface AnalysisResult {
  product_name: string;
  grade: string;
  grade_reason: string;
  vitality_summary: string;
  clean_count: number;
  processed_count: number;
  flagged_count: number;
  advice: string;
  ingredients: Ingredient[];
}

interface ResultDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultDisplay({ result, onReset }: ResultDisplayProps) {
  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-emerald-500 text-white shadow-emerald-200";
    if (grade.startsWith("B")) return "bg-emerald-400 text-white shadow-emerald-100";
    if (grade.startsWith("C")) return "bg-amber-400 text-white shadow-amber-100";
    if (grade.startsWith("D")) return "bg-orange-400 text-white shadow-orange-100";
    return "bg-red-500 text-white shadow-red-200";
  };

  const getClassificationStyles = (type: string) => {
    switch (type) {
      case "clean": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "processed": return "bg-amber-50 text-amber-700 border-amber-100";
      case "flagged": return "bg-red-50 text-red-700 border-red-100";
      default: return "bg-zinc-100 text-zinc-600 border-zinc-200";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Card */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className={cn(
            "w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold shadow-2xl shrink-0 border-4 border-white dark:border-zinc-900",
            getGradeColor(result.grade)
          )}>
            {result.grade}
          </div>
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
              {result.product_name}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 italic text-lg leading-relaxed">
              "{result.grade_reason}"
            </p>
            <p className="text-zinc-500 dark:text-zinc-500 text-sm">
              {result.vitality_summary}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-900">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">{result.clean_count}</div>
            <div className="text-xs uppercase tracking-widest font-bold text-zinc-400">Clean</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">{result.processed_count}</div>
            <div className="text-xs uppercase tracking-widest font-bold text-zinc-400">Processed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-500">{result.flagged_count}</div>
            <div className="text-xs uppercase tracking-widest font-bold text-zinc-400">Flagged</div>
          </div>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Body", icon: <CheckCircle2 className="w-5 h-5" />, content: result.ingredients.find(i => i.body !== "Neutral impact.")?.body || "General nutritional profile impact on physical structure." },
          { title: "Health", icon: <AlertCircle className="w-5 h-5" />, content: result.ingredients.find(i => i.health !== "Neutral impact.")?.health || "Impact on long-term wellness and metabolic balance." },
          { title: "Mind", icon: <Info className="w-5 h-5" />, content: result.ingredients.find(i => i.mind !== "Neutral impact.")?.mind || "Relationship between ingredients and cognitive focus or mood." }
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-bold">
              {item.icon}
              {item.title}
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {item.content}
            </p>
          </div>
        ))}
      </div>

      {/* Ingredient Detail Table */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50">
          <h3 className="font-bold text-zinc-900 dark:text-white">Ingredient Intelligence</h3>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
          {result.ingredients.map((ing, i) => (
            <div key={i} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
              <div className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">{ing.name}</div>
                  <div className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border",
                    getClassificationStyles(ing.classification)
                  )}>
                    {ing.classification}
                  </div>
                </div>
                <button className="p-2 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-6 pt-4">
        <button
          onClick={onReset}
          className="group flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-bold hover:gap-3 transition-all"
        >
          <ArrowLeft size={18} />
          Check Another Label
        </button>

        <div className="w-full p-6 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed border border-zinc-200 dark:border-zinc-800">
          <span className="font-bold uppercase tracking-widest text-[10px] block mb-2">Legal Disclaimer</span>
          BetterBite is an educational nutritional awareness tool for informational purposes only. We are not a medical device, doctor, dietitian, or regulatory authority. This tool does not make definitive medical claims or state that ingredients "cause" diseases. All research-referencing language is hedged and based on general nutritional literature. Always consult with a qualified healthcare professional before making changes to your diet.
        </div>
      </div>
    </div>
  );
}
