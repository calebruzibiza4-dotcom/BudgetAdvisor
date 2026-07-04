import React from 'react'
import { CATEGORIES } from '../constants'

function SetupPage({ currency, onBack, onAnalyze, budget, setBudget }) {
  const update = (key, val) => setBudget(prev => ({ ...prev, [key]: Number(val) }))
  const totalExpenses = CATEGORIES.reduce((s, c) => s + (Number(budget[c.key] || 0)), 0)
  const balance = Number(budget.income || 0) - totalExpenses

  return (
    <div>
      <div className="card">
        <button className="btn secondary" onClick={onBack}>← Back</button>
        <div className="setup-card-header">
          <div className="summary-label">Budget setup</div>
          <h3>Build your monthly spending plan</h3>
          <p className="summary-description">Enter your income and expenses to generate instant insights, savings guidance, and budget health recommendations.</p>
        </div>
        <div style={{ marginTop: 20 }}>
          <div className="input" style={{ maxWidth: 340 }}>
            <label>Monthly income</label>
            <input type="number" placeholder={`${currency.symbol}${currency.placeholder}`} value={budget.income || ''} onChange={e => update('income', e.target.value)} />
          </div>
        </div>

        <div className="setup-summary">
          <div>
            <strong>{currency.symbol}{Number(budget.income || 0).toLocaleString()}</strong>
            <span>Monthly income</span>
          </div>
          <div>
            <strong>{currency.symbol}{totalExpenses.toLocaleString()}</strong>
            <span>Total expenses</span>
          </div>
          <div>
            <strong>{currency.symbol}{balance.toLocaleString()}</strong>
            <span>{balance >= 0 ? 'Surplus' : 'Deficit'}</span>
          </div>
        </div>

        <h4 style={{ marginTop: 22, marginBottom: 14, color: 'var(--text-md)', fontWeight: 600, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Expenses</h4>
        <div className="inputs-grid">
          {CATEGORIES.map(cat => (
            <div key={cat.key} className="input">
              <label>{cat.icon} {cat.label}</label>
              <input type="number" value={budget[cat.key] || ''} onChange={e => update(cat.key, e.target.value)} />
            </div>
          ))}
        </div>

        <div className={`balance ${balance >= 0 ? 'positive' : 'negative'}`}>
          {balance >= 0 ? '✅' : '⚠️'} Balance: {currency.symbol}{balance.toLocaleString()}
        </div>

        <div style={{ marginTop: 18 }}>
          <button className="btn" disabled={!budget.income} onClick={() => onAnalyze({ totalExpenses, balance })}>
            Analyze my budget →
          </button>
        </div>
      </div>
    </div>
  )
}

export default SetupPage
