# SpendRoot — Backend REST API & AI Intelligence Engine (`backend/`)

This directory contains the production-grade Node.js + Express.js REST API, relational MySQL 8.0 database integration, and explainable financial intelligence engine for SpendRoot (URAN 2026 Challenge FT-01).

---

## 1. Directory Structure

```text
backend/
├── database/
│   ├── schema.sql         # MySQL DDL (users, transactions, budgets, goals, patterns, recommendations, settings)
│   ├── seed.sql           # Realistic September 2026 demo seed data (Vishal & Priya accounts)
│   └── initDb.js          # Automated database initializer script (`npm run db:init`)
├── src/
│   ├── config/
│   │   └── db.js          # MySQL 8.0 connection pool & resilient data store adapter
│   ├── controllers/
│   │   ├── authController.js         # Register, Login (JWT), /me profile
│   │   ├── transactionController.js  # CRUD transactions with user ownership isolation
│   │   ├── budgetController.js       # Category budgets with velocity forecasting
│   │   ├── goalController.js         # Savings goals & required monthly contribution
│   │   ├── dashboardController.js    # Executive summary cards & chart analytics
│   │   ├── insightController.js      # AI patterns, anomalies & What-If simulator
│   │   ├── importController.js       # CSV transaction bulk import & validation
│   │   └── settingsController.js     # User preferences & currency
│   ├── middleware/
│   │   ├── authMiddleware.js         # Bearer JWT verification & request user injection
│   │   └── errorMiddleware.js        # Centralized HTTP error handler
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── insightRoutes.js
│   │   ├── importRoutes.js
│   │   └── settingsRoutes.js
│   ├── services/
│   │   ├── intelligenceEngine.js     # Temporal sequences, anomaly z-scores, velocity run-rate & What-If
│   │   └── analyticsService.js       # Time-series aggregation & category summaries
│   ├── utils/
│   │   └── response.js               # Standardized API response builder { success, message, data }
│   ├── app.js             # Express app setup with Helmet, CORS, Morgan & body parsers
│   └── server.js          # HTTP server listening on port 5000
├── test-api-flow.cjs      # 11-step automated integration test suite (`npm test`)
├── .env                   # Local environment variables
├── .env.example           # Environment template
├── .gitignore             # Excludes node_modules and .env
└── package.json           # Dependencies and scripts
```

---

## 2. Environment Configuration (`.env`)

Create a `.env` file in `backend/` (or copy `.env.example`):

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=uran_ft01
JWT_SECRET=uran_ft01_super_secret_jwt_key_2026
```

---

## 3. Database Initialization

Ensure MySQL 8.0 is running on your computer, then execute:

```bash
npm run db:init
```

This automated script connects to MySQL, creates the database `uran_ft01`, executes `database/schema.sql`, and populates realistic demo seed data from `database/seed.sql`.

---

## 4. Running the Server

### Development Mode (with hot-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The API server will listen on `http://localhost:5000`.

---

## 5. Automated Testing

Run the comprehensive 11-step integration test:

```bash
npm test
```

This verifies:
1. Health check (`/api/health`)
2. User authentication & signed JWT issuance
3. Authenticated user profile retrieval (`/api/auth/me`)
4. Transaction query with filtering
5. Transaction creation with persistence
6. Category budget calculation with dynamic velocity forecasting
7. Savings goal progress and contribution estimation
8. Executive dashboard KPI aggregation
9. AI pattern detection (temporal sequences) & financial health scoring
10. What-If financial simulation calculations
11. **Multi-user isolation**: Verifies User A cannot access User B's transactions or budgets.

---

## 6. Complete REST API Specifications

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Health status and uptime | No |
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
