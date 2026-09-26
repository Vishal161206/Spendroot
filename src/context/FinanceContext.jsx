import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USER,
  INITIAL_CATEGORIES,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  DETECTED_PATTERNS,
  RECOMMENDATIONS,
  INITIAL_TRANSACTIONS,
  NOTIFICATIONS_LIST,
} from '../services/mockData';
import { calculateBudgetVelocity, autoCategorizeMerchant } from '../services/intelligenceEngine';

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  // Initialize from LocalStorage or fall back to defaults
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('spendroot_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('spendroot_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('spendroot_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('spendroot_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [patterns, setPatterns] = useState(() => {
    const saved = localStorage.getItem('spendroot_patterns');
    return saved ? JSON.parse(saved) : DETECTED_PATTERNS;
  });

  const [recommendations, setRecommendations] = useState(() => {
    const saved = localStorage.getItem('spendroot_recommendations');
    return saved ? JSON.parse(saved) : RECOMMENDATIONS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('spendroot_notifications');
    return saved ? JSON.parse(saved) : NOTIFICATIONS_LIST;
  });

  const [currentMonth, setCurrentMonth] = useState("September 2026");
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('spendroot_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('spendroot_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('spendroot_goals', JSON.stringify(goals));
  }, [goals]);

  // Toast helper
  const showToast = (message, type = "info") => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Recalculate dynamic KPIs from transactions
  const totalIncome = user.monthlyIncome || 40000;
  
  // Expenses calculated from transaction ledger
  const totalExpenses = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netSavings = Math.max(0, totalIncome - totalExpenses);
  const savingsRate = ((netSavings / totalIncome) * 100).toFixed(1);

  // Savings goal blended progress
  const totalGoalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalGoalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const savingsGoalProgress = totalGoalTarget > 0 ? Math.round((totalGoalSaved / totalGoalTarget) * 100) : 68;

  // Add Transaction
  const addTransaction = (newTx) => {
    const categorized = newTx.category 
      ? newTx.category 
      : autoCategorizeMerchant(newTx.merchant).category;

    const formattedTx = {
      ...newTx,
      id: `tx_${Date.now()}`,
      category: categorized,
      amount: Number(newTx.amount),
      status: "Completed",
      date: newTx.date || new Date().toISOString().split('T')[0],
      time: newTx.time || "12:00",
    };

    setTransactions(prev => [formattedTx, ...prev]);

    // Update relevant budget
    setBudgets(prevBudgets => prevBudgets.map(b => {
      if (b.categoryName.toLowerCase().includes(categorized.toLowerCase()) || categorized.toLowerCase().includes(b.categoryName.toLowerCase())) {
        const newSpent = b.spent + formattedTx.amount;
        const velocity = calculateBudgetVelocity(newSpent, b.budget, user.daysElapsed, user.totalDaysInMonth);
        return {
          ...b,
          spent: newSpent,
          projected: velocity.projected,
          variance: velocity.variance,
          status: velocity.status,
          warning: velocity.warning,
        };
      }
      return b;
    }));

    showToast(`Added ₹${formattedTx.amount} for ${formattedTx.merchant}`, "success");
  };

  // Delete Transaction
  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast("Transaction removed", "info");
  };

  // Update Budget
  const updateBudget = (budgetId, newBudget) => {
    setBudgets(prev => prev.map(b => {
      if (b.id === budgetId) {
        const amount = Number(newBudget);
        const velocity = calculateBudgetVelocity(b.spent, amount, user.daysElapsed, user.totalDaysInMonth);
        return {
          ...b,
          budget: amount,
          projected: velocity.projected,
          variance: velocity.variance,
          status: velocity.status,
          warning: velocity.warning,
        };
      }
      return b;
    }));
    showToast("Budget updated successfully", "success");
  };

  // Add Goal Contribution
  const addGoalContribution = (goalId, amount) => {
    const num = Number(amount);
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const newCurrent = g.currentAmount + num;
        return {
          ...g,
          currentAmount: newCurrent,
          status: (newCurrent / g.targetAmount >= 0.5) ? "On Track" : g.status,
        };
      }
      return g;
    }));
    showToast(`Contributed ₹${num.toLocaleString('en-IN')} towards goal!`, "success");
  };

  // Import Valid Transactions from CSV
  const importTransactions = (validRecords) => {
    const formatted = validRecords.map((r, i) => ({
      id: `imp_${Date.now()}_${i}`,
      date: r.date,
      time: "14:00",
      merchant: r.merchant,
      category: r.detectedCategory,
      amount: Number(r.amount),
      paymentMode: r.paymentMode || "UPI",
      type: "Expense",
      status: "Completed",
      note: "Imported via CSV statement",
    }));

    setTransactions(prev => [...formatted, ...prev]);

    // Recalculate budgets based on imported transactions
    setBudgets(prevBudgets => prevBudgets.map(b => {
      const addedForCategory = formatted
        .filter(t => t.category.toLowerCase().includes(b.categoryName.toLowerCase()) || b.categoryName.toLowerCase().includes(t.category.toLowerCase()))
        .reduce((sum, t) => sum + t.amount, 0);

      if (addedForCategory > 0) {
        const newSpent = b.spent + addedForCategory;
        const velocity = calculateBudgetVelocity(newSpent, b.budget, user.daysElapsed, user.totalDaysInMonth);
        return {
          ...b,
          spent: newSpent,
          projected: velocity.projected,
          variance: velocity.variance,
          status: velocity.status,
          warning: velocity.warning,
        };
      }
      return b;
    }));

    showToast(`Successfully imported ${validRecords.length} records!`, "success");
  };

  // Apply Recommendation
  const applyRecommendation = (recId) => {
    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: "Applied" } : r));

    if (recId === 'rec_food_reduce_2') {
      // Restore Food budget to On Track (projected becomes ₹4,950)
      setBudgets(prev => prev.map(b => {
        if (b.id === 'b_food') {
          return {
            ...b,
            projected: 4950,
            status: "On Track",
            variance: 50,
            warning: null,
          };
        }
        return b;
      }));
      // Update laptop goal
      setGoals(prev => prev.map(g => {
        if (g.id === 'goal_laptop') {
          return {
            ...g,
            currentMonthlyContribution: 9250,
            status: "On Track",
          };
        }
        return b;
      }));
    }

    showToast("Recommendation applied! Financial metrics updated.", "success");
  };

  // Reset to original Demo State
  const resetToDemoState = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setGoals(INITIAL_GOALS);
    setPatterns(DETECTED_PATTERNS);
    setRecommendations(RECOMMENDATIONS);
    setNotifications(NOTIFICATIONS_LIST);
    showToast("Reset to default September 2026 demo state!", "info");
  };

  return (
    <FinanceContext.Provider
      value={{
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
        showToast,
        addTransaction,
        deleteTransaction,
        updateBudget,
        addGoalContribution,
        importTransactions,
        applyRecommendation,
        resetToDemoState,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
