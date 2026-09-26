# System Architecture

## 1. Architecture Overview

SpendRoot is currently implemented as a **responsive React web application** for the URAN 2026 FinTech Track FT-01 challenge.

The current repository contains a working frontend prototype with:

- React + Vite application structure
- React Router based navigation
- Tailwind CSS based responsive UI
- Reusable dashboard/page components
- React Context for shared finance state
- `localStorage` for persistent browser-side demo data
- CSV import and validation
- Rule-based merchant categorization
- Client-side financial analytics and intelligence logic
- Behavioral pattern detection
- Recommendation generation
- What-if financial simulation

The current prototype is intentionally **self-contained and uses synthetic/demo data**. It does not connect to real bank accounts, real payment credentials, or third-party financial APIs.

The current implemented architecture is:

```text
User
  |
  v
React Web Application
  |
  +--> React Router / Pages
  |
  +--> Reusable UI Components
  |
  +--> FinanceContext (shared application state)
          |
          +--> csvParser.js
          |      └── CSV parsing + validation
          |
          +--> intelligenceEngine.js
          |      ├── Merchant categorization
          |      ├── Budget velocity / projection
          |      ├── Pattern detection
          |      └── What-if calculations
          |
          +--> mockData.js
          |      └── Synthetic demo dataset
          |
          +--> Browser localStorage
                 ├── transactions
                 ├── budgets
                 ├── goals
                 ├── patterns
                 ├── recommendations
                 └── notifications
```

The production-oriented Spring Boot + MySQL backend is **not yet connected in the current repository**. It is a planned integration target for the next development stage and therefore is not represented as an implemented component in the architecture diagram.

---

## 2. Components

| Component | Responsibility | Technology |
|---|---|---|
| Frontend | Responsive web interface, navigation, forms, dashboards, charts, transaction management, budgets, goals, insights, simulator and monthly summary | React 18.3.1, Vite 5.4.6, React Router 6.26.2, Tailwind CSS 3.4.11, Recharts 2.12.7, Lucide React |
| Backend | **Not implemented in the current prototype.** Planned REST API layer for authentication, transactions, budgets, goals, analytics and recommendations | Planned: Java + Spring Boot |
| Database | Current demo persistence is browser-side. Finance state is stored and restored through `localStorage` | Browser `localStorage` |
| AI / ML | Explainable client-side intelligence using deterministic rules and calculations; merchant categorization, budget projection, temporal behavior detection and what-if simulation | JavaScript in `src/services/intelligenceEngine.js`; no trained ML model currently used |
| External API | No external financial/banking/payment API is currently used | None |

### Current source structure

```text
src/
├── components/
│   ├── common/
│   ├── dashboard/
│   └── layout/
├── context/
│   └── FinanceContext.jsx
├── pages/
│   ├── DashboardPage.jsx
│   ├── TransactionsPage.jsx
│   ├── ImportPage.jsx
│   ├── BudgetsPage.jsx
│   ├── GoalsPage.jsx
│   ├── InsightsPage.jsx
│   ├── SimulatorPage.jsx
│   ├── MonthlySummaryPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── SettingsPage.jsx
├── services/
│   ├── csvParser.js
│   ├── intelligenceEngine.js
│   └── mockData.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 3. Data Flow

### 3.1 Transaction entry flow

```text
Manual transaction entry
        |
        v
AddTransactionModal / TransactionsPage
        |
        v
FinanceContext
        |
        +--> Merchant categorization
        |
        +--> Transaction formatting / validation
        |
        v
React state
        |
        v
localStorage
        |
        v
Dashboard / Transactions / Budgets / Insights / Summary
```

### 3.2 CSV import flow

```text
CSV file
   |
   v
ImportPage
   |
   v
csvParser.js
   |
   +--> Parse rows
   +--> Validate fields
   +--> Detect malformed records
   +--> Detect likely duplicates
   |
   v
Merchant normalization / categorization
   |
   v
FinanceContext
   |
   v
localStorage
```

### 3.3 Intelligence flow

```text
Transactions + Budgets + Goals
              |
              v
     intelligenceEngine.js
              |
      +-------+--------+----------------+
      |       |        |                |
      v       v        v                v
Categorize  Budget   Pattern        What-if
            Projection Detection    Simulation
      |       |        |                |
      +-------+--------+----------------+
              |
              v
       Insights / Recommendations
              |
              v
        Dashboard + Simulator
```

### 3.4 Current behavior-analysis example

SpendRoot can identify repeated transaction sequences such as:

```text
Late-evening Transport
          |
          | within a configured time window
          v
Food Delivery
```

When repeated sequences are present, the intelligence layer can produce an explainable pattern containing observable evidence, occurrence information, and an estimated financial impact.

The application presents this as a **detected/repeated pattern**, not as proof of causation.

### 3.5 What-if simulation flow

```text
Current financial state
        |
        v
User changes simulation control
        |
        v
Simulation calculation
        |
        +--> projected expense
        +--> projected savings
        +--> budget effect
        +--> savings-goal effect
        |
        v
Interactive result shown in SimulatorPage
```

The current simulator is non-destructive until the user chooses an action that changes the application state.

---

## 4. Security / Privacy Considerations

### Current prototype safeguards

1. **Synthetic/demo financial data only**
   - The prototype does not require real bank credentials.
   - No live bank account or production payment information is processed.

2. **Client-side input validation**
   - Transaction forms validate required fields and basic numeric/date constraints.
   - CSV import reports invalid or incomplete records before valid records are imported.

3. **Duplicate detection**
   - Imported transaction records are checked for likely duplicate entries.

4. **No external financial APIs**
   - The current prototype does not transmit financial data to an external banking or payment service.

5. **Environment-variable discipline**
   - The repository contains `.env.example` only for variable names.
   - Real secrets, passwords, API keys and tokens must not be committed.

6. **Demo-only authentication**
   - The current Login/Register screens provide a frontend demonstration flow.
   - They do not yet provide production-grade server-side authentication or authorization.

### Security requirements for the planned backend integration

When the Spring Boot backend is added, the following should be implemented before calling the application production-ready:

```text
HTTPS
  |
  v
Spring Security
  |
  +--> Password hashing (BCrypt/Argon2)
  +--> Authentication
  +--> Authorization
  +--> Protected REST endpoints
  |
  v
Server-side validation
  |
  v
MySQL with parameterized ORM/repository access
```

Additional requirements:

- Never store plain-text passwords.
- Do not trust client-side validation alone.
- Validate transaction amounts, dates and identifiers on the server.
- Authorize each resource by authenticated user ID.
- Do not expose database credentials in source code.
- Do not log passwords, tokens or sensitive financial payloads.
- Use HTTPS for deployed environments.
- Restrict CORS to trusted frontend origins.
- Apply appropriate error handling without leaking internal stack traces.

---

## 5. Architecture Diagram

The final diagram is saved at:

```text
docs/architecture.png
```

It represents the **currently implemented frontend architecture**, not the future Spring Boot/MySQL design.

The implemented flow is:

```text
User
  ↓
React Web App
  ↓
FinanceContext
  ↓
CSV Parser + Intelligence Engine + Synthetic Data
  ↓
Browser localStorage
  ↓
Dashboard / Insights / Simulator / Summary
```

### Future integration note

The next implementation stage can replace the browser-only persistence and intelligence execution with:

```text
React
  ↓ REST API
Spring Boot
  ↓
Service Layer
  ↓
MySQL
```

The future backend should preserve the same functional flow while moving authentication, persistence, validation, analytics and recommendation generation to the server where appropriate.
