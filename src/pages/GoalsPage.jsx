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
  Coins,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';

const PRESET_GOALS = [
  'Emergency Fund',
  'New Phone',
  'Education',
  'Travel',
  'Bike',
  'Car',
  'Investment',
  'House',
  'Wedding',
  'Custom Goal',
];

export default function GoalsPage() {
  const { goals, addGoalContribution, createGoal, deleteGoal, netSavings } = useFinance();
  const navigate = useNavigate();

  const [activeModalGoal, setActiveModalGoal] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('2000');

  // Create Goal Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [goalName, setGoalName] = useState('Emergency Fund');
  const [targetAmount, setTargetAmount] = useState('50000');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('December 2026');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContribute = async (e) => {
    e.preventDefault();
    if (activeModalGoal && contributionAmount) {
      await addGoalContribution(activeModalGoal.id, contributionAmount);
      setActiveModalGoal(null);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!goalName.trim() || !targetAmount || parseFloat(targetAmount) <= 0) return;
    setIsSubmitting(true);
    await createGoal({
      name: goalName.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      targetDate: targetDate.trim() || 'December 2026',
      description: description.trim() || `Savings goal for ${goalName.trim()}`,
      category: goalName.trim(),
    });
    setIsSubmitting(false);
    setIsCreateModalOpen(false);
    setGoalName('Emergency Fund');
    setTargetAmount('50000');
    setCurrentAmount('0');
    setDescription('');
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

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/simulator')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 shadow-2xs transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Simulate Goal Acceleration</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm active:scale-95 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Goal</span>
          </button>
        </div>
      </div>

      {/* No Goals Set - Default Financial Objective */}
      {goals.length === 0 ? (
        <div className="p-8 lg:p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-4 border border-teal-100">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Build Your Savings</h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-md">
            No specific savings goal set. Your default financial objective is to build savings.
            {netSavings > 0
              ? ` Based on your current monthly surplus of ₹${netSavings.toLocaleString('en-IN')}, setting up an emergency fund or milestone target will help safeguard your financial health.`
              : ' Tracking your expenses and reducing non-essential spending will help you create a regular monthly savings surplus.'}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-5 flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Set Up a Savings Goal</span>
          </button>
        </div>
      ) : (
        /* Goals Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((g) => {
            const targetAmt = Number(g.targetAmount || g.target_amount || 0);
            const currentAmt = Number(g.currentAmount || g.current_amount || 0);
            const percent = targetAmt > 0 ? Math.min(100, Math.round((currentAmt / targetAmt) * 100)) : 0;
            const remaining = Math.max(0, targetAmt - currentAmt);
            const isAtRisk = g.status === 'At Risk';
            const reqContrib = Number(g.requiredMonthlyContribution || 0);
            const curContrib = Number(g.currentMonthlyContribution || 0);
            const paceGap = Math.max(0, reqContrib - curContrib);

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
                      <Coins className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{g.title || g.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Target: {g.deadline || g.target_date || 'Target date unset'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
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
                    <button
                      onClick={() => deleteGoal(g.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Delete goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {g.description && <p className="text-xs text-slate-600 mb-4">{g.description}</p>}

                {/* Progress Visuals & Bar */}
                <div className="space-y-1.5 mb-5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 font-mono text-sm">
                      ₹{currentAmt.toLocaleString('en-IN')}{' '}
                      <span className="text-slate-400 font-normal">/ ₹{targetAmt.toLocaleString('en-IN')}</span>
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
                      ₹{reqContrib.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Current Monthly Pace:</span>
                    <span
                      className={`font-mono font-bold text-sm ${
                        isAtRisk ? 'text-amber-700' : 'text-emerald-700'
                      }`}
                    >
                      ₹{curContrib.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                </div>

                {/* Pace Warning or Healthy Pace Note */}
                {isAtRisk ? (
                  <div className="p-3 rounded-xl bg-amber-100/70 border border-amber-200 text-xs text-amber-900 mb-5 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Pace Deficit of ₹{paceGap.toLocaleString('en-IN')}/month</span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Increasing your monthly contribution or cutting discretionary expenses can keep you on schedule for {g.deadline || 'your target date'}.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 mb-5 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>On pace to achieve milestone by {g.deadline || 'target date'}.</span>
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
      )}

      {/* Add Contribution Modal */}
      {activeModalGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add Contribution</h3>
                <p className="text-xs text-slate-500">{activeModalGoal.title || activeModalGoal.name}</p>
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

      {/* Create Goal Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">Define Your Financial Goal</h3>
                <p className="text-xs text-slate-500">SpendRoot will track your pace and link recommendations to this target.</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateGoal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  What are you saving for?
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PRESET_GOALS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setGoalName(preset === 'Custom Goal' ? '' : preset)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                        goalName === preset
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="e.g. Emergency Fund, New Phone, Wedding..."
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="50000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Saved (₹)
                  </label>
                  <input
                    type="number"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Date / Milestone
                </label>
                <input
                  type="text"
                  placeholder="e.g. December 2026 or March 2027"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Optional Note
                </label>
                <input
                  type="text"
                  placeholder="Reason or reminder for this goal"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

