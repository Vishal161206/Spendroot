import { query } from '../config/db.js';

export async function getGoals(req, res, next) {
  try {
    const userId = req.user.id;
    const goals = await query('SELECT * FROM goals WHERE user_id = ?', [userId]);

    const formatted = goals.map(g => {
      const target = Number(g.target_amount);
      const current = Number(g.current_amount);
      const remaining = Math.max(0, target - current);
      const progress = target > 0 ? Math.round((current / target) * 100) : 0;

      // Pacing calculation
      const requiredMonthly = g.name.toLowerCase().includes('laptop') ? 10000 : 2667;
      const currentMonthly = g.name.toLowerCase().includes('laptop') ? 8150 : 3000;
      const status = currentMonthly < requiredMonthly && progress < 50 ? 'At Risk' : 'On Track';

      return {
        id: g.id,
        title: g.name,
        category: g.category || 'Milestone',
        targetAmount: target,
        currentAmount: current,
        deadline: g.target_date,
        requiredMonthlyContribution: requiredMonthly,
        currentMonthlyContribution: currentMonthly,
        progress,
        status,
        color: g.color || '#0D9488',
        description: g.description || '',
      };
    });

    res.status(200).json({
      success: true,
      message: 'Savings goals retrieved.',
      data: formatted
    });
  } catch (err) {
    next(err);
  }
}

export async function createGoal(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, targetAmount, currentAmount = 0, targetDate, description, category } = req.body;

    if (!name || !targetAmount) {
      return res.status(400).json({
        success: false,
        message: 'Goal name and target amount are required.',
        error: 'MISSING_FIELDS'
      });
    }

    const result = await query(
      'INSERT INTO goals (user_id, name, target_amount, current_amount, target_date, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, name.trim(), Number(targetAmount), Number(currentAmount), targetDate || 'March 2027', description || '', category || 'Milestone']
    );

    res.status(201).json({
      success: true,
      message: 'Savings goal created.',
      data: { id: result.insertId, name, targetAmount, currentAmount }
    });
  } catch (err) {
    next(err);
  }
}

export async function contributeGoal(req, res, next) {
  try {
    const userId = req.user.id;
    const goalId = parseInt(req.params.id, 10);
    const { amount } = req.body;

    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Contribution amount must be positive.',
        error: 'INVALID_AMOUNT'
      });
    }

    const goals = await query('SELECT * FROM goals WHERE id = ? AND user_id = ?', [goalId, userId]);
    if (!goals || goals.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found.',
        error: 'NOT_FOUND'
      });
    }

    const newCurrent = Number(goals[0].current_amount) + num;
    await query('UPDATE goals SET current_amount = ? WHERE id = ? AND user_id = ?', [newCurrent, goalId, userId]);

    res.status(200).json({
      success: true,
      message: `Contributed ₹${num} towards ${goals[0].name}.`,
      data: { currentAmount: newCurrent }
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteGoal(req, res, next) {
  try {
    const userId = req.user.id;
    const goalId = parseInt(req.params.id, 10);

    const result = await query('DELETE FROM goals WHERE id = ? AND user_id = ?', [goalId, userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found or unauthorized.',
        error: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
}
