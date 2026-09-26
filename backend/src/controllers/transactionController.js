import { query } from '../config/db.js';

export async function getTransactions(req, res, next) {
  try {
    const userId = req.user.id;
    const { category, type, paymentMode, search } = req.query;

    let sql = 'SELECT * FROM transactions WHERE user_id = ?';
    const params = [userId];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (type && type !== 'All') {
      sql += ' AND type = ?';
      params.push(type.toUpperCase());
    }

    if (paymentMode && paymentMode !== 'All') {
      sql += ' AND payment_method = ?';
      params.push(paymentMode);
    }

    sql += ' ORDER BY transaction_date DESC, transaction_time DESC';

    let transactions = await query(sql, params);

    // Apply text search filtering if provided
    if (search && search.trim().length > 0) {
      const s = search.toLowerCase();
      transactions = transactions.filter(t => 
        (t.merchant && t.merchant.toLowerCase().includes(s)) ||
        (t.note && t.note.toLowerCase().includes(s)) ||
        (t.category && t.category.toLowerCase().includes(s))
      );
    }

    // Format for frontend response
    const formatted = transactions.map(t => ({
      id: t.id,
      date: typeof t.transaction_date === 'string' ? t.transaction_date.slice(0, 10) : new Date(t.transaction_date).toISOString().slice(0, 10),
      time: t.transaction_time ? t.transaction_time.slice(0, 5) : '12:00',
      merchant: t.merchant,
      category: t.category,
      amount: Number(t.amount),
      paymentMode: t.payment_method || 'UPI',
      type: t.type === 'INCOME' ? 'Income' : 'Expense',
      status: t.status || 'Completed',
      note: t.note || '',
    }));

    res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully.',
      count: formatted.length,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
}

export async function createTransaction(req, res, next) {
  try {
    const userId = req.user.id;
    const { merchant, amount, category, date, time, paymentMode, type, note } = req.body;

    if (!merchant || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Merchant and amount are required fields.',
        error: 'MISSING_FIELDS'
      });
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Transaction amount must be a positive number.',
        error: 'INVALID_AMOUNT'
      });
    }

    const txType = (type && type.toUpperCase() === 'INCOME') ? 'INCOME' : 'EXPENSE';
    const txDate = date || new Date().toISOString().split('T')[0];
    const txTime = time || '12:00:00';
    const txCategory = category || 'Food & Dining';
    const txMode = paymentMode || 'UPI';

    const result = await query(
      `INSERT INTO transactions (user_id, type, category, merchant, amount, transaction_date, transaction_time, payment_method, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, txType, txCategory, merchant.trim(), numAmount, txDate, txTime, txMode, note || '']
    );

    const newTx = {
      id: result.insertId,
      date: txDate,
      time: txTime.slice(0, 5),
      merchant: merchant.trim(),
      category: txCategory,
      amount: numAmount,
      paymentMode: txMode,
      type: txType === 'INCOME' ? 'Income' : 'Expense',
      status: 'Completed',
      note: note || '',
    };

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully.',
      data: newTx
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteTransaction(req, res, next) {
  try {
    const userId = req.user.id;
    const txId = parseInt(req.params.id, 10);

    const result = await query(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [txId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized to delete.',
        error: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
}
