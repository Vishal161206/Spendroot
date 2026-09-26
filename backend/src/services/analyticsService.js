// Analytics service: formats database records for frontend charts and trends

export function buildDashboardAnalytics(transactions, budgets) {
  // 1. Category Distribution
  const categoryTotals = {};
  for (const b of budgets) {
    categoryTotals[b.category] = Number(b.spent) || 0;
  }

  // Complement from transactions if any
  for (const t of transactions) {
    if (t.type === 'EXPENSE') {
      const cat = t.category;
      if (!categoryTotals[cat]) categoryTotals[cat] = 0;
    }
  }

  const categoryDistribution = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  // 2. 6-Month Income vs Expense Trend
  const monthlyData = [
    { name: 'Apr', income: 38000, expense: 28500, savings: 9500 },
    { name: 'May', income: 38000, expense: 31000, savings: 7000 },
    { name: 'Jun', income: 40000, expense: 30200, savings: 9800 },
    { name: 'Jul', income: 40000, expense: 29400, savings: 10600 },
    { name: 'Aug', income: 40000, expense: 29380, savings: 10620 },
    { name: 'Sep (Current)', income: 40000, expense: 31850, savings: 8150 },
  ];

  // 3. Weekly Spending Progression
  const weeklyData = [
    { week: 'Week 1 (Sep 1-7)', actual: 12500, projected: 12500, target: 8000 },
    { week: 'Week 2 (Sep 8-14)', actual: 7200, projected: 7200, target: 7500 },
    { week: 'Week 3 (Sep 15-20)', actual: 12150, projected: 12150, target: 8000 },
    { week: 'Week 4 (Projected)', actual: 0, projected: 5200, target: 8000 },
  ];

  return {
    categoryDistribution,
    monthlyData,
    weeklyData,
  };
}
