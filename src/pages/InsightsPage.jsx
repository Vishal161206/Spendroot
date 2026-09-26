import React, { useState } from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Repeat,
  ShoppingBag,
  Target,
  ShieldAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';

const INSIGHTS_DATA = [
  {
    id: 'ins_1',
    category: 'Budget Risk',
    title: 'Food & Dining spending projected to exceed allocation',
    severity: 'critical',
    detection: 'Food budget overrun risk detected via velocity extrapolation.',
    evidence: '₹4,650 spent of ₹5,000 budget with 20 days elapsed. Projected month-end spend: ₹6,050.',
    reason: '5 repeated late-evening transport → food delivery sequences observed on weekdays after 8:00 PM.',
    recommendedAction: 'Reduce 2 similar late-evening food-delivery sequences before Sept 30.',
    estimatedImpact: 'Save ₹1,100 and restore Food budget to On Track status.',
    simulateScenario: 'food_2_orders',
  },
  {
    id: 'ins_2',
    category: 'Behavioral Sequence',
    title: '5 Late-evening commute-to-delivery sequences detected',
    severity: 'warning',
    detection: 'Temporal correlation between late cab rides and instant dinner orders.',
    evidence: 'Uber/Ola rides home followed by Swiggy/Zomato orders within 90 mins (Avg ₹890 per sequence).',
    reason: 'Physical tiredness after late commute triggers reliance on impulse takeout apps with 92% correlation.',
    recommendedAction: 'Pre-order groceries via Blinkit or meal-prep on Sunday to bypass late takeout triggers.',
    estimatedImpact: 'Avoid up to ₹1,700/month in recurring sequence costs.',
    simulateScenario: 'food_2_orders',
  },
  {
    id: 'ins_3',
    category: 'Recurring Expense',
    title: 'Netflix Standard Plan (₹649) appears approximately every 30 days',
    severity: 'info',
    detection: 'Recurring monthly subscription debit with low engagement.',
    evidence: '₹649 auto-debited on 18th of each month. In-app viewing hours dropped by 60% in Sept 2026.',
    reason: 'Active subscription maintained during high-workload sprint without proportional viewership.',
    recommendedAction: 'Pause subscription for 30 days or switch to base mobile tier (₹149/mo).',
    estimatedImpact: 'Directly recovers ₹649/month into net savings.',
    simulateScenario: 'netflix',
  },
  {
    id: 'ins_4',
    category: 'Spending Trend',
    title: 'Shopping expenditures surged for 3 consecutive weekends',
    severity: 'warning',
    detection: 'Weekend concentration spike in non-essential retail transactions.',
    evidence: '₹2,150 spent in 20 days (86% of ₹2,500 budget) with 65% occurring on Friday–Sunday.',
    reason: 'Browsing e-commerce apps during weekend downtime leads to unbudgeted micro-purchases.',
    recommendedAction: 'Enforce a 48-hour cooling cart hold for any item over ₹500.',
    estimatedImpact: 'Saves approx ₹500–₹1,000/month in avoidable impulse checkout.',
    simulateScenario: 'shopping',
  },
  {
    id: 'ins_5',
    category: 'Savings Goal Risk',
    title: 'Current saving pace delays "New Laptop" target completion',
    severity: 'warning',
    detection: 'Monthly goal contribution is ₹1,850 below required pacing.',
    evidence: 'Required contribution is ₹10,000/mo to hit ₹60,000 by March 2027. Current available pace is ₹8,150/mo.',
    reason: 'Discretionary overrun in Food and Shopping absorbs potential goal buffer.',
    recommendedAction: 'Apply recommended habit reductions to free up ₹1,100–₹1,749/month.',
    estimatedImpact: 'Closes pacing deficit and accelerates laptop purchase by 24 days.',
    simulateScenario: 'simulator',
  },
];

export default function InsightsPage() {
  const navigate = useNavigate();
  const { applyRecommendation } = useFinance();
  const [insights, setInsights] = useState(INSIGHTS_DATA);
  const [acceptedIds, setAcceptedIds] = useState([]);

  const handleAccept = (id) => {
    setAcceptedIds((prev) => [...prev, id]);
    if (id === 'ins_1' || id === 'ins_2') {
      applyRecommendation('rec_food_reduce_2');
    }
  };

  const handleDismiss = (id) => {
    setInsights((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 lg:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 rounded-full border border-teal-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Behavioral Intelligence Engine</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            Financial Intelligence & Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Strict explainable intelligence: every recommendation is supported by concrete transaction timestamps, mathematical variance forecasts, and tangible savings simulations.
          </p>
        </div>

        <button
          onClick={() => navigate('/simulator')}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all active:scale-95 shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Launch What-If Simulator</span>
        </button>
      </div>

      {/* Cards List */}
      <div className="space-y-5">
        {insights.map((item) => {
          const isAccepted = acceptedIds.includes(item.id);

          return (
            <div
              key={item.id}
              className={`p-6 rounded-2xl border transition-all ${
                item.severity === 'critical'
                  ? 'bg-amber-50/20 border-amber-300 shadow-xs'
                  : 'bg-white border-slate-200/80 shadow-xs'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-slate-100 text-slate-700">
                    {item.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      item.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800'
                        : item.severity === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {item.severity.toUpperCase()}
                  </span>
                </div>

                {isAccepted && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Recommendation Accepted
                  </span>
                )}
              </div>

              <h2 className="text-base font-bold text-slate-900 mb-4">{item.title}</h2>

              {/* 5-Layer Explainable Structure Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs mb-5">
                {/* 1. Detection */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    1. Detection
                  </span>
                  <p className="text-slate-800 font-medium">{item.detection}</p>
                </div>

                {/* 2. Evidence */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    2. Observed Evidence
                  </span>
                  <p className="text-slate-800 font-medium">{item.evidence}</p>
                </div>

                {/* 3. Reason / Explanation */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    3. Behavioral Reason
                  </span>
                  <p className="text-slate-800 font-medium">{item.reason}</p>
                </div>

                {/* 4. Action */}
                <div className="p-3 rounded-xl bg-teal-50/80 border border-teal-200/80">
                  <span className="text-[10px] uppercase font-bold text-teal-800 block mb-1">
                    4. Recommended Action
                  </span>
                  <p className="text-teal-900 font-semibold">{item.recommendedAction}</p>
                </div>
              </div>

              {/* 5. Estimated Impact Highlight */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-emerald-200 text-emerald-800 font-bold text-[10px] uppercase">
                    5. Estimated Impact
                  </span>
                  <span className="font-bold text-emerald-900">{item.estimatedImpact}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleDismiss(item.id)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Dismiss Insight
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/simulator')}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
                    <span>Simulate</span>
                  </button>

                  {!isAccepted && (
                    <button
                      onClick={() => handleAccept(item.id)}
                      className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs active:scale-95 transition-all"
                    >
                      Accept Action
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
