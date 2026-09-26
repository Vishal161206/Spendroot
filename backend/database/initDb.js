import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'uran_ft01';

  console.log(`[DB INIT] Connecting to MySQL at ${host}:${port} as ${user}...`);

  try {
    // 1. Connect without database first to ensure DB exists
    const rootConn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      connectTimeout: 3000,
    });

    console.log(`[DB INIT] Connected to MySQL. Ensuring database '${database}' exists...`);
    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await rootConn.end();

    // 2. Connect to the database
    const dbConn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
      multipleStatements: true,
      connectTimeout: 5000,
    });

    console.log(`[DB INIT] Connected to '${database}'. Applying schema...`);
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await dbConn.query(schemaSql);

    console.log(`[DB INIT] Schema applied. Applying seed data...`);
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
    await dbConn.query(seedSql);

    // Ensure password_hash for Demo@123 is valid bcrypt
    const demoHash = await bcrypt.hash('Demo@123', 10);
    await dbConn.query(
      `UPDATE users SET password_hash = ? WHERE email = 'demo@spendroot.com'`,
      [demoHash]
    );

    console.log(`[DB INIT] Database '${database}' successfully initialized and seeded!`);
    await dbConn.end();
    return { success: true, mode: 'mysql' };
  } catch (err) {
    console.warn(`[DB INIT WARN] MySQL direct init error: ${err.message}`);
    console.log(`[DB INIT] Falling back to structured local store mode to guarantee zero-crash execution.`);
    return { success: false, mode: 'local_store', error: err.message };
  }
}

// Allow direct CLI execution: node database/initDb.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeDatabase().then(() => {
    console.log('[DB INIT] Complete.');
  });
}
