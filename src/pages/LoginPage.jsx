import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, ArrowRight, Lock, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useFinance();

  const [email, setEmail] = useState('demo@spendroot.com');
  const [password, setPassword] = useState('Demo@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('Welcome back, Vishal!', 'success');
      navigate('/');
    }, 700);
  };

  const handleQuickFill = () => {
    setEmail('demo@spendroot.com');
    setPassword('Demo@123');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC]">
      {/* Left Panel: Fintech Branding & Abstract Intelligence Visual */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Brand Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Spend<span className="text-teal-400">Root</span>
            </span>
            <span className="block text-[11px] font-semibold text-teal-300 uppercase tracking-widest">
              URAN 2026 • Challenge FT-01
            </span>
          </div>
        </div>

        {/* Product Statement & Graphic */}
        <div className="my-12 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-teal-300 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explainable Behavior & Budget Optimizer</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Understand your spending.<br />
            Change your habits.<br />
            <span className="text-teal-400">Reach your goals.</span>
          </h2>

          <p className="text-sm text-slate-300 max-w-md leading-relaxed">
            Not just another expense tracker. SpendRoot detects spending sequences, explains why budgets are at risk, and simulates the mathematical impact of single habit adjustments.
          </p>

          {/* Minimalist Micro Flow Preview */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-md space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-teal-300 font-bold uppercase tracking-wider text-[10px]">
                Main User Journey
              </span>
              <span className="text-emerald-400 font-mono text-[11px]">Active Loop</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium overflow-x-auto pb-1">
              <span>Transactions</span>
              <ArrowRight className="w-3 h-3 text-teal-400 shrink-0" />
              <span>Pattern</span>
              <ArrowRight className="w-3 h-3 text-teal-400 shrink-0" />
              <span>Why Risk?</span>
              <ArrowRight className="w-3 h-3 text-teal-400 shrink-0" />
              <span>What-If</span>
              <ArrowRight className="w-3 h-3 text-teal-400 shrink-0" />
              <span className="text-teal-300 font-bold">Goal Won</span>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Synthetic FinTech Sandbox • Zero real bank accounts required</span>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full md:w-1/2 p-8 lg:p-14 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sign in with your hackathon demo credentials to review September 2026.
            </p>
          </div>

          {/* Demo Quick-Fill Pill Button */}
          <button
            type="button"
            onClick={handleQuickFill}
            className="w-full p-3 rounded-xl bg-teal-50 border border-teal-200/80 text-left hover:bg-teal-100/60 transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-[11px] uppercase font-bold text-teal-800 block">
                Quick Demo Login Preset
              </span>
              <span className="text-xs font-mono text-teal-700">
                demo@spendroot.com • Demo@123
              </span>
            </div>
            <span className="text-xs font-bold text-teal-700 group-hover:underline">
              Auto-Fill
            </span>
          </button>

          {error && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@spendroot.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 accent-teal-600"
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Use Demo credentials: demo@spendroot.com / Demo@123"); }} className="text-teal-600 hover:underline font-semibold">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-98 rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-teal-600 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
