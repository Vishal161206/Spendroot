import React from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export default function SummaryCards() {
  const { totalIncome, totalExpenses, netSavings, savingsRate, savingsGoalProgress } = useFinance();

  const cards = [
    {
      title: 'Total Income',
      amount: totalIncome,
      subtext: 'Monthly salary credited',
      change: 'Steady with Aug',
      changeType: 'neutral',
      icon: Wallet,
      iconBg: 'bg-emerald-50 text-emerald-600',
      tooltip: 'Fixed monthly net salary after tax deductions',
    },
    {
      title: 'Total Expenses',
      amount: totalExpenses,
      subtext: '20 days into September',
      change: '↑ 8.4% from August',
      changeType: 'negative',
      icon: TrendingUp,
      iconBg: 'bg-rose-50 text-rose-600',
      tooltip: 'Actual spending across all categories so far',
    },
    {
      title: 'Available / Net Savings',
      amount: netSavings,
      subtext: `${savingsRate}% savings rate`,
      change: 'Projected net balance',
      changeType: 'positive',
      icon: PiggyBank,
      iconBg: 'bg-teal-50 text-teal-600',
      tooltip: 'Unspent income available for investment & savings',
    },
    {
      title: 'Savings Goal Progress',
      amount: `${savingsGoalProgress}%`,
      isPercent: true,
      subtext: 'Blended goals pace',
      change: 'Target ₹90,000 across 2 goals',
      changeType: 'warning',
      icon: Target,
      iconBg: 'bg-indigo-50 text-indigo-600',
      tooltip: 'Progress towards Laptop (₹60k) and Emergency fund (₹30k)',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all relative group"
            title={c.tooltip}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {c.title}
              </span>
              <div className={`p-2.5 rounded-xl ${c.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mb-2">
              <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 font-mono">
                {c.isPercent ? c.amount : `₹${c.amount.toLocaleString('en-IN')}`}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-500 truncate">{c.subtext}</span>
              <span
                className={`font-semibold flex items-center gap-0.5 shrink-0 ${
                  c.changeType === 'positive'
                    ? 'text-emerald-600'
                    : c.changeType === 'negative'
                    ? 'text-rose-600'
                    : c.changeType === 'warning'
                    ? 'text-amber-600'
                    : 'text-slate-600'
                }`}
              >
                {c.changeType === 'negative' && <ArrowUpRight className="w-3 h-3" />}
                {c.changeType === 'positive' && <ArrowDownRight className="w-3 h-3" />}
                {c.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
