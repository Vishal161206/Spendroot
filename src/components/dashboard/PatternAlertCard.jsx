import React from 'react';
import { Search, ArrowRight, Clock, ChevronRight, Zap, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export default function PatternAlertCard({ onOpenEvidence }) {
  const { patterns } = useFinance();
  const pattern = patterns && patterns.length > 0 ? patterns[0] : null;

  if (!pattern) {
    return (
      <div className="p-5 lg:p-6 bg-gradient-to-br from-slate-50 via-white to-teal-50/30 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 rounded-full mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
            <span>Behavior Analysis</span>
          </div>
          <h3 className="text-base lg:text-lg font-bold text-slate-900">
            No Recurring Impulse Sequences Detected
          </h3>
          <p className="text-xs lg:text-sm text-slate-600 mt-1">
            We continuously monitor your spending transactions for correlation clusters (such as late-evening rides followed by rapid food takeout). No excessive sequences found.
          </p>
        </div>
        <div className="pt-4 flex items-center justify-between text-xs text-slate-400">
          <span>Continuous algorithmic monitoring</span>
          <span className="font-semibold text-teal-700">Healthy patterns</span>
        </div>
      </div>
    );
  }

  const trigger = pattern.triggerMerchant || 'Commute Ride';
  const followUp = pattern.primaryMerchant || 'Food Order';
  const avgCost = pattern.averageSequenceCost ? `₹${pattern.averageSequenceCost.toLocaleString('en-IN')}` : 'Observed';
  const monthlyImpact = pattern.monthlyAvoidableImpact ? `₹${pattern.monthlyAvoidableImpact.toLocaleString('en-IN')}` : 'Calculated';

  return (
    <div className="relative p-5 lg:p-6 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 rounded-2xl border-2 border-amber-300/80 shadow-md hover:shadow-lg transition-all group overflow-hidden flex flex-col justify-between">
      <div>
        {/* Decorative accent tag */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 rounded-full border border-amber-300">
            <Search className="w-3.5 h-3.5 text-amber-800" />
            <span>Spending Pattern Detected</span>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200 shadow-2xs">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            {pattern.severity === 'high' ? 'High Severity' : 'Observable'}
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-base lg:text-lg font-bold text-slate-900 flex items-center gap-2">
            {pattern.title || 'Late-evening spending pattern'}
          </h3>
          <p className="text-xs lg:text-sm text-slate-600 mt-1">
            {pattern.summary || `Detected ${pattern.occurrencesCount || 0} similar occurrences from transaction records.`}
          </p>
        </div>

        {/* Visual Sequence Chain */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white/90 border border-amber-200/80 shadow-2xs mb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            {/* Step 1: Trigger */}
            <div className="w-full sm:w-auto flex-1 p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/60 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-blue-700 block">Step 1: Trigger</span>
              <span className="text-sm font-bold text-slate-900 truncate block">{trigger}</span>
            </div>

            {/* Temporal Transition Arrow */}
            <div className="flex flex-row sm:flex-col items-center justify-center gap-1 text-slate-400 shrink-0">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3" />
                {pattern.timeWindow ? 'correlated' : 'within 2 hrs'}
              </span>
              <ArrowRight className="w-4 h-4 text-amber-500 hidden sm:block" />
            </div>

            {/* Step 2: Follow-up */}
            <div className="w-full sm:w-auto flex-1 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">Step 2: Consequence</span>
              <span className="text-sm font-bold text-slate-900 truncate block">{followUp}</span>
            </div>
          </div>

          {/* Aggregate Stats */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-500 text-[11px]">Occurrences detected:</span>
              <span className="block font-bold text-slate-800 font-mono text-sm">{pattern.occurrencesCount || 0} times</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-[11px]">Estimated monthly drag:</span>
              <span className="block font-bold text-rose-600 font-mono text-sm">{monthlyImpact}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-500 italic truncate max-w-[220px]">
          {pattern.explanation ? 'Observable database correlation' : 'Behavior pattern'}
        </span>
        {onOpenEvidence && (
          <button
            onClick={onOpenEvidence}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-xl transition-colors shadow-2xs active:scale-95"
          >
            <span>See Why</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
