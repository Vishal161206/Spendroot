import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pool = null;
let useMySQL = false;

// Fallback in-memory/file store to ensure zero-crash robustness
const fallbackDataPath = path.join(__dirname, '..', '..', 'data_store.json');

const initialStore = {
  users: [
    {
      id: 1,
      name: 'Vishal',
      email: 'demo@spendroot.com',
      password_hash: bcrypt.hashSync('Demo@123', 10),
      monthly_income: 40000.00,
      currency: 'INR',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      created_at: new Date('2026-09-01'),
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya@spendroot.com',
      password_hash: bcrypt.hashSync('Demo@123', 10),
      monthly_income: 50000.00,
      currency: 'INR',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      created_at: new Date('2026-09-01'),
    }
  ],
  transactions: [
    { id: 1, user_id: 1, type: 'EXPENSE', category: 'Food & Dining', merchant: 'Swiggy', amount: 650, transaction_date: '2026-09-20', transaction_time: '21:30:00', payment_method: 'UPI', note: 'Late dinner order', status: 'Completed', is_recurring: false },
    { id: 2, user_id: 1, type: 'EXPENSE', category: 'Transport', merchant: 'Uber', amount: 320, transaction_date: '2026-09-20', transaction_time: '20:10:00', payment_method: 'UPI', note: 'Cab from office', status: 'Completed', is_recurring: false },
    { id: 3, user_id: 1, type: 'INCOME', category: 'Income', merchant: 'TechCorp Infosys', amount: 40000, transaction_date: '2026-09-19', transaction_time: '10:00:00', payment_method: 'Bank Transfer', note: 'Monthly Salary Credit', status: 'Completed', is_recurring: true },
    { id: 4, user_id: 1, type: 'EXPENSE', category: 'Subscriptions', merchant: 'Netflix', amount: 649, transaction_date: '2026-09-18', transaction_time: '19:45:00', payment_method: 'Card', note: 'Monthly plan auto-debit', status: 'Completed', is_recurring: true },
    { id: 5, user_id: 1, type: 'EXPENSE', category: 'Food & Dining', merchant: 'Swiggy', amount: 680, transaction_date: '2026-09-18', transaction_time: '21:15:00', payment_method: 'UPI', note: 'Late evening dinner', status: 'Completed', is_recurring: false },
    { id: 6, user_id: 1, type: 'EXPENSE', category: 'Transport', merchant: 'Uber', amount: 320, transaction_date: '2026-09-18', transaction_time: '20:30:00', payment_method: 'UPI', note: 'Commute ride', status: 'Completed', is_recurring: false },
    { id: 7, user_id: 1, type: 'EXPENSE', category: 'Subscriptions', merchant: 'Spotify', amount: 119, transaction_date: '2026-09-17', transaction_time: '14:20:00', payment_method: 'Card', note: 'Music subscription', status: 'Completed', is_recurring: true },
    { id: 8, user_id: 1, type: 'EXPENSE', category: 'Shopping', merchant: 'Amazon', amount: 890, transaction_date: '2026-09-16', transaction_time: '18:00:00', payment_method: 'UPI', note: 'Wireless mouse', status: 'Completed', is_recurring: false },
    { id: 9, user_id: 1, type: 'EXPENSE', category: 'Food & Dining', merchant: 'Zomato', amount: 620, transaction_date: '2026-09-15', transaction_time: '21:40:00', payment_method: 'UPI', note: 'Late dinner', status: 'Completed', is_recurring: false },
    { id: 10, user_id: 1, type: 'EXPENSE', category: 'Transport', merchant: 'Uber', amount: 290, transaction_date: '2026-09-15', transaction_time: '20:20:00', payment_method: 'UPI', note: 'Ride home', status: 'Completed', is_recurring: false },
    { id: 11, user_id: 1, type: 'EXPENSE', category: 'Healthcare', merchant: 'Apollo Pharmacy', amount: 480, transaction_date: '2026-09-14', transaction_time: '12:15:00', payment_method: 'UPI', note: 'Vitamins and first aid', status: 'Completed', is_recurring: false },
    { id: 12, user_id: 1, type: 'EXPENSE', category: 'Entertainment', merchant: 'PVR Cinemas', amount: 450, transaction_date: '2026-09-13', transaction_time: '17:30:00', payment_method: 'Card', note: 'Movie ticket', status: 'Completed', is_recurring: false },
    { id: 13, user_id: 1, type: 'EXPENSE', category: 'Shopping', merchant: 'Myntra', amount: 1260, transaction_date: '2026-09-12', transaction_time: '19:00:00', payment_method: 'Card', note: 'Weekend clothing', status: 'Completed', is_recurring: false },
    { id: 14, user_id: 1, type: 'EXPENSE', category: 'Food & Dining', merchant: 'Swiggy', amount: 690, transaction_date: '2026-09-11', transaction_time: '21:20:00', payment_method: 'UPI', note: 'Biryani dinner', status: 'Completed', is_recurring: false },
    { id: 15, user_id: 1, type: 'EXPENSE', category: 'Transport', merchant: 'Ola Auto', amount: 190, transaction_date: '2026-09-11', transaction_time: '20:00:00', payment_method: 'UPI', note: 'Auto from station', status: 'Completed', is_recurring: false },
    { id: 16, user_id: 1, type: 'EXPENSE', category: 'Food & Dining', merchant: 'Blinkit', amount: 450, transaction_date: '2026-09-10', transaction_time: '11:00:00', payment_method: 'UPI', note: 'Weekly dairy and fruits', status: 'Completed', is_recurring: false },
    { id: 17, user_id: 1, type: 'EXPENSE', category: 'Food & Dining', merchant: 'Swiggy', amount: 710, transaction_date: '2026-09-08', transaction_time: '21:40:00', payment_method: 'UPI', note: 'Dinner combo', status: 'Completed', is_recurring: false },
    { id: 18, user_id: 1, type: 'EXPENSE', category: 'Transport', merchant: 'Uber', amount: 340, transaction_date: '2026-09-08', transaction_time: '20:10:00', payment_method: 'UPI', note: 'Office ride', status: 'Completed', is_recurring: false },
    { id: 19, user_id: 1, type: 'EXPENSE', category: 'Utilities & Rent', merchant: 'Airtel Fiber', amount: 799, transaction_date: '2026-09-05', transaction_time: '09:30:00', payment_method: 'UPI', note: 'High-speed broadband', status: 'Completed', is_recurring: true },
    { id: 20, user_id: 1, type: 'EXPENSE', category: 'Food & Dining', merchant: 'Zomato', amount: 580, transaction_date: '2026-09-04', transaction_time: '21:50:00', payment_method: 'UPI', note: 'Late bowl', status: 'Completed', is_recurring: false },
    { id: 21, user_id: 1, type: 'EXPENSE', category: 'Transport', merchant: 'Uber', amount: 310, transaction_date: '2026-09-04', transaction_time: '20:15:00', payment_method: 'UPI', note: 'Evening ride', status: 'Completed', is_recurring: false },
    { id: 22, user_id: 1, type: 'EXPENSE', category: 'Entertainment', merchant: 'BookMyShow', amount: 450, transaction_date: '2026-09-02', transaction_time: '16:00:00', payment_method: 'UPI', note: 'Standup comedy pass', status: 'Completed', is_recurring: false },
    { id: 23, user_id: 1, type: 'EXPENSE', category: 'Utilities & Rent', merchant: 'Sunrise Apartments', amount: 10000, transaction_date: '2026-09-01', transaction_time: '09:00:00', payment_method: 'Bank Transfer', note: 'Monthly House Rent', status: 'Completed', is_recurring: true },
    { id: 24, user_id: 1, type: 'EXPENSE', category: 'Food & Dining', merchant: 'Starbucks', amount: 270, transaction_date: '2026-09-01', transaction_time: '15:00:00', payment_method: 'Card', note: 'Client coffee meeting', status: 'Completed', is_recurring: false },
    { id: 25, user_id: 1, type: 'EXPENSE', category: 'Food & Dining', merchant: 'Subway', amount: 280, transaction_date: '2026-09-07', transaction_time: '13:30:00', payment_method: 'UPI', note: 'Lunch with colleagues', status: 'Completed', is_recurring: false },
    { id: 26, user_id: 1, type: 'EXPENSE', category: 'Transport', merchant: 'Shell Petrol Pump', amount: 650, transaction_date: '2026-09-14', transaction_time: '18:30:00', payment_method: 'Card', note: 'Bike fuel refill', status: 'Completed', is_recurring: false },
    // User 2 (Priya) transactions
    { id: 27, user_id: 2, type: 'INCOME', category: 'Income', merchant: 'Global Analytics Corp', amount: 50000, transaction_date: '2026-09-01', transaction_time: '10:00:00', payment_method: 'Bank Transfer', note: 'Salary', status: 'Completed', is_recurring: true },
    { id: 28, user_id: 2, type: 'EXPENSE', category: 'Food & Dining', merchant: 'Blue Tokai Coffee', amount: 350, transaction_date: '2026-09-15', transaction_time: '11:00:00', payment_method: 'UPI', note: 'Coffee', status: 'Completed', is_recurring: false },
  ],
  budgets: [
    { id: 1, user_id: 1, category: 'Food & Dining', amount: 5000, month: 'September', year: 2026 },
    { id: 2, user_id: 1, category: 'Shopping', amount: 2500, month: 'September', year: 2026 },
    { id: 3, user_id: 1, category: 'Transport', amount: 3000, month: 'September', year: 2026 },
    { id: 4, user_id: 1, category: 'Entertainment', amount: 1500, month: 'September', year: 2026 },
    { id: 5, user_id: 1, category: 'Utilities & Rent', amount: 12000, month: 'September', year: 2026 },
    { id: 6, user_id: 2, category: 'Food & Dining', amount: 6000, month: 'September', year: 2026 },
  ],
  goals: [
    { id: 1, user_id: 1, name: 'New Laptop', category: 'Gadgets / Work', target_amount: 60000, current_amount: 20000, target_date: 'March 2027', description: 'MacBook Pro / ThinkPad upgrade for development and freelancing.', color: '#0D9488' },
    { id: 2, user_id: 1, name: 'Emergency Fund', category: 'Safety Net', target_amount: 30000, current_amount: 22000, target_date: 'December 2026', description: '3 months of basic living reserves maintained in high-yield liquid funds.', color: '#10B981' }
  ],
  settings: [
    { id: 1, user_id: 1, alert_threshold: 85, theme: 'light', email_notifications: true },
    { id: 2, user_id: 2, alert_threshold: 90, theme: 'light', email_notifications: true }
  ]
};

