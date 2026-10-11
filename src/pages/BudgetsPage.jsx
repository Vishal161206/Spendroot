import React, { useState } from 'react';
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Edit2,
  Check,
  X,
  Trash2,
  IndianRupee,
  SlidersHorizontal,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';

export default function BudgetsPage() {
  const { budgets, updateBudget, createBudget, deleteBudget, currentMonth } = useFinance();
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [tempBudget, setTempBudget] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New budget form
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const startEdit = (b) => {
    setEditingId(b.id);
    setTempBudget(b.budget.toString());
  };

  const saveEdit = async (id) => {
    const val = parseFloat(tempBudget);
    if (!isNaN(val) && val > 0) {
      await updateBudget(id, val);
    }
    setEditingId(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.trim() || !newAmount || parseFloat(newAmount) <= 0) return;
    setIsSubmitting(true);
    const [mName, yStr] = (currentMonth || 'September 2026').split(' ');
    await createBudget({
      category: newCategory.trim(),
      amount: parseFloat(newAmount),
      month: mName || 'September',
      year: parseInt(yStr, 10) || 2026,
    });
    setNewCategory('');
    setNewAmount('');
    setIsSubmitting(false);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 lg:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-teal-600" />
            <span>Budget Planner & Velocity Forecaster</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure monthly thresholds. SpendRoot uses linear velocity math to predict month-end overruns before they happen.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/simulator')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Simulate Overrun Fix</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Budget</span>
          </button>
        </div>
      </div>

      {/* Category Budgets Grid */}
      {budgets.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-3 border border-teal-100">
            <PieChart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No budgets created yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mb-4">
            Create your first budget to start monitoring category velocity and prevent month-end overspending.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create your first budget</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((b) => {
            const percent = Math.min(100, Math.round((b.spent / b.budget) * 100));
            const remaining = Math.max(0, b.budget - b.spent);
            const isAtRisk = b.status === 'At Risk';
            const isEditing = editingId === b.id;

            return (
              <div
                key={b.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isAtRisk
                    ? 'bg-amber-50/20 border-amber-300/80 shadow-xs'
                    : 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300'
                }`}
              >
                {/* Card Top: Category & Status Badge & Delete */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{b.categoryName}</span>
                    <button
                      onClick={() => deleteBudget(b.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-0.5 rounded"
                      title="Delete budget"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                      isAtRisk
                        ? 'text-amber-800 bg-amber-100 border border-amber-300'
                        : 'text-emerald-800 bg-emerald-100 border border-emerald-300'
                    }`}
                  >
                    {isAtRisk ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                    {b.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                    <span>{percent}% spent</span>
                    <span>₹{remaining.toLocaleString('en-IN')} remaining</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        isAtRisk ? 'bg-amber-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Editable Budget Line */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Monthly Budget:</span>
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={tempBudget}
                          onChange={(e) => setTempBudget(e.target.value)}
                          className="w-24 px-2 py-0.5 text-xs font-mono font-bold border border-teal-500 rounded bg-white"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEdit(b.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 text-slate-400 hover:bg-slate-200 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 font-mono">
                          ₹{b.budget.toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => startEdit(b)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title="Edit budget allowance"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Actual Spent:</span>
                    <span className="font-bold text-slate-800 font-mono">
                      ₹{b.spent.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs pt-1 border-t border-slate-200/60">
                    <span className="text-slate-600 font-semibold">Projected Month-End:</span>
                    <span
                      className={`font-mono font-extrabold ${
                        isAtRisk ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      ₹{b.projected.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Warning Banner */}
                {isAtRisk && b.warning ? (
                  <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-200 text-xs text-amber-900 font-medium flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{b.warning}</span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>On pace. Projected variance: +₹{b.variance}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Budget Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">Create Category Budget</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monthly Budget Allocation (₹)
                </label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  required
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
                  className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
