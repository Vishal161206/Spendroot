import { query } from '../config/db.js';
import { detectSpendingPatterns, generateRecommendations, calculateBudgetForecast } from '../services/intelligenceEngine.js';
import { buildDashboardAnalytics } from '../services/analyticsService.js';

export async function getDashboardSummary(req, res, next) {
  try {
    const userId = req.user.id;
    const monthlyIncome = Number(req.user.monthly_income) || 40000;

    // 1. Transactions summary
    const transactions = await query('SELECT * FROM transactions WHERE user_id = ?', [userId]);

    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netSavings = Math.max(0, monthlyIncome - totalExpenses);
    const savingsRate = Number(((netSavings / monthlyIncome) * 100).toFixed(1));

    // 2. Goals progress
    const goals = await query('SELECT * FROM goals WHERE user_id = ?', [userId]);
    const totalGoalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0);
    const totalGoalSaved = goals.reduce((sum, g) => sum + Number(g.current_amount), 0);
    const savingsGoalProgress = totalGoalTarget > 0 ? Math.round((totalGoalSaved / totalGoalTarget) * 100) : 68;

    // 3. Budgets health
    const budgets = await query('SELECT * FROM budgets WHERE user_id = ?', [userId]);
    const expensesByCategory = {};
    for (const t of transactions) {
      if (t.type === 'EXPENSE') {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + Number(t.amount);
      }
    }

    const budgetHealth = budgets.map(b => {
      const spent = expensesByCategory[b.category] || 0;
      const forecast = calculateBudgetForecast(spent, Number(b.amount), 20, 30);
      return {
        id: b.id,
        categoryName: b.category,
        budget: Number(b.amount),
        spent,
        projected: forecast.projected,
        variance: forecast.variance,
        status: forecast.status,
        warning: forecast.warning,
      };
    });

    // 4. Intelligence: Pattern & Recommendation
    const patterns = detectSpendingPatterns(transactions);
    const recommendations = generateRecommendations(patterns, budgetHealth, goals);

    res.status(200).json({
      success: true,
      data: {
        totalIncome: monthlyIncome,
        totalExpenses,
        netSavings,
        savingsRate,
        savingsGoalProgress,
        budgetHealth,
        pattern: patterns[0] || null,
        recommendation: recommendations[0] || null,
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getDashboardAnalytics(req, res, next) {
  try {
    const userId = req.user.id;
    const transactions = await query('SELECT * FROM transactions WHERE user_id = ?', [userId]);
    const budgets = await query('SELECT * FROM budgets WHERE user_id = ?', [userId]);

    const expensesByCategory = {};
    for (const t of transactions) {
      if (t.type === 'EXPENSE') {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + Number(t.amount);
      }
    }

    const budgetObjs = budgets.map(b => ({
      category: b.category,
      spent: expensesByCategory[b.category] || 0
    }));

    const analytics = buildDashboardAnalytics(transactions, budgetObjs);

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (err) {
    next(err);
  }
}
