import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, ChevronRight, PieChart } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export default function BudgetHealthSection({ onSelectCategory }) {
  const { budgets } = useFinance();
  const navigate = useNavigate();

  return (
    <div className="p-5 lg:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-teal-600" />
            <span>Budget Health</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time spending vs monthly allocation with velocity projection.
          </p>
        </div>
        <button
          onClick={() => navigate('/budgets')}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
        >
          <span>All Budgets</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {budgets.slice(0, 4).map((b) => {
          const percentSpent = Math.min(100, Math.round((b.spent / b.budget) * 100));
          const isAtRisk = b.status === 'At Risk';

          return (
            <div
              key={b.id}
              onClick={() => {
                if (onSelectCategory) onSelectCategory(b);
                else navigate('/budgets');
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isAtRisk
                  ? 'border-amber-200 bg-amber-50/20 hover:border-amber-300 hover:shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">{b.categoryName}</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    isAtRisk
                      ? 'text-amber-800 bg-amber-100 border border-amber-200'
                      : 'text-emerald-800 bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {isAtRisk ? <AlertTriangle className="w-2.5 h-2.5" /> : <CheckCircle className="w-2.5 h-2.5" />}
                  {b.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isAtRisk ? 'bg-amber-500' : 'bg-teal-500'
                  }`}
                  style={{ width: `${percentSpent}%` }}
                />
              </div>

              {/* Stats Grid */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Budget:</span>
                  <span className="font-semibold text-slate-800 font-mono">₹{b.budget.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Spent:</span>
                  <span className="font-semibold text-slate-800 font-mono">₹{b.spent.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-100">
                  <span>Projected:</span>
                  <span
                    className={`font-bold font-mono ${
                      isAtRisk ? 'text-rose-600' : 'text-slate-800'
                    }`}
                  >
                    ₹{b.projected.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Warning note if at risk */}
              {isAtRisk && b.warning && (
                <div className="mt-2 text-[10px] text-amber-800 font-medium bg-amber-100/60 p-1.5 rounded-md truncate">
                  ⚠ {b.warning}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
