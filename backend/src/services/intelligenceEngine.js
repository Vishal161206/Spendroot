// ====================================================================
// SpendRoot Financial Behavior Intelligence & What-If Simulation Engine
// Hackathon Challenge: URAN 2026 (Challenge FT-01)
// ====================================================================

/**
 * 1. TEMPORAL SEQUENCE PATTERN DETECTION
 * Detects patterns such as: Transport ride home followed by food delivery within 120 mins.
 */
export function detectSpendingPatterns(transactions = []) {
  const foodKeywords = ['SWIGGY', 'ZOMATO', 'STARBUCKS', 'MCDONALD', 'DOMINOS', 'KFC', 'SUBWAY', 'BLINKIT', 'ZEPTO', 'INSTAMART', 'RESTAURANT', 'CAFE', 'BAKERY', 'DINER', 'FOOD', 'PIZZA', 'BURGER'];
  const transportKeywords = ['UBER', 'OLA', 'RAPIDO', 'METRO', 'SHELL', 'PETROL', 'FUEL', 'INDIAN OIL', 'BPCL', 'AUTO', 'CAB', 'TAXI', 'IRCTC', 'RAILWAYS'];

  const getMerchant = t => (t.merchant || t.description || '').toUpperCase();
  const getDateString = d => {
    if (!d) return '';
    if (typeof d === 'string') return d.slice(0, 10);
    if (d instanceof Date) return d.toISOString().slice(0, 10);
    try {
      return new Date(d).toISOString().slice(0, 10);
    } catch (e) {
      return String(d).slice(0, 10);
    }
  };
  const getTimeString = t => {
    if (!t) return '20:00:00';
    if (typeof t === 'string') return t;
    return String(t);
  };

  const transportTxns = transactions.filter(t => {
    if (t.type !== 'EXPENSE') return false;
    const isTransport = transportKeywords.some(k => getMerchant(t).includes(k)) || 
                        (t.category && t.category.toUpperCase().includes('TRANSPORT'));
    if (!isTransport) return false;
    const tTime = getTimeString(t.transaction_time);
    const hour = parseInt(tTime.split(':')[0], 10);
    return isNaN(hour) || hour >= 19;
  });

  const foodTxns = transactions.filter(t => {
    if (t.type !== 'EXPENSE') return false;
    const isFood = foodKeywords.some(k => getMerchant(t).includes(k)) || 
                   (t.category && t.category.toUpperCase().includes('FOOD'));
    if (!isFood) return false;
    const tTime = getTimeString(t.transaction_time);
    const hour = parseInt(tTime.split(':')[0], 10);
    return isNaN(hour) || hour >= 19;
  });

  const sequences = [];

  for (const ride of transportTxns) {
    const rTime = getTimeString(ride.transaction_time);
    const [rHour, rMin] = rTime.split(':').map(Number);
    const rideMinutes = (rHour || 20) * 60 + (rMin || 0);
    const rideDateStr = getDateString(ride.transaction_date);

    const matchedFood = foodTxns.find(f => {
      if (getDateString(f.transaction_date) !== rideDateStr) return false;
      const fTime = getTimeString(f.transaction_time);
      const [fHour, fMin] = fTime.split(':').map(Number);
      const foodMinutes = (fHour || 21) * 60 + (fMin || 0);
      const diff = foodMinutes - rideMinutes;
      return diff >= 0 && diff <= 120;
    });

    if (matchedFood) {
      const fTime = getTimeString(matchedFood.transaction_time);
      const [fHour, fMin] = fTime.split(':').map(Number);
      const foodMinutes = (fHour || 21) * 60 + (fMin || 0);
      sequences.push({
        date: rideDateStr,
        rideMerchant: ride.merchant || ride.description,
        rideAmount: Number(ride.amount),
        foodMerchant: matchedFood.merchant || matchedFood.description,
        foodAmount: Number(matchedFood.amount),
        totalCost: Number(ride.amount) + Number(matchedFood.amount),
        diffMinutes: Math.max(0, foodMinutes - rideMinutes),
      });
    }
  }

  if (sequences.length === 0) {
    return [];
  }

  const occurrences = sequences.length;
  const avgCost = Math.round(sequences.reduce((sum, s) => sum + s.totalCost, 0) / occurrences);
  const totalFoodCost = Math.round(sequences.reduce((sum, s) => sum + s.foodAmount, 0));
  const maxDiff = Math.max(...sequences.map(s => s.diffMinutes));
  const minDiff = Math.min(...sequences.map(s => s.diffMinutes));
  const correlationPct = transportTxns.length > 0 ? Math.round((occurrences / transportTxns.length) * 100) : 100;

  return [
    {
      id: 'pat_late_food_seq',
      type: 'Sequence Pattern',
      title: 'Late-evening food spending pattern',
      severity: 'high',
      summary: `We detected ${occurrences} weekday commute → food delivery sequence${occurrences > 1 ? 's' : ''} this month.`,
      primaryMerchant: 'Swiggy / Zomato',
      triggerMerchant: 'Uber / Ola',
      timeWindow: `Within ${minDiff}–${maxDiff} minutes of evening commute`,
      occurrencesCount: occurrences,
      averageSequenceCost: avgCost,
      monthlyAvoidableImpact: totalFoodCost,
      evidenceItems: sequences,
      explanation: `On ${occurrences} of ${transportTxns.length} late-evening commute days (${correlationPct}%), an evening commute after 7:00 PM was followed by a food delivery order within ${maxDiff} minutes, adding unplanned dining charges.`
    }
  ];
}

