import React from 'react';
import { X, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export default function EvidenceModal({ isOpen, onClose, onSimulate }) {
  const { patterns, currentMonth } = useFinance();
  if (!isOpen) return null;

  const pattern = patterns && patterns.length > 0 ? patterns[0] : null;

  if (!pattern) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Pattern Evidence</h3>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-600">
            No active sequence spending patterns detected for {currentMonth}. As you record commute and food transactions, the temporal correlation engine will trace observable sequences here.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const evidenceItems = pattern.evidenceItems || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Explainable Pattern Evidence</h3>
              <p className="text-xs text-slate-500">Algorithmic sequence trace behind recommended optimization.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Correlation Found
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold text-slate-700 bg-white rounded-md border border-slate-200">
                Confidence: {pattern.confidence || 92}%
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {pattern.title}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {pattern.explanation || pattern.summary}
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center">
              <div>
                <p className="text-[11px] text-slate-400">Total Occurrences</p>
                <p className="text-sm font-bold text-slate-800">{pattern.occurrencesCount || 0} times</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Avg Cost / Sequence</p>
                <p className="text-sm font-bold text-slate-800">₹{(pattern.averageSequenceCost || 0).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Avoidable Impact</p>
                <p className="text-sm font-bold text-rose-600">₹{(pattern.monthlyAvoidableImpact || 0).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Sequence Timeline */}
          {evidenceItems.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Observed Chronological Sequences ({currentMonth})
              </h4>
              <div className="space-y-2.5">
                {evidenceItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-teal-300 transition-colors shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-slate-700">{item.date}</span>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3" />
                        +{item.diffMinutes} mins delta
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex-1 p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-blue-600">Trigger Event</p>
                        <p className="font-semibold text-slate-800">{item.trigger}</p>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                      <div className="flex-1 p-2 rounded-lg bg-amber-50/70 border border-amber-100">
                        <p className="text-[10px] uppercase font-bold text-amber-700">Follow-up Event</p>
                        <p className="font-semibold text-slate-800">{item.followUp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Prompt */}
          <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-teal-800">Actionable Habit Change</p>
              <p className="text-xs text-teal-700 mt-0.5">
                Explore What-If simulations to test reducing these sequences.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                if (onSimulate) onSimulate();
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm active:scale-95 transition-all shrink-0"
            >
              Simulate in What-If
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            Verified explainable pattern logic from database
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-medium text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
