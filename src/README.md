# SpendRoot — Frontend Source Code (`src/`)

This directory contains the React 18 + Vite frontend implementation for the SpendRoot FinTech platform.

## Directory Structure

```text
src/
├── components/
│   ├── common/              # Reusable UI primitives (Badge, Card, Modal, Tooltip)
│   ├── dashboard/           # Specialized fintech widgets:
│   │   ├── AddTransactionModal.jsx    # Transaction creation form with confidence scoring
│   │   ├── AnalyticsCharts.jsx        # Recharts monthly area, category bar & pie charts
│   │   ├── BudgetHealthSection.jsx    # Budget progress with velocity forecasting
│   │   ├── EvidenceModal.jsx          # AI observable evidence breakdown modal
│   │   ├── PatternAlertCard.jsx       # Detected sequence pattern notification card
│   │   ├── RecommendationHeroCard.jsx # Actionable recommendation hero with simulator link
│   │   └── SummaryCards.jsx           # Income, expenses, savings rate & run-rate KPIs
│   └── layout/
│       ├── Header.jsx                 # Top bar with user profile, month indicator & actions
│       ├── MobileNav.jsx              # Responsive bottom navigation bar for mobile
│       ├── Navbar.jsx                 # Desktop sidebar navigation
│       └── UserMenu.jsx               # Account switching & sign-out controls
├── context/
│   └── FinanceContext.jsx   # Global application state wired to Express REST APIs (`api.js`)
├── pages/
│   ├── BudgetsPage.jsx        # Category budget management & velocity projections
│   ├── DashboardPage.jsx      # Main executive dashboard
│   ├── GoalsPage.jsx          # Savings goals with monthly progress tracking
│   ├── ImportPage.jsx         # CSV bulk transaction upload with duplicate detection
│   ├── InsightsPage.jsx       # AI pattern detection, anomalies & recommendations
│   ├── LoginPage.jsx          # JWT authentication with 1-click demo accounts
│   ├── MonthlySummaryPage.jsx # Comprehensive end-of-month financial report
│   ├── RegisterPage.jsx       # New user account registration
│   ├── SettingsPage.jsx       # User currency, theme, and notification preferences
│   ├── SimulatorPage.jsx      # Interactive What-If financial simulation engine
│   └── TransactionsPage.jsx   # Searchable, filterable transaction ledger
├── services/
│   ├── api.js                 # Axios/Fetch client communicating with Node/Express (`:5000/api`)
│   ├── csvParser.js           # CSV parsing, schema validation & duplicate detection
│   ├── intelligenceEngine.js  # Client-side fallbacks & simulation helpers
│   └── mockData.js            # Initial reference constants & category definitions
├── App.jsx                    # Root application component with React Router
├── main.jsx                   # Vite React application entrypoint
└── index.css                  # Tailwind CSS directives & global typography styles
```

## Key Technologies
- **React 18.3.1**: Component-driven reactive UI.
- **React Router 6.26.2**: Client-side routing with authentication protection.
- **Tailwind CSS 3.4.11**: Utility-first responsive design system.
- **Recharts 2.12.7**: Responsive SVG financial charts (Area, Bar, Pie).
- **Lucide React**: Modern iconography.
- **Canvas-Confetti**: Milestone celebration effects.
