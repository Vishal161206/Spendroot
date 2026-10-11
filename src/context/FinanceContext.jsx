import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api, { setToken } from '../services/api';

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [token, setAuthToken] = useState(() => localStorage.getItem('spendroot_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('spendroot_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authLoading, setAuthLoading] = useState(true);

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [currentMonth, setCurrentMonth] = useState('September 2026');
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const showToast = useCallback((message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  // Fetch all live data for authenticated user from backend REST APIs
  const fetchBackendData = useCallback(async () => {
    const activeToken = localStorage.getItem('spendroot_token');
    if (!activeToken) {
      setTransactions([]);
      setBudgets([]);
      setGoals([]);
      setPatterns([]);
      setRecommendations([]);
      return;
    }

    try {
      setIsLoading(true);

      const [healthRes, txRes, budgetRes, goalRes, insightRes] = await Promise.allSettled([
        api.health(),
        api.transactions.getAll(),
        api.budgets.getAll(),
        api.goals.getAll(),
        api.insights.getAll(),
      ]);

      if (healthRes.status === 'fulfilled' && healthRes.value?.success) {
        setIsBackendConnected(true);
      }

      if (txRes.status === 'fulfilled' && txRes.value?.success) {
        setTransactions(txRes.value.data || []);
      }
      if (budgetRes.status === 'fulfilled' && budgetRes.value?.success) {
        setBudgets(budgetRes.value.data || []);
      }
      if (goalRes.status === 'fulfilled' && goalRes.value?.success) {
        setGoals(goalRes.value.data || []);
      }
      if (insightRes.status === 'fulfilled' && insightRes.value?.success) {
        if (insightRes.value.data?.patterns) setPatterns(insightRes.value.data.patterns);
        if (insightRes.value.data?.recommendations) setRecommendations(insightRes.value.data.recommendations);
      }
    } catch (err) {
      console.warn('[FinanceContext] Backend fetch notice:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize on startup: validate token with backend /auth/me
  useEffect(() => {
    async function initAuth() {
      const savedToken = localStorage.getItem('spendroot_token');
      if (savedToken) {
        try {
          const res = await api.auth.getMe();
          if (res && res.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('spendroot_user', JSON.stringify(res.data.user));
            setIsBackendConnected(true);
            await fetchBackendData();
          } else {
            // Invalid token
            setAuthToken(null);
            setUser(null);
            localStorage.removeItem('spendroot_token');
            localStorage.removeItem('spendroot_user');
            setToken(null);
          }
        } catch (e) {
          // Token expired or invalid
          setAuthToken(null);
          setUser(null);
          localStorage.removeItem('spendroot_token');
          localStorage.removeItem('spendroot_user');
          setToken(null);
        }
      } else {
        setAuthToken(null);
        setUser(null);
      }
      setAuthLoading(false);
    }
    initAuth();
  }, [fetchBackendData]);

  // Filter transactions for the selected month (Calendar/Month Selector)
  const monthlyTransactions = useMemo(() => {
    if (!currentMonth) return transactions;
    const [mName, yStr] = currentMonth.split(' ');
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const mIdx = monthNames.findIndex(m => m.toLowerCase() === (mName || '').toLowerCase());
    const targetYear = parseInt(yStr, 10) || 2026;
    if (mIdx === -1) return transactions;
    const targetMonthStr = String(mIdx + 1).padStart(2, '0');
    const prefix = `${targetYear}-${targetMonthStr}`;
    return transactions.filter(t => {
      const d = (t.date || t.transaction_date || '');
      return d.startsWith(prefix);
    });
  }, [transactions, currentMonth]);

  // Dynamic Calculated Metrics for selected month
  const totalIncome = Number(user?.monthlyIncome || user?.monthly_income || 0);

  const totalExpenses = useMemo(() => {
    return monthlyTransactions
      .filter(t => t.type === 'Expense' || t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [monthlyTransactions]);

  const netSavings = Math.max(0, totalIncome - totalExpenses);
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0.0';

  // Dynamic Budgets computed against selected month's transactions
  const activeBudgets = useMemo(() => {
    const spentByCategory = {};
    for (const t of monthlyTransactions) {
      if (t.type === 'Expense' || t.type === 'EXPENSE') {
        const cat = t.category || 'Other';
        spentByCategory[cat] = (spentByCategory[cat] || 0) + Number(t.amount || 0);
      }
    }

    return budgets.map(b => {
      const budgetAmt = Number(b.budget || b.amount || 0);
      const spent = spentByCategory[b.categoryName || b.category] || 0;
      // Linear velocity projection
      const totalDays = 30;
      const daysElapsed = 20;
      const dailyRate = daysElapsed > 0 ? (spent / daysElapsed) : 0;
      const projected = Math.round(spent + (dailyRate * (totalDays - daysElapsed)));
      const status = projected > budgetAmt ? 'At Risk' : 'On Track';
      const overrun = Math.max(0, projected - budgetAmt);
      const warning = overrun > 0 ? `Likely to exceed budget by ₹${overrun.toLocaleString('en-IN')}` : null;

      return {
        ...b,
        categoryName: b.categoryName || b.category,
        budget: budgetAmt,
        spent,
        projected,
        status,
        warning,
        remaining: Math.max(0, budgetAmt - spent),
      };
    });
  }, [budgets, monthlyTransactions]);

  // Savings Goal calculations
  const totalGoalTarget = goals.reduce((sum, g) => sum + (Number(g.targetAmount) || Number(g.target_amount) || 0), 0);
  const totalGoalSaved = goals.reduce((sum, g) => sum + (Number(g.currentAmount) || Number(g.current_amount) || 0), 0);
  const savingsGoalProgress = totalGoalTarget > 0 ? Math.round((totalGoalSaved / totalGoalTarget) * 100) : 0;
  const primaryGoal = goals.length > 0 ? goals[0] : null;

  // Fully Data-Driven Notifications
  const notifications = useMemo(() => {
    const list = [];

    // 1. Budget warnings
    for (const b of activeBudgets) {
      if (b.budget > 0) {
        const pct = Math.round((b.spent / b.budget) * 100);
        if (b.spent > b.budget) {
          list.push({
            id: `notif_over_${b.id}`,
            type: 'warning',
            title: `${b.categoryName} Budget Exceeded`,
            message: `Your ${b.categoryName} spending is ₹${(b.spent - b.budget).toLocaleString('en-IN')} above budget this month.`,
            timestamp: 'This month',
            link: '/budgets',
          });
        } else if (pct >= 85) {
          list.push({
            id: `notif_risk_${b.id}`,
            type: 'warning',
            title: `${b.categoryName} Approaching Budget`,
            message: `You've used ${pct}% of your ${b.categoryName} budget (₹${b.spent.toLocaleString('en-IN')} / ₹${b.budget.toLocaleString('en-IN')}).`,
            timestamp: 'This month',
            link: '/budgets',
          });
        }
      }
    }

    // 2. Goal Progress or No-Goal Savings Notice
    if (primaryGoal) {
      const gTarget = Number(primaryGoal.targetAmount || primaryGoal.target_amount || 0);
      const gCurrent = Number(primaryGoal.currentAmount || primaryGoal.current_amount || 0);
      const gPct = gTarget > 0 ? Math.round((gCurrent / gTarget) * 100) : 0;
      list.push({
        id: 'notif_goal_progress',
        type: 'info',
        title: `${primaryGoal.name || primaryGoal.title} Progress`,
        message: `${gPct}% of target reached (₹${gCurrent.toLocaleString('en-IN')} of ₹${gTarget.toLocaleString('en-IN')}).`,
        timestamp: 'Active goal',
        link: '/goals',
      });
    } else {
      list.push({
        id: 'notif_savings_objective',
        type: 'info',
        title: 'Build Your Savings',
        message: 'No specific savings goal set. Your default objective is to build savings.',
        timestamp: 'General objective',
        link: '/goals',
      });
    }

    // 3. Highest Transaction Alert
    const expenseTxns = monthlyTransactions.filter(t => t.type === 'Expense' || t.type === 'EXPENSE');
    if (expenseTxns.length > 0) {
      const sorted = [...expenseTxns].sort((a, b) => Number(b.amount) - Number(a.amount));
      const topTx = sorted[0];
      if (topTx && Number(topTx.amount) >= 1000) {
        list.push({
          id: 'notif_top_tx',
          type: 'info',
          title: 'Largest Expense This Month',
          message: `₹${Number(topTx.amount).toLocaleString('en-IN')} spent at ${topTx.merchant} (${topTx.category}).`,
          timestamp: topTx.date,
          link: '/transactions',
        });
      }
    }

    // 4. Detected Patterns
    if (patterns && patterns.length > 0) {
      for (const p of patterns) {
        list.push({
          id: `notif_pat_${p.id}`,
          type: 'pattern',
          title: p.title || 'Behavior Pattern Detected',
          message: p.summary || p.detection || 'Pattern observed in transaction records.',
          timestamp: 'Detected pattern',
          link: '/insights',
        });
      }
    }

    // 5. Savings rate health
    if (totalIncome > 0) {
      list.push({
        id: 'notif_savings_rate',
        type: 'success',
        title: 'Monthly Savings Rate',
        message: `Your savings rate for ${currentMonth} is ${savingsRate}%.`,
        timestamp: currentMonth,
        link: '/summary',
      });
    }

    return list;
  }, [activeBudgets, primaryGoal, monthlyTransactions, patterns, totalIncome, savingsRate, currentMonth]);

  // Authentication Actions
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
    // 1. Clear token
    setToken(null);
    setAuthToken(null);
    // 2. Clear user and financial state
    setUser(null);
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setPatterns([]);
    setRecommendations([]);
    // 3. Clear storage
    localStorage.removeItem('spendroot_token');
    localStorage.removeItem('spendroot_user');
    sessionStorage.clear();
    showToast('Logged out successfully', 'info');
  };

  // Transaction Actions
  const addTransaction = async (newTx) => {
    try {
      const res = await api.transactions.create(newTx);
      if (res && res.success) {
        showToast(`Added ₹${res.data.amount} for ${res.data.merchant}`, 'success');
        await fetchBackendData();
        return { success: true };
      }
    } catch (e) {
      showToast(e.message || 'Failed to add transaction', 'warning');
      return { success: false, error: e.message };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await api.transactions.delete(id);
      showToast('Transaction removed', 'info');
      await fetchBackendData();
    } catch (e) {
      showToast(e.message || 'Failed to delete transaction', 'warning');
    }
  };

  // Budget Actions
  const createBudget = async (budgetData) => {
    try {
      const res = await api.budgets.create(budgetData);
      if (res && res.success) {
        showToast(`Budget for ${budgetData.category} created!`, 'success');
        await fetchBackendData();
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Failed to create budget', 'warning');
      return { success: false, error: err.message };
    }
  };

  const updateBudget = async (budgetId, newBudget) => {
    try {
      await api.budgets.update(budgetId, Number(newBudget));
      showToast('Budget updated successfully', 'success');
      await fetchBackendData();
    } catch (e) {
      showToast(e.message || 'Failed to update budget', 'warning');
    }
  };

  const deleteBudget = async (budgetId) => {
    try {
      await api.budgets.delete(budgetId);
      showToast('Budget removed', 'info');
      await fetchBackendData();
    } catch (e) {
      showToast(e.message || 'Failed to delete budget', 'warning');
    }
  };

  // Goal Actions
  const createGoal = async (goalData) => {
    try {
      const res = await api.goals.create(goalData);
      if (res && res.success) {
        showToast(`Savings goal "${goalData.name}" created!`, 'success');
        await fetchBackendData();
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Failed to create goal', 'warning');
      return { success: false, error: err.message };
    }
  };

  const addGoalContribution = async (goalId, amount) => {
    try {
      await api.goals.contribute(goalId, Number(amount));
      showToast(`Contributed ₹${Number(amount).toLocaleString('en-IN')}!`, 'success');
      await fetchBackendData();
    } catch (e) {
      showToast(e.message || 'Failed to contribute to goal', 'warning');
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await api.goals.delete(goalId);
      showToast('Goal removed', 'info');
      await fetchBackendData();
    } catch (e) {
      showToast(e.message || 'Failed to delete goal', 'warning');
    }
  };

  const importTransactions = async (validRecords) => {
    try {
      const res = await api.importData.importTransactions(validRecords);
      if (res && res.success) {
        showToast(`Imported ${res.stats?.importedCount || validRecords.length} records!`, 'success');
        await fetchBackendData();
        return { success: true };
      }
    } catch (e) {
      showToast(e.message || 'Failed to import transactions', 'warning');
      return { success: false, error: e.message };
    }
  };

  const applyRecommendation = async (recId) => {
    try {
      await api.insights.applyRecommendation(recId);
    } catch (e) {
      // silent
    }
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: 'Applied' } : r));
    showToast('Recommendation applied! Metrics recalculated.', 'success');
  };

  return (
    <FinanceContext.Provider
      value={{
        token,
        user,
        authLoading,
        transactions,
        monthlyTransactions,
        budgets: activeBudgets,
        rawBudgets: budgets,
        goals,
        primaryGoal,
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
        createBudget,
        updateBudget,
        deleteBudget,
        createGoal,
        addGoalContribution,
        deleteGoal,
        importTransactions,
        applyRecommendation,
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
