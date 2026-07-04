import React from 'react'
import { CATEGORIES } from '../constants'

export default function BarChart({ breakdown, currencySymbol }) {
  const total = Object.values(breakdown).reduce((s, v) => s + Number(v || 0), 0)

  return (
    <div className="chart-card">
      {CATEGORIES.map(cat => {
        const value = Number(breakdown[cat.key] || 0)
        if (value <= 0) return null
        const pct = total ? Math.round((value / total) * 100) : 0
        return (
          <div className="chart-row" key={cat.key}>
            <div className="chart-left">
              <span className="cat-emoji">{cat.icon}</span>
              <span className="cat-name">{cat.label}</span>
            </div>
            <div className="chart-bar-wrap">
              <div className="chart-bar-bg">
                <div className="chart-bar-fill" style={{ width: `${pct}%`, background: cat.color }} />
              </div>
            </div>
            <div className="chart-right">
              <div className="cat-amount">{currencySymbol}{value.toLocaleString()}</div>
              <div className="cat-pct">{pct}%</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
