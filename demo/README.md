# SpendRoot (URAN FT-01) — Demo Guide & Judge Instructions

## Project Overview

- **Project Name**: SpendRoot — Explainable Personal Finance Behavior & Budget Optimizer
- **Challenge Track**: URAN 2026 FinTech Challenge FT-01
- **Architecture**: React 18 + Vite (Port 3000) ↔ Express.js REST API (Port 5000) ↔ MySQL 8.0 (`uran_ft01`) + Explainable Financial Intelligence Engine

---

## Local Demo Setup

Open two terminal windows to run both frontend and backend:

### Terminal 1: Backend API Server
```bash
cd backend
npm install
npm run db:init      # Initializes MySQL database 'uran_ft01' with schema & demo seeds
npm run dev          # Starts Express API server on http://localhost:5000
```

> **Automated Verification**: Run `npm test` in `backend/` to run the 11-step integration test suite verifying authentication, CRUD, velocity forecasting, AI insights, and multi-user isolation.

### Terminal 2: Frontend Client
```bash
cd URAN-FT-01-main
npm install
npm run dev -- --port 3000   # Starts React development server on http://localhost:3000
```

Open your browser at:
```text
http://localhost:3000
```

---

## Demo Accounts & Credentials

The seed data includes two isolated user accounts designed specifically for live hackathon judging:

| Account | Email | Password | Role / Dataset |
|---|---|---|---|
| **User 1 (Primary Demo)** | `demo@spendroot.com` | `Demo@123` | **Vishal** — Monthly Income ₹40,000. 27 preloaded transactions with active commute+food sequences, food budget warning, and Emergency Fund goal. |
| **User 2 (Isolation Test)** | `priya@spendroot.com` | `Demo@123` | **Priya** — Monthly Income ₹50,000. Distinct transaction set to verify strict data isolation (User A cannot access User B's records). |

*(1-click login buttons for both accounts are available directly on the login screen for instant demo access).*

---

## Step-by-Step 5-Minute Judge Demonstration Flow

### Step 1: Authentication & Session Launch (30 seconds)
1. Open `http://localhost:3000/login`.
2. Click **"Demo: Vishal (₹40,000/mo)"** to autofill credentials, then click **"Sign In"**.
3. Point out: A secure JWT Bearer token is issued by Express and sent with all subsequent API calls.

### Step 2: Live Executive Dashboard (45 seconds)
1. Observe the **Executive Summary Cards**:
   - Total Income: ₹40,000
   - Total Expenses: Real-time sum from MySQL
   - Savings Rate & Run-Rate Velocity: Daily spend rate ($₹/day) projecting month-end totals.
   - Financial Health Score: Deterministic 0–100 score based on savings, budget adherence, and goal velocity.
2. Review the **Interactive Recharts Visualizations**:
   - Monthly Spending trends (Area Chart).
   - Category Breakdown (Bar & Pie Charts).

### Step 3: AI Behavior Pattern Detection & Evidence (60 seconds)
1. Scroll down to the **Behavior Pattern Alert**:
   - Title: *"Late-evening transport followed by food delivery"*
   - Highlights 6 detected occurrences totaling ₹2,740 in monthly spend impact.
2. Click **"View Observable Evidence"**:
   - Shows the explainable mathematical proof: timestamp correlation window (within 120 minutes), pair frequencies, and cumulative financial drag.
   - Emphasize to the jury: This is explainable intelligence grounded in observable database records, NOT hallucinated black-box output.

### Step 4: Category Budgets with Velocity Forecasting (45 seconds)
1. Navigate to **Budgets** (`/budgets` or click through the dashboard section).
2. Point out the Food budget:
   - Budget: ₹6,000 | Spent: ₹4,850
   - Status: **Warning** (Projected to exceed budget by month-end based on daily run-rate velocity).

### Step 5: Interactive What-If Simulator (60 seconds)
1. Navigate to **Simulator** (`/simulator` or click **"Simulate What-If Scenario"** from the hero card).
2. Toggle simulation controls:
   - Toggle **Reduce food delivery frequency by 2 orders/week** (Projected monthly savings: +₹1,749).
   - Toggle subscription cancellation.
3. Observe the dynamic recalculations:
   - Food budget projected status immediately recovers to **Healthy**!
   - Projected monthly savings increases from 39% to 44%.
   - **Emergency Fund Goal** completion accelerates by **2.4 months**!

### Step 6: Live Transaction Ledger & Recalculation (45 seconds)
1. Navigate to **Transactions** (`/transactions`).
2. Click **"+ Add Transaction"**:
   - Description: `Blue Tokai Cafe`
   - Category: `Food`
   - Amount: `₹350`
   - Method: `UPI`
3. Click **"Save Transaction"**:
   - Request is POSTed to `/api/transactions`, inserted into MySQL, and all downstream metrics (dashboard total, food budget velocity, and health score) immediately recalculate in real-time.

### Step 7: Multi-User Security Isolation Verification (30 seconds)
1. Click **Sign Out** in the user menu.
2. Click **"Demo: Priya (₹50,000/mo)"** and log in.
3. Observe: Priya's dashboard shows entirely different transactions, budgets, and savings goals.
4. Verify: Vishal's transactions and budgets are completely isolated and inaccessible, enforced by backend user ownership validation (`user_id === authenticated_user.id`).

---

## Expected Demo Duration

- **Demonstration**: 4 to 5 minutes
- **Technical Q&A**: 2 to 3 minutes
- **Total Duration**: ~7 minutes
