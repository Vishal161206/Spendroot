import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Target,
  ShieldCheck,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { calculateWhatIfImpact } from '../services/intelligenceEngine';

export default function SimulatorPage() {
  const { totalIncome, totalExpenses, budgets, goals, monthlyTransactions, applyRecommendation, primaryGoal } = useFinance();

  // Dynamic user categories derived from budgets and actual transactions
  const userCategories = useMemo(() => {
    const cats = new Set();
    budgets.forEach((b) => cats.add(b.categoryName || b.category));
    monthlyTransactions.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return Array.from(cats);
  }, [budgets, monthlyTransactions]);

  const topCategory = budgets.length > 0 ? (budgets[0].categoryName || budgets[0].category) : (userCategories[0] || 'Food');
  const secondCategory = budgets.length > 1 ? (budgets[1].categoryName || budgets[1].category) : (userCategories[1] || 'Shopping');

  const topBudgetObj = budgets.find((b) => (b.categoryName || b.category) === topCategory) || {
    budget: 5000,
    spent: 0,
    projected: 0,
  };

  // Scenario Controls State
  const [topCategoryPercentCut, setTopCategoryPercentCut] = useState(0); // 0% - 30%
  const [secondaryCategoryCut, setSecondaryCategoryCut] = useState(0);    // 0, 500, 1000
  const [additionalExpense, setAdditionalExpense] = useState(0);          // + Amount scenario
  const [customCategory, setCustomCategory] = useState(userCategories[2] || userCategories[0] || 'Transport');
  const [customPercentCut, setCustomPercentCut] = useState(0);
  const [applied, setApplied] = useState(false);

  // Compute dynamic top category reduction in ₹
  const topCategoryBaseSpent = topBudgetObj.spent || 3000;
  const topCategoryReductionAmount = Math.round(topCategoryBaseSpent * (topCategoryPercentCut / 100));

  // Compute custom category reduction in ₹
  const customCatSpent = useMemo(() => {
    const txs = monthlyTransactions.filter((t) => t.category === customCategory && (t.type === 'Expense' || t.type === 'EXPENSE'));
    return txs.reduce((sum, t) => sum + Number(t.amount || 0), 0) || 2000;
  }, [monthlyTransactions, customCategory]);
  const customReductionAmount = Math.round(customCatSpent * (customPercentCut / 100));

  const totalSpendingReductions = topCategoryReductionAmount + secondaryCategoryCut + customReductionAmount;

  // Active goal or default objective
  const activeGoal = primaryGoal || (goals.length > 0 ? goals[0] : null);
  const goalTarget = activeGoal ? Number(activeGoal.targetAmount || activeGoal.target_amount || 0) : 0;
  const goalCurrent = activeGoal ? Number(activeGoal.currentAmount || activeGoal.current_amount || 0) : 0;
  const goalName = activeGoal ? (activeGoal.name || activeGoal.title) : 'Build Your Savings';

  // Calculate dynamic impact via pure math engine
  const impact = useMemo(() => {
    return calculateWhatIfImpact({
      baseIncome: totalIncome,
      baseExpense: totalExpenses,
      goalTarget,
      goalCurrent,
      goalName,
      spendingReductions: totalSpendingReductions,
      additionalExpense: Number(additionalExpense) || 0,
      foodBudget: topBudgetObj.budget,
      foodSpent: topBudgetObj.spent,
      foodProjected: topBudgetObj.projected || topBudgetObj.spent,
    });
  }, [
    totalIncome,
    totalExpenses,
    goalTarget,
    goalCurrent,
    goalName,
    totalSpendingReductions,
    additionalExpense,
    topBudgetObj,
  ]);

  const handleApply = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0D9488', '#10B981', '#F59E0B'],
      });
    } catch (e) {
      // fallback
    }

    if (impact.savingsDelta > 0) {
      applyRecommendation('rec_simulated_optimization');
    }
    setApplied(true);
  };

  const handleResetControls = () => {
    setTopCategoryPercentCut(0);
    setSecondaryCategoryCut(0);
    setAdditionalExpense(0);
    setCustomPercentCut(0);
    setApplied(false);
  };

  const handlePresetPositive = () => {
    setTopCategoryPercentCut(20);
    setSecondaryCategoryCut(500);
    setAdditionalExpense(0);
    setApplied(false);
  };

  const handlePresetNegative = () => {
    setTopCategoryPercentCut(0);
    setSecondaryCategoryCut(0);
    setAdditionalExpense(2000);
    setApplied(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 rounded-full border border-indigo-200 mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Interactive Behavioral Simulation</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
            What-If Financial Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Simulate habit optimizations or planned expenses. Calculated directly from your actual transactions and goals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePresetPositive}
            className="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors"
          >
            Reduce Spending (-20%)
          </button>
          <button
            onClick={handlePresetNegative}
            className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors"
          >
            +₹2,000 New Expense
          </button>
          <button
            onClick={handleResetControls}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Controls on Left, Dynamic Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Scenario Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 lg:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                1. Spending Adjustments
              </h2>
              <span className="text-xs text-slate-400">Personalized to your habits</span>
            </div>

            {/* Variable 1: Top Category % Cut */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">
                  Reduce {topCategory} Spending:
                </span>
                <span className="font-mono font-bold text-teal-600">
                  {topCategoryPercentCut}% (-₹{topCategoryReductionAmount.toLocaleString('en-IN')})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={topCategoryPercentCut}
                onChange={(e) => setTopCategoryPercentCut(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0%</span>
                <span>15%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Variable 2: Secondary Category Reduction */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Trim {secondCategory} Spending
                </span>
                <span className="text-xs font-bold font-mono text-slate-700">
                  {secondaryCategoryCut > 0 ? `-₹${secondaryCategoryCut}` : '₹0'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[0, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSecondaryCategoryCut(amt)}
                    className={`py-1.5 text-xs font-medium rounded-xl border transition-all ${
                      secondaryCategoryCut === amt
                        ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {amt === 0 ? 'No change' : `-₹${amt}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Variable 3: Additional Expense (+ Amount Scenario) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                  <PlusCircle className="w-3.5 h-3.5" />
                  Simulate Additional Expense (+₹)
                </span>
                <span className="text-xs font-bold font-mono text-rose-600">
                  {additionalExpense > 0 ? `+₹${Number(additionalExpense).toLocaleString('en-IN')}/mo` : '₹0'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Test the financial impact of a new recurring expense (e.g. EMI, new service, subscription).
              </p>
              <div className="flex gap-2">
                {[0, 1000, 2000, 5000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAdditionalExpense(val)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                      additionalExpense === val
                        ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {val === 0 ? '₹0' : `+₹${val}`}
                  </button>
                ))}
              </div>
              <div className="pt-1">
                <input
                  type="number"
                  placeholder="Or enter custom +₹ amount..."
                  value={additionalExpense || ''}
                  onChange={(e) => setAdditionalExpense(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Variable 4: Custom Category Selector */}
            {userCategories.length > 2 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Custom Category Adjustment:</span>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white font-medium"
                  >
                    {userCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Reduction:</span>
                  <span className="font-mono font-bold text-teal-600">{customPercentCut}% (-₹{customReductionAmount})</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="5"
                  value={customPercentCut}
                  onChange={(e) => setCustomPercentCut(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Dynamic Result Visualization (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Hero Delta Card */}
          <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                Live Simulation Output
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Calculated from your data
              </span>
            </div>

            {/* Before vs After Big Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CURRENT */}
              <div className="p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xs">
                <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
                  Current Projection
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Monthly Expense:</span>
                    <span className="font-mono font-bold text-white">₹{impact.baseExpense.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Net Monthly Savings:</span>
                    <span className="font-mono font-bold text-amber-400">₹{impact.baseSavings.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* AFTER SIMULATION */}
              <div className={`p-4 rounded-xl backdrop-blur-xs border ${
                impact.isPositive
                  ? 'bg-teal-900/40 border-teal-500/40'
                  : 'bg-rose-900/40 border-rose-500/40'
              }`}>
                <span className={`text-[11px] uppercase font-bold block mb-1 ${
                  impact.isPositive ? 'text-teal-300' : 'text-rose-300'
                }`}>
                  After Simulation
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-200">
                    <span>Projected Expense:</span>
                    <span className="font-mono font-bold text-white">₹{impact.simulatedExpense.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-200">
                    <span>Projected Savings:</span>
                    <span className={`font-mono font-bold ${
                      impact.isPositive ? 'text-emerald-300' : 'text-rose-300'
                    }`}>
                      ₹{impact.simulatedSavings.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlighted Difference Callout */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              impact.isPositive
                ? 'bg-teal-500/10 border-teal-400/30'
                : 'bg-rose-500/10 border-rose-400/30'
            }`}>
              <div>
                <span className={`text-xs ${impact.isPositive ? 'text-teal-200' : 'text-rose-200'}`}>
                  {impact.isPositive ? 'Total Net Monthly Gain:' : 'Net Monthly Impact (Increased Spend):'}
                </span>
                <span className={`block text-2xl font-extrabold font-mono ${
                  impact.isPositive ? 'text-teal-300' : 'text-rose-400'
                }`}>
                  {impact.savingsDelta >= 0 ? '+' : ''}₹{impact.savingsDelta.toLocaleString('en-IN')} / month
                </span>
                <span className="text-[11px] text-slate-400">
                  Annual Impact: {impact.savingsDelta >= 0 ? '+' : ''}₹{impact.annualSavingsImpact.toLocaleString('en-IN')} / year
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-300">Savings Rate:</span>
                <span className="block text-lg font-bold text-white font-mono">
                  {totalIncome > 0 ? ((impact.simulatedSavings / totalIncome) * 100).toFixed(1) : '0.0'}%
                </span>
              </div>
            </div>

            {/* Impact Details: Savings Goal Timeline or Default Savings Objective */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-teal-400" />
                {activeGoal ? `${goalName} Target Impact` : 'Default Objective: Build Your Savings'}
              </span>

              {activeGoal ? (
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-mono">
                      {impact.goal.baseMonths > 900 ? 'Delayed' : `${impact.goal.baseMonths} mos`}
                    </span>
                    <ArrowRight className="w-4 h-4 text-teal-400" />
                    <span className={`font-mono font-bold text-sm ${
                      impact.isPositive ? 'text-emerald-300' : 'text-rose-400'
                    }`}>
                      {impact.goal.simulatedMonths > 900 ? 'Unreachable' : `${impact.goal.simulatedMonths} mos`}
                    </span>
                  </div>

                  {impact.goal.monthsSaved > 0 && (
                    <span className="text-xs font-semibold text-teal-300 bg-teal-900/50 px-2.5 py-1 rounded-md border border-teal-500/30">
                      ⚡ Finish {impact.goal.monthsSaved} month{impact.goal.monthsSaved !== 1 ? 's' : ''} sooner!
                    </span>
                  )}
                  {impact.goal.monthsDelayed > 0 && (
                    <span className="text-xs font-semibold text-rose-300 bg-rose-900/50 px-2.5 py-1 rounded-md border border-rose-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      Delayed by +{impact.goal.monthsDelayed > 900 ? 'indefinite' : `${impact.goal.monthsDelayed} mos`}
                    </span>
                  )}
                  {impact.goal.monthsSaved === 0 && impact.goal.monthsDelayed === 0 && (
                    <span className="text-xs text-slate-400">
                      Timeline unchanged
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-300 space-y-1">
                  <p>
                    You currently have no specific savings goal.
                    {impact.savingsDelta > 0
                      ? ` Saving ₹${impact.savingsDelta.toLocaleString('en-IN')} more per month could increase your annual savings cushion by ₹${impact.annualSavingsImpact.toLocaleString('en-IN')}.`
                      : ` Adding ₹${Math.abs(impact.savingsDelta).toLocaleString('en-IN')} in monthly expenses reduces your annual savings growth by ₹${Math.abs(impact.annualSavingsImpact).toLocaleString('en-IN')}.`}
                  </p>
                </div>
              )}
            </div>

            {/* CTA: Apply Recommendation */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
              <span className="text-[11px] text-slate-400">
                Simulations project scenarios without modifying actual data until applied.
              </span>
              <button
                onClick={handleApply}
                disabled={applied || impact.savingsDelta <= 0}
                className={`w-full sm:w-auto px-6 py-3 text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  applied
                    ? 'bg-emerald-600 text-white cursor-default'
                    : impact.savingsDelta <= 0
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-teal-500 hover:bg-teal-400 text-slate-900'
                }`}
              >
                {applied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Applied to Active Plan</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Apply Optimization (Save ₹{Math.max(0, impact.savingsDelta).toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

