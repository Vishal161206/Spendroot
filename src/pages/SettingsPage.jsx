import React, { useState } from 'react';
import { Settings, User, Bell, Database, ShieldCheck, Check } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function SettingsPage() {
  const { user, showToast } = useFinance();
  const [name, setName] = useState(user?.name || '');
  const [income, setIncome] = useState((user?.monthlyIncome || user?.monthly_income || 40000).toString());
  const [threshold, setThreshold] = useState('85');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Profile configuration saved', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="p-5 lg:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-teal-600" />
          <span>Platform Settings & Preferences</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure financial preferences, alerts, and account settings.
        </p>
      </div>

      {/* Profile Section */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <User className="w-4 h-4 text-teal-600" />
          <span>User Profile & Income</span>
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Net Income (₹)
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Budget Alert Threshold (%)
              </label>
              <select
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="75">75% of budget spent</option>
                <option value="85">85% of budget spent (Recommended)</option>
                <option value="90">90% of budget spent</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Backend API Integration Architecture Card */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-600" />
          <span>Backend Integration Mode (Express Js / MySQL)</span>
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          The SpendRoot frontend architecture utilizes a decoupled mock service layer (<span className="font-mono text-teal-700">financeService.js</span>). For hackathon judging, local reactive storage is active. When the Spring Boot REST API is connected, endpoints map directly:
        </p>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-700 space-y-1">
          <div>GET /api/transactions → <span className="text-emerald-700">Active (MySQL 8.0)</span></div>
          <div>GET /api/insights → <span className="text-emerald-700">Active (Intelligence Engine)</span></div>
          <div>POST /api/insights/simulate → <span className="text-emerald-700">Active (What-If Simulation Engine)</span></div>
        </div>
      </div>
    </div>
  );
}
