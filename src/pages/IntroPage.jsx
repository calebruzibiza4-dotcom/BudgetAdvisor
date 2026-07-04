import React from 'react'
import { CURRENCIES } from '../constants'

function IntroPage({ onStart, currency, setCurrency }) {
  return (
    <div className="card">
      <div className="app-header">
        <h1 className="app-title">Budget Advisor</h1>
        <div className="tagline">Your AI-powered personal finance consultant</div>
      </div>
      <div style={{ paddingTop: 20 }}>
        <h3 style={{ color: 'var(--text-md)', fontWeight: 600, marginBottom: 14, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Select currency</h3>
        <div className="currency-grid">
          {CURRENCIES.map(c => (
            <div key={c.code} className={`currency-cell ${currency.code === c.code ? 'selected' : ''}`} onClick={() => setCurrency(c)}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{c.symbol}</div>
              <div style={{ fontSize: 11, marginTop: 2, opacity: 0.75 }}>{c.code}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--text-sm)' }}>🔒 Your data stays on your device. Nothing is stored.</div>
          <button className="btn" onClick={onStart}>Get started →</button>
        </div>
      </div>
    </div>
  )
}

export default IntroPage
