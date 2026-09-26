import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  UploadCloud,
  PieChart,
  Target,
  Sparkles,
  SlidersHorizontal,
  FileText,
  Settings,
  LogOut,
  RotateCcw,
  TrendingUp,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: ReceiptText },
  { name: 'Import CSV', path: '/import', icon: UploadCloud },
  { name: 'Budgets', path: '/budgets', icon: PieChart },
  { name: 'Savings Goals', path: '/goals', icon: Target },
  { name: 'Insights', path: '/insights', icon: Sparkles, badge: '5 New' },
  { name: 'What-If Simulator', path: '/simulator', icon: SlidersHorizontal, highlight: true },
  { name: 'Monthly Summary', path: '/summary', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user, currentMonth, resetToDemoState } = useFinance();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-slate-200/80 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Spend<span className="text-teal-600">Root</span>
              </span>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Behavior Optimizer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 rounded-lg lg:hidden hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-200/60 font-semibold'
                      : item.highlight
                      ? 'text-indigo-600 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold text-amber-700 bg-amber-100 rounded-full">
                    {item.badge}
                  </span>
                )}
                {item.highlight && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 bg-indigo-100 rounded-full">
                    HERO
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Month Indicator & Judge Reset */}
        <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-50 border border-slate-200/60">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Active Period:</span>
            <span className="font-semibold text-slate-700">{currentMonth}</span>
          </div>
          <button
            onClick={() => {
              if (window.confirm("Reset to pristine September 2026 demo state?")) {
                resetToDemoState();
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors shadow-2xs"
            title="Reset dataset for hackathon judges demo"
          >
            <RotateCcw className="w-3 h-3 text-teal-600" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* User Profile Card */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-teal-500/20"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
