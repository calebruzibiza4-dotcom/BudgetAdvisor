import React from 'react'

function EnterPage({ onLogin, onSignup }) {
  return (
    <div className="content-page">
      <div className="page-card enter-card">
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 14 }}>Welcome back</h2>
        <p style={{ color: 'var(--text-md)', lineHeight: 1.75, maxWidth: 440, margin: '0 auto 8px' }}>Sign in or create an account to start building your personalized budget and financial plan.</p>
        <div className="enter-actions">
          <button className="btn hero-btn" onClick={onSignup}>Create account</button>
          <button className="btn secondary hero-btn" onClick={onLogin}>Log in</button>
        </div>
      </div>
    </div>
  )
}

export default EnterPage
