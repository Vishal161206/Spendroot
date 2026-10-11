-- ===================================================
-- SpendRoot: MySQL Schema Definition
-- Hackathon Challenge: URAN 2026 (Challenge FT-01)
-- ===================================================

CREATE DATABASE IF NOT EXISTS uran_ft01;
USE uran_ft01;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  monthly_income DECIMAL(12, 2) DEFAULT 40000.00,
  currency VARCHAR(10) DEFAULT 'INR',
  avatar_url VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(20) DEFAULT '#0D9488',
  icon VARCHAR(50) DEFAULT 'Tag',
  type ENUM('EXPENSE', 'INCOME') DEFAULT 'EXPENSE'
);

-- 3. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('INCOME', 'EXPENSE') NOT NULL DEFAULT 'EXPENSE',
  category VARCHAR(100) NOT NULL,
  merchant VARCHAR(150) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  transaction_date DATE NOT NULL,
  transaction_time TIME DEFAULT '12:00:00',
  payment_method VARCHAR(50) DEFAULT 'UPI',
  note VARCHAR(255) NULL,
  status VARCHAR(30) DEFAULT 'Completed',
  is_recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_tx_user_date (user_id, transaction_date),
  INDEX idx_tx_user_cat (user_id, category)
);

-- 4. BUDGETS TABLE
CREATE TABLE IF NOT EXISTS budgets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  month VARCHAR(20) NOT NULL,
  year INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_budgets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_category_period (user_id, category, month, year)
);

-- 5. SAVINGS GOALS TABLE
CREATE TABLE IF NOT EXISTS goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100) DEFAULT 'Milestone',
  target_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) DEFAULT 0.00,
  target_date VARCHAR(50) NOT NULL,
  description VARCHAR(255) NULL,
  color VARCHAR(20) DEFAULT '#0D9488',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_goals_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_goal_name (user_id, name)
);

-- 6. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  alert_threshold INT DEFAULT 85,
  theme VARCHAR(20) DEFAULT 'light',
  email_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. SPENDING PATTERNS & INSIGHTS TABLE
CREATE TABLE IF NOT EXISTS spending_patterns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  pattern_type VARCHAR(50) NOT NULL,
  title VARCHAR(150) NOT NULL,
  summary TEXT NOT NULL,
  primary_merchant VARCHAR(100) NULL,
  trigger_merchant VARCHAR(100) NULL,
  time_window VARCHAR(100) NULL,
  occurrences_count INT DEFAULT 1,
  average_sequence_cost DECIMAL(12, 2) DEFAULT 0.00,
  monthly_avoidable_impact DECIMAL(12, 2) DEFAULT 0.00,
  severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  explanation TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_patterns_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  pattern_id INT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  category_affected VARCHAR(100) NOT NULL,
  estimated_saving DECIMAL(12, 2) NOT NULL,
  budget_before DECIMAL(12, 2) DEFAULT 0.00,
  budget_after DECIMAL(12, 2) DEFAULT 0.00,
  status ENUM('Active', 'Applied', 'Dismissed') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_recommendations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
