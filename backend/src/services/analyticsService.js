// Analytics service: formats database records for frontend charts and trends

function getDayOfMonth(t) {
  const dStr = t.transaction_date || t.date;
  if (!dStr) return 0;
  const d = new Date(dStr);
  return isNaN(d.getTime()) ? 0 : d.getDate();
}

export function buildDashboardAnalytics(transactions = [], budgets = []) {
  // 1. Category Distribution — Sum actual transaction amounts per category
  const categoryTotals = {};
  for (const t of transactions) {
    if (t.type === 'EXPENSE' || t.type === 'Expense') {
      const cat = t.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(t.amount || 0);
    }
  }

  // Include any configured budget categories with 0 spend so they appear in distribution
  for (const b of budgets) {
    const cat = b.category || b.categoryName;
    if (cat && categoryTotals[cat] === undefined) {
      categoryTotals[cat] = 0;
    }
  }

  const categoryDistribution = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));

  // 2. Real Monthly Income vs Expense Trend
  const monthsMap = {};
  for (const t of transactions) {
    const dStr = t.transaction_date || t.date;
    if (!dStr) continue;
    const d = new Date(dStr);
    if (isNaN(d.getTime())) continue;
    const mName = d.toLocaleString('en-US', { month: 'short' });
    if (!monthsMap[mName]) {
      monthsMap[mName] = { name: mName, income: 0, expense: 0, savings: 0 };
    }
    const amt = Number(t.amount || 0);
    if (t.type === 'INCOME' || t.type === 'Income') {
      monthsMap[mName].income += amt;
    } else {
      monthsMap[mName].expense += amt;
    }
  }

  for (const m of Object.values(monthsMap)) {
    m.savings = Math.max(0, m.income - m.expense);
  }

  let monthlyData = Object.values(monthsMap);
  if (monthlyData.length === 0) {
    const curMonthName = new Date().toLocaleString('en-US', { month: 'short' });
    monthlyData = [{ name: curMonthName, income: 0, expense: 0, savings: 0 }];
  }

  // 3. Weekly Spending Progression from Real Transactions
  const totalMonthlyBudget = budgets.reduce((sum, b) => sum + Number(b.amount || b.budget || 0), 0) || 30000;
  const weeklyTarget = Math.round(totalMonthlyBudget / 4);

  const week1Txns = transactions.filter(t => (t.type === 'EXPENSE' || t.type === 'Expense') && getDayOfMonth(t) >= 1 && getDayOfMonth(t) <= 7);
  const week2Txns = transactions.filter(t => (t.type === 'EXPENSE' || t.type === 'Expense') && getDayOfMonth(t) >= 8 && getDayOfMonth(t) <= 14);
  const week3Txns = transactions.filter(t => (t.type === 'EXPENSE' || t.type === 'Expense') && getDayOfMonth(t) >= 15 && getDayOfMonth(t) <= 21);
  const week4Txns = transactions.filter(t => (t.type === 'EXPENSE' || t.type === 'Expense') && getDayOfMonth(t) >= 22);

  const w1Actual = week1Txns.reduce((s, t) => s + Number(t.amount || 0), 0);
  const w2Actual = week2Txns.reduce((s, t) => s + Number(t.amount || 0), 0);
  const w3Actual = week3Txns.reduce((s, t) => s + Number(t.amount || 0), 0);
  const w4Actual = week4Txns.reduce((s, t) => s + Number(t.amount || 0), 0);

  const weeklyData = [
    { week: 'Week 1', actual: Math.round(w1Actual), projected: Math.round(w1Actual), target: weeklyTarget },
    { week: 'Week 2', actual: Math.round(w2Actual), projected: Math.round(w2Actual), target: weeklyTarget },
    { week: 'Week 3', actual: Math.round(w3Actual), projected: Math.round(w3Actual), target: weeklyTarget },
    { week: 'Week 4', actual: Math.round(w4Actual), projected: Math.round(w4Actual || weeklyTarget), target: weeklyTarget },
  ];

  return {
    categoryDistribution,
    monthlyData,
    weeklyData,
  };
}
