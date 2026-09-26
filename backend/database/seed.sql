-- ===================================================
-- SpendRoot: Synthetic Baseline Seed Data (September 2026)
-- Hackathon Challenge: URAN 2026 (Challenge FT-01)
-- ===================================================

USE uran_ft01;

-- Seed Categories
INSERT IGNORE INTO categories (name, color, icon, type) VALUES
('Food & Dining', '#F59E0B', 'UtensilsCrossed', 'EXPENSE'),
('Transport', '#3B82F6', 'Car', 'EXPENSE'),
('Shopping', '#EC4899', 'ShoppingBag', 'EXPENSE'),
('Entertainment', '#8B5CF6', 'Tv', 'EXPENSE'),
('Utilities & Rent', '#10B981', 'Home', 'EXPENSE'),
('Healthcare', '#06B6D4', 'HeartPulse', 'EXPENSE'),
('Subscriptions', '#6366F1', 'Repeat', 'EXPENSE'),
('Income', '#10B981', 'Wallet', 'INCOME');

-- Seed Demo User: Vishal (password: Demo@123)
-- bcrypt hash for Demo@123: $2a$10$3z.52pX2bW5KvhqM0hV6rODwE3XkQ5m1ZlD9.a5tJ8W6hT3/gN62i
INSERT IGNORE INTO users (id, name, email, password_hash, monthly_income, currency) VALUES
(1, 'Vishal', 'demo@spendroot.com', '$2a$10$3z.52pX2bW5KvhqM0hV6rODwE3XkQ5m1ZlD9.a5tJ8W6hT3/gN62i', 40000.00, 'INR'),
(2, 'Priya Sharma', 'priya@spendroot.com', '$2a$10$3z.52pX2bW5KvhqM0hV6rODwE3XkQ5m1ZlD9.a5tJ8W6hT3/gN62i', 50000.00, 'INR');

-- Seed Settings for Vishal
INSERT IGNORE INTO settings (user_id, alert_threshold, theme, email_notifications) VALUES
(1, 85, 'light', TRUE),
(2, 90, 'light', TRUE);

-- Seed Budgets for September 2026 (Vishal)
INSERT IGNORE INTO budgets (user_id, category, amount, month, year) VALUES
(1, 'Food & Dining', 5000.00, 'September', 2026),
(1, 'Shopping', 2500.00, 'September', 2026),
(1, 'Transport', 3000.00, 'September', 2026),
(1, 'Entertainment', 1500.00, 'September', 2026),
(1, 'Utilities & Rent', 12000.00, 'September', 2026);

-- Seed Goals (Vishal)
INSERT IGNORE INTO goals (user_id, name, category, target_amount, current_amount, target_date, description, color) VALUES
(1, 'New Laptop', 'Gadgets / Work', 60000.00, 20000.00, 'March 2027', 'MacBook Pro / ThinkPad upgrade for development and freelancing.', '#0D9488'),
(1, 'Emergency Fund', 'Safety Net', 30000.00, 22000.00, 'December 2026', '3 months of basic living reserves maintained in high-yield liquid funds.', '#10B981');

