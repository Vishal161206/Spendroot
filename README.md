# URAN 2026 – 12-Hour Hackathon

**Organizer:** Department of Computer Applications, PMIST  
**Event:** URAN 2026  
**Repository Type:** Official Team Submission Repository

> This repository is the official implementation record for the team.  
> Only code and documentation pushed before the official freeze time will be considered for evaluation.

---

## 1. Team Information

- **Team ID:** `URAN-FT-01`
- **Track:** `FinTech & Digital Economy`
- **Challenge ID:** `FT-01`
- **Project Title:** `SpendRoot – Explainable Personal Finance Behavior & Budget Optimizer`
- **Team Lead:** `Ariselvam`
- **Repository Start Time:** `9:00 AM`
- **Final Freeze Time:** `5:00 PM`

### Team Members

| No. | Name | Register No. | GitHub Username | Primary Responsibility |
|---|---|---|---|---|
| 1 | A. Ariselvam | FT-01 |Vishal161206| FrontEnd & Planning |
| 2 | T.R. Vishal Anand | FT-01 |Vishal161206 | BackEnd / DataBase |
| 3 |  I. Rahul Mathew | FT-01 |Vishal161206 | Frontend / UI |
| 4 | N.K Hari Krishna | FT-01 | Vishal161206 | PPT & Documentation  |

---

## 2. Problem Statement

Individuals frequently use multiple payment modes and receive fragmented transaction records, making it difficult to understand spending behaviour, maintain realistic budgets, and build disciplined savings habits. A simple expense-entry system can record transactions, but it does not adequately explain why spending is increasing, which budgets are at risk, or what practical action could improve the user's financial position.

The FT-01 challenge requires a personal finance platform that converts transaction data into actionable financial insight. The system must support manual or synthetic transaction records, meaningful expense categorization, budget comparison, unusual or excessive spending detection, configurable savings goals, and explainable recommendations. It must also demonstrate at least one analytical technique such as budget variance analysis, trend detection, recurring-expense identification, or lightweight spending forecasting. Invalid, duplicate, and missing transaction inputs must be handled, while records must be persisted and exposed through a documented API or modular service layer.

SpendRoot addresses this challenge through an explainable workflow that connects transaction data to financial decisions: transactions are categorized and analyzed, budget risks and repeated spending patterns are detected, evidence is shown for each insight, and the user can test a proposed action through an interactive What-if Simulator before applying it.

---

## 3. Proposed Solution

### SpendRoot

SpendRoot is a **responsive web-based personal finance management platform** designed to turn transaction records into understandable and actionable financial insights.

Instead of acting only as an expense tracker, SpendRoot follows this flow:

```text
Transactions
     ↓
Automatic Categorization
     ↓
Financial Analytics
     ↓
Budget Risk / Pattern Detection
     ↓
Evidence & Explanation
     ↓
Recommended Action
     ↓
What-if Simulation
     ↓
Savings Goal Impact
```

### Intended Users

- Students managing monthly expenses
- Salaried individuals
- Users maintaining monthly category budgets
- Users working toward savings goals

### Main Value Delivered

SpendRoot helps users answer:

1. **What happened to my money?**
2. **Why is my budget at risk?**
3. **What spending pattern was detected?**
4. **What action can I take?**
5. **What could happen if I take that action?**

The prototype uses synthetic/user-created transaction data and does not require real bank credentials or production payment data.

### Differentiating Concept

The key product workflow is:

> **Repeated spending pattern → evidence → explainable recommendation → What-if simulation → projected savings-goal impact**

For example, the system can identify a repeated sequence such as late-evening transport followed by food delivery and show the observed evidence, estimated impact, and the effect of reducing selected similar transactions. The system presents this as a detected/repeated pattern rather than claiming that transaction history proves causation.

---

## 4. Core Features Implemented

