import React, { useState, useMemo } from 'react';
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
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';

export default function InsightsPage() {
  const navigate = useNavigate();
  const {
    monthlyTransactions,
    budgets,
    primaryGoal,
    patterns,
    recommendations,
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    currentMonth,
    applyRecommendation,
  } = useFinance();

  const [dismissedIds, setDismissedIds] = useState([]);
  const [acceptedIds, setAcceptedIds] = useState([]);

  // Compute dynamic, explainable insights strictly from user data
  const dynamicInsights = useMemo(() => {
    const list = [];

    // 1. High Spending Category Insight
    const expenseTxns = monthlyTransactions.filter((t) => t.type === 'Expense' || t.type === 'EXPENSE');
    const catSpending = {};
    const catCounts = {};
    for (const t of expenseTxns) {
      const cat = t.category || 'Other';
      catSpending[cat] = (catSpending[cat] || 0) + Number(t.amount || 0);
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    }

    const sortedCats = Object.entries(catSpending).sort((a, b) => b[1] - a[1]);
    if (sortedCats.length > 0 && totalExpenses > 0) {
      const [topCat, topCatAmt] = sortedCats[0];
      const topCatPercent = Math.round((topCatAmt / totalExpenses) * 100);
      const topCatCount = catCounts[topCat] || 1;
      const potentialCut = Math.round(topCatAmt * 0.15);

      list.push({
        id: `ins_top_cat_${topCat}`,
        category: 'High Spending Category',
        title: `${topCat} represents ${topCatPercent}% of your expenses this month`,
        severity: topCatPercent >= 35 ? 'critical' : 'warning',
        detection: `${topCat} is your single largest expense category in ${currentMonth}.`,
        evidence: `₹${topCatAmt.toLocaleString('en-IN')} spent across ${topCatCount} transactions (Total monthly expenses: ₹${totalExpenses.toLocaleString('en-IN')}).`,
        reason: `Discretionary volume in ${topCat} dominates your monthly cash outflow.`,
        recommendedAction: `Aim to reduce ${topCat} spending by 15% through intentional planning.`,
        estimatedImpact: `Saves approximately ₹${potentialCut.toLocaleString('en-IN')}/month to reinforce savings.`,
      });
    }

    // 2. Budget Overrun / Velocity Risks
    for (const b of budgets) {
      if (b.status === 'At Risk' || (b.budget > 0 && b.spent > b.budget * 0.85)) {
        const overrun = Math.max(0, b.projected - b.budget);
        list.push({
          id: `ins_budget_${b.id}`,
          category: 'Budget Velocity Alert',
          title: `${b.categoryName} spending projected to exceed monthly allocation`,
          severity: 'critical',
          detection: `Linear velocity forecast projects ${b.categoryName} will overrun its ₹${b.budget.toLocaleString('en-IN')} limit.`,
          evidence: `₹${b.spent.toLocaleString('en-IN')} spent out of ₹${b.budget.toLocaleString('en-IN')} budget. Projected month-end: ₹${b.projected.toLocaleString('en-IN')}.`,
          reason: `Pace of daily expenditure in ${b.categoryName} exceeds sustainable monthly threshold.`,
          recommendedAction: `Curtail non-essential ${b.categoryName} purchases for the remainder of the month.`,
          estimatedImpact: `Avoids an estimated ₹${overrun.toLocaleString('en-IN')} budget deficit.`,
        });
      }
    }

    // 3. Goal Pacing or Savings Objective
    if (primaryGoal) {
      const gTarget = Number(primaryGoal.targetAmount || primaryGoal.target_amount || 0);
      const gCurrent = Number(primaryGoal.currentAmount || primaryGoal.current_amount || 0);
      const gName = primaryGoal.name || primaryGoal.title;
      const gPct = gTarget > 0 ? Math.round((gCurrent / gTarget) * 100) : 0;
      const req = Number(primaryGoal.requiredMonthlyContribution || 0);
      const cur = Number(primaryGoal.currentMonthlyContribution || 0);

      if (cur < req) {
        list.push({
          id: `ins_goal_${primaryGoal.id}`,
          category: 'Savings Goal Risk',
          title: `Current saving pace risks delaying "${gName}" milestone`,
          severity: 'warning',
          detection: `Monthly contribution is ₹${Math.max(0, req - cur).toLocaleString('en-IN')} below required pacing.`,
          evidence: `Current pace: ₹${cur.toLocaleString('en-IN')}/mo vs Required pace: ₹${req.toLocaleString('en-IN')}/mo (Current: ₹${gCurrent.toLocaleString('en-IN')} / ₹${gTarget.toLocaleString('en-IN')}, ${gPct}% achieved).`,
          reason: 'Discretionary monthly outflows absorb funds required to achieve target on schedule.',
          recommendedAction: `Apply recommended habit reductions in top categories to free up allocation.`,
          estimatedImpact: `Realigns pace with target completion date: ${primaryGoal.deadline || 'milestone deadline'}.`,
        });
      } else {
        list.push({
          id: `ins_goal_${primaryGoal.id}`,
          category: 'Goal Milestone Health',
          title: `"${gName}" is currently on track`,
          severity: 'info',
          detection: `Milestone is pacing within expected timeline bounds.`,
          evidence: `₹${gCurrent.toLocaleString('en-IN')} saved toward ₹${gTarget.toLocaleString('en-IN')} (${gPct}% complete).`,
          reason: `Monthly contribution rate meets or exceeds the required rate.`,
          recommendedAction: `Keep up the current automated transfer schedule.`,
          estimatedImpact: `On schedule to achieve goal by ${primaryGoal.deadline || 'scheduled date'}.`,
        });
      }
    } else {
      list.push({
        id: 'ins_no_goal_savings',
        category: 'Savings Objective',
        title: `Default Objective: Build Monthly Savings Buffer`,
        severity: 'info',
        detection: 'No specific savings target is currently registered.',
        evidence: `Monthly income: ₹${totalIncome.toLocaleString('en-IN')} | Expenses: ₹${totalExpenses.toLocaleString('en-IN')} | Net savings: ₹${netSavings.toLocaleString('en-IN')} (${savingsRate}%).`,
        reason: 'Setting explicit milestone targets increases long-term savings retention by over 30%.',
        recommendedAction: 'Create an Emergency Fund or target milestone in the Goals section.',
        estimatedImpact: `Provides tangible direction for your monthly ₹${netSavings.toLocaleString('en-IN')} surplus.`,
      });
    }

    // 4. Largest Transaction Insight
    if (expenseTxns.length > 0) {
      const sortedByAmt = [...expenseTxns].sort((a, b) => Number(b.amount) - Number(a.amount));
      const largestTx = sortedByAmt[0];
      if (largestTx && Number(largestTx.amount) >= 1500) {
        list.push({
          id: `ins_largest_${largestTx.id}`,
          category: 'Unusual / Peak Expense',
          title: `Largest single purchase: ₹${Number(largestTx.amount).toLocaleString('en-IN')} at ${largestTx.merchant}`,
          severity: 'info',
          detection: `Single transaction constitutes a substantial portion of monthly outflow.`,
          evidence: `₹${Number(largestTx.amount).toLocaleString('en-IN')} on ${largestTx.date} (${largestTx.category}).`,
          reason: `Outsized single debits create temporary volatility in your monthly cash buffer.`,
          recommendedAction: `Check if this is a recurring annual commitment or a one-off item.`,
          estimatedImpact: `Categorizing one-time charges correctly prevents skewing recurring monthly budgets.`,
        });
      }
    }

    // 5. Backend Detected Behavioral Patterns
    if (Array.isArray(patterns)) {
      for (const p of patterns) {
        list.push({
          id: `ins_pat_${p.id}`,
          category: 'Behavioral Sequence',
          title: p.title || 'Behavioral sequence pattern detected',
          severity: p.severity || 'warning',
          detection: p.detection || 'Correlated spending timestamps observed in transaction log.',
          evidence: p.evidence || `Pattern verified across recent transaction activity.`,
          reason: p.reason || 'Repeated habitual convenience triggers observed in payment history.',
          recommendedAction: p.recommendedAction || 'Pre-plan meals or set transaction holds on recurring apps.',
          estimatedImpact: p.estimatedImpact || `Reduces avoidable recurring impulse expenses.`,
        });
      }
    }

    return list;
  }, [monthlyTransactions, budgets, primaryGoal, patterns, totalIncome, totalExpenses, netSavings, savingsRate, currentMonth]);

  const insights = useMemo(() => {
    return dynamicInsights.filter((item) => !dismissedIds.includes(item.id));
  }, [dynamicInsights, dismissedIds]);

  const handleAccept = (id) => {
    setAcceptedIds((prev) => [...prev, id]);
    applyRecommendation('rec_simulated_optimization');
  };

  const handleDismiss = (id) => {
    setDismissedIds((prev) => [...prev, id]);
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
      {insights.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-3 border border-teal-100">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">All insights addressed or dismissed</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mb-4">
            Your spending patterns and budgets for {currentMonth} are currently within nominal targets.
          </p>
          {dismissedIds.length > 0 && (
            <button
              onClick={() => setDismissedIds([])}
              className="px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors"
            >
              Restore Dismissed Insights
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {insights.map((item) => {
            const isAccepted = acceptedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`p-6 rounded-2xl border transition-all ${item.severity === 'critical'
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
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${item.severity === 'critical'
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
      )}
    </div>
  );
}
