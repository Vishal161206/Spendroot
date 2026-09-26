import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  ArrowUpDown,
  CreditCard,
  QrCode,
  Building,
  CheckCircle,
  Receipt,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Tv,
  Home,
  HeartPulse,
  Repeat,
  IndianRupee,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import AddTransactionModal from '../components/common/AddTransactionModal';

export default function TransactionsPage() {
  const { transactions, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter & Search Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.note && t.note.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const matchMode = selectedPaymentMode === 'All' || t.paymentMode === selectedPaymentMode;
      const matchType = selectedType === 'All' || t.type === selectedType;

      return matchSearch && matchCategory && matchMode && matchType;
    }).sort((a, b) => {
      if (sortField === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      }
      if (sortField === 'amount') {
        return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
      return 0;
    });
  }, [transactions, searchTerm, selectedCategory, selectedPaymentMode, selectedType, sortField, sortOrder]);

  const handleExportCSV = () => {
    const headers = ['Date', 'Time', 'Merchant', 'Category', 'Amount', 'PaymentMode', 'Type', 'Status', 'Note'];
    const rows = filteredTransactions.map(t => [
      t.date,
      t.time || '',
      `"${t.merchant.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.amount,
      t.paymentMode,
      t.type,
      t.status,
      `"${(t.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SpendRoot_Transactions_Sept2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Food & Dining':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Transport':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Shopping':
        return 'bg-pink-50 text-pink-800 border-pink-200';
      case 'Subscriptions':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Utilities & Rent':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Healthcare':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'Income':
        return 'bg-teal-50 text-teal-800 border-teal-200 font-bold';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search & Primary Actions */}
      <div className="p-5 lg:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-teal-600" />
              <span>Transaction Records</span>
            </h1>
            <p className="text-xs text-slate-500">
              Verified financial transactions ledger with automatic category classification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search merchant, tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="All">All Categories</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Subscriptions">Subscriptions</option>
              <option value="Utilities & Rent">Utilities & Rent</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Income">Income</option>
            </select>
          </div>

          {/* Payment Mode */}
          <div>
            <select
              value={selectedPaymentMode}
              onChange={(e) => setSelectedPaymentMode(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="All">All Payment Modes</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          {/* Income vs Expense */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="All">All Types (Income & Expense)</option>
              <option value="Expense">Expense Only</option>
              <option value="Income">Income Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th
                  onClick={() => {
                    setSortField('date');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1">
                    <span>Date & Time</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Merchant / Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Type</th>
                <th
                  onClick={() => {
                    setSortField('amount');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Amount</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    No transactions match your search/filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Date */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block">{t.date}</span>
                      {t.time && <span className="text-[10px] text-slate-400">{t.time}</span>}
                    </td>

                    {/* Merchant */}
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>
                        <span>{t.merchant}</span>
                        {t.note && (
                          <span className="block text-[11px] font-normal text-slate-400">
                            {t.note}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full border ${getCategoryBadgeColor(t.category)}`}>
                        {t.category}
                      </span>
                    </td>

                    {/* Payment Mode */}
                    <td className="py-3 px-4 text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        {t.paymentMode === 'UPI' && <QrCode className="w-3 h-3 text-teal-600" />}
                        {t.paymentMode === 'Card' && <CreditCard className="w-3 h-3 text-blue-600" />}
                        {t.paymentMode === 'Bank Transfer' && <Building className="w-3 h-3 text-purple-600" />}
                        <span>{t.paymentMode}</span>
                      </span>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-semibold ${
                          t.type === 'Income' ? 'text-teal-700' : 'text-slate-600'
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right whitespace-nowrap font-mono font-bold">
                      <span className={t.type === 'Income' ? 'text-teal-600' : 'text-slate-900'}>
                        {t.type === 'Income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-2.5 h-2.5" />
                        {t.status}
                      </span>
                    </td>

                    {/* Delete Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Count */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredTransactions.length} of {transactions.length} records</span>
          <span className="font-medium text-slate-700">
            Total Spent Shown: ₹
            {filteredTransactions
              .filter((t) => t.type === 'Expense')
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
