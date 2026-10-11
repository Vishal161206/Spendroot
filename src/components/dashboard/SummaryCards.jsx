import React, { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export default function SummaryCards() {
  const {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    savingsGoalProgress,
    currentMonth,
    goals,
    primaryGoal,
    transactions,
  } = useFinance();

  // Dynamic previous month comparison from real database transactions
  const expenseComparison = useMemo(() => {
    if (!currentMonth || !transactions || transactions.length === 0) {
      return { change: 'Tracked period', changeType: 'neutral' };
    }

    const [mName, yStr] = currentMonth.split(' ');
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const mIdx = monthNames.findIndex(m => m.toLowerCase() === (mName || '').toLowerCase());
    const year = parseInt(yStr, 10) || 2026;

    if (mIdx === -1) return { change: 'Tracked period', changeType: 'neutral' };

    // Previous month
    const prevMIdx = mIdx === 0 ? 11 : mIdx - 1;
    const prevYear = mIdx === 0 ? year - 1 : year;
    const prevMonthStr = String(prevMIdx + 1).padStart(2, '0');
    const prevPrefix = `${prevYear}-${prevMonthStr}`;

    const prevMonthExpenses = transactions
      .filter(t => {
        const d = t.date || t.transaction_date || '';
        return (t.type === 'Expense' || t.type === 'EXPENSE') && d.startsWith(prevPrefix);
      })
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    if (prevMonthExpenses > 0) {
      const diff = totalExpenses - prevMonthExpenses;
      const pct = Math.abs(Math.round((diff / prevMonthExpenses) * 100));
      if (diff > 0) {
        return {
          change: `↑ ${pct}% vs ${monthNames[prevMIdx].slice(0, 3)}`,
          changeType: 'negative',
        };
      } else if (diff < 0) {
        return {
          change: `↓ ${pct}% vs ${monthNames[prevMIdx].slice(0, 3)}`,
          changeType: 'positive',
        };
      } else {
        return { change: `Same as ${monthNames[prevMIdx].slice(0, 3)}`, changeType: 'neutral' };
      }
    }

    return { change: 'Current period', changeType: 'neutral' };
  }, [currentMonth, transactions, totalExpenses]);

  // Goal metrics
  const totalGoalTarget = goals.reduce((sum, g) => sum + (Number(g.targetAmount) || Number(g.target_amount) || 0), 0);
  const totalGoalSaved = goals.reduce((sum, g) => sum + (Number(g.currentAmount) || Number(g.current_amount) || 0), 0);

  const cards = [
    {
      title: 'Total Income',
      amount: totalIncome,
      subtext: `Income for ${currentMonth}`,
      change: 'Monthly allocation',
      changeType: 'neutral',
      icon: Wallet,
      iconBg: 'bg-emerald-50 text-emerald-600',
      tooltip: 'Fixed monthly net salary / income',
    },
    {
      title: 'Total Expenses',
      amount: totalExpenses,
      subtext: `Recorded in ${currentMonth}`,
      change: expenseComparison.change,
      changeType: expenseComparison.changeType,
      icon: TrendingUp,
      iconBg: 'bg-rose-50 text-rose-600',
      tooltip: 'Actual spending across all categories for this period',
    },
    {
      title: 'Available / Net Savings',
      amount: netSavings,
      subtext: `${savingsRate}% savings rate`,
      change: netSavings > 0 ? 'Positive surplus' : 'Zero surplus',
      changeType: netSavings > 0 ? 'positive' : 'negative',
      icon: PiggyBank,
      iconBg: 'bg-teal-50 text-teal-600',
      tooltip: 'Unspent income available for investment & savings',
    },
    primaryGoal ? {
      title: `${primaryGoal.name || primaryGoal.title} Progress`,
      amount: `${savingsGoalProgress}%`,
      isPercent: true,
      subtext: `Saved ₹${totalGoalSaved.toLocaleString('en-IN')} of ₹${totalGoalTarget.toLocaleString('en-IN')}`,
      change: primaryGoal.status || 'Active goal',
      changeType: primaryGoal.status === 'At Risk' ? 'warning' : 'positive',
      icon: Target,
      iconBg: 'bg-indigo-50 text-indigo-600',
      tooltip: `Progress towards ${primaryGoal.name || primaryGoal.title}`,
    } : {
      title: 'Savings Objective',
      amount: `₹${netSavings.toLocaleString('en-IN')}`,
      isPercent: false,
      subtext: 'Build your savings',
      change: 'Default objective',
      changeType: 'neutral',
      icon: Target,
      iconBg: 'bg-indigo-50 text-indigo-600',
      tooltip: 'No specific goal set. Focus on increasing monthly net savings.',
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
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate max-w-[170px]">
                {c.title}
              </span>
              <div className={`p-2.5 rounded-xl ${c.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mb-2">
              <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 font-mono">
                {c.isPercent ? c.amount : `₹${Number(c.amount || 0).toLocaleString('en-IN')}`}
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
