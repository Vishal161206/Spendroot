import { query } from '../config/db.js';

export async function importTransactions(req, res, next) {
  try {
    const userId = req.user.id;
    const { records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No transaction records provided for import.',
        error: 'EMPTY_PAYLOAD'
      });
    }

    const existing = await query('SELECT merchant, amount, transaction_date FROM transactions WHERE user_id = ?', [userId]);

    let importedCount = 0;
    let duplicateCount = 0;
    let failedCount = 0;
    const errors = [];

    for (const r of records) {
      const amount = parseFloat(r.amount);
      const merchant = (r.merchant || '').trim();
      const date = r.date || new Date().toISOString().split('T')[0];
      const category = r.detectedCategory || r.category || 'Food & Dining';
      const mode = r.paymentMode || 'UPI';

      // Validation 1: Amount must be valid positive
      if (isNaN(amount) || amount <= 0) {
        failedCount++;
        errors.push({ row: r.row, merchant, issue: 'Invalid or zero amount' });
        continue;
      }

      // Validation 2: Duplicate check
      const isDuplicate = existing.some(ex => 
        ex.merchant.toLowerCase() === merchant.toLowerCase() &&
        Math.abs(Number(ex.amount) - amount) < 0.01 &&
        ex.transaction_date.toString().includes(date)
      );

      if (isDuplicate) {
        duplicateCount++;
        continue;
      }

      // Insert valid record
      await query(
        `INSERT INTO transactions (user_id, type, category, merchant, amount, transaction_date, transaction_time, payment_method, note)
         VALUES (?, 'EXPENSE', ?, ?, ?, ?, '14:00:00', ?, 'Imported via CSV statement')`,
        [userId, category, merchant, amount, date, mode]
      );

      importedCount++;
    }

    res.status(200).json({
      success: true,
      message: `Batch import completed. Successfully imported ${importedCount} records.`,
      stats: {
        totalReceived: records.length,
        importedCount,
        duplicateCount,
        failedCount,
        errors,
      }
    });
  } catch (err) {
    next(err);
  }
}