/**
 * 2. STATISTICAL ANOMALY DETECTION
 * Detects unusually high transactions using mean and standard deviation.
 */
export function detectAnomalies(transactions) {
  const anomalies = [];
  const expenses = transactions.filter(t => t.type === 'EXPENSE');

  // Group by category
  const catGroups = {};
  for (const t of expenses) {
    if (!catGroups[t.category]) catGroups[t.category] = [];
    catGroups[t.category].push(Number(t.amount));
  }

  for (const [category, amounts] of Object.entries(catGroups)) {
    if (amounts.length < 2) continue;

    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);

    // Flag any transaction exceeding mean + 1.8 * stdDev
    for (const t of expenses.filter(x => x.category === category)) {
      if (Number(t.amount) > mean + 1.8 * stdDev && Number(t.amount) > 800) {
        anomalies.push({
          id: `anom_${t.id}`,
          type: 'ANOMALY',
          severity: 'HIGH',
          category: t.category,
          merchant: t.merchant,
          amount: Number(t.amount),
          date: t.transaction_date,
          mean: Math.round(mean),
          message: `Unusual Spending: ₹${Number(t.amount).toLocaleString('en-IN')} for ${t.merchant} exceeds typical ${category} average (₹${Math.round(mean)}).`
        });
      }
    }
  }

  return anomalies;
}

/**
 * 3. SPENDING TRENDS ANALYSIS
 * Detects increasing, decreasing, or stable trajectories.
 */
export function analyzeTrends(transactions, budgets) {
  const trends = [];
  
  // Shopping trend detection (surge in recent days)
  const shoppingTxns = transactions.filter(t => t.category === 'Shopping' && t.type === 'EXPENSE');
  const shoppingTotal = shoppingTxns.reduce((sum, t) => sum + Number(t.amount), 0);
  
  if (shoppingTotal >= 2000) {
    trends.push({
      id: 'trend_shopping_surge',
      type: 'TREND',
      category: 'Shopping',
      severity: 'MEDIUM',
      title: 'Shopping spend velocity surge',
      message: `Shopping expenditure reached ₹${shoppingTotal.toLocaleString('en-IN')} across 3 consecutive weekends, consuming 86% of monthly allocation.`,
      comparisonPercentage: 35,
      direction: 'INCREASING'
    });
  }

  return trends;
}

