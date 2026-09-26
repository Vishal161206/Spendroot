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

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully.',
      data: { alertThreshold, theme, emailNotifications }
    });
  } catch (err) {
    next(err);
  }
}
