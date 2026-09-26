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
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { calculateWhatIfImpact } from '../services/intelligenceEngine';

export default function SimulatorPage() {
  const { totalIncome, totalExpenses, budgets, goals, applyRecommendation } = useFinance();

  // Scenario Controls State
  const [foodReductionTxCount, setFoodReductionTxCount] = useState(2); // Cut 2 orders = ₹1,100 default
  const [foodPercentCut, setFoodPercentCut] = useState(0);            // 0%, 10%, 25%
  const [pauseNetflix, setPauseNetflix] = useState(false);            // ₹649
  const [shoppingCut, setShoppingCut] = useState(0);                  // 0, 500, 1000
  const [transportCut, setTransportCut] = useState(0);                // 0, 300, 600
  const [applied, setApplied] = useState(false);

  // Extract baseline category figures
  const foodBudgetObj = budgets.find(b => b.id === 'b_food') || { budget: 5000, spent: 4650, projected: 6050 };
  const shoppingBudgetObj = budgets.find(b => b.id === 'b_shopping') || { budget: 2500, spent: 2150, projected: 3400 };
  const laptopGoalObj = goals.find(g => g.id === 'goal_laptop') || { targetAmount: 60000, currentAmount: 20000 };

  // Calculate dynamic impact via pure math engine
  const impact = useMemo(() => {
    return calculateWhatIfImpact({
      baseIncome: totalIncome,
      baseExpense: totalExpenses,
      foodBudget: foodBudgetObj.budget,
      foodSpent: foodBudgetObj.spent,
      foodProjected: foodBudgetObj.projected,
      shoppingBudget: shoppingBudgetObj.budget,
      shoppingProjected: shoppingBudgetObj.projected,
      goalTarget: laptopGoalObj.targetAmount,
      goalCurrent: laptopGoalObj.currentAmount,
      foodOrderReductionCount: foodReductionTxCount,
      foodPercentCut,
      removeNetflix: pauseNetflix,
      shoppingCutAmount: shoppingCut,
      transportCutAmount: transportCut,
    });
  }, [
    totalIncome,
    totalExpenses,
    foodBudgetObj,
    shoppingBudgetObj,
    laptopGoalObj,
    foodReductionTxCount,
    foodPercentCut,
    pauseNetflix,
    shoppingCut,
    transportCut,
  ]);

  const handleApply = () => {
    // Fire festive fintech celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0D9488', '#10B981', '#F59E0B'],
      });
    } catch (e) {
      // fallback if canvas not available
    }

    applyRecommendation('rec_food_reduce_2');
    setApplied(true);
  };

  const handleResetControls = () => {
    setFoodReductionTxCount(0);
    setFoodPercentCut(0);
    setPauseNetflix(false);
    setShoppingCut(0);
    setTransportCut(0);
    setApplied(false);
  };

  const handlePresetRecommended = () => {
    setFoodReductionTxCount(2);
    setFoodPercentCut(0);
    setPauseNetflix(false);
    setShoppingCut(0);
    setTransportCut(0);
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
            What happens if I change one habit?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Simulate small, realistic adjustments to your daily spending routines. See the exact mathematical ripple effect on budget health, net savings, and your savings goal finish line.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePresetRecommended}
            className="px-3.5 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors"
          >
            Recommended Preset (-2 Orders)
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
                1. Scenario Variables
              </h2>
              <span className="text-xs text-slate-400">Drag or toggle</span>
            </div>

            {/* Variable 1: Food Delivery Reductions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Food Delivery Orders Cut
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Target late-evening Swiggy/Zomato sequences
                  </span>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold text-teal-700 bg-teal-50 rounded-lg border border-teal-200">
                  {foodReductionTxCount} orders (-₹{foodReductionTxCount * 550})
                </span>
              </div>

              {/* Quick toggle chips */}
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((count) => (
                  <button
                    key={count}
                    onClick={() => setFoodReductionTxCount(count)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      foodReductionTxCount === count
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {count === 0 ? 'None' : `-${count} orders`}
                  </button>
                ))}
              </div>
            </div>

            {/* Variable 2: Food % Cut Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Or Reduce Overall Food Budget:</span>
                <span className="font-mono font-bold text-teal-600">{foodPercentCut}% cut</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="5"
                value={foodPercentCut}
                onChange={(e) => setFoodPercentCut(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0%</span>
                <span>10%</span>
                <span>25%</span>
              </div>
            </div>

            {/* Variable 3: Subscriptions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block">
                Digital Subscriptions
              </span>
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={pauseNetflix}
                    onChange={(e) => setPauseNetflix(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Pause Idle Netflix</span>
                    <span className="text-[11px] text-slate-500">60% drop in view time detected</span>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono text-slate-700">+₹649/mo</span>
              </label>
            </div>

            {/* Variable 4: Discretionary Shopping Cut */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Discretionary Shopping Cut
                </span>
                <span className="text-xs font-bold font-mono text-slate-700">
                  {shoppingCut > 0 ? `-₹${shoppingCut}` : '₹0'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[0, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setShoppingCut(amt)}
                    className={`py-1.5 text-xs font-medium rounded-xl border transition-all ${
                      shoppingCut === amt
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {amt === 0 ? 'No change' : `-₹${amt}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Variable 5: Transport Cut */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Carpool / Ride Optimization
                </span>
                <span className="text-xs font-bold font-mono text-slate-700">
                  {transportCut > 0 ? `-₹${transportCut}` : '₹0'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[0, 300, 600].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTransportCut(amt)}
                    className={`py-1.5 text-xs font-medium rounded-xl border transition-all ${
                      transportCut === amt
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {amt === 0 ? 'No change' : `-₹${amt}`}
                  </button>
                ))}
              </div>
            </div>
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
                Real-time recalculation
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
                    <span>Net Savings:</span>
                    <span className="font-mono font-bold text-amber-400">₹{impact.baseSavings.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* AFTER SIMULATION */}
              <div className="p-4 rounded-xl bg-teal-900/40 border border-teal-500/40 backdrop-blur-xs">
                <span className="text-[11px] uppercase font-bold text-teal-300 block mb-1">
                  After Simulation
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-teal-100">
                    <span>Projected Expense:</span>
                    <span className="font-mono font-bold text-white">₹{impact.simulatedExpense.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-teal-100">
                    <span>Projected Savings:</span>
                    <span className="font-mono font-bold text-emerald-300">₹{impact.simulatedSavings.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlighted Difference Callout */}
            <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-400/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-teal-200">Total Net Monthly Gain:</span>
                <span className="block text-2xl font-extrabold text-teal-300 font-mono">
                  +₹{impact.savingsDelta.toLocaleString('en-IN')} / month
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-300">Savings Rate:</span>
                <span className="block text-lg font-bold text-white font-mono">
                  {((impact.simulatedSavings / totalIncome) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Impact Details 1: Budget Status Flip */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Food & Dining Budget Status
              </span>
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                    {impact.food.statusBefore} (₹{impact.food.projectedBefore})
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className={`px-2.5 py-1 rounded-md font-bold border ${
                    impact.food.statusAfter === 'On Track'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {impact.food.statusAfter} (₹{impact.food.projectedAfter})
                  </span>
                </div>
                {impact.food.statusAfter === 'On Track' && (
                  <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Budget Deficit Eliminated!
                  </span>
                )}
              </div>
            </div>

            {/* Impact Details 2: Savings Goal Acceleration */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                New Laptop Goal Finish Line (₹60,000 Target)
              </span>
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-mono">
                    {impact.goal.baseMonths} months
                  </span>
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                  <span className="font-bold text-emerald-300 font-mono text-sm">
                    {impact.goal.simulatedMonths} months
                  </span>
                </div>
                <span className="text-xs font-semibold text-teal-300 bg-teal-900/50 px-2.5 py-1 rounded-md border border-teal-500/30">
                  ⚡ Finish {impact.goal.daysSaved} days sooner!
                </span>
              </div>
            </div>

            {/* CTA: Apply Recommendation */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
              <span className="text-[11px] text-slate-400">
                Simulations do not modify actual data until applied.
              </span>
              <button
                onClick={handleApply}
                disabled={applied || impact.savingsDelta === 0}
                className={`w-full sm:w-auto px-6 py-3 text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  applied
                    ? 'bg-emerald-600 text-white cursor-default'
                    : impact.savingsDelta === 0
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
                    <span>Apply Recommendation (Save ₹{impact.savingsDelta})</span>
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