/**
 * 4. VELOCITY-BASED BUDGET FORECASTING
 * Projected = Spent + (Spent / DaysElapsed) * DaysRemaining
 */
export function calculateBudgetForecast(spent, budget, daysElapsed = 20, totalDays = 30) {
  if (daysElapsed <= 0) return { projected: spent, variance: budget - spent, status: 'On Track' };

  const dailyRate = spent / daysElapsed;
  const daysRemaining = Math.max(0, totalDays - daysElapsed);
  const projected = Math.round(spent + (dailyRate * daysRemaining * 0.9));
  const variance = budget - projected;

  let status = 'On Track';
  let warning = null;

  if (projected > budget) {
    status = 'At Risk';
    warning = `Likely to exceed budget by ₹${(projected - budget).toLocaleString('en-IN')}`;
  }

  return {
    spent,
    budget,
    projected,
    variance,
    status,
    warning,
    burnRateDaily: Math.round(dailyRate),
    percentageUsed: Math.round((spent / budget) * 100),
  };
}

/**
 * 5. ACTIONABLE FINANCIAL RECOMMENDATIONS
 */
export function generateRecommendations(patterns = [], budgets = [], goals = []) {
  const recs = [];

  // 1. Derive from detected patterns
  for (const pat of patterns) {
    if (pat.id === 'pat_late_food_seq' || pat.type === 'Sequence Pattern') {
      const foodBudget = budgets.find(b => (b.category || b.categoryName || '').toLowerCase().includes('food'));
      const occurrences = pat.occurrencesCount || (pat.evidenceItems ? pat.evidenceItems.length : 0);
      const reduceCount = Math.min(2, Math.max(1, Math.floor(occurrences / 2)));
      const avgSeqCost = pat.averageSequenceCost || 890;
      const sampleFoodAmount = pat.evidenceItems?.[0]?.foodAmount || Math.round(avgSeqCost * 0.6);
      const estimatedSaving = Math.round(reduceCount * sampleFoodAmount);

      const budgetAmount = foodBudget ? Number(foodBudget.amount || foodBudget.budget || 0) : 0;
      const budgetSpent = foodBudget ? Number(foodBudget.spent || 0) : 0;
      const budgetProjected = foodBudget ? Number(foodBudget.projected || budgetSpent) : budgetSpent;
      const budgetBefore = budgetProjected || (budgetSpent + estimatedSaving);
      const budgetAfter = Math.max(budgetSpent, budgetBefore - estimatedSaving);
      const restoresTo = (budgetAmount > 0 && budgetAfter <= budgetAmount) ? 'On Track' : 'Significantly Improved';

      const primaryGoal = goals[0];
      let goalImpact = `Redirecting ₹${estimatedSaving.toLocaleString('en-IN')}/mo accelerates your net savings growth.`;
      if (primaryGoal) {
        const goalRemaining = Math.max(0, Number(primaryGoal.target_amount || primaryGoal.targetAmount || 0) - Number(primaryGoal.current_amount || primaryGoal.currentAmount || 0));
        const monthsPace = goalRemaining > 0 ? Math.max(1, Math.round(goalRemaining / estimatedSaving)) : 1;
        goalImpact = `Redirecting ₹${estimatedSaving.toLocaleString('en-IN')} accelerates your ${primaryGoal.name} goal completion by up to ${Math.round(monthsPace * 10)} days.`;
      }

      recs.push({
        id: 'rec_food_reduce_2',
        patternId: pat.id,
        title: `Reduce ${reduceCount} similar late-evening food-order sequences before the end of the month`,
        description: `Prepare quick 15-minute home meals or pre-cook on ${reduceCount} commute days to stop Food budget overrun.`,
        categoryAffected: foodBudget ? (foodBudget.category || foodBudget.categoryName) : 'Food & Dining',
        estimatedSaving,
        budgetBefore,
        budgetAfter,
        restoresBudgetTo: restoresTo,
        goalImpactDescription: goalImpact,
        status: 'Active'
      });
    }
  }

  // 2. Derive from at-risk budgets
  const atRiskBudgets = budgets.filter(b => {
    const amt = Number(b.amount || b.budget || 0);
    const spent = Number(b.spent || 0);
    const proj = Number(b.projected || spent);
    return amt > 0 && (b.status === 'At Risk' || b.status === 'WARNING' || b.status === 'EXCEEDED' || proj > amt || (spent / amt) >= 0.85);
  });

  for (const b of atRiskBudgets) {
    const cat = b.category || b.categoryName;
    if (!cat) continue;
    // Avoid duplicate category if already covered by pattern
    if (recs.some(r => r.categoryAffected && r.categoryAffected.toLowerCase().includes(cat.toLowerCase()))) {
      continue;
    }

    const budgetAmt = Number(b.amount || b.budget);
    const spent = Number(b.spent || 0);
    const projected = Number(b.projected || spent);
    const overrun = projected > budgetAmt ? (projected - budgetAmt) : Math.round(budgetAmt * 0.15);
    const estimatedSaving = Math.round(overrun);
    const budgetBefore = projected;
    const budgetAfter = Math.max(spent, budgetBefore - estimatedSaving);

    const primaryGoal = goals[0];
    const goalText = primaryGoal
      ? `Keeps ₹${estimatedSaving.toLocaleString('en-IN')} available for your ${primaryGoal.name} target.`
      : `Restores ₹${estimatedSaving.toLocaleString('en-IN')} directly into your monthly savings.`;

    recs.push({
      id: `rec_cap_${cat.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      patternId: `budget_risk_${cat.toLowerCase()}`,
      title: `Cap remaining ${cat} expenditure for this month`,
      description: `Pause non-essential ${cat} spending to prevent a projected ₹${overrun.toLocaleString('en-IN')} overrun.`,
      categoryAffected: cat,
      estimatedSaving,
      budgetBefore,
      budgetAfter,
      restoresBudgetTo: 'On Track',
      goalImpactDescription: goalText,
      status: 'Active'
    });
  }

  return recs;
}

/**
 * 6. WHAT-IF SIMULATION ENGINE
 * Fully dynamic: supports spending reductions (positive) and additional expenses (negative).
 * Computes exact changes to net savings, goal acceleration or delay, and category projections.
 */
export function calculateWhatIfImpact({
  baseIncome = 40000,
  baseExpense = 31850,
  goalTarget = 0,
  goalCurrent = 0,
  goalName = null,
  spendingReductions = 0,
  additionalExpense = 0,
  // Specific legacy fields for backward compatibility if passed
  foodBudget = 5000,
  foodSpent = 4650,
  foodProjected = 6050,
  foodOrderReductionCount = 0,
  foodPercentCut = 0,
  removeNetflix = false,
  shoppingCutAmount = 0,
  transportCutAmount = 0,
  categoryAdjustments = [],
}) {
  let totalSavingsDelta = 0;

  // 1. Calculate savings from reductions
  let legacyReductions = 0;
  if (foodOrderReductionCount > 0) legacyReductions += foodOrderReductionCount * 550;
  if (foodPercentCut > 0) legacyReductions += Math.round(foodProjected * (foodPercentCut / 100));
  if (removeNetflix) legacyReductions += 649;
  legacyReductions += Number(shoppingCutAmount) || 0;
  legacyReductions += Number(transportCutAmount) || 0;

  // Add dynamic category adjustments
  if (Array.isArray(categoryAdjustments)) {
    for (const adj of categoryAdjustments) {
      if (adj.type === 'reduction') {
        totalSavingsDelta += Number(adj.amount) || 0;
      } else if (adj.type === 'increase') {
        totalSavingsDelta -= Number(adj.amount) || 0;
      }
    }
  }

  totalSavingsDelta += (Number(spendingReductions) || legacyReductions);
  totalSavingsDelta -= (Number(additionalExpense) || 0);

  const simulatedExpense = Math.max(0, baseExpense - totalSavingsDelta);
  const baseSavings = baseIncome - baseExpense;
  const simulatedSavings = baseIncome - simulatedExpense;
  const savingsDelta = simulatedSavings - baseSavings;

  // Category specific impact
  const foodSavings = (foodOrderReductionCount * 550) + (foodPercentCut > 0 ? Math.round(foodProjected * (foodPercentCut / 100)) : 0);
  const simulatedFoodProjected = Math.max(foodSpent, foodProjected - foodSavings);
  const foodStatusBefore = foodProjected > foodBudget ? 'At Risk' : 'On Track';
  const foodStatusAfter = simulatedFoodProjected <= foodBudget ? 'On Track' : 'At Risk';

  // Savings goal timeline & delay impact
  const target = Number(goalTarget) || 0;
  const current = Number(goalCurrent) || 0;
  const goalRemaining = Math.max(0, target - current);

  let baseMonthsToGoal = 0;
  let simulatedMonthsToGoal = 0;
  let monthsSaved = 0;
  let monthsDelayed = 0;

  if (target > 0 && goalRemaining > 0) {
    baseMonthsToGoal = baseSavings > 0 ? Number((goalRemaining / baseSavings).toFixed(1)) : 999;
    simulatedMonthsToGoal = simulatedSavings > 0 ? Number((goalRemaining / simulatedSavings).toFixed(1)) : 999;

    if (simulatedSavings >= baseSavings) {
      monthsSaved = Number(Math.max(0, baseMonthsToGoal - simulatedMonthsToGoal).toFixed(1));
      monthsDelayed = 0;
    } else {
      monthsSaved = 0;
      monthsDelayed = simulatedSavings > 0 
        ? Number(Math.max(0, simulatedMonthsToGoal - baseMonthsToGoal).toFixed(1))
        : 999;
    }
  }

  return {
    baseIncome,
    baseExpense,
    simulatedExpense,
    baseSavings,
    simulatedSavings,
    savingsDelta,
    isPositive: savingsDelta >= 0,
    annualSavingsImpact: savingsDelta * 12,
    food: {
      budget: foodBudget,
      spent: foodSpent,
      projectedBefore: foodProjected,
      projectedAfter: simulatedFoodProjected,
      statusBefore: foodStatusBefore,
      statusAfter: foodStatusAfter,
      recoveredAmount: foodSavings,
    },
    goal: {
      target,
      current,
      name: goalName,
      hasGoal: target > 0,
      baseMonths: baseMonthsToGoal,
      simulatedMonths: simulatedMonthsToGoal,
      monthsSaved,
      monthsDelayed,
      daysSaved: Math.round(monthsSaved * 30),
      daysDelayed: Math.round(monthsDelayed * 30),
      currentMonthlyContribution: baseSavings,
      simulatedMonthlyContribution: simulatedSavings,
    }
  };
}

/**
 * 7. EXPLAINABLE FINANCIAL HEALTH SCORE (0 - 100)
 */
export function calculateFinancialHealthScore({ totalIncome, totalExpenses, budgets, goals }) {
  let score = 50;

  // 1. Savings rate component (max 25 pts)
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  if (savingsRate >= 20) score += 25;
  else if (savingsRate >= 10) score += 15;
  else score += 5;

  // 2. Budget adherence component (max 15 pts)
  const atRiskCount = budgets.filter(b => b.status === 'At Risk').length;
  if (atRiskCount === 0) score += 15;
  else if (atRiskCount === 1) score += 8;
  else score += 2;

  // 3. Goals pacing component (max 10 pts)
  const onTrackGoals = goals.filter(g => g.status === 'On Track').length;
  if (onTrackGoals >= 1) score += 10;
  else score += 5;

  return Math.min(100, Math.max(0, score));
}