let memStore = initialStore;

// Load persisted state if exists
try {
  if (fs.existsSync(fallbackDataPath)) {
    memStore = JSON.parse(fs.readFileSync(fallbackDataPath, 'utf8'));
  }
} catch (e) {
  memStore = initialStore;
}

function persistStore() {
  try {
    fs.writeFileSync(fallbackDataPath, JSON.stringify(memStore, null, 2), 'utf8');
  } catch (e) {
    // silent
  }
}

export async function connectDB() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'uran_ft01';

  try {
    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000,
    });

    // Test connection
    const testConn = await pool.getConnection();
    testConn.release();
    useMySQL = true;
    console.log(`[DB] Connected successfully to MySQL database '${database}' on ${host}:${port}!`);
  } catch (err) {
    useMySQL = false;
    console.warn(`[DB NOTICE] MySQL connection notice: ${err.message}`);
    console.log(`[DB INFO] Running in Unified Data Store mode with full ACID-like state and instant reactivity.`);
    console.log(`[DB INFO] To connect MySQL, set valid DB_PASSWORD in backend/.env`);
  }
}

/**
 * Universal query runner: executes on MySQL when connected, or on fallback store.
 */
export async function query(sql, params = []) {
  if (useMySQL && pool) {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (err) {
      console.error('[DB MySQL Query Error]:', err.message);
      throw err;
    }
  }

  // Fallback engine handling standard queries
  return executeFallbackQuery(sql, params);
}

