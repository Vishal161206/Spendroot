# URAN 2026 – 12-Hour Hackathon

**Organizer:** Department of Computer Applications, PMIST  
**Event:** URAN 2026  
**Repository Type:** Official Team Submission Repository

> This repository is the official implementation record for the team.  
> Only code and documentation pushed before the official freeze time will be considered for evaluation.

---

## 1. Team Information

- **Team ID:** `URAN-FT-01
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

- [x] Responsive FinTech web application
- [x] User Login and Register screens / demo authentication flow
- [x] Dashboard with income, expenses, savings and financial health indicators
- [x] Transaction capture and management
- [x] CSV transaction import
- [x] Input validation for transaction records
- [x] Duplicate transaction detection during import
- [x] Automatic merchant-based expense categorization
- [x] Category confidence indicators and manual category correction
- [x] Category-wise and time-based spending analytics
- [x] Configurable category budgets
- [x] Budget variance and projected-spending indicators
- [x] Savings goals and progress tracking
- [x] Recurring-expense / spending pattern insights
- [x] Explainable recommendation cards
- [x] Interactive What-if financial simulation
- [x] Monthly financial summary
- [x] Responsive navigation for desktop and mobile screens
- [x] Browser persistence using `localStorage`
- [ ] Spring Boot backend integration
- [ ] MySQL server-side persistence
- [ ] Production-grade authentication and authorization
- [ ] External bank/payment API integration

---

## 5. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Tailwind CSS, Recharts, Lucide React |
| Backend | Not yet connected in the current frontend prototype; planned Java + Spring Boot REST API |
| Database | Current prototype uses browser `localStorage`; planned MySQL persistence |
| AI / ML | Explainable rule-based/statistical intelligence in JavaScript; no trained ML model currently used |
| APIs / Services | Current prototype uses internal frontend services only; no external financial API |
| Deployment / Runtime | Vite development server / static frontend build |

### Current Intelligence Layer

The current frontend intelligence is implemented in:

```text
src/services/intelligenceEngine.js
```

It contains logic for:

- Merchant categorization
- Budget velocity / projected spending
- Repeated temporal spending-pattern detection
- What-if financial calculations

CSV handling is implemented through:

```text
src/services/csvParser.js
```

Synthetic/demo records are maintained through:

```text
src/services/mockData.js
```

---

## 6. System Architecture

The current repository contains a **frontend-first working prototype**.

```text
                    USER
                      │
                      ▼
             React Web Application
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
     Pages       Components     React Router
        │
        ▼
   FinanceContext
        │
   ┌────┼───────────────┐
   ▼    ▼               ▼
 CSV  Intelligence   Mock Data
Parser   Engine          │
   │      │             │
   └──────┴──────┬──────┘
                  ▼
             localStorage
                  │
                  ▼
 Dashboard / Transactions / Budgets / Goals /
 Insights / Simulator / Monthly Summary
```

Detailed architecture documentation:

```text
docs/architecture.md
```

Architecture diagram:

```text
docs/architecture.png
```

### Planned Backend Integration

After the frontend prototype, the target integrated architecture is:

```text
React Web App
      ↓ REST / JSON
Spring Boot REST API
      ↓
Service Layer
      ↓
