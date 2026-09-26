// Synthetic baseline dataset for SpendRoot (URAN 2026, Challenge FT-01)
// Period: September 2026 (Day 20 of 30 elapsed)

export const INITIAL_USER = {
  id: "usr_vishal_01",
  name: "Vishal",
  email: "demo@spendroot.com",
  role: "Software Professional",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  monthlyIncome: 40000,
  currentPeriod: "September 2026",
  daysElapsed: 20,
  totalDaysInMonth: 30,
};

export const INITIAL_CATEGORIES = [
  { id: "cat_food", name: "Food & Dining", color: "#F59E0B", icon: "UtensilsCrossed" },
  { id: "cat_transport", name: "Transport", color: "#3B82F6", icon: "Car" },
  { id: "cat_shopping", name: "Shopping", color: "#EC4899", icon: "ShoppingBag" },
  { id: "cat_entertainment", name: "Entertainment", color: "#8B5CF6", icon: "Tv" },
  { id: "cat_utilities", name: "Utilities & Rent", color: "#10B981", icon: "Home" },
  { id: "cat_healthcare", name: "Healthcare", color: "#06B6D4", icon: "HeartPulse" },
  { id: "cat_subscriptions", name: "Subscriptions", color: "#6366F1", icon: "Repeat" },
];

export const INITIAL_BUDGETS = [
  {
    id: "b_food",
    categoryId: "cat_food",
    categoryName: "Food & Dining",
    budget: 5000,
    spent: 4650,
    projected: 6050,
    status: "At Risk", // Spent > 90% and Projected exceeds budget
    variance: -1050,
    warning: "Likely to exceed budget by ₹1,050",
    color: "#F59E0B"
  },
  {
    id: "b_shopping",
    categoryId: "cat_shopping",
    categoryName: "Shopping",
    budget: 2500,
    spent: 2150,
    projected: 3400,
    status: "At Risk",
    variance: -900,
    warning: "Likely to exceed budget by ₹900",
    color: "#EC4899"
  },
  {
    id: "b_transport",
    categoryId: "cat_transport",
    categoryName: "Transport",
    budget: 3000,
    spent: 2100,
    projected: 2700,
    status: "On Track",
    variance: 300,
    warning: null,
    color: "#3B82F6"
  },
  {
    id: "b_entertainment",
    categoryId: "cat_entertainment",
    categoryName: "Entertainment",
    budget: 1500,
    spent: 900,
    projected: 1200,
    status: "On Track",
    variance: 300,
    warning: null,
    color: "#8B5CF6"
  },
  {
    id: "b_utilities",
    categoryId: "cat_utilities",
    categoryName: "Utilities & Rent",
    budget: 12000,
    spent: 10799,
    projected: 11598,
    status: "On Track",
    variance: 402,
    warning: null,
    color: "#10B981"
  }
];

export const INITIAL_GOALS = [
  {
    id: "goal_laptop",
    title: "New Laptop",
    category: "Gadgets / Work",
    targetAmount: 60000,
    currentAmount: 20000,
    deadline: "March 2027",
    targetMonthsRemaining: 6,
    requiredMonthlyContribution: 10000,
    currentMonthlyContribution: 8150,
    status: "At Risk", // Current pace ₹8,150 < required ₹10,000
    color: "#0D9488",
    description: "MacBook Pro / ThinkPad upgrade for development and freelancing.",
  },
  {
    id: "goal_emergency",
    title: "Emergency Fund",
    category: "Safety Net",
    targetAmount: 30000,
    currentAmount: 22000,
    deadline: "December 2026",
    targetMonthsRemaining: 3,
    requiredMonthlyContribution: 2667,
    currentMonthlyContribution: 3000,
    status: "On Track",
    color: "#10B981",
    description: "3 months of basic living reserves maintained in high-yield liquid funds.",
  }
];

