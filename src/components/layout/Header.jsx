import React, { useState } from 'react';
import { Menu, Bell, Plus, Calendar, CheckCircle2, AlertTriangle, Sparkles, ChevronDown } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useNavigate } from 'react-router-dom';

export default function Header({ onMenuClick, onOpenAddTxModal }) {
  const { user, currentMonth, setCurrentMonth, notifications } = useFinance();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3.5 bg-white/90 backdrop-blur-md border-b border-slate-200/80 lg:px-8">
      {/* Left: Mobile Menu & Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 text-slate-500 rounded-xl lg:hidden hover:bg-slate-100 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg lg:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
            Good morning, {user.name} <span className="inline-block animate-pulse">👋</span>
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            Here is your financial picture for {currentMonth}.
          </p>
        </div>
      </div>

      {/* Right: Actions, Month Picker & Notifications */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Month Selector */}
        <div className="relative hidden md:flex items-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-200/80 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>{currentMonth}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* Quick Add Transaction Button */}
        <button
          onClick={onOpenAddTxModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-lg shadow-sm shadow-teal-600/20 hover:bg-teal-700 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 z-50 w-80 sm:w-96 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Alerts & Behavior Signals</h4>
                  <span className="px-2 py-0.5 text-[10px] font-bold text-teal-700 bg-teal-100 rounded-full">
                    {unreadCount} active
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setShowNotifications(false);
                      if (n.link) navigate(n.link);
                    }}
                    className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 shrink-0">
                        {n.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        ) : n.type === 'pattern' ? (
                          <Sparkles className="w-4 h-4 text-indigo-500" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-teal-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/insights');
                  }}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                >
                  View All Intelligence Insights →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Mini Avatar */}
        <div className="flex items-center pl-2 border-l border-slate-200">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
          />
        </div>
      </div>
    </header>
  );
}