MySQL
```

Planned backend modules include authentication, transactions, budgets, savings goals, analytics, pattern detection, recommendations, What-if simulation, and monthly summaries.

> The repository must only mark Spring Boot/MySQL as implemented after the code is actually connected, tested, and pushed.

---

## 7. How to Run the Project

### Prerequisites

- Node.js
- npm
- Modern web browser
- Git

The current frontend prototype does **not** require a database server or external API credentials.

### Installation

```bash
git clone <repository-url>
cd URAN-FT-01-main
npm install
```

### Configuration

The current frontend prototype does not require real financial-service credentials.

Do **not** commit:

- Passwords
- API keys
- Access tokens
- Database credentials
- Private keys
- Personal financial data

If environment variables are introduced during backend integration, provide only their names in `.env.example`.

### Run

```bash
npm run dev
```

The Vite configuration uses the development server on:

```text
http://localhost:3000
```

### Production Build Test

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 8. Demo Credentials

The current frontend prototype contains a hackathon-only demo login flow.

```text
Email:    demo@spendroot.com
Password: Demo@123
```

These are **temporary prototype credentials only** and are not production banking credentials.

---

## 9. Testing / Validation

| Test / Validation | Result |
|---|---|
| Core feature test | Frontend routes, dashboard, transaction management, budgets, goals, insights, simulator and monthly summary implemented |
| Error handling | Frontend validation and user-facing error states implemented; server-side handling pending backend integration |
| Input validation | CSV/manual transaction validation implemented |
| Duplicate detection | Implemented for imported transaction data |
| Automatic categorization | Implemented through rule-based merchant categorization |
| Analytics | Category/time analytics, budget projection and pattern logic implemented |
| Responsive UI | Responsive web layouts implemented for desktop/tablet/mobile |
| Security / privacy checks | Synthetic/demo data only; no external bank data; production authentication/security pending backend integration |
| Persistent data | Browser `localStorage` implemented in current prototype |
| MySQL persistence | Pending backend integration |
| REST API integration | Pending backend integration |

Before final freeze, rerun the application from a clean environment and verify the complete end-to-end demo flow.

---

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

## 13. Known Limitations

1. The current prototype uses browser `localStorage` instead of server-side MySQL persistence.
2. Login/Register is currently a frontend demonstration flow and is not production-grade server authentication.
3. Financial intelligence currently runs in JavaScript using deterministic/rule-based/statistical logic rather than a trained ML model.
4. No live bank-account, payment-provider, or Account Aggregator integration is implemented.
5. Only synthetic/user-created transaction data should be used for the hackathon prototype.
6. Production safeguards such as server-side authorization, HTTPS enforcement, secure token handling, restricted CORS, server-side validation, and database security must be implemented during backend integration.
7. Recommendation impacts are estimates based on observed transaction patterns and assumptions; they are not guaranteed financial outcomes or professional financial advice.
8. The current frontend and future backend must share one canonical transaction dataset so that dashboard totals, budgets, insights, simulations, and monthly summaries remain consistent.

---

## 14. Final Submission Checklist

Before the freeze:

- [ ] Complete source code pushed
- [ ] README completed
- [ ] Architecture diagram uploaded to `docs/architecture.png`
- [ ] Architecture explanation completed in `docs/architecture.md`
- [ ] Setup/run instructions tested from a clean environment
- [ ] AI and external-resource disclosure completed
- [ ] `.env`, passwords, API keys and secrets excluded
- [ ] `node_modules` and generated build/cache directories excluded from Git
- [ ] Demo credentials verified
- [ ] Synthetic one-month transaction dataset ready
- [ ] Transaction entry/import demonstrated
- [ ] Automatic categorization demonstrated
- [ ] Budget alert demonstrated
- [ ] Analytical technique demonstrated
- [ ] Spending pattern/recurring-expense detection demonstrated
- [ ] Explainable recommendation demonstrated
- [ ] What-if simulation demonstrated
- [ ] Savings goal impact demonstrated
- [ ] Monthly summary demonstrated
- [ ] Persistence demonstrated
- [ ] Invalid/duplicate/missing transaction handling demonstrated
- [ ] Responsive UI checked
- [ ] Final screenshots added
- [ ] `SUBMISSION_CHECKLIST.md` completed
- [ ] Final GitHub checkpoint pushed
- [ ] Final commit SHA recorded

---

## Official Submission Rule

The repository state recorded by the organizers at the official cutoff is the **final submission**.  

The recorded commit SHA is authoritative for judging.

A presentation, Figma prototype, screenshots, or slides **without a demonstrable working implementation** will not be treated as a completed hackathon prototype.