export const DETECTED_PATTERNS = [
  {
    id: "pat_late_food_seq",
    type: "Sequence Pattern",
    title: "Late-evening food spending pattern",
    severity: "high",
    summary: "5 similar weekday commute → food delivery sequences detected this month.",
    primaryMerchant: "Swiggy / Zomato",
    triggerMerchant: "Uber / Ola",
    timeWindow: "Within 90-120 minutes (8:00 PM – 9:45 PM)",
    occurrencesCount: 5,
    averageSequenceCost: 890,
    monthlyAvoidableImpact: 1700,
    evidenceItems: [
      { date: "18 Sep, 8:40 PM", trigger: "Uber ride (Office → Home) ₹320", followUp: "Swiggy (Dinner) ₹680", diffMinutes: 45 },
      { date: "15 Sep, 9:05 PM", trigger: "Uber ride ₹290", followUp: "Zomato ₹620", diffMinutes: 62 },
      { date: "11 Sep, 8:15 PM", trigger: "Ola Auto ₹190", followUp: "Swiggy ₹690", diffMinutes: 38 },
      { date: "08 Sep, 8:50 PM", trigger: "Uber ride ₹340", followUp: "Swiggy ₹710", diffMinutes: 52 },
      { date: "04 Sep, 9:10 PM", trigger: "Uber ride ₹310", followUp: "Zomato ₹580", diffMinutes: 70 },
    ],
    explanation: "On days when you commute home after 8:00 PM, exhaustion triggers rapid food delivery orders with 92% correlation, adding ₹1,700/mo in unplanned meal charges."
  },
  {
    id: "pat_subscription_cluster",
    type: "Recurring Expense",
    title: "Clustered Recurring Digital Subscriptions",
    severity: "medium",
    summary: "Multiple subscriptions renew within 48 hours in mid-month.",
    primaryMerchant: "Netflix, Spotify, Cloud Storage",
    occurrencesCount: 3,
    monthlyAvoidableImpact: 649,
    evidenceItems: [
      { date: "18 Sep", item: "Netflix Standard Plan", amount: 649 },
      { date: "17 Sep", item: "Spotify Premium", amount: 119 },
      { date: "16 Sep", item: "Google One 100GB", amount: 130 }
    ],
    explanation: "Netflix usage dropped by 60% over the last 30 days while automatic debit continued."
  },
  {
    id: "pat_weekend_shopping",
    type: "Trend Spike",
    title: "Weekend Impulse Shopping Trend",
    severity: "medium",
    summary: "65% of monthly shopping happens in Friday-Sunday micro-spikes.",
    primaryMerchant: "Amazon, Myntra",
    occurrencesCount: 4,
    monthlyAvoidableImpact: 900,
    evidenceItems: [
      { date: "13 Sep (Sun)", item: "Amazon Electronics", amount: 890 },
      { date: "06 Sep (Sat)", item: "Myntra Apparel", amount: 1260 }
    ],
    explanation: "Shopping budget has already exhausted 86% of allowance in 20 days."
  }
];

export const RECOMMENDATIONS = [
  {
    id: "rec_food_reduce_2",
    patternId: "pat_late_food_seq",
    title: "Cut 2 Late-Evening Food Deliveries",
    description: "Prepare quick 15-minute home meals or pre-cook on 2 commute days before Sept 30.",
    estimatedSaving: 1100,
    categoryAffected: "Food & Dining",
    budgetBefore: 6050,
    budgetAfter: 4950,
    budgetCeiling: 5000,
    restoresBudgetTo: "On Track",
    goalImpactDescription: "Redirecting ₹1,100 moves your Laptop savings pace from ₹8,150 to ₹9,250, cutting ETA by 24 days.",
    status: "Active"
  },
  {
    id: "rec_pause_netflix",
    patternId: "pat_subscription_cluster",
    title: "Pause Idle Netflix Subscription",
    description: "Switch Netflix plan to monthly on-demand or pause during busy work sprints.",
    estimatedSaving: 649,
    categoryAffected: "Subscriptions",
    budgetBefore: 1200,
    budgetAfter: 551,
    budgetCeiling: 1000,
    restoresBudgetTo: "On Track",
    goalImpactDescription: "Adds ₹649 directly to your Emergency Reserve fund.",
    status: "Active"
  },
  {
    id: "rec_cap_weekend_shopping",
    patternId: "pat_weekend_shopping",
    title: "Enforce 48-Hour Cart Hold for Shopping",
    description: "Leave non-essential items in cart for 48 hours to eliminate emotional impulsive checkout.",
    estimatedSaving: 500,
    categoryAffected: "Shopping",
    budgetBefore: 3400,
    budgetAfter: 2900,
    budgetCeiling: 2500,
    restoresBudgetTo: "Significantly Improved",
    goalImpactDescription: "Reduces shopping budget variance by 55%.",
    status: "Active"
  }
];

