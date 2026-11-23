
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet, TrendingUp, TrendingDown, Activity, Plus,
  Trash2, AlertTriangle, ShieldCheck, Search, X,
  LayoutDashboard, Receipt, PieChart as PieIcon,
  Sparkles, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, PieChart, Pie, Cell
} from "recharts";

const initialTransactions = [
  { id: 1, name: "Grocery shopping", category: "Food", amount: 1250, type: "expense", date: "2026-11-20" },
  { id: 2, name: "Monthly salary", category: "Income", amount: 45000, type: "income", date: "2026-11-20" },
  { id: 3, name: "Fuel", category: "Transport", amount: 900, type: "expense", date: "2026-11-19" },
  { id: 4, name: "Restaurant", category: "Food", amount: 850, type: "expense", date: "2026-11-18" },
  { id: 5, name: "Electricity bill", category: "Bills", amount: 1800, type: "expense", date: "2026-11-17" },
  { id: 6, name: "Movie tickets", category: "Entertainment", amount: 600, type: "expense", date: "2026-11-16" },
  { id: 7, name: "Grocery shopping", category: "Food", amount: 1100, type: "expense", date: "2026-11-15" },
  { id: 8, name: "Fuel", category: "Transport", amount: 750, type: "expense", date: "2026-11-14" },
  { id: 9, name: "Restaurant", category: "Food", amount: 950, type: "expense", date: "2026-11-13" },
  { id: 10, name: "Shopping", category: "Shopping", amount: 2200, type: "expense", date: "2026-11-12" }
];

const COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#ec4899", "#22c55e", "#64748b"];

function detectAnomalies(transactions) {
  const expenses = transactions.filter(t => t.type === "expense");

  return expenses.map(transaction => {
    const previous = expenses.filter(
      t => t.category === transaction.category && t.id !== transaction.id
    );

    if (previous.length < 3) {
      return { ...transaction, unusual: false, reason: "Not enough category history", risk: 0 };
    }

    const amounts = previous.map(t => t.amount);
    const average = amounts.reduce((a, b) => a + b, 0) / amounts.length;

    const variance = amounts.reduce(
      (sum, amount) => sum + Math.pow(amount - average, 2), 0
    ) / amounts.length;

    const standardDeviation = Math.sqrt(variance);
    const threshold = Math.max(average * 1.8, average + 2 * standardDeviation);
    const unusual = transaction.amount > threshold;

    const ratio = average > 0 ? transaction.amount / average : 1;
    const risk = unusual ? Math.min(99, Math.round(55 + (ratio - 1.8) * 20)) : 0;

    return {
      ...transaction,
      unusual,
      risk,
      reason: unusual
        ? `This is ${ratio.toFixed(1)}× your average ${transaction.category} spending (₹${Math.round(average).toLocaleString("en-IN")}).`
        : "Within your usual spending range"
    };
  });
}

function StatCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <div className="stat-icon" style={{ color }}><Icon size={19} /></div>
      </div>
      <h2>{value}</h2>
      <p>{subtitle}</p>
    </motion.div>
  );
}

