import React from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function MonthlySummaryPage() {
  const {
    user,
    currentMonth,
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    budgets,
    goals,
    patterns,
    recommendations,
    monthlyTransactions,
    primaryGoal,
  } = useFinance();

  const handlePrint = () => {
    window.print();
  };

  // Derive recurring/subscription charges from monthly transactions
  const recurringCharges = monthlyTransactions.filter((t) => {
    const desc = (t.merchant || t.description || '').toLowerCase();
    const cat = (t.category || '').toLowerCase();
    return (
      cat.includes('bill') ||
      cat.includes('rent') ||
      desc.includes('rent') ||
      desc.includes('fiber') ||
      desc.includes('broadband') ||
      desc.includes('netflix') ||
      desc.includes('prime') ||
      desc.includes('hotstar') ||
      desc.includes('spotify') ||
      desc.includes('gym')
    );
  });

  return (
    <div className="space-y-6 print-page max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="p-5 lg:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <span>Monthly Financial Performance Report</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Formal audit summary for {currentMonth}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Report Body (Printable Paper Style) */}
      <div className="p-6 lg:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Spend<span className="text-teal-600">Root</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100 rounded">
                Official Report
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Account Holder: <span className="font-semibold text-slate-800">{user?.name || 'Account Holder'}</span> | User ID: <span className="font-mono">{user?.id || 'usr_active'}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-sm font-bold text-slate-800">{currentMonth} Financial Summary</p>
            <p className="text-xs text-slate-400">Generated automatically from live ledger</p>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">Total Income</span>
            <span className="text-xl font-bold font-mono text-slate-900">₹{totalIncome.toLocaleString('en-IN')}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">Total Expenses</span>
            <span className="text-xl font-bold font-mono text-slate-900">₹{totalExpenses.toLocaleString('en-IN')}</span>
          </div>

          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100">
            <span className="text-[11px] font-semibold uppercase text-teal-700 block">Net Available Savings</span>
            <span className="text-xl font-bold font-mono text-teal-800">₹{netSavings.toLocaleString('en-IN')}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">Savings Rate</span>
            <span className="text-xl font-bold font-mono text-slate-900">{savingsRate}%</span>
          </div>
        </div>

        {/* Category Budget Variance Table */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Budget Variance & Velocity Forecast
          </h2>
          {budgets.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2">No budgets configured for this period.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Budget</th>
                    <th className="py-2.5 px-3 text-right">Spent to Date</th>
                    <th className="py-2.5 px-3 text-right">Projected Month-End</th>
                    <th className="py-2.5 px-3 text-right">Remaining</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {budgets.map((b) => (
                    <tr key={b.id}>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{b.categoryName}</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{b.budget.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{b.spent.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">₹{b.projected.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-700">
                        ₹{Math.max(0, b.budget - b.spent).toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          b.status === 'At Risk'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Behavioral Pattern Audit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">
              Observed Behavioral Sequences
            </span>
            {patterns && patterns.length > 0 ? (
              <p className="text-xs text-slate-600">
                {patterns[0].summary || patterns[0].detection || 'Pattern observed in transaction logs.'}
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Transactions in {currentMonth} show consistent regular pacing without unbudgeted burst sequences.
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">
              Recurring Fixed Commitments
            </span>
            {recurringCharges.length > 0 ? (
              <ul className="text-xs text-slate-600 space-y-1">
                {recurringCharges.slice(0, 4).map((rc, i) => (
                  <li key={i}>
                    • {rc.merchant || rc.category}: ₹{Number(rc.amount).toLocaleString('en-IN')} ({rc.date})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">No recurring commitments identified for this period.</p>
            )}
          </div>
        </div>

        {/* Goals Status */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Milestone Savings Goals Audit
          </h2>
          {goals.length === 0 ? (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-500">
              No specific savings target set. Current default financial objective is to build savings cushion.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goals.map((g) => (
                <div key={g.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-800">{g.title || g.name}</span>
                    <span className="text-[11px] font-semibold text-slate-500">{g.deadline || g.target_date || 'Target'}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-mono">
                    Saved: ₹{Number(g.currentAmount || g.current_amount || 0).toLocaleString('en-IN')} / ₹{Number(g.targetAmount || g.target_amount || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Pacing: ₹{Number(g.currentMonthlyContribution || 0).toLocaleString('en-IN')}/mo vs required ₹{Number(g.requiredMonthlyContribution || 0).toLocaleString('en-IN')}/mo
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Key Recommended Actions */}
        <div className="p-5 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Key Recommended Actions</span>
          </h2>
          <ol className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside">
            {budgets.some((b) => b.status === 'At Risk') ? (
              <li>
                <strong className="text-slate-900">Manage at-risk category velocity:</strong> Re-balance spending in {budgets.filter((b) => b.status === 'At Risk').map((b) => b.categoryName).join(', ')} to prevent monthly overrun.
              </li>
            ) : (
              <li>
                <strong className="text-slate-900">Maintain budget adherence:</strong> All current categories are pacing on track within monthly limits.
              </li>
            )}
            {primaryGoal ? (
              <li>
                <strong className="text-slate-900">Target milestone acceleration:</strong> Allocate monthly surplus of ₹{netSavings.toLocaleString('en-IN')} to achieve "{primaryGoal.name || primaryGoal.title}" faster.
              </li>
            ) : (
              <li>
                <strong className="text-slate-900">Define a savings milestone:</strong> Set up a custom savings goal to focus and track your monthly surplus.
              </li>
            )}
            <li>
              <strong className="text-slate-900">Review discretionary spending:</strong> Run simulations on the What-If Simulator before committing to new monthly expenses.
            </li>
          </ol>
        </div>

        {/* Footer Signature */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>SpendRoot Behavioral Finance Platform</span>
          <span>Verified against authenticated user transactions</span>
        </div>
      </div>
    </div>
  );
}