- [x] Responsive FinTech web application (React 18 + Vite + Tailwind CSS)
- [x] User Login, Register, and JWT-authenticated session management
- [x] Multi-user data isolation (User A cannot access User B's transactions, budgets, or goals)
- [x] Real-time Dashboard with income, expenses, savings, velocity indicators, and financial health score
- [x] Full CRUD Transaction capture, filtering, pagination, and persistent storage
- [x] Server-side CSV transaction import with validation and duplicate detection
- [x] Merchant-based expense categorization with confidence metrics
- [x] Category-wise and time-series spending analytics APIs (`/api/dashboard/analytics`)
- [x] Category budget tracking with dynamic velocity forecasting and threshold alerts (`HEALTHY`, `WARNING`, `EXCEEDED`)
- [x] Financial savings goals with progress tracking and monthly requirement calculations
- [x] Server-side Financial Intelligence Engine (`backend/src/services/intelligenceEngine.js`)
  - [x] Temporal sequence pattern detection (e.g. late-night commute followed by food delivery)
  - [x] Statistical anomaly detection (Z-score / mean deviation for unusual spending)
  - [x] Linear velocity spending forecasting (`spent + dailyRate * remainingDays`)
  - [x] Explainable recommendation generator with concrete observable financial evidence
  - [x] Interactive What-if financial simulation engine
- [x] Comprehensive Monthly Financial Summary
- [x] Node.js & Express.js REST API with Helmet, Morgan, and CORS
- [x] MySQL 8.0 server-side persistence (`uran_ft01`) with connection pool & resilient storage adapter
- [x] Production-grade authentication with bcrypt password hashing & Bearer JWT tokens

---

## 5. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router 6, Tailwind CSS, Recharts, Lucide React |
| Backend | Node.js, Express.js REST API, Helmet, Morgan, CORS, express-validator |
| Database | MySQL 8.0 relational database (`uran_ft01`) with connection pool and resilient storage adapter |
| Authentication | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing, custom `authMiddleware` |
| AI / Intelligence | Server-side rule-based and statistical financial intelligence engine (`backend/src/services/intelligenceEngine.js`) |
| Data Processing | Express-validator, CSV bulk import parser, temporal sequence detection algorithms |
| Deployment / Runtime | Vite development server (`:3000`), Express API server (`:5000`) |

### Intelligence Engine (`backend/src/services/intelligenceEngine.js`)

The core analytical intelligence runs entirely on the backend server:

- **Temporal Sequence Detection**: Correlates sequential transactions within configurable time windows (e.g., Late Commute + Food Delivery within 120 minutes) with occurrence counts and cumulative expense impact.
- **Statistical Anomaly Detection**: Calculates category mean and standard deviation to detect unusual transactions ($Z > 2.0$), generating explainable warnings without false fraud accusations.
- **Velocity Forecasting**: Uses daily run-rates across month-to-date elapsed days to project month-end totals and flag budget-exceeding trajectories.
- **What-If Simulation Engine**: Computes financial delta scenarios in real-time, calculating projected savings, budget relief, and acceleration towards active savings goals.

---

## 6. System Architecture

The complete system is an end-to-end full-stack application:

```text
React + Vite Frontend (Port 3000)
        │
        ▼ HTTP REST / JSON + Authorization: Bearer <JWT>
Express.js REST API Server (Port 5000)
        │
        ├──────────────────────┬──────────────────────┐
        ▼                      ▼                      ▼
  Controllers & Route    Intelligence Engine    Database Adapter
  Handlers (Auth, Tx,    (Temporal Sequences,   (MySQL 8.0 Pool)
   Budgets, Goals, etc.)  Anomaly, Forecasting)       │
        │                      │                      ▼
        └──────────────────────┴──────────────> MySQL Database (`uran_ft01`)
```

### Complete REST API Specifications

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service health status and uptime | No |
| `POST` | `/api/auth/register` | Register new user account with bcrypt password | No |
| `POST` | `/api/auth/login` | Authenticate user & return signed JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `GET` | `/api/transactions` | Fetch user transactions (with search, category, type filter) | Yes |
| `POST` | `/api/transactions` | Create new transaction | Yes |
| `PUT` | `/api/transactions/:id` | Update existing transaction (with user ownership check) | Yes |
| `DELETE` | `/api/transactions/:id` | Delete transaction (with user ownership check) | Yes |
| `POST` | `/api/import/transactions` | Bulk import transactions from CSV data | Yes |
| `GET` | `/api/budgets` | Fetch budgets with actual spending, forecast & health status | Yes |
| `POST` | `/api/budgets` | Create new category budget | Yes |
| `PUT` | `/api/budgets/:id` | Update budget target | Yes |
| `DELETE` | `/api/budgets/:id` | Delete budget | Yes |
| `GET` | `/api/goals` | Fetch savings goals with progress & required monthly savings | Yes |
| `POST` | `/api/goals` | Create savings goal | Yes |
| `PUT` | `/api/goals/:id` | Update savings goal | Yes |
| `DELETE` | `/api/goals/:id` | Delete savings goal | Yes |
| `GET` | `/api/dashboard/summary` | Dashboard metrics (income, expenses, savings rate, velocity) | Yes |
| `GET` | `/api/dashboard/analytics` | Category breakdown & monthly time-series analytics | Yes |
| `GET` | `/api/insights` | Full AI intelligence (patterns, anomalies, forecast, recommendations) | Yes |
| `POST` | `/api/insights/simulate` | Execute What-if simulation scenario with real database data | Yes |
| `GET` | `/api/settings` | Fetch user profile and preferences | Yes |
| `PUT` | `/api/settings` | Update user preferences | Yes |

---

## 7. How to Run the Project

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MySQL Server 8.0 (optional: unified database adapter connects automatically, with local persistence fallback if credentials are unset)

### 1. Backend Setup & Run

Open a terminal:

```bash
cd backend
npm install
```

Configure environment:
Copy `.env.example` to `.env` or use default configuration:
```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=uran_ft01
JWT_SECRET=uran_ft01_super_secret_jwt_key_2026
```

Initialize the MySQL database:
```bash
npm run db:init
```
*(Or execute `backend/database/schema.sql` and `backend/database/seed.sql` in MySQL Workbench / CLI)*

Start the backend API server:
```bash
npm run dev
```
The backend API server will run on:
```text
http://localhost:5000
```

Run automated backend integration test suite:
```bash
npm test
```
All 11 integration tests verify authentication, transactions, budgets, goals, dashboard, AI insights, and multi-user isolation.

### 2. Frontend Setup & Run

Open a second terminal:

```bash
cd URAN-FT-01-main
npm install
npm run dev
```

The frontend development server will launch on:
```text
http://localhost:3000
```

---

## 8. Demo Accounts & Credentials

The seed data includes two isolated user accounts for live hackathon judging:

### User 1 (Primary Demo - Vishal)
```text
Email:    demo@spendroot.com
Password: Demo@123
Profile:  Vishal | Monthly Income: ₹40,000 | 27 Preloaded Transactions (Sept 2026)
Features: Has active commute+food sequence patterns, food budget warning, and emergency fund goal.
```

### User 2 (Isolation Test - Priya)
```text
Email:    priya@spendroot.com
Password: Demo@123
Profile:  Priya | Monthly Income: ₹50,000 | Distinct transactions and budgets
Features: Used to verify strict data isolation (User A cannot access User B's records).
```

---

## 9. Testing & Validation

| Test / Validation | Status | Verification Result |
|---|---|---|
| Full-Stack REST API | PASS | 11/11 automated integration tests passing (`npm test` in `backend/`) |
| User Authentication | PASS | Registration, login, and signed JWT Bearer authorization verified |
| User Ownership Isolation | PASS | Verified User A (Vishal) cannot access or modify User B (Priya)'s data |
| Transaction CRUD | PASS | Create, read, update, delete verified with MySQL persistence |
| Category Analytics | PASS | Category aggregation and time-series spending computed on backend |
| Budget Health & Forecast | PASS | Run-rate velocity accurately projects month-end and assigns `HEALTHY`/`WARNING`/`EXCEEDED` |
| AI Pattern Detection | PASS | Detects repeated temporal sequences (Late Commute → Food Delivery within 120m) |
| Statistical Anomaly Detection | PASS | Z-score anomaly detector flags unusual transactions with explainable metrics |
| What-If Simulator | PASS | Dynamic scenario calculations update projected savings and goal completion |
| CSV Transaction Import | PASS | Validates schema, formats rows, and reports duplicates |
| Responsive FinTech UI | PASS | Tested on Desktop, Tablet, and Mobile viewport configurations |

## 10. Screenshots

Add final screenshots to:

```text
docs/screenshots/
```

Recommended screenshots:

```text
dashboard.png
transactions.png
import.png
budgets.png
goals.png
insights.png
simulator.png
monthly-summary.png
```

The screenshots should show the actual working implementation used for the final submission.

---

## 11. External Resources Used

### Open-source libraries/frameworks:

- React
- React DOM
- Vite
- React Router
- Tailwind CSS
- Recharts
- Lucide React
- clsx
- tailwind-merge
- canvas-confetti
- PostCSS / Autoprefixer

### APIs:

- No external banking or payment API currently used.

### Pretrained models:

- No pretrained ML model currently used.

### Datasets:

- Synthetic/user-created transaction data for the hackathon prototype.
- No production financial dataset is required.

### Templates:

- Declare any external UI template, component kit, or design template actually used by the team before final submission.

### Tutorials/reference code:

- Declare any external tutorial/reference implementation actually used by the team before final submission.

### Other third-party resources:

- Any additional external assets, icons, images, fonts, or services should be declared here before final freeze.

---

## 12. AI Tool Disclosure

Complete:

```text
AI_DISCLOSURE.md
```

The team should declare all meaningful AI-tool usage during the hackathon, including AI-assisted code generation, UI generation, debugging, documentation, or design work where applicable.

All submitted implementation must be understood and explainable by the team members during judging.

---

## 13. System Architecture & Hackathon Design Decisions

1. **Server-Side Persistence**: Complete MySQL 8.0 schema and relational models with connection pooling and unified fallback adapter for resilience.
2. **Authentication**: Fully functional JWT Bearer authentication with bcrypt password hashing and token expiry handling.
3. **Financial Intelligence**: Implemented as an explainable, deterministic and statistical analytical service (`backend/src/services/intelligenceEngine.js`), avoiding hallucinations and ensuring offline operation without paid third-party LLM dependencies.
4. **Data Isolation**: Strict user-level authorization checks on all mutating and querying endpoints ensure complete isolation between users.
5. **FinTech Sandbox Scope**: Designed for the URAN 2026 hackathon using realistic synthetic Indian rupee (₹) transactions; external production banking Account Aggregator (AA) integrations are intentionally omitted for hackathon portability.
6. **Explainable Estimates**: What-if simulations and velocity forecasts provide mathematical projections rather than certified professional financial advice.

---

## 14. Final Submission Checklist

- [x] Complete full-stack source code verified (Frontend + Backend + Database + AI Engine)
- [x] Comprehensive README completed with installation, APIs, and credentials
- [x] Architecture diagram created and documented in `docs/architecture.png` and `docs/architecture.md`
- [x] Setup and run instructions tested and verified on localhost
- [x] Backend integration test suite passing 11/11 tests (`npm test` in `backend/`)
- [x] Passwords, private keys, and real credentials excluded (`.env` in `.gitignore`)
- [x] Demo credentials verified for primary demo (`demo@spendroot.com`) and isolation test (`priya@spendroot.com`)
- [x] Realistic September 2026 transaction dataset seeded in MySQL
- [x] Transaction entry, updating, deletion, and CSV import demonstrated
- [x] Automatic merchant-based categorization and confidence indicators working
- [x] Budget velocity alerts and projected overspending warnings verified
- [x] Spending pattern detection (temporal commute → delivery sequences) verified
- [x] Statistical anomaly detection (Z-score unusual spending) verified
- [x] Explainable recommendation cards with observable evidence verified
- [x] Interactive What-if financial simulation engine verified
- [x] Savings goal acceleration verified
- [x] Multi-user security isolation verified
- [x] Responsive FinTech UI verified across devices
- [x] Full-stack browser recording captured and saved (`fullstack_demo_1790410676007.webp`)

---

## Official Submission Rule

The repository state recorded by the organizers at the official cutoff is the **final submission**.  

The recorded commit SHA is authoritative for judging.

A presentation, Figma prototype, screenshots, or slides **without a demonstrable working implementation** will not be treated as a completed hackathon prototype.
