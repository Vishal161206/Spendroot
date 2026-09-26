import { query } from '../config/db.js';

export async function getSettings(req, res, next) {
  try {
    const userId = req.user.id;
    const settings = await query('SELECT * FROM settings WHERE user_id = ?', [userId]);

    const s = (settings && settings[0]) ? settings[0] : { alert_threshold: 85, theme: 'light', email_notifications: true };

    res.status(200).json({
      success: true,
      data: {
        alertThreshold: s.alert_threshold,
        theme: s.theme,
        emailNotifications: Boolean(s.email_notifications),
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const userId = req.user.id;
    const { alertThreshold, theme, emailNotifications } = req.body;

    const threshold = alertThreshold !== undefined ? Number(alertThreshold) : 85;
    const th = theme || 'light';
    const emailNotif = emailNotifications !== undefined ? (emailNotifications ? 1 : 0) : 1;

    const existing = await query('SELECT id FROM settings WHERE user_id = ?', [userId]);
    if (existing && existing.length > 0) {
      await query(
        'UPDATE settings SET alert_threshold = ?, theme = ?, email_notifications = ? WHERE user_id = ?',
        [threshold, th, emailNotif, userId]
      );
    } else {
      await query(
        'INSERT INTO settings (alert_threshold, theme, email_notifications, user_id) VALUES (?, ?, ?, ?)',
        [threshold, th, emailNotif, userId]
      );
    }

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully.',
      data: { alertThreshold: threshold, theme: th, emailNotifications: Boolean(emailNotif) }
    });
  } catch (err) {
    next(err);
  }
}
