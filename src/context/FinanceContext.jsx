import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { setToken } from '../services/api';
import {
  INITIAL_USER,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  DETECTED_PATTERNS,
  RECOMMENDATIONS,
  INITIAL_TRANSACTIONS,
  NOTIFICATIONS_LIST,
} from '../services/mockData';

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [token, setAuthToken] = useState(() => localStorage.getItem('spendroot_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('spendroot_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [budgets, setBudgets] = useState(INITIAL_BUDGETS);
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [patterns, setPatterns] = useState(DETECTED_PATTERNS);
  const [recommendations, setRecommendations] = useState(RECOMMENDATIONS);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_LIST);

  const [currentMonth, setCurrentMonth] = useState('September 2026');
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const showToast = useCallback((message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  // Fetch all live data from backend REST APIs
  const fetchBackendData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check backend health
      const health = await api.health();
      if (health && health.success) {
        setIsBackendConnected(true);
      }

      // If user is authenticated, fetch their live data from backend
      if (localStorage.getItem('spendroot_token')) {
        const [txRes, budgetRes, goalRes, insightRes, dashRes] = await Promise.allSettled([
          api.transactions.getAll(),
          api.budgets.getAll(),
          api.goals.getAll(),
          api.insights.getAll(),
          api.dashboard.getSummary(),
        ]);

        if (txRes.status === 'fulfilled' && txRes.value.success) {
          setTransactions(txRes.value.data);
        }
        if (budgetRes.status === 'fulfilled' && budgetRes.value.success) {
          setBudgets(budgetRes.value.data);
        }
        if (goalRes.status === 'fulfilled' && goalRes.value.success) {
          setGoals(goalRes.value.data);
        }
        if (insightRes.status === 'fulfilled' && insightRes.value.success) {
          if (insightRes.value.data.patterns) setPatterns(insightRes.value.data.patterns);
          if (insightRes.value.data.recommendations) setRecommendations(insightRes.value.data.recommendations);
        }
      }
    } catch (err) {
      console.warn('[FinanceContext] Backend connection notice:', err.message);
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize and auto-login demo user on load if token missing
  useEffect(() => {
    async function init() {
      try {
        const health = await api.health();
        if (health && health.success) {
          setIsBackendConnected(true);

          // If no token exists yet, auto-login demo user to establish JWT connection
          if (!localStorage.getItem('spendroot_token')) {
            const loginRes = await api.auth.login('demo@spendroot.com', 'Demo@123');
            if (loginRes && loginRes.success) {
              setToken(loginRes.data.token);
              setAuthToken(loginRes.data.token);
              setUser(loginRes.data.user);
              localStorage.setItem('spendroot_user', JSON.stringify(loginRes.data.user));
            }
          }
        }
      } catch (e) {
        // backend offline, fallback gracefully
      }
      fetchBackendData();
    }
    init();
  }, [fetchBackendData]);

  // Dynamic Calculated Metrics
  const totalIncome = user?.monthlyIncome || user?.monthly_income || 40000;
  
  const totalExpenses = transactions
    .filter(t => t.type === 'Expense' || t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netSavings = Math.max(0, totalIncome - totalExpenses);
  const savingsRate = ((netSavings / totalIncome) * 100).toFixed(1);

  const totalGoalTarget = goals.reduce((sum, g) => sum + (Number(g.targetAmount) || Number(g.target_amount) || 0), 0);
  const totalGoalSaved = goals.reduce((sum, g) => sum + (Number(g.currentAmount) || Number(g.current_amount) || 0), 0);
  const savingsGoalProgress = totalGoalTarget > 0 ? Math.round((totalGoalSaved / totalGoalTarget) * 100) : 68;

  // Actions connecting to REST API
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const res = await api.auth.login(email, password);
      if (res && res.success) {
        setToken(res.data.token);
        setAuthToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('spendroot_user', JSON.stringify(res.data.user));
        setIsBackendConnected(true);
        showToast(`Welcome back, ${res.data.user.name}!`, 'success');
        await fetchBackendData();
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Login failed', 'warning');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem('spendroot_user');
    setUser(INITIAL_USER);
    showToast('Logged out successfully', 'info');
  };

  const addTransaction = async (newTx) => {
    try {
      const res = await api.transactions.create(newTx);
      if (res && res.success) {
        setTransactions(prev => [res.data, ...prev]);
        showToast(`Added ₹${res.data.amount} for ${res.data.merchant} (saved to MySQL)`, 'success');
        fetchBackendData(); // Recalculate budgets and insights via API
        return;
      }
    } catch (e) {
      // Local fallback
      const formatted = {
        ...newTx,
        id: `tx_${Date.now()}`,
        amount: Number(newTx.amount),
        date: newTx.date || new Date().toISOString().split('T')[0],
        status: 'Completed'
      };
      setTransactions(prev => [formatted, ...prev]);
      showToast(`Added ₹${formatted.amount} for ${formatted.merchant}`, 'success');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await api.transactions.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      showToast('Transaction removed', 'info');
      fetchBackendData();
    } catch (e) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      showToast('Transaction removed', 'info');
    }
  };

  const updateBudget = async (budgetId, newBudget) => {
    try {
      await api.budgets.update(budgetId, Number(newBudget));
      showToast('Budget updated in database', 'success');
      fetchBackendData();
    } catch (e) {
      setBudgets(prev => prev.map(b => b.id === budgetId ? { ...b, budget: Number(newBudget) } : b));
      showToast('Budget updated', 'success');
    }
  };

  const addGoalContribution = async (goalId, amount) => {
    try {
      await api.goals.contribute(goalId, Number(amount));
      showToast(`Contributed ₹${Number(amount).toLocaleString('en-IN')}!`, 'success');
      fetchBackendData();
    } catch (e) {
      setGoals(prev => prev.map(g => g.id === goalId ? { ...g, currentAmount: g.currentAmount + Number(amount) } : g));
      showToast(`Contributed ₹${Number(amount).toLocaleString('en-IN')}!`, 'success');
    }
  };

  const importTransactions = async (validRecords) => {
    try {
      const res = await api.importData.importTransactions(validRecords);
      if (res && res.success) {
        showToast(`Imported ${res.stats.importedCount} records to database!`, 'success');
        fetchBackendData();
        return;
      }
    } catch (e) {
      showToast(`Imported ${validRecords.length} records`, 'success');
    }
  };

  const applyRecommendation = async (recId) => {
    try {
      await api.insights.applyRecommendation(recId);
    } catch (e) {
      // silent
    }
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: 'Applied' } : r));
    showToast('Recommendation applied! Financial metrics updated.', 'success');
  };

  const resetToDemoState = async () => {
    localStorage.clear();
    setToken(null);
    setAuthToken(null);
    setUser(INITIAL_USER);
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setGoals(INITIAL_GOALS);
    setPatterns(DETECTED_PATTERNS);
    setRecommendations(RECOMMENDATIONS);
    setNotifications(NOTIFICATIONS_LIST);

    try {
      const loginRes = await api.auth.login('demo@spendroot.com', 'Demo@123');
      if (loginRes && loginRes.success) {
        setToken(loginRes.data.token);
        setAuthToken(loginRes.data.token);
        setUser(loginRes.data.user);
        await fetchBackendData();
      }
    } catch (e) {
      // offline fallback
    }

    showToast('Reset to pristine September 2026 demo state!', 'info');
  };

  return (
    <FinanceContext.Provider
      value={{
        token,
        user,
        transactions,
        budgets,
        goals,
        patterns,
        recommendations,
        notifications,
        currentMonth,
        setCurrentMonth,
        totalIncome,
        totalExpenses,
        netSavings,
        savingsRate,
        savingsGoalProgress,
        toastMessage,
        isLoading,
        isBackendConnected,
        showToast,
        login,
        logout,
        addTransaction,
        deleteTransaction,
        updateBudget,
        addGoalContribution,
        importTransactions,
        applyRecommendation,
        resetToDemoState,
        refreshData: fetchBackendData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
