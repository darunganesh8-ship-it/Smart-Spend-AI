
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Wallet, ArrowLeftRight, ChartNoAxesCombined,
  Settings, Bell, Search, Plus, TrendingUp, TrendingDown,
  CreditCard, Sparkles, ShoppingBag, Utensils, Car,
  ChevronDown, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  Menu, X
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const weeklyData = [
  { day: 'Mon', income: 3200, expenses: 1800 },
  { day: 'Tue', income: 2800, expenses: 2200 },
  { day: 'Wed', income: 4100, expenses: 1600 },
  { day: 'Thu', income: 3500, expenses: 2900 },
  { day: 'Fri', income: 4800, expenses: 2100 },
  { day: 'Sat', income: 3900, expenses: 2600 },
  { day: 'Sun', income: 5200, expenses: 1900 }
];

const categories = [
  { name: 'Shopping', value: 4200, color: '#8B5CF6' },
  { name: 'Food & Dining', value: 3100, color: '#22D3EE' },
  { name: 'Transport', value: 1800, color: '#F59E0B' },
  { name: 'Entertainment', value: 1400, color: '#EC4899' },
  { name: 'Others', value: 1200, color: '#64748B' }
];

const initialTransactions = [
  { name: 'Amazon', category: 'Shopping', date: 'Today, 10:42 AM', amount: -2499, icon: ShoppingBag, color: 'purple' },
  { name: 'Swiggy', category: 'Food & Dining', date: 'Today, 09:15 AM', amount: -450, icon: Utensils, color: 'orange' },
  { name: 'Uber', category: 'Transport', date: 'Yesterday', amount: -320, icon: Car, color: 'blue' },
  { name: 'Monthly Allowance', category: 'Income', date: 'Yesterday', amount: 15000, icon: Wallet, color: 'green' },
  { name: 'Netflix', category: 'Entertainment', date: 'Nov 20, 2026', amount: -649, icon: CreditCard, color: 'pink' }
];

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Transactions', icon: ArrowLeftRight },
  { label: 'Budgets', icon: Wallet },
  { label: 'Analytics', icon: ChartNoAxesCombined }
];

