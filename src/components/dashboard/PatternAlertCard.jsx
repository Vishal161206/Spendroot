import React from 'react';
import { Search, ArrowRight, Clock, ChevronRight, Zap } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export default function PatternAlertCard({ onOpenEvidence }) {
  const { patterns } = useFinance();
  const pattern = patterns[0] || {};

  return (
    <div className="relative p-5 lg:p-6 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 rounded-2xl border-2 border-amber-300/80 shadow-md hover:shadow-lg transition-all group overflow-hidden">
      {/* Decorative accent tag */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 rounded-full border border-amber-300">
          <Search className="w-3.5 h-3.5 text-amber-800" />
          <span>Spending Pattern Detected</span>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200 shadow-2xs">
          <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
          High Severity
        </span>
      </div>

      <div className="mb-4">
        <h3 className="text-base lg:text-lg font-bold text-slate-900 flex items-center gap-2">
          {pattern.title || "Late-evening food spending pattern"}
        </h3>
        <p className="text-xs lg:text-sm text-slate-600 mt-1">
          We detected <span className="font-semibold text-slate-900">5 similar weekday sequences</span> this month.
        </p>
      </div>

      {/* Visual Sequence Chain */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-white/90 border border-amber-200/80 shadow-2xs mb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Step 1: Transport */}
          <div className="w-full sm:w-auto flex-1 p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/60 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold text-blue-700 block">Step 1: Commute</span>
            <span className="text-sm font-bold text-slate-900">Uber / Ola</span>
            <span className="text-xs text-blue-700 block font-mono font-medium">Avg ₹320</span>
          </div>

          {/* Temporal Transition Arrow */}
          <div className="flex flex-row sm:flex-col items-center justify-center gap-1 text-slate-400 shrink-0">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3" />
              within 2 hrs
            </span>
            <ArrowRight className="w-4 h-4 text-amber-500 hidden sm:block" />
          </div>

          {/* Step 2: Food Delivery */}
          <div className="w-full sm:w-auto flex-1 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold text-amber-700 block">Step 2: Food Order</span>
            <span className="text-sm font-bold text-slate-900">Swiggy / Zomato</span>
            <span className="text-xs text-amber-700 block font-mono font-medium">Avg ₹680</span>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 text-[11px]">Average sequence cost:</span>
            <span className="block font-bold text-slate-800 font-mono text-sm">₹890</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 text-[11px]">Estimated monthly impact:</span>
            <span className="block font-bold text-rose-600 font-mono text-sm">₹1,700</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-500 italic">
          Pattern triggered by commute exhaustion
        </span>
        <button
          onClick={onOpenEvidence}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-xl transition-colors shadow-2xs active:scale-95"
        >
          <span>See Why</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