export const INITIAL_TRANSACTIONS = [
  { id: "tx_01", date: "2026-09-20", time: "21:30", merchant: "Swiggy", category: "Food & Dining", amount: 650, paymentMode: "UPI", type: "Expense", status: "Completed", note: "Late dinner order" },
  { id: "tx_02", date: "2026-09-20", time: "20:10", merchant: "Uber", category: "Transport", amount: 320, paymentMode: "UPI", type: "Expense", status: "Completed", note: "Cab from office" },
  { id: "tx_03", date: "2026-09-19", time: "10:00", merchant: "TechCorp Infosys", category: "Income", amount: 40000, paymentMode: "Bank Transfer", type: "Income", status: "Completed", note: "Monthly Salary Credit" },
  { id: "tx_04", date: "2026-09-18", time: "19:45", merchant: "Netflix", category: "Subscriptions", amount: 649, paymentMode: "Card", type: "Expense", status: "Completed", note: "Monthly plan auto-debit" },
  { id: "tx_05", date: "2026-09-18", time: "21:15", merchant: "Swiggy", category: "Food & Dining", amount: 680, paymentMode: "UPI", type: "Expense", status: "Completed", note: "Late evening dinner" },
  { id: "tx_06", date: "2026-09-18", time: "20:30", merchant: "Uber", category: "Transport", amount: 320, paymentMode: "UPI", type: "Expense", status: "Completed", note: "Commute ride" },
  { id: "tx_07", date: "2026-09-17", time: "14:20", merchant: "Spotify", category: "Subscriptions", amount: 119, paymentMode: "Card", type: "Expense", status: "Completed", note: "Music subscription" },
  { id: "tx_08", date: "2026-09-16", time: "18:00", merchant: "Amazon", category: "Shopping", amount: 890, paymentMode: "UPI", type: "Expense", status: "Completed", note: "Wireless mouse" },
  { id: "tx_09", date: "2026-09-15", time: "21:40", merchant: "Zomato", category: "Food & Dining", amount: 620, paymentMode: "UPI", type: "Expense", status: "Completed", note: "Late dinner" },
  { id: "tx_10", date: "2026-09-15", time: "20:20", merchant: "Uber", category: "Transport", amount: 290, paymentMode: "UPI", type: "Expense", status: "Completed", note: "Ride home" },
  { id: "tx_11", date: "2026-09-14", time: "12:15", merchant: "Apollo Pharmacy", category: "Healthcare", amount: 480, paymentMode: "UPI", type: "Expense", status: "Completed", note: "Vitamins and first aid" },
  { id: "tx_12", date: "2026-09-13", time: "17:30", merchant: "PVR Cinemas", category: "Entertainment", amount: 450, paymentMode: "Card", type: "Expense", status: "Completed", note: "Movie ticket" },
  { id: "tx_13", date: "2026-09-12", time: "19:00", merchant: "Myntra", category: "Shopping", amount: 1260, paymentMode: "Card", type: "Expense", status: "Completed", note: "Weekend clothing" },
  { id: "tx_14", date: "2026-09-11", time: "21:20", merchant: "Swiggy", category: "Food & Dining", amount: 690, paymentMode: "UPI", type: "Expense", status: "Completed", note: "Biryani dinner" },
  { id: "tx_15", date: "2026-09-11", time: "20:00", merchant: "Ola Auto", category: "Transport", amount: 190, paymentMode: "UPI", type: "Expense", status: "Completed", note: "Auto from station" },
  { id: "tx_16", date: "2026-09-10", time: "11:00", merchant: "Blinkit", category: "Food & Dining", amount: 450, paymentMode: "UPI", type: "Expense", status: "Completed", note: "Weekly dairy and fruits" },
  { id: "tx_17", date: "2026-09-08", time: "21:40", merchant: "Swiggy", category: "Food & Dining", amount: 710, paymentMode: "UPI", type: "Expense", status: "Completed", note: "Dinner combo" },
  { id: "tx_18", date: "2026-09-08", time: "20:10", merchant: "Uber", category: "Transport", amount: 340, paymentMode: "UPI", type: "Expense", status: "Completed", note: "Office ride" },
  { id: "tx_19", date: "2026-09-05", time: "09:30", merchant: "Airtel Fiber", category: "Utilities & Rent", amount: 799, paymentMode: "UPI", type: "Expense", status: "Completed", note: "High-speed broadband" },
  { id: "tx_20", date: "2026-09-04", time: "21:50", merchant: "Zomato", category: "Food & Dining", amount: 580, paymentMode: "UPI", type: "Expense", status: "Completed", note: "Late bowl" },
  { id: "tx_21", date: "2026-09-04", time: "20:15", merchant: "Uber", category: "Transport", amount: 310, paymentMode: "UPI", type: "Expense", status: "Completed", note: "Evening ride" },
  { id: "tx_22", date: "2026-09-02", time: "16:00", merchant: "BookMyShow", category: "Entertainment", amount: 450, paymentMode: "UPI", type: "Expense", status: "Completed", note: "Standup comedy pass" },
  { id: "tx_23", date: "2026-09-01", time: "09:00", merchant: "Sunrise Apartments (Owner)", category: "Utilities & Rent", amount: 10000, paymentMode: "Bank Transfer", type: "Expense", status: "Completed", note: "Monthly House Rent" },
  { id: "tx_24", date: "2026-09-01", time: "15:00", merchant: "Starbucks", category: "Food & Dining", amount: 270, paymentMode: "Card", type: "Expense", status: "Completed", note: "Client coffee meeting" },
  { id: "tx_25", date: "2026-09-07", time: "13:30", merchant: "Subway", category: "Food & Dining", amount: 280, paymentMode: "UPI", type: "Expense", status: "Completed", note: "Lunch with colleagues" },
  { id: "tx_26", date: "2026-09-14", time: "18:30", merchant: "Shell Petrol Pump", category: "Transport", amount: 650, paymentMode: "Card", type: "Expense", status: "Completed", note: "Bike fuel refill" },
];