function App() {
  const [active, setActive] = useState('Overview');
  const [transactions, setTransactions] = useState(initialTransactions);
  const [showModal, setShowModal] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [form, setForm] = useState({ name: '', amount: '', category: 'Shopping', type: 'expense' });

  const addTransaction = (e) => {
    e.preventDefault();
    if (!form.name || !form.amount || Number(form.amount) <= 0) return;
    const icons = {
      Shopping: ShoppingBag,
      'Food & Dining': Utensils,
      Transport: Car,
      Income: Wallet
    };
    setTransactions([
      {
        name: form.name,
        category: form.type === 'income' ? 'Income' : form.category,
        date: 'Just now',
        amount: form.type === 'income' ? Number(form.amount) : -Number(form.amount),
        icon: icons[form.type === 'income' ? 'Income' : form.category] || CreditCard,
        color: 'purple'
      },
      ...transactions
    ]);
    setShowModal(false);
    setForm({ name: '', amount: '', category: 'Shopping', type: 'expense' });
  };

  const totalBalance = 24850;
  const totalIncome = 45000;
  const totalExpenses = 20150;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon"><Sparkles size={22} /></div>
          <span>smart<span className="brand-accent">spend</span></span>
          <button className="mobile-close" onClick={() => setMobileMenu(false)}><X /></button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {navItems.map(item => (
            <button key={item.label}
              className={`nav-item ${active === item.label ? 'active' : ''}`}
              onClick={() => { setActive(item.label); setMobileMenu(false); }}>
              <item.icon size={19} />
              <span>{item.label}</span>
              {item.label === 'Transactions' && <span className="nav-count">{transactions.length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="workspace-label">PREFERENCES</div>
          <button className="nav-item"><Settings size={19} /><span>Settings</span></button>
          <div className="upgrade-card">
            <div className="upgrade-icon"><Sparkles size={18} /></div>
            <strong>Smarter finances.</strong>
            <p>Discover insights and make better money decisions.</p>
            <button onClick={() => setActive('Analytics')}>Explore analytics <ArrowUpRight size={14} /></button>
          </div>
          <div className="profile">
            <div className="avatar">D</div>
            <div className="profile-info"><strong>My Account</strong><span>Personal workspace</span></div>
            <MoreHorizontal size={19} />
          </div>
        </div>
      </aside>

      {mobileMenu && <div className="mobile-overlay" onClick={() => setMobileMenu(false)} />}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu" onClick={() => setMobileMenu(true)}><Menu /></button>
            <div className="breadcrumb">Workspace <span>/</span> <strong>{active}</strong></div>
          </div>
          <div className="topbar-actions">
            <button className="search-button"><Search size={18} /><span>Search</span><kbd>⌘ K</kbd></button>
            <button className="notification"><Bell size={19} /><i /></button>
            <div className="top-avatar">D</div>
          </div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow"><span className="status-dot" /> YOUR FINANCIAL OVERVIEW</div>
              <h1>{active === 'Overview' ? 'Good morning.' : active}</h1>
              <p>Here's what's happening with your money.</p>
            </div>
            <button className="primary-button" onClick={() => setShowModal(true)}>
              <Plus size={18} /> Add transaction
            </button>
          </div>

          <section className="stats-grid">
            <motion.div className="stat-card balance-card" whileHover={{ y: -3 }}>
              <div className="stat-top"><span>Total balance</span><div className="stat-icon violet"><Wallet size={19} /></div></div>
              <h2>₹{totalBalance.toLocaleString('en-IN')}</h2>
              <div className="stat-foot"><span className="positive"><TrendingUp size={14} /> 12.8%</span><span>vs last month</span></div>
              <div className="balance-glow" />
            </motion.div>
            <motion.div className="stat-card" whileHover={{ y: -3 }}>
              <div className="stat-top"><span>Total income</span><div className="stat-icon green"><ArrowDownRight size={20} /></div></div>
              <h2>₹{totalIncome.toLocaleString('en-IN')}</h2>
              <div className="stat-foot"><span className="positive"><TrendingUp size={14} /> 8.2%</span><span>vs last month</span></div>
            </motion.div>
            <motion.div className="stat-card" whileHover={{ y: -3 }}>
              <div className="stat-top"><span>Total expenses</span><div className="stat-icon orange"><ArrowUpRight size={19} /></div></div>
              <h2>₹{totalExpenses.toLocaleString('en-IN')}</h2>
              <div className="stat-foot"><span className="negative"><TrendingUp size={14} /> 4.6%</span><span>vs last month</span></div>
            </motion.div>
          </section>

          <section className="dashboard-grid">
            <div className="panel spending-panel">
              <div className="panel-heading">
                <div><h3>Financial activity</h3><p>Track your income and expenses</p></div>
                <button className="select-button">This week <ChevronDown size={15} /></button>
              </div>
              <div className="chart-legend">
                <span><i className="legend-income" /> Income</span>
                <span><i className="legend-expense" /> Expenses</span>
              </div>
              <div className="activity-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#242938" strokeDasharray="4 5" vertical={false} />
                    <XAxis dataKey="day" stroke="#777F91" tickLine={false} axisLine={false} />
                    <YAxis stroke="#777F91" tickLine={false} axisLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                    <Tooltip contentStyle={{ background: '#171B29', border: '1px solid #30364A', borderRadius: 12, color: '#fff' }} />
                    <Area type="monotone" dataKey="income" stroke="#9B7AFB" strokeWidth={2.5} fill="url(#incomeGradient)" />
                    <Area type="monotone" dataKey="expenses" stroke="#22D3EE" strokeWidth={2.5} fill="url(#expenseGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="panel category-panel">
              <div className="panel-heading">
                <div><h3>Spending breakdown</h3><p>Where your money goes</p></div>
                <button className="dots-button"><MoreHorizontal /></button>
              </div>
              <div className="donut-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categories} dataKey="value" nameKey="name" innerRadius={67} outerRadius={91} paddingAngle={5} stroke="none">
                      {categories.map((item, index) => <Cell key={index} fill={item.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#171B29', border: '1px solid #30364A', borderRadius: 10, color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center"><strong>₹11.7k</strong><span>Total spent</span></div>
              </div>
              <div className="category-list">
                {categories.map(item => (
                  <div className="category-row" key={item.name}>
                    <span className="category-name"><i style={{ background: item.color }} />{item.name}</span>
                    <strong>₹{item.value.toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bottom-grid">
            <div className="panel transactions-panel">
              <div className="panel-heading">
                <div><h3>Recent transactions</h3><p>Your latest financial activity</p></div>
                <button className="text-button" onClick={() => setActive('Transactions')}>View all <ArrowUpRight size={15} /></button>
              </div>
              <div className="transaction-list">
                {transactions.slice(0, 5).map((item, index) => (
                  <div className="transaction-row" key={`${item.name}-${index}`}>
                    <div className={`transaction-icon ${item.color}`}><item.icon size={19} /></div>
                    <div className="transaction-details"><strong>{item.name}</strong><span>{item.category} · {item.date}</span></div>
                    <strong className={item.amount > 0 ? 'amount-positive' : 'amount-negative'}>
                      {item.amount > 0 ? '+' : '-'}₹{Math.abs(item.amount).toLocaleString('en-IN')}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel insight-panel">
              <div className="insight-heading"><div className="insight-symbol"><Sparkles size={19} /></div><span>SMART INSIGHTS</span><span className="beta-tag">BETA</span></div>
              <h3>Your spending snapshot</h3>
              <p>You've spent ₹11,700 across five categories in this sample overview. Shopping is currently your largest spending category.</p>
              <div className="insight-divider" />
              <div className="insight-tip"><TrendingDown size={17} /><span>Review recurring subscriptions to identify potential savings.</span></div>
              <button onClick={() => setActive('Analytics')}>Explore insights <ArrowUpRight size={15} /></button>
              <div className="insight-decoration"><Sparkles size={95} /></div>
            </div>
          </section>
          <footer>© 2026 Smart Spend AI <span>Built for smarter financial decisions.</span></footer>
        </div>
      </main>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <form className="transaction-modal" onSubmit={addTransaction} onClick={e => e.stopPropagation()}>
            <div className="modal-heading"><div><h3>New transaction</h3><p>Add an income or expense entry.</p></div><button type="button" onClick={() => setShowModal(false)}><X /></button></div>
            <label>Transaction name<input required placeholder="e.g. Groceries" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
            <label>Amount (₹)<input required type="number" min="1" placeholder="0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></label>
            <label>Type<select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="expense">Expense</option><option value="income">Income</option></select></label>
            {form.type === 'expense' && <label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option>Shopping</option><option>Food & Dining</option><option>Transport</option><option>Entertainment</option></select></label>}
            <button className="primary-button modal-submit" type="submit"><Plus size={17} /> Save transaction</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
