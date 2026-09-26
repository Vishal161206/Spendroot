const http = require('http');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING BACKEND REST API & AI ENGINE VERIFICATION ===');

  // 1. Health Check
  const health = await request({ host: '127.0.0.1', port: 5000, path: '/api/health', method: 'GET' });
  console.log('1. Health Check:', health.status === 200 ? 'PASS' : 'FAIL', health.data.message);

  // 2. Login User 1 (Vishal)
  const loginRes = await request({
    host: '127.0.0.1', port: 5000, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'demo@spendroot.com', password: 'Demo@123' });
  console.log('2. Login Vishal:', loginRes.status === 200 ? 'PASS' : 'FAIL', 'User:', loginRes.data.data?.user?.name);
  const token = loginRes.data.data?.token;

  // 3. Current User (/api/auth/me)
  const meRes = await request({
    host: '127.0.0.1', port: 5000, path: '/api/auth/me', method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('3. Get Current User (/api/auth/me):', meRes.status === 200 ? 'PASS' : 'FAIL', meRes.data.data?.user?.email);

  // 4. Fetch Transactions
  const txRes = await request({
    host: '127.0.0.1', port: 5000, path: '/api/transactions', method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('4. Fetch Transactions:', txRes.status === 200 ? 'PASS' : 'FAIL', `Count: ${txRes.data.count}`);

  // 5. Create Transaction
  const addTxRes = await request({
    host: '127.0.0.1', port: 5000, path: '/api/transactions', method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  }, { merchant: 'Zomato Biryani', amount: 450, category: 'Food & Dining', paymentMode: 'UPI', type: 'Expense' });
  console.log('5. Create Transaction:', addTxRes.status === 201 ? 'PASS' : 'FAIL', 'Tx ID:', addTxRes.data.data?.id);

  // 6. Fetch Budgets with Velocity Forecast
  const budgetRes = await request({
    host: '127.0.0.1', port: 5000, path: '/api/budgets', method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('6. Fetch Budgets (with Forecast):', budgetRes.status === 200 ? 'PASS' : 'FAIL', 'Food Status:', budgetRes.data.data?.find(b => b.categoryName === 'Food & Dining')?.status);

  // 7. Fetch Goals
  const goalRes = await request({
    host: '127.0.0.1', port: 5000, path: '/api/goals', method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('7. Fetch Goals:', goalRes.status === 200 ? 'PASS' : 'FAIL', 'Goals Count:', goalRes.data.data?.length);

  // 8. Fetch Dashboard Summary
  const dashRes = await request({
    host: '127.0.0.1', port: 5000, path: '/api/dashboard/summary', method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('8. Dashboard Summary:', dashRes.status === 200 ? 'PASS' : 'FAIL', 'Total Income:', dashRes.data.data?.totalIncome, 'Expenses:', dashRes.data.data?.totalExpenses);

  // 9. AI Insights & Pattern Detection
  const insightRes = await request({
    host: '127.0.0.1', port: 5000, path: '/api/insights', method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('9. AI Insights & Patterns:', insightRes.status === 200 ? 'PASS' : 'FAIL',
    'Pattern Detected:', insightRes.data.data?.patterns?.[0]?.title,
    'Health Score:', insightRes.data.data?.healthScore);

  // 10. What-If Simulation Engine
  const simRes = await request({
    host: '127.0.0.1', port: 5000, path: '/api/insights/simulate', method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  }, { foodReductionTxCount: 2, removeNetflix: true });
  console.log('10. What-If Simulation API:', simRes.status === 200 ? 'PASS' : 'FAIL',
    'Savings Gain: ₹' + simRes.data.data?.savingsDelta,
    'Food Status After:', simRes.data.data?.food?.statusAfter);

  // 11. SECURITY TEST: User Isolation
  // Login as User 2 (Priya)
  const loginPriya = await request({
    host: '127.0.0.1', port: 5000, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'priya@spendroot.com', password: 'Demo@123' });
  const priyaToken = loginPriya.data.data?.token;

  const priyaTx = await request({
    host: '127.0.0.1', port: 5000, path: '/api/transactions', method: 'GET',
    headers: { 'Authorization': `Bearer ${priyaToken}` }
  });
  const priyaCanSeeVishal = priyaTx.data.data?.some(t => t.merchant === 'Swiggy' || t.merchant === 'TechCorp Infosys');
  console.log('11. Security Isolation Test (User A vs User B):', !priyaCanSeeVishal ? 'PASS (Isolated)' : 'FAIL (Leaked)');

  console.log('=== ALL 11 BACKEND API & INTELLIGENCE TESTS COMPLETE ===');
}

runTests().catch(console.error);
