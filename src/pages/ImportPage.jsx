import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  Download,
  Filter,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { MOCK_CSV_IMPORT_RECORDS } from '../services/mockData';
import { parseCsvContent } from '../services/csvParser';

export default function ImportPage() {
  const navigate = useNavigate();
  const { transactions, importTransactions } = useFinance();

  const [records, setRecords] = useState(MOCK_CSV_IMPORT_RECORDS);
  const [stats, setStats] = useState({
    total: 147,
    valid: 141,
    duplicate: 4,
    incomplete: 2,
  });
  const [filterTab, setFilterTab] = useState('All'); // 'All' | 'Valid' | 'Issues'
  const [isImported, setIsImported] = useState(false);

  // File drop handler
  const handleFileUpload = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const res = parseCsvContent(text, transactions);
      if (res.success) {
        setRecords(res.records);
        setStats(res.stats);
        setIsImported(false);
      }
    };
    reader.readAsText(file);
  };

  // Allow manual category correction
  const handleCategoryOverride = (rowIndex, newCat) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.row === rowIndex
          ? { ...r, detectedCategory: newCat, confidence: 100 }
          : r
      )
    );
  };

  // Final confirmation to merge into live transactions
  const handleImportValid = () => {
    const validOnes = records.filter((r) => r.status === 'Valid');
    importTransactions(validOnes);
    setIsImported(true);
  };

  const filteredRecords = records.filter((r) => {
    if (filterTab === 'Valid') return r.status === 'Valid';
    if (filterTab === 'Issues') return r.status === 'Duplicate' || r.status === 'Incomplete';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 lg:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-teal-600" />
          <span>Statement Import & ML Categorization</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload banking or UPI statement CSVs. The engine automatically inspects anomalies, validates rows, and classifies expenses with confidence scores.
        </p>
      </div>

      {/* Upload Drag & Drop Area */}
      <div className="p-8 bg-white rounded-2xl border-2 border-dashed border-teal-300 hover:border-teal-500 transition-colors text-center group">
        <input
          type="file"
          id="csvFileInput"
          accept=".csv,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label
          htmlFor="csvFileInput"
          className="cursor-pointer flex flex-col items-center justify-center space-y-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              Drop your transaction CSV here, or <span className="text-teal-600 underline">Browse Files</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports HDFC, ICICI, SBI, Axis, GPay, and standard FinTech CSV exports.
            </p>
          </div>
        </label>
      </div>

      {/* Detection & Validation Summary Bar */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Audit Pipeline Status
            </span>
            <div className="flex flex-wrap items-center gap-2.5 mt-1">
              <span className="text-lg font-extrabold text-slate-900 font-mono">
                {stats.total} transactions detected
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {stats.valid} valid
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold text-amber-800 bg-amber-100 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" />
                {stats.duplicate} duplicates
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold text-rose-800 bg-rose-100 rounded-full">
                <AlertOctagon className="w-3.5 h-3.5" />
                {stats.incomplete} incomplete
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setFilterTab('Issues')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Review Issues ({stats.duplicate + stats.incomplete})
            </button>
            <button
              onClick={handleImportValid}
              disabled={isImported}
              className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 ${
                isImported
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
              }`}
            >
              {isImported ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Imported Successfully</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Import Valid Records ({stats.valid})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {isImported && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
            <span>
              ✓ Records merged into active ledger. Budgets and velocity forecasts updated.
            </span>
            <button
              onClick={() => navigate('/transactions')}
              className="font-bold underline ml-2"
            >
              View in Ledger →
            </button>
          </div>
        )}
      </div>

      {/* Automatic Categorization Review & Confidence Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header with Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Automatic Categorization & Anomaly Validation
            </h3>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium">
            {['All', 'Valid', 'Issues'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterTab === tab
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab} ({tab === 'All' ? records.length : tab === 'Valid' ? stats.valid : stats.duplicate + stats.incomplete})
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Row</th>
                <th className="py-3 px-4">Merchant Name</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Detected Category</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Issue Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r, i) => (
                <tr
                  key={r.row}
                  className={`hover:bg-slate-50/60 transition-colors ${
                    r.status === 'Duplicate'
                      ? 'bg-amber-50/30'
                      : r.status === 'Incomplete'
                      ? 'bg-rose-50/30'
                      : ''
                  }`}
                >
                  <td className="py-3 px-4 font-mono text-slate-400">#{r.row}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{r.merchant}</td>
                  <td className="py-3 px-4 text-slate-600">{r.date}</td>

                  {/* Category with Inline Correction */}
                  <td className="py-3 px-4">
                    <select
                      value={r.detectedCategory}
                      onChange={(e) => handleCategoryOverride(r.row, e.target.value)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Food & Dining">Food & Dining</option>
                      <option value="Transport">Transport</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Subscriptions">Subscriptions</option>
                      <option value="Utilities & Rent">Utilities & Rent</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Uncategorized">Uncategorized</option>
                    </select>
                  </td>

                  {/* Confidence Pill */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.confidence >= 95
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.confidence >= 85
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.confidence}%
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    ₹{r.amount.toLocaleString('en-IN')}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'Valid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : r.status === 'Duplicate'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {r.status === 'Valid' ? '✓ Valid' : r.status === 'Duplicate' ? '⚠ Duplicate' : '✕ Incomplete'}
                    </span>
                  </td>

                  {/* Issue */}
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {r.issue ? (
                      <span className="text-amber-700 font-medium">{r.issue}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
