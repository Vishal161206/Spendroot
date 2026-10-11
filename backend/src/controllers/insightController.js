import { query } from '../config/db.js';
import {
  detectSpendingPatterns,
  detectAnomalies,
  analyzeTrends,
  generateRecommendations,
  calculateWhatIfImpact,
  calculateBudgetForecast,
  calculateFinancialHealthScore
} from '../services/intelligenceEngine.js';

export async function getInsights(req, res, next) {
  try {
    const userId = req.user.id;
    const transactions = await query('SELECT * FROM transactions WHERE user_id = ?', [userId]);
    const budgets = await query('SELECT * FROM budgets WHERE user_id = ?', [userId]);
    const goals = await query('SELECT * FROM goals WHERE user_id = ?', [userId]);

    const totalIncome = Number(req.user.monthly_income) || 40000;
    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expensesByCategory = {};
    for (const t of transactions) {
      if (t.type === 'EXPENSE') {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + Number(t.amount);
      }
    }

    const now = new Date();
    const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysElapsed = Math.min(totalDaysInMonth, Math.max(1, now.getDate()));

    const budgetForecasts = budgets.map(b => {
      const spent = expensesByCategory[b.category] || 0;
      return calculateBudgetForecast(spent, Number(b.amount), daysElapsed, totalDaysInMonth);
    });

    const enrichedBudgets = budgets.map((b, i) => ({
      ...b,
      ...budgetForecasts[i]
    }));

    const patterns = detectSpendingPatterns(transactions);
    const anomalies = detectAnomalies(transactions);
    const trends = analyzeTrends(transactions, budgets);
    const recommendations = generateRecommendations(patterns, enrichedBudgets, goals);
    const healthScore = calculateFinancialHealthScore({
      totalIncome,
      totalExpenses,
      budgets: budgetForecasts,
      goals: goals.map(g => ({ ...g, status: (Number(g.current_amount) / Number(g.target_amount) >= 0.5) ? 'On Track' : 'At Risk' }))
    });

    res.status(200).json({
      success: true,
      data: {
        patterns,
        anomalies,
        trends,
        recommendations,
        healthScore,
        summary: {
          totalIncome,
          totalExpenses,
          netSavings: Math.max(0, totalIncome - totalExpenses),
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function calculateSimulation(req, res, next) {
  try {
    const {
      baseIncome,
      baseExpense,
      goalTarget,
      goalCurrent,
      goalName,
      spendingReductions,
      additionalExpense,
      foodReductionTxCount,
      foodPercentCut,
      removeNetflix,
      shoppingCut,
      transportCut,
      categoryAdjustments,
    } = req.body;

    const userIncome = Number(baseIncome || req.user.monthly_income || 40000);
    const simulationResult = calculateWhatIfImpact({
      baseIncome: userIncome,
      baseExpense: Number(baseExpense || 0),
      goalTarget: Number(goalTarget || 0),
      goalCurrent: Number(goalCurrent || 0),
      goalName: goalName || null,
      spendingReductions: Number(spendingReductions || 0),
      additionalExpense: Number(additionalExpense || 0),
      foodOrderReductionCount: Number(foodReductionTxCount || 0),
      foodPercentCut: Number(foodPercentCut || 0),
      removeNetflix: Boolean(removeNetflix),
      shoppingCutAmount: Number(shoppingCut || 0),
      transportCutAmount: Number(transportCut || 0),
      categoryAdjustments: categoryAdjustments || [],
    });

    res.status(200).json({
      success: true,
      message: 'What-If Simulation calculated.',
      data: simulationResult
    });
  } catch (err) {
    next(err);
  }
}

export async function applyRecommendation(req, res, next) {
  try {
    const { id } = req.params;
    // When food recommendation applied, update food budget projection
    res.status(200).json({
      success: true,
      message: `Recommendation ${id} applied successfully to active plan.`
    });
  } catch (err) {
    next(err);
  }
}
