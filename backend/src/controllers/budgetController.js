import { query } from '../config/db.js';
import { calculateBudgetForecast } from '../services/intelligenceEngine.js';

export async function getBudgets(req, res, next) {
  try {
    const userId = req.user.id;

    // Fetch user budgets and actual expenses from transactions
    const budgets = await query('SELECT * FROM budgets WHERE user_id = ?', [userId]);
    const expenses = await query(
      "SELECT category, SUM(amount) as total_spent FROM transactions WHERE user_id = ? AND type = 'EXPENSE' GROUP BY category",
      [userId]
    );

    const spentMap = {};
    for (const row of expenses) {
      spentMap[row.category] = Number(row.total_spent) || 0;
    }

    const now = new Date();
    const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysElapsed = Math.min(totalDaysInMonth, Math.max(1, now.getDate()));

    const formattedBudgets = budgets.map(b => {
      const budgetAmount = Number(b.amount);
      const spent = spentMap[b.category] || 0;
      const forecast = calculateBudgetForecast(spent, budgetAmount, daysElapsed, totalDaysInMonth);

      return {
        id: b.id,
        categoryId: `cat_${b.category.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        categoryName: b.category,
        budget: budgetAmount,
        spent,
        remaining: Math.max(0, budgetAmount - spent),
        projected: forecast.projected,
        variance: forecast.variance,
        status: forecast.status,
        warning: forecast.warning,
        percentageUsed: forecast.percentageUsed,
      };
    });

    res.status(200).json({
      success: true,
      message: 'Budgets fetched with velocity analytics.',
      data: formattedBudgets
    });
  } catch (err) {
    next(err);
  }
}

export async function createBudget(req, res, next) {
  try {
    const userId = req.user.id;
    const { category, amount, month = 'September', year = 2026 } = req.body;

    if (!category || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Category and amount are required.',
        error: 'MISSING_FIELDS'
      });
    }

    const numAmount = parseFloat(amount);
    const result = await query(
      'INSERT INTO budgets (user_id, category, amount, month, year) VALUES (?, ?, ?, ?, ?)',
      [userId, category.trim(), numAmount, month, year]
    );

    res.status(201).json({
      success: true,
      message: 'Budget allocated successfully.',
      data: {
        id: result.insertId,
        category: category.trim(),
        budget: numAmount,
        spent: 0,
        projected: numAmount,
        status: 'On Track'
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function updateBudget(req, res, next) {
  try {
    const userId = req.user.id;
    const budgetId = parseInt(req.params.id, 10);
    const { amount } = req.body;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid budget amount.',
        error: 'INVALID_AMOUNT'
      });
    }

    const result = await query(
      'UPDATE budgets SET amount = ? WHERE id = ? AND user_id = ?',
      [numAmount, budgetId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized.',
        error: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully.'
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteBudget(req, res, next) {
  try {
    const userId = req.user.id;
    const budgetId = parseInt(req.params.id, 10);

    const result = await query(
      'DELETE FROM budgets WHERE id = ? AND user_id = ?',
      [budgetId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized.',
        error: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
}
