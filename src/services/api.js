// SpendRoot Full-Stack REST API Client
// Connects to Node.js / Express backend at http://localhost:5000/api

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('spendroot_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('spendroot_token', token);
  } else {
    localStorage.removeItem('spendroot_token');
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.message || 'API request failed');
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.warn(`[API ERROR] ${options.method || 'GET'} ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Authentication
  auth: {
    login: (email, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    getMe: () => request('/auth/me'),
  },

  // Transactions
  transactions: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/transactions${q ? `?${q}` : ''}`);
    },
    create: (txData) =>
      request('/transactions', {
        method: 'POST',
        body: JSON.stringify(txData),
      }),
    delete: (id) =>
      request(`/transactions/${id}`, {
        method: 'DELETE',
      }),
  },

  // Budgets
  budgets: {
    getAll: () => request('/budgets'),
    create: (budgetData) =>
      request('/budgets', {
        method: 'POST',
        body: JSON.stringify(budgetData),
      }),
    update: (id, amount) =>
      request(`/budgets/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ amount }),
      }),
    delete: (id) =>
      request(`/budgets/${id}`, {
        method: 'DELETE',
      }),
  },

  // Savings Goals
  goals: {
    getAll: () => request('/goals'),
    create: (goalData) =>
      request('/goals', {
        method: 'POST',
        body: JSON.stringify(goalData),
      }),
    contribute: (id, amount) =>
      request(`/goals/${id}/contribute`, {
        method: 'POST',
        body: JSON.stringify({ amount }),
      }),
    delete: (id) =>
      request(`/goals/${id}`, {
        method: 'DELETE',
      }),
  },

  // Dashboard & Analytics
  dashboard: {
    getSummary: () => request('/dashboard/summary'),
    getAnalytics: () => request('/dashboard/analytics'),
  },

  // AI Insights & What-If Simulator
  insights: {
    getAll: () => request('/insights'),
    simulate: (params) =>
      request('/insights/simulate', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    applyRecommendation: (id) =>
      request(`/insights/recommendations/${id}/apply`, {
        method: 'POST',
      }),
  },

  // CSV Import
  importData: {
    importTransactions: (records) =>
      request('/import/transactions', {
        method: 'POST',
        body: JSON.stringify({ records }),
      }),
  },

  // Settings
  settings: {
    get: () => request('/settings'),
    update: (data) =>
      request('/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Health
  health: () => request('/health'),
};

export default api;