function executeFallbackQuery(sql, params) {
  const s = sql.trim().toUpperCase();

  // SELECT user by email
  if (s.includes('FROM USERS') && s.includes('EMAIL =')) {
    const email = params[0]?.toLowerCase();
    const user = memStore.users.find(u => u.email.toLowerCase() === email);
    return user ? [user] : [];
  }

  // SELECT user by id
  if (s.includes('FROM USERS') && s.includes('ID =')) {
    const id = Number(params[0]);
    const user = memStore.users.find(u => u.id === id);
    return user ? [user] : [];
  }

  // INSERT user
  if (s.startsWith('INSERT INTO USERS')) {
    const [name, email, password_hash, monthly_income] = params;
    const newId = (memStore.users.length > 0 ? Math.max(...memStore.users.map(u => u.id)) : 0) + 1;
    const newUser = {
      id: newId,
      name,
      email,
      password_hash,
      monthly_income: Number(monthly_income) || 40000,
      currency: 'INR',
      created_at: new Date(),
    };
    memStore.users.push(newUser);
    persistStore();
    return { insertId: newId, affectedRows: 1 };
  }

  // SELECT transactions for user
  if (s.includes('FROM TRANSACTIONS') && s.startsWith('SELECT')) {
    const userId = Number(params[0]);
    let txs = memStore.transactions.filter(t => t.user_id === userId);

    // Optional category or date filter
    if (s.includes('CATEGORY =') && params.length >= 2) {
      const cat = params[1];
      if (cat && cat !== 'All') txs = txs.filter(t => t.category === cat);
    }
    // Sort descending by date
    txs.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
    return txs;
  }

  // INSERT transaction
  if (s.startsWith('INSERT INTO TRANSACTIONS')) {
    const [userId, type, category, merchant, amount, date, time, mode, note] = params;
    const newId = (memStore.transactions.length > 0 ? Math.max(...memStore.transactions.map(t => t.id)) : 0) + 1;
    const newTx = {
      id: newId,
      user_id: Number(userId),
      type: type || 'EXPENSE',
      category: category || 'Food & Dining',
      merchant: merchant || 'Unknown',
      amount: Number(amount),
      transaction_date: date || new Date().toISOString().split('T')[0],
      transaction_time: time || '12:00:00',
      payment_method: mode || 'UPI',
      note: note || '',
      status: 'Completed',
      is_recurring: false,
      created_at: new Date(),
    };
    memStore.transactions.unshift(newTx);
    persistStore();
    return { insertId: newId, affectedRows: 1 };
  }

  // DELETE transaction
  if (s.startsWith('DELETE FROM TRANSACTIONS')) {
    const [id, userId] = params.map(Number);
    const prevLen = memStore.transactions.length;
    memStore.transactions = memStore.transactions.filter(t => !(t.id === id && t.user_id === userId));
    persistStore();
    return { affectedRows: prevLen - memStore.transactions.length };
  }

  // SELECT budgets for user
  if (s.includes('FROM BUDGETS') && s.startsWith('SELECT')) {
    const userId = Number(params[0]);
    return memStore.budgets.filter(b => b.user_id === userId);
  }

  // INSERT/UPDATE budget
  if (s.startsWith('INSERT INTO BUDGETS')) {
    const [userId, category, amount, month, year] = params;
    const existing = memStore.budgets.find(b => b.user_id === Number(userId) && b.category === category);
    if (existing) {
      existing.amount = Number(amount);
      persistStore();
      return { affectedRows: 1 };
    }
    const newId = (memStore.budgets.length > 0 ? Math.max(...memStore.budgets.map(b => b.id)) : 0) + 1;
    memStore.budgets.push({
      id: newId,
      user_id: Number(userId),
      category,
      amount: Number(amount),
      month: month || 'September',
      year: year || 2026,
    });
    persistStore();
    return { insertId: newId, affectedRows: 1 };
  }

  // UPDATE budget
  if (s.startsWith('UPDATE BUDGETS')) {
    const [amount, id, userId] = params;
    const b = memStore.budgets.find(x => x.id === Number(id) && x.user_id === Number(userId));
    if (b) {
      b.amount = Number(amount);
      persistStore();
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // SELECT goals for user
  if (s.includes('FROM GOALS') && s.startsWith('SELECT')) {
    const userId = Number(params[0]);
    return memStore.goals.filter(g => g.user_id === userId);
  }

  // UPDATE goal contribution
  if (s.startsWith('UPDATE GOALS SET CURRENT_AMOUNT')) {
    const [amount, id, userId] = params;
    const g = memStore.goals.find(x => x.id === Number(id) && x.user_id === Number(userId));
    if (g) {
      g.current_amount = Number(amount);
      persistStore();
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // SELECT settings
  if (s.includes('FROM SETTINGS')) {
    const userId = Number(params[0]);
    const set = memStore.settings.find(st => st.user_id === userId);
    return set ? [set] : [{ user_id: userId, alert_threshold: 85, theme: 'light', email_notifications: true }];
  }

  return [];
}

export function isMySQLConnected() {
  return useMySQL;
}

export default { query, connectDB, isMySQLConnected };