export const MOCK_CSV_IMPORT_RECORDS = [
  { row: 1, merchant: "SWIGGY", amount: 420, date: "2026-09-21", detectedCategory: "Food & Dining", confidence: 96, status: "Valid", issue: null },
  { row: 2, merchant: "UBER INDIA", amount: 280, date: "2026-09-21", detectedCategory: "Transport", confidence: 98, status: "Valid", issue: null },
  { row: 3, merchant: "AMAZON PAY", amount: 1450, date: "2026-09-22", detectedCategory: "Shopping", confidence: 91, status: "Valid", issue: null },
  { row: 4, merchant: "NETFLIX", amount: 649, date: "2026-09-18", detectedCategory: "Subscriptions", confidence: 99, status: "Duplicate", issue: "Matches existing txn on 18 Sep" },
  { row: 5, merchant: "APOLLO PHARMACY", amount: 320, date: "2026-09-22", detectedCategory: "Healthcare", confidence: 95, status: "Valid", issue: null },
  { row: 6, merchant: "UNKNOWN_POS_104", amount: 0, date: "2026-09-22", detectedCategory: "Uncategorized", confidence: 30, status: "Incomplete", issue: "Amount is zero / missing data" },
  { row: 7, merchant: "STARBUCKS COFFEE", amount: 350, date: "2026-09-23", detectedCategory: "Food & Dining", confidence: 94, status: "Valid", issue: null },
  { row: 8, merchant: "SWIGGY INSTAMART", amount: 510, date: "2026-09-23", detectedCategory: "Food & Dining", confidence: 93, status: "Valid", issue: null },
  { row: 9, merchant: "ZOMATO RESTAURANT", amount: 720, date: "2026-09-23", detectedCategory: "Food & Dining", confidence: 97, status: "Valid", issue: null },
  { row: 10, merchant: "OLA CABS", amount: 210, date: "2026-09-23", detectedCategory: "Transport", confidence: 97, status: "Valid", issue: null },
  { row: 11, merchant: "RENT OWNER TRANSFER", amount: 10000, date: "2026-09-01", detectedCategory: "Utilities & Rent", confidence: 99, status: "Duplicate", issue: "Duplicate transfer detected" },
  { row: 12, merchant: "INVALID_FIELD_NULL", amount: 150, date: "Invalid Date", detectedCategory: "Uncategorized", confidence: 25, status: "Incomplete", issue: "Invalid timestamp format" },
];

export const NOTIFICATIONS_LIST = [
  { id: "notif_1", type: "warning", title: "Food Budget at Risk", message: "Food spending projected to reach ₹6,050 (₹1,050 over budget).", timestamp: "10 mins ago", link: "/budgets" },
  { id: "notif_2", type: "pattern", title: "New Behavioral Pattern Detected", message: "5 late-evening transport → Swiggy sequences detected.", timestamp: "2 hours ago", link: "/insights" },
  { id: "notif_3", type: "info", title: "Savings Goal Pace Alert", message: "Laptop savings pace is currently ₹8,150 / ₹10,000 required.", timestamp: "Yesterday", link: "/goals" },
  { id: "notif_4", type: "success", title: "Monthly Summary Prepared", message: "September 2026 financial report draft is ready for review.", timestamp: "2 days ago", link: "/summary" },
];

export const MONTHLY_ANALYTICS_DATA = [
  { name: "Apr", income: 38000, expense: 28500, savings: 9500 },
  { name: "May", income: 38000, expense: 31000, savings: 7000 },
  { name: "Jun", income: 40000, expense: 30200, savings: 9800 },
  { name: "Jul", income: 40000, expense: 29400, savings: 10600 },
  { name: "Aug", income: 40000, expense: 29380, savings: 10620 },
  { name: "Sep (Current)", income: 40000, expense: 31850, savings: 8150 },
];

export const WEEKLY_SPENDING_DATA = [
  { week: "Week 1 (Sep 1-7)", actual: 12500, projected: 12500, target: 8000 }, // Rent paid in W1
  { week: "Week 2 (Sep 8-14)", actual: 7200, projected: 7200, target: 7500 },
  { week: "Week 3 (Sep 15-20)", actual: 12150, projected: 12150, target: 8000 },
  { week: "Week 4 (Projected)", actual: 0, projected: 5200, target: 8000 },
];
