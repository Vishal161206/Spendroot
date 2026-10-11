import React from 'react';
import { Lightbulb, SlidersHorizontal, Eye, ArrowRight, CheckCircle2, TrendingDown, Target, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';

export default function RecommendationHeroCard({ onOpenEvidence }) {
  const navigate = useNavigate();
  const { recommendations, applyRecommendation, primaryGoal } = useFinance();
  const rec = recommendations && recommendations.length > 0 ? recommendations[0] : null;

  const isApplied = rec?.status === 'Applied';

  if (!rec) {
    return (
      <div className="p-5 lg:p-6 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 rounded-2xl border border-emerald-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Budgets Healthy</span>
          </div>
          <h3 className="text-base lg:text-lg font-bold text-slate-900">
            No Urgent Budget Actions Required
          </h3>
          <p className="text-xs lg:text-sm text-slate-600 mt-1">
            Your current spending velocity is within your monthly allocations. Explore the What-If Simulator to see how extra savings can accelerate your objectives.
          </p>
        </div>
        <div className="pt-4">
          <button
            onClick={() => navigate('/simulator')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Open What-If Simulator</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-5 lg:p-6 bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/40 rounded-2xl border-2 border-teal-300/80 shadow-md hover:shadow-lg transition-all group overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header Pill */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-900 bg-teal-200/80 rounded-full border border-teal-300">
            <Lightbulb className="w-3.5 h-3.5 text-teal-800" />
            <span>Recommended Action</span>
          </div>
          {rec.estimatedSaving > 0 && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-lg border border-emerald-300">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
              Save ₹{rec.estimatedSaving.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <div className="mb-4">
          <h3 className="text-base lg:text-lg font-bold text-slate-900">
            {rec.title}
          </h3>
          <p className="text-xs lg:text-sm text-slate-600 mt-1">
            {rec.description}
          </p>
        </div>

        {/* Impact Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 sm:p-4 rounded-xl bg-white/90 border border-teal-200/80 shadow-2xs mb-4">
          {/* Budget Effect */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Budget Effect ({rec.categoryAffected || 'General'})
            </span>
            {rec.budgetBefore ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono line-through text-rose-500">
                  ₹{Number(rec.budgetBefore).toLocaleString('en-IN')} proj
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="text-sm font-bold font-mono text-emerald-600">
                  ₹{Number(rec.budgetAfter).toLocaleString('en-IN')} proj
                </span>
              </div>
            ) : (
              <span className="text-xs font-semibold text-emerald-600">
                Preserves monthly allocation
              </span>
            )}
            <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {rec.restoresBudgetTo ? `Restores to ${rec.restoresBudgetTo}` : 'Optimizes cash flow'}
            </span>
          </div>

          {/* Goal Effect */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
              {primaryGoal ? `Goal Effect (${primaryGoal.name || primaryGoal.title})` : 'Savings Impact'}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <Target className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">
                {rec.goalImpactDescription || `Adds ₹${(rec.estimatedSaving || 0).toLocaleString('en-IN')} directly to monthly savings.`}
              </span>
            </div>
            <span className="inline-block mt-1 text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
              {primaryGoal ? 'Accelerates target completion' : 'Builds financial cushion'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        {onOpenEvidence && (
          <button
            onClick={onOpenEvidence}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>View Evidence</span>
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {isApplied ? (
            <span className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-xl border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Applied
            </span>
          ) : (
            <button
              onClick={() => navigate('/simulator')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Simulate Impact</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
