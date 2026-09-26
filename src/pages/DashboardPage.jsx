import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, SlidersHorizontal, Plus } from 'lucide-react';
import SummaryCards from '../components/dashboard/SummaryCards';
import PatternAlertCard from '../components/dashboard/PatternAlertCard';
import RecommendationHeroCard from '../components/dashboard/RecommendationHeroCard';
import BudgetHealthSection from '../components/dashboard/BudgetHealthSection';
import AnalyticsCharts from '../components/dashboard/AnalyticsCharts';
import EvidenceModal from '../components/common/EvidenceModal';
import AddTransactionModal from '../components/common/AddTransactionModal';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top 4 Summary Cards */}
      <SummaryCards />

      {/* Hero Intelligence Row: Pattern Detected + Recommended Action */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Behavior Intelligence & Budget Optimization
            </h2>
          </div>
          <button
            onClick={() => navigate('/insights')}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>View All Insights</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PatternAlertCard onOpenEvidence={() => setIsEvidenceOpen(true)} />
          <RecommendationHeroCard onOpenEvidence={() => setIsEvidenceOpen(true)} />
        </div>
      </div>

      {/* Budget Health Section */}
      <BudgetHealthSection onSelectCategory={(cat) => navigate('/budgets')} />

      {/* Interactive Spending Analytics Charts */}
      <AnalyticsCharts />

      {/* Quick Callout to What-If Simulator Banner */}
      <div className="p-5 lg:p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-teal-900 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-teal-400/20 text-teal-300 rounded-full border border-teal-400/30 mb-2">
            Hero Differentiator
          </span>
          <h3 className="text-lg lg:text-xl font-bold">
            What happens if I change one habit?
          </h3>
          <p className="text-xs lg:text-sm text-indigo-200 mt-1 max-w-xl">
            Test cutting late-evening deliveries or pausing idle streaming plans. See instant mathematical recalculations of your monthly expenses, savings rate, and goal finish dates.
          </p>
        </div>
        <button
          onClick={() => navigate('/simulator')}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-md transition-all active:scale-95 shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4 text-teal-700" />
          <span>Launch What-If Simulator</span>
        </button>
      </div>

      {/* Modals */}
      <EvidenceModal
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        onSimulate={() => navigate('/simulator')}
      />

      <AddTransactionModal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
      />
    </div>
  );
}
