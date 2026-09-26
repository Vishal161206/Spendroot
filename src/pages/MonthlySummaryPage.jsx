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
import { DETECTED_PATTERNS } from '../services/mockData';

export default function MonthlySummaryPage() {
  const { totalIncome, totalExpenses, netSavings, savingsRate, budgets, goals } = useFinance();

  const handlePrint = () => {
    window.print();
  };

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
            Formal audit summary for September 2026.
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
              Account Holder: <span className="font-semibold text-slate-800">Vishal</span> | User ID: <span className="font-mono">usr_vishal_01</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-sm font-bold text-slate-800">September 2026 Financial Summary</p>
            <p className="text-xs text-slate-400">Generated on 20 Sep 2026 (Day 20 of 30)</p>
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
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Budget</th>
                  <th className="py-2.5 px-3 text-right">Spent (Day 20)</th>
                  <th className="py-2.5 px-3 text-right">Projected (Day 30)</th>
                  <th className="py-2.5 px-3 text-right">Variance</th>
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
                    <td className={`py-2.5 px-3 text-right font-mono font-bold ${
                      b.variance < 0 ? 'text-rose-600' : 'text-emerald-700'
                    }`}>
                      {b.variance < 0 ? `-₹${Math.abs(b.variance).toLocaleString('en-IN')}` : `+₹${b.variance.toLocaleString('en-IN')}`}
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
        </div>

        {/* Behavioral Pattern Audit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">
              Observed Behavioral Sequences
            </span>
            <p className="text-xs text-slate-600">
              {DETECTED_PATTERNS[0].summary}
            </p>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
              <span>Avg sequence: ₹{DETECTED_PATTERNS[0].averageSequenceCost}</span>
              <span className="text-rose-600 font-bold">Impact: ₹{DETECTED_PATTERNS[0].monthlyAvoidableImpact}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">
              Recurring Fixed Commitments
            </span>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Sunrise Apartments Rent: ₹10,000 (Paid 1 Sep)</li>
              <li>• Airtel Fiber Broadband: ₹799 (Paid 5 Sep)</li>
              <li>• Netflix Subscription: ₹649 (Paid 18 Sep)</li>
            </ul>
          </div>
        </div>

        {/* Goals Status */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Milestone Savings Goals Audit
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals.map((g) => (
              <div key={g.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-800">{g.title}</span>
                  <span className="text-[11px] font-semibold text-slate-500">{g.deadline}</span>
                </div>
                <p className="text-xs text-slate-600 font-mono">
                  Saved: ₹{g.currentAmount.toLocaleString('en-IN')} / ₹{g.targetAmount.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Pacing: ₹{g.currentMonthlyContribution.toLocaleString('en-IN')} vs required ₹{g.requiredMonthlyContribution.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Actions for Next Month */}
        <div className="p-5 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Key Recommended Actions for October 2026</span>
          </h2>
          <ol className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside">
            <li>
              <strong className="text-slate-900">Reduce repeated food-order sequences:</strong> Cut 2 late-evening orders to save ₹1,100 and eliminate food budget deficit.
            </li>
            <li>
              <strong className="text-slate-900">Review recurring subscription expenses:</strong> Pause idle Netflix plan to recover ₹649 directly to savings.
            </li>
            <li>
              <strong className="text-slate-900">Increase monthly goal contribution:</strong> Allocate recovered funds to reach the required ₹10,000/mo laptop pacing.
            </li>
          </ol>
        </div>

        {/* Footer Signature */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>SpendRoot Behavioral Finance Platform • Hackathon Prototype URAN 2026 FT-01</span>
          <span>Verified against synthetic ledger data</span>
        </div>
      </div>
    </div>
  );
}