export default function App() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({
    name: "", category: "Food", amount: "", type: "expense", date: new Date().toISOString().slice(0, 10)
  });

  const analysed = useMemo(
    () => detectAnomalies(transactions),
    [transactions]
  );

  const alerts = analysed.filter(t => t.unusual);
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;

  const categoryData = Object.entries(
    transactions.filter(t => t.type === "expense").reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const chartData = [...transactions]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(t => ({
      date: new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      income: t.type === "income" ? t.amount : 0,
      expenses: t.type === "expense" ? t.amount : 0
    }));

  const visibleTransactions = analysed
    .filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
    .filter(t => filter === "all" || (filter === "unusual" ? t.unusual : t.type === filter))
    .sort((a, b) => b.date.localeCompare(a.date));

  function addTransaction(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.amount || Number(form.amount) <= 0) return;

    setTransactions(prev => [
      {
        ...form,
        id: Date.now(),
        amount: Number(form.amount)
      },
      ...prev
    ]);

    setForm({
      name: "", category: "Food", amount: "", type: "expense",
      date: new Date().toISOString().slice(0, 10)
    });
    setShowModal(false);
  }

  function deleteTransaction(id) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  const money = value => "₹" + value.toLocaleString("en-IN");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Wallet size={23} /></div>
          <div><strong>SmartSpend</strong><small>FINANCE INTELLIGENCE</small></div>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <div className="nav-item active"><LayoutDashboard size={18} /> Overview</div>
        <div className="nav-item"><Receipt size={18} /> Transactions</div>
        <div className="nav-item"><PieIcon size={18} /> Analytics</div>

        <div className="sidebar-bottom">
          <div className="security-box">
            <ShieldCheck size={20} />
            <strong>Spending monitor</strong>
            <small>Automatic transaction analysis is active.</small>
          </div>
          <small className="version">SMARTSPEND AI · V2.0</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">PERSONAL FINANCE</p>
            <h1>Financial Overview</h1>
            <p className="muted">Monitor your money. Understand your habits.</p>
          </div>
          <button className="primary-btn" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add transaction
          </button>
        </header>

        <section className="stats-grid">
          <StatCard title="Total balance" value={money(balance)} icon={Wallet} color="#a78bfa" subtitle="Income minus expenses" />
          <StatCard title="Total income" value={money(income)} icon={TrendingUp} color="#34d399" subtitle="Recorded income" />
          <StatCard title="Total expenses" value={money(expenses)} icon={TrendingDown} color="#fb7185" subtitle="Recorded expenses" />
          <StatCard title="Unusual transactions" value={alerts.length} icon={AlertTriangle} color="#fbbf24" subtitle="Detected by spending analysis" />
        </section>

        <section className="content-grid">
          <div className="panel chart-panel">
            <div className="panel-heading">
              <div><h3>Cash flow</h3><p>Recorded transaction activity</p></div>
              <Activity size={20} className="purple" />
            </div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#77758c" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#77758c" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#171625", border: "1px solid #343047", borderRadius: 10 }} />
                  <Area type="monotone" dataKey="income" stroke="#34d399" fill="url(#incomeGradient)" />
                  <Area type="monotone" dataKey="expenses" stroke="#8b5cf6" fill="url(#expenseGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel category-panel">
            <div className="panel-heading">
              <div><h3>Spending categories</h3><p>Where your money goes</p></div>
              <PieIcon size={20} className="purple" />
            </div>
            <div className="pie-wrap">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4}>
                      {categoryData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#171625", border: "1px solid #343047", borderRadius: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="muted">No expenses recorded yet.</p>}
            </div>
            <div className="legend">
              {categoryData.map((c, i) => (
                <div key={c.name}><span style={{ background: COLORS[i % COLORS.length] }} />{c.name}<strong>{money(c.value)}</strong></div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel alerts-panel">
          <div className="panel-heading">
            <div><h3><Sparkles size={18} className="purple" /> Unusual spending alerts</h3><p>Transactions compared against your category history</p></div>
            <span className="alert-count">{alerts.length} detected</span>
          </div>

          {alerts.length === 0 ? (
            <div className="empty-state"><ShieldCheck size={30} /><strong>No unusual transactions detected</strong><p>New transactions will be checked automatically when enough category history is available.</p></div>
          ) : alerts.map(t => (
            <div className="alert-row" key={t.id}>
              <div className="alert-symbol"><AlertTriangle size={20} /></div>
              <div className="alert-info"><strong>{t.name} · {money(t.amount)}</strong><p>{t.reason}</p></div>
              <span className="risk-score">Risk {t.risk}/99</span>
            </div>
          ))}
        </section>

        <section className="panel transactions-panel">
          <div className="panel-heading">
            <div><h3>Recent transactions</h3><p>Your recorded financial activity</p></div>
            <div className="search-box"><Search size={16} /><input placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          </div>

          <div className="filters">
            {["all", "income", "expense", "unusual"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={filter === f ? "filter active-filter" : "filter"}>
                {f === "all" ? "All" : f === "unusual" ? "Unusual" : f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="transaction-list">
            {visibleTransactions.map(t => (
              <div className="transaction-row" key={t.id}>
                <div className="transaction-icon">{t.type === "income" ? <ArrowDownRight /> : <ArrowUpRight />}</div>
                <div className="transaction-info"><strong>{t.name}</strong><small>{t.category} · {t.date}</small></div>
                {t.unusual && <span className="unusual-tag">UNUSUAL</span>}
                <strong className={t.type === "income" ? "income-text" : "expense-text"}>{t.type === "income" ? "+" : "-"}{money(t.amount)}</strong>
                <button className="delete-btn" onClick={() => deleteTransaction(t.id)} title="Delete transaction"><Trash2 size={16} /></button>
              </div>
            ))}
            {visibleTransactions.length === 0 && <p className="empty-message">No matching transactions.</p>}
          </div>
        </section>

        <footer>SmartSpend AI · Spending analysis is based on transactions entered in this browser session.</footer>
      </main>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="modal" onSubmit={addTransaction} onClick={e => e.stopPropagation()}>
            <div className="modal-heading"><div><h2>Add transaction</h2><p>Enter the details below</p></div><button type="button" className="close-btn" onClick={() => setShowModal(false)}><X /></button></div>
            <label>Description<input required placeholder="e.g. Grocery shopping" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
            <label>Amount (₹)<input required type="number" min="1" placeholder="Enter amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></label>
            <label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{["Food", "Transport", "Bills", "Entertainment", "Shopping", "Health", "Education", "Other", "Income"].map(c => <option key={c}>{c}</option>)}</select></label>
            <label>Transaction type<select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="expense">Expense</option><option value="income">Income</option></select></label>
            <label>Date<input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></label>
            <button className="primary-btn submit-btn" type="submit"><Plus size={18} /> Save transaction</button>
          </motion.form>
        </div>
      )}
    </div>
  );
}
