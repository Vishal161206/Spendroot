import React, { useState } from 'react';
import {
  Target,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Laptop,
  Coins,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';

export default function GoalsPage() {
  const { goals, addGoalContribution, netSavings } = useFinance();
  const navigate = useNavigate();

  const [activeModalGoal, setActiveModalGoal] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('2000');

  const handleContribute = (e) => {
    e.preventDefault();
    if (activeModalGoal && contributionAmount) {
      addGoalContribution(activeModalGoal.id, contributionAmount);
      setActiveModalGoal(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 lg:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-600" />
            <span>Savings Goals & Target Acceleration</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track milestone progress, calculate required monthly pace, and simulate habit optimizations to reach targets faster.
          </p>
        </div>

        <button
          onClick={() => navigate('/simulator')}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 shadow-2xs transition-colors shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Simulate Goal Acceleration</span>
        </button>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((g) => {
          const percent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
          const remaining = Math.max(0, g.targetAmount - g.currentAmount);
          const isAtRisk = g.status === 'At Risk';
          const paceGap = g.requiredMonthlyContribution - g.currentMonthlyContribution;

          return (
            <div
              key={g.id}
              className={`p-6 rounded-2xl border transition-all ${
                isAtRisk
                  ? 'bg-amber-50/20 border-amber-300/80 shadow-xs'
                  : 'bg-white border-slate-200/80 shadow-xs'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-teal-50 text-teal-700">
                    {g.id === 'goal_laptop' ? <Laptop className="w-6 h-6" /> : <Coins className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{g.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Target: {g.deadline}</span>
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${
                    isAtRisk
                      ? 'text-amber-800 bg-amber-100 border-amber-300'
                      : 'text-emerald-800 bg-emerald-100 border-emerald-300'
                  }`}
                >
                  {isAtRisk ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                  {g.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 mb-4">{g.description}</p>

              {/* Progress Visuals & Bar */}
              <div className="space-y-1.5 mb-5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 font-mono text-sm">
                    ₹{g.currentAmount.toLocaleString('en-IN')}{' '}
                    <span className="text-slate-400 font-normal">/ ₹{g.targetAmount.toLocaleString('en-IN')}</span>
                  </span>
                  <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-mono">
                    {percent}% saved
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      isAtRisk ? 'bg-amber-500' : 'bg-teal-600'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Required Pace vs Current Pace Comparison */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-5">
                <div>
                  <span className="text-slate-400 text-[11px] block">Required Monthly Pace:</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    ₹{g.requiredMonthlyContribution.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Current Monthly Pace:</span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      isAtRisk ? 'text-amber-700' : 'text-emerald-700'
                    }`}
                  >
                    ₹{g.currentMonthlyContribution.toLocaleString('en-IN')}/mo
                  </span>
                </div>
              </div>

              {/* Pace Warning or Healthy Pace Note */}
              {isAtRisk ? (
                <div className="p-3 rounded-xl bg-amber-100/70 border border-amber-200 text-xs text-amber-900 mb-5 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pace Deficit of ₹{paceGap.toLocaleString('en-IN')}/month</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    At the current saving pace of ₹8,150, target completion will be delayed past March 2027.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 mb-5 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>On pace to achieve milestone by December 2026.</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => navigate('/simulator')}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <span>View Projection</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  onClick={() => setActiveModalGoal(g)}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs active:scale-95 transition-all"
                >
                  + Add Contribution
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Contribution Modal */}
      {activeModalGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add Contribution</h3>
                <p className="text-xs text-slate-500">{activeModalGoal.title}</p>
              </div>
              <button
                onClick={() => setActiveModalGoal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleContribute} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contribution Amount (₹)
                </label>
                <input
                  type="number"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalGoal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm"
                >
                  Save Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
