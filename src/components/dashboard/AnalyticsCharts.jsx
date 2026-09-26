import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { MONTHLY_ANALYTICS_DATA, WEEKLY_SPENDING_DATA } from '../../services/mockData';
import { useFinance } from '../../context/FinanceContext';

const PIE_COLORS = ['#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6', '#10B981', '#06B6D4', '#6366F1'];

export default function AnalyticsCharts() {
  const { budgets } = useFinance();
  const [activeTab, setActiveTab] = useState('monthly'); // 'monthly' | 'trend'

  // Prepare Category Donut Data
  const categoryData = budgets.map((b) => ({
    name: b.categoryName,
    value: b.spent,
    budget: b.budget,
  }));

  // Prepare Budget vs Actual Data
  const budgetVsActualData = budgets.map((b) => ({
    name: b.categoryName.split(' ')[0],
    Budget: b.budget,
    Actual: b.spent,
    Projected: b.projected,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart 1: Income vs Expense & Spending Trend (2 cols on large) */}
      <div className="lg:col-span-2 p-5 lg:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {activeTab === 'monthly' ? 'Monthly Income vs Expense' : 'Weekly Velocity Trend'}
            </h3>
            <p className="text-xs text-slate-500">
              {activeTab === 'monthly'
                ? '6-Month comparison showing net savings buffer'
                : 'Spending pace across September weeks against target'}
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'monthly'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Income vs Expense
            </button>
            <button
              onClick={() => setActiveTab('trend')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'trend'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Weekly Trend
            </button>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'monthly' ? (
              <BarChart data={MONTHLY_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="income" name="Income" fill="#10B981" radius={[6, 6, 0, 0]} barSize={18} />
                <Bar dataKey="expense" name="Expenses" fill="#0D9488" radius={[6, 6, 0, 0]} barSize={18} />
              </BarChart>
            ) : (
              <LineChart data={WEEKLY_SPENDING_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="actual" name="Actual Spend" stroke="#0D9488" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="projected" name="Projected Velocity" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="target" name="Weekly Target" stroke="#94A3B8" strokeWidth={2} strokeDasharray="3 3" dot={false} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Category Spending Donut Chart */}
      <div className="p-5 lg:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Category Breakdown</h3>
          <p className="text-xs text-slate-500 mb-2">Spending proportion for September</p>
        </div>

        <div className="h-52 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Spent']}
                contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Centered Total Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total</span>
            <span className="text-sm font-bold text-slate-800 font-mono">
              ₹{budgets.reduce((s, b) => s + b.spent, 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Legend pills */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          {categoryData.slice(0, 4).map((c, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
              <span className="text-slate-600 truncate">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