-- Seed Transactions for September 2026 (Vishal)
INSERT IGNORE INTO transactions (user_id, type, category, merchant, amount, transaction_date, transaction_time, payment_method, note, status, is_recurring) VALUES
(1, 'EXPENSE', 'Food & Dining', 'Swiggy', 650.00, '2026-09-20', '21:30:00', 'UPI', 'Late dinner order', 'Completed', FALSE),
(1, 'EXPENSE', 'Transport', 'Uber', 320.00, '2026-09-20', '20:10:00', 'UPI', 'Cab from office', 'Completed', FALSE),
(1, 'INCOME', 'Income', 'TechCorp Infosys', 40000.00, '2026-09-19', '10:00:00', 'Bank Transfer', 'Monthly Salary Credit', 'Completed', TRUE),
(1, 'EXPENSE', 'Subscriptions', 'Netflix', 649.00, '2026-09-18', '19:45:00', 'Card', 'Monthly plan auto-debit', 'Completed', TRUE),
(1, 'EXPENSE', 'Food & Dining', 'Swiggy', 680.00, '2026-09-18', '21:15:00', 'UPI', 'Late evening dinner', 'Completed', FALSE),
(1, 'EXPENSE', 'Transport', 'Uber', 320.00, '2026-09-18', '20:30:00', 'UPI', 'Commute ride', 'Completed', FALSE),
(1, 'EXPENSE', 'Subscriptions', 'Spotify', 119.00, '2026-09-17', '14:20:00', 'Card', 'Music subscription', 'Completed', TRUE),
(1, 'EXPENSE', 'Shopping', 'Amazon', 890.00, '2026-09-16', '18:00:00', 'UPI', 'Wireless mouse', 'Completed', FALSE),
(1, 'EXPENSE', 'Food & Dining', 'Zomato', 620.00, '2026-09-15', '21:40:00', 'UPI', 'Late dinner', 'Completed', FALSE),
(1, 'EXPENSE', 'Transport', 'Uber', 290.00, '2026-09-15', '20:20:00', 'UPI', 'Ride home', 'Completed', FALSE),
(1, 'EXPENSE', 'Healthcare', 'Apollo Pharmacy', 480.00, '2026-09-14', '12:15:00', 'UPI', 'Vitamins and first aid', 'Completed', FALSE),
(1, 'EXPENSE', 'Entertainment', 'PVR Cinemas', 450.00, '2026-09-13', '17:30:00', 'Card', 'Movie ticket', 'Completed', FALSE),
(1, 'EXPENSE', 'Shopping', 'Myntra', 1260.00, '2026-09-12', '19:00:00', 'Card', 'Weekend clothing', 'Completed', FALSE),
(1, 'EXPENSE', 'Food & Dining', 'Swiggy', 690.00, '2026-09-11', '21:20:00', 'UPI', 'Biryani dinner', 'Completed', FALSE),
(1, 'EXPENSE', 'Transport', 'Ola Auto', 190.00, '2026-09-11', '20:00:00', 'UPI', 'Auto from station', 'Completed', FALSE),
(1, 'EXPENSE', 'Food & Dining', 'Blinkit', 450.00, '2026-09-10', '11:00:00', 'UPI', 'Weekly dairy and fruits', 'Completed', FALSE),
(1, 'EXPENSE', 'Food & Dining', 'Swiggy', 710.00, '2026-09-08', '21:40:00', 'UPI', 'Dinner combo', 'Completed', FALSE),
(1, 'EXPENSE', 'Transport', 'Uber', 340.00, '2026-09-08', '20:10:00', 'UPI', 'Office ride', 'Completed', FALSE),
(1, 'EXPENSE', 'Utilities & Rent', 'Airtel Fiber', 799.00, '2026-09-05', '09:30:00', 'UPI', 'High-speed broadband', 'Completed', TRUE),
(1, 'EXPENSE', 'Food & Dining', 'Zomato', 580.00, '2026-09-04', '21:50:00', 'UPI', 'Late bowl', 'Completed', FALSE),
(1, 'EXPENSE', 'Transport', 'Uber', 310.00, '2026-09-04', '20:15:00', 'UPI', 'Evening ride', 'Completed', FALSE),
(1, 'EXPENSE', 'Entertainment', 'BookMyShow', 450.00, '2026-09-02', '16:00:00', 'UPI', 'Standup comedy pass', 'Completed', FALSE),
(1, 'EXPENSE', 'Utilities & Rent', 'Sunrise Apartments', 10000.00, '2026-09-01', '09:00:00', 'Bank Transfer', 'Monthly House Rent', 'Completed', TRUE),
(1, 'EXPENSE', 'Food & Dining', 'Starbucks', 270.00, '2026-09-01', '15:00:00', 'Card', 'Client coffee meeting', 'Completed', FALSE),
(1, 'EXPENSE', 'Food & Dining', 'Subway', 280.00, '2026-09-07', '13:30:00', 'UPI', 'Lunch with colleagues', 'Completed', FALSE),
(1, 'EXPENSE', 'Transport', 'Shell Petrol Pump', 650.00, '2026-09-14', '18:30:00', 'Card', 'Bike fuel refill', 'Completed', FALSE);

-- Seed User B Data (Priya Sharma - to verify security isolation)
INSERT IGNORE INTO transactions (user_id, type, category, merchant, amount, transaction_date, transaction_time, payment_method, note, status, is_recurring) VALUES
(2, 'INCOME', 'Income', 'Global Analytics Corp', 50000.00, '2026-09-01', '10:00:00', 'Bank Transfer', 'Salary', 'Completed', TRUE),
(2, 'EXPENSE', 'Food & Dining', 'Blue Tokai Coffee', 350.00, '2026-09-15', '11:00:00', 'UPI', 'Coffee', 'Completed', FALSE);

INSERT IGNORE INTO budgets (user_id, category, amount, month, year) VALUES
(2, 'Food & Dining', 6000.00, 'September', 2026);
